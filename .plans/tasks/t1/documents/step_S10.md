# SP12 — Three.js Layout, Runtime and Symbol Contracts

This document is normative for every symbol under `src/presentation/three`. SP6 fixes runtime behavior and SP7 fixes geometry formulas; this specification removes implementation ambiguity from the public APIs, concrete data structures, constructor dependencies, update order and ownership of Three.js resources.

## 1. Constants and Geometry Errors

### 1.1 `src/presentation/three/constants/SceneConstants.ts`

```ts
export const GEOMETRY_EPSILON = 1e-9;
export const COLLIDER_EPSILON = 1e-3;
export const VISUAL_OVERLAP_EPSILON = 0.02;

export const SCENE_CONSTANTS = {
  corridor: {
    width: 6.0,
    height: 4.8,
    wallThickness: 0.18,
    startClearance: 8.0,
    endClearance: 8.0,
    minimumLength: 20.0,
    minimumDoorSpacing: 7.0,
  },
  room: {
    height: 4.8,
    wallThickness: 0.18,
    minimumWallLength: 6.2,
    minimumApothem: 4.6,
    sameSideClearance: 4.0,
  },
  entrance: {
    width: 2.4,
    doorHeight: 3.2,
    frameThickness: 0.18,
    frameDepth: 0.24,
    vestibuleLength: 2.4,
    labelOffsetY: 0.42,
    labelWidth: 3.4,
    labelHeight: 0.72,
  },
  picture: {
    maxInnerWidth: 3.2,
    maxInnerHeight: 2.1,
    frameBorder: 0.12,
    frameDepth: 0.09,
    wallStandoff: 0.06,
    sideMargin: 1.1,
    centerY: 2.35,
    textureMaxDimension: 2048,
  },
  pedestal: {
    radius: 0.9,
    height: 1.05,
    colliderPadding: 0.12,
  },
  avatar: {
    radius: 0.35,
    height: 1.8,
    eyeHeight: 1.62,
    cameraTargetHeight: 1.45,
    breathingAmplitude: 0.015,
    walkSwingDegrees: 22,
    sprintSwingDegrees: 30,
    walkSwingRadiansPerSecond: 5.5,
    sprintSwingRadiansPerSecond: 8.0,
  },
  movement: {
    walkSpeed: 2.8,
    sprintSpeed: 5.2,
    acceleration: 18.0,
    deceleration: 22.0,
    rotationHalfLife: 0.08,
    maximumDeltaSeconds: 0.05,
  },
  camera: {
    fovDegrees: 55,
    near: 0.05,
    farPadding: 30.0,
    desiredDistance: 4.5,
    heightOffset: 1.1,
    shoulderOffsetX: 0.35,
    minimumDistance: 1.0,
    obstructionPadding: 0.18,
    minimumPitchDegrees: -20,
    maximumPitchDegrees: 55,
    mouseSensitivity: 0.0022,
    followHalfLife: 0.09,
  },
  collision: {
    maximumPasses: 4,
    rollbackOnUnresolved: true,
  },
  focus: {
    maxDistance: 3.2,
    maxAngleDegrees: 18,
    intervalMs: 100,
    stableMs: 120,
  },
  activation: {
    stableMs: 120,
    nearestActiveRooms: 2,
  },
  environment: {
    corridorColor: '#FFFFFF',
    corridorAmbientIntensity: 0.55,
    corridorDirectionalIntensity: 0.35,
    transitionMs: 500,
    maximumWallEmissiveIntensity: 0.08,
  },
  audio: {
    crossfadeMs: 600,
  },
  exhibit: {
    normalizedMaxDimension: 1.6,
    rotationRadiansPerSecond: 0.35,
  },
  trail: {
    count: 3,
    samplesPerTrail: 64,
    radii: [0.9, 1.15, 1.4],
    angularSpeeds: [0.8, -1.05, 1.25],
    verticalAmplitude: 0.25,
    minimumScaleFactor: 0.5,
    maximumScaleFactor: 2.5,
  },
  renderer: {
    maximumPixelRatio: 2.0,
    toneMappingExposure: 1.0,
  },
  performance: {
    warmupMs: 5000,
    sampleCapacity: 600,
    reportIntervalMs: 1000,
    warningP95Ms: 22.2,
    consecutiveWarnings: 5,
    degradedPixelRatios: [1.5, 1.0],
  },
} as const;
```

No runtime, planner, builder or test duplicates these numeric literals. Tests import constants and derive expectations from them except tests that prove the constants themselves.

### 1.2 `src/presentation/three/layout/GeometryPlanningError.ts`

```ts
export type GeometryInvariant =
  | 'ROOM_REQUIRES_THREE_PICTURES'
  | 'INVALID_PICTURE_DIMENSIONS'
  | 'ENTRANCE_TRIM_EXCEEDS_WALL'
  | 'INWARD_NORMAL_INVALID'
  | 'VESTIBULE_ALIGNMENT_INVALID'
  | 'DOOR_INTERVAL_OVERLAP'
  | 'ROOM_BOUNDS_OVERLAP'
  | 'ROOM_CROSSES_CORRIDOR'
  | 'PEDESTAL_CLEARANCE_INVALID'
  | 'OBSERVATION_POINT_UNAVAILABLE'
  | 'NON_FINITE_GEOMETRY';

export class GeometryPlanningError extends Error {
  public readonly invariant: GeometryInvariant;
  public readonly roomId: RoomId | null;
  public readonly context: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    invariant: GeometryInvariant,
    roomId: RoomId | null,
    message: string,
    context?: Readonly<Record<string, string | number | boolean | null>>,
  );
}
```

The error never contains Blob contents, full remote URLs with credentials, Three.js objects or circular data.

## 2. Pure Geometry Data

### 2.1 `src/presentation/three/layout/GeometryTypes.ts`

```ts
export interface Vec2 {
  readonly x: number;
  readonly z: number;
}

export interface Segment2 {
  readonly a: Vec2;
  readonly b: Vec2;
}

export interface Aabb2 {
  readonly min: Vec2;
  readonly max: Vec2;
}

export type GallerySide = 'left' | 'right';

export interface PictureLayoutPlan {
  readonly pictureId: PictureId;
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly wallIndex: number;
  readonly center: Vec2;
  readonly centerY: number;
  readonly tangent: Vec2;
  readonly inwardNormal: Vec2;
}

export interface WallLayoutPlan {
  readonly index: number;
  readonly fullSegment: Segment2;
  readonly builtSegment: Segment2;
  readonly inwardNormal: Vec2;
  readonly picture: PictureLayoutPlan;
  readonly adjacentToEntrance: boolean;
}

export interface DoorLayoutPlan {
  readonly corridorCenter: Vec2;
  readonly roomGapLeft: Vec2;
  readonly roomGapRight: Vec2;
  readonly inwardDirection: Vec2;
  readonly width: number;
  readonly height: number;
  readonly label: string;
}

export interface VestibuleLayoutPlan {
  readonly polygon: readonly Vec2[];
  readonly leftWall: Segment2;
  readonly rightWall: Segment2;
}

export interface RoomLayoutPlan {
  readonly roomId: RoomId;
  readonly side: GallerySide;
  readonly center: Vec2;
  readonly sideLength: number;
  readonly circumradius: number;
  readonly apothem: number;
  readonly vertices: readonly Vec2[];
  readonly floorPolygon: readonly Vec2[];
  readonly walls: readonly WallLayoutPlan[];
  readonly door: DoorLayoutPlan;
  readonly vestibule: VestibuleLayoutPlan;
  readonly pedestalCenter: Vec2;
  readonly colliders: readonly StaticCollider[];
  readonly bounds: Aabb2;
}

export interface CorridorLayoutPlan {
  readonly width: number;
  readonly height: number;
  readonly length: number;
  readonly floorPolygon: readonly Vec2[];
  readonly leftWallSegments: readonly Segment2[];
  readonly rightWallSegments: readonly Segment2[];
  readonly endCaps: readonly Segment2[];
  readonly colliders: readonly StaticCollider[];
}

export interface GalleryLayoutPlan {
  readonly corridor: CorridorLayoutPlan;
  readonly rooms: readonly RoomLayoutPlan[];
  readonly worldBounds: Aabb2;
  readonly spawn: {
    readonly position: Vec2;
    readonly yaw: number;
  };
}
```

Every array is ordered deterministically and contains readonly plain objects only.

### 2.2 `src/presentation/three/layout/PolygonMath.ts`

```ts
export function regularPolygonVertices(input: {
  readonly center: Vec2;
  readonly circumradius: number;
  readonly sides: number;
  readonly entryAngle: number;
}): readonly Vec2[];

export function segmentLength(segment: Segment2): number;
export function segmentMidpoint(segment: Segment2): Vec2;
export function outwardNormal(segment: Segment2): Vec2;
export function rotatePoint(point: Vec2, origin: Vec2, radians: number): Vec2;
```

All functions reject non-finite inputs. `regularPolygonVertices` requires integer `sides >= 3`; it returns counterclockwise vertices and never closes the array by repeating vertex zero.

### 2.3 `src/presentation/three/layout/PointInPolygon.ts`

```ts
export function pointInPolygon(point: Vec2, polygon: readonly Vec2[]): boolean;
```

The implementation uses a deterministic ray-crossing rule. A point within `GEOMETRY_EPSILON` of an edge counts as inside, preventing activation flicker on boundaries.

### 2.4 `src/presentation/three/layout/PictureLayoutPlanner.ts`

```ts
export class PictureLayoutPlanner {
  public measure(picture: GalleryPictureSnapshot): {
    readonly innerWidth: number;
    readonly innerHeight: number;
    readonly outerWidth: number;
    readonly outerHeight: number;
  };

  public plan(input: {
    readonly picture: GalleryPictureSnapshot;
    readonly wallIndex: number;
    readonly wallCenter: Vec2;
    readonly tangent: Vec2;
    readonly inwardNormal: Vec2;
  }): PictureLayoutPlan;
}
```

`measure` implements SP7 section 3. `plan` only adds placement/orientation and never mutates or sorts the picture collection.

### 2.5 `src/presentation/three/layout/RoomLayoutPlanner.ts`

```ts
export class RoomLayoutPlanner {
  public constructor(private readonly pictures: PictureLayoutPlanner);

  public measure(room: GalleryRoomSnapshot): {
    readonly sideLength: number;
    readonly circumradius: number;
    readonly apothem: number;
    readonly entranceTrim: number;
  };

  public plan(input: {
    readonly room: GalleryRoomSnapshot;
    readonly side: GallerySide;
    readonly center: Vec2;
    readonly measurement?: {
      readonly sideLength: number;
      readonly circumradius: number;
      readonly apothem: number;
      readonly entranceTrim: number;
    };
  }): RoomLayoutPlan;
}
```

`measure` requires at least three pictures and calculates only translation-independent dimensions. `plan` validates the supplied measurement against the room before using it, then produces the entrance opening, picture placement, floor, bounds and colliders.

### 2.6 `src/presentation/three/layout/GalleryLayoutPlanner.ts`

```ts
export class GalleryLayoutPlanner {
  public constructor(private readonly rooms: RoomLayoutPlanner);
  public plan(gallery: GallerySnapshot): GalleryLayoutPlan;
}
```

The method implements SP7 sections 8–12 in gallery order, validates all bounds and returns one complete plan or throws `GeometryPlanningError`; it never returns a partial plan.

## 3. Collision Contracts

### 3.1 `src/presentation/three/collision/CollisionPrimitives.ts`

```ts
export interface CircleBody {
  readonly center: Vec2;
  readonly radius: number;
}

export type StaticCollider =
  | {
      readonly kind: 'segment';
      readonly a: Vec2;
      readonly b: Vec2;
      readonly normal: Vec2;
      readonly bounds: Aabb2;
    }
  | {
      readonly kind: 'aabb';
      readonly min: Vec2;
      readonly max: Vec2;
    };

export interface CollisionResolution {
  readonly center: Vec2;
  readonly appliedDisplacement: Vec2;
  readonly collided: boolean;
  readonly unresolved: boolean;
  readonly passes: number;
}
```

Planner-created segment colliders include a normalized safe-side normal and precomputed bounds. `appliedDisplacement` is `center - originalCenter`.

### 3.2 `src/presentation/three/collision/CollisionWorld.ts`

```ts
export class CollisionWorld {
  private readonly colliders: readonly StaticCollider[];

  public constructor(colliders: readonly StaticCollider[]);
  public resolve(body: CircleBody, displacement: Vec2): CollisionResolution;
  public containsPenetration(body: CircleBody): boolean;
}
```

`resolve` broad-phases through expanded AABBs, resolves circle/segment and circle/AABB penetration for at most four passes, then rolls back to the original center when unresolved. It allocates no Three.js vectors.

## 4. Runtime Data and Disposal

### 4.1 `src/presentation/three/runtime/ThreeRuntimeTypes.ts`

```ts
export interface SceneContext {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
  readonly audioListener: THREE.AudioListener;
  readonly root: THREE.Group;
  readonly ambientLight: THREE.AmbientLight;
  readonly corridorLight: THREE.DirectionalLight;
}

export interface PictureMeshMetadata {
  readonly roomId: RoomId;
  readonly pictureId: PictureId;
  readonly centerWorld: THREE.Vector3;
  readonly normalWorld: THREE.Vector3;
  readonly hitObject: THREE.Object3D;
}

export interface BuiltRoom {
  readonly snapshot: GalleryRoomSnapshot;
  readonly plan: RoomLayoutPlan;
  readonly root: THREE.Group;
  readonly shell: THREE.Group;
  readonly pedestal: THREE.Group;
  readonly exhibitRoot: THREE.Group;
  readonly spotlight: THREE.SpotLight;
  readonly rotatingExhibit: RotatingExhibit | null;
  readonly trail: TrailEffectHandle | null;
  readonly pictures: readonly PictureMeshMetadata[];
  readonly cameraCollisionObjects: readonly THREE.Object3D[];
}

export interface BuiltGalleryWorld {
  readonly plan: GalleryLayoutPlan;
  readonly corridorGroup: THREE.Group;
  readonly roomsGroup: THREE.Group;
  readonly exhibitsGroup: THREE.Group;
  readonly effectsGroup: THREE.Group;
  readonly avatarGroup: THREE.Group;
  readonly debugGroup: THREE.Group;
  readonly roomsById: ReadonlyMap<RoomId, BuiltRoom>;
  readonly pictureMetadata: readonly PictureMeshMetadata[];
  readonly movementColliders: readonly StaticCollider[];
  readonly cameraCollisionObjects: readonly THREE.Object3D[];
  readonly focusOcclusionObjects: readonly THREE.Object3D[];
}
```

World builders return ownership to `ThreeResourceTracker`; callers treat every field as readonly.

### 4.2 `src/presentation/three/runtime/SceneDisposer.ts`

```ts
export function disposeTexture(
  texture: THREE.Texture,
  visited?: Set<THREE.Texture>,
): void;

export function disposeMaterial(
  material: THREE.Material,
  visitedMaterials?: Set<THREE.Material>,
  visitedTextures?: Set<THREE.Texture>,
): void;

export function disposeObject3D(
  root: THREE.Object3D,
  visitedGeometries?: Set<THREE.BufferGeometry>,
  visitedMaterials?: Set<THREE.Material>,
  visitedTextures?: Set<THREE.Texture>,
): void;
```

`disposeMaterial` inspects every enumerable material property and disposes texture values once. `disposeObject3D` traverses descendants, disposes geometry/materials once and removes children; it does not dispose renderer or externally owned audio context.

### 4.3 `src/presentation/three/runtime/ThreeResourceTracker.ts`

```ts
export class ThreeResourceTracker {
  private readonly objects: Set<THREE.Object3D>;
  private readonly geometries: Set<THREE.BufferGeometry>;
  private readonly materials: Set<THREE.Material>;
  private readonly textures: Set<THREE.Texture>;
  private readonly audio: Set<THREE.Audio>;
  private readonly callbacks: Set<() => void>;
  private disposed: boolean;

  public trackObject<T extends THREE.Object3D>(value: T): T;
  public trackGeometry<T extends THREE.BufferGeometry>(value: T): T;
  public trackMaterial<T extends THREE.Material>(value: T): T;
  public trackTexture<T extends THREE.Texture>(value: T): T;
  public trackAudio<T extends THREE.Audio>(value: T): T;
  public trackCallback(callback: () => void): () => void;
  public releaseObject(value: THREE.Object3D): void;
  public dispose(): void;
}
```

Tracking the same instance twice is harmless. Audio stops/disconnects first, callbacks run second, object trees dispose third, then remaining standalone resources. `dispose` is idempotent.

## 5. Asset Loading

### 5.1 `src/presentation/three/assets/TextureDecodeService.ts`

```ts
export class TextureDecodeService {
  public constructor(
    private readonly fetchRef: typeof fetch,
    private readonly documentRef: Document,
  );

  public decode(url: string): Promise<HTMLCanvasElement>;
}
```

The method fetches with CORS, validates an image response, decodes through `createImageBitmap`, downsizes so neither dimension exceeds `2048 px`, draws into a canvas preserving ratio and closes the bitmap in `finally`. It never appends the canvas to DOM.

### 5.2 `src/presentation/three/assets/TextureFactory.ts`

```ts
export class TextureFactory {
  public constructor(
    private readonly decoder: TextureDecodeService,
    private readonly tracker: ThreeResourceTracker,
    private readonly maxAnisotropy: number,
  );

  public createPictureTexture(url: string): Promise<THREE.CanvasTexture>;
  public createWallTexture(url: string): Promise<THREE.CanvasTexture>;
  public createErrorTexture(label: string): THREE.CanvasTexture;
  public createLabelTexture(label: string): THREE.CanvasTexture;
}
```

All textures use `SRGBColorSpace`, anisotropy `max(1, floor(maxAnisotropy))` obtained once from `renderer.capabilities.getMaxAnisotropy()`, and explicit wrap/filter configuration. Wall texture uses repeat derived from mesh dimensions in `RoomShellBuilder`; picture texture never repeats or crops.

### 5.3 `src/presentation/three/assets/ThreeAssetLoader.ts`

```ts
export class ThreeAssetLoader {
  private readonly scopeId: string;

  public constructor(input: {
    readonly resolver: AssetUrlResolver;
    readonly store: GalleryStore;
    readonly textures: TextureFactory;
    readonly diagnostics: RuntimeDiagnostics;
    readonly audioContext: AudioContext;
    readonly scopeId: string;
  });

  public loadPictureTexture(ref: AssetRef): Promise<THREE.Texture>;
  public loadWallTexture(ref: AssetRef): Promise<THREE.Texture>;
  public loadObject(ref: AssetRef): Promise<THREE.Group>;
  public loadAudioBuffer(ref: AssetRef): Promise<AudioBuffer>;
  public release(): void;

  private resolve(ref: AssetRef): Promise<string>;
  private readAudioBytes(ref: AssetRef): Promise<ArrayBuffer>;
}
```

Kind mismatch fails before I/O. Textures/OBJ use the scoped URL resolver; local audio reads Blob directly from `GalleryStore`, while remote audio uses CORS fetch. OBJ uses the official `OBJLoader` from `three/addons/loaders/OBJLoader.js`. Loader methods reject; builders/systems decide the visual or silent fallback and emit diagnostics.

## 6. Scene Builders

### 6.1 `src/presentation/three/builders/CorridorBuilder.ts`

```ts
export class CorridorBuilder {
  public constructor(private readonly tracker: ThreeResourceTracker);

  public build(plan: CorridorLayoutPlan): {
    readonly root: THREE.Group;
    readonly cameraCollisionObjects: readonly THREE.Object3D[];
    readonly focusOcclusionObjects: readonly THREE.Object3D[];
  };
}
```

The builder creates floor, ceiling, segmented side walls and end caps from plan dimensions only. Door openings remain empty.

### 6.2 `src/presentation/three/builders/DoorFrameBuilder.ts`

```ts
export class DoorFrameBuilder {
  public constructor(private readonly tracker: ThreeResourceTracker);
  public build(plan: DoorLayoutPlan): THREE.Group;
}
```

The group contains left jamb, right jamb and header; it contains no leaf, animation or collider across the opening.

### 6.3 `src/presentation/three/builders/DoorLabelBuilder.ts`

```ts
export class DoorLabelBuilder {
  public constructor(
    private readonly textures: TextureFactory,
    private readonly tracker: ThreeResourceTracker,
  );

  public build(plan: DoorLayoutPlan): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
}
```

The label text is ellipsized on a 2D canvas, faces the corridor and remains unlit/readable. Texture/material/geometry are tracked.

### 6.4 `src/presentation/three/builders/PictureFrameBuilder.ts`

```ts
export class PictureFrameBuilder {
  public constructor(
    private readonly assets: ThreeAssetLoader,
    private readonly textures: TextureFactory,
    private readonly tracker: ThreeResourceTracker,
    private readonly diagnostics: RuntimeDiagnostics,
  );

  public build(input: {
    readonly room: GalleryRoomSnapshot;
    readonly picture: GalleryPictureSnapshot;
    readonly plan: PictureLayoutPlan;
  }): Promise<{
    readonly root: THREE.Group;
    readonly metadata: PictureMeshMetadata;
    readonly occlusionObjects: readonly THREE.Object3D[];
  }>;
}
```

It builds four frame bars plus one image plane. Failure uses an error texture with the same planned dimensions. `metadata.hitObject` points to the image plane and world center/normal are captured after `updateMatrixWorld(true)`.

### 6.5 `src/presentation/three/builders/RoomShellBuilder.ts`

```ts
export class RoomShellBuilder {
  public constructor(
    private readonly assets: ThreeAssetLoader,
    private readonly pictureFrames: PictureFrameBuilder,
    private readonly tracker: ThreeResourceTracker,
    private readonly diagnostics: RuntimeDiagnostics,
  );

  public build(input: {
    readonly room: GalleryRoomSnapshot;
    readonly plan: RoomLayoutPlan;
  }): Promise<{
    readonly root: THREE.Group;
    readonly pictures: readonly PictureMeshMetadata[];
    readonly cameraCollisionObjects: readonly THREE.Object3D[];
    readonly focusOcclusionObjects: readonly THREE.Object3D[];
  }>;
}
```

The builder creates polygon floor/ceiling, built wall segments and vestibule surfaces. Texture failure falls back to `fallbackColor`. Each wall uses the picture at the same index.

### 6.6 `src/presentation/three/builders/PedestalBuilder.ts`

```ts
export class PedestalBuilder {
  public constructor(private readonly tracker: ThreeResourceTracker);

  public build(plan: RoomLayoutPlan): {
    readonly root: THREE.Group;
    readonly cameraCollisionObject: THREE.Object3D;
  };
}
```

The visual pedestal and camera obstruction mesh share dimensions from constants; movement collision already comes from the pure plan.

### 6.7 `src/presentation/three/builders/ObjExhibitBuilder.ts`

```ts
export class ObjExhibitBuilder {
  public constructor(
    private readonly assets: ThreeAssetLoader,
    private readonly trails: TrailEffectSystem,
    private readonly tracker: ThreeResourceTracker,
    private readonly diagnostics: RuntimeDiagnostics,
  );

  public build(input: {
    readonly room: GalleryRoomSnapshot;
    readonly plan: RoomLayoutPlan;
    readonly effectsParent: THREE.Group;
  }): Promise<{
    readonly root: THREE.Group;
    readonly spotlight: THREE.SpotLight;
    readonly rotating: RotatingExhibit | null;
    readonly trail: TrailEffectHandle | null;
  }>;
}
```

The implementation performs the exact normalization pipeline in SP6. Missing/invalid OBJ creates a tracked error icosahedron and still returns a non-null rotating entry. A configured scale of zero returns all resources but sets root/trail/light inactive.

### 6.8 `src/presentation/three/runtime/GallerySceneBuilder.ts`

```ts
export class GallerySceneBuilder {
  public constructor(input: {
    readonly layout: GalleryLayoutPlanner;
    readonly corridor: CorridorBuilder;
    readonly roomShell: RoomShellBuilder;
    readonly doorFrame: DoorFrameBuilder;
    readonly doorLabel: DoorLabelBuilder;
    readonly pedestal: PedestalBuilder;
    readonly exhibit: ObjExhibitBuilder;
    readonly tracker: ThreeResourceTracker;
  });

  public build(input: {
    readonly gallery: GallerySnapshot;
    readonly context: SceneContext;
    readonly onProgress?: (completedRooms: number, totalRooms: number) => void;
  }): Promise<BuiltGalleryWorld>;
}
```

Build order is corridor, then each room in snapshot order. Each completed room is attached atomically. On fatal failure, the tracker disposes all resources and no partial world is returned.

## 7. Exhibit and Trail Systems

### 7.1 `src/presentation/three/systems/TrailEffectSystem.ts`

```ts
export interface TrailEffectHandle {
  readonly root: THREE.Group;
  setActive(active: boolean): void;
  setColor(color: THREE.ColorRepresentation): void;
  update(deltaSeconds: number, elapsedSeconds: number): void;
  dispose(): void;
}

export class TrailEffectSystem {
  private readonly handles: Set<TrailEffectHandle>;

  public constructor(private readonly tracker: ThreeResourceTracker);
  public create(input: {
    readonly center: THREE.Vector3;
    readonly color: THREE.ColorRepresentation;
    readonly visualScale: number;
    readonly parent: THREE.Group;
  }): TrailEffectHandle;
  public update(
    deltaSeconds: number,
    elapsedSeconds: number,
    activeRoomIds: ReadonlySet<RoomId>,
    roomByHandle: ReadonlyMap<TrailEffectHandle, RoomId>,
  ): void;
  public dispose(): void;
}
```

Each handle owns three fixed-size position/color buffers and allocates no per-frame array. Handle disposal removes its root and GPU buffers once.

### 7.2 `src/presentation/three/systems/ExhibitRotationSystem.ts`

```ts
export interface RotatingExhibit {
  readonly roomId: RoomId;
  readonly root: THREE.Object3D;
  readonly radiansPerSecond: number;
}

export class ExhibitRotationSystem {
  private readonly exhibits: Set<RotatingExhibit>;

  public register(exhibit: RotatingExhibit): () => void;
  public update(deltaSeconds: number, activeRoomIds: ReadonlySet<RoomId>): void;
  public clear(): void;
}
```

Only active-room exhibits rotate. The returned unregister callback is idempotent.

## 8. Avatar, Input, Movement and Camera

### 8.1 `src/presentation/three/builders/AvatarBuilder.ts`

```ts
export interface AvatarRig {
  readonly root: THREE.Group;
  readonly body: THREE.Object3D;
  readonly leftArmPivot: THREE.Group;
  readonly rightArmPivot: THREE.Group;
  readonly leftLegPivot: THREE.Group;
  readonly rightLegPivot: THREE.Group;
  readonly eyeAnchor: THREE.Object3D;
  readonly cameraTarget: THREE.Object3D;
}

export class AvatarBuilder {
  public constructor(private readonly tracker: ThreeResourceTracker);
  public build(): AvatarRig;
}
```

The procedural mannequin uses primitives and a neutral palette, has its foot origin at Y=0 and contains no collider mesh.

### 8.2 `src/presentation/three/controls/InputController.ts`

```ts
export interface InputState {
  readonly forward: number;
  readonly strafe: number;
  readonly sprint: boolean;
  readonly lookDeltaX: number;
  readonly lookDeltaY: number;
  readonly pointerLocked: boolean;
}

export class InputController {
  private readonly pressed: Set<string>;
  private lookDeltaX: number;
  private lookDeltaY: number;
  private enabled: boolean;
  private attached: boolean;

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly documentRef: Document,
    private readonly windowRef: Window,
    private readonly onPointerLockChanged: (locked: boolean) => void,
  );

  public attach(): void;
  public sample(): InputState;
  public requestPointerLock(): Promise<void>;
  public releasePointerLock(): void;
  public setEnabled(enabled: boolean): void;
  public clear(): void;
  public dispose(): void;
}
```

`sample` normalizes diagonal movement and consumes mouse deltas exactly once. Event listeners are registered through one AbortController. Text-entry focus, blur and hidden document clear state.

### 8.3 `src/presentation/three/controls/ThirdPersonController.ts`

```ts
export class ThirdPersonController {
  private readonly velocity: THREE.Vector2;
  private readonly lastValidPosition: Vec2;
  private actualSpeedValue: number;

  public constructor(
    private readonly rig: AvatarRig,
    private readonly collision: CollisionWorld,
    private readonly diagnostics: RuntimeDiagnostics,
  );

  public update(input: {
    readonly deltaSeconds: number;
    readonly controls: InputState;
    readonly cameraYaw: number;
  }): void;
  public position(): Vec2;
  public forward(): THREE.Vector3;
  public actualSpeed(): number;
  public reset(position: Vec2, yaw: number): void;
}
```

The controller applies acceleration/deceleration, collision resolution and avatar yaw. It clamps delta through constants and emits `COLLISION_ROLLBACK` when resolution remains unresolved.

### 8.4 `src/presentation/three/controls/ThirdPersonCamera.ts`

```ts
export class ThirdPersonCamera {
  private yawValue: number;
  private pitchValue: number;
  private readonly raycaster: THREE.Raycaster;

  public constructor(input: {
    readonly camera: THREE.PerspectiveCamera;
    readonly target: THREE.Object3D;
    readonly obstructionObjects: readonly THREE.Object3D[];
  });

  public update(input: {
    readonly deltaSeconds: number;
    readonly controls: InputState;
    readonly avatarForward: THREE.Vector3;
    readonly avatarSpeed: number;
  }): void;
  public yaw(): number;
  public pitch(): number;
  public reset(yaw: number, pitch: number): void;
}
```

The raycaster checks only `CAMERA_COLLISION_LAYER`. It shortens the boom on obstruction, smooths position through half-life math and never moves the avatar.

### 8.5 `src/presentation/three/systems/AvatarAnimationSystem.ts`

```ts
export class AvatarAnimationSystem {
  private elapsed: number;

  public constructor(private readonly rig: AvatarRig);
  public update(input: {
    readonly deltaSeconds: number;
    readonly actualSpeed: number;
    readonly sprinting: boolean;
  }): void;
  public reset(): void;
}
```

Animation changes pivots/body only; root transform and collision radius are untouched.

## 9. Room, Environment, Audio and Focus Systems

### 9.1 `src/presentation/three/systems/RoomActivationSystem.ts`

```ts
export interface RoomActivationState {
  readonly currentRoomId: RoomId | null;
  readonly activeRoomIds: ReadonlySet<RoomId>;
}

export class RoomActivationSystem {
  private committedRoomId: RoomId | null;
  private candidateRoomId: RoomId | null;
  private candidateSinceMs: number;
  private stateValue: RoomActivationState;

  public constructor(private readonly rooms: readonly RoomLayoutPlan[]);
  public update(position: Vec2, nowMs: number): RoomActivationState;
  public state(): RoomActivationState;
  public reset(): void;
}
```

The state changes only after `120 ms` stability. Active ids include current plus at most two nearest doors and preserve gallery order in their set insertion order.

### 9.2 `src/presentation/three/systems/RoomEnvironmentSystem.ts`

```ts
export class RoomEnvironmentSystem {
  private targetRoomId: RoomId | null;
  private transitionElapsedMs: number;
  private readonly startColor: THREE.Color;
  private readonly targetColor: THREE.Color;
  private startIntensity: number;
  private targetIntensity: number;

  public constructor(input: {
    readonly ambientLight: THREE.AmbientLight;
    readonly corridorLight: THREE.DirectionalLight;
    readonly roomsById: ReadonlyMap<RoomId, BuiltRoom>;
  });

  public setActivation(state: RoomActivationState): void;
  public update(deltaSeconds: number): void;
  public dispose(): void;
}
```

Color interpolation occurs in linear color space. Current room spotlight alone casts shadows; inactive spotlights have zero intensity. Wall emissive tint never exceeds the declared limit.

### 9.3 `src/presentation/three/systems/RoomAudioSystem.ts`

```ts
export class RoomAudioSystem {
  private readonly channels: readonly [THREE.Audio, THREE.Audio];
  private readonly buffers: Map<RoomId, AudioBuffer>;
  private currentRoomId: RoomId | null;
  private requestedRoomId: RoomId | null;
  private transitionElapsedMs: number;
  private unlocked: boolean;
  private disposed: boolean;

  public constructor(input: {
    readonly listener: THREE.AudioListener;
    readonly rooms: readonly GalleryRoomSnapshot[];
    readonly assets: ThreeAssetLoader;
    readonly tracker: ThreeResourceTracker;
    readonly diagnostics: RuntimeDiagnostics;
  });

  public resume(): Promise<boolean>;
  public setActivation(state: RoomActivationState): void;
  public update(deltaSeconds: number): void;
  public dispose(): void;

  private loadRoomBuffer(roomId: RoomId): Promise<AudioBuffer | null>;
}
```

Two channels perform the `600 ms` crossfade. The system ignores stale async loads by comparing `requestedRoomId`, caches only current/active-neighbor buffers and fails to silence with a warning rather than throw into the render loop.

### 9.4 `src/presentation/three/systems/PictureFocusSystem.ts`

```ts
export interface PictureFocus {
  readonly roomId: RoomId;
  readonly pictureId: PictureId;
  readonly picture: GalleryPictureSnapshot;
}

export class PictureFocusSystem {
  private elapsedSinceEvaluationMs: number;
  private candidateId: PictureId | null;
  private candidateSinceMs: number;
  private committed: PictureFocus | null;
  private readonly raycaster: THREE.Raycaster;

  public constructor(input: {
    readonly gallery: GallerySnapshot;
    readonly pictures: readonly PictureMeshMetadata[];
    readonly occlusionObjects: readonly THREE.Object3D[];
  });

  public update(input: {
    readonly deltaSeconds: number;
    readonly nowMs: number;
    readonly roomId: RoomId | null;
    readonly eyePosition: THREE.Vector3;
    readonly avatarForward: THREE.Vector3;
  }): PictureFocus | null;
  public current(): PictureFocus | null;
  public reset(): void;
}
```

Evaluation runs every `100 ms`, applies distance/angle/facing/occlusion in the SP6 order and commits after `120 ms` stable focus. Returned object identity changes only when focused picture changes.

## 10. Diagnostics, Performance and Context

### 10.1 `src/presentation/three/runtime/RuntimeDiagnostics.ts`

```ts
export type RuntimeDiagnosticSeverity = 'info' | 'warning' | 'fatal';

export interface RuntimeDiagnostic {
  readonly severity: RuntimeDiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly roomId: RoomId | null;
  readonly assetId: AssetId | null;
}

export class RuntimeDiagnostics {
  private readonly historyEntries: RuntimeDiagnostic[];
  private readonly listeners: Set<(diagnostic: RuntimeDiagnostic) => void>;

  public emit(diagnostic: RuntimeDiagnostic): void;
  public subscribe(listener: (diagnostic: RuntimeDiagnostic) => void): () => void;
  public history(): readonly RuntimeDiagnostic[];
  public clear(): void;
}
```

History is capped at `200` entries, preserves order and contains safe user-facing messages only.

### 10.2 `src/presentation/three/runtime/RuntimePerformanceMonitor.ts`

```ts
export interface FrameMetricsSnapshot {
  readonly sampleCount: number;
  readonly averageMs: number;
  readonly p95Ms: number;
  readonly maxMs: number;
}

export class RuntimePerformanceMonitor {
  private readonly samples: Float32Array;
  private writeIndex: number;
  private sampleCountValue: number;
  private warmupElapsedMs: number;
  private reportElapsedMs: number;
  private consecutiveSlowReports: number;
  private degradationIndex: number;

  public recordFrame(deltaMs: number): {
    readonly metrics: FrameMetricsSnapshot | null;
    readonly degradation:
      | { readonly kind: 'pixel-ratio'; readonly value: 1.5 | 1.0 }
      | { readonly kind: 'disable-neighbor-trails' }
      | null;
  };
  public snapshot(): FrameMetricsSnapshot;
  public reset(): void;
}
```

Percentile sorting occurs at most once per second on a copy of the populated buffer. One degradation action is emitted only after five consecutive slow reports; actions never reverse during the same runtime.

### 10.3 `src/presentation/three/runtime/WebGlContextGuard.ts`

```ts
export class WebGlContextGuard {
  private started: boolean;
  private lost: boolean;

  public static isSupported(documentRef: Document): boolean;

  public constructor(input: {
    readonly canvas: HTMLCanvasElement;
    readonly onLost: () => void;
    readonly onRestored: () => void;
  });

  public start(): void;
  public isLost(): boolean;
  public dispose(): void;
}
```

`onLost` runs after `preventDefault`. Restoration never reuses invalid GPU resources; the runtime must rebuild.

## 11. Runtime Orchestrator

### 11.1 `src/presentation/three/runtime/ThreeGalleryRuntime.ts`

```ts
export interface ThreeGalleryRuntimeEvents {
  readonly buildProgress: {
    readonly completedRooms: number;
    readonly totalRooms: number;
  };
  readonly ready: undefined;
  readonly focusChanged: PictureFocus | null;
  readonly diagnostic: RuntimeDiagnostic;
  readonly pointerLockChanged: boolean;
  readonly audioActivationRequired: undefined;
  readonly metrics: FrameMetricsSnapshot;
}

export class ThreeGalleryRuntime {
  private context: SceneContext | null;
  private world: BuiltGalleryWorld | null;
  private running: boolean;
  private built: boolean;
  private disposed: boolean;
  private readonly events: TypedEventEmitter<ThreeGalleryRuntimeEvents>;

  public constructor(input: {
    readonly host: HTMLElement;
    readonly gallery: GallerySnapshot;
    readonly activationToken: SpectatorActivationToken;
    readonly assetUrlResolver: AssetUrlResolver;
    readonly galleryStore: GalleryStore;
  });

  public subscribe<K extends keyof ThreeGalleryRuntimeEvents>(
    event: K,
    listener: (payload: ThreeGalleryRuntimeEvents[K]) => void,
  ): () => void;
  public build(): Promise<void>;
  public start(): void;
  public pause(): void;
  public requestPointerLock(): Promise<void>;
  public resumeAudio(): Promise<boolean>;
  public rebuild(): Promise<void>;
  public dispose(): Promise<void>;

  private createContext(): SceneContext;
  private createSystems(): void;
  private frame(timeMs: number): void;
  private update(deltaSeconds: number, nowMs: number): void;
  private render(): void;
  private applyPerformanceDegradation(
    action:
      | { readonly kind: 'pixel-ratio'; readonly value: 1.5 | 1.0 }
      | { readonly kind: 'disable-neighbor-trails' },
  ): void;
  private disposeWorld(finalTeardown: boolean): Promise<void>;
}
```

### 11.2 Exact Construction Order

`build()` executes:

1. Reject when disposed, already building or snapshot is structurally invalid.
2. Check `WebGlContextGuard.isSupported`.
3. Create renderer, scene, camera, clock, listener, lights and root groups.
4. Create diagnostics/resource tracker/asset loader.
5. Create pure planners and builders.
6. Build `GalleryLayoutPlan`; map `GeometryPlanningError` to fatal diagnostic.
7. Materialize corridor/rooms while emitting progress.
8. Build avatar at plan spawn.
9. Create collision, input, controller, camera, animation, activation, environment, audio, focus, trail, rotation and performance systems.
10. Attach resize/context/input observers.
11. Mark built and emit `ready`.

No animation loop starts inside `build`.

### 11.3 Exact Frame Order

One `renderer.setAnimationLoop` callback executes:

1. Clamp clock delta.
2. Sample input.
3. Update third-person controller with previous camera yaw.
4. Update avatar animation.
5. Update camera.
6. Update room activation.
7. Apply activation to environment/audio.
8. Update environment, audio, exhibit rotation and trails.
9. Evaluate picture focus; emit only on identity change.
10. Render scene.
11. Record frame duration, emit metrics/degradation diagnostics.

No subsystem owns another RAF or animation loop.

### 11.4 Pause, Rebuild and Dispose

- `pause` stops animation loop and disables input but preserves world resources.
- `rebuild` pauses, disposes world resources without disposing shared DOM host, then repeats `build` and `start`; it uses the original immutable snapshot.
- `dispose` follows SP6 section 17, releases pointer lock/audio/URLs/listeners/Three resources/renderer, removes the canvas, clears events and is idempotent.
- `renderer.forceContextLoss()` is called only with `finalTeardown=true`.

## 12. Layer and Ownership Rule

Files under `presentation/three` may import Three.js, domain snapshots/value objects, application ports and presentation core utilities. They may not import IndexedDB, fflate, bootstrap, DOM editor components or application use-case implementations. Pure planner files may import only domain snapshots/value types and other pure planner/collision types; importing `three` there is forbidden and checked by the architecture test.
