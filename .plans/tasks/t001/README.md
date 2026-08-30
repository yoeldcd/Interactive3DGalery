# T3DG-001 — Paquete de planificación de la Galería 3D

Este paquete convierte la especificación de la galería interactiva en una guía de implementación frontend completa. No contiene el producto implementado; contiene los contratos necesarios para construirlo sin decidir arquitectura, archivos, símbolos, fórmulas, persistencia, flujos o criterios de aceptación durante la ejecución.

## Documento de entrada

- [`plan.md`](./plan.md) — documento maestro basado en la plantilla suministrada. Conserva sus secciones y comment tags, registra requisitos, análisis, propuesta, recursos, riesgos, gates, pasos, progreso e historial.
- [`AUDIT.md`](./AUDIT.md) — auditoría automatizada de estructura, enlaces, símbolos, ownership de archivos, métricas y consistencia documental.

## Especificaciones normativas

1. [`spec_01_product_scope.md`](./documents/spec_01_product_scope.md) — alcance, actores, estados, flujos, readiness y exclusiones.
2. [`spec_02_architecture_dependencies.md`](./documents/spec_02_architecture_dependencies.md) — arquitectura limpia, reglas de imports, DI, runtime, versiones y scripts.
3. [`spec_03_domain_application_contracts.md`](./documents/spec_03_domain_application_contracts.md) — tipos, entidades, snapshots, atributos, métodos, puertos, servicios y casos de uso.
4. [`spec_04_file_tree_symbols.md`](./documents/spec_04_file_tree_symbols.md) — árbol completo y ownership de cada archivo/símbolo.
5. [`spec_05_editor_ui.md`](./documents/spec_05_editor_ui.md) — layout, componentes, forms, modales y confirmaciones del Editor.
6. [`spec_06_spectator_runtime.md`](./documents/spec_06_spectator_runtime.md) — runtime Three.js, avatar, cámara, colisiones, HUD, audio y lifecycle.
7. [`spec_07_procedural_geometry.md`](./documents/spec_07_procedural_geometry.md) — fórmulas de cuadros, N-gons, entrada, vestíbulo, pasillo y colliders.
8. [`spec_08_persistence_archives.md`](./documents/spec_08_persistence_archives.md) — IndexedDB, blobs, object URLs, ZIP, manifests, checksums e importación segura.
9. [`spec_09_validation_tests.md`](./documents/spec_09_validation_tests.md) — estrategia, fixtures, matrices unitarias/integración/E2E, rendimiento y aceptación.
10. [`spec_10_infrastructure_bootstrap_contracts.md`](./documents/spec_10_infrastructure_bootstrap_contracts.md) — APIs exactas de navegador, IndexedDB, ZIP y composición.
11. [`spec_11_dom_presentation_contracts.md`](./documents/spec_11_dom_presentation_contracts.md) — APIs exactas del estado, routing, servicios, pantallas y componentes DOM.
12. [`spec_12_threejs_symbol_contracts.md`](./documents/spec_12_threejs_symbol_contracts.md) — APIs exactas de geometría, builders, avatar, cámara, sistemas y runtime Three.js.

## Guías ejecutables

[`step_S1.md`](./documents/step_S1.md) a [`step_S15.md`](./documents/step_S15.md) definen para cada incremento:

- requisitos y gates satisfechos;
- dependencias heredadas;
- inputs y outputs identificados;
- un output por archivo o modificación;
- acciones atómicas `REV`, `ADD`, `MOD`, `INT`, `VAL` y `DOC`;
- archivo, símbolo, responsabilidad, dependencia y executor de cada acción;
- comando y condición exactos para cerrar el paso.

Los tests se crean junto con el comportamiento que verifican. S15 conserva las pruebas E2E transversales, auditoría de capas, documentación y aceptación final.

## Diagramas

- [`architecture.svg`](./sources/architecture.svg) — capas y dirección de dependencias.
- [`editor-layout.svg`](./sources/editor-layout.svg) — proporciones `15dvw/85dvw` y `10dvh/90dvh`.
- [`spectator-world.svg`](./sources/spectator-world.svg) — pasillo, salones alternados, puertas y exhibits.
- [`data-flow.svg`](./sources/data-flow.svg) — mutación, commit IndexedDB y exportación.

## Decisiones cerradas

- “TreeJS” se normaliza a **Three.js** y al paquete npm `three`.
- Aplicación **solo frontend**, sin backend, autenticación ni sincronización remota.
- Vanilla TypeScript y componentes DOM con inyección de dependencias; no React/Vue.
- `domain → none`, `application → domain`; presentation/infrastructure implementan contratos internos y bootstrap compone.
- Snapshots serializables con `AssetRef`; blobs separados en IndexedDB.
- `.t3room` y `.t3gallery` son ZIP versionados con manifest y SHA-256.
- Un salón puede estar incompleto en Editor, pero Espectador exige al menos tres cuadros y OBJ.
- N cuadros producen N paredes; la puerta abre un vértice para no sacrificar una pared de exposición.
- Control de escritorio en tercera persona; avatar procedural visible; sin motor físico externo.
- OBJ sin MTL usa material fallback; URLs remotas conservan su dependencia de CORS.

## Destino recomendado

Copiar el contenido del paquete a:

```text
.plans/tasks/T3DG-001/
```

Desde allí, ejecutar los pasos en orden y mantener `Execution Progress` y `Execution History` dentro de `plan.md`.
