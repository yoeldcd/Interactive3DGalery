# SP5 — Editor UI, Components, Forms and Confirmation Semantics

## 1. Editor DOM Contract

```html
<main class="editor-screen">
  <aside class="editor-sidebar" aria-label="Administración de salones">
    <header class="editor-sidebar__header">
      <div class="gallery-title-editor" data-component="GalleryTitleEditor"></div>
      <div class="editor-sidebar__actions" role="toolbar" aria-label="Acciones de galería">
        <button type="button" aria-label="CREAR SALÓN"></button>
        <button type="button" aria-label="IMPORTAR SALÓN"></button>
        <button type="button" aria-label="EXPORTAR GALERÍA"></button>
      </div>
    </header>
    <div class="editor-sidebar__body">
      <nav class="room-list" aria-label="Lista de Salones" data-component="RoomList"></nav>
    </div>
  </aside>

  <section class="editor-content" aria-label="Contenido del salón seleccionado">
    <header class="editor-toolbar" role="toolbar" aria-label="Acciones del salón">
      <button type="button">AGREGAR IMAGEN</button>
      <button type="button">CONFIGURAR SALA</button>
      <button type="button">EXPORTAR SALA</button>
    </header>
    <div class="editor-content__body">
      <div class="picture-grid" data-component="PictureGrid"></div>
    </div>
  </section>
</main>
```

Normative CSS:

```css
.editor-screen {
  display: grid;
  grid-template-columns: 15dvw 85dvw;
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
}

.editor-sidebar,
.editor-content {
  display: grid;
  grid-template-rows: 10dvh 90dvh;
  min-width: 0;
  min-height: 0;
}

.room-list__item {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-subtle);
}
```

The room row wrapper has no margin/padding. Its internal selection button may use `padding-inline: 0.75rem` so text remains usable without creating inter-row gaps.

## 2. Responsive Guard

`ResponsiveEditorGuard` measures `window.innerWidth` and `window.innerHeight` on mount and resize.

- Supported: width `>=1024` and height `>=640`.
- Unsupported: render a blocking notice over the Editor with `role="alertdialog"`, explain the minimum, and expose `VOLVER` to Home.
- Do not change `15dvw/85dvw` or stack panels.
- Guard is presentation-only and does not unmount `EditorStore` or lose draft-free persisted state.

## 3. Editor State Projection

Derived selectors in `EditorStore`:

```ts
public selectedRoom(): GalleryRoomSnapshot | null;
public canUseRoomActions(): boolean;
public isMutating(): boolean;
public roomById(id: RoomId): GalleryRoomSnapshot | null;
```

Every component receives the complete current snapshot or a selected immutable sub-snapshot. Components do not cache entity objects.

## 4. Sidebar Header

### 4.1 `GalleryTitleEditor`

Constructor:

```ts
public constructor(input: {
  name: string;
  disabled: boolean;
  onCommit: (name: string) => Promise<void>;
  onError: (message: string) => void;
});
```

States:

```ts
type GalleryTitleEditorMode = 'display' | 'editing' | 'saving';
```

Behavior:

- Display mode uses a `<button class="gallery-title-editor__trigger">` containing current name.
- Activation moves to editing and focuses/selects input.
- Input has `maxlength=120`, `aria-label="Nombre de la galería"`.
- `Enter`: prevent default, normalize, call onCommit.
- `Escape`: restore original value and display mode.
- `blur`: commit only when value differs; otherwise display mode.
- Saving disables input and does not react to blur twice.
- On commit failure, stay editing, re-enable, show inline error.

### 4.2 Sidebar Icon Actions

Visual order, DOM order and `aria-label` order are identical:

1. `CREAR SALÓN` — icon `plus-room`.
2. `IMPORTAR SALÓN` — icon `import`.
3. `EXPORTAR GALERÍA` — icon `download`.

No visible label is rendered. Tooltip appears on hover/focus after `350 ms`. Each button is at least `36×36 CSS px`.

## 5. Room List

`RoomList` renders rooms in snapshot order. No drag/reorder behavior exists.

Each `RoomListItem`:

```html
<div class="room-list__item" data-room-id="{room.id}">
  <button
    class="room-list__select"
    type="button"
    aria-current="{room.id === selectedRoomId ? 'true' : 'false'}"
  >
    <span class="room-list__name">{room.name}</span>
    <span
      class="room-list__status"
      aria-label="{roomStructuralStatusLabel}"
      data-status="{roomStructuralStatus}"
    ></span>
  </button>
</div>
```

The braces above denote escaped text/data bindings generated with DOM APIs, not HTML interpolation or `innerHTML`.

Status icon:

- `ready`: room has >=3 pictures and central object configured.
- `incomplete`: otherwise; tooltip explains missing local structural items.
- Asset existence is not checked per row; full readiness does it on demand.

Keyboard:

- Tab reaches each room button.
- Enter/Space selects.
- ArrowUp/ArrowDown moves focus among room buttons without changing selection until Enter/Space.

## 6. Content Toolbar

Buttons, left-to-right:

1. `AGREGAR IMAGEN` — icon + visible label.
2. `CONFIGURAR SALA` — icon + visible label.
3. `EXPORTAR SALA` — icon + visible label.

All are aligned to the right with `margin-left:auto` on the action group. They are disabled if no selected room or store status is `mutating/loading`.

`AGREGAR IMAGEN` opens a file/URL source choice inside `PictureEditorModal`; it does not open an independent native file dialog first.

## 7. Picture Grid

Normative CSS:

```css
.picture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(9rem, 14vw, 15rem), 1fr));
  grid-auto-flow: row;
  gap: 1rem;
  align-content: start;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.picture-card {
  aspect-ratio: 1 / 1;
  min-width: 0;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
}

.picture-card img {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

The square cell remains invisible in default state. Focus/hover may show a subtle outline around the cell, not around a stretched image.

Accessible label: `Editar imagen: {picture.name}`.

## 8. Modal Framework

`ModalService.open<T>(request: ModalRequest<T>)` returns `Promise<T | null>` and guarantees one content modal at a time; a confirmation may be stacked above it as fixed by SP11.

`ModalFrame` requirements:

- Portal host is appended under `#app`.
- Backdrop and frame use z-index tokens.
- Frame has `role="dialog"`, `aria-modal="true"`, linked title id.
- Initial focus is explicit; otherwise first enabled control.
- Tab/Shift+Tab wrap within dialog.
- Escape requests cancel only when no confirmation dialog is stacked.
- Focus returns to the opener on close if opener is still connected.
- Background receives `inert` while modal exists.

## 9. Confirmation Dialog

Invocation:

```ts
const confirmed = await modalService.confirm({
  icon: 'warning' | 'save' | 'delete' | 'reset',
  title: string,
  message: string,
  confirmLabel: 'SÍ',
  cancelLabel: 'NO',
  tone: 'neutral' | 'danger',
});
```

Footer DOM order: `NO`, then `SÍ`, so safe action receives first keyboard focus unless caller explicitly requests confirm focus for non-destructive save.

Operation mapping:

| Operation | Icon | Tone | Initial focus |
| --- | --- | --- | --- |
| Save picture/room | save | neutral | `SÍ` |
| Delete picture/room | delete | danger | `NO` |
| Reset room | reset | danger | `NO` |

`NO`, Escape or backdrop click resolve `false`; `SÍ` resolves `true`. Backdrop click never confirms.

## 10. Asset Source Field

`AssetSourceField` supports two tabs/radios:

```ts
type AssetSourceFieldValue =
  | { mode: 'unchanged' }
  | { mode: 'local'; file: File }
  | { mode: 'remote'; url: string }
  | { mode: 'removed' };
```

The constructor input declared in SP11 determines allowed values:

```ts
{
  readonly label: string;
  readonly kind: AssetKind;
  readonly current: AssetRef | null;
  readonly required: boolean;
  readonly allowRemove: boolean;
  readonly accept: string;
  readonly onChange?: (value: AssetSourceFieldValue) => void;
}
```

Rules:

- Existing assets default to `unchanged`.
- New required picture source has no `unchanged` or `removed` option.
- File input uses exact `accept` list from `AssetPolicy` but application revalidates.
- Remote input displays CORS warning.
- Selected file displays basename and human-readable byte size; file bytes are not copied until submit command construction.

## 11. Picture Editor Modal

### 11.1 Modes

```ts
type PictureEditorMode =
  | { kind: 'create'; roomId: RoomId }
  | { kind: 'edit'; roomId: RoomId; picture: GalleryPictureSnapshot };
```

### 11.2 Fields and Order

1. `Nombre` — text, required, max 120.
2. `Descripción` — textarea, optional, max 2000.
3. `Color del marco` — color input + canonical text value.
4. `Fuente de imagen` — `AssetSourceField`.
5. `Enlace` — URL input, optional.
6. `Texto del enlace` — text, optional, disabled when enlace empty.
7. Preview area preserving aspect ratio.

### 11.3 Footer

- Create mode: `CANCELAR`, `GUARDAR`.
- Edit mode: `ELIMINAR` left-aligned; `CANCELAR`, `GUARDAR` right-aligned.
- User request requires confirm on save/delete; `CANCELAR` does not confirm because it performs no mutation.

### 11.4 Submit

1. Collect and synchronously validate fields.
2. Confirm save.
3. Set modal busy; disable all fields/footer.
4. Build `AddPictureCommand` or `UpdatePictureCommand`.
5. Await store method.
6. On success close and toast.
7. On error remain open, restore controls and show top-level error summary plus field mapping when applicable.

## 12. Room Configuration Modal

### 12.1 Fields and Order

1. `Título de sala` — required, max 120.
2. `Descripción` — optional, max 2000.
3. `Superficie de paredes` — radio `COLOR` / `TEXTURA`.
4. Color or texture selector; texture mode always retains fallback color.
5. `Color de iluminación`.
6. `Intensidad ambiental` — number `0..3`, step `0.05`.
7. `Intensidad del foco` — number `0..100`, step `1`.
8. `Sonido de fondo` — optional asset source.
9. `Volumen` — number `0..1`, step `0.05`, disabled without sound.
10. `Objeto central` — optional while editing, structurally required for Spectator.
11. `Escala del objeto` — number `0..10`, step `0.1`, default `1.0`.

### 12.2 Footer

- Left group: `RESETEAR`, `ELIMINAR`.
- Right group: `CANCELAR`, `GUARDAR`.
- Each mutating action has its own confirmation.
- Delete closes modal only after successful commit and selects nearest remaining room: same index, otherwise previous, otherwise null.
- Reset updates modal fields to returned persisted defaults and keeps modal open so user sees result.

## 13. Import and Export UI

`RoomFileActions` owns hidden file input and download dispatch.

### Import

- File input `accept=".t3room,application/zip"`.
- One file only.
- Show blocking loading overlay during read/validation/commit.
- On success select imported room and show filename/name.
- On archive error display safe diagnostic; do not partially add room.

### Export

- Execute use case.
- Pass returned artifact to `FileDownloadPort.download(blob, fileName)`.
- Disable triggering button until Blob and anchor dispatch complete.
- Errors show toast and no empty file.

## 14. CSS and Visual Tokens

Required tokens include:

```css
:root {
  --editor-sidebar-width: 15dvw;
  --editor-content-width: 85dvw;
  --editor-header-height: 10dvh;
  --editor-body-height: 90dvh;
  --focus-ring: 0 0 0 3px color-mix(in srgb, currentColor 35%, transparent);
  --motion-fast: 180ms;
  --motion-normal: 240ms;
  --modal-z: 1000;
  --toast-z: 1100;
}
```

No inline style may define layout proportions. Dynamic colors/previews may use CSS custom properties set on elements.

## 15. UI Failure and Draft Rules

- No unconfirmed draft is persisted.
- Closing a modal discards local draft and selected File references.
- A persistence error never updates Editor snapshot.
- A remote preview failure does not silently switch to local or clear URL.
- When selected room is deleted outside current component through a completed mutation, all dependent components rerender from state and close stale modals.
- The Editor never reads Gallery directly from IndexedDB after initialization; store results are authoritative.
