### S13 — Implementar runtime Espectador, HUD y audio

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15
- **Depends:** S6, S11, S12
- **Validation:** V13–V19, V23
- **Outcome:** Loop integrado, activación de salas, focus raycast, HUD, audio y desmontaje completo.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S13-IN1:** `.plans/tasks/T3DG-001/documents/spec_01_product_scope.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S13-IN2:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S13-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S13-IN4:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S13-IN5:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S13-IN6:** `src/presentation/three/builders/**, src/presentation/three/controls/**, src/presentation/three/collision/**` → `implemented dependency` — mundo y control de S11–S12.
- **S13-IN7:** `src/presentation/screens/start/StartScreen.ts, src/bootstrap/bootstrapApplication.ts` → `implemented dependency` — entrada de usuario y composition root de S6.
- **S13-IN8:** `src/presentation/screens/start/StartScreen.ts` → `StartScreen` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S13-IN9:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S13-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S13-OUT1:** `src/presentation/three/systems/RoomActivationSystem.ts` → `RoomActivationState; RoomActivationSystem` — Detectar zona y activar máximo tres salones.
- **S13-OUT2:** `src/presentation/three/systems/RoomEnvironmentSystem.ts` → `RoomEnvironmentSystem` — Interpolar luz ambiental, spotlight y tintes.
- **S13-OUT3:** `src/presentation/three/systems/RoomAudioSystem.ts` → `RoomAudioSystem` — AudioListener, carga, loop, crossfade y silencio.
- **S13-OUT4:** `src/presentation/three/systems/PictureFocusSystem.ts` → `PictureFocus; PictureFocusSystem` — Filtro distancia/ángulo/raycast a 10Hz.
- **S13-OUT5:** `src/presentation/three/runtime/ThreeGalleryRuntime.ts` → `ThreeGalleryRuntimeEvents; ThreeGalleryRuntime` — Loop único, systems, renderer, resize, start/pause/dispose.
- **S13-OUT6:** `src/presentation/components/spectator/PictureInfoHud.ts` → `PictureInfoHud` — Nombre, descripción, link y transición.
- **S13-OUT7:** `src/presentation/components/spectator/SpectatorControlsHint.ts` → `SpectatorControlsHint` — Ayuda de controles y pointer lock.
- **S13-OUT8:** `src/presentation/components/spectator/SpectatorStatusOverlay.ts` → `SpectatorStatusOverlay` — Carga, warnings y error fatal accesible.
- **S13-OUT9:** `src/presentation/screens/spectator/SpectatorScreen.ts` → `SpectatorScreenDependencies; SpectatorScreen` — Montar runtime, HUD, events y dispose.
- **S13-OUT10:** `src/presentation/styles/spectator.css` → `spectator styles` — Canvas fullscreen, HUD, hints y overlays.
- **S13-OUT11:** `tests/unit/presentation/three/PictureFocusSystem.test.ts` → `focus tests` — Distancia, ángulo, raycast, prioridad y frecuencia 10Hz.
- **S13-OUT12:** `tests/unit/presentation/three/RoomActivationSystem.test.ts` → `activation tests` — Zonas, transiciones y máximo tres salones costosos.
- **S13-OUT13:** `tests/unit/presentation/three/RoomAudioSystem.test.ts` → `audio tests` — Unlock, loop, crossfade, silencio y dispose con audio fake.
- **S13-OUT14:** `src/presentation/screens/start/StartScreen.ts` → `StartScreen` — Crear el token de activación dentro del handler ESPECTADOR, invocar el callback de lanzamiento sin perder el gesto y mostrar fallback ACTIVAR SONIDO cuando corresponda.
- **S13-OUT15:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — Registrar `SpectatorScreen`, preparar snapshot aprobado/token/servicios, transferir navegación y garantizar dispose al regresar HOME.
- **S13-OUT16:** `workspace` → `S13 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S13-OUT17:** `.plans/tasks/T3DG-001/plan.md` → `V13–V19, V23 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S6, S11, S12`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S13-IN1`, `S13-IN2`, `S13-IN3`, `S13-IN4`, `S13-IN5`, `S13-IN6`, `S13-IN7`, `S13-IN8`, `S13-IN9` | `S13-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/three/systems/RoomActivationSystem.ts` `RoomActivationState; RoomActivationSystem` para Detectar zona y activar máximo tres salones. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S13-IN1`, `S13-IN2` | `S13-OUT1` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/three/systems/RoomEnvironmentSystem.ts` `RoomEnvironmentSystem` para Interpolar luz ambiental, spotlight y tintes. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S13-IN1`, `S13-IN2`, `S13-OUT1` | `S13-OUT2` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/three/systems/RoomAudioSystem.ts` `RoomAudioSystem` para AudioListener, carga, loop, crossfade y silencio. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S13-IN1`, `S13-IN2`, `S13-OUT2` | `S13-OUT3` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/three/systems/PictureFocusSystem.ts` `PictureFocus; PictureFocusSystem` para Filtro distancia/ángulo/raycast a 10Hz. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S13-IN1`, `S13-IN2`, `S13-OUT3` | `S13-OUT4` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/three/runtime/ThreeGalleryRuntime.ts` `ThreeGalleryRuntimeEvents; ThreeGalleryRuntime` para Loop único, systems, renderer, resize, start/pause/dispose. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S13-IN1`, `S13-IN2`, `S13-OUT4` | `S13-OUT5` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/components/spectator/PictureInfoHud.ts` `PictureInfoHud` para Nombre, descripción, link y transición. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S13-IN1`, `S13-IN2`, `S13-OUT5` | `S13-OUT6` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/presentation/components/spectator/SpectatorControlsHint.ts` `SpectatorControlsHint` para Ayuda de controles y pointer lock. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S13-IN1`, `S13-IN2`, `S13-OUT6` | `S13-OUT7` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/presentation/components/spectator/SpectatorStatusOverlay.ts` `SpectatorStatusOverlay` para Carga, warnings y error fatal accesible. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S13-IN1`, `S13-IN2`, `S13-OUT7` | `S13-OUT8` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/presentation/screens/spectator/SpectatorScreen.ts` `SpectatorScreenDependencies; SpectatorScreen` para Montar runtime, HUD, events y dispose. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S13-IN1`, `S13-IN2`, `S13-OUT8` | `S13-OUT9` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/presentation/styles/spectator.css` `spectator styles` para Canvas fullscreen, HUD, hints y overlays. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S13-IN1`, `S13-IN2`, `S13-OUT9` | `S13-OUT10` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-11` | Implementar en `tests/unit/presentation/three/PictureFocusSystem.test.ts` los casos `focus tests` para distancia, ángulo, raycast, prioridad y frecuencia 10hz. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-10` | `S13-IN1`, `S13-IN2`, `S13-OUT10` | `S13-OUT11` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-12` | Implementar en `tests/unit/presentation/three/RoomActivationSystem.test.ts` los casos `activation tests` para zonas, transiciones y máximo tres salones costosos. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-11` | `S13-IN1`, `S13-IN2`, `S13-OUT11` | `S13-OUT12` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-13` | Implementar en `tests/unit/presentation/three/RoomAudioSystem.test.ts` los casos `audio tests` para unlock, loop, crossfade, silencio y dispose con audio fake. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-12` | `S13-IN1`, `S13-IN2`, `S13-OUT12` | `S13-OUT13` | Materializa una responsabilidad única de S13; FR27, FR30–FR36, FR38, NFRE7, NFRE11, NFRE15. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/presentation/screens/start/StartScreen.ts` en `StartScreen`: Crear el token de activación dentro del handler ESPECTADOR, invocar el callback de lanzamiento sin perder el gesto y mostrar fallback ACTIVAR SONIDO cuando corresponda. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-13` | `S13-IN8`, `S13-OUT13` | `S13-OUT14` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-2` | Modificar `src/bootstrap/bootstrapApplication.ts` en `bootstrapApplication()`: Registrar `SpectatorScreen`, preparar snapshot aprobado/token/servicios, transferir navegación y garantizar dispose al regresar HOME. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-1` | `S13-IN9`, `S13-OUT14` | `S13-OUT15` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-2` | `S13-OUT1`, `S13-OUT2`, `S13-OUT3`, `S13-OUT4`, `S13-OUT5`, `S13-OUT6`, `S13-OUT7`, `S13-OUT8`, `S13-OUT9`, `S13-OUT10`, `S13-OUT11`, `S13-OUT12`, `S13-OUT13`, `S13-OUT14`, `S13-OUT15` | `S13-OUT16` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/three/PictureFocusSystem.test.ts tests/unit/presentation/three/RoomActivationSystem.test.ts tests/unit/presentation/three/RoomAudioSystem.test.ts` y `npm run build`; realizar smoke de recorrido/HUD/audio. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S13-OUT16` | `S13-OUT17` | Demuestra V13–V19, V23 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S13` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S13-OUT17`, `S13-OUT0` | `S13-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
