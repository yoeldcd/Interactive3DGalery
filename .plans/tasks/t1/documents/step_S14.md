### S5 — Componer aplicación y base de presentación

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15
- **Depends:** S3, S4
- **Validation:** V2, V8, V19, V20
- **Outcome:** Composition root, shell, router, estado serializado y componentes comunes accesibles.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S5-IN1:** `.plans/tasks/T3DG-001/documents/spec_02_architecture_dependencies.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN2:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN3:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN4:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN5:** `.plans/tasks/T3DG-001/documents/spec_10_infrastructure_bootstrap_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN6:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S5-IN7:** `src/application/**, src/infrastructure/**` → `implemented dependency` — casos de uso y adaptadores concretos aprobados en S3–S4.
- **S5-IN8:** `src/bootstrap/bootstrapApplication.ts` → `implemented dependency` — bootstrap mínimo creado en S1.
- **S5-IN9:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — estado previo que este paso debe modificar sin romper responsabilidades existentes.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S5-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S5-OUT1:** `src/presentation/core/DisposableBag.ts` → `Disposable; DisposableBag` — Registrar y ejecutar disposers idempotentes.
- **S5-OUT2:** `src/presentation/core/Component.ts` → `MountableComponent; Component` — Ciclo mount/render/dispose con AbortController.
- **S5-OUT3:** `src/presentation/core/DomFactory.ts` → `element(); button(); input(); clearElement()` — Helpers DOM tipados sin innerHTML dinámico.
- **S5-OUT4:** `src/presentation/core/TypedEvent.ts` → `TypedEventEmitter` — Eventos tipados subscribe/unsubscribe.
- **S5-OUT5:** `src/presentation/app/AppRoute.ts` → `AppRoute; parseRoute(); routeToHash()` — Rutas válidas y normalización.
- **S5-OUT6:** `src/presentation/app/HashRouter.ts` → `HashRouter` — Navegación hash y popstate/hashchange.
- **S5-OUT7:** `src/presentation/app/AppShell.ts` → `SpectatorActivationToken; ScreenFactory; AppShell` — Montar una pantalla y disponer anterior.
- **S5-OUT8:** `src/presentation/state/EditorState.ts` → `UiError; EditorState; initialEditorState()` — Estado inmutable del Editor.
- **S5-OUT9:** `src/presentation/state/EditorStore.ts` → `EditorStoreEvents; EditorStore` — Cola FIFO, selección y fachada de casos de uso.
- **S5-OUT10:** `src/presentation/services/ModalService.ts` → `ModalRequest; ModalService` — Host único de modal y foco restaurado.
- **S5-OUT11:** `src/presentation/services/ToastService.ts` → `ToastKind; ToastMessage; ToastService` — Mensajes transitorios accesibles.
- **S5-OUT12:** `src/presentation/components/common/UiText.ts` → `UI_TEXT` — Etiquetas españolas centralizadas.
- **S5-OUT13:** `src/presentation/components/common/icons.ts` → `IconName; createIcon()` — SVG inline seguro para iconos requeridos.
- **S5-OUT14:** `src/presentation/components/common/IconButton.ts` → `IconButtonOptions; createIconButton()` — Botón solo-icono con tooltip/aria-label.
- **S5-OUT15:** `src/presentation/components/common/ModalFrame.ts` → `ModalFrameOptions; ModalFrame` — Contenedor modal, backdrop y focus trap.
- **S5-OUT16:** `src/presentation/components/common/ConfirmDialog.ts` → `ConfirmDialogOptions; ConfirmDialog` — Diálogo icono+mensaje+SÍ/NO.
- **S5-OUT17:** `src/presentation/components/common/ToastRegion.ts` → `ToastRegion` — Render de toasts aria-live.
- **S5-OUT18:** `src/presentation/components/common/LoadingOverlay.ts` → `LoadingOverlay` — Bloqueo visual durante operación pendiente.
- **S5-OUT19:** `src/presentation/components/common/AssetSourceField.ts` → `AssetSourceFieldValue; AssetSourceField` — Selector archivo/URL reutilizable.
- **S5-OUT20:** `src/presentation/components/common/FormFields.ts` → `createTextField(); createTextAreaField(); createColorField(); createNumberField()` — Campos etiquetados, errores y rangos.
- **S5-OUT21:** `src/presentation/components/common/StorageQuotaNotice.ts` → `StorageQuotaNotice` — Mostrar advertencia de uso >=80%.
- **S5-OUT22:** `src/presentation/styles/common.css` → `common component styles` — Botones, formularios, tooltips y loading.
- **S5-OUT23:** `src/presentation/styles/modals.css` → `modal styles` — Backdrop, frame, footer y focus states.
- **S5-OUT24:** `src/bootstrap/ApplicationContainer.ts` → `ApplicationUseCases; ApplicationContainer` — Superficie inmutable de dependencias.
- **S5-OUT25:** `src/bootstrap/createApplicationContainer.ts` → `createApplicationContainer()` — Instanciar ports, services y use cases.
- **S5-OUT26:** `tests/unit/presentation/core/DisposableBag.test.ts` → `presentation core tests` — Disposición LIFO, idempotencia y agregación segura.
- **S5-OUT27:** `tests/unit/presentation/components/ConfirmDialog.test.ts` → `component tests` — Focus trap, resolución SÍ/NO/Escape y restauración de foco.
- **S5-OUT28:** `tests/unit/presentation/state/EditorStore.test.ts` → `state tests` — Cola FIFO, pending state, refresh durable y errores tipados.
- **S5-OUT29:** `src/bootstrap/bootstrapApplication.ts` → `bootstrapApplication()` — Sustituir el bootstrap mínimo por inicialización de galería, creación del contenedor, router, AppShell, toast/modal hosts y pantalla fallback privada; registrar todos los disposers.
- **S5-OUT30:** `workspace` → `S5 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S5-OUT31:** `.plans/tasks/T3DG-001/plan.md` → `V2, V8, V19, V20 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S3, S4`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S5-IN1`, `S5-IN2`, `S5-IN3`, `S5-IN4`, `S5-IN5`, `S5-IN6`, `S5-IN7`, `S5-IN8`, `S5-IN9` | `S5-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/core/DisposableBag.ts` `Disposable; DisposableBag` para Registrar y ejecutar disposers idempotentes. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S5-IN1`, `S5-IN2` | `S5-OUT1` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/core/Component.ts` `MountableComponent; Component` para Ciclo mount/render/dispose con AbortController. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S5-IN1`, `S5-IN2`, `S5-OUT1` | `S5-OUT2` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/core/DomFactory.ts` `element(); button(); input(); clearElement()` para Helpers DOM tipados sin innerHTML dinámico. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S5-IN1`, `S5-IN2`, `S5-OUT2` | `S5-OUT3` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/core/TypedEvent.ts` `TypedEventEmitter` para Eventos tipados subscribe/unsubscribe. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S5-IN1`, `S5-IN2`, `S5-OUT3` | `S5-OUT4` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/app/AppRoute.ts` `AppRoute; parseRoute(); routeToHash()` para Rutas válidas y normalización. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S5-IN1`, `S5-IN2`, `S5-OUT4` | `S5-OUT5` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/app/HashRouter.ts` `HashRouter` para Navegación hash y popstate/hashchange. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S5-IN1`, `S5-IN2`, `S5-OUT5` | `S5-OUT6` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/presentation/app/AppShell.ts` `SpectatorActivationToken; ScreenFactory; AppShell` para Montar una pantalla y disponer anterior. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S5-IN1`, `S5-IN2`, `S5-OUT6` | `S5-OUT7` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/presentation/state/EditorState.ts` `UiError; EditorState; initialEditorState()` para Estado inmutable del Editor. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S5-IN1`, `S5-IN2`, `S5-OUT7` | `S5-OUT8` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/presentation/state/EditorStore.ts` `EditorStoreEvents; EditorStore` para Cola FIFO, selección y fachada de casos de uso. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S5-IN1`, `S5-IN2`, `S5-OUT8` | `S5-OUT9` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/presentation/services/ModalService.ts` `ModalRequest; ModalService` para Host único de modal y foco restaurado. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S5-IN1`, `S5-IN2`, `S5-OUT9` | `S5-OUT10` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-11` | Implementar en `src/presentation/services/ToastService.ts` `ToastKind; ToastMessage; ToastService` para Mensajes transitorios accesibles. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-10` | `S5-IN1`, `S5-IN2`, `S5-OUT10` | `S5-OUT11` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-12` | Implementar en `src/presentation/components/common/UiText.ts` `UI_TEXT` para Etiquetas españolas centralizadas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-11` | `S5-IN1`, `S5-IN2`, `S5-OUT11` | `S5-OUT12` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-13` | Implementar en `src/presentation/components/common/icons.ts` `IconName; createIcon()` para SVG inline seguro para iconos requeridos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-12` | `S5-IN1`, `S5-IN2`, `S5-OUT12` | `S5-OUT13` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-14` | Implementar en `src/presentation/components/common/IconButton.ts` `IconButtonOptions; createIconButton()` para Botón solo-icono con tooltip/aria-label. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-13` | `S5-IN1`, `S5-IN2`, `S5-OUT13` | `S5-OUT14` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-15` | Implementar en `src/presentation/components/common/ModalFrame.ts` `ModalFrameOptions; ModalFrame` para Contenedor modal, backdrop y focus trap. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-14` | `S5-IN1`, `S5-IN2`, `S5-OUT14` | `S5-OUT15` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-16` | Implementar en `src/presentation/components/common/ConfirmDialog.ts` `ConfirmDialogOptions; ConfirmDialog` para Diálogo icono+mensaje+SÍ/NO. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-15` | `S5-IN1`, `S5-IN2`, `S5-OUT15` | `S5-OUT16` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-17` | Implementar en `src/presentation/components/common/ToastRegion.ts` `ToastRegion` para Render de toasts aria-live. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-16` | `S5-IN1`, `S5-IN2`, `S5-OUT16` | `S5-OUT17` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-18` | Implementar en `src/presentation/components/common/LoadingOverlay.ts` `LoadingOverlay` para Bloqueo visual durante operación pendiente. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-17` | `S5-IN1`, `S5-IN2`, `S5-OUT17` | `S5-OUT18` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-19` | Implementar en `src/presentation/components/common/AssetSourceField.ts` `AssetSourceFieldValue; AssetSourceField` para Selector archivo/URL reutilizable. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-18` | `S5-IN1`, `S5-IN2`, `S5-OUT18` | `S5-OUT19` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-20` | Implementar en `src/presentation/components/common/FormFields.ts` `createTextField(); createTextAreaField(); createColorField(); createNumberField()` para Campos etiquetados, errores y rangos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-19` | `S5-IN1`, `S5-IN2`, `S5-OUT19` | `S5-OUT20` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-21` | Implementar en `src/presentation/components/common/StorageQuotaNotice.ts` `StorageQuotaNotice` para Mostrar advertencia de uso >=80%. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-20` | `S5-IN1`, `S5-IN2`, `S5-OUT20` | `S5-OUT21` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-22` | Implementar en `src/presentation/styles/common.css` `common component styles` para Botones, formularios, tooltips y loading. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-21` | `S5-IN1`, `S5-IN2`, `S5-OUT21` | `S5-OUT22` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-23` | Implementar en `src/presentation/styles/modals.css` `modal styles` para Backdrop, frame, footer y focus states. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-22` | `S5-IN1`, `S5-IN2`, `S5-OUT22` | `S5-OUT23` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-24` | Implementar en `src/bootstrap/ApplicationContainer.ts` `ApplicationUseCases; ApplicationContainer` para Superficie inmutable de dependencias. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-23` | `S5-IN1`, `S5-IN2`, `S5-OUT23` | `S5-OUT24` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-25` | Implementar en `src/bootstrap/createApplicationContainer.ts` `createApplicationContainer()` para Instanciar ports, services y use cases. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-24` | `S5-IN1`, `S5-IN2`, `S5-OUT24` | `S5-OUT25` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-26` | Implementar en `tests/unit/presentation/core/DisposableBag.test.ts` los casos `presentation core tests` para disposición lifo, idempotencia y agregación segura. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-25` | `S5-IN1`, `S5-IN2`, `S5-OUT25` | `S5-OUT26` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-27` | Implementar en `tests/unit/presentation/components/ConfirmDialog.test.ts` los casos `component tests` para focus trap, resolución sí/no/escape y restauración de foco. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-26` | `S5-IN1`, `S5-IN2`, `S5-OUT26` | `S5-OUT27` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `ADD-28` | Implementar en `tests/unit/presentation/state/EditorStore.test.ts` los casos `state tests` para cola fifo, pending state, refresh durable y errores tipados. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-27` | `S5-IN1`, `S5-IN2`, `S5-OUT27` | `S5-OUT28` | Materializa una responsabilidad única de S5; FR1, FR15, FR37, NFRE4, NFRE5, NFRE11, NFRE15. | `ORQ`:`~` |
| `MOD-1` | Modificar `src/bootstrap/bootstrapApplication.ts` en `bootstrapApplication()`: Sustituir el bootstrap mínimo por inicialización de galería, creación del contenedor, router, AppShell, toast/modal hosts y pantalla fallback privada; registrar todos los disposers. Mantener su API previa salvo la ampliación documentada y actualizar imports/dispose correspondientes. | `ADD-28` | `S5-IN9`, `S5-OUT28` | `S5-OUT29` | Integra los nuevos componentes sin crear una segunda responsabilidad. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `MOD-1` | `S5-OUT1`, `S5-OUT2`, `S5-OUT3`, `S5-OUT4`, `S5-OUT5`, `S5-OUT6`, `S5-OUT7`, `S5-OUT8`, `S5-OUT9`, `S5-OUT10`, `S5-OUT11`, `S5-OUT12`, `S5-OUT13`, `S5-OUT14`, `S5-OUT15`, `S5-OUT16`, `S5-OUT17`, `S5-OUT18`, `S5-OUT19`, `S5-OUT20`, `S5-OUT21`, `S5-OUT22`, `S5-OUT23`, `S5-OUT24`, `S5-OUT25`, `S5-OUT26`, `S5-OUT27`, `S5-OUT28`, `S5-OUT29` | `S5-OUT30` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/core tests/unit/presentation/state tests/unit/presentation/components/ConfirmDialog.test.ts` y `npm run build`; comprobar FIFO, foco y dispose. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S5-OUT30` | `S5-OUT31` | Demuestra V2, V8, V19, V20 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S5` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S5-OUT31`, `S5-OUT0` | `S5-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
