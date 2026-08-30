# SP2 — Architecture, Dependency Rules and Runtime Baseline

## 1. Architectural Style

The application follows a four-layer clean architecture plus an explicit composition root:

```text
bootstrap
   ├── presentation ───────► application ───────► domain
   └── infrastructure ─────► application ───────► domain

Forbidden:
   domain ─► application/presentation/infrastructure/bootstrap
   application ─► presentation/infrastructure/bootstrap
   presentation ─► IndexedDB/fflate concrete adapters
   infrastructure ─► presentation
```

`presentation` contains both DOM UI and the Three.js visual adapter. This placement is deliberate: Three.js renders the user-facing world and does not implement persistence or business policy. `infrastructure` contains IndexedDB, ZIP, hashing, browser asset URL resolution, quota and download adapters.

## 2. Layer Responsibilities

### 2.1 Domain

Owns:

- Gallery, room and picture entities.
- Value objects, ids, snapshots and defaults.
- Structural invariants.
- Collection of referenced asset ids.
- Synchronous structural spectator-readiness rules.

Must not know:

- `Blob`, `File`, `HTMLElement`, `Canvas`, `AudioContext` or `IDB*` classes.
- Three.js or any npm package.
- How data is persisted or displayed.

### 2.2 Application

Owns:

- Use-case inputs/outputs.
- Ports implemented by external layers.
- Asset validation policy and commit planning.
- Atomic orchestration of gallery mutations.
- Import/export orchestration.
- Asynchronous readiness check for local asset existence.

May use `Blob` in boundary DTOs because the deployed application is browser-only, but no entity or snapshot stores `Blob`.

### 2.3 Presentation

Owns:

- Hash routes and screen lifecycle.
- DOM components, Editor state and accessibility.
- Modal/confirmation/toast services.
- Three.js renderer, scene builders, controls, collision, HUD synchronization and audio system.
- Conversion from application snapshots into view/scene plans.

Must interact with persistence only through application use cases or injected read-only asset URL services.

### 2.4 Infrastructure

Owns:

- IndexedDB schema, migration and transactions.
- Browser implementations of ids, clock, image metadata, storage quota and downloads.
- Asset object URL lifecycle.
- Archive serialization/deserialization with fflate.
- SHA-256 checksums with Web Crypto.

Must implement application ports and expose concrete instances only to `bootstrap`.

### 2.5 Bootstrap

Owns:

- Construction order.
- Dependency injection.
- One singleton per infrastructure service that requires shared lifecycle.
- Initial gallery load.
- Mounting `AppShell` into `#app`.

No business rule, rendering algorithm or persistence query is allowed in bootstrap.

## 3. Runtime and Dependency Baseline

Versions are pinned in `package.json` and `package-lock.json`:

| Package/tool | Version | Scope | Rationale |
| --- | ---: | --- | --- |
| Node.js | `>=22.12.0` | development/build | Supported by Vite 8 and avoids ambiguous Node ranges |
| `three` | `0.185.1` | runtime | Required 3D engine and official addons |
| `fflate` | `0.8.3` | runtime | Small browser ZIP implementation for room/gallery archives |
| `vite` | `8.2.2` | development/build | Required compiler/dev server |
| `typescript` | `7.0.2` | development | Strict type checking |
| `vitest` | `4.1.11` | development/test | Unit and integration test runner integrated with Vite 8 |
| `@vitest/coverage-v8` | `4.1.11` | development/test | Native V8 coverage provider matching Vitest |
| `happy-dom` | `20.12.0` | development/test | DOM environment for isolated component tests |
| `fake-indexeddb` | `6.2.5` | development/test | Deterministic IndexedDB integration tests in Node |
| `@playwright/test` | `1.62.1` | development/test | Browser, IndexedDB and WebGL end-to-end flows |
| `@axe-core/playwright` | `4.13.0` | development/test | Automated accessibility analysis inside Playwright |

No UI framework, state library, icon package, physics engine, audio library, schema package or IndexedDB wrapper is allowed in v1. Test-only packages listed above never enter the production bundle. Validation is implemented with typed functions because the schema surface is bounded and must remain dependency-free.

## 4. Required Compiler Configuration

`tsconfig.json` must include at least:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "types": ["vite/client"]
  }
}
```

`npm run typecheck` invokes `tsc --noEmit`. Vite transpilation is not treated as type validation.

## 5. Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "audit:layers": "node scripts/audit-layer-imports.mjs",
    "validate": "npm run audit:layers && npm run test:coverage && npm run build && npm run test:e2e"
  }
}
```

## 6. Component Model

DOM UI uses constructor-injected component classes rather than global Custom Elements.

```ts
export interface MountableComponent {
  mount(host: HTMLElement): void;
  dispose(): void;
}

export abstract class Component implements MountableComponent {
  protected readonly abortController: AbortController;
  protected host: HTMLElement | null;
  protected root: HTMLElement | null;

  public mount(host: HTMLElement): void;
  public dispose(): void;
  protected abstract render(): HTMLElement;
  protected onMounted(): void;
  protected onDispose(): void;
}
```

Rules:

1. Dependencies enter through constructor parameters.
2. Events are registered with `signal: abortController.signal` where supported.
3. Child components are disposed before parent DOM removal.
4. Components receive immutable snapshots/view models; they do not mutate domain entities.
5. A component requests changes through `EditorStore`, which serializes use cases.
6. No component calls `indexedDB`, `fflate`, `URL.createObjectURL` or `OBJLoader` directly.

## 7. Application State and Concurrency

`EditorStore` owns one immutable `EditorState`:

```ts
interface EditorState {
  readonly status: 'idle' | 'loading' | 'ready' | 'mutating' | 'error';
  readonly gallery: GallerySnapshot | null;
  readonly selectedRoomId: RoomId | null;
  readonly error: UiError | null;
}
```

Mutation policy:

- All operations pass through `EditorStore.enqueueMutation`.
- The queue is FIFO and permits only one persistence commit at a time.
- UI renders pending state and disables conflicting controls.
- State changes to the returned committed snapshot only after the use case resolves.
- On rejection, the previous snapshot remains active and a typed error is exposed.
- Read-only export operations may run while idle but not during a mutation.

## 8. Routing and Screen Lifecycle

`HashRouter` supports exactly:

```ts
type AppRoute = 'home' | 'editor' | 'spectator';
```

Rules:

- Unknown/empty hash normalizes to `#home` with `replaceState`.
- `AppShell` owns at most one mounted screen.
- Route transition order: `oldScreen.dispose()` → clear host → create new screen → `mount()`.
- Navigating to `spectator` requires a readiness token created by the Home click handler. Directly entering `#spectator` reroutes to Home and asks the user to activate it.
- The readiness token also records that audio activation originated in a user gesture.

## 9. Error Taxonomy

```ts
type ApplicationErrorCode =
  | 'GALLERY_NOT_FOUND'
  | 'ROOM_NOT_FOUND'
  | 'PICTURE_NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'PERSISTENCE_FAILED'
  | 'STORAGE_QUOTA_EXCEEDED'
  | 'ARCHIVE_INVALID'
  | 'ARCHIVE_UNSUPPORTED_VERSION'
  | 'ARCHIVE_CHECKSUM_MISMATCH'
  | 'REMOTE_ASSET_UNAVAILABLE'
  | 'ASSET_DECODE_FAILED'
  | 'WEBGL_UNAVAILABLE'
  | 'WEBGL_CONTEXT_LOST';
```

- Domain errors describe invalid values/invariants.
- Use cases map domain and adapter failures to `ApplicationError` with code, safe message, optional cause and contextual ids.
- Presentation converts application errors to inline errors, modal errors or toasts based on action scope.
- Console logging may include cause in development; production UI never prints raw stack/cause.

## 10. Three.js Ownership and Loop

`ThreeGalleryRuntime` is the only owner of:

- `WebGLRenderer`
- `Scene`
- primary `PerspectiveCamera`
- animation frame / `setAnimationLoop`
- `Clock`
- global `AudioListener`
- loaded scene resources

Update order per frame:

1. Clamp delta to `0.05 s`.
2. Poll input state.
3. Update avatar movement and resolve collisions.
4. Update camera target and obstruction.
5. Resolve active room.
6. Update environment/light/audio transitions.
7. Update exhibit rotation and trails for active rooms.
8. Evaluate picture focus when 100 ms accumulator elapses.
9. Render scene.
10. Sample frame time for diagnostics.

No system starts its own RAF.

## 11. Asset Resolution Boundary

Presentation receives `AssetUrlResolver`:

```ts
interface AssetUrlResolver {
  resolve(ref: AssetRef, scopeId: string): Promise<string>;
  releaseScope(scopeId: string): void;
}
```

- Remote refs return their URL after protocol validation.
- Local refs read Blob through `GalleryStore`, create/reuse an object URL and register it under `scopeId`.
- Editor uses one scope per mounted screen/modal.
- Spectator uses one runtime scope.
- Scope release revokes URLs only when no other scope holds them.

## 12. Import Boundary Audit

`scripts/audit-layer-imports.mjs` parses source imports and fails when:

| Source prefix | Forbidden target prefixes |
| --- | --- |
| `src/domain/` | `src/application`, `src/presentation`, `src/infrastructure`, `src/bootstrap`, package imports |
| `src/application/` | `src/presentation`, `src/infrastructure`, `src/bootstrap`, `three`, `fflate` |
| `src/presentation/` | `src/infrastructure` concrete modules, `fflate` |
| `src/infrastructure/` | `src/presentation`, `src/bootstrap`, `three` |

Allowed aliases:

```text
@domain/*         -> src/domain/*
@application/*    -> src/application/*
@presentation/*   -> src/presentation/*
@infrastructure/* -> src/infrastructure/*
@bootstrap/*      -> src/bootstrap/*
```

Aliases do not weaken dependency rules.

## 13. Build Output

- `vite build` produces `dist/` static assets.
- Dynamic imports split `SpectatorScreen` and Three.js runtime from Home/Editor bundle.
- CSS code splitting remains enabled.
- `base: './'` permits static hosting below a subpath and local preview via HTTP.
- Source maps are enabled in development and disabled in production unless explicitly requested.
- No service worker is included in v1.
