### S7 — Implementar layout Editor y gestión de salones

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR4–FR8, FR16, FR19, NFRE10, NFRE11
- **Depends:** S5, S6
- **Validation:** V7, V8, V20
- **Outcome:** Editor 15/85, title inline, lista/selección de salones, toolbar y creación persistente.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S7-IN1:** `.plans/tasks/T3DG-001/documents/spec_01_product_scope.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S7-IN2:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S7-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S7-IN4:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S7-IN5:** `src/presentation/state/**, src/presentation/components/common/**, src/presentation/app/**` → `implemented dependency` — estado y componentes comunes de S5.
- **S7-IN6:** `src/bootstrap/bootstrapApplication.ts` → `implemented dependency` — registro de StartScreen de S6.
- **S7-IN7:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S7-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S7-OUT1:** `src/presentation/components/editor/ResponsiveEditorGuard.ts` → `ResponsiveEditorGuard` — Bloqueo bajo viewport mínimo.
- **S7-OUT2:** `src/presentation/components/editor/GalleryTitleEditor.ts` → `GalleryTitleEditor` — Texto/input oculto con Enter/Escape/blur.
- **S7-OUT3:** `src/presentation/components/editor/RoomListItem.ts` → `RoomListItem` — Fila seleccionable sin margin/padding externo.
- **S7-OUT4:** `src/presentation/components/editor/RoomList.ts` → `RoomList` — Lista y selección de salones.
- **S7-OUT5:** `src/presentation/components/editor/RoomSidebar.ts` → `RoomSidebar` — Header, acciones y room list.
- **S7-OUT6:** `src/presentation/components/editor/EditorToolbar.ts` → `EditorToolbar` — Acciones de cuadro/config/export alineadas derecha.
- **S7-OUT7:** `src/presentation/components/editor/EmptyRoomState.ts` → `EmptyRoomState` — Contenido cuando no hay salón seleccionado.
- **S7-OUT8:** `src/presentation/screens/editor/EditorScreen.ts` → `EditorScreenDependencies; EditorScreen` — Layout 15/85, suscripción store y composición.
- **S7-OUT9:** `src/presentation/styles/editor.css` → `editor layout styles` — 15dvw/85dvw, 10dvh/90dvh y room rows.
- **S7-OUT10:** `tests/unit/presentation/components/GalleryTitleEditor.test.ts` → `component tests` — Modo inline, Enter, blur, Escape y rollback visual.
- **S7-OUT11:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — Registrar `EditorScreen` como factory de EDITOR e inyectar `EditorStore`, modales, toasts, quota y navegación a HOME.
- **S7-OUT12:** `workspace` → `S7 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S7-OUT13:** `.plans/tasks/T3DG-001/plan.md` → `V7, V8, V20 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S5, S6`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S7-IN1`, `S7-IN2`, `S7-IN3`, `S7-IN4`, `S7-IN5`, `S7-IN6`, `S7-IN7` | `S7-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/components/editor/ResponsiveEditorGuard.ts` `ResponsiveEditorGuard` para Bloqueo bajo viewport mínimo. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S7-IN1`, `S7-IN2` | `S7-OUT1` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/components/editor/GalleryTitleEditor.ts` `GalleryTitleEditor` para Texto/input oculto con Enter/Escape/blur. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S7-IN1`, `S7-IN2`, `S7-OUT1` | `S7-OUT2` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/components/editor/RoomListItem.ts` `RoomListItem` para Fila seleccionable sin margin/padding externo. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S7-IN1`, `S7-IN2`, `S7-OUT2` | `S7-OUT3` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/components/editor/RoomList.ts` `RoomList` para Lista y selección de salones. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S7-IN1`, `S7-IN2`, `S7-OUT3` | `S7-OUT4` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/components/editor/RoomSidebar.ts` `RoomSidebar` para Header, acciones y room list. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S7-IN1`, `S7-IN2`, `S7-OUT4` | `S7-OUT5` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/components/editor/EditorToolbar.ts` `EditorToolbar` para Acciones de cuadro/config/export alineadas derecha. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S7-IN1`, `S7-IN2`, `S7-OUT5` | `S7-OUT6` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/presentation/components/editor/EmptyRoomState.ts` `EmptyRoomState` para Contenido cuando no hay salón seleccionado. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S7-IN1`, `S7-IN2`, `S7-OUT6` | `S7-OUT7` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/presentation/screens/editor/EditorScreen.ts` `EditorScreenDependencies; EditorScreen` para Layout 15/85, suscripción store y composición. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S7-IN1`, `S7-IN2`, `S7-OUT7` | `S7-OUT8` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/presentation/styles/editor.css` `editor layout styles` para 15dvw/85dvw, 10dvh/90dvh y room rows. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S7-IN1`, `S7-IN2`, `S7-OUT8` | `S7-OUT9` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `ADD-10` | Implementar en `tests/unit/presentation/components/GalleryTitleEditor.test.ts` los casos `component tests` para modo inline, enter, blur, escape y rollback visual. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-9` | `S7-IN1`, `S7-IN2`, `S7-OUT9` | `S7-OUT10` | Materializa una responsabilidad única de S7; FR4–FR8, FR16, FR19, NFRE10, NFRE11. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/bootstrap/bootstrapApplication.ts` en `bootstrapApplication()`: Registrar `EditorScreen` como factory de EDITOR e inyectar `EditorStore`, modales, toasts, quota y navegación a HOME. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-10` | `S7-IN7`, `S7-OUT10` | `S7-OUT11` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-1` | `S7-OUT1`, `S7-OUT2`, `S7-OUT3`, `S7-OUT4`, `S7-OUT5`, `S7-OUT6`, `S7-OUT7`, `S7-OUT8`, `S7-OUT9`, `S7-OUT10`, `S7-OUT11` | `S7-OUT12` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/components/GalleryTitleEditor.test.ts` y `npm run build`; medir manualmente 15/85 y 10/90 en viewport 1440×900. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S7-OUT12` | `S7-OUT13` | Demuestra V7, V8, V20 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S7` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S7-OUT13`, `S7-OUT0` | `S7-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
