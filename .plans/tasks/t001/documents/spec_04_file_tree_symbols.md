### S10 — Implementar planificación geométrica pura

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR22–FR26, NFRE6
- **Depends:** S2
- **Validation:** V9–V12
- **Outcome:** Planes matemáticos deterministas de cuadros, polígonos, entradas, pasillo y colliders.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S10-IN1:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S10-IN2:** `.plans/tasks/T3DG-001/documents/spec_07_procedural_geometry.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S10-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S10-IN4:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S10-IN5:** `src/domain/snapshots/**, src/domain/value-objects/ImageSize.ts` → `implemented dependency` — datos geométricos de dominio de S2.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S10-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S10-OUT1:** `src/presentation/three/constants/SceneConstants.ts` → `GEOMETRY_EPSILON; COLLIDER_EPSILON; VISUAL_OVERLAP_EPSILON; SCENE_CONSTANTS` — Todas las medidas, velocidades, thresholds y límites 3D.
- **S10-OUT2:** `src/presentation/three/layout/GeometryPlanningError.ts` → `GeometryInvariant; GeometryPlanningError` — Error tipado para invariantes geométricas y contexto seguro.
- **S10-OUT3:** `src/presentation/three/layout/GeometryTypes.ts` → `Vec2; Segment2; Aabb2; GallerySide; PictureLayoutPlan; WallLayoutPlan; DoorLayoutPlan; VestibuleLayoutPlan; RoomLayoutPlan; CorridorLayoutPlan; GalleryLayoutPlan` — Planes geométricos puros serializables.
- **S10-OUT4:** `src/presentation/three/layout/PolygonMath.ts` → `regularPolygonVertices(); segmentLength(); segmentMidpoint(); outwardNormal(); rotatePoint()` — Operaciones geométricas sin Three.js.
- **S10-OUT5:** `src/presentation/three/layout/PointInPolygon.ts` → `pointInPolygon()` — Detección de zona de salón.
- **S10-OUT6:** `src/presentation/three/layout/PictureLayoutPlanner.ts` → `PictureLayoutPlanner` — Escalar cuadros sin deformación.
- **S10-OUT7:** `src/presentation/three/layout/RoomLayoutPlanner.ts` → `RoomLayoutPlanner` — N paredes, apertura de vértice, frames y colliders.
- **S10-OUT8:** `src/presentation/three/layout/GalleryLayoutPlanner.ts` → `GalleryLayoutPlanner` — Alternar salones, espaciar y derivar pasillo.
- **S10-OUT9:** `src/presentation/three/collision/CollisionPrimitives.ts` → `CircleBody; StaticCollider; CollisionResolution` — Tipos 2D de colisión compartidos por planner/controller.
- **S10-OUT10:** `tests/unit/presentation/three/PictureLayoutPlanner.test.ts` → `geometry tests` — Aspect ratios y límites.
- **S10-OUT11:** `tests/unit/presentation/three/RoomLayoutPlanner.test.ts` → `geometry tests` — N paredes, apertura y no degeneración.
- **S10-OUT12:** `tests/unit/presentation/three/GalleryLayoutPlanner.test.ts` → `geometry tests` — Alternancia, separación y longitud de pasillo.
- **S10-OUT13:** `workspace` → `S10 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S10-OUT14:** `.plans/tasks/T3DG-001/plan.md` → `V9–V12 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S2`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S10-IN1`, `S10-IN2`, `S10-IN3`, `S10-IN4`, `S10-IN5` | `S10-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/three/constants/SceneConstants.ts` `GEOMETRY_EPSILON; COLLIDER_EPSILON; VISUAL_OVERLAP_EPSILON; SCENE_CONSTANTS` para Todas las medidas, velocidades, thresholds y límites 3D. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S10-IN1`, `S10-IN2` | `S10-OUT1` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/three/layout/GeometryPlanningError.ts` `GeometryInvariant; GeometryPlanningError` para Error tipado para invariantes geométricas y contexto seguro. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S10-IN1`, `S10-IN2`, `S10-OUT1` | `S10-OUT2` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/three/layout/GeometryTypes.ts` `Vec2; Segment2; Aabb2; GallerySide; PictureLayoutPlan; WallLayoutPlan; DoorLayoutPlan; VestibuleLayoutPlan; RoomLayoutPlan; CorridorLayoutPlan; GalleryLayoutPlan` para Planes geométricos puros serializables. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S10-IN1`, `S10-IN2`, `S10-OUT2` | `S10-OUT3` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/three/layout/PolygonMath.ts` `regularPolygonVertices(); segmentLength(); segmentMidpoint(); outwardNormal(); rotatePoint()` para Operaciones geométricas sin Three.js. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S10-IN1`, `S10-IN2`, `S10-OUT3` | `S10-OUT4` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/three/layout/PointInPolygon.ts` `pointInPolygon()` para Detección de zona de salón. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S10-IN1`, `S10-IN2`, `S10-OUT4` | `S10-OUT5` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/three/layout/PictureLayoutPlanner.ts` `PictureLayoutPlanner` para Escalar cuadros sin deformación. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S10-IN1`, `S10-IN2`, `S10-OUT5` | `S10-OUT6` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/presentation/three/layout/RoomLayoutPlanner.ts` `RoomLayoutPlanner` para N paredes, apertura de vértice, frames y colliders. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S10-IN1`, `S10-IN2`, `S10-OUT6` | `S10-OUT7` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/presentation/three/layout/GalleryLayoutPlanner.ts` `GalleryLayoutPlanner` para Alternar salones, espaciar y derivar pasillo. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S10-IN1`, `S10-IN2`, `S10-OUT7` | `S10-OUT8` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/presentation/three/collision/CollisionPrimitives.ts` `CircleBody; StaticCollider; CollisionResolution` para Tipos 2D de colisión compartidos por planner/controller. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S10-IN1`, `S10-IN2`, `S10-OUT8` | `S10-OUT9` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-10` | Implementar en `tests/unit/presentation/three/PictureLayoutPlanner.test.ts` los casos `geometry tests` para aspect ratios y límites. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-9` | `S10-IN1`, `S10-IN2`, `S10-OUT9` | `S10-OUT10` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-11` | Implementar en `tests/unit/presentation/three/RoomLayoutPlanner.test.ts` los casos `geometry tests` para n paredes, apertura y no degeneración. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-10` | `S10-IN1`, `S10-IN2`, `S10-OUT10` | `S10-OUT11` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `ADD-12` | Implementar en `tests/unit/presentation/three/GalleryLayoutPlanner.test.ts` los casos `geometry tests` para alternancia, separación y longitud de pasillo. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-11` | `S10-IN1`, `S10-IN2`, `S10-OUT11` | `S10-OUT12` | Materializa una responsabilidad única de S10; FR22–FR26, NFRE6. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-12` | `S10-OUT1`, `S10-OUT2`, `S10-OUT3`, `S10-OUT4`, `S10-OUT5`, `S10-OUT6`, `S10-OUT7`, `S10-OUT8`, `S10-OUT9`, `S10-OUT10`, `S10-OUT11`, `S10-OUT12` | `S10-OUT13` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/three/PictureLayoutPlanner.test.ts tests/unit/presentation/three/RoomLayoutPlanner.test.ts tests/unit/presentation/three/GalleryLayoutPlanner.test.ts`; todos los N=3..32 deben ser deterministas/no degenerados. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S10-OUT13` | `S10-OUT14` | Demuestra V9–V12 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S10` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S10-OUT14`, `S10-OUT0` | `S10-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
