# SP9 — Validation, Testing, Fixtures, and Acceptance Specification

## 1. Purpose

This document defines the complete verification strategy for `T3DG-001`. A feature is not considered implemented when it merely renders; it is complete only when its declared invariants, persistence effects, lifecycle effects, accessibility behavior, and failure paths satisfy the mapped validation gates.

The suite has four levels:

1. **Static validation:** TypeScript, production build, formatting-neutral import audit, and artifact inspection.
2. **Unit validation:** domain, application services/use cases, geometry, collision primitives, and resource ownership.
3. **Integration validation:** IndexedDB transactions, archive round-trips, browser adapters, object URL scopes, and selected DOM components.
4. **End-to-end validation:** user-visible Editor/Spectator flows in Chromium through Playwright.

No test may depend on a network resource. Remote URL behavior is tested with controlled browser routes that return either a valid resource, a CORS denial, a timeout, or a protocol error.

## 2. Normative Commands

`package.json` exposes these exact scripts:

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

Execution environment:

- Node `22.12+`.
- npm uses committed `package-lock.json`; CI and clean verification use `npm ci`.
- Unit tests run with Vitest in a DOM-capable environment only for presentation tests; domain/application/geometry tests use the Node environment.
- Playwright executes one Chromium project at viewport `1440 × 900`, device scale factor `1`, reduced motion `no-preference`, and a second accessibility project with `reducedMotion: reduce`.
- E2E workers are forced to `1` because IndexedDB and downloads use one deterministic local origin.

## 3. Test Naming and Structure

Each test title follows:

```text
{unit under test} — {condition} → {observable result}
```

Each test contains Arrange, Act, and Assert blocks. Comments are required only when the fixture or assertion cannot explain the intent. Tests must assert public effects and typed errors, not private implementation details.

File ownership is fixed in `SP4`. Additional test files require an update to `SP4`, this document, and the execution history before creation.

## 4. Fixtures

### 4.1 Binary fixtures

| File | Required content | Validation purpose |
| --- | --- | --- |
| `tests/fixtures/picture-landscape.png` | `320 × 180`, opaque, deterministic pixels | Landscape ratio `16:9`, image metadata, frame sizing. |
| `tests/fixtures/picture-portrait.png` | `180 × 320`, opaque, deterministic pixels | Portrait ratio `9:16`. |
| `tests/fixtures/picture-square.png` | `256 × 256`, opaque, deterministic pixels | Square ratio `1:1`. |
| `tests/fixtures/exhibit.obj` | One triangulated low-poly mesh centered away from origin | OBJ parsing, recentering, normalization, fallback material. |
| `tests/fixtures/ambient.ogg` | Short loopable mono audio, less than `100 KiB` | Web Audio load, loop, crossfade, disposal. |

The source repository stores only compact fixtures. The performance gallery is generated in the browser by cloning fixture references; it does not duplicate binaries on disk.

### 4.2 Snapshot factories

Test support exposes pure factories inside the individual test modules rather than a global untyped fixture bag:

```ts
createGallerySnapshot(overrides?: Partial<GallerySnapshot>): GallerySnapshot;
createRoomSnapshot(overrides?: Partial<GalleryRoomSnapshot>): GalleryRoomSnapshot;
createPictureSnapshot(overrides?: Partial<GalleryPictureSnapshot>): GalleryPictureSnapshot;
createLocalAssetRef(kind: AssetKind, assetId?: AssetId): LocalAssetRef;
```

Defaults always form a valid domain snapshot. Invalid-state tests override exactly one field so the failing invariant remains identifiable.

### 4.3 Application doubles

- `InMemoryGalleryStore` clones every input and output, stages commits, and either commits all changes or simulates one atomic failure. It records `commitCalls`, `readAssetCalls`, and asset state.
- `FakeClock` returns a controlled ISO time and filename timestamp.
- `FixedIdGenerator` consumes independent deterministic queues for gallery, room, picture, and asset ids; queue exhaustion fails the test.
- `FakeArchivePort` records archive calls and returns an explicitly supplied `ImportedRoomPackage`.
- Browser APIs not implemented by the test environment are replaced per test and restored in `afterEach`; no mutable mock remains global.

## 5. Static Validation

### 5.1 Type and build checks

`npm run typecheck` must report zero TypeScript diagnostics. The strict compiler contract in `SP2` is mandatory; tests must not relax it through a second permissive config.

`npm run build` must produce:

- `dist/index.html`;
- hashed JS/CSS assets;
- no source map unless explicitly enabled for a diagnostic build;
- no server module, API route, secret, or runtime environment dependency;
- no absolute deployment base that prevents static hosting from a subdirectory.

### 5.2 Layer import audit

`scripts/audit-layer-imports.mjs` walks `.ts` files under `src`, resolves relative and configured alias imports, and rejects:

- any import from `src/domain` to `application`, `presentation`, `infrastructure`, or `bootstrap`;
- any import from `src/application` to `presentation`, `infrastructure`, or `bootstrap`;
- any import of `three`, `three/addons/*`, DOM globals, IndexedDB, fflate, or browser adapters from `domain` or `application`;
- direct IndexedDB/archive imports from `presentation`;
- use-case construction outside `src/bootstrap/createApplicationContainer.ts`;
- a path not declared in `SP4`.

The script exits nonzero and prints `source → forbidden target → violated rule` for every finding.

### 5.3 Dependency audit

The committed dependency set is exact:

- Runtime: `three`, `fflate`.
- Development: `typescript`, `vite`, `vitest`, `@vitest/coverage-v8`, `happy-dom`, `fake-indexeddb`, `@playwright/test`, and `@axe-core/playwright`.

A validation script or review compares `package.json` against this allowlist. A new dependency blocks V3/NFRE18 until documented.

## 6. Domain Unit Matrix

### 6.1 `Gallery.test.ts`

Required cases:

1. Create gallery with normalized name, schema version, revision `0`, empty rooms, and supplied timestamps.
2. Reject blank/oversized name and invalid ids/timestamps.
3. Rehydrate valid snapshot without changing values or order.
4. Reject unsupported schema version and duplicate room ids.
5. Rename changes name, increments revision once, and updates `updatedAt` only.
6. Rename to the same normalized name is a no-op and does not increment revision.
7. Add room preserves insertion order and rejects duplicate id.
8. Generate sequential default name using the lowest positive unused ordinal.
9. Remove known room returns it and increments revision.
10. Remove unknown room throws `ROOM_NOT_FOUND` without mutation.
11. Returned snapshots are detached; modifying a returned array/object cannot mutate the aggregate.

### 6.2 `GalleryRoom.test.ts`

Required cases:

1. Create room with normalized title, defaults, empty picture list.
2. Reject duplicate picture ids when rehydrating.
3. Add, update, and delete a picture while preserving deterministic order.
4. Reject unknown picture mutation with `PICTURE_NOT_FOUND`.
5. Update all environment fields and preserve pictures.
6. Reset restores exact defaults, preserves current name/pictures, and clears description.
7. Object scale accepts `0`, `1`, and `10`; rejects negative, greater than ten, NaN, and infinity.
8. Color, texture, audio, and object asset kinds cannot be assigned to an incompatible field.
9. Snapshot output contains plain serializable values and no `Blob`, `URL`, method, or class instance.

### 6.3 `SpectatorReadinessPolicy.test.ts`

Required cases:

1. Empty gallery returns `GALLERY_HAS_NO_ROOMS`.
2. Room with `0`, `1`, and `2` pictures returns `ROOM_REQUIRES_AT_LEAST_THREE_PICTURES`.
3. Room with three pictures and no object returns `ROOM_REQUIRES_CENTRAL_OBJECT`.
4. Ready room has no structural issue.
5. Multiple room issues preserve room order and issue priority.
6. Scale zero does not remove readiness because the object remains configured.

### 6.4 Value object coverage

Value object behavior may be exercised through the files above or dedicated colocated tests only after updating `SP4`. Coverage must include:

- UUID validation and opaque id constructors;
- lowercase/uppercase hex normalization to `#RRGGBB`;
- required name whitespace collapse and length boundary;
- image dimensions positive finite integers;
- external links restricted to `http:` and `https:` with no embedded credentials;
- local/remote asset ref kind correctness;
- description/link-label max length;
- filename slug safety.

## 7. Application Unit Matrix

### 7.1 `GalleryCommitPlanner.test.ts`

Required cases:

1. Initial snapshot with new assets yields puts and no deletes.
2. Replacing an unshared local asset yields one put and old-id delete.
3. Replacing a shared asset does not delete the old id while another ref remains.
4. Removing final reference yields delete.
5. Remote references never produce asset puts/deletes.
6. Duplicate `newAssets` ids fail before store access.
7. An id cannot exist in both put and delete collections.
8. Output order is deterministic independent of map/set insertion behavior.

### 7.2 `ImportRoom.test.ts`

Required cases:

1. Import valid room regenerates room, picture, and local asset ids.
2. Every remapped local reference points to the matching imported blob.
3. Picture order and intrinsic dimensions remain unchanged.
4. Name collision produces deterministic suffixed name.
5. Imported package with missing blob, extra blob, duplicate id, incompatible asset kind, or unsupported schema fails before commit.
6. Archive read failure maps to `ARCHIVE_INVALID` and does not commit.
7. Store commit failure leaves previous gallery unchanged.

### 7.3 Remaining use cases

Each use case declared in `SP3` requires at least success, validation failure, dependency failure, and no-partial-state coverage. Cases may live in focused files only after `SP4` is updated; until then they are grouped in the nearest application test file. Minimum observations:

- `InitializeGallery`: existing load versus default creation.
- `RenameGallery`: no-op versus persisted rename.
- `CreateRoom`: preferred name versus sequential default.
- `DeleteRoom`/`DeletePicture`: orphan cleanup.
- `ResetRoom`: exact preserved fields.
- `UpdateRoomConfiguration`: keep/remove/replace semantics for texture, sound, and OBJ.
- `AddPicture`/`UpdatePicture`: metadata read before commit and source replacement semantics.
- `ExportRoom`/`ExportGallery`: collect local assets once, preserve remote refs, and never mutate state.
- `CheckSpectatorReadiness`: structural and missing-local-asset issues merged deterministically.

## 8. Geometry and Collision Unit Matrix

### 8.1 `PictureLayoutPlanner.test.ts`

For landscape, portrait, and square fixtures:

- computed plane width/height preserve native ratio with relative error below `0.001`;
- neither dimension exceeds configured maximum;
- frame outer dimensions include exact border/mat constants;
- invalid zero/negative/native dimensions fail;
- repeated calls with the same input produce deep-equal plans.

### 8.2 `RoomLayoutPlanner.test.ts`

For every `N` from `3` through `32`:

- produce exactly `N` logical sides, `N` picture transforms, one door/vestibule plan, and a closed floor polygon;
- open one vertex by trimming only its adjacent wall segments;
- no wall segment is zero/negative length;
- every picture center lies on its assigned side and faces the room interior;
- door clear width and clear height satisfy constants;
- apothem/radius satisfy `SP7` formulas within floating-point tolerance;
- pedestal and avatar observation circles do not overlap walls at declared spawn/observation points;
- colliders correspond to visible wall pieces and pedestal;
- layouts for `N=2`, NaN dimensions, or impossible constants fail with typed diagnostics.

### 8.3 `GalleryLayoutPlanner.test.ts`

Required cases:

1. One room produces one corridor opening and bounded length.
2. Rooms alternate right/left according to index.
3. Adjacent room bounding circles do not overlap after spacing.
4. Corridor wall segments contain door gaps and no unintended gaps.
5. Room transforms preserve local entrance orientation.
6. Gallery length grows monotonically with room count/diameter.
7. Empty input is rejected because Spectator cannot start.
8. Plan output remains serializable and does not contain Three.js classes.

### 8.4 Collision assertions

`CollisionWorld` receives focused unit coverage during S12 or in `RoomLayoutPlanner.test.ts` only when updated in `SP4`. It must verify:

- circle versus wall segment separation;
- circle versus pedestal AABB/circle separation;
- sliding along a wall rather than stopping both axes;
- iterative resolution of a corner;
- no movement when delta is zero;
- maximum iteration guard and finite output;
- spawn validation.

## 9. Infrastructure Integration Matrix

Integration tests run with `fake-indexeddb` for deterministic transaction semantics and one Playwright browser test for native IndexedDB behavior.

### 9.1 IndexedDB store

Required cases:

1. Upgrade from absent DB creates `galleries`, `assets`, and `meta` stores plus declared indices.
2. `loadCurrent` returns null before initialization.
3. Commit writes snapshot, current key, and assets atomically.
4. Commit delete removes only listed assets.
5. Simulated abort leaves prior snapshot/assets intact.
6. `readAssets` returns a map for found ids and omits missing ids without reordering requested found entries.
7. `hasAssets` returns explicit true/false per requested id.
8. `versionchange` closes cached connection.
9. Records contain plain data and correctly reconstructed `Blob` metadata.

### 9.2 Archive adapter

Required cases:

1. `.t3room` and `.t3gallery` contain one normalized manifest and deterministic paths.
2. Every local asset has size, kind, MIME, safe filename, and SHA-256 entry.
3. Round-trip preserves snapshot JSON and bytes exactly.
4. Remote refs appear in JSON but no remote asset entry/file is created.
5. Reject path traversal, absolute paths, duplicate normalized paths, undeclared files, missing files, wrong checksums, invalid JSON, unknown kind/version, oversized decompressed total, and zip bombs exceeding declared limits.
6. Archive parser returns no domain entity; it returns the DTO declared in `SP3`.

### 9.3 Browser adapters

Required observations:

- `BrowserImageMetadataReader` reads all three fixture ratios and revokes temporary local URLs on success/error.
- `ObjectUrlRegistry` reuses a URL for the same asset within a scope, keeps independent scope ownership, revokes once after final release, and tolerates repeated release.
- `BrowserAssetUrlResolver` returns remote URL unchanged and fails when local asset is absent.
- `BrowserDownloadService` creates one hidden anchor, assigns filename, clicks it, removes it, and revokes the URL.
- `BrowserStorageQuota` normalizes missing estimates to null values and computes ratio only with finite positive quota.

## 10. Presentation Component Validation

Critical DOM components receive unit/integration coverage or E2E assertions:

- `ModalFrame`: focus enters first actionable control, cycles inside, `Escape` follows dismiss policy, previous focus returns after close, background is not interactive.
- `ConfirmDialog`: resolves once to true/false; backdrop and `Escape` resolve false; no callback is invoked twice.
- `GalleryTitleEditor`: click reveals input; Enter/blur save one normalized value; Escape cancels; rejected save restores value and reports error.
- `EditorStore`: serializes mutations FIFO, emits pending state, ignores stale async completions, and refreshes snapshot only after durable commit.
- `PictureGrid`: card count/order matches selected room; square container does not force image crop.
- `PictureEditorModal` and `RoomConfigModal`: field validation prevents confirmation; `NO` leaves state unchanged; pending operations disable all mutating buttons.
- `ResponsiveEditorGuard`: layout renders at `1024 px` and warning replaces it at `1023 px`.
- all icon-only controls expose exact `aria-label`, visible tooltip on hover/focus, and disabled semantics.

## 11. End-to-End Scenarios

### 11.1 `home-editor.spec.ts`

Scenario A — first launch:

1. Clear origin storage.
2. Open `/`.
3. Assert animated `Mi Galería`, `ESPECTADOR`, and `ADMINISTRADOR`.
4. Select `ESPECTADOR`; assert readiness dialog and no canvas.
5. Close dialog, open `ADMINISTRADOR`, and verify exact layout dimensions.

Scenario B — edit gallery:

1. Rename gallery through inline editor.
2. Create room; confirm selection and initial modal.
3. Cancel save with `NO`; verify no unintended mutation.
4. Configure required environment and local OBJ; save with `SÍ`.
5. Add three local fixture images with names/descriptions/one link.
6. Reload page; verify gallery, room, images, order, and values persist.
7. Edit one picture; reject with `NO`, then save with `SÍ` and verify only final data.
8. Delete a picture, cancel once, confirm once, and verify readiness becomes blocked.

### 11.2 `room-archive.spec.ts`

1. Build a complete room with local image/texture/audio/OBJ and one remote image route.
2. Export `.t3room`; capture download and inspect extension/nonzero bytes.
3. Delete original room.
4. Import downloaded archive; verify remapped ids, preserved values/order, and working previews.
5. Export gallery and verify `.t3gallery` extension.
6. Import crafted corrupt room archives for wrong checksum and traversal path; assert visible error and unchanged room count/storage.

### 11.3 `spectator.spec.ts`

1. Seed a ready gallery through the UI or deterministic IndexedDB helper exposed only in test build.
2. Return home and click `ESPECTADOR`; verify one canvas and pointer-lock prompt.
3. Capture pointer, move along corridor with keyboard, and enter target room.
4. Assert room label text equals title.
5. Verify active environmental color and audio state through runtime diagnostics exposed under `window.__T3DG_TEST__` only when `import.meta.env.MODE === 'test'`.
6. Position avatar at the deterministic picture observation point; verify HUD appears within `300 ms`, shows optional description/link, and link has target/rel contract.
7. Rotate away or move beyond `3.2 m`; verify HUD fades out.
8. Verify object normalization, rotation delta, spotlight activation, and nonzero trail particles through diagnostics.
9. Press Escape and return home; assert canvas/runtime resources are disposed.

### 11.4 `lifecycle.spec.ts`

Repeat ten cycles of Home → Editor → Home → Spectator → Home. After each cycle read test-only counters:

- active RAF loops;
- registered window/document listeners;
- object URL scopes/URLs;
- active audio nodes/sources;
- renderer instances and live tracked Three resources.

Final values must equal the initial baseline. Heap size is diagnostic only because browser GC timing is nondeterministic; a monotonic resource counter is a failure.

### 11.5 `performance.spec.ts`

1. Run only on desktop Chromium, viewport `1920 × 1080`, DPR forced to at most `2`, no devtools, production preview build.
2. Seed `8` rooms × `12` pictures, one low-poly OBJ per room, fixture audio, and textures derived from compact images.
3. Warm up for `5 s` while moving through corridor.
4. Sample `10 s` in corridor, active room, and doorway transition using `RuntimePerformanceMonitor`.
5. Combine samples and assert p95 frame time `≤22.2 ms`, no more than three expensive rooms active, no long task over `200 ms`, and no WebGL context loss.
6. Store metrics as Playwright attachment; do not commit generated reports.

## 12. Accessibility Validation

Automated and manual checks:

- no critical automated accessibility violation on home, editor, each modal, readiness dialog, and spectator HUD;
- heading/landmark order is logical;
- icon buttons have accessible names independent of tooltip;
- all editor operations can be completed with keyboard;
- focus is visible and never lost behind a modal;
- `aria-live` announces persistence error, readiness status, active room, and focused picture without flooding each animation frame;
- animations/transitions collapse to immediate or minimal duration with `prefers-reduced-motion: reduce`;
- color is not the only indicator of selected/pending/error state;
- canvas has a textual label and adjacent control instructions; the HUD duplicates meaningful picture content in DOM.

A manual keyboard pass remains mandatory because automated tooling cannot prove interaction order or focus intent.

## 13. Security and Failure Injection

The validation suite injects:

- invalid protocols (`javascript:`, `data:`, `file:` where prohibited);
- remote CORS failure and HTTP error;
- malformed/oversized local file;
- missing image dimensions;
- corrupt OBJ;
- suspended audio context;
- rejected IndexedDB transaction and quota error;
- missing asset referenced by snapshot;
- archive traversal/checksum/version/schema failures;
- unavailable WebGL and synthetic `webglcontextlost`;
- pointer-lock denial;
- rapid repeated clicks that attempt concurrent commits.

Every failure must produce an `ApplicationError` or runtime diagnostic with a stable code, a Spanish actionable message, no raw stack trace in UI, and no partial persistent mutation.

## 14. Coverage and Passing Thresholds

Coverage is a diagnostic, not a substitute for mapped behavior. The minimum accepted values are:

- domain and application: `90%` statements/branches/functions/lines;
- pure geometry and collision: `95%` statements and `90%` branches;
- infrastructure: `80%` statements and `75%` branches;
- presentation DOM/Three orchestration: no global numeric threshold; all FR-critical paths must be represented by E2E scenarios.

No snapshot-only UI test can satisfy a functional requirement. Flaky retries are disabled locally; CI may retry one browser failure only after retaining trace/video and must still report the initial failure.

## 15. Requirement-to-Test Traceability

| Validation gate | Primary automated evidence | Required manual evidence |
| --- | --- | --- |
| V1 | document/link validation script | inspect preserved template comments |
| V2 | `audit-layer-imports.mjs` | architecture review |
| V3 | `npm ci`, typecheck, build | open static preview |
| V4 | domain/application unit suites | none |
| V5 | store integration + Editor E2E | reload persistence pass |
| V6 | archive integration + room archive E2E | inspect one exported package |
| V7 | Playwright computed dimensions | desktop visual pass |
| V8 | modal component/E2E tests | keyboard/focus pass |
| V9 | picture/geometry unit tests | inspect three ratios in Editor/3D |
| V10 | room planner parameterized suite | inspect 3-, 4-, and 12-wall rooms |
| V11 | planner/collision assertions | walk around pedestal |
| V12 | gallery planner + spectator E2E | traverse every doorway |
| V13 | runtime diagnostics + spectator E2E | visual exhibit/effect pass |
| V14 | controller/collision tests + E2E | keyboard movement pass |
| V15 | camera obstruction test | doorway/corner camera pass |
| V16 | focus system + spectator E2E | verify HUD readability |
| V17 | audio system instrumentation | audible crossfade pass |
| V18 | performance E2E | observe representative device |
| V19 | lifecycle E2E counters | browser task-manager sanity check |
| V20 | accessibility automation | full keyboard and reduced-motion pass |
| V21 | archive/security failure tests | none |
| V22 | build artifact/import audit | serve `dist` statically |
| V23 | combined E2E flow | final acceptance walkthrough |

## 16. Release Acceptance Procedure

The release executor performs, in order:

1. Delete `node_modules`, `dist`, Playwright output, coverage, and local IndexedDB test state.
2. Run `npm ci` under Node `22.12+`.
3. Run `npm run validate` with all tests and production build.
4. Serve `dist` through Vite preview and through a generic static HTTP server to prove backend independence.
5. Complete the manual checks mapped above.
6. Record each V1–V23 result in `docs/acceptance.md` with command, date, browser, result, and evidence path.
7. Mark S15 complete only when every gate is `PASS`; a known failure remains `BLOCKED`, never silently waived.
