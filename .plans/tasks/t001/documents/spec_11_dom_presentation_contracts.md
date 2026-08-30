# SP8 — IndexedDB Persistence, Asset Lifecycle and Archive Formats

## 1. Persistence Scope

The application owns one IndexedDB database per origin:

```ts
export const DB_NAME = 'three-gallery-db';
export const DB_VERSION = 1;
export const STORE_META = 'meta';
export const STORE_GALLERIES = 'galleries';
export const STORE_ASSETS = 'assets';
export const CURRENT_GALLERY_KEY = 'current-gallery-id';
```

No LocalStorage is used for gallery state or binary content.

## 2. Records

```ts
interface MetaRecord {
  readonly key: string;
  readonly value: string;
}

interface GalleryRecord {
  readonly id: GalleryId;
  readonly schemaVersion: 1;
  readonly snapshot: GallerySnapshot;
  readonly updatedAt: string;
}

interface AssetRecord {
  readonly id: AssetId;
  readonly kind: AssetKind;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly blob: Blob;
  readonly createdAt: string;
}
```

Object stores:

| Store | keyPath | Indices | Purpose |
| --- | --- | --- | --- |
| `meta` | `key` | none | Current gallery id and future settings |
| `galleries` | `id` | `updatedAt` non-unique | Small root snapshots |
| `assets` | `id` | `kind` non-unique | Binary local assets |

## 3. Upgrade v1

`upgradeToV1(db, transaction)` executes only when oldVersion <1:

1. Create missing stores exactly once.
2. Create indices.
3. Do not seed gallery data inside upgrade transaction; `InitializeGallery` handles it after successful open.
4. Throw on partially conflicting schema rather than deleting user data.

`IndexedDbConnection.open()`:

- Caches one open promise.
- Rejects on `error` or `blocked` with `ApplicationError(PERSISTENCE_FAILED)`.
- On `versionchange`, closes connection and clears cache so another call can reopen.
- `close()` is idempotent and used only app shutdown/tests.

## 4. Transactional Commit

`IndexedDbGalleryStore.commit(input)` opens one `readwrite` transaction across all three stores.

Validation before transaction:

- Snapshot can restore into `Gallery`.
- Every put asset ref metadata equals its Blob size and declared kind.
- No duplicate put/delete ids.
- Put and delete sets are disjoint.
- Every local asset id in snapshot is either already stored or included in puts.
- Every delete id is absent from snapshot references.

Transaction operations in order:

1. Put each `AssetRecord` from `putAssets`, sorted by id.
2. Delete each `deleteAssetId`, sorted by id.
3. Put `GalleryRecord`.
4. Put current gallery meta record.
5. Await transaction complete.

A request failure aborts transaction. The Promise resolves only on `complete`, not on last request success.

## 5. Reads

- `loadCurrent` reads meta, then gallery record; missing meta returns null; dangling meta is a persistence error.
- Snapshot is `structuredClone`d before returning and restored/serialized through domain validation to prevent shared mutation.
- `readAsset` returns stored Blob or null.
- `readAssets` preserves requested ids in returned Map insertion order and omits missing ids.
- `hasAssets` returns every requested id mapped to boolean, using one readonly transaction.

## 6. Blob and Object URL Lifecycle

`ObjectUrlRegistry` internal structures:

```ts
interface RegistryEntry {
  readonly assetId: AssetId;
  readonly url: string;
  readonly blob: Blob;
  readonly scopes: Set<string>;
}
```

Methods:

```ts
public acquire(assetId: AssetId, blob: Blob, scopeId: string): string;
public release(assetId: AssetId, scopeId: string): void;
public releaseScope(scopeId: string): void;
public activeUrlCount(): number;
```

Rules:

- One active URL per local asset id, reused across scopes.
- `acquire` with same id but different Blob identity/size revokes old only after all old scopes release; implementation may version internal key to avoid breaking mounted consumers.
- URL is revoked when last scope leaves.
- Remote refs do not enter registry.
- Registry has a development-only count exposed to lifecycle tests.

`BrowserAssetUrlResolver.resolve`:

1. Validate remote protocol and return URL.
2. For local, read Blob; missing maps to `PERSISTENCE_FAILED`.
3. Acquire registry URL under caller scope.

## 7. Storage Quota

`BrowserStorageQuota.estimate()` adapts `navigator.storage.estimate()`:

- Unsupported or rejected call returns null fields, not failure.
- Usage ratio is `usage/quota` only when both finite and quota>0.
- Before a local asset commit, Editor may warn at projected ratio >=0.8.
- Commit remains authoritative; browser may still reject despite estimate.
- `QuotaExceededError` maps to `STORAGE_QUOTA_EXCEEDED` with requested bytes in context.

## 8. Archive Container

Both extensions are ZIP files with MIME `application/zip`.

### 8.1 Gallery archive

```text
manifest.json
payload/gallery.json
assets/{assetId}.{safeExtension}
```

### 8.2 Room archive

```text
manifest.json
payload/room.json
assets/{assetId}.{safeExtension}
```

No directory entry is required. Paths are UTF-8, forward-slash separated and lowercase except payload content.

## 9. Manifest Contract

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
  readonly sha256: string; // 64 lowercase hex chars
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

`room.json` is a `GalleryRoomSnapshot`. `gallery.json` is a `GallerySnapshot`.

## 10. Archive Serialization

`FflateGalleryArchive` uses asynchronous callback APIs to avoid a single synchronous compression call for large content.

Export algorithm:

1. Validate snapshot/room through domain restore.
2. Sort local assets by id.
3. Verify each archive Blob metadata against LocalAssetRef.
4. Compute SHA-256 over raw Blob bytes.
5. Derive safe extension from validated original extension or MIME fallback.
6. Build manifest.
7. Encode JSON with `TextEncoder`, two-space indentation and trailing newline.
8. Add asset Uint8Arrays.
9. Compress JSON at level 6; already compressed images/audio at level 0 or 1; OBJ at level 6.
10. Return ZIP Blob.

No export mutation or IndexedDB write occurs.

## 11. Room Archive Import

`readRoomArchive` performs all validation before returning package:

1. Reject compressed file >250 MiB.
2. Unzip into memory with aggregate uncompressed limit 500 MiB.
3. Validate every entry path before content use.
4. Require exactly one manifest and expected payload.
5. Parse manifest as unknown and validate field-by-field.
6. Require format/version/kind room.
7. Reject duplicate asset ids or paths.
8. Parse room JSON as unknown, restore `GalleryRoom`, then snapshot again.
9. Collect local refs and require exact one-to-one match with manifest asset ids.
10. For each asset: require path exists, byte length matches, max per kind passes and SHA-256 matches.
11. Return old snapshot and Blobs; do not remap ids here.

## 12. ZIP Path Security

A path is valid only when:

- non-empty;
- uses `/`, not `\`;
- does not start `/`;
- does not contain drive prefix `C:` or URL scheme;
- split components contain neither `.` nor `..` nor empty components;
- normalized path equals original;
- no NUL/control chars;
- max path length 255 code points;
- path belongs to whitelist: manifest, expected payload or `assets/<safe-name>`.

Unknown extra entries reject archive; they are not ignored.

## 13. JSON Validation

No `JSON.parse(...) as Type` assertion is allowed. `ArchiveValidator` exposes:

```ts
public parseManifest(value: unknown): ArchiveManifest;
public parseRoomSnapshot(value: unknown): GalleryRoomSnapshot;
public parseGallerySnapshot(value: unknown): GallerySnapshot;
```

It composes narrow guards and domain constructors. Unknown fields may be rejected to keep v1 deterministic. Future versions require explicit migration, not permissive parsing.

## 14. SHA-256

`Sha256ChecksumService`:

```ts
public digest(blob: Blob): Promise<string>;
public verify(blob: Blob, expectedHex: string): Promise<boolean>;
```

- Uses `crypto.subtle.digest('SHA-256', await blob.arrayBuffer())`.
- Lowercase hex, fixed length 64.
- For assets near limit, arrayBuffer memory is accepted by v1 limits; streaming digest is future work.

## 15. Id Remapping During Import

Archive adapter returns original ids. `ImportRoom` owns remap because id generation is an application policy.

Mapping sets:

```text
old room id      -> new room id
old picture id   -> new picture id
old local asset  -> new local asset id
```

Every AssetRecord Blob remains byte-identical. New LocalAssetRef copies kind/fileName/MIME/byteLength with new id. Remote URLs remain unchanged.

No old id appears in committed imported snapshot or asset store.

## 16. Name Collision Policy

Normalize names case-insensitively after whitespace collapse.

```text
Original unique            -> Original
Original collides          -> Original (importado 2)
Second imported collision  -> Original (importado 3)
```

Choose first integer >=2 not already used. Names remain <=120; truncate base before suffix when needed.

## 17. Browser Download

`FileDownloadPort`:

```ts
export interface FileDownloadPort {
  download(blob: Blob, fileName: string): Promise<void>;
}
```

Implementation:

1. Create temporary URL.
2. Create hidden `<a download>` with safe basename.
3. Append, click, remove.
4. Revoke URL in a zero-delay task after dispatch, not before.
5. Resolve after dispatch; browser download completion is not observable.

## 18. Data Integrity and Recovery

- If load finds invalid snapshot, application shows persistence error and does not overwrite automatically.
- No silent reset to default on corruption.
- User may clear site data manually; a future recovery UI is out of scope.
- Export should be encouraged as backup but does not imply in-app full-gallery import.
- IndexedDB data is origin-scoped; changing domain/protocol/port creates another storage namespace.

## 19. Archive Versioning

Version 1 supports only exact current snapshots.

Future policy:

- `version > supported`: reject `ARCHIVE_UNSUPPORTED_VERSION`.
- `version < current`: require a named archive migration; none exists in v1.
- Domain `schemaVersion` and archive `version` are independent and both validated.

## 20. Tests Required by This Spec

- Transaction rollback on forced asset put error.
- Ref-shared asset not deleted when one consumer disappears.
- Object URL count returns to baseline after scope release.
- Room round-trip preserves bytes/checksums/order.
- Corrupt checksum, missing asset, extra asset, path traversal, duplicate id, unknown field and oversized content reject without commit.
- Remote refs create no archive asset entry.
