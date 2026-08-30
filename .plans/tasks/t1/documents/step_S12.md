# SP6 — Spectator Runtime, Controls, Collision, HUD, Audio and Lifecycle

## 1. Runtime Entry Contract

`SpectatorScreen` may be constructed only with a readiness-approved gallery snapshot and a user-activation token produced by the Home button click.

```ts
interface SpectatorActivationToken {
  readonly createdAt: number;
  readonly originatedFromUserGesture: true;
}

interface SpectatorScreenDependencies {
  readonly gallery: GallerySnapshot;
  readonly activationToken: SpectatorActivationToken;
  readonly assetUrlResolver: AssetUrlResolver;
  readonly galleryStore: GalleryStore;
  readonly onExit: () => void;
}
```

Mount sequence:

1. Render canvas host, controls hint, HUD and status overlay.
2. Check WebGL availability.
3. Create `ThreeGalleryRuntime` and register event callbacks.
4. Build layout and world while overlay reports progress.
5. Resume/create audio context inside the original activation handler chain where browser permits; otherwise require one additional explicit `ACTIVAR SONIDO` click.
6. Start runtime only after required geometry and avatar exist.
7. Hide loading overlay; leave asset-specific warnings visible as toasts/status.

## 2. Coordinate System and Units

- World units represent meters.
- `+Y` is up.
- Corridor longitudinal axis is `+Z`.
- Corridor left is `-X`; right is `+X`.
- Avatar spawn: `(0, 0, 2.5)` facing `+Z`.
- Floor surfaces lie at `Y=0`.
- Camera uses `PerspectiveCamera(55°, aspect, 0.05, far)` where far derives from world length plus `30 m`.

## 3. Scene Composition

`ThreeGalleryRuntime` owns one `SceneContext`:

```ts
interface SceneContext {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
  readonly audioListener: THREE.AudioListener;
  readonly root: THREE.Group;
  readonly ambientLight: THREE.AmbientLight;
  readonly corridorLight: THREE.DirectionalLight;
}
```

Scene root children:

```text
root
├── corridorGroup
├── roomsGroup
├── exhibitsGroup
├── effectsGroup
├── avatarGroup
└── debugGroup (development only, disabled by default)
```

## 4. Renderer Configuration

```ts
new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
```

Required settings:

- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
- `renderer.outputColorSpace = THREE.SRGBColorSpace`.
- `renderer.toneMapping = THREE.ACESFilmicToneMapping`.
- `renderer.toneMappingExposure = 1.0`.
- `renderer.shadowMap.enabled = true`.
- Only active pedestal spotlight casts shadow.
- Resize uses `ResizeObserver` on host; no per-frame size checks.
- `setAnimationLoop` or a single RAF owned by runtime; no nested loops.

## 5. Input Controller

```ts
interface InputState {
  readonly forward: number; // -1..1
  readonly strafe: number;  // -1..1
  readonly sprint: boolean;
  readonly lookDeltaX: number;
  readonly lookDeltaY: number;
  readonly pointerLocked: boolean;
}
```

Mappings:

| Action | Keys/input |
| --- | --- |
| Forward | `W`, `ArrowUp` |
| Back | `S`, `ArrowDown` |
| Left strafe | `A`, `ArrowLeft` |
| Right strafe | `D`, `ArrowRight` |
| Sprint | `ShiftLeft`, `ShiftRight` |
| Look | mouse movement while pointer locked |
| Capture | primary click on canvas/controls hint |
| Release | `Escape` through Pointer Lock API |

Rules:

- Ignore keyboard when modal/overlay contains focused input or when document is hidden.
- Clear all pressed state on `blur`, `visibilitychange`, pointer-lock loss and dispose.
- Normalize diagonal vector so speed does not increase.
- Consume/reset mouse deltas once per update.

## 6. Avatar Rig

`AvatarBuilder` creates a neutral stylized mannequin from Three.js primitives, not an external asset.

```ts
interface AvatarRig {
  readonly root: THREE.Group;
  readonly body: THREE.Object3D;
  readonly leftArmPivot: THREE.Group;
  readonly rightArmPivot: THREE.Group;
  readonly leftLegPivot: THREE.Group;
  readonly rightLegPivot: THREE.Group;
  readonly eyeAnchor: THREE.Object3D;
  readonly cameraTarget: THREE.Object3D;
}
```

Dimensions:

- Total height: `1.8 m`.
- Collision circle radius: `0.35 m`.
- Eye height: `1.62 m`.
- Camera target height: `1.45 m`.
- Base foot point is avatar root Y=0.

Animation:

- Idle: subtle vertical breathing amplitude `0.015 m`.
- Walk limb swing max `22°` at `5.5 rad/s`.
- Sprint limb swing max `30°` at `8 rad/s`.
- Animation is visual only and never alters collider.

## 7. Third-person Movement

Constants:

- Walk speed: `2.8 m/s`.
- Sprint speed: `5.2 m/s`.
- Acceleration: `18 m/s²`.
- Deceleration: `22 m/s²`.
- Rotation smoothing: exponential half-life `0.08 s`.
- Delta clamp: `0.05 s`.

Algorithm:

1. Convert input vector from camera yaw basis to world XZ direction.
2. Smooth current planar velocity toward target velocity.
3. Face avatar toward non-zero movement direction; when stationary, mouse yaw still rotates camera orbit but not avatar until movement resumes.
4. Predict position `p + velocity * dt`.
5. Resolve collider iteratively against static world.
6. Apply resolved position.
7. Update avatar animation from actual resolved speed.

No gravity/jump is implemented because all floors are coplanar.

## 8. Static Collision World

```ts
type StaticCollider =
  | {
      readonly kind: 'segment';
      readonly a: Vec2;
      readonly b: Vec2;
      readonly normal: Vec2;
      readonly bounds: Aabb2;
    }
  | { readonly kind: 'aabb'; readonly min: Vec2; readonly max: Vec2 };

interface CircleBody {
  readonly center: Vec2;
  readonly radius: number;
}
```

Sources:

- Corridor wall segments excluding door openings.
- Room wall segments excluding vertex opening.
- Vestibule side walls.
- Pedestal AABB/circle approximation.
- World end caps.

Resolution:

1. Broad phase rejects colliders whose expanded AABB does not contain center.
2. Circle-segment uses closest point projection.
3. Penetration vector pushes circle outward by depth plus epsilon `0.001`.
4. Circle-AABB resolves along minimum penetration axis.
5. Repeat max `4` passes.
6. If still penetrating, revert to last valid position and emit diagnostic.

## 9. Third-person Camera

Defaults:

- Desired distance: `4.5 m`.
- Desired height offset from target: `1.1 m`.
- Shoulder X offset: `0.35 m`.
- Minimum distance under obstruction: `1.0 m`.
- Pitch range: `-20°..55°`.
- Mouse sensitivity: `0.0022 rad/pixel`.
- Follow smoothing half-life: `0.09 s`.

Algorithm:

1. Maintain yaw/pitch state.
2. Compute desired camera position around `cameraTarget`.
3. Raycast from target to desired position against wall/pedestal meshes on `CAMERA_COLLISION_LAYER`.
4. If hit, set distance to `max(minDistance, hit.distance - 0.18)`.
5. Smooth actual position toward corrected position.
6. Look at target plus small forward anticipation based on avatar velocity.

Picture focus does not use camera ray because camera is behind avatar; it uses `eyeAnchor` and avatar forward.

## 10. Room Activation

`RoomActivationSystem` receives room floor polygons and avatar XZ.

```ts
interface RoomActivationState {
  readonly currentRoomId: RoomId | null;
  readonly activeRoomIds: ReadonlySet<RoomId>;
}
```

Rules:

- Current room is first polygon containing avatar point; no overlaps are permitted by planner.
- Corridor yields `currentRoomId=null`.
- Expensive effects activate for current room plus at most two rooms with nearest door-center distance.
- Enter/exit hysteresis: point must remain in new zone `120 ms` before current id changes.
- Activation changes emit once and drive environment/audio systems.

## 11. Environment and Lighting

Scene lights:

- One global `AmbientLight` for corridor/active room.
- One low-intensity `DirectionalLight` for corridor readability, fixed neutral color.
- One `SpotLight` per built exhibit, but only active-set lights have intensity >0; only current room casts shadow.

Transition:

- Corridor target: color `#FFFFFF`, ambient `0.55`.
- Room target: configured light color/intensity.
- Color interpolates in linear color space over `500 ms`.
- Intensity interpolates over `500 ms`.
- Spotlight target uses configured color/intensity; inactive target 0.
- Wall materials retain configured color/texture and receive low emissive tint (`<=0.08`) derived from room light so distant rooms remain identifiable.

## 12. Room Audio

`RoomAudioSystem` uses a single `AudioListener` attached to camera and two global `THREE.Audio` channels for crossfade.

Rules:

- Room sound loops.
- Current room target volume is configured `0..1`.
- Corridor target is silence.
- Crossfade duration `600 ms` using linear ramp on gain.
- When changing A→B, B loads before A fades fully; if B fails, A fades to silence and diagnostic emits.
- Cache decoded buffers only within runtime and only for active/nearest rooms.
- Remote/local URLs are resolved through runtime scope.
- Dispose stops sources, disconnects nodes, clears buffers and releases scope.

Autoplay:

- `resumeAudio()` is called from the user activation flow.
- If context remains suspended, HUD shows `ACTIVAR SONIDO`; click retries.
- Runtime continues silently if user declines.

## 13. Central Exhibit

OBJ load pipeline:

1. Resolve URL.
2. `OBJLoader.loadAsync`.
3. Traverse child meshes.
4. Reject object with zero meshes or empty bounding box.
5. Replace absent/unsupported material with `MeshStandardMaterial`.
6. Compute world-aligned bounding box.
7. Translate object so X/Z center is origin and minimum Y=0.
8. Compute `baseScale = 1.6 / max(size.x, size.y, size.z)`.
9. Apply `baseScale * configuredScale` to exhibit root.
10. Position root on pedestal top.
11. Register rotation and trail handles.

Rotation: `0.35 rad/s` around Y, independent of frame rate.

Scale `0`:

- root visible false;
- trail disabled;
- spotlight intensity 0;
- object remains loaded/configured and readiness passes.

Fallback:

- Error polyhedron: `IcosahedronGeometry(0.65, 1)` with wireframe material.
- Diagnostic includes room name and source type, not remote credentials.

## 14. Trail Effects

Each exhibit owns three orbital trails when active:

- Three `THREE.Points` objects.
- `64` samples per trail in preallocated `Float32Array`.
- Orbit radii `0.9`, `1.15`, `1.4 m` multiplied by visual exhibit scale clamp `[0.5, 2.5]`.
- Angular speeds `0.8`, `-1.05`, `1.25 rad/s`.
- Vertical sinusoidal amplitude `0.25 m`.
- Additive blending, depth write false, opacity decays by vertex color/alpha strategy supported by material.
- No arrays are allocated per frame.
- Inactive trails are hidden and not updated.

## 15. Picture Focus and HUD

Picture mesh metadata:

```ts
interface PictureMeshMetadata {
  readonly roomId: RoomId;
  readonly pictureId: PictureId;
  readonly centerWorld: THREE.Vector3;
  readonly normalWorld: THREE.Vector3;
  readonly hitObject: THREE.Object3D;
}
```

Evaluation sequence every `100 ms`:

1. Limit to pictures in current room.
2. Compute eye-to-center distance and reject >3.2 m.
3. Compute dot with avatar forward and reject below `cos(18°)`.
4. Reject if picture normal faces away from avatar.
5. Sort remaining by distance.
6. Raycast eye→center on occlusion layers.
7. Accept only when first relevant intersection belongs to candidate frame/image.
8. Apply 120 ms stability debounce.
9. Emit focus change only when picture id changes or becomes null.

HUD DOM:

```html
<aside class="picture-info-hud" aria-live="polite" hidden>
  <h2 class="picture-info-hud__title"></h2>
  <p class="picture-info-hud__description"></p>
  <a class="picture-info-hud__link" target="_blank" rel="noopener noreferrer"></a>
</aside>
```

- Description node hidden when empty.
- Link node hidden when absent.
- Enter/leave classes trigger CSS transition.
- `hidden` is applied only after leave transition finishes.
- Link click releases pointer lock first, then opens the URL.

## 16. Runtime Diagnostics

```ts
type RuntimeDiagnosticSeverity = 'info' | 'warning' | 'fatal';

interface RuntimeDiagnostic {
  readonly severity: RuntimeDiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly roomId: RoomId | null;
  readonly assetId: AssetId | null;
}
```

- Warnings: asset fallback, audio unavailable, large frame time, collision rollback.
- Fatal: WebGL unavailable/context lost unrecoverable, renderer construction failure, core scene build failure.
- Warning does not stop loop.
- Fatal pauses loop, shows overlay and provides `VOLVER AL INICIO`.

## 17. Lifecycle and Dispose Order

`ThreeGalleryRuntime.dispose()` is idempotent and executes:

1. Stop animation loop.
2. Disable input and remove pointer-lock listeners.
3. Release pointer lock when owned.
4. Stop/disconnect audio.
5. Dispose room systems and trail buffers.
6. Dispose geometries/materials/textures recursively.
7. Remove canvas/context listeners and `ResizeObserver`.
8. Release runtime asset URL scope.
9. Remove renderer canvas from host.
10. Call `renderer.dispose()` and `renderer.forceContextLoss()` only during final teardown, not ordinary pause.
11. Clear event subscribers and references.

`SpectatorScreen.dispose()` first unsubscribes HUD/diagnostics, then awaits runtime dispose, then disposes child DOM components.

## 18. Context Loss

`WebGlContextGuard`:

- Before build, creates a probe canvas or checks renderer context.
- On `webglcontextlost`, calls `preventDefault`, pauses runtime and shows fatal-recoverable overlay.
- On `webglcontextrestored`, v1 does not attempt partial resource resurrection; it offers `RECARGAR ESCENA`, which disposes and rebuilds from the unchanged snapshot.
- If rebuild fails, return Home.

## 19. Performance Instrumentation

`RuntimePerformanceMonitor` samples frame durations after first `5 s` warm-up:

```ts
interface FrameMetricsSnapshot {
  readonly sampleCount: number;
  readonly averageMs: number;
  readonly p95Ms: number;
  readonly maxMs: number;
}
```

- Ring buffer: `600` samples.
- Compute percentile at most once per second.
- Development overlay optional via `?debug=1`.
- Production emits warning after p95 >22.2 ms for 5 consecutive reports; it lowers DPR from 2 to 1.5, then 1 before disabling non-current trails.
- Quality degradation is ordered and reversible only on next runtime start, preventing oscillation.
