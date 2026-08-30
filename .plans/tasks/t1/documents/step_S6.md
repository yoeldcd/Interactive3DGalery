### S2 — Implementar dominio e invariantes

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13
- **Depends:** S1
- **Validation:** V2, V4
- **Outcome:** Modelo de dominio puro, serializable y probado, sin dependencias del navegador.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S2-IN1:** `.plans/tasks/T3DG-001/documents/spec_03_domain_application_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S2-IN2:** `.plans/tasks/T3DG-001/documents/spec_04_file_tree_symbols.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S2-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S2-IN4:** `package.json, tsconfig.json, vitest.config.ts` → `implemented dependency` — baseline de compilación y pruebas de S1.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S2-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S2-OUT1:** `src/domain/constants/GalleryDefaults.ts` → `GALLERY_SCHEMA_VERSION; DEFAULT_GALLERY_NAME; DEFAULT_WALL_COLOR; DEFAULT_LIGHT_COLOR; DEFAULT_AMBIENT_INTENSITY; DEFAULT_SPOTLIGHT_INTENSITY; DEFAULT_SOUND_VOLUME; DEFAULT_OBJECT_SCALE; MIN_PICTURES_PER_ROOM` — Valores iniciales e invariantes compartidos del dominio.
- **S2-OUT2:** `src/domain/errors/DomainError.ts` → `DomainErrorCode; DomainError` — Error tipado para valores, snapshots y búsquedas inválidas.
- **S2-OUT3:** `src/domain/value-objects/EntityIds.ts` → `GalleryId; RoomId; PictureId; AssetId; asGalleryId(); asRoomId(); asPictureId(); asAssetId(); isUuid()` — Ids opacos validados.
- **S2-OUT4:** `src/domain/value-objects/HexColor.ts` → `HexColor; createHexColor(); isHexColor()` — Color canónico #RRGGBB.
- **S2-OUT5:** `src/domain/value-objects/TextFields.ts` → `normalizeRequiredName(); normalizeDescription(); normalizeLinkLabel(); slugifyFileName()` — Normalización de texto y nombres de exportación.
- **S2-OUT6:** `src/domain/value-objects/ImageSize.ts` → `ImageSize; createImageSize(); imageAspectRatio()` — Dimensiones intrínsecas validadas.
- **S2-OUT7:** `src/domain/value-objects/ExternalLink.ts` → `ExternalLink; createExternalLink()` — Enlaces http/https sin credenciales.
- **S2-OUT8:** `src/domain/value-objects/AssetRef.ts` → `AssetKind; LocalAssetRef; RemoteAssetRef; AssetRef; createLocalAssetRef(); createRemoteAssetRef(); isLocalAssetRef()` — Referencia serializable a binario local o URL.
- **S2-OUT9:** `src/domain/value-objects/ObjectScale.ts` → `ObjectScale; createObjectScale()` — Escala cerrada 0..10.
- **S2-OUT10:** `src/domain/value-objects/RoomEnvironment.ts` → `WallSurface; RoomLighting; RoomSound; CentralExhibit; RoomEnvironment; createWallColorSurface(); createWallTextureSurface(); createRoomLighting(); createRoomSound(); createCentralExhibit(); createDefaultRoomEnvironment()` — Ambiente completo e inmutable del salón.
- **S2-OUT11:** `src/domain/snapshots/GalleryPictureSnapshot.ts` → `GalleryPictureSnapshot` — DTO persistible de cuadro.
- **S2-OUT12:** `src/domain/snapshots/GalleryRoomSnapshot.ts` → `GalleryRoomSnapshot` — DTO persistible de salón.
- **S2-OUT13:** `src/domain/snapshots/GallerySnapshot.ts` → `GallerySnapshot` — Raíz persistible versionada.
- **S2-OUT14:** `src/domain/entities/GalleryPicture.ts` → `CreateGalleryPictureInput; UpdateGalleryPictureInput; GalleryPicture` — Entidad de cuadro, actualización y snapshot.
- **S2-OUT15:** `src/domain/entities/GalleryRoom.ts` → `CreateGalleryRoomInput; UpdateGalleryRoomConfigurationInput; GalleryRoom` — Entidad de salón y administración de cuadros.
- **S2-OUT16:** `src/domain/entities/Gallery.ts` → `CreateGalleryInput; Gallery` — Aggregate root, salones, revisión y timestamps.
- **S2-OUT17:** `src/domain/services/GalleryAssetReferenceCollector.ts` → `CollectedAssetReferences; GalleryAssetReferenceCollector` — Recolectar refs y conteos de activos de forma determinista.
- **S2-OUT18:** `src/domain/services/SpectatorReadinessPolicy.ts` → `StructuralReadinessIssueCode; StructuralReadinessIssue; SpectatorReadinessPolicy` — Validar preparación estructural sin I/O.
- **S2-OUT19:** `tests/unit/domain/Gallery.test.ts` → `domain tests` — Aggregate, revisión, ids y nombres.
- **S2-OUT20:** `tests/unit/domain/GalleryRoom.test.ts` → `domain tests` — Cuadros, orden, reset y snapshots.
- **S2-OUT21:** `tests/unit/domain/SpectatorReadinessPolicy.test.ts` → `policy tests` — 0/1/2/3 cuadros y objeto requerido.
- **S2-OUT22:** `workspace` → `S2 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S2-OUT23:** `.plans/tasks/T3DG-001/plan.md` → `V2, V4 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S1`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S2-IN1`, `S2-IN2`, `S2-IN3`, `S2-IN4` | `S2-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/domain/constants/GalleryDefaults.ts` `GALLERY_SCHEMA_VERSION; DEFAULT_GALLERY_NAME; DEFAULT_WALL_COLOR; DEFAULT_LIGHT_COLOR; DEFAULT_AMBIENT_INTENSITY; DEFAULT_SPOTLIGHT_INTENSITY; DEFAULT_SOUND_VOLUME; DEFAULT_OBJECT_SCALE; MIN_PICTURES_PER_ROOM` para Valores iniciales e invariantes compartidos del dominio. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S2-IN1`, `S2-IN2` | `S2-OUT1` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/domain/errors/DomainError.ts` `DomainErrorCode; DomainError` para Error tipado para valores, snapshots y búsquedas inválidas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S2-IN1`, `S2-IN2`, `S2-OUT1` | `S2-OUT2` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/domain/value-objects/EntityIds.ts` `GalleryId; RoomId; PictureId; AssetId; asGalleryId(); asRoomId(); asPictureId(); asAssetId(); isUuid()` para Ids opacos validados. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S2-IN1`, `S2-IN2`, `S2-OUT2` | `S2-OUT3` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/domain/value-objects/HexColor.ts` `HexColor; createHexColor(); isHexColor()` para Color canónico #RRGGBB. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S2-IN1`, `S2-IN2`, `S2-OUT3` | `S2-OUT4` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/domain/value-objects/TextFields.ts` `normalizeRequiredName(); normalizeDescription(); normalizeLinkLabel(); slugifyFileName()` para Normalización de texto y nombres de exportación. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S2-IN1`, `S2-IN2`, `S2-OUT4` | `S2-OUT5` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/domain/value-objects/ImageSize.ts` `ImageSize; createImageSize(); imageAspectRatio()` para Dimensiones intrínsecas validadas. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S2-IN1`, `S2-IN2`, `S2-OUT5` | `S2-OUT6` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-7` | Implementar en `src/domain/value-objects/ExternalLink.ts` `ExternalLink; createExternalLink()` para Enlaces http/https sin credenciales. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-6` | `S2-IN1`, `S2-IN2`, `S2-OUT6` | `S2-OUT7` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-8` | Implementar en `src/domain/value-objects/AssetRef.ts` `AssetKind; LocalAssetRef; RemoteAssetRef; AssetRef; createLocalAssetRef(); createRemoteAssetRef(); isLocalAssetRef()` para Referencia serializable a binario local o URL. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-7` | `S2-IN1`, `S2-IN2`, `S2-OUT7` | `S2-OUT8` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-9` | Implementar en `src/domain/value-objects/ObjectScale.ts` `ObjectScale; createObjectScale()` para Escala cerrada 0..10. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-8` | `S2-IN1`, `S2-IN2`, `S2-OUT8` | `S2-OUT9` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-10` | Implementar en `src/domain/value-objects/RoomEnvironment.ts` `WallSurface; RoomLighting; RoomSound; CentralExhibit; RoomEnvironment; createWallColorSurface(); createWallTextureSurface(); createRoomLighting(); createRoomSound(); createCentralExhibit(); createDefaultRoomEnvironment()` para Ambiente completo e inmutable del salón. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-9` | `S2-IN1`, `S2-IN2`, `S2-OUT9` | `S2-OUT10` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-11` | Implementar en `src/domain/snapshots/GalleryPictureSnapshot.ts` `GalleryPictureSnapshot` para DTO persistible de cuadro. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-10` | `S2-IN1`, `S2-IN2`, `S2-OUT10` | `S2-OUT11` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-12` | Implementar en `src/domain/snapshots/GalleryRoomSnapshot.ts` `GalleryRoomSnapshot` para DTO persistible de salón. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-11` | `S2-IN1`, `S2-IN2`, `S2-OUT11` | `S2-OUT12` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-13` | Implementar en `src/domain/snapshots/GallerySnapshot.ts` `GallerySnapshot` para Raíz persistible versionada. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-12` | `S2-IN1`, `S2-IN2`, `S2-OUT12` | `S2-OUT13` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-14` | Implementar en `src/domain/entities/GalleryPicture.ts` `CreateGalleryPictureInput; UpdateGalleryPictureInput; GalleryPicture` para Entidad de cuadro, actualización y snapshot. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-13` | `S2-IN1`, `S2-IN2`, `S2-OUT13` | `S2-OUT14` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-15` | Implementar en `src/domain/entities/GalleryRoom.ts` `CreateGalleryRoomInput; UpdateGalleryRoomConfigurationInput; GalleryRoom` para Entidad de salón y administración de cuadros. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-14` | `S2-IN1`, `S2-IN2`, `S2-OUT14` | `S2-OUT15` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-16` | Implementar en `src/domain/entities/Gallery.ts` `CreateGalleryInput; Gallery` para Aggregate root, salones, revisión y timestamps. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-15` | `S2-IN1`, `S2-IN2`, `S2-OUT15` | `S2-OUT16` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-17` | Implementar en `src/domain/services/GalleryAssetReferenceCollector.ts` `CollectedAssetReferences; GalleryAssetReferenceCollector` para Recolectar refs y conteos de activos de forma determinista. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-16` | `S2-IN1`, `S2-IN2`, `S2-OUT16` | `S2-OUT17` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-18` | Implementar en `src/domain/services/SpectatorReadinessPolicy.ts` `StructuralReadinessIssueCode; StructuralReadinessIssue; SpectatorReadinessPolicy` para Validar preparación estructural sin I/O. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-17` | `S2-IN1`, `S2-IN2`, `S2-OUT17` | `S2-OUT18` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-19` | Implementar en `tests/unit/domain/Gallery.test.ts` los casos `domain tests` para aggregate, revisión, ids y nombres. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-18` | `S2-IN1`, `S2-IN2`, `S2-OUT18` | `S2-OUT19` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-20` | Implementar en `tests/unit/domain/GalleryRoom.test.ts` los casos `domain tests` para cuadros, orden, reset y snapshots. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-19` | `S2-IN1`, `S2-IN2`, `S2-OUT19` | `S2-OUT20` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `ADD-21` | Implementar en `tests/unit/domain/SpectatorReadinessPolicy.test.ts` los casos `policy tests` para 0/1/2/3 cuadros y objeto requerido. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-20` | `S2-IN1`, `S2-IN2`, `S2-OUT20` | `S2-OUT21` | Materializa una responsabilidad única de S2; FR20, FR21, NFRE1, NFRE2, NFRE3, NFRE13. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-21` | `S2-OUT1`, `S2-OUT2`, `S2-OUT3`, `S2-OUT4`, `S2-OUT5`, `S2-OUT6`, `S2-OUT7`, `S2-OUT8`, `S2-OUT9`, `S2-OUT10`, `S2-OUT11`, `S2-OUT12`, `S2-OUT13`, `S2-OUT14`, `S2-OUT15`, `S2-OUT16`, `S2-OUT17`, `S2-OUT18`, `S2-OUT19`, `S2-OUT20`, `S2-OUT21` | `S2-OUT22` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/domain` y `npm run typecheck`; todos los casos de SP9 §6 deben pasar y ningún archivo de dominio puede importar API de navegador/Three. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S2-OUT22` | `S2-OUT23` | Demuestra V2, V4 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S2` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S2-OUT23`, `S2-OUT0` | `S2-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
