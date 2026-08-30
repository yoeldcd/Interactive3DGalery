# SP7 — Procedural Geometry and Spatial Planning

All planners in this specification are pure: they receive snapshots and numeric constants, return plain plans, allocate no Three.js object and perform no I/O.

## 1. Scene Constants

`src/presentation/three/constants/SceneConstants.ts` exports the exact `GEOMETRY_EPSILON`, `COLLIDER_EPSILON`, `VISUAL_OVERLAP_EPSILON` and deeply readonly `SCENE_CONSTANTS` contract declared in `SP12 §1.1`. Geometry planners consume the `corridor`, `room`, `entrance`, `picture`, `pedestal`, `avatar`, `focus` and `exhibit` groups from that single module. No planner, builder, runtime system or test duplicates those literals.

## 2. Geometry Types

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
  readonly spawn: { readonly position: Vec2; readonly yaw: number };
}
```

All returned arrays preserve gallery/room/picture order and are frozen in development tests.

## 3. Picture Fit Algorithm

Input: intrinsic `width`, `height` and required wall index.

```text
nativeRatio = width / height
boxRatio = maxInnerWidth / maxInnerHeight

if nativeRatio >= boxRatio:
    innerWidth = maxInnerWidth
    innerHeight = maxInnerWidth / nativeRatio
else:
    innerHeight = maxInnerHeight
    innerWidth = maxInnerHeight * nativeRatio

outerWidth = innerWidth + 2 * frameBorder
outerHeight = innerHeight + 2 * frameBorder
```

Properties:

- `innerWidth / innerHeight == nativeRatio` within floating tolerance `1e-9`.
- Neither inner dimension exceeds its maximum.
- No crop, texture repeat or non-uniform mesh scale is permitted.
- Vertical center is constant `picture.centerY`; if outer height would intersect floor/ceiling, planner fails because input metadata violates declared max or constants were modified inconsistently.

## 4. Regular Polygon Base

For `n = room.pictures.length`, valid spectator planning requires `n >= 3`.

Interior angle:

```text
alpha = ((n - 2) * PI) / n
```

Trim distance along each edge adjacent to the entrance vertex, required to create a gap of exact width `G`:

```text
trim = G / (2 * sin(alpha / 2))
```

Frame-driven side requirement for wall `i`:

```text
baseRequired_i = pictureOuterWidth_i + 2 * pictureSideMargin
adjacentRequired_i = baseRequired_i + trim  // only i=0 and i=n-1
```

Space-driven side requirement from minimum apothem `Amin`:

```text
spaceRequired = 2 * Amin * tan(PI / n)
```

Final side length:

```text
L = max(
  minimumWallLength,
  spaceRequired,
  max(baseRequired_i for non-adjacent walls),
  adjacentRequired_0,
  adjacentRequired_(n-1)
)
```

Radii:

```text
circumradius R = L / (2 * sin(PI / n))
apothem A = L / (2 * tan(PI / n))
```

Postconditions:

- `A >= minimumApothem - 1e-9`.
- Every built wall segment is longer than its picture outer width plus `2*sideMargin` except the removed trim, which is already included in adjacent requirement.
- `trim < L`; otherwise planner throws a geometry error.

## 5. Room Orientation and Vertices

A room center is already assigned by Gallery planner. Entrance points toward corridor.

```text
sideSign = right ? +1 : -1
entryAngle = right ? PI : 0
vertex[k] = center + R * (cos(entryAngle + 2*PI*k/n), sin(entryAngle + 2*PI*k/n))
```

The local `z` component uses the sine term.

- `vertex[0]` is the entrance vertex nearest corridor.
- Vertices are counterclockwise in world XZ after orientation normalization.
- Wall `i` connects `vertex[i]` to `vertex[(i+1) mod n]`.

## 6. Opening the Entrance Vertex

Adjacent walls:

- Wall `0`: `V0 → V1`.
- Wall `n-1`: `V(n-1) → V0`.

Compute unit directions:

```text
d0 = normalize(V1 - V0)
dPrev = normalize(V(n-1) - V0)
P0 = V0 + d0 * trim
PPrev = V0 + dPrev * trim
```

Built segments:

```text
wall0 = P0 → V1
wall(n-1) = V(n-1) → PPrev
```

Room gap:

```text
gap = PPrev → P0
length(gap) == entrance.width
```

No wall or collider is created across the gap. The floor/ceiling polygon remains the full regular polygon; the vestibule floor overlaps the entrance region by `0.02 m` to prevent a visual crack.

## 7. Wall Normals and Frame Placement

For each counterclockwise wall segment `A→B`:

```text
tangent = normalize(B - A)
outward = normalize((tangent.z, -tangent.x))
inward = -outward
```

The planner verifies inward normal points toward room center:

```text
dot(inward, center - midpoint(A,B)) > 0
```

Frame center:

- Non-adjacent: midpoint of built segment.
- Adjacent: midpoint of trimmed built segment; no manual offset beyond trim is applied.
- World center XZ = wall midpoint + inward × `(wallThickness/2 + wallStandoff)`.
- Center Y = `2.35 m`.
- Frame tangent follows wall tangent; visual plane faces inward.

Each wall receives the picture at the same array index. No sorting by ratio occurs.

## 8. Door and Vestibule

The corridor-side door is placed at the near end of a rectangular vestibule.

For room side sign `s`:

```text
corridorWallX = s * corridor.width/2
roomGapCenter = midpoint(PPrev, P0)
corridorDoorCenter = (corridorWallX, room.center.z)
vestibuleAxis = normalize(roomGapCenter - corridorDoorCenter)
```

The planner requires vestibule axis to be approximately horizontal X (`abs(axis.z) < 1e-9`) because all doors align to corridor sides.

Vestibule:

- Width = entrance width.
- Length = distance door center→room gap center, expected `entrance.vestibuleLength` after center placement.
- Side walls connect corresponding door jamb and gap endpoint.
- Floor polygon is four corners ordered counterclockwise.
- Door frame is at `corridorDoorCenter`, visible from corridor.
- Door remains permanently open; no leaf mesh or state exists.
- Label center Y = `doorHeight + labelOffsetY + labelHeight/2`.

## 9. Room Center X

To make vestibule length exact:

```text
centerX = sideSign * (
  corridor.width/2
  + entrance.vestibuleLength
  + circumradius
)
```

Because entrance vertex is `centerX - sideSign*circumradius`, room gap lies near the vertex and the planned trim endpoints are accepted when their midpoint X differs from the ideal vestibule endpoint by only polygon-derived offset. The actual vestibule uses computed gap center; the declared length is a target, not a forced distortion. If deviation exceeds `0.2 m`, the planner increases center offset so minimum vestibule length remains `2.4 m`.

## 10. Longitudinal Room Placement

Rooms retain gallery order and alternate:

```text
room[i] -> right when i mod 2 == 0
room[i] -> left  when i mod 2 == 1
```

Planner first computes each room's radii without translation, then assigns Z.

State:

```text
previousDoorZ = corridor.startClearance
lastRoomOnSide[left|right] = null
```

For room `i`:

```text
candidateByOrder = previousDoorZ + minimumDoorSpacing
candidateBySide =
  if no last room on side:
      corridor.startClearance + R_i
  else:
      last.z + last.R + R_i + sameSideClearance

z_i = max(candidateByOrder, candidateBySide)
previousDoorZ = z_i
lastRoomOnSide[side] = room_i
```

This guarantees:

- Door labels follow room array order down corridor.
- Consecutive doors are at least `7 m` apart.
- Circumcircle bounds of rooms on the same side are separated by `4 m`.
- Opposite-side room overlap in Z is allowed because X bounds are disjoint across corridor.

## 11. Corridor Length and Openings

```text
lastExtent = max(room.center.z + room.circumradius for rooms)
length = max(minimumLength, lastExtent + endClearance)
```

Floor polygon:

```text
(-W/2, 0), (+W/2, 0), (+W/2, length), (-W/2, length)
```

For each side:

1. Convert each door to open Z interval `[center.z - width/2, center.z + width/2]`.
2. Sort intervals and assert no overlap.
3. Emit wall segments from 0 to first interval, between intervals and last interval to length.
4. Omit zero-length segments.
5. Add start/end caps across corridor width.

Door frame meshes fill visual jamb/header but do not add a collider across opening.

## 12. Bounds and Non-overlap Validation

Room AABB derives from all room vertices and vestibule corners, expanded by wall thickness.

Validation:

- Same-side room AABBs must not intersect after expansion by `0.25 m`.
- Room bounds must not cross corridor interior except vestibule polygon.
- Every door opening lies wholly within corridor length.
- Pedestal circle with radius `pedestal.radius + avatar.radius + 0.2` lies inside room polygon.
- A ring at radius `2.5 m` around pedestal has at least one point in front of every picture that is inside polygon and outside colliders; sample `24` angular points per picture normal direction when validating fixtures.

Planner throws the typed `GeometryPlanningError` declared in `SP12 §1.2`, including room id and invariant name; runtime never receives an invalid plan.

## 13. Pedestal Placement

Pedestal center equals room center. Collider is an AABB or circle enclosing:

```text
radius = pedestal.radius + pedestal.colliderPadding
```

The room minimum apothem guarantees clearance:

```text
minimumApothem >= pedestal.radius + 2.5 observation distance + avatar.radius + 0.85 margin
```

The exact constants sum to `4.6 m`.

## 14. Floor, Ceiling and Wall Mesh Inputs

Planner emits dimensions; builders use them without recomputing geometry.

- Floor: `ShapeGeometry(vertices)` at Y=0.
- Ceiling: same shape at Y=room.height, reversed visible side.
- Wall: `BoxGeometry(length(builtSegment), room.height, wallThickness)` positioned at segment midpoint Y=`height/2` and rotated to tangent.
- Corridor equivalent uses rectangle floor and segmented side walls.
- Vestibule floor/ceiling use its quadrilateral.

## 15. Determinism

Given byte-for-byte equal `GallerySnapshot` and constants:

- All numbers and array orders are equal within IEEE operations.
- No random number is used.
- Labels derive only from normalized room names.
- Asset availability/content does not alter layout because intrinsic picture size is already persisted.
- Runtime fallbacks occupy the same planned dimensions as successful assets.

## 16. Numeric Tolerances

Centralized planner tolerances:

```ts
export const GEOMETRY_EPSILON = 1e-9;
export const COLLIDER_EPSILON = 1e-3;
export const VISUAL_OVERLAP_EPSILON = 0.02;
```

Never compare computed floats with `===` except known integer counts.

## 17. Warning Thresholds Without Hard Business Caps

No explicit maximum number of rooms or pictures is imposed by domain. The planner/runtime emits a warning when:

- room has more than `64` pictures;
- gallery has more than `32` rooms;
- resulting corridor exceeds `1000 m`;
- resulting room circumradius exceeds `80 m`.

Warnings do not reject data. Performance gates only guarantee the reference fixture declared in NFRE7.
