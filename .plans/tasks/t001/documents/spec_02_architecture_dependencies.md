### S8 — Implementar grid y edición de cuadros

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11
- **Depends:** S7
- **Validation:** V8, V9, V20, V23
- **Outcome:** Grid responsiva y flujo completo de alta, edición y eliminación de cuadros.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S8-IN1:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S8-IN2:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S8-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S8-IN4:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S8-IN5:** `src/presentation/screens/editor/EditorScreen.ts, src/presentation/components/editor/EditorToolbar.ts` → `implemented dependency` — hosts y callbacks base de S7.
- **S8-IN6:** `src/application/use-cases/AddPicture.ts, src/application/use-cases/UpdatePicture.ts, src/application/use-cases/DeletePicture.ts` → `implemented dependency` — mutaciones de cuadros de S3.
- **S8-IN7:** `src/application/ports/AssetUrlResolver.ts` → `implemented dependency` — resolución de previews de S3/S4.
- **S8-IN8:** `src/presentation/screens/editor/EditorScreen.ts` → `EditorScreen` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S8-IN9:** `src/presentation/components/editor/EditorToolbar.ts` → `EditorToolbar` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S8-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S8-OUT1:** `src/presentation/components/editor/ImagePreview.ts` → `ImagePreview` — Resolver URL, cargar imagen contenida y liberar scope.
- **S8-OUT2:** `src/presentation/components/editor/PictureCard.ts` → `PictureCard` — Celda cuadrada clickable con imagen nativa.
- **S8-OUT3:** `src/presentation/components/editor/PictureGrid.ts` → `PictureGrid` — Grid auto-fit y apertura de modal.
- **S8-OUT4:** `src/presentation/components/editor/PictureEditorModal.ts` → `PictureEditorMode; PictureEditorModal` — Alta/edición, metadata, fuente, link y confirmaciones.
- **S8-OUT5:** `src/presentation/styles/picture-grid.css` → `picture grid styles` — Celdas 1:1, object-fit contain y estados.
- **S8-OUT6:** `tests/unit/presentation/components/PictureEditorModal.test.ts` → `component tests` — Alta/edición, validación, fuente, enlace y confirmación.
- **S8-OUT7:** `src/presentation/screens/editor/EditorScreen.ts` → `EditorScreen` — Montar `PictureGrid`, abrir `PictureEditorModal`, refrescar por salón seleccionado y liberar scopes de preview al cambiar/desmontar.
- **S8-OUT8:** `src/presentation/components/editor/EditorToolbar.ts` → `EditorToolbar` — Activar `AGREGAR IMAGEN` únicamente con salón seleccionado y conectar el callback al modal de cuadro.
- **S8-OUT9:** `workspace` → `S8 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S8-OUT10:** `.plans/tasks/T3DG-001/plan.md` → `V8, V9, V20, V23 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S7`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S8-IN1`, `S8-IN2`, `S8-IN3`, `S8-IN4`, `S8-IN5`, `S8-IN6`, `S8-IN7`, `S8-IN8`, `S8-IN9` | `S8-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/components/editor/ImagePreview.ts` `ImagePreview` para Resolver URL, cargar imagen contenida y liberar scope. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S8-IN1`, `S8-IN2` | `S8-OUT1` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/components/editor/PictureCard.ts` `PictureCard` para Celda cuadrada clickable con imagen nativa. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S8-IN1`, `S8-IN2`, `S8-OUT1` | `S8-OUT2` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/components/editor/PictureGrid.ts` `PictureGrid` para Grid auto-fit y apertura de modal. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S8-IN1`, `S8-IN2`, `S8-OUT2` | `S8-OUT3` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/components/editor/PictureEditorModal.ts` `PictureEditorMode; PictureEditorModal` para Alta/edición, metadata, fuente, link y confirmaciones. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S8-IN1`, `S8-IN2`, `S8-OUT3` | `S8-OUT4` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/styles/picture-grid.css` `picture grid styles` para Celdas 1:1, object-fit contain y estados. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S8-IN1`, `S8-IN2`, `S8-OUT4` | `S8-OUT5` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `ADD-6` | Implementar en `tests/unit/presentation/components/PictureEditorModal.test.ts` los casos `component tests` para alta/edición, validación, fuente, enlace y confirmación. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-5` | `S8-IN1`, `S8-IN2`, `S8-OUT5` | `S8-OUT6` | Materializa una responsabilidad única de S8; FR9–FR12, FR15, FR19, FR33, NFRE8, NFRE11. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/presentation/screens/editor/EditorScreen.ts` en `EditorScreen`: Montar `PictureGrid`, abrir `PictureEditorModal`, refrescar por salón seleccionado y liberar scopes de preview al cambiar/desmontar. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-6` | `S8-IN8`, `S8-OUT6` | `S8-OUT7` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-2` | Modificar `src/presentation/components/editor/EditorToolbar.ts` en `EditorToolbar`: Activar `AGREGAR IMAGEN` únicamente con salón seleccionado y conectar el callback al modal de cuadro. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-1` | `S8-IN9`, `S8-OUT7` | `S8-OUT8` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-2` | `S8-OUT1`, `S8-OUT2`, `S8-OUT3`, `S8-OUT4`, `S8-OUT5`, `S8-OUT6`, `S8-OUT7`, `S8-OUT8` | `S8-OUT9` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/components/PictureEditorModal.test.ts` y `npm run build`; validar ratio, confirmaciones y lifecycle de preview. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S8-OUT9` | `S8-OUT10` | Demuestra V8, V9, V20, V23 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S8` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S8-OUT10`, `S8-OUT0` | `S8-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
