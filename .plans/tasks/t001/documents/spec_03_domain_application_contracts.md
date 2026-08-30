### S11 — Implementar assets y builders Three.js

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR22–FR29, FR35, NFRE8, NFRE14
- **Depends:** S4, S10
- **Validation:** V9, V12, V13, V19
- **Outcome:** Mundo Three.js materializado con recursos liberables, exhibits, luces, frames, labels y estelas.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S11-IN1:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S11-IN2:** `.plans/tasks/T3DG-001/documents/spec_07_procedural_geometry.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S11-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S11-IN4:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S11-IN5:** `src/presentation/three/layout/**, src/presentation/three/collision/CollisionPrimitives.ts` → `implemented dependency` — planes puros aprobados en S10.
- **S11-IN6:** `src/infrastructure/browser/BrowserAssetUrlResolver.ts, src/application/ports/AssetUrlResolver.ts` → `implemented dependency` — resolución de activos aprobada en S4.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S11-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S11-OUT1:** `src/presentation/three/runtime/ThreeRuntimeTypes.ts` → `SceneContext; BuiltRoom; BuiltGalleryWorld; PictureMeshMetadata` — Contexto y resultados de construcción.
- **S11-OUT2:** `src/presentation/three/runtime/SceneDisposer.ts` → `disposeObject3D(); disposeMaterial(); disposeTexture()` — Liberación recursiva de recursos Three.
- **S11-OUT3:** `src/presentation/three/assets/TextureDecodeService.ts` → `TextureDecodeService` — Decodificar bitmap GPU <=2048px conservando ratio.
- **S11-OUT4:** `src/presentation/three/assets/TextureFactory.ts` → `TextureFactory` — Crear texturas de cuadros/paredes y cover UV.
- **S11-OUT5:** `src/presentation/three/assets/ThreeAssetLoader.ts` → `ThreeAssetLoader` — Resolver AssetRef y cargar texture/audio/OBJ con errores tipados.
- **S11-OUT6:** `src/presentation/three/builders/CorridorBuilder.ts` → `CorridorBuilder` — Piso, techo, paredes y colliders del pasillo.
- **S11-OUT7:** `src/presentation/three/builders/DoorFrameBuilder.ts` → `DoorFrameBuilder` — Marco abierto y umbral por plan.
- **S11-OUT8:** `src/presentation/three/builders/DoorLabelBuilder.ts` → `DoorLabelBuilder` — CanvasTexture truncada con nombre de salón.
- **S11-OUT9:** `src/presentation/three/builders/PictureFrameBuilder.ts` → `PictureFrameBuilder` — Marco, plano, metadata y fallback de cuadro.
- **S11-OUT10:** `src/presentation/three/builders/RoomShellBuilder.ts` → `RoomShellBuilder` — Piso, techo, segmentos de pared y superficies.
- **S11-OUT11:** `src/presentation/three/builders/PedestalBuilder.ts` → `PedestalBuilder` — Pedestal central y collider.
- **S11-OUT12:** `src/presentation/three/builders/ObjExhibitBuilder.ts` → `ObjExhibitBuilder` — Centrar, normalizar, escalar, material fallback y spotlight.
- **S11-OUT13:** `src/presentation/three/systems/TrailEffectSystem.ts` → `TrailEffectHandle; TrailEffectSystem` — Tres estelas orbitales con ring buffers.
- **S11-OUT14:** `src/presentation/three/systems/ExhibitRotationSystem.ts` → `RotatingExhibit; ExhibitRotationSystem` — Rotación Y de exhibiciones activas.
- **S11-OUT15:** `src/presentation/three/runtime/GallerySceneBuilder.ts` → `GallerySceneBuilder` — Materializar GalleryLayoutPlan y snapshots.
- **S11-OUT16:** `tests/unit/presentation/three/GallerySceneBuilder.test.ts` → `scene builder tests` — Conteos, transforms, metadata y disposición del mundo.
- **S11-OUT17:** `tests/unit/presentation/three/ObjExhibitBuilder.test.ts` → `exhibit builder tests` — Centrado, normalización 1.6m, escala cero y material fallback.
- **S11-OUT18:** `workspace` → `S11 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S11-OUT19:** `.plans/tasks/T3DG-001/plan.md` → `V9, V12, V13, V19 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S4, S10`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S11-IN1`, `S11-IN2`, `S11-IN3`, `S11-IN4`, `S11-IN5`, `S11-IN6` | `S11-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/three/runtime/ThreeRuntimeTypes.ts` `SceneContext; BuiltRoom; BuiltGalleryWorld; PictureMeshMetadata` para Contexto y resultados de construcción. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S11-IN1`, `S11-IN2` | `S11-OUT1` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/three/runtime/SceneDisposer.ts` `disposeObject3D(); disposeMaterial(); disposeTexture()` para Liberación recursiva de recursos Three. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S11-IN1`, `S11-IN2`, `S11-OUT1` | `S11-OUT2` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/three/assets/TextureDecodeService.ts` `TextureDecodeService` para Decodificar bitmap GPU <=2048px conservando ratio. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S11-IN1`, `S11-IN2`, `S11-OUT2` | `S11-OUT3` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/three/assets/TextureFactory.ts` `TextureFactory` para Crear texturas de cuadros/paredes y cover UV. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S11-IN1`, `S11-IN2`, `S11-OUT3` | `S11-OUT4` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/three/assets/ThreeAssetLoader.ts` `ThreeAssetLoader` para Resolver AssetRef y cargar texture/audio/OBJ con errores tipados. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S11-IN1`, `S11-IN2`, `S11-OUT4` | `S11-OUT5` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/three/builders/CorridorBuilder.ts` `CorridorBuilder` para Piso, techo, paredes y colliders del pasillo. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S11-IN1`, `S11-IN2`, `S11-OUT5` | `S11-OUT6` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/presentation/three/builders/DoorFrameBuilder.ts` `DoorFrameBuilder` para Marco abierto y umbral por plan. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S11-IN1`, `S11-IN2`, `S11-OUT6` | `S11-OUT7` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/presentation/three/builders/DoorLabelBuilder.ts` `DoorLabelBuilder` para CanvasTexture truncada con nombre de salón. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S11-IN1`, `S11-IN2`, `S11-OUT7` | `S11-OUT8` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/presentation/three/builders/PictureFrameBuilder.ts` `PictureFrameBuilder` para Marco, plano, metadata y fallback de cuadro. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S11-IN1`, `S11-IN2`, `S11-OUT8` | `S11-OUT9` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/presentation/three/builders/RoomShellBuilder.ts` `RoomShellBuilder` para Piso, techo, segmentos de pared y superficies. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S11-IN1`, `S11-IN2`, `S11-OUT9` | `S11-OUT10` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-11` | Implementar en `src/presentation/three/builders/PedestalBuilder.ts` `PedestalBuilder` para Pedestal central y collider. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-10` | `S11-IN1`, `S11-IN2`, `S11-OUT10` | `S11-OUT11` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-12` | Implementar en `src/presentation/three/builders/ObjExhibitBuilder.ts` `ObjExhibitBuilder` para Centrar, normalizar, escalar, material fallback y spotlight. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-11` | `S11-IN1`, `S11-IN2`, `S11-OUT11` | `S11-OUT12` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-13` | Implementar en `src/presentation/three/systems/TrailEffectSystem.ts` `TrailEffectHandle; TrailEffectSystem` para Tres estelas orbitales con ring buffers. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-12` | `S11-IN1`, `S11-IN2`, `S11-OUT12` | `S11-OUT13` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-14` | Implementar en `src/presentation/three/systems/ExhibitRotationSystem.ts` `RotatingExhibit; ExhibitRotationSystem` para Rotación Y de exhibiciones activas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-13` | `S11-IN1`, `S11-IN2`, `S11-OUT13` | `S11-OUT14` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-15` | Implementar en `src/presentation/three/runtime/GallerySceneBuilder.ts` `GallerySceneBuilder` para Materializar GalleryLayoutPlan y snapshots. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-14` | `S11-IN1`, `S11-IN2`, `S11-OUT14` | `S11-OUT15` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-16` | Implementar en `tests/unit/presentation/three/GallerySceneBuilder.test.ts` los casos `scene builder tests` para conteos, transforms, metadata y disposición del mundo. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-15` | `S11-IN1`, `S11-IN2`, `S11-OUT15` | `S11-OUT16` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `ADD-17` | Implementar en `tests/unit/presentation/three/ObjExhibitBuilder.test.ts` los casos `exhibit builder tests` para centrado, normalización 1.6m, escala cero y material fallback. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-16` | `S11-IN1`, `S11-IN2`, `S11-OUT16` | `S11-OUT17` | Materializa una responsabilidad única de S11; FR22–FR29, FR35, NFRE8, NFRE14. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-17` | `S11-OUT1`, `S11-OUT2`, `S11-OUT3`, `S11-OUT4`, `S11-OUT5`, `S11-OUT6`, `S11-OUT7`, `S11-OUT8`, `S11-OUT9`, `S11-OUT10`, `S11-OUT11`, `S11-OUT12`, `S11-OUT13`, `S11-OUT14`, `S11-OUT15`, `S11-OUT16`, `S11-OUT17` | `S11-OUT18` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/three/GallerySceneBuilder.test.ts tests/unit/presentation/three/ObjExhibitBuilder.test.ts` y `npm run build`; verificar conteos, aspect ratio, normalización, escala cero y dispose. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S11-OUT18` | `S11-OUT19` | Demuestra V9, V12, V13, V19 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S11` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S11-OUT19`, `S11-OUT0` | `S11-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
