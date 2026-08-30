### S14 — Endurecer rendimiento, lifecycle y fallbacks

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15
- **Depends:** S8, S9, S13
- **Validation:** V18, V19, V21
- **Outcome:** Recursos limitados y observables, degradación controlada, recuperación WebGL y diagnósticos.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S14-IN1:** `.plans/tasks/T3DG-001/documents/spec_02_architecture_dependencies.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN2:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN3:** `.plans/tasks/T3DG-001/documents/spec_08_persistence_archives.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN4:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN5:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN6:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S14-IN7:** `src/presentation/three/runtime/ThreeGalleryRuntime.ts, src/presentation/three/runtime/GallerySceneBuilder.ts, src/presentation/three/assets/ThreeAssetLoader.ts` → `implemented dependency` — runtime base de S11–S13.
- **S14-IN8:** `src/presentation/screens/spectator/SpectatorScreen.ts, src/presentation/styles/spectator.css` → `implemented dependency` — presentación del Espectador de S13.
- **S14-IN9:** `src/presentation/components/editor/ImagePreview.ts` → `implemented dependency` — lifecycle de previews de S8.
- **S14-IN10:** `src/presentation/three/runtime/ThreeGalleryRuntime.ts` → `ThreeGalleryRuntime` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S14-IN11:** `src/presentation/three/runtime/GallerySceneBuilder.ts` → `GallerySceneBuilder` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S14-IN12:** `src/presentation/three/assets/ThreeAssetLoader.ts` → `ThreeAssetLoader` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S14-IN13:** `src/presentation/screens/spectator/SpectatorScreen.ts` → `SpectatorScreen` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S14-IN14:** `src/presentation/styles/spectator.css` → `spectator styles` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S14-IN15:** `src/presentation/components/editor/ImagePreview.ts` → `ImagePreview` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S14-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S14-OUT1:** `src/presentation/three/runtime/ThreeResourceTracker.ts` → `ThreeResourceTracker` — Registrar Object3D, textures, audio y disposers por runtime.
- **S14-OUT2:** `src/presentation/three/runtime/RuntimePerformanceMonitor.ts` → `FrameMetricsSnapshot; RuntimePerformanceMonitor` — Muestrear frame time, p95 y warnings.
- **S14-OUT3:** `src/presentation/three/runtime/WebGlContextGuard.ts` → `WebGlContextGuard` — Detectar soporte, context lost/restored y error fatal.
- **S14-OUT4:** `src/presentation/three/runtime/RuntimeDiagnostics.ts` → `RuntimeDiagnosticSeverity; RuntimeDiagnostic; RuntimeDiagnostics` — Canal tipado de fallos no bloqueantes.
- **S14-OUT5:** `tests/unit/presentation/three/ThreeResourceTracker.test.ts` → `resource lifecycle tests` — Tracking, dispose único y conteos diagnósticos.
- **S14-OUT6:** `tests/unit/presentation/three/RuntimePerformanceMonitor.test.ts` → `performance monitor tests` — Ventana de muestras, p95 y warnings estables.
- **S14-OUT7:** `src/presentation/three/runtime/ThreeGalleryRuntime.ts` → `ThreeGalleryRuntime` — Integrar tracker, performance monitor, context guard y diagnostics; exponer contadores solo en modo test y detener todo ante dispose/fallo fatal.
- **S14-OUT8:** `src/presentation/three/runtime/GallerySceneBuilder.ts` → `GallerySceneBuilder` — Registrar recursos creados, activar cargas costosas por proximidad y limitar salas activas a actual más vecinas.
- **S14-OUT9:** `src/presentation/three/assets/ThreeAssetLoader.ts` → `ThreeAssetLoader` — Aplicar límites, downscale de textura, abort/dispose y diagnósticos sin ocultar fallos CORS/parseo.
- **S14-OUT10:** `src/presentation/screens/spectator/SpectatorScreen.ts` → `SpectatorScreen` — Presentar warnings/fallos WebGL, métricas diagnósticas en modo test y retorno seguro a HOME.
- **S14-OUT11:** `src/presentation/styles/spectator.css` → `spectator styles` — Añadir estados de degradación, context lost, warnings y reduced motion sin alterar HUD.
- **S14-OUT12:** `src/presentation/components/editor/ImagePreview.ts` → `ImagePreview` — Asegurar reemplazo abortable, liberación del scope anterior y placeholder ante error/activo ausente.
- **S14-OUT13:** `workspace` → `S14 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S14-OUT14:** `.plans/tasks/T3DG-001/plan.md` → `V18, V19, V21 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S8, S9, S13`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S14-IN1`, `S14-IN2`, `S14-IN3`, `S14-IN4`, `S14-IN5`, `S14-IN6`, `S14-IN7`, `S14-IN8`, `S14-IN9`, `S14-IN10`, `S14-IN11`, `S14-IN12`, `S14-IN13`, `S14-IN14`, `S14-IN15` | `S14-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/three/runtime/ThreeResourceTracker.ts` `ThreeResourceTracker` para Registrar Object3D, textures, audio y disposers por runtime. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S14-IN1`, `S14-IN2` | `S14-OUT1` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/three/runtime/RuntimePerformanceMonitor.ts` `FrameMetricsSnapshot; RuntimePerformanceMonitor` para Muestrear frame time, p95 y warnings. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S14-IN1`, `S14-IN2`, `S14-OUT1` | `S14-OUT2` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/three/runtime/WebGlContextGuard.ts` `WebGlContextGuard` para Detectar soporte, context lost/restored y error fatal. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S14-IN1`, `S14-IN2`, `S14-OUT2` | `S14-OUT3` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/three/runtime/RuntimeDiagnostics.ts` `RuntimeDiagnosticSeverity; RuntimeDiagnostic; RuntimeDiagnostics` para Canal tipado de fallos no bloqueantes. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S14-IN1`, `S14-IN2`, `S14-OUT3` | `S14-OUT4` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `ADD-5` | Implementar en `tests/unit/presentation/three/ThreeResourceTracker.test.ts` los casos `resource lifecycle tests` para tracking, dispose único y conteos diagnósticos. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-4` | `S14-IN1`, `S14-IN2`, `S14-OUT4` | `S14-OUT5` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `ADD-6` | Implementar en `tests/unit/presentation/three/RuntimePerformanceMonitor.test.ts` los casos `performance monitor tests` para ventana de muestras, p95 y warnings estables. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-5` | `S14-IN1`, `S14-IN2`, `S14-OUT5` | `S14-OUT6` | Materializa una responsabilidad única de S14; FR35, FR36, NFRE7–NFRE9, NFRE14, NFRE15. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/presentation/three/runtime/ThreeGalleryRuntime.ts` en `ThreeGalleryRuntime`: Integrar tracker, performance monitor, context guard y diagnostics; exponer contadores solo en modo test y detener todo ante dispose/fallo fatal. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-6` | `S14-IN10`, `S14-OUT6` | `S14-OUT7` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-2` | Modificar `src/presentation/three/runtime/GallerySceneBuilder.ts` en `GallerySceneBuilder`: Registrar recursos creados, activar cargas costosas por proximidad y limitar salas activas a actual más vecinas. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-1` | `S14-IN11`, `S14-OUT7` | `S14-OUT8` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-3` | Modificar `src/presentation/three/assets/ThreeAssetLoader.ts` en `ThreeAssetLoader`: Aplicar límites, downscale de textura, abort/dispose y diagnósticos sin ocultar fallos CORS/parseo. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-2` | `S14-IN12`, `S14-OUT8` | `S14-OUT9` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-4` | Modificar `src/presentation/screens/spectator/SpectatorScreen.ts` en `SpectatorScreen`: Presentar warnings/fallos WebGL, métricas diagnósticas en modo test y retorno seguro a HOME. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-3` | `S14-IN13`, `S14-OUT9` | `S14-OUT10` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-5` | Modificar `src/presentation/styles/spectator.css` en `spectator styles`: Añadir estados de degradación, context lost, warnings y reduced motion sin alterar HUD. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-4` | `S14-IN14`, `S14-OUT10` | `S14-OUT11` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-6` | Modificar `src/presentation/components/editor/ImagePreview.ts` en `ImagePreview`: Asegurar reemplazo abortable, liberación del scope anterior y placeholder ante error/activo ausente. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-5` | `S14-IN15`, `S14-OUT11` | `S14-OUT12` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-6` | `S14-OUT1`, `S14-OUT2`, `S14-OUT3`, `S14-OUT4`, `S14-OUT5`, `S14-OUT6`, `S14-OUT7`, `S14-OUT8`, `S14-OUT9`, `S14-OUT10`, `S14-OUT11`, `S14-OUT12` | `S14-OUT13` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/three/ThreeResourceTracker.test.ts tests/unit/presentation/three/RuntimePerformanceMonitor.test.ts` y `npm run build`; inyectar context loss y comprobar contadores estables. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S14-OUT13` | `S14-OUT14` | Demuestra V18, V19, V21 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S14` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S14-OUT14`, `S14-OUT0` | `S14-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
