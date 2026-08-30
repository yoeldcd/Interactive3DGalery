### S1 — Inicializar baseline reproducible

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** NFRE3, NFRE17, NFRE18
- **Depends:** ~
- **Validation:** V1, V3
- **Outcome:** Proyecto Vite Vanilla TypeScript compilable, dependencias fijadas, configuración estricta y bootstrap mínimo.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S1-IN1:** `.plans/tasks/T3DG-001/plan.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S1-IN2:** `.plans/tasks/T3DG-001/documents/spec_02_architecture_dependencies.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S1-IN3:** `.plans/tasks/T3DG-001/documents/spec_04_file_tree_symbols.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S1-IN4:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S1-IN5:** `.plans/tasks/T3DG-001/documents/spec_10_infrastructure_bootstrap_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S1-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S1-OUT1:** `.gitignore` → `—` — Ignorar node_modules, dist, reports, Playwright artifacts y archivos temporales.
- **S1-OUT2:** `index.html` → `#app` — Documento HTML mínimo, meta viewport y host único de la SPA.
- **S1-OUT3:** `package.json` → `scripts, dependencies, devDependencies, engines` — Baseline reproducible y comandos normativos.
- **S1-OUT4:** `package-lock.json` → `lockfile npm` — Resolución exacta de dependencias.
- **S1-OUT5:** `tsconfig.json` → `compilerOptions` — Contrato de TypeScript estricto.
- **S1-OUT6:** `vite.config.ts` → `default export defineConfig` — Alias por capas, base relativa y chunks de build.
- **S1-OUT7:** `vitest.config.ts` → `default export defineConfig` — Descubrimiento y entorno de tests unitarios.
- **S1-OUT8:** `playwright.config.ts` → `default export defineConfig` — Servidor preview, navegador y políticas E2E.
- **S1-OUT9:** `public/favicon.svg` → `SVG asset` — Icono estático sin dependencia externa.
- **S1-OUT10:** `src/main.ts` → `main()` — Importar estilos y delegar exclusivamente a bootstrapApplication.
- **S1-OUT11:** `src/presentation/styles/reset.css` → `global reset` — Normalización mínima de box sizing, body, button e input.
- **S1-OUT12:** `src/presentation/styles/tokens.css` → `:root tokens` — Tipografía, superficies, espacios, radios, z-index y motion tokens.
- **S1-OUT13:** `src/presentation/styles/app.css` → `#app, .visually-hidden` — Reglas globales de host y utilidades accesibles.
- **S1-OUT14:** `tests/setup/reset-browser-mocks.ts` → `resetBrowserMocks()` — Restaurar APIs y mocks de navegador después de cada test.
- **S1-OUT15:** `src/bootstrap/bootstrapApplication.ts` → `BootstrapHandle; bootstrapApplication()` — Bootstrap mínimo compilable; S5 implementa composición real y pasos posteriores registran pantallas.
- **S1-OUT16:** `workspace` → `S1 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S1-OUT17:** `.plans/tasks/T3DG-001/plan.md` → `V1, V3 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `~`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S1-IN1`, `S1-IN2`, `S1-IN3`, `S1-IN4`, `S1-IN5` | `S1-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Definir en `.gitignore` el contenido normativo para Ignorar node_modules, dist, reports, Playwright artifacts y archivos temporales. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S1-IN1`, `S1-IN2` | `S1-OUT1` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-2` | Definir en `index.html` `#app` para Documento HTML mínimo, meta viewport y host único de la SPA. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S1-IN1`, `S1-IN2`, `S1-OUT1` | `S1-OUT2` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-3` | Definir en `package.json` `scripts, dependencies, devDependencies, engines` para Baseline reproducible y comandos normativos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S1-IN1`, `S1-IN2`, `S1-OUT2` | `S1-OUT3` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-4` | Ejecutar `npm install` con las versiones exactas de SP2 y conservar el `package-lock.json` npm resultante; no editar manualmente resoluciones ni integrity hashes. | `ADD-3` | `S1-IN1`, `S1-IN2`, `S1-OUT3` | `S1-OUT4` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-5` | Definir en `tsconfig.json` `compilerOptions` para Contrato de TypeScript estricto. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S1-IN1`, `S1-IN2`, `S1-OUT4` | `S1-OUT5` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-6` | Definir en `vite.config.ts` `default export defineConfig` para Alias por capas, base relativa y chunks de build. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S1-IN1`, `S1-IN2`, `S1-OUT5` | `S1-OUT6` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-7` | Definir en `vitest.config.ts` `default export defineConfig` para Descubrimiento y entorno de tests unitarios. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S1-IN1`, `S1-IN2`, `S1-OUT6` | `S1-OUT7` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-8` | Definir en `playwright.config.ts` `default export defineConfig` para Servidor preview, navegador y políticas E2E. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S1-IN1`, `S1-IN2`, `S1-OUT7` | `S1-OUT8` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-9` | Crear en `public/favicon.svg` `SVG asset` para Icono estático sin dependencia externa. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S1-IN1`, `S1-IN2`, `S1-OUT8` | `S1-OUT9` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/main.ts` `main()` para Importar estilos y delegar exclusivamente a bootstrapApplication. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S1-IN1`, `S1-IN2`, `S1-OUT9` | `S1-OUT10` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-11` | Implementar en `src/presentation/styles/reset.css` `global reset` para Normalización mínima de box sizing, body, button e input. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-10` | `S1-IN1`, `S1-IN2`, `S1-OUT10` | `S1-OUT11` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-12` | Implementar en `src/presentation/styles/tokens.css` `:root tokens` para Tipografía, superficies, espacios, radios, z-index y motion tokens. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-11` | `S1-IN1`, `S1-IN2`, `S1-OUT11` | `S1-OUT12` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-13` | Implementar en `src/presentation/styles/app.css` `#app, .visually-hidden` para Reglas globales de host y utilidades accesibles. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-12` | `S1-IN1`, `S1-IN2`, `S1-OUT12` | `S1-OUT13` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-14` | Implementar en `tests/setup/reset-browser-mocks.ts` `resetBrowserMocks()` para Restaurar APIs y mocks de navegador después de cada test. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-13` | `S1-IN1`, `S1-IN2`, `S1-OUT13` | `S1-OUT14` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `ADD-15` | Implementar en `src/bootstrap/bootstrapApplication.ts` `BootstrapHandle; bootstrapApplication()` para Bootstrap mínimo compilable; S5 implementa composición real y pasos posteriores registran pantallas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-14` | `S1-IN1`, `S1-IN2`, `S1-OUT14` | `S1-OUT15` | Materializa una responsabilidad única de S1; NFRE3, NFRE17, NFRE18. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-15` | `S1-OUT1`, `S1-OUT2`, `S1-OUT3`, `S1-OUT4`, `S1-OUT5`, `S1-OUT6`, `S1-OUT7`, `S1-OUT8`, `S1-OUT9`, `S1-OUT10`, `S1-OUT11`, `S1-OUT12`, `S1-OUT13`, `S1-OUT14`, `S1-OUT15` | `S1-OUT16` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | `npm install` para generar el lockfile; después `npm run typecheck` y `npm run build` deben finalizar en cero y `dist/` debe contener una SPA estática mínima. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S1-OUT16` | `S1-OUT17` | Demuestra V1, V3 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S1` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S1-OUT17`, `S1-OUT0` | `S1-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
