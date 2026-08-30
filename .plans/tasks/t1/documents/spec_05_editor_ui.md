### S9 — Implementar configuración, reset, importación y exportación

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR13–FR18, FR19, NFRE9, NFRE12, NFRE15
- **Depends:** S7, S8
- **Validation:** V5, V6, V8, V21, V23
- **Outcome:** Modal de sala y operaciones confirmadas de configuración, reset, delete, import/export.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S9-IN1:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S9-IN2:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S9-IN3:** `.plans/tasks/T3DG-001/documents/spec_08_persistence_archives.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S9-IN4:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S9-IN5:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S9-IN6:** `src/presentation/screens/editor/EditorScreen.ts, src/presentation/components/editor/RoomSidebar.ts, src/presentation/components/editor/EditorToolbar.ts` → `implemented dependency` — puntos de integración del Editor de S7–S8.
- **S9-IN7:** `src/application/use-cases/UpdateRoomConfiguration.ts, src/application/use-cases/ResetRoom.ts, src/application/use-cases/DeleteRoom.ts, src/application/use-cases/ImportRoom.ts, src/application/use-cases/ExportRoom.ts, src/application/use-cases/ExportGallery.ts` → `implemented dependency` — operaciones de sala de S3.
- **S9-IN8:** `src/infrastructure/archive/**` → `implemented dependency` — adaptador de archivos aprobado en S4.
- **S9-IN9:** `src/presentation/screens/editor/EditorScreen.ts` → `EditorScreen` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S9-IN10:** `src/presentation/components/editor/RoomSidebar.ts` → `RoomSidebar` — estado previo que este paso debe modificar sin romper responsabilidades existentes.
- **S9-IN11:** `src/presentation/components/editor/EditorToolbar.ts` → `EditorToolbar` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S9-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S9-OUT1:** `src/presentation/components/editor/WallSurfaceField.ts` → `WallSurfaceDraft; WallSurfaceField` — Alternar color/textura y fallback.
- **S9-OUT2:** `src/presentation/components/editor/LightingFields.ts` → `LightingDraft; LightingFields` — Color e intensidades validadas.
- **S9-OUT3:** `src/presentation/components/editor/RoomAssetFields.ts` → `RoomAssetsDraft; RoomAssetFields` — Sonido, volumen, OBJ y escala.
- **S9-OUT4:** `src/presentation/components/editor/RoomConfigModal.ts` → `RoomConfigModal` — Configurar/reset/delete/save con confirmación.
- **S9-OUT5:** `src/presentation/components/editor/RoomFileActions.ts` → `RoomFileActions` — Importar .t3room y descargar sala/galería.
- **S9-OUT6:** `src/presentation/styles/room-config.css` → `room config styles` — Grid de formulario y controles de asset.
- **S9-OUT7:** `tests/unit/presentation/components/RoomConfigModal.test.ts` → `component tests` — Configuración, reset/delete/save y semántica keep/remove/replace.
- **S9-OUT8:** `src/presentation/screens/editor/EditorScreen.ts` → `EditorScreen` — Integrar `RoomConfigModal` y `RoomFileActions`, coordinar pending state y refrescar snapshot después de confirmaciones durables.
- **S9-OUT9:** `src/presentation/components/editor/RoomSidebar.ts` → `RoomSidebar` — Conectar iconos IMPORTAR SALÓN y EXPORTAR GALERÍA a `RoomFileActions`; mantener CREAR SALÓN y nombres accesibles.
- **S9-OUT10:** `src/presentation/components/editor/EditorToolbar.ts` → `EditorToolbar` — Conectar CONFIGURAR SALA y EXPORTAR SALA; aplicar disabled durante ausencia de selección u operación pendiente.
- **S9-OUT11:** `workspace` → `S9 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S9-OUT12:** `.plans/tasks/T3DG-001/plan.md` → `V5, V6, V8, V21, V23 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S7, S8`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S9-IN1`, `S9-IN2`, `S9-IN3`, `S9-IN4`, `S9-IN5`, `S9-IN6`, `S9-IN7`, `S9-IN8`, `S9-IN9`, `S9-IN10`, `S9-IN11` | `S9-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/components/editor/WallSurfaceField.ts` `WallSurfaceDraft; WallSurfaceField` para Alternar color/textura y fallback. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S9-IN1`, `S9-IN2` | `S9-OUT1` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/components/editor/LightingFields.ts` `LightingDraft; LightingFields` para Color e intensidades validadas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S9-IN1`, `S9-IN2`, `S9-OUT1` | `S9-OUT2` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/components/editor/RoomAssetFields.ts` `RoomAssetsDraft; RoomAssetFields` para Sonido, volumen, OBJ y escala. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S9-IN1`, `S9-IN2`, `S9-OUT2` | `S9-OUT3` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/components/editor/RoomConfigModal.ts` `RoomConfigModal` para Configurar/reset/delete/save con confirmación. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S9-IN1`, `S9-IN2`, `S9-OUT3` | `S9-OUT4` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/components/editor/RoomFileActions.ts` `RoomFileActions` para Importar .t3room y descargar sala/galería. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S9-IN1`, `S9-IN2`, `S9-OUT4` | `S9-OUT5` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/styles/room-config.css` `room config styles` para Grid de formulario y controles de asset. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S9-IN1`, `S9-IN2`, `S9-OUT5` | `S9-OUT6` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `ADD-7` | Implementar en `tests/unit/presentation/components/RoomConfigModal.test.ts` los casos `component tests` para configuración, reset/delete/save y semántica keep/remove/replace. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-6` | `S9-IN1`, `S9-IN2`, `S9-OUT6` | `S9-OUT7` | Materializa una responsabilidad única de S9; FR13–FR18, FR19, NFRE9, NFRE12, NFRE15. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/presentation/screens/editor/EditorScreen.ts` en `EditorScreen`: Integrar `RoomConfigModal` y `RoomFileActions`, coordinar pending state y refrescar snapshot después de confirmaciones durables. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-7` | `S9-IN9`, `S9-OUT7` | `S9-OUT8` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-2` | Modificar `src/presentation/components/editor/RoomSidebar.ts` en `RoomSidebar`: Conectar iconos IMPORTAR SALÓN y EXPORTAR GALERÍA a `RoomFileActions`; mantener CREAR SALÓN y nombres accesibles. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-1` | `S9-IN10`, `S9-OUT8` | `S9-OUT9` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `MOD-3` | Modificar `src/presentation/components/editor/EditorToolbar.ts` en `EditorToolbar`: Conectar CONFIGURAR SALA y EXPORTAR SALA; aplicar disabled durante ausencia de selección u operación pendiente. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `MOD-2` | `S9-IN11`, `S9-OUT9` | `S9-OUT10` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-3` | `S9-OUT1`, `S9-OUT2`, `S9-OUT3`, `S9-OUT4`, `S9-OUT5`, `S9-OUT6`, `S9-OUT7`, `S9-OUT8`, `S9-OUT9`, `S9-OUT10` | `S9-OUT11` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/components/RoomConfigModal.test.ts tests/integration/infrastructure/FflateGalleryArchive.test.ts` y `npm run build`; verificar keep/remove/replace y descargas. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S9-OUT11` | `S9-OUT12` | Demuestra V5, V6, V8, V21, V23 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S9` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S9-OUT12`, `S9-OUT0` | `S9-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
