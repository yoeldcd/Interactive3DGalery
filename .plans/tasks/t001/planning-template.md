### S4 — Implementar IndexedDB, activos y archivos exportables

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR17–FR20, FR35, NFRE9, NFRE12–NFRE15
- **Depends:** S3
- **Validation:** V5, V6, V19, V21
- **Outcome:** Persistencia transaccional, ciclo de activos, archivos ZIP, hashing y adaptadores del navegador verificados.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S4-IN1:** `.plans/tasks/T3DG-001/documents/spec_02_architecture_dependencies.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S4-IN2:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S4-IN3:** `.plans/tasks/T3DG-001/documents/spec_08_persistence_archives.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S4-IN4:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S4-IN5:** `.plans/tasks/T3DG-001/documents/spec_10_infrastructure_bootstrap_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S4-IN6:** `src/application/ports/**, src/application/dto/**, src/application/use-cases/**` → `implemented dependency` — contratos internos implementados en S3.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S4-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S4-OUT1:** `src/infrastructure/browser/CryptoIdGenerator.ts` → `CryptoIdGenerator` — Implementar IdGenerator con crypto.randomUUID.
- **S4-OUT2:** `src/infrastructure/browser/SystemClock.ts` → `SystemClock` — Implementar Clock con Date.
- **S4-OUT3:** `src/infrastructure/browser/BrowserImageMetadataReader.ts` → `BrowserImageMetadataReader` — Decodificar dimensiones local/remota y liberar recursos.
- **S4-OUT4:** `src/infrastructure/browser/BrowserStorageQuota.ts` → `BrowserStorageQuota` — Adaptar navigator.storage.estimate.
- **S4-OUT5:** `src/infrastructure/browser/BrowserDownloadService.ts` → `BrowserDownloadService` — Implementar FileDownloadPort con anchor temporal.
- **S4-OUT6:** `src/infrastructure/browser/ObjectUrlRegistry.ts` → `ObjectUrlScope; ObjectUrlRegistry` — Refcount y revocación de blob URLs por scope.
- **S4-OUT7:** `src/infrastructure/browser/BrowserAssetUrlResolver.ts` → `BrowserAssetUrlResolver` — Resolver refs remotas/locales mediante store y registry.
- **S4-OUT8:** `src/infrastructure/persistence/indexeddb/IndexedDbConstants.ts` → `DB_NAME; DB_VERSION; STORE_META; STORE_GALLERIES; STORE_ASSETS; CURRENT_GALLERY_KEY` — Nombres y versión del schema.
- **S4-OUT9:** `src/infrastructure/persistence/indexeddb/IndexedDbRecords.ts` → `GalleryRecord; AssetRecord; MetaRecord` — Registros plain serializables.
- **S4-OUT10:** `src/infrastructure/persistence/indexeddb/IndexedDbV1Migration.ts` → `upgradeToV1()` — Crear object stores e índices v1.
- **S4-OUT11:** `src/infrastructure/persistence/indexeddb/IndexedDbConnection.ts` → `IndexedDbConnection` — Abrir, cachear, cerrar y manejar versionchange.
- **S4-OUT12:** `src/infrastructure/persistence/indexeddb/IndexedDbGalleryStore.ts` → `IndexedDbGalleryStore` — Implementar GalleryStore y transacción atómica.
- **S4-OUT13:** `src/infrastructure/archive/ArchiveManifest.ts` → `ArchiveKind; ArchiveManifest; ArchiveAssetManifestEntry; ARCHIVE_FORMAT_VERSION` — Contrato JSON del contenedor ZIP.
- **S4-OUT14:** `src/infrastructure/archive/ArchiveValidator.ts` → `ArchiveValidator` — Validar rutas, JSON, versiones, tamaños y refs.
- **S4-OUT15:** `src/infrastructure/archive/Sha256ChecksumService.ts` → `Sha256ChecksumService` — Calcular/verificar SHA-256 Web Crypto.
- **S4-OUT16:** `src/infrastructure/archive/FflateGalleryArchive.ts` → `FflateGalleryArchive` — Implementar GalleryArchivePort con ZIP asíncrono.
- **S4-OUT17:** `tests/integration/infrastructure/IndexedDbGalleryStore.test.ts` → `IndexedDB integration tests` — Migración, commit atómico, rollback, reads y versionchange.
- **S4-OUT18:** `tests/integration/infrastructure/FflateGalleryArchive.test.ts` → `archive integration tests` — Round-trip, manifest, bytes, checksums, rutas y límites.
- **S4-OUT19:** `tests/integration/infrastructure/ObjectUrlRegistry.test.ts` → `object URL integration tests` — Scopes, reutilización, refcount y revocación idempotente.
- **S4-OUT20:** `tests/integration/infrastructure/BrowserAdapters.test.ts` → `browser adapter tests` — Metadata, cuota, descarga y resolución de referencias.
- **S4-OUT21:** `workspace` → `S4 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S4-OUT22:** `.plans/tasks/T3DG-001/plan.md` → `V5, V6, V19, V21 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S3`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S4-IN1`, `S4-IN2`, `S4-IN3`, `S4-IN4`, `S4-IN5`, `S4-IN6` | `S4-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/infrastructure/browser/CryptoIdGenerator.ts` `CryptoIdGenerator` para Implementar IdGenerator con crypto.randomUUID. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S4-IN1`, `S4-IN2` | `S4-OUT1` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/infrastructure/browser/SystemClock.ts` `SystemClock` para Implementar Clock con Date. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S4-IN1`, `S4-IN2`, `S4-OUT1` | `S4-OUT2` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/infrastructure/browser/BrowserImageMetadataReader.ts` `BrowserImageMetadataReader` para Decodificar dimensiones local/remota y liberar recursos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S4-IN1`, `S4-IN2`, `S4-OUT2` | `S4-OUT3` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/infrastructure/browser/BrowserStorageQuota.ts` `BrowserStorageQuota` para Adaptar navigator.storage.estimate. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S4-IN1`, `S4-IN2`, `S4-OUT3` | `S4-OUT4` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/infrastructure/browser/BrowserDownloadService.ts` `BrowserDownloadService` para Implementar FileDownloadPort con anchor temporal. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S4-IN1`, `S4-IN2`, `S4-OUT4` | `S4-OUT5` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/infrastructure/browser/ObjectUrlRegistry.ts` `ObjectUrlScope; ObjectUrlRegistry` para Refcount y revocación de blob URLs por scope. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S4-IN1`, `S4-IN2`, `S4-OUT5` | `S4-OUT6` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/infrastructure/browser/BrowserAssetUrlResolver.ts` `BrowserAssetUrlResolver` para Resolver refs remotas/locales mediante store y registry. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S4-IN1`, `S4-IN2`, `S4-OUT6` | `S4-OUT7` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/infrastructure/persistence/indexeddb/IndexedDbConstants.ts` `DB_NAME; DB_VERSION; STORE_META; STORE_GALLERIES; STORE_ASSETS; CURRENT_GALLERY_KEY` para Nombres y versión del schema. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S4-IN1`, `S4-IN2`, `S4-OUT7` | `S4-OUT8` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/infrastructure/persistence/indexeddb/IndexedDbRecords.ts` `GalleryRecord; AssetRecord; MetaRecord` para Registros plain serializables. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S4-IN1`, `S4-IN2`, `S4-OUT8` | `S4-OUT9` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/infrastructure/persistence/indexeddb/IndexedDbV1Migration.ts` `upgradeToV1()` para Crear object stores e índices v1. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S4-IN1`, `S4-IN2`, `S4-OUT9` | `S4-OUT10` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-11` | Implementar en `src/infrastructure/persistence/indexeddb/IndexedDbConnection.ts` `IndexedDbConnection` para Abrir, cachear, cerrar y manejar versionchange. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-10` | `S4-IN1`, `S4-IN2`, `S4-OUT10` | `S4-OUT11` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-12` | Implementar en `src/infrastructure/persistence/indexeddb/IndexedDbGalleryStore.ts` `IndexedDbGalleryStore` para Implementar GalleryStore y transacción atómica. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-11` | `S4-IN1`, `S4-IN2`, `S4-OUT11` | `S4-OUT12` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-13` | Implementar en `src/infrastructure/archive/ArchiveManifest.ts` `ArchiveKind; ArchiveManifest; ArchiveAssetManifestEntry; ARCHIVE_FORMAT_VERSION` para Contrato JSON del contenedor ZIP. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-12` | `S4-IN1`, `S4-IN2`, `S4-OUT12` | `S4-OUT13` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-14` | Implementar en `src/infrastructure/archive/ArchiveValidator.ts` `ArchiveValidator` para Validar rutas, JSON, versiones, tamaños y refs. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-13` | `S4-IN1`, `S4-IN2`, `S4-OUT13` | `S4-OUT14` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-15` | Implementar en `src/infrastructure/archive/Sha256ChecksumService.ts` `Sha256ChecksumService` para Calcular/verificar SHA-256 Web Crypto. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-14` | `S4-IN1`, `S4-IN2`, `S4-OUT14` | `S4-OUT15` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-16` | Implementar en `src/infrastructure/archive/FflateGalleryArchive.ts` `FflateGalleryArchive` para Implementar GalleryArchivePort con ZIP asíncrono. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-15` | `S4-IN1`, `S4-IN2`, `S4-OUT15` | `S4-OUT16` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-17` | Implementar en `tests/integration/infrastructure/IndexedDbGalleryStore.test.ts` los casos `IndexedDB integration tests` para migración, commit atómico, rollback, reads y versionchange. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-16` | `S4-IN1`, `S4-IN2`, `S4-OUT16` | `S4-OUT17` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-18` | Implementar en `tests/integration/infrastructure/FflateGalleryArchive.test.ts` los casos `archive integration tests` para round-trip, manifest, bytes, checksums, rutas y límites. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-17` | `S4-IN1`, `S4-IN2`, `S4-OUT17` | `S4-OUT18` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-19` | Implementar en `tests/integration/infrastructure/ObjectUrlRegistry.test.ts` los casos `object URL integration tests` para scopes, reutilización, refcount y revocación idempotente. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-18` | `S4-IN1`, `S4-IN2`, `S4-OUT18` | `S4-OUT19` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `ADD-20` | Implementar en `tests/integration/infrastructure/BrowserAdapters.test.ts` los casos `browser adapter tests` para metadata, cuota, descarga y resolución de referencias. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-19` | `S4-IN1`, `S4-IN2`, `S4-OUT19` | `S4-OUT20` | Materializa una responsabilidad única de S4; FR17–FR20, FR35, NFRE9, NFRE12–NFRE15. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-20` | `S4-OUT1`, `S4-OUT2`, `S4-OUT3`, `S4-OUT4`, `S4-OUT5`, `S4-OUT6`, `S4-OUT7`, `S4-OUT8`, `S4-OUT9`, `S4-OUT10`, `S4-OUT11`, `S4-OUT12`, `S4-OUT13`, `S4-OUT14`, `S4-OUT15`, `S4-OUT16`, `S4-OUT17`, `S4-OUT18`, `S4-OUT19`, `S4-OUT20` | `S4-OUT21` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/integration/infrastructure` y `npm run typecheck`; probar rollback IndexedDB, round-trip ZIP, checksums y revocación de object URLs. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S4-OUT21` | `S4-OUT22` | Demuestra V5, V6, V19, V21 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S4` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S4-OUT22`, `S4-OUT0` | `S4-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
