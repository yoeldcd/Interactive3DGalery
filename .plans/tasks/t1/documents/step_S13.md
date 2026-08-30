# SP1 — Product Scope, States, Flows and UX Decisions

## 1. Objective

Build a static, browser-only application that lets one local user author a gallery and traverse it as a third-person 3D experience. The persisted unit is one active gallery. The user may create multiple rooms inside it, but the application does not maintain a gallery catalogue.

## 2. Actors

| Actor | Authority | Capabilities | Explicit exclusions |
| --- | --- | --- | --- |
| Visitor | Local browser user in `SPECTATOR` | Walk, look, inspect pictures, follow configured links, hear room audio | Cannot edit, upload or persist changes |
| Administrator | Same local browser user in `EDITOR` | Rename gallery, create/import/export rooms, configure rooms, manage pictures, export gallery | No authentication, role verification, account or remote authorization |
| Browser | Runtime and persistence host | WebGL, DOM, IndexedDB, Web Audio, Web Crypto, ZIP download | No server-side recovery or cross-device synchronization |

## 3. Application State Machine

```text
BOOT
  ├─ load persisted gallery success ──> HOME
  ├─ no persisted gallery ────────────> create default ──> HOME
  └─ fatal persistence error ─────────> HOME_ERROR

HOME
  ├─ ADMINISTRADOR ───────────────────> EDITOR
  └─ ESPECTADOR
       ├─ readiness PASS ─────────────> SPECTATOR
       └─ readiness FAIL ─────────────> READINESS_DIALOG ──> HOME

EDITOR
  ├─ hash #home/back ─────────────────> HOME
  ├─ select room ─────────────────────> EDITOR(selectedRoomId)
  ├─ open picture/room modal ─────────> EDITOR_MODAL
  └─ persistence failure ─────────────> EDITOR + blocking error notification

SPECTATOR
  ├─ hash #home/back ─────────────────> dispose runtime ──> HOME
  ├─ WebGL/context fatal error ───────> SPECTATOR_ERROR
  └─ ordinary asset failure ──────────> fallback mesh/card + nonblocking notice
```

## 4. Screen Contracts

### 4.1 Home

- Root element: `<main class="start-screen">`.
- Occupies `100dvw × 100dvh` with overflow hidden.
- Gallery name appears in `<h1>` and is animated with CSS only.
- Required buttons, in this visual order: `ESPECTADOR`, `ADMINISTRADOR`.
- `prefers-reduced-motion: reduce` removes translation/particle effects and leaves a short opacity transition.
- `ESPECTADOR` first calls `CheckSpectatorReadiness`; it does not create a renderer on failure.
- The button click is passed as the audio-unlock gesture to `SpectatorScreen`.

### 4.2 Editor

- Root: `<main class="editor-screen">`.
- CSS grid: `grid-template-columns: 15dvw 85dvw; grid-template-rows: 100dvh`.
- Left and right columns each use `grid-template-rows: 10dvh 90dvh`.
- Minimum supported viewport: `1024 × 640`. Below it, a blocking responsive notice replaces the editor; no ratio substitution occurs.
- The selected room id is presentation state only and is not persisted.
- When no room is selected, the right body shows an empty state and toolbar room actions are disabled.

### 4.3 Spectator

- Root: `<main class="spectator-screen">`.
- Canvas fills viewport; HUD remains HTML over the canvas.
- Pointer capture is never forced. A controls hint asks for click before calling `requestPointerLock()`.
- `Escape` releases pointer lock; browser back/hash navigation exits and disposes the runtime.

## 5. Editor Action Semantics

### 5.1 Gallery Title

1. Render name as a text button.
2. Activation hides text and reveals a prefilled input.
3. `Enter` or `blur` asks `RenameGallery` to persist; on success it returns to text mode.
4. `Escape` discards local draft.
5. Invalid/empty name keeps input visible with inline error.

### 5.2 Create Room

1. Determine the first unused positive sequence in `Salón {N}`.
2. Execute `CreateRoom` with default environment.
3. Select returned room.
4. Open `RoomConfigModal` in create-follow-up mode.
5. Closing the modal does not delete the already-created room; deletion remains explicit.

### 5.3 Import Room

1. Accept one `.t3room` file.
2. Read and validate without mutating IndexedDB.
3. Regenerate room, picture and local asset ids.
4. If another room uses the same normalized name, append ` (importado {N})`.
5. Commit snapshot and blobs atomically.
6. Select imported room and notify success.

### 5.4 Export Gallery/Room

- Export is read-only: it must not increment the domain revision or update `updatedAt`.
- Filenames are slugged and timestamped:
  - `{gallery-slug}-{YYYYMMDD-HHmm}.t3gallery`
  - `{room-slug}-{YYYYMMDD-HHmm}.t3room`
- Remote asset URLs are recorded in JSON and absent from `/assets`.

### 5.5 Reset Room

Reset preserves:

- `room.id`
- `room.name`
- `room.pictures` and their order

Reset replaces:

- `description` with empty string
- wall surface with default color
- lighting with defaults
- background sound with `null`
- central exhibit with `null`
- object scale implicitly with default in the absent exhibit

Any now-unreferenced local room asset is deleted in the same commit.

## 6. Readiness Policy

`CheckSpectatorReadiness` returns a report rather than a boolean.

```ts
interface SpectatorReadinessReport {
  readonly ready: boolean;
  readonly issues: readonly SpectatorReadinessIssue[];
}

interface SpectatorReadinessIssue {
  readonly code:
    | 'NO_ROOMS'
    | 'ROOM_REQUIRES_THREE_PICTURES'
    | 'ROOM_REQUIRES_CENTRAL_OBJECT'
    | 'MISSING_LOCAL_ASSET';
  readonly roomId: string | null;
  readonly roomName: string | null;
  readonly assetId: string | null;
  readonly message: string;
}
```

Rules:

1. Gallery must have at least one room.
2. Every room must have at least three pictures.
3. Every room must have a central OBJ reference with scale greater than or equal to `0`; scale `0` is allowed and considered configured.
4. Every local asset reference in the complete snapshot must exist in IndexedDB.
5. Remote asset availability is not probed during readiness because CORS and network state may change; runtime handles failures.

## 7. Picture Focus Contract

- Evaluation frequency: `10 Hz` independent of render FPS.
- Origin: avatar eye point, not third-person camera.
- Maximum center distance: `3.2 m`.
- Maximum facing angle: `18°`, equivalent to `dot(forward, direction) >= cos(18°)`.
- Candidate must be in the current room.
- Raycaster must hit the candidate picture before any wall, object or frame collider.
- HUD debounce: same candidate must remain valid for `120 ms`.
- Enter animation: `240 ms`; leave animation: `180 ms`.
- HUD always shows picture name; description/link are conditionally rendered.

## 8. Input and Asset Policies

| Kind | Local extensions/MIME | Maximum | Remote protocols | Runtime fallback |
| --- | --- | ---: | --- | --- |
| Picture | png, jpg/jpeg, webp, avif | 25 MiB | http, https | neutral “image unavailable” plane |
| Wall texture | png, jpg/jpeg, webp, avif | 25 MiB | http, https | configured fallback color |
| Audio | mp3, ogg, wav | 50 MiB | http, https | silence + notice |
| Central object | obj | 25 MiB | http, https | wireframe error polyhedron |
| Imported archive | t3room | 250 MiB compressed | local file only | reject before commit |

The application validates extension, MIME when available, byte length and parsability where possible. MIME is advisory; magic bytes are checked for supported image/audio formats when practical. OBJ is treated as UTF-8 text and must contain at least one vertex and one face declaration after parse.

## 9. Deliberate Non-goals

- Backend, REST/GraphQL, cloud storage or user accounts.
- Full gallery import.
- Multi-gallery catalogue.
- Collaborative editing, permissions or audit server.
- Touch/gamepad controls, VR/WebXR or mobile spectator mode.
- Physics engine, jumping, gravity, stairs or dynamic doors.
- MTL, glTF, FBX or animated character assets.
- Image cropping/editing or audio editing.
- Drag-and-drop picture reordering. Wall order is insertion order in v1.
- Internationalization; visible product text is Spanish and centralized for later extraction.

## 10. End-to-end Acceptance Narrative

1. First launch creates `Mi Galería` and opens Home.
2. User enters Administrator, renames gallery and creates a room.
3. User configures wall color/texture, light, audio, OBJ and scale.
4. User adds three images of different ratios, descriptions and one external link.
5. User exports the room, creates another room, imports the exported room and obtains unique ids.
6. User exports the complete gallery.
7. User returns Home; readiness passes and Spectator starts after click.
8. Avatar walks through a labeled open door, hears crossfaded room audio and observes the rotating illuminated OBJ with trails.
9. Facing a picture within threshold shows HUD; link opens securely.
10. Returning Home disposes all runtime resources; reopening Editor shows persisted state.
