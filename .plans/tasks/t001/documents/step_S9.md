### S15 — Validar, documentar y producir build final

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** todos los FR, todos los NFRE
- **Depends:** S1–S14
- **Validation:** V1–V23
- **Outcome:** Auditoría, E2E, fixtures, documentación, matriz de aceptación y build estático aprobado.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S15-IN1:** `.plans/tasks/T3DG-001/plan.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN2:** `.plans/tasks/T3DG-001/documents/spec_01_product_scope.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN3:** `.plans/tasks/T3DG-001/documents/spec_02_architecture_dependencies.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN4:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN5:** `.plans/tasks/T3DG-001/documents/spec_04_file_tree_symbols.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN6:** `.plans/tasks/T3DG-001/documents/spec_05_editor_ui.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN7:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN8:** `.plans/tasks/T3DG-001/documents/spec_07_procedural_geometry.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN9:** `.plans/tasks/T3DG-001/documents/spec_08_persistence_archives.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN10:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN11:** `.plans/tasks/T3DG-001/documents/spec_10_infrastructure_bootstrap_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN12:** `.plans/tasks/T3DG-001/documents/spec_11_dom_presentation_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN13:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S15-IN14:** `src/**, tests/unit/**, tests/integration/**` → `implemented dependency` — producto y pruebas incrementales de S1–S14.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S15-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S15-OUT1:** `scripts/audit-layer-imports.mjs` → `auditLayerImports()` — Rechazar imports que violen SP2.
- **S15-OUT2:** `tests/e2e/home-editor.spec.ts` → `Playwright scenarios` — Inicio, rename, create, modales y persistencia.
- **S15-OUT3:** `tests/e2e/room-archive.spec.ts` → `Playwright scenarios` — Export/import round-trip y rechazo corrupto.
- **S15-OUT4:** `tests/e2e/spectator.spec.ts` → `Playwright scenarios` — Readiness, movimiento, HUD y link.
- **S15-OUT5:** `tests/e2e/lifecycle.spec.ts` → `Playwright scenarios` — Diez mounts y ausencia de recursos duplicados.
- **S15-OUT6:** `tests/e2e/performance.spec.ts` → `Playwright benchmark` — Fixture de referencia y p95.
- **S15-OUT7:** `tests/fixtures/picture-landscape.png` → `binary fixture` — Imagen horizontal pequeña.
- **S15-OUT8:** `tests/fixtures/picture-portrait.png` → `binary fixture` — Imagen vertical pequeña.
- **S15-OUT9:** `tests/fixtures/picture-square.png` → `binary fixture` — Imagen cuadrada pequeña.
- **S15-OUT10:** `tests/fixtures/exhibit.obj` → `OBJ fixture` — Modelo central mínimo válido.
- **S15-OUT11:** `tests/fixtures/ambient.ogg` → `audio fixture` — Audio corto y libre para prueba local.
- **S15-OUT12:** `README.md` → `project guide` — Instalación, scripts, alcance y navegación documental.
- **S15-OUT13:** `docs/architecture.md` → `architecture guide` — Capas, DI, lifecycle y reglas de imports.
- **S15-OUT14:** `docs/data-format.md` → `archive/schema guide` — Snapshots, IndexedDB y formatos de exportación.
- **S15-OUT15:** `docs/controls.md` → `user guide` — Editor, teclado/ratón, HUD y límites.
- **S15-OUT16:** `docs/acceptance.md` → `acceptance matrix` — FR/NFRE/V trazables a pruebas.
- **S15-OUT17:** `workspace` → `S15 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S15-OUT18:** `.plans/tasks/T3DG-001/plan.md` → `V1–V23 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S1–S14`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S15-IN1`, `S15-IN2`, `S15-IN3`, `S15-IN4`, `S15-IN5`, `S15-IN6`, `S15-IN7`, `S15-IN8`, `S15-IN9`, `S15-IN10`, `S15-IN11`, `S15-IN12`, `S15-IN13`, `S15-IN14` | `S15-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `scripts/audit-layer-imports.mjs` `auditLayerImports()` para Rechazar imports que violen SP2. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S15-IN1`, `S15-IN2` | `S15-OUT1` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-2` | Implementar en `tests/e2e/home-editor.spec.ts` los casos `Playwright scenarios` para inicio, rename, create, modales y persistencia. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-1` | `S15-IN1`, `S15-IN2`, `S15-OUT1` | `S15-OUT2` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-3` | Implementar en `tests/e2e/room-archive.spec.ts` los casos `Playwright scenarios` para export/import round-trip y rechazo corrupto. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-2` | `S15-IN1`, `S15-IN2`, `S15-OUT2` | `S15-OUT3` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-4` | Implementar en `tests/e2e/spectator.spec.ts` los casos `Playwright scenarios` para readiness, movimiento, hud y link. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-3` | `S15-IN1`, `S15-IN2`, `S15-OUT3` | `S15-OUT4` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-5` | Implementar en `tests/e2e/lifecycle.spec.ts` los casos `Playwright scenarios` para diez mounts y ausencia de recursos duplicados. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-4` | `S15-IN1`, `S15-IN2`, `S15-OUT4` | `S15-OUT5` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-6` | Implementar en `tests/e2e/performance.spec.ts` los casos `Playwright benchmark` para fixture de referencia y p95. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-5` | `S15-IN1`, `S15-IN2`, `S15-OUT5` | `S15-OUT6` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-7` | Crear `tests/fixtures/picture-landscape.png` con imagen horizontal pequeña. conforme a las dimensiones/contenido exactos de SP9; mantener tamaño compacto y origen redistribuible. | `ADD-6` | `S15-IN1`, `S15-IN2`, `S15-OUT6` | `S15-OUT7` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-8` | Crear `tests/fixtures/picture-portrait.png` con imagen vertical pequeña. conforme a las dimensiones/contenido exactos de SP9; mantener tamaño compacto y origen redistribuible. | `ADD-7` | `S15-IN1`, `S15-IN2`, `S15-OUT7` | `S15-OUT8` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-9` | Crear `tests/fixtures/picture-square.png` con imagen cuadrada pequeña. conforme a las dimensiones/contenido exactos de SP9; mantener tamaño compacto y origen redistribuible. | `ADD-8` | `S15-IN1`, `S15-IN2`, `S15-OUT8` | `S15-OUT9` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-10` | Crear `tests/fixtures/exhibit.obj` con modelo central mínimo válido. conforme a las dimensiones/contenido exactos de SP9; mantener tamaño compacto y origen redistribuible. | `ADD-9` | `S15-IN1`, `S15-IN2`, `S15-OUT9` | `S15-OUT10` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-11` | Crear `tests/fixtures/ambient.ogg` con audio corto y libre para prueba local. conforme a las dimensiones/contenido exactos de SP9; mantener tamaño compacto y origen redistribuible. | `ADD-10` | `S15-IN1`, `S15-IN2`, `S15-OUT10` | `S15-OUT11` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-12` | Redactar `README.md` como project guide: Instalación, scripts, alcance y navegación documental. No duplicar reglas; enlazar la especificación normativa correspondiente. | `ADD-11` | `S15-IN1`, `S15-IN2`, `S15-OUT11` | `S15-OUT12` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-13` | Redactar `docs/architecture.md` como architecture guide: Capas, DI, lifecycle y reglas de imports. No duplicar reglas; enlazar la especificación normativa correspondiente. | `ADD-12` | `S15-IN1`, `S15-IN2`, `S15-OUT12` | `S15-OUT13` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-14` | Redactar `docs/data-format.md` como archive/schema guide: Snapshots, IndexedDB y formatos de exportación. No duplicar reglas; enlazar la especificación normativa correspondiente. | `ADD-13` | `S15-IN1`, `S15-IN2`, `S15-OUT13` | `S15-OUT14` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-15` | Redactar `docs/controls.md` como user guide: Editor, teclado/ratón, HUD y límites. No duplicar reglas; enlazar la especificación normativa correspondiente. | `ADD-14` | `S15-IN1`, `S15-IN2`, `S15-OUT14` | `S15-OUT15` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `ADD-16` | Redactar `docs/acceptance.md` como acceptance matrix: FR/NFRE/V trazables a pruebas. No duplicar reglas; enlazar la especificación normativa correspondiente. | `ADD-15` | `S15-IN1`, `S15-IN2`, `S15-OUT15` | `S15-OUT16` | Materializa una responsabilidad única de S15; todos los FR, todos los NFRE. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-16` | `S15-OUT1`, `S15-OUT2`, `S15-OUT3`, `S15-OUT4`, `S15-OUT5`, `S15-OUT6`, `S15-OUT7`, `S15-OUT8`, `S15-OUT9`, `S15-OUT10`, `S15-OUT11`, `S15-OUT12`, `S15-OUT13`, `S15-OUT14`, `S15-OUT15`, `S15-OUT16` | `S15-OUT17` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar desde workspace limpio `npm ci && npm run validate`; completar además la verificación manual y registrar V1–V23 en `docs/acceptance.md`. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S15-OUT17` | `S15-OUT18` | Demuestra V1–V23 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S15` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S15-OUT18`, `S15-OUT0` | `S15-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
