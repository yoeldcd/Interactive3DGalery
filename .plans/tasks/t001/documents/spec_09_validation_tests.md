# SP10 — Infrastructure and Bootstrap Symbol Contracts

This document is normative for every concrete adapter and composition symbol. Behavioral rules remain in SP2, SP3 and SP8; this specification removes ambiguity from constructor parameters, public methods, return values and ownership.

## 1. Browser Adapters

### 1.1 `src/infrastructure/browser/CryptoIdGenerator.ts`

```ts
export class CryptoIdGenerator implements IdGenerator {
  public galleryId(): GalleryId;
  public roomId(): RoomId;
  public pictureId(): PictureId;
  public assetId(): AssetId;
}
```

Each method calls `crypto.randomUUID()` exactly once and converts through the matching branded-id constructor. It keeps no mutable state.

### 1.2 `src/infrastructure/browser/SystemClock.ts`

```ts
export class SystemClock implements Clock {
  public nowIso(): string;
  public fileTimestamp(): string;
}
```

- `nowIso()` returns `new Date().toISOString()`.
- `fileTimestamp()` returns local time as `YYYYMMDD-HHmm`, zero padded and filesystem-safe.
- A single method call samples the clock once; it does not call `new Date()` separately per field.

### 1.3 `src/infrastructure/browser/BrowserImageMetadataReader.ts`

```ts
export class BrowserImageMetadataReader implements ImageMetadataReader {
  public readLocal(blob: Blob): Promise<ImageSize>;
  public readRemote(url: string): Promise<ImageSize>;

  private readUrl(url: string, revokeAfterRead: boolean): Promise<ImageSize>;
}
```

`readLocal` creates a temporary object URL, passes it to `readUrl`, and revokes it in `finally`. `readRemote` first validates an absolute `http/https` URL, assigns `crossOrigin = 'anonymous'` before `src`, and maps load/decode failure to `ApplicationError('ASSET_DECODE_FAILED')` or `REMOTE_ASSET_UNAVAILABLE` as applicable. The implementation reads `naturalWidth/naturalHeight` and validates through `createImageSize`.

### 1.4 `src/infrastructure/browser/BrowserStorageQuota.ts`

```ts
export class BrowserStorageQuota implements StorageQuotaPort {
  public estimate(): Promise<StorageEstimate>;
}
```

The method never throws for an unsupported/rejected `navigator.storage.estimate()`. It returns `{ usage: null, quota: null, usageRatio: null }` instead. A finite ratio is returned only when quota is greater than zero.

### 1.5 `src/infrastructure/browser/BrowserDownloadService.ts`

```ts
export class BrowserDownloadService implements FileDownloadPort {
  public download(blob: Blob, fileName: string): Promise<void>;
}
```

The method validates a safe basename, creates one temporary URL and hidden anchor, dispatches one click, removes the anchor synchronously and revokes the URL in `setTimeout(..., 0)`. It owns no persistent URL registry entry.

### 1.6 `src/infrastructure/browser/ObjectUrlRegistry.ts`

```ts
export type ObjectUrlScope = string & { readonly __brand: 'ObjectUrlScope' };

export class ObjectUrlRegistry {
  public acquire(assetId: AssetId, blob: Blob, scopeId: string): string;
  public release(assetId: AssetId, scopeId: string): void;
  public releaseScope(scopeId: string): void;
  public activeUrlCount(): number;
  public activeScopeCount(): number;
  public dispose(): void;
}
```

Private state is exactly:

```ts
interface RegistryEntry {
  readonly assetId: AssetId;
  readonly blob: Blob;
  readonly url: string;
  readonly scopes: Set<string>;
}

private readonly entriesByAssetId: Map<AssetId, RegistryEntry[]>;
private disposed: boolean;
```

A second Blob under the same asset id may coexist as a versioned entry until the old scopes release. `dispose()` revokes every URL, clears maps and is idempotent. Calls after disposal throw `ApplicationError('PERSISTENCE_FAILED')` rather than recreate ownership silently.

### 1.7 `src/infrastructure/browser/BrowserAssetUrlResolver.ts`

```ts
export class BrowserAssetUrlResolver implements AssetUrlResolver {
  public constructor(
    private readonly store: GalleryStore,
    private readonly registry: ObjectUrlRegistry,
  );

  public resolve(ref: AssetRef, scopeId: string): Promise<string>;
  public releaseScope(scopeId: string): void;
}
```

Remote refs return the validated URL. Local refs call `store.readAsset`, fail with `ApplicationError('PERSISTENCE_FAILED')` and `assetId` context when missing, then call `registry.acquire`.

## 2. IndexedDB Contracts

### 2.1 `src/infrastructure/persistence/indexeddb/IndexedDbConstants.ts`

```ts
export const DB_NAME = 'three-gallery-db';
export const DB_VERSION = 1;
export const STORE_META = 'meta';
export const STORE_GALLERIES = 'galleries';
export const STORE_ASSETS = 'assets';
export const CURRENT_GALLERY_KEY = 'current-gallery-id';
```

These literals are imported from this file only; no adapter duplicates them.

### 2.2 `src/infrastructure/persistence/indexeddb/IndexedDbRecords.ts`

```ts
export interface MetaRecord {
  readonly key: string;
  readonly value: string;
}

export interface GalleryRecord {
  readonly id: GalleryId;
  readonly schemaVersion: 1;
  readonly snapshot: GallerySnapshot;
  readonly updatedAt: string;
}

export interface AssetRecord {
  readonly id: AssetId;
  readonly kind: AssetKind;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly blob: Blob;
  readonly createdAt: string;
}
```

### 2.3 `src/infrastructure/persistence/indexeddb/IndexedDbV1Migration.ts`

```ts
export function upgradeToV1(input: {
  readonly database: IDBDatabase;
  readonly transaction: IDBTransaction;
  readonly oldVersion: number;
}): void;
```

It creates only stores/indices absent because `oldVersion < 1`; a conflicting existing store/index definition throws and aborts upgrade. It never deletes or seeds records.

### 2.4 `src/infrastructure/persistence/indexeddb/IndexedDbConnection.ts`

```ts
export class IndexedDbConnection {
  private openPromise: Promise<IDBDatabase> | null;
  private database: IDBDatabase | null;

  public constructor(private readonly factory: IDBFactory);
  public open(): Promise<IDBDatabase>;
  public close(): void;

  private openFresh(): Promise<IDBDatabase>;
  private resetConnection(database?: IDBDatabase): void;
}
```

`open()` returns one shared in-flight/resolved promise. `blocked`, `error`, failed upgrade and version conflict map to `PERSISTENCE_FAILED`. `versionchange` closes only the matching cached database and clears both fields.

### 2.5 `src/infrastructure/persistence/indexeddb/IndexedDbGalleryStore.ts`

```ts
export class IndexedDbGalleryStore implements GalleryStore {
  public constructor(
    private readonly connection: IndexedDbConnection,
    private readonly clock: Clock,
    private readonly collector: GalleryAssetReferenceCollector,
  );

  public loadCurrent(): Promise<GallerySnapshot | null>;
  public commit(input: GalleryCommit): Promise<void>;
  public readAsset(id: AssetId): Promise<Blob | null>;
  public readAssets(ids: readonly AssetId[]): Promise<ReadonlyMap<AssetId, Blob>>;
  public hasAssets(ids: readonly AssetId[]): Promise<ReadonlyMap<AssetId, boolean>>;

  private validateCommit(input: GalleryCommit): Promise<void>;
  private transactionDone(transaction: IDBTransaction): Promise<void>;
  private requestResult<T>(request: IDBRequest<T>): Promise<T>;
}
```

Public methods map DOM exceptions to typed application errors. `validateCommit` restores the snapshot, validates put metadata and proves all referenced local assets will exist after the transaction. `commit` resolves only from transaction `complete`.

## 3. Archive Contracts

### 3.1 `src/infrastructure/archive/ArchiveManifest.ts`

```ts
export type ArchiveKind = 'gallery' | 'room';
export const ARCHIVE_FORMAT_VERSION = 1 as const;

export interface ArchiveAssetManifestEntry {
  readonly id: AssetId;
  readonly kind: AssetKind;
  readonly path: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly sha256: string;
}

export interface ArchiveManifest {
  readonly format: 'three-gallery-archive';
  readonly version: 1;
  readonly kind: ArchiveKind;
  readonly exportedAt: string;
  readonly sourceGalleryId: GalleryId;
  readonly payloadPath: 'payload/gallery.json' | 'payload/room.json';
  readonly assets: readonly ArchiveAssetManifestEntry[];
}
```

### 3.2 `src/infrastructure/archive/ArchiveValidator.ts`

```ts
export class ArchiveValidator {
  public constructor(private readonly assetPolicy: AssetPolicy);

  public parseManifest(value: unknown): ArchiveManifest;
  public parseRoomSnapshot(value: unknown): GalleryRoomSnapshot;
  public parseGallerySnapshot(value: unknown): GallerySnapshot;
  public validateEntryPath(path: string): string;
  public validateEntrySet(input: {
    readonly manifest: ArchiveManifest;
    readonly entryPaths: readonly string[];
  }): void;
  public validateAssetEntry(input: {
    readonly manifestEntry: ArchiveAssetManifestEntry;
    readonly blob: Blob;
  }): void;
}
```

All methods either return validated canonical data or throw `ApplicationError('ARCHIVE_INVALID')`; unsupported version has its dedicated code. No method mutates the input object.

### 3.3 `src/infrastructure/archive/Sha256ChecksumService.ts`

```ts
export class Sha256ChecksumService {
  public digest(blob: Blob): Promise<string>;
  public verify(blob: Blob, expectedHex: string): Promise<boolean>;
}
```

`verify` first validates exactly 64 lowercase/uppercase hex characters, canonicalizes to lowercase, calculates once and compares without truncation.

### 3.4 `src/infrastructure/archive/FflateGalleryArchive.ts`

```ts
export class FflateGalleryArchive implements GalleryArchivePort {
  public constructor(
    private readonly validator: ArchiveValidator,
    private readonly checksum: Sha256ChecksumService,
  );

  public createGalleryArchive(input: {
    snapshot: GallerySnapshot;
    assets: readonly ArchiveAsset[];
    exportedAt: string;
  }): Promise<Blob>;

  public createRoomArchive(input: {
    galleryId: GalleryId;
    room: GalleryRoomSnapshot;
    assets: readonly ArchiveAsset[];
    exportedAt: string;
  }): Promise<Blob>;

  public readRoomArchive(archive: Blob): Promise<ImportedRoomPackage>;

  private createArchive(input: {
    readonly kind: ArchiveKind;
    readonly sourceGalleryId: GalleryId;
    readonly payload: GallerySnapshot | GalleryRoomSnapshot;
    readonly assets: readonly ArchiveAsset[];
    readonly exportedAt: string;
  }): Promise<Blob>;
}
```

`createArchive` owns deterministic manifest/path generation and compression-level selection. `readRoomArchive` owns aggregate compressed/uncompressed limits and returns only after all checksums pass. Callback errors from fflate are converted once to `ARCHIVE_INVALID`.

## 4. Bootstrap Contracts

### 4.1 `src/bootstrap/ApplicationContainer.ts`

```ts
export interface ApplicationUseCases {
  readonly initializeGallery: InitializeGallery;
  readonly getGallery: GetGallery;
  readonly renameGallery: RenameGallery;
  readonly createRoom: CreateRoom;
  readonly deleteRoom: DeleteRoom;
  readonly resetRoom: ResetRoom;
  readonly updateRoomConfiguration: UpdateRoomConfiguration;
  readonly addPicture: AddPicture;
  readonly updatePicture: UpdatePicture;
  readonly deletePicture: DeletePicture;
  readonly importRoom: ImportRoom;
  readonly exportRoom: ExportRoom;
  readonly exportGallery: ExportGallery;
  readonly checkSpectatorReadiness: CheckSpectatorReadiness;
}

export class ApplicationContainer {
  public readonly useCases: ApplicationUseCases;
  public readonly galleryStore: GalleryStore;
  public readonly assetUrlResolver: AssetUrlResolver;
  public readonly fileDownload: FileDownloadPort;
  public readonly storageQuota: StorageQuotaPort;

  public constructor(input: {
    readonly useCases: ApplicationUseCases;
    readonly galleryStore: GalleryStore;
    readonly assetUrlResolver: AssetUrlResolver;
    readonly fileDownload: FileDownloadPort;
    readonly storageQuota: StorageQuotaPort;
    readonly connection: IndexedDbConnection;
    readonly objectUrls: ObjectUrlRegistry;
  });

  public dispose(): void;
}
```

The constructor freezes `useCases` and stores only shared resources that presentation legitimately needs. `dispose()` closes IndexedDB and disposes object URLs; use cases/adapters have no independent global lifecycle.

### 4.2 `src/bootstrap/createApplicationContainer.ts`

```ts
export function createApplicationContainer(): ApplicationContainer;
```

Construction order is exact:

1. `CryptoIdGenerator`, `SystemClock`, domain collector/readiness policy.
2. `IndexedDbConnection(window.indexedDB)` and `IndexedDbGalleryStore`.
3. Browser metadata/quota/download/object URL/asset URL adapters.
4. `AssetPolicy`, `ArchiveValidator`, checksum and `FflateGalleryArchive`.
5. Application services.
6. Every use case once.
7. `ApplicationContainer`.

No lazy service locator, mutable registration or optional production dependency exists.

### 4.3 `src/bootstrap/bootstrapApplication.ts`

```ts
export interface BootstrapHandle {
  dispose(): void;
}

export async function bootstrapApplication(host: HTMLElement): Promise<BootstrapHandle>;
```

S1 implements the same signature with a minimal static placeholder and no application imports. S5 replaces only the function body with real composition. Later steps add route factories without changing the signature.

Final execution order:

1. Assert host is connected and empty it.
2. Create container.
3. Execute `initializeGallery` before mounting routes.
4. Create modal/toast hosts, router, screen factories and `AppShell`.
5. Start router/shell.
6. Return one idempotent handle that disposes shell, router, services and container in reverse ownership order.
7. On bootstrap failure, dispose any created resource and render one accessible fatal error with a reload action.

### 4.4 `src/main.ts`

```ts
export function main(): void;
```

`main()` imports the three global CSS files, obtains `#app`, throws a descriptive error when absent, calls `bootstrapApplication(app)` and reports an uncaught bootstrap rejection through a static fallback. It contains no dependency construction or route logic.

## 5. Test Support Contract

### 5.1 `tests/setup/reset-browser-mocks.ts`

```ts
export function resetBrowserMocks(): void;
```

The helper restores spies, fake timers, `URL.createObjectURL/revokeObjectURL`, storage estimates, pointer lock, ResizeObserver and AudioContext replacements. Vitest invokes it from `afterEach`; it never resets production IndexedDB records unless the test explicitly requests that action.
