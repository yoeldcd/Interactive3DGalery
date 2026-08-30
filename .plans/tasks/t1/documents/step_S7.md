### S6 — Implementar pantalla inicial y cambio de modos

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR2, FR3, FR21, FR34, FR37
- **Depends:** S5
- **Validation:** V16, V20, V23
- **Outcome:** Pantalla inicial fullscreen, readiness report y entrada controlada a los modos.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S6-IN1:** `.plans/tasks/T3DG-001/documents/spec_01_product_scope.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S6-IN2:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S6-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S6-IN4:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S6-IN5:** `src/presentation/app/**, src/presentation/core/**, src/bootstrap/bootstrapApplication.ts` → `implemented dependency` — shell, router y bootstrap real de S5.
- **S6-IN6:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S6-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S6-OUT1:** `src/presentation/components/start/AnimatedGalleryTitle.ts` → `AnimatedGalleryTitle` — Título animado con reduced motion.
- **S6-OUT2:** `src/presentation/components/start/ReadinessDialog.ts` → `ReadinessDialog` — Lista accesible de bloqueos por salón.
- **S6-OUT3:** `src/presentation/screens/start/StartScreen.ts` → `StartScreenDependencies; StartScreen` — Home fullscreen y activación de modos.
- **S6-OUT4:** `src/presentation/styles/start.css` → `start screen styles` — Composición, animación y botones iniciales.
- **S6-OUT5:** `tests/unit/presentation/components/StartScreen.test.ts` → `screen tests` — Readiness, botones, navegación y token de activación.
- **S6-OUT6:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — Registrar `StartScreen` como factory de la ruta HOME, inyectar snapshot/readiness y callbacks de navegación; conservar fallbacks para rutas aún no implementadas.
- **S6-OUT7:** `workspace` → `S6 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S6-OUT8:** `.plans/tasks/T3DG-001/plan.md` → `V16, V20, V23 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S5`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S6-IN1`, `S6-IN2`, `S6-IN3`, `S6-IN4`, `S6-IN5`, `S6-IN6` | `S6-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/components/start/AnimatedGalleryTitle.ts` `AnimatedGalleryTitle` para Título animado con reduced motion. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S6-IN1`, `S6-IN2` | `S6-OUT1` | Materializa una responsabilidad única de S6; FR2, FR3, FR21, FR34, FR37. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/components/start/ReadinessDialog.ts` `ReadinessDialog` para Lista accesible de bloqueos por salón. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S6-IN1`, `S6-IN2`, `S6-OUT1` | `S6-OUT2` | Materializa una responsabilidad única de S6; FR2, FR3, FR21, FR34, FR37. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/screens/start/StartScreen.ts` `StartScreenDependencies; StartScreen` para Home fullscreen y activación de modos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S6-IN1`, `S6-IN2`, `S6-OUT2` | `S6-OUT3` | Materializa una responsabilidad única de S6; FR2, FR3, FR21, FR34, FR37. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/styles/start.css` `start screen styles` para Composición, animación y botones iniciales. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S6-IN1`, `S6-IN2`, `S6-OUT3` | `S6-OUT4` | Materializa una responsabilidad única de S6; FR2, FR3, FR21, FR34, FR37. | `ORQ`:`~` |
| `ADD-5` | Implementar en `tests/unit/presentation/components/StartScreen.test.ts` los casos `screen tests` para readiness, botones, navegación y token de activación. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-4` | `S6-IN1`, `S6-IN2`, `S6-OUT4` | `S6-OUT5` | Materializa una responsabilidad única de S6; FR2, FR3, FR21, FR34, FR37. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/bootstrap/bootstrapApplication.ts` en `bootstrapApplication()`: Registrar `StartScreen` como factory de la ruta HOME, inyectar snapshot/readiness y callbacks de navegación; conservar fallbacks para rutas aún no implementadas. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-5` | `S6-IN6`, `S6-OUT5` | `S6-OUT6` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-1` | `S6-OUT1`, `S6-OUT2`, `S6-OUT3`, `S6-OUT4`, `S6-OUT5`, `S6-OUT6` | `S6-OUT7` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/components/StartScreen.test.ts` y `npm run build`; verificar readiness, navegación y reduced motion. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S6-OUT7` | `S6-OUT8` | Demuestra V16, V20, V23 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S6` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S6-OUT8`, `S6-OUT0` | `S6-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
