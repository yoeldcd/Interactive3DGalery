# SP11 — DOM Presentation Symbol Contracts

This document is normative for every non-Three.js presentation symbol. SP5 and SP6 define behavior and visual semantics; this specification fixes constructors, public methods, parameters, return types, owned state and composition boundaries. A component never imports infrastructure classes directly: it receives application ports, `EditorStore`, presentation services or callbacks through its constructor.

## 1. Core Lifecycle and DOM Helpers

### 1.1 `src/presentation/core/DisposableBag.ts`

```ts
export interface Disposable {
  dispose(): void;
}

export class DisposableBag implements Disposable {
  private readonly entries: Array<Disposable | (() => void)>;
  private disposed: boolean;

  public add<T extends Disposable>(value: T): T;
  public addCallback(callback: () => void): void;
  public dispose(): void;
}
```

`add` and `addCallback` throw after disposal. `dispose()` executes entries once in reverse registration order, continues after an individual failure, clears the array and is idempotent.

### 1.2 `src/presentation/core/Component.ts`

```ts
export interface MountableComponent extends Disposable {
  mount(host: HTMLElement): void;
}

export abstract class Component implements MountableComponent {
  protected host: HTMLElement | null;
  protected readonly events: AbortController;
  protected readonly disposables: DisposableBag;
  private mounted: boolean;
  private disposed: boolean;

  public mount(host: HTMLElement): void;
  protected abstract render(host: HTMLElement): void;
  protected rerender(): void;
  protected onMounted(): void;
  public dispose(): void;
}
```

A component mounts exactly once. `mount` rejects a disconnected or non-empty host only when the concrete component declares exclusive ownership. `rerender` clears only the owned host and never replaces the host node. `dispose` aborts listeners, disposes children, clears owned DOM and is idempotent.

### 1.3 `src/presentation/core/DomFactory.ts`

```ts
export function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: {
    readonly className?: string;
    readonly text?: string;
    readonly attributes?: Readonly<Record<string, string>>;
    readonly data?: Readonly<Record<string, string>>;
  },
): HTMLElementTagNameMap[K];

export function button(options: {
  readonly text?: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly disabled?: boolean;
  readonly onClick?: (event: MouseEvent) => void;
}): HTMLButtonElement;

export function input(options: {
  readonly type: string;
  readonly name: string;
  readonly value?: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly maxLength?: number;
  readonly accept?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
}): HTMLInputElement;

export function clearElement(host: Element): void;
```

All text is assigned through `textContent`. Attribute names beginning with `on`, `style`, or `srcdoc` are rejected. No helper accepts raw HTML.

### 1.4 `src/presentation/core/TypedEvent.ts`

```ts
export class TypedEventEmitter<TEvents extends Record<string, unknown>> {
  private readonly listeners: Map<keyof TEvents, Set<(payload: never) => void>>;
  private disposed: boolean;

  public subscribe<K extends keyof TEvents>(
    event: K,
    listener: (payload: TEvents[K]) => void,
  ): () => void;

  public emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;
  public clear(): void;
}
```

`emit` iterates over a stable listener copy so subscribe/unsubscribe during delivery affects only later emissions. `clear` makes future emissions no-ops and unsubscribe callbacks remain idempotent.

## 2. Routes and Application Shell

### 2.1 `src/presentation/app/AppRoute.ts`

```ts
export type AppRoute =
  | { readonly name: 'start' }
  | { readonly name: 'editor' }
  | { readonly name: 'spectator' };

export function parseRoute(hash: string): AppRoute;
export function routeToHash(route: AppRoute): '#/' | '#/editor' | '#/spectator';
```

Unknown, malformed or parameterized hashes normalize to `{ name: 'start' }`. The route contains no snapshot, Blob or service instance.

### 2.2 `src/presentation/app/HashRouter.ts`

```ts
export class HashRouter implements Disposable {
  private currentRoute: AppRoute;
  private readonly listeners: Set<(route: AppRoute) => void>;
  private started: boolean;

  public constructor(
    private readonly windowRef: Window,
  );

  public start(): void;
  public current(): AppRoute;
  public navigate(route: AppRoute, options?: { readonly replace?: boolean }): void;
  public subscribe(listener: (route: AppRoute) => void): () => void;
  public dispose(): void;
}
```

`start` registers exactly one `hashchange` listener and immediately normalizes/emits the current route. `navigate` uses `location.hash` or `history.replaceState`; equal routes do not emit twice.

### 2.3 `src/presentation/app/AppShell.ts`

```ts
export interface SpectatorActivationToken {
  readonly createdAt: number;
  readonly originatedFromUserGesture: true;
}

export interface ScreenFactory {
  createStart(input: {
    readonly onOpenEditor: () => void;
    readonly onOpenSpectator: (input: {
      readonly gallery: GallerySnapshot;
      readonly activationToken: SpectatorActivationToken;
    }) => void;
  }): MountableComponent;

  createEditor(input: { readonly onExit: () => void }): MountableComponent;

  createSpectator(input: {
    readonly gallery: GallerySnapshot;
    readonly activationToken: SpectatorActivationToken;
    readonly onExit: () => void;
  }): MountableComponent;
}

export class AppShell implements Disposable {
  private activeScreen: MountableComponent | null;
  private spectatorContext: {
    readonly gallery: GallerySnapshot;
    readonly activationToken: SpectatorActivationToken;
  } | null;
  private unsubscribeRouter: (() => void) | null;
  private disposed: boolean;

  public constructor(
    private readonly host: HTMLElement,
    private readonly router: HashRouter,
    private readonly screens: ScreenFactory,
  );

  public start(): void;
  public openStart(): void;
  public openEditor(): void;
  public openSpectator(input: {
    readonly gallery: GallerySnapshot;
    readonly activationToken: SpectatorActivationToken;
  }): void;
  public dispose(): void;

  private renderRoute(route: AppRoute): void;
  private replaceScreen(screen: MountableComponent): void;
}
```

A spectator hash without the one-shot `spectatorContext` redirects to Home. Context is consumed when the spectator screen is created and is never serialized. Replacing a screen disposes the previous screen before clearing/mounting the next one.

## 3. Editor State and Store

### 3.1 `src/presentation/state/EditorState.ts`

```ts
export interface UiError {
  readonly code: string;
  readonly message: string;
  readonly field: string | null;
}

export interface EditorState {
  readonly status: 'idle' | 'loading' | 'ready' | 'mutating' | 'failed';
  readonly gallery: GallerySnapshot | null;
  readonly selectedRoomId: RoomId | null;
  readonly operation: string | null;
  readonly error: UiError | null;
}

export function initialEditorState(): EditorState;
```

The initial value is `{ status: 'idle', gallery: null, selectedRoomId: null, operation: null, error: null }`. Every published state object is newly allocated and frozen in development.

### 3.2 `src/presentation/state/EditorStore.ts`

```ts
export interface EditorStoreEvents {
  readonly changed: EditorState;
}

export class EditorStore implements Disposable {
  private stateValue: EditorState;
  private readonly emitter: TypedEventEmitter<EditorStoreEvents>;
  private mutationTail: Promise<void>;
  private disposed: boolean;

  public constructor(
    private readonly useCases: ApplicationUseCases,
    private readonly storageQuota: StorageQuotaPort,
  );

  public state(): EditorState;
  public subscribe(listener: (state: EditorState) => void): () => void;
  public initialize(): Promise<GallerySnapshot>;
  public refresh(): Promise<GallerySnapshot>;
  public selectRoom(roomId: RoomId | null): void;
  public selectedRoom(): GalleryRoomSnapshot | null;
  public roomById(roomId: RoomId): GalleryRoomSnapshot | null;
  public canUseRoomActions(): boolean;
  public isMutating(): boolean;

  public renameGallery(command: RenameGalleryCommand): Promise<GallerySnapshot>;
  public createRoom(command?: CreateRoomCommand): Promise<RoomId>;
  public deleteRoom(command: RoomIdCommand): Promise<GallerySnapshot>;
  public resetRoom(command: RoomIdCommand): Promise<GallerySnapshot>;
  public updateRoomConfiguration(
    command: UpdateRoomConfigurationCommand,
  ): Promise<GallerySnapshot>;
  public addPicture(command: AddPictureCommand): Promise<GallerySnapshot>;
  public updatePicture(command: UpdatePictureCommand): Promise<GallerySnapshot>;
  public deletePicture(command: DeletePictureCommand): Promise<GallerySnapshot>;
  public importRoom(command: ImportRoomCommand): Promise<RoomId>;
  public exportRoom(command: RoomIdCommand): Promise<ExportArtifact>;
  public exportGallery(): Promise<ExportArtifact>;
  public checkSpectatorReadiness(): Promise<SpectatorReadinessReport>;
  public estimateStorage(): Promise<StorageEstimate>;
  public dispose(): void;

  private enqueueMutation<T>(
    operation: string,
    execute: () => Promise<T>,
    project: (result: T) => GallerySnapshot,
  ): Promise<T>;
  private publish(next: EditorState): void;
  private normalizeError(error: unknown): UiError;
}
```

Mutations execute through one FIFO promise tail. The visible snapshot changes only after a use case resolves. A rejection restores status `ready` when a prior gallery exists, publishes a safe `UiError`, preserves selection when still valid and rethrows for modal-local rendering. Read-only exports/readiness do not enter the mutation queue. `createRoom` and `importRoom` select the returned id; `deleteRoom` selects the same surviving index, then previous, then `null`.

## 4. Presentation Services

### 4.1 `src/presentation/services/ModalService.ts`

```ts
export interface ModalRequest<T> {
  readonly opener?: HTMLElement | null;
  readonly create: (controls: {
    readonly resolve: (value: T) => void;
    readonly cancel: () => void;
  }) => MountableComponent;
}

export class ModalService implements Disposable {
  private readonly stack: Array<{
    readonly component: MountableComponent;
    readonly opener: HTMLElement | null;
    readonly settle: (value: unknown) => void;
  }>;
  private disposed: boolean;

  public constructor(
    private readonly host: HTMLElement,
    private readonly background: HTMLElement,
  );

  public open<T>(request: ModalRequest<T>): Promise<T | null>;
  public confirm(options: ConfirmDialogOptions): Promise<boolean>;
  public hasOpenModal(): boolean;
  public closeTopAsCancelled(): void;
  public dispose(): void;
}
```

Only one content modal plus one confirmation dialog may be stacked. `open` beyond that depth rejects. While the stack is non-empty, `background.inert=true`. Closing disposes the top component, restores focus when possible and resolves exactly once.

### 4.2 `src/presentation/services/ToastService.ts`

```ts
export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  readonly id: string;
  readonly kind: ToastKind;
  readonly text: string;
  readonly durationMs: number | null;
}

export class ToastService implements Disposable {
  private readonly messages: ToastMessage[];
  private readonly listeners: Set<(messages: readonly ToastMessage[]) => void>;
  private sequence: number;
  private disposed: boolean;

  public show(input: {
    readonly kind: ToastKind;
    readonly text: string;
    readonly durationMs?: number | null;
  }): string;
  public dismiss(id: string): void;
  public current(): readonly ToastMessage[];
  public subscribe(listener: (messages: readonly ToastMessage[]) => void): () => void;
  public clear(): void;
  public dispose(): void;
}
```

Default duration is `4500 ms` for success/info, `7000 ms` for warning and persistent for error. Timer callbacks call `dismiss`; they are cancelled on disposal.

## 5. Shared Components

### 5.1 `src/presentation/components/common/UiText.ts`

```ts
export const UI_TEXT = {
  start: {
    spectator: 'ESPECTADOR',
    administrator: 'ADMINISTRADOR',
  },
  gallery: {
    roomList: 'Lista de Salones',
    createRoom: 'CREAR SALÓN',
    importRoom: 'IMPORTAR SALÓN',
    exportGallery: 'EXPORTAR GALERÍA',
  },
  room: {
    addPicture: 'AGREGAR IMAGEN',
    configure: 'CONFIGURAR SALA',
    exportRoom: 'EXPORTAR SALA',
  },
  actions: {
    save: 'GUARDAR',
    delete: 'ELIMINAR',
    reset: 'RESETEAR',
    cancel: 'CANCELAR',
    yes: 'SÍ',
    no: 'NO',
    back: 'VOLVER',
    backHome: 'VOLVER AL INICIO',
    reloadScene: 'RECARGAR ESCENA',
    enableSound: 'ACTIVAR SONIDO',
  },
  fields: {
    name: 'Nombre',
    description: 'Descripción',
    frameColor: 'Color del marco',
    imageSource: 'Fuente de imagen',
    link: 'Enlace',
    linkLabel: 'Texto del enlace',
    roomTitle: 'Título de sala',
    wallSurface: 'Superficie de paredes',
    lightColor: 'Color de iluminación',
    ambientIntensity: 'Intensidad ambiental',
    spotlightIntensity: 'Intensidad del foco',
    backgroundSound: 'Sonido de fondo',
    volume: 'Volumen',
    centralObject: 'Objeto central',
    objectScale: 'Escala del objeto',
  },
} as const;
```

Visible labels and `aria-label` values import these literals; components do not repeat them.

### 5.2 `src/presentation/components/common/icons.ts`

```ts
export type IconName =
  | 'plus-room'
  | 'import'
  | 'download'
  | 'image'
  | 'settings'
  | 'warning'
  | 'save'
  | 'delete'
  | 'reset'
  | 'close'
  | 'external-link'
  | 'sound'
  | 'room-ready'
  | 'room-incomplete';

export function createIcon(name: IconName, title?: string): SVGSVGElement;
```

The function builds SVG nodes with `createElementNS`; decorative icons set `aria-hidden=true`, while a supplied title creates `<title>` and `role=img`.

### 5.3 `src/presentation/components/common/IconButton.ts`

```ts
export interface IconButtonOptions {
  readonly icon: IconName;
  readonly label: string;
  readonly visibleLabel?: boolean;
  readonly disabled?: boolean;
  readonly tone?: 'default' | 'danger';
  readonly onClick: (event: MouseEvent) => void;
}

export function createIconButton(options: IconButtonOptions): HTMLButtonElement;
```

The returned button is `type=button`, always has `aria-label`, and renders a delayed CSS tooltip through `data-tooltip`; no JS timer is required for the tooltip.

### 5.4 `src/presentation/components/common/ModalFrame.ts`

```ts
export interface ModalFrameOptions {
  readonly title: string;
  readonly describedById?: string;
  readonly closeOnBackdrop?: boolean;
  readonly closeOnEscape?: boolean;
  readonly initialFocus?: HTMLElement | (() => HTMLElement | null);
  readonly onCancel: () => void;
}

export class ModalFrame extends Component {
  public readonly body: HTMLElement;
  public readonly footer: HTMLElement;
  private readonly frame: HTMLElement;
  private readonly options: ModalFrameOptions;

  public constructor(options: ModalFrameOptions);
  protected render(host: HTMLElement): void;
  public setBusy(busy: boolean): void;
  public focusInitial(): void;
  public dispose(): void;
}
```

`render` creates backdrop/frame/title/body/footer, focus sentinels and keyboard handling. Backdrop cancellation requires the direct backdrop target. `setBusy(true)` disables owned interactive descendants and blocks cancel without confirming.

### 5.5 `src/presentation/components/common/ConfirmDialog.ts`

```ts
export interface ConfirmDialogOptions {
  readonly icon: 'warning' | 'save' | 'delete' | 'reset';
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: 'SÍ';
  readonly cancelLabel: 'NO';
  readonly tone: 'neutral' | 'danger';
  readonly initialFocus?: 'confirm' | 'cancel';
}

export class ConfirmDialog extends Component {
  public constructor(
    private readonly options: ConfirmDialogOptions,
    private readonly settle: (confirmed: boolean) => void,
  );

  protected render(host: HTMLElement): void;
  public dispose(): void;
}
```

Footer DOM order is `NO`, `SÍ`. The component settles once; Escape/backdrop map to `false`, never `true`.

### 5.6 `src/presentation/components/common/ToastRegion.ts`

```ts
export class ToastRegion extends Component {
  private unsubscribe: (() => void) | null;

  public constructor(private readonly service: ToastService);
  protected render(host: HTMLElement): void;
  public dispose(): void;
}
```

The region uses `aria-live=polite`, `aria-atomic=false`; errors additionally use `role=alert`. Each toast has a dismiss button.

### 5.7 `src/presentation/components/common/LoadingOverlay.ts`

```ts
export class LoadingOverlay extends Component {
  private visible: boolean;
  private message: string;

  public constructor(initialMessage?: string);
  protected render(host: HTMLElement): void;
  public show(message: string): void;
  public hide(): void;
  public isVisible(): boolean;
}
```

`show` sets `aria-busy=true` on the owned host; `hide` clears it. It never owns operation promises.

### 5.8 `src/presentation/components/common/AssetSourceField.ts`

```ts
export type AssetSourceFieldValue =
  | { readonly mode: 'unchanged' }
  | { readonly mode: 'local'; readonly file: File }
  | { readonly mode: 'remote'; readonly url: string }
  | { readonly mode: 'removed' };

export class AssetSourceField extends Component {
  private valueState: AssetSourceFieldValue;
  private disabled: boolean;

  public constructor(input: {
    readonly label: string;
    readonly kind: AssetKind;
    readonly current: AssetRef | null;
    readonly required: boolean;
    readonly allowRemove: boolean;
    readonly accept: string;
    readonly onChange?: (value: AssetSourceFieldValue) => void;
  });

  protected render(host: HTMLElement): void;
  public value(): AssetSourceFieldValue;
  public setValue(value: AssetSourceFieldValue): void;
  public setDisabled(disabled: boolean): void;
  public focus(): void;
}
```

The field keeps the selected `File` object only in component memory. It validates mode availability but does not validate business MIME/size rules; application policy remains authoritative.

### 5.9 `src/presentation/components/common/FormFields.ts`

```ts
export function createTextField(input: {
  readonly name: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly maxLength?: number;
  readonly inputMode?: string;
}): {
  readonly root: HTMLElement;
  readonly input: HTMLInputElement;
  readonly error: HTMLElement;
  setError(message: string | null): void;
  setDisabled(disabled: boolean): void;
};

export function createTextAreaField(input: {
  readonly name: string;
  readonly label: string;
  readonly value: string;
  readonly maxLength?: number;
}): {
  readonly root: HTMLElement;
  readonly input: HTMLTextAreaElement;
  readonly error: HTMLElement;
  setError(message: string | null): void;
  setDisabled(disabled: boolean): void;
};

export function createColorField(input: {
  readonly name: string;
  readonly label: string;
  readonly value: string;
}): {
  readonly root: HTMLElement;
  readonly colorInput: HTMLInputElement;
  readonly textInput: HTMLInputElement;
  readonly error: HTMLElement;
  value(): string;
  setValue(value: string): void;
  setError(message: string | null): void;
  setDisabled(disabled: boolean): void;
};

export function createNumberField(input: {
  readonly name: string;
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
}): {
  readonly root: HTMLElement;
  readonly input: HTMLInputElement;
  readonly error: HTMLElement;
  value(): number;
  setValue(value: number): void;
  setError(message: string | null): void;
  setDisabled(disabled: boolean): void;
};
```

Each helper links label/error ids, sets `aria-invalid` and never coerces invalid numeric text to zero.

### 5.10 `src/presentation/components/common/StorageQuotaNotice.ts`

```ts
export class StorageQuotaNotice extends Component {
  private estimateValue: StorageEstimate | null;

  public constructor(
    private readonly store: EditorStore,
    private readonly warningThreshold?: number,
  );

  protected render(host: HTMLElement): void;
  public refresh(): Promise<void>;
}
```

Default threshold is `0.8`. Unknown quota renders nothing; ratio at/above threshold renders a warning with formatted usage/quota.

## 6. Home Components

### 6.1 `src/presentation/components/start/AnimatedGalleryTitle.ts`

```ts
export class AnimatedGalleryTitle extends Component {
  private name: string;

  public constructor(name: string);
  protected render(host: HTMLElement): void;
  public update(name: string): void;
}
```

`update` changes escaped text without restarting animation. `prefers-reduced-motion: reduce` disables transforms/continuous animation in CSS.

### 6.2 `src/presentation/components/start/ReadinessDialog.ts`

```ts
export class ReadinessDialog extends Component {
  public constructor(
    private readonly report: SpectatorReadinessReport,
    private readonly onClose: () => void,
  );

  protected render(host: HTMLElement): void;
}
```

Issues are grouped in gallery order by room, then gallery-level issues. The dialog exposes only `VOLVER`; it cannot bypass readiness.

### 6.3 `src/presentation/screens/start/StartScreen.ts`

```ts
export interface StartScreenDependencies {
  readonly store: EditorStore;
  readonly modalService: ModalService;
  readonly toastService: ToastService;
  readonly onOpenEditor: () => void;
  readonly onOpenSpectator: (input: {
    readonly gallery: GallerySnapshot;
    readonly activationToken: SpectatorActivationToken;
  }) => void;
}

export class StartScreen extends Component {
  private unsubscribeStore: (() => void) | null;

  public constructor(private readonly dependencies: StartScreenDependencies);
  protected render(host: HTMLElement): void;
  protected onMounted(): void;
  public dispose(): void;

  private openSpectator(event: MouseEvent): Promise<void>;
}
```

`openSpectator` captures `performance.now()` synchronously from the click, runs readiness, reads the current store snapshot and opens either `ReadinessDialog` or the spectator callback. It disables both mode buttons during the check and restores them on failure.

## 7. Editor Shell Components

### 7.1 `src/presentation/components/editor/ResponsiveEditorGuard.ts`

```ts
export class ResponsiveEditorGuard extends Component {
  private supported: boolean;

  public constructor(
    private readonly onBack: () => void,
    private readonly windowRef: Window,
  );

  protected render(host: HTMLElement): void;
  protected onMounted(): void;
  public isSupported(): boolean;
}
```

The threshold is exactly `1024×640`; resize handling is debounced through one animation frame.

### 7.2 `src/presentation/components/editor/GalleryTitleEditor.ts`

```ts
export class GalleryTitleEditor extends Component {
  private mode: 'display' | 'editing' | 'saving';
  private name: string;
  private disabled: boolean;

  public constructor(input: {
    readonly name: string;
    readonly disabled: boolean;
    readonly onCommit: (name: string) => Promise<void>;
    readonly onError: (message: string) => void;
  });

  protected render(host: HTMLElement): void;
  public update(name: string, disabled: boolean): void;
  public beginEditing(): void;
}
```

Enter/blur share one guarded commit path. Escape restores the last persisted `name` and never calls `onCommit`.

### 7.3 `src/presentation/components/editor/RoomListItem.ts`

```ts
export class RoomListItem extends Component {
  public constructor(input: {
    readonly room: GalleryRoomSnapshot;
    readonly selected: boolean;
    readonly disabled: boolean;
    readonly onSelect: (roomId: RoomId) => void;
  });

  protected render(host: HTMLElement): void;
  public focus(): void;
  public roomId(): RoomId;
}
```

Structural status is derived locally from picture count and central exhibit presence; no IndexedDB call occurs.

### 7.4 `src/presentation/components/editor/RoomList.ts`

```ts
export class RoomList extends Component {
  private readonly items: RoomListItem[];

  public constructor(input: {
    readonly rooms: readonly GalleryRoomSnapshot[];
    readonly selectedRoomId: RoomId | null;
    readonly disabled: boolean;
    readonly onSelect: (roomId: RoomId) => void;
  });

  protected render(host: HTMLElement): void;
  public update(input: {
    readonly rooms: readonly GalleryRoomSnapshot[];
    readonly selectedRoomId: RoomId | null;
    readonly disabled: boolean;
  }): void;
  public dispose(): void;
}
```

Arrow keys move focus over rendered item buttons; they do not mutate store selection.

### 7.5 `src/presentation/components/editor/RoomSidebar.ts`

```ts
export class RoomSidebar extends Component {
  public constructor(input: {
    readonly store: EditorStore;
    readonly fileActions: RoomFileActions;
    readonly modalService: ModalService;
    readonly toastService: ToastService;
    readonly openRoomConfiguration: (roomId: RoomId) => void;
  });

  protected render(host: HTMLElement): void;
  public update(state: EditorState): void;
  public dispose(): void;
}
```

Create executes `store.createRoom`, then invokes `openRoomConfiguration` for the selected id. Import/export delegate to `RoomFileActions`.

### 7.6 `src/presentation/components/editor/EditorToolbar.ts`

```ts
export class EditorToolbar extends Component {
  public constructor(input: {
    readonly onAddPicture: () => void;
    readonly onConfigureRoom: () => void;
    readonly onExportRoom: () => void;
  });

  protected render(host: HTMLElement): void;
  public setEnabled(enabled: boolean): void;
}
```

The three controls preserve the exact DOM/visual order from SP5.

### 7.7 `src/presentation/components/editor/EmptyRoomState.ts`

```ts
export class EmptyRoomState extends Component {
  public constructor(private readonly onCreateRoom: () => void);
  protected render(host: HTMLElement): void;
}
```

It distinguishes “gallery has no rooms” from “no selected room” through text supplied by the parent; it does not access the store.

### 7.8 `src/presentation/screens/editor/EditorScreen.ts`

```ts
export interface EditorScreenDependencies {
  readonly store: EditorStore;
  readonly modalService: ModalService;
  readonly toastService: ToastService;
  readonly assetPolicy: AssetPolicy;
  readonly assetUrlResolver: AssetUrlResolver;
  readonly fileDownload: FileDownloadPort;
  readonly onExit: () => void;
}

export class EditorScreen extends Component {
  private unsubscribeStore: (() => void) | null;
  private sidebar: RoomSidebar | null;
  private toolbar: EditorToolbar | null;
  private grid: PictureGrid | null;
  private quotaNotice: StorageQuotaNotice | null;
  private fileActions: RoomFileActions | null;

  public constructor(private readonly dependencies: EditorScreenDependencies);
  protected render(host: HTMLElement): void;
  protected onMounted(): void;
  public dispose(): void;

  private renderState(state: EditorState): void;
  private openPictureModal(mode: PictureEditorMode): void;
  private openRoomModal(roomId: RoomId): void;
}
```

The screen owns composition only. It does not call IndexedDB or construct use cases. It subscribes once to the store and passes immutable state to children.

## 8. Picture Components

### 8.1 `src/presentation/components/editor/ImagePreview.ts`

```ts
export class ImagePreview extends Component {
  private requestSequence: number;
  private scopeId: string;

  public constructor(
    private readonly resolver: AssetUrlResolver,
    scopeId: string,
  );

  protected render(host: HTMLElement): void;
  public show(source: AssetRef, alt: string): Promise<void>;
  public clear(): void;
  public dispose(): void;
}
```

Every `show` invalidates prior async completion. `clear` releases the scope, removes `src`, and renders an empty placeholder. Decode/load failure renders a visible error but preserves the source value in the parent form.

### 8.2 `src/presentation/components/editor/PictureCard.ts`

```ts
export class PictureCard extends Component {
  private preview: ImagePreview | null;

  public constructor(input: {
    readonly picture: GalleryPictureSnapshot;
    readonly resolver: AssetUrlResolver;
    readonly onEdit: (picture: GalleryPictureSnapshot) => void;
  });

  protected render(host: HTMLElement): void;
  public dispose(): void;
}
```

The button label is `Editar imagen: {name}` and the `<img>` uses `object-fit: contain` inside a square transparent cell.

### 8.3 `src/presentation/components/editor/PictureGrid.ts`

```ts
export class PictureGrid extends Component {
  private readonly cards: PictureCard[];

  public constructor(input: {
    readonly pictures: readonly GalleryPictureSnapshot[];
    readonly resolver: AssetUrlResolver;
    readonly onEdit: (picture: GalleryPictureSnapshot) => void;
  });

  protected render(host: HTMLElement): void;
  public update(pictures: readonly GalleryPictureSnapshot[]): void;
  public dispose(): void;
}
```

Pictures render in snapshot order. Updating disposes old cards and their object URL scopes before creating replacements.

### 8.4 `src/presentation/components/editor/PictureEditorModal.ts`

```ts
export type PictureEditorMode =
  | { readonly kind: 'create'; readonly roomId: RoomId }
  | {
      readonly kind: 'edit';
      readonly roomId: RoomId;
      readonly picture: GalleryPictureSnapshot;
    };

export class PictureEditorModal extends Component {
  private busy: boolean;
  private sourceField: AssetSourceField | null;
  private preview: ImagePreview | null;

  public constructor(input: {
    readonly mode: PictureEditorMode;
    readonly store: EditorStore;
    readonly modalService: ModalService;
    readonly toastService: ToastService;
    readonly assetPolicy: AssetPolicy;
    readonly assetUrlResolver: AssetUrlResolver;
    readonly onClose: () => void;
  });

  protected render(host: HTMLElement): void;
  public dispose(): void;

  private submit(): Promise<void>;
  private remove(): Promise<void>;
  private buildAddCommand(): AddPictureCommand;
  private buildUpdateCommand(): UpdatePictureCommand;
  private setBusy(busy: boolean): void;
}
```

The command builders copy `File` metadata into `BinaryAssetDraft` without copying bytes. Create/save/delete follow SP5 confirmation semantics. Business validation errors remain visible and the modal stays open.

## 9. Room Configuration and Files

### 9.1 `src/presentation/components/editor/WallSurfaceField.ts`

```ts
export type WallSurfaceDraft =
  | { readonly mode: 'color'; readonly color: string }
  | {
      readonly mode: 'texture';
      readonly fallbackColor: string;
      readonly texture: AssetSourceFieldValue;
    };

export class WallSurfaceField extends Component {
  public constructor(input: {
    readonly current: WallSurface;
    readonly assetPolicy: AssetPolicy;
    readonly onChange?: (value: WallSurfaceDraft) => void;
  });

  protected render(host: HTMLElement): void;
  public value(): WallSurfaceDraft;
  public setValue(value: WallSurfaceDraft): void;
  public setDisabled(disabled: boolean): void;
  public dispose(): void;
}
```

Switching to color retains the unsaved texture draft only until modal close; submitted color mode emits no texture command.

### 9.2 `src/presentation/components/editor/LightingFields.ts`

```ts
export interface LightingDraft {
  readonly color: string;
  readonly ambientIntensity: number;
  readonly spotlightIntensity: number;
}

export class LightingFields extends Component {
  public constructor(
    initial: LightingDraft,
    onChange?: (value: LightingDraft) => void,
  );

  protected render(host: HTMLElement): void;
  public value(): LightingDraft;
  public setValue(value: LightingDraft): void;
  public setDisabled(disabled: boolean): void;
}
```

Number inputs preserve invalid text for field errors; `value()` throws a local form-validation error until all three values parse and fit declared ranges.

### 9.3 `src/presentation/components/editor/RoomAssetFields.ts`

```ts
export interface RoomAssetsDraft {
  readonly backgroundSound: AssetSourceFieldValue;
  readonly backgroundVolume: number;
  readonly centralObject: AssetSourceFieldValue;
  readonly objectScale: number;
}

export class RoomAssetFields extends Component {
  public constructor(input: {
    readonly room: GalleryRoomSnapshot;
    readonly assetPolicy: AssetPolicy;
    readonly onChange?: (value: RoomAssetsDraft) => void;
  });

  protected render(host: HTMLElement): void;
  public value(): RoomAssetsDraft;
  public setValue(value: RoomAssetsDraft): void;
  public setDisabled(disabled: boolean): void;
  public dispose(): void;
}
```

Volume disables when the effective sound is removed; object scale defaults to `1.0` when no object exists.

### 9.4 `src/presentation/components/editor/RoomConfigModal.ts`

```ts
export class RoomConfigModal extends Component {
  private busy: boolean;
  private room: GalleryRoomSnapshot;
  private wallField: WallSurfaceField | null;
  private lightingFields: LightingFields | null;
  private assetFields: RoomAssetFields | null;

  public constructor(input: {
    readonly room: GalleryRoomSnapshot;
    readonly store: EditorStore;
    readonly modalService: ModalService;
    readonly toastService: ToastService;
    readonly assetPolicy: AssetPolicy;
    readonly onClose: () => void;
  });

  protected render(host: HTMLElement): void;
  public dispose(): void;

  private save(): Promise<void>;
  private reset(): Promise<void>;
  private remove(): Promise<void>;
  private buildCommand(): UpdateRoomConfigurationCommand;
  private setBusy(busy: boolean): void;
}
```

After reset, `room` is replaced with the persisted snapshot returned through store state and fields rerender while the modal remains open. Delete closes only after success.

### 9.5 `src/presentation/components/editor/RoomFileActions.ts`

```ts
export class RoomFileActions implements Disposable {
  private readonly input: HTMLInputElement;
  private disposed: boolean;

  public constructor(input: {
    readonly store: EditorStore;
    readonly download: FileDownloadPort;
    readonly loading: LoadingOverlay;
    readonly toastService: ToastService;
  });

  public chooseRoomArchive(): void;
  public importSelectedFile(file: File): Promise<RoomId>;
  public exportRoom(roomId: RoomId): Promise<void>;
  public exportGallery(): Promise<void>;
  public dispose(): void;
}
```

The hidden input is configured once with `.t3room,application/zip`, clears its value after every selection and is removed on disposal. Downloads use only the returned `ExportArtifact`.

## 10. Spectator DOM Components

### 10.1 `src/presentation/components/spectator/PictureInfoHud.ts`

```ts
export class PictureInfoHud extends Component {
  private visiblePictureId: PictureId | null;
  private leaveTimer: number | null;

  public constructor(private readonly documentRef: Document);
  protected render(host: HTMLElement): void;
  public show(picture: GalleryPictureSnapshot): void;
  public hide(): void;
  public dispose(): void;
}
```

`show` cancels pending hide and updates title/description/link. Link activation releases pointer lock before normal navigation. `hide` starts CSS leave and applies `hidden` only after `240 ms`.

### 10.2 `src/presentation/components/spectator/SpectatorControlsHint.ts`

```ts
export class SpectatorControlsHint extends Component {
  public constructor(input: {
    readonly onCapturePointer: () => void;
    readonly onExit: () => void;
  });

  protected render(host: HTMLElement): void;
  public setPointerLocked(locked: boolean): void;
}
```

The component displays the exact desktop controls and an always reachable `VOLVER AL INICIO` button.

### 10.3 `src/presentation/components/spectator/SpectatorStatusOverlay.ts`

```ts
export class SpectatorStatusOverlay extends Component {
  public constructor(input: {
    readonly onExit: () => void;
    readonly onReloadScene: () => Promise<void>;
    readonly onEnableSound: () => Promise<boolean>;
  });

  protected render(host: HTMLElement): void;
  public showLoading(message: string, progress?: number | null): void;
  public showWarning(message: string): void;
  public showAudioActivation(): void;
  public showFatal(input: {
    readonly message: string;
    readonly recoverable: boolean;
  }): void;
  public clear(): void;
}
```

Only one blocking state is visible. Warnings are non-blocking and may delegate persistent history to `ToastService` through the parent screen.

### 10.4 `src/presentation/screens/spectator/SpectatorScreen.ts`

```ts
export interface SpectatorScreenDependencies {
  readonly gallery: GallerySnapshot;
  readonly activationToken: SpectatorActivationToken;
  readonly assetUrlResolver: AssetUrlResolver;
  readonly galleryStore: GalleryStore;
  readonly toastService: ToastService;
  readonly onExit: () => void;
}

export class SpectatorScreen extends Component {
  private runtime: ThreeGalleryRuntime | null;
  private hud: PictureInfoHud | null;
  private controls: SpectatorControlsHint | null;
  private status: SpectatorStatusOverlay | null;
  private readonly runtimeUnsubscribers: Array<() => void>;

  public constructor(private readonly dependencies: SpectatorScreenDependencies);
  protected render(host: HTMLElement): void;
  protected onMounted(): void;
  public dispose(): void;

  private buildRuntime(): Promise<void>;
  private reloadRuntime(): Promise<void>;
  private handleDiagnostic(diagnostic: RuntimeDiagnostic): void;
}
```

The screen passes the immutable approved snapshot to one runtime instance. It translates runtime events into DOM only; it does not inspect meshes or update Three.js systems directly. Disposal unsubscribes events, disposes runtime, then child components.

## 11. Composition Rule

`bootstrapApplication` creates exactly one `EditorStore`, `ModalService`, `ToastService` and `ToastRegion` for the SPA lifetime. `ScreenFactory` receives these instances and concrete browser ports. Screen/component constructors remain deterministic and perform no side effects before `mount`, except `RoomFileActions`, which creates but does not attach its hidden input until the Editor mounts it.
