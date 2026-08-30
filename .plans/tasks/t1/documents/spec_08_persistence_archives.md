# SP4 — Complete File Tree and Symbol Ownership

## 1. Normative Rules

1. Every implementation file appears in this document before it is created.
2. A file may add private helpers, but it may not add another public responsibility without updating this specification and Execution History.
3. The `Step` column declares the first step that creates the file. Later steps may modify it only when their step specification lists it as an input.
4. Test fixtures contain no executable symbols but are still named because acceptance must not depend on unstated assets.
5. Tests are created in the same step as the behavior they validate; S15 retains cross-feature E2E, audit, documentation and release acceptance.
6. Paths are relative to project root.

## 2. Tree

```text
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── public
│   └── favicon.svg
├── src
│   ├── main.ts
│   ├── presentation
│   │   ├── styles
│   │   │   ├── reset.css
│   │   │   ├── tokens.css
│   │   │   ├── app.css
│   │   │   ├── common.css
│   │   │   ├── modals.css
│   │   │   ├── start.css
│   │   │   ├── editor.css
│   │   │   ├── picture-grid.css
│   │   │   ├── room-config.css
│   │   │   └── spectator.css
│   │   ├── core
│   │   │   ├── DisposableBag.ts
│   │   │   ├── Component.ts
│   │   │   ├── DomFactory.ts
│   │   │   └── TypedEvent.ts
│   │   ├── app
│   │   │   ├── AppRoute.ts
│   │   │   ├── HashRouter.ts
│   │   │   └── AppShell.ts
│   │   ├── state
│   │   │   ├── EditorState.ts
│   │   │   └── EditorStore.ts
│   │   ├── services
│   │   │   ├── ModalService.ts
│   │   │   └── ToastService.ts
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── UiText.ts
│   │   │   │   ├── icons.ts
│   │   │   │   ├── IconButton.ts
│   │   │   │   ├── ModalFrame.ts
│   │   │   │   ├── ConfirmDialog.ts
│   │   │   │   ├── ToastRegion.ts
│   │   │   │   ├── LoadingOverlay.ts
│   │   │   │   ├── AssetSourceField.ts
│   │   │   │   ├── FormFields.ts
│   │   │   │   └── StorageQuotaNotice.ts
│   │   │   ├── start
│   │   │   │   ├── AnimatedGalleryTitle.ts
│   │   │   │   └── ReadinessDialog.ts
│   │   │   ├── editor
│   │   │   │   ├── ResponsiveEditorGuard.ts
│   │   │   │   ├── GalleryTitleEditor.ts
│   │   │   │   ├── RoomListItem.ts
│   │   │   │   ├── RoomList.ts
│   │   │   │   ├── RoomSidebar.ts
│   │   │   │   ├── EditorToolbar.ts
│   │   │   │   ├── EmptyRoomState.ts
│   │   │   │   ├── ImagePreview.ts
│   │   │   │   ├── PictureCard.ts
│   │   │   │   ├── PictureGrid.ts
│   │   │   │   ├── PictureEditorModal.ts
│   │   │   │   ├── WallSurfaceField.ts
│   │   │   │   ├── LightingFields.ts
│   │   │   │   ├── RoomAssetFields.ts
│   │   │   │   ├── RoomConfigModal.ts
│   │   │   │   └── RoomFileActions.ts
│   │   │   └── spectator
│   │   │       ├── PictureInfoHud.ts
│   │   │       ├── SpectatorControlsHint.ts
│   │   │       └── SpectatorStatusOverlay.ts
│   │   ├── screens
│   │   │   ├── start
│   │   │   │   └── StartScreen.ts
│   │   │   ├── editor
│   │   │   │   └── EditorScreen.ts
│   │   │   └── spectator
│   │   │       └── SpectatorScreen.ts
│   │   └── three
│   │       ├── constants
│   │       │   └── SceneConstants.ts
│   │       ├── layout
│   │       │   ├── GeometryPlanningError.ts
│   │       │   ├── GeometryTypes.ts
│   │       │   ├── PolygonMath.ts
│   │       │   ├── PointInPolygon.ts
│   │       │   ├── PictureLayoutPlanner.ts
│   │       │   ├── RoomLayoutPlanner.ts
│   │       │   └── GalleryLayoutPlanner.ts
│   │       ├── collision
│   │       │   ├── CollisionPrimitives.ts
│   │       │   └── CollisionWorld.ts
│   │       ├── runtime
│   │       │   ├── ThreeRuntimeTypes.ts
│   │       │   ├── SceneDisposer.ts
│   │       │   ├── GallerySceneBuilder.ts
│   │       │   ├── ThreeGalleryRuntime.ts
│   │       │   ├── ThreeResourceTracker.ts
│   │       │   ├── RuntimePerformanceMonitor.ts
│   │       │   ├── WebGlContextGuard.ts
│   │       │   └── RuntimeDiagnostics.ts
│   │       ├── assets
│   │       │   ├── TextureDecodeService.ts
│   │       │   ├── TextureFactory.ts
│   │       │   └── ThreeAssetLoader.ts
│   │       ├── builders
│   │       │   ├── CorridorBuilder.ts
│   │       │   ├── DoorFrameBuilder.ts
│   │       │   ├── DoorLabelBuilder.ts
│   │       │   ├── PictureFrameBuilder.ts
│   │       │   ├── RoomShellBuilder.ts
│   │       │   ├── PedestalBuilder.ts
│   │       │   ├── ObjExhibitBuilder.ts
│   │       │   └── AvatarBuilder.ts
│   │       ├── systems
│   │       │   ├── TrailEffectSystem.ts
│   │       │   ├── ExhibitRotationSystem.ts
│   │       │   ├── AvatarAnimationSystem.ts
│   │       │   ├── RoomActivationSystem.ts
│   │       │   ├── RoomEnvironmentSystem.ts
│   │       │   ├── RoomAudioSystem.ts
│   │       │   └── PictureFocusSystem.ts
│   │       └── controls
│   │           ├── InputController.ts
│   │           ├── ThirdPersonController.ts
│   │           └── ThirdPersonCamera.ts
│   ├── bootstrap
│   │   ├── bootstrapApplication.ts
│   │   ├── ApplicationContainer.ts
│   │   └── createApplicationContainer.ts
│   ├── domain
│   │   ├── constants
│   │   │   └── GalleryDefaults.ts
│   │   ├── errors
│   │   │   └── DomainError.ts
│   │   ├── value-objects
│   │   │   ├── EntityIds.ts
│   │   │   ├── HexColor.ts
│   │   │   ├── TextFields.ts
│   │   │   ├── ImageSize.ts
│   │   │   ├── ExternalLink.ts
│   │   │   ├── AssetRef.ts
│   │   │   ├── ObjectScale.ts
│   │   │   └── RoomEnvironment.ts
│   │   ├── snapshots
│   │   │   ├── GalleryPictureSnapshot.ts
│   │   │   ├── GalleryRoomSnapshot.ts
│   │   │   └── GallerySnapshot.ts
│   │   ├── entities
│   │   │   ├── GalleryPicture.ts
│   │   │   ├── GalleryRoom.ts
│   │   │   └── Gallery.ts
│   │   └── services
│   │       ├── GalleryAssetReferenceCollector.ts
│   │       └── SpectatorReadinessPolicy.ts
│   ├── application
│   │   ├── errors
│   │   │   └── ApplicationError.ts
│   │   ├── dto
│   │   │   ├── AssetCommands.ts
│   │   │   ├── GalleryCommands.ts
│   │   │   ├── PictureCommands.ts
│   │   │   ├── RoomCommands.ts
│   │   │   ├── ExportArtifact.ts
│   │   │   └── SpectatorReadinessReport.ts
│   │   ├── ports
│   │   │   ├── GalleryStore.ts
│   │   │   ├── GalleryArchivePort.ts
│   │   │   ├── IdGenerator.ts
│   │   │   ├── Clock.ts
│   │   │   ├── ImageMetadataReader.ts
│   │   │   ├── StorageQuotaPort.ts
│   │   │   ├── AssetUrlResolver.ts
│   │   │   └── FileDownloadPort.ts
│   │   ├── services
│   │   │   ├── AssetPolicy.ts
│   │   │   ├── GalleryLoader.ts
│   │   │   ├── GalleryCommitPlanner.ts
│   │   │   └── AssetSourceMaterializer.ts
│   │   └── use-cases
│   │       ├── InitializeGallery.ts
│   │       ├── GetGallery.ts
│   │       ├── RenameGallery.ts
│   │       ├── CreateRoom.ts
│   │       ├── DeleteRoom.ts
│   │       ├── ResetRoom.ts
│   │       ├── UpdateRoomConfiguration.ts
│   │       ├── AddPicture.ts
│   │       ├── UpdatePicture.ts
│   │       ├── DeletePicture.ts
│   │       ├── ImportRoom.ts
│   │       ├── ExportRoom.ts
│   │       ├── ExportGallery.ts
│   │       └── CheckSpectatorReadiness.ts
│   └── infrastructure
│       ├── browser
│       │   ├── CryptoIdGenerator.ts
│       │   ├── SystemClock.ts
│       │   ├── BrowserImageMetadataReader.ts
│       │   ├── BrowserStorageQuota.ts
│       │   ├── BrowserDownloadService.ts
│       │   ├── ObjectUrlRegistry.ts
│       │   └── BrowserAssetUrlResolver.ts
│       ├── persistence
│       │   └── indexeddb
│       │       ├── IndexedDbConstants.ts
│       │       ├── IndexedDbRecords.ts
│       │       ├── IndexedDbV1Migration.ts
│       │       ├── IndexedDbConnection.ts
│       │       └── IndexedDbGalleryStore.ts
│       └── archive
│           ├── ArchiveManifest.ts
│           ├── ArchiveValidator.ts
│           ├── Sha256ChecksumService.ts
│           └── FflateGalleryArchive.ts
├── tests
│   ├── setup
│   │   └── reset-browser-mocks.ts
│   ├── unit
│   │   ├── domain
│   │   │   ├── Gallery.test.ts
│   │   │   ├── GalleryRoom.test.ts
│   │   │   └── SpectatorReadinessPolicy.test.ts
│   │   ├── application
│   │   │   ├── GalleryCommitPlanner.test.ts
│   │   │   ├── ImportRoom.test.ts
│   │   │   └── UseCases.test.ts
│   │   └── presentation
│   │       ├── core
│   │       │   └── DisposableBag.test.ts
│   │       ├── components
│   │       │   ├── ConfirmDialog.test.ts
│   │       │   ├── StartScreen.test.ts
│   │       │   ├── GalleryTitleEditor.test.ts
│   │       │   ├── PictureEditorModal.test.ts
│   │       │   └── RoomConfigModal.test.ts
│   │       ├── state
│   │       │   └── EditorStore.test.ts
│   │       └── three
│   │           ├── PictureLayoutPlanner.test.ts
│   │           ├── RoomLayoutPlanner.test.ts
│   │           ├── GalleryLayoutPlanner.test.ts
│   │           ├── GallerySceneBuilder.test.ts
│   │           ├── ObjExhibitBuilder.test.ts
│   │           ├── CollisionWorld.test.ts
│   │           ├── ThirdPersonCamera.test.ts
│   │           ├── PictureFocusSystem.test.ts
│   │           ├── RoomActivationSystem.test.ts
│   │           ├── RoomAudioSystem.test.ts
│   │           ├── ThreeResourceTracker.test.ts
│   │           └── RuntimePerformanceMonitor.test.ts
│   ├── support
│   │   ├── InMemoryGalleryStore.ts
│   │   ├── FakeClock.ts
│   │   ├── FixedIdGenerator.ts
│   │   └── FakeArchivePort.ts
│   ├── integration
│   │   └── infrastructure
│   │       ├── IndexedDbGalleryStore.test.ts
│   │       ├── FflateGalleryArchive.test.ts
│   │       ├── ObjectUrlRegistry.test.ts
│   │       └── BrowserAdapters.test.ts
│   ├── e2e
│   │   ├── home-editor.spec.ts
│   │   ├── room-archive.spec.ts
│   │   ├── spectator.spec.ts
│   │   ├── lifecycle.spec.ts
│   │   └── performance.spec.ts
│   └── fixtures
│       ├── picture-landscape.png
│       ├── picture-portrait.png
│       ├── picture-square.png
│       ├── exhibit.obj
│       └── ambient.ogg
├── scripts
│   └── audit-layer-imports.mjs
├── README.md
└── docs
    ├── architecture.md
    ├── data-format.md
    ├── controls.md
    └── acceptance.md
```

## 3. File-to-Symbol Matrix

| Step | File | Required public symbols/content | Sole responsibility |
| --- | --- | --- | --- |
| `S1` | `.gitignore` | `—` | Ignorar node_modules, dist, reports, Playwright artifacts y archivos temporales. |
| `S1` | `index.html` | `#app` | Documento HTML mínimo, meta viewport y host único de la SPA. |
| `S1` | `package.json` | `scripts, dependencies, devDependencies, engines` | Baseline reproducible y comandos normativos. |
| `S1` | `package-lock.json` | `lockfile npm` | Resolución exacta de dependencias. |
| `S1` | `tsconfig.json` | `compilerOptions` | Contrato de TypeScript estricto. |
| `S1` | `vite.config.ts` | `default export defineConfig` | Alias por capas, base relativa y chunks de build. |
| `S1` | `vitest.config.ts` | `default export defineConfig` | Descubrimiento y entorno de tests unitarios. |
| `S1` | `playwright.config.ts` | `default export defineConfig` | Servidor preview, navegador y políticas E2E. |
| `S1` | `public/favicon.svg` | `SVG asset` | Icono estático sin dependencia externa. |
| `S1` | `src/main.ts` | `main()` | Importar estilos y delegar exclusivamente a bootstrapApplication. |
| `S1` | `src/presentation/styles/reset.css` | `global reset` | Normalización mínima de box sizing, body, button e input. |
| `S1` | `src/presentation/styles/tokens.css` | `:root tokens` | Tipografía, superficies, espacios, radios, z-index y motion tokens. |
| `S1` | `src/presentation/styles/app.css` | `#app, .visually-hidden` | Reglas globales de host y utilidades accesibles. |
| `S1` | `tests/setup/reset-browser-mocks.ts` | `resetBrowserMocks()` | Restaurar APIs y mocks de navegador después de cada test. |
| `S1` | `src/bootstrap/bootstrapApplication.ts` | `BootstrapHandle; bootstrapApplication()` | Bootstrap mínimo compilable; S5 implementa composición real y pasos posteriores registran pantallas. |
| `S2` | `src/domain/constants/GalleryDefaults.ts` | `GALLERY_SCHEMA_VERSION; DEFAULT_GALLERY_NAME; DEFAULT_WALL_COLOR; DEFAULT_LIGHT_COLOR; DEFAULT_AMBIENT_INTENSITY; DEFAULT_SPOTLIGHT_INTENSITY; DEFAULT_SOUND_VOLUME; DEFAULT_OBJECT_SCALE; MIN_PICTURES_PER_ROOM` | Valores iniciales e invariantes compartidos del dominio. |
| `S2` | `src/domain/errors/DomainError.ts` | `DomainErrorCode; DomainError` | Error tipado para valores, snapshots y búsquedas inválidas. |
| `S2` | `src/domain/value-objects/EntityIds.ts` | `GalleryId; RoomId; PictureId; AssetId; asGalleryId(); asRoomId(); asPictureId(); asAssetId(); isUuid()` | Ids opacos validados. |
| `S2` | `src/domain/value-objects/HexColor.ts` | `HexColor; createHexColor(); isHexColor()` | Color canónico #RRGGBB. |
| `S2` | `src/domain/value-objects/TextFields.ts` | `normalizeRequiredName(); normalizeDescription(); normalizeLinkLabel(); slugifyFileName()` | Normalización de texto y nombres de exportación. |
| `S2` | `src/domain/value-objects/ImageSize.ts` | `ImageSize; createImageSize(); imageAspectRatio()` | Dimensiones intrínsecas validadas. |
| `S2` | `src/domain/value-objects/ExternalLink.ts` | `ExternalLink; createExternalLink()` | Enlaces http/https sin credenciales. |
| `S2` | `src/domain/value-objects/AssetRef.ts` | `AssetKind; LocalAssetRef; RemoteAssetRef; AssetRef; createLocalAssetRef(); createRemoteAssetRef(); isLocalAssetRef()` | Referencia serializable a binario local o URL. |
| `S2` | `src/domain/value-objects/ObjectScale.ts` | `ObjectScale; createObjectScale()` | Escala cerrada 0..10. |
| `S2` | `src/domain/value-objects/RoomEnvironment.ts` | `WallSurface; RoomLighting; RoomSound; CentralExhibit; RoomEnvironment; createWallColorSurface(); createWallTextureSurface(); createRoomLighting(); createRoomSound(); createCentralExhibit(); createDefaultRoomEnvironment()` | Ambiente completo e inmutable del salón. |
| `S2` | `src/domain/snapshots/GalleryPictureSnapshot.ts` | `GalleryPictureSnapshot` | DTO persistible de cuadro. |
| `S2` | `src/domain/snapshots/GalleryRoomSnapshot.ts` | `GalleryRoomSnapshot` | DTO persistible de salón. |
| `S2` | `src/domain/snapshots/GallerySnapshot.ts` | `GallerySnapshot` | Raíz persistible versionada. |
| `S2` | `src/domain/entities/GalleryPicture.ts` | `CreateGalleryPictureInput; UpdateGalleryPictureInput; GalleryPicture` | Entidad de cuadro, actualización y snapshot. |
| `S2` | `src/domain/entities/GalleryRoom.ts` | `CreateGalleryRoomInput; UpdateGalleryRoomConfigurationInput; GalleryRoom` | Entidad de salón y administración de cuadros. |
| `S2` | `src/domain/entities/Gallery.ts` | `CreateGalleryInput; Gallery` | Aggregate root, salones, revisión y timestamps. |
| `S2` | `src/domain/services/GalleryAssetReferenceCollector.ts` | `CollectedAssetReferences; GalleryAssetReferenceCollector` | Recolectar refs y conteos de activos de forma determinista. |
| `S2` | `src/domain/services/SpectatorReadinessPolicy.ts` | `StructuralReadinessIssueCode; StructuralReadinessIssue; SpectatorReadinessPolicy` | Validar preparación estructural sin I/O. |
| `S2` | `tests/unit/domain/Gallery.test.ts` | `domain tests` | Aggregate, revisión, ids y nombres. |
| `S2` | `tests/unit/domain/GalleryRoom.test.ts` | `domain tests` | Cuadros, orden, reset y snapshots. |
| `S2` | `tests/unit/domain/SpectatorReadinessPolicy.test.ts` | `policy tests` | 0/1/2/3 cuadros y objeto requerido. |
| `S3` | `src/application/errors/ApplicationError.ts` | `ApplicationErrorCode; ApplicationError` | Error seguro para casos de uso y adaptadores. |
| `S3` | `src/application/dto/AssetCommands.ts` | `BinaryAssetDraft; AssetSourceInput; AssetChangeInput; AssetWrite` | Inputs binarios y operaciones keep/remove/replace. |
| `S3` | `src/application/dto/GalleryCommands.ts` | `RenameGalleryCommand; CreateRoomCommand` | Comandos de galería. |
| `S3` | `src/application/dto/PictureCommands.ts` | `AddPictureCommand; UpdatePictureCommand; DeletePictureCommand` | Comandos de cuadros. |
| `S3` | `src/application/dto/RoomCommands.ts` | `WallSurfaceCommand; UpdateRoomConfigurationCommand; RoomIdCommand; ImportRoomCommand` | Comandos de salón e importación. |
| `S3` | `src/application/dto/ExportArtifact.ts` | `ExportArtifact` | Archivo descargable producido por casos de uso. |
| `S3` | `src/application/dto/SpectatorReadinessReport.ts` | `SpectatorReadinessIssueCode; SpectatorReadinessIssue; SpectatorReadinessReport` | Diagnóstico completo de preparación. |
| `S3` | `src/application/ports/GalleryStore.ts` | `GalleryCommit; GalleryStore` | Persistencia transaccional de snapshot y activos. |
| `S3` | `src/application/ports/GalleryArchivePort.ts` | `ArchiveAsset; ImportedRoomPackage; GalleryArchivePort` | Crear/leer archivos versionados. |
| `S3` | `src/application/ports/IdGenerator.ts` | `IdGenerator` | Generar ids por tipo. |
| `S3` | `src/application/ports/Clock.ts` | `Clock` | Tiempo ISO y timestamp de archivo. |
| `S3` | `src/application/ports/ImageMetadataReader.ts` | `ImageMetadataReader` | Obtener dimensiones de fuentes locales/remotas. |
| `S3` | `src/application/ports/StorageQuotaPort.ts` | `StorageEstimate; StorageQuotaPort` | Consultar uso/cuota del origen. |
| `S3` | `src/application/ports/AssetUrlResolver.ts` | `AssetUrlResolver` | Resolver AssetRef a URL temporal por scope. |
| `S3` | `src/application/ports/FileDownloadPort.ts` | `FileDownloadPort` | Entregar Blob al navegador como descarga. |
| `S3` | `src/application/services/AssetPolicy.ts` | `ValidatedAssetDraft; AssetPolicy` | Extensiones, MIME, tamaños y protocolos permitidos. |
| `S3` | `src/application/services/GalleryLoader.ts` | `GalleryLoader` | Cargar aggregate requerido y mapear errores. |
| `S3` | `src/application/services/GalleryCommitPlanner.ts` | `GalleryCommitPlanner` | Comparar refs before/after y producir commit atómico. |
| `S3` | `src/application/services/AssetSourceMaterializer.ts` | `MaterializedAsset; AssetSourceMaterializer` | Convertir fuente local/remota en ref y write opcional. |
| `S3` | `src/application/use-cases/InitializeGallery.ts` | `InitializeGallery` | Cargar o crear galería inicial. |
| `S3` | `src/application/use-cases/GetGallery.ts` | `GetGallery` | Leer snapshot vigente. |
| `S3` | `src/application/use-cases/RenameGallery.ts` | `RenameGallery` | Renombrar y persistir. |
| `S3` | `src/application/use-cases/CreateRoom.ts` | `CreateRoom` | Crear salón por nombre preferido/secuencial. |
| `S3` | `src/application/use-cases/DeleteRoom.ts` | `DeleteRoom` | Eliminar salón y activos huérfanos. |
| `S3` | `src/application/use-cases/ResetRoom.ts` | `ResetRoom` | Restaurar ambiente conservando título/cuadros. |
| `S3` | `src/application/use-cases/UpdateRoomConfiguration.ts` | `UpdateRoomConfiguration` | Aplicar configuración y reemplazos de activos. |
| `S3` | `src/application/use-cases/AddPicture.ts` | `AddPicture` | Crear cuadro con metadata intrínseca. |
| `S3` | `src/application/use-cases/UpdatePicture.ts` | `UpdatePicture` | Editar cuadro y fuente opcional. |
| `S3` | `src/application/use-cases/DeletePicture.ts` | `DeletePicture` | Eliminar cuadro y activo huérfano. |
| `S3` | `src/application/use-cases/ImportRoom.ts` | `ImportRoom` | Validar, remapear y persistir .t3room. |
| `S3` | `src/application/use-cases/ExportRoom.ts` | `ExportRoom` | Crear .t3room sin mutación. |
| `S3` | `src/application/use-cases/ExportGallery.ts` | `ExportGallery` | Crear .t3gallery sin mutación. |
| `S3` | `src/application/use-cases/CheckSpectatorReadiness.ts` | `CheckSpectatorReadiness` | Combinar estructura y existencia de activos. |
| `S3` | `tests/support/InMemoryGalleryStore.ts` | `InMemoryGalleryStore` | Double transaccional para use cases. |
| `S3` | `tests/support/FakeClock.ts` | `FakeClock` | Timestamps deterministas. |
| `S3` | `tests/support/FixedIdGenerator.ts` | `FixedIdGenerator` | Secuencias de ids predecibles. |
| `S3` | `tests/support/FakeArchivePort.ts` | `FakeArchivePort` | Double de import/export. |
| `S3` | `tests/unit/application/GalleryCommitPlanner.test.ts` | `application tests` | Puts, deletes y refs compartidas. |
| `S3` | `tests/unit/application/ImportRoom.test.ts` | `application tests` | Remapeo ids, nombres y assets. |
| `S3` | `tests/unit/application/UseCases.test.ts` | `application use-case tests` | Éxito, validación, dependencia fallida y ausencia de estado parcial para los casos de uso restantes. |
| `S4` | `src/infrastructure/browser/CryptoIdGenerator.ts` | `CryptoIdGenerator` | Implementar IdGenerator con crypto.randomUUID. |
| `S4` | `src/infrastructure/browser/SystemClock.ts` | `SystemClock` | Implementar Clock con Date. |
| `S4` | `src/infrastructure/browser/BrowserImageMetadataReader.ts` | `BrowserImageMetadataReader` | Decodificar dimensiones local/remota y liberar recursos. |
| `S4` | `src/infrastructure/browser/BrowserStorageQuota.ts` | `BrowserStorageQuota` | Adaptar navigator.storage.estimate. |
| `S4` | `src/infrastructure/browser/BrowserDownloadService.ts` | `BrowserDownloadService` | Implementar FileDownloadPort con anchor temporal. |
| `S4` | `src/infrastructure/browser/ObjectUrlRegistry.ts` | `ObjectUrlScope; ObjectUrlRegistry` | Refcount y revocación de blob URLs por scope. |
| `S4` | `src/infrastructure/browser/BrowserAssetUrlResolver.ts` | `BrowserAssetUrlResolver` | Resolver refs remotas/locales mediante store y registry. |
| `S4` | `src/infrastructure/persistence/indexeddb/IndexedDbConstants.ts` | `DB_NAME; DB_VERSION; STORE_META; STORE_GALLERIES; STORE_ASSETS; CURRENT_GALLERY_KEY` | Nombres y versión del schema. |
| `S4` | `src/infrastructure/persistence/indexeddb/IndexedDbRecords.ts` | `GalleryRecord; AssetRecord; MetaRecord` | Registros plain serializables. |
| `S4` | `src/infrastructure/persistence/indexeddb/IndexedDbV1Migration.ts` | `upgradeToV1()` | Crear object stores e índices v1. |
| `S4` | `src/infrastructure/persistence/indexeddb/IndexedDbConnection.ts` | `IndexedDbConnection` | Abrir, cachear, cerrar y manejar versionchange. |
| `S4` | `src/infrastructure/persistence/indexeddb/IndexedDbGalleryStore.ts` | `IndexedDbGalleryStore` | Implementar GalleryStore y transacción atómica. |
| `S4` | `src/infrastructure/archive/ArchiveManifest.ts` | `ArchiveKind; ArchiveManifest; ArchiveAssetManifestEntry; ARCHIVE_FORMAT_VERSION` | Contrato JSON del contenedor ZIP. |
| `S4` | `src/infrastructure/archive/ArchiveValidator.ts` | `ArchiveValidator` | Validar rutas, JSON, versiones, tamaños y refs. |
| `S4` | `src/infrastructure/archive/Sha256ChecksumService.ts` | `Sha256ChecksumService` | Calcular/verificar SHA-256 Web Crypto. |
| `S4` | `src/infrastructure/archive/FflateGalleryArchive.ts` | `FflateGalleryArchive` | Implementar GalleryArchivePort con ZIP asíncrono. |
| `S4` | `tests/integration/infrastructure/IndexedDbGalleryStore.test.ts` | `IndexedDB integration tests` | Migración, commit atómico, rollback, reads y versionchange. |
| `S4` | `tests/integration/infrastructure/FflateGalleryArchive.test.ts` | `archive integration tests` | Round-trip, manifest, bytes, checksums, rutas y límites. |
| `S4` | `tests/integration/infrastructure/ObjectUrlRegistry.test.ts` | `object URL integration tests` | Scopes, reutilización, refcount y revocación idempotente. |
| `S4` | `tests/integration/infrastructure/BrowserAdapters.test.ts` | `browser adapter tests` | Metadata, cuota, descarga y resolución de referencias. |
| `S5` | `src/presentation/core/DisposableBag.ts` | `Disposable; DisposableBag` | Registrar y ejecutar disposers idempotentes. |
| `S5` | `src/presentation/core/Component.ts` | `MountableComponent; Component` | Ciclo mount/render/dispose con AbortController. |
| `S5` | `src/presentation/core/DomFactory.ts` | `element(); button(); input(); clearElement()` | Helpers DOM tipados sin innerHTML dinámico. |
| `S5` | `src/presentation/core/TypedEvent.ts` | `TypedEventEmitter` | Eventos tipados subscribe/unsubscribe. |
| `S5` | `src/presentation/app/AppRoute.ts` | `AppRoute; parseRoute(); routeToHash()` | Rutas válidas y normalización. |
| `S5` | `src/presentation/app/HashRouter.ts` | `HashRouter` | Navegación hash y popstate/hashchange. |
| `S5` | `src/presentation/app/AppShell.ts` | `SpectatorActivationToken; ScreenFactory; AppShell` | Montar una pantalla y disponer anterior. |
| `S5` | `src/presentation/state/EditorState.ts` | `UiError; EditorState; initialEditorState()` | Estado inmutable del Editor. |
| `S5` | `src/presentation/state/EditorStore.ts` | `EditorStoreEvents; EditorStore` | Cola FIFO, selección y fachada de casos de uso. |
| `S5` | `src/presentation/services/ModalService.ts` | `ModalRequest; ModalService` | Host único de modal y foco restaurado. |
| `S5` | `src/presentation/services/ToastService.ts` | `ToastKind; ToastMessage; ToastService` | Mensajes transitorios accesibles. |
| `S5` | `src/presentation/components/common/UiText.ts` | `UI_TEXT` | Etiquetas españolas centralizadas. |
| `S5` | `src/presentation/components/common/icons.ts` | `IconName; createIcon()` | SVG inline seguro para iconos requeridos. |
| `S5` | `src/presentation/components/common/IconButton.ts` | `IconButtonOptions; createIconButton()` | Botón solo-icono con tooltip/aria-label. |
| `S5` | `src/presentation/components/common/ModalFrame.ts` | `ModalFrameOptions; ModalFrame` | Contenedor modal, backdrop y focus trap. |
| `S5` | `src/presentation/components/common/ConfirmDialog.ts` | `ConfirmDialogOptions; ConfirmDialog` | Diálogo icono+mensaje+SÍ/NO. |
| `S5` | `src/presentation/components/common/ToastRegion.ts` | `ToastRegion` | Render de toasts aria-live. |
| `S5` | `src/presentation/components/common/LoadingOverlay.ts` | `LoadingOverlay` | Bloqueo visual durante operación pendiente. |
| `S5` | `src/presentation/components/common/AssetSourceField.ts` | `AssetSourceFieldValue; AssetSourceField` | Selector archivo/URL reutilizable. |
| `S5` | `src/presentation/components/common/FormFields.ts` | `createTextField(); createTextAreaField(); createColorField(); createNumberField()` | Campos etiquetados, errores y rangos. |
| `S5` | `src/presentation/components/common/StorageQuotaNotice.ts` | `StorageQuotaNotice` | Mostrar advertencia de uso >=80%. |
| `S5` | `src/presentation/styles/common.css` | `common component styles` | Botones, formularios, tooltips y loading. |
| `S5` | `src/presentation/styles/modals.css` | `modal styles` | Backdrop, frame, footer y focus states. |
| `S5` | `src/bootstrap/ApplicationContainer.ts` | `ApplicationUseCases; ApplicationContainer` | Superficie inmutable de dependencias. |
| `S5` | `src/bootstrap/createApplicationContainer.ts` | `createApplicationContainer()` | Instanciar ports, services y use cases. |
| `S5` | `tests/unit/presentation/core/DisposableBag.test.ts` | `presentation core tests` | Disposición LIFO, idempotencia y agregación segura. |
| `S5` | `tests/unit/presentation/components/ConfirmDialog.test.ts` | `component tests` | Focus trap, resolución SÍ/NO/Escape y restauración de foco. |
| `S5` | `tests/unit/presentation/state/EditorStore.test.ts` | `state tests` | Cola FIFO, pending state, refresh durable y errores tipados. |
| `S6` | `src/presentation/components/start/AnimatedGalleryTitle.ts` | `AnimatedGalleryTitle` | Título animado con reduced motion. |
| `S6` | `src/presentation/components/start/ReadinessDialog.ts` | `ReadinessDialog` | Lista accesible de bloqueos por salón. |
| `S6` | `src/presentation/screens/start/StartScreen.ts` | `StartScreenDependencies; StartScreen` | Home fullscreen y activación de modos. |
| `S6` | `src/presentation/styles/start.css` | `start screen styles` | Composición, animación y botones iniciales. |
| `S6` | `tests/unit/presentation/components/StartScreen.test.ts` | `screen tests` | Readiness, botones, navegación y token de activación. |
| `S7` | `src/presentation/components/editor/ResponsiveEditorGuard.ts` | `ResponsiveEditorGuard` | Bloqueo bajo viewport mínimo. |
| `S7` | `src/presentation/components/editor/GalleryTitleEditor.ts` | `GalleryTitleEditor` | Texto/input oculto con Enter/Escape/blur. |
| `S7` | `src/presentation/components/editor/RoomListItem.ts` | `RoomListItem` | Fila seleccionable sin margin/padding externo. |
| `S7` | `src/presentation/components/editor/RoomList.ts` | `RoomList` | Lista y selección de salones. |
| `S7` | `src/presentation/components/editor/RoomSidebar.ts` | `RoomSidebar` | Header, acciones y room list. |
| `S7` | `src/presentation/components/editor/EditorToolbar.ts` | `EditorToolbar` | Acciones de cuadro/config/export alineadas derecha. |
| `S7` | `src/presentation/components/editor/EmptyRoomState.ts` | `EmptyRoomState` | Contenido cuando no hay salón seleccionado. |
| `S7` | `src/presentation/screens/editor/EditorScreen.ts` | `EditorScreenDependencies; EditorScreen` | Layout 15/85, suscripción store y composición. |
| `S7` | `src/presentation/styles/editor.css` | `editor layout styles` | 15dvw/85dvw, 10dvh/90dvh y room rows. |
| `S7` | `tests/unit/presentation/components/GalleryTitleEditor.test.ts` | `component tests` | Modo inline, Enter, blur, Escape y rollback visual. |
| `S8` | `src/presentation/components/editor/ImagePreview.ts` | `ImagePreview` | Resolver URL, cargar imagen contenida y liberar scope. |
| `S8` | `src/presentation/components/editor/PictureCard.ts` | `PictureCard` | Celda cuadrada clickable con imagen nativa. |
| `S8` | `src/presentation/components/editor/PictureGrid.ts` | `PictureGrid` | Grid auto-fit y apertura de modal. |
| `S8` | `src/presentation/components/editor/PictureEditorModal.ts` | `PictureEditorMode; PictureEditorModal` | Alta/edición, metadata, fuente, link y confirmaciones. |
| `S8` | `src/presentation/styles/picture-grid.css` | `picture grid styles` | Celdas 1:1, object-fit contain y estados. |
| `S8` | `tests/unit/presentation/components/PictureEditorModal.test.ts` | `component tests` | Alta/edición, validación, fuente, enlace y confirmación. |
| `S9` | `src/presentation/components/editor/WallSurfaceField.ts` | `WallSurfaceDraft; WallSurfaceField` | Alternar color/textura y fallback. |
| `S9` | `src/presentation/components/editor/LightingFields.ts` | `LightingDraft; LightingFields` | Color e intensidades validadas. |
| `S9` | `src/presentation/components/editor/RoomAssetFields.ts` | `RoomAssetsDraft; RoomAssetFields` | Sonido, volumen, OBJ y escala. |
| `S9` | `src/presentation/components/editor/RoomConfigModal.ts` | `RoomConfigModal` | Configurar/reset/delete/save con confirmación. |
| `S9` | `src/presentation/components/editor/RoomFileActions.ts` | `RoomFileActions` | Importar .t3room y descargar sala/galería. |
| `S9` | `src/presentation/styles/room-config.css` | `room config styles` | Grid de formulario y controles de asset. |
| `S9` | `tests/unit/presentation/components/RoomConfigModal.test.ts` | `component tests` | Configuración, reset/delete/save y semántica keep/remove/replace. |
| `S10` | `src/presentation/three/constants/SceneConstants.ts` | `GEOMETRY_EPSILON; COLLIDER_EPSILON; VISUAL_OVERLAP_EPSILON; SCENE_CONSTANTS` | Todas las medidas, velocidades, thresholds y límites 3D. |
| `S10` | `src/presentation/three/layout/GeometryPlanningError.ts` | `GeometryInvariant; GeometryPlanningError` | Error tipado para invariantes geométricas y contexto seguro. |
| `S10` | `src/presentation/three/layout/GeometryTypes.ts` | `Vec2; Segment2; Aabb2; GallerySide; PictureLayoutPlan; WallLayoutPlan; DoorLayoutPlan; VestibuleLayoutPlan; RoomLayoutPlan; CorridorLayoutPlan; GalleryLayoutPlan` | Planes geométricos puros serializables. |
| `S10` | `src/presentation/three/layout/PolygonMath.ts` | `regularPolygonVertices(); segmentLength(); segmentMidpoint(); outwardNormal(); rotatePoint()` | Operaciones geométricas sin Three.js. |
| `S10` | `src/presentation/three/layout/PointInPolygon.ts` | `pointInPolygon()` | Detección de zona de salón. |
| `S10` | `src/presentation/three/layout/PictureLayoutPlanner.ts` | `PictureLayoutPlanner` | Escalar cuadros sin deformación. |
| `S10` | `src/presentation/three/layout/RoomLayoutPlanner.ts` | `RoomLayoutPlanner` | N paredes, apertura de vértice, frames y colliders. |
| `S10` | `src/presentation/three/layout/GalleryLayoutPlanner.ts` | `GalleryLayoutPlanner` | Alternar salones, espaciar y derivar pasillo. |
| `S10` | `src/presentation/three/collision/CollisionPrimitives.ts` | `CircleBody; StaticCollider; CollisionResolution` | Tipos 2D de colisión compartidos por planner/controller. |
| `S10` | `tests/unit/presentation/three/PictureLayoutPlanner.test.ts` | `geometry tests` | Aspect ratios y límites. |
| `S10` | `tests/unit/presentation/three/RoomLayoutPlanner.test.ts` | `geometry tests` | N paredes, apertura y no degeneración. |
| `S10` | `tests/unit/presentation/three/GalleryLayoutPlanner.test.ts` | `geometry tests` | Alternancia, separación y longitud de pasillo. |
| `S11` | `src/presentation/three/runtime/ThreeRuntimeTypes.ts` | `SceneContext; BuiltRoom; BuiltGalleryWorld; PictureMeshMetadata` | Contexto y resultados de construcción. |
| `S11` | `src/presentation/three/runtime/SceneDisposer.ts` | `disposeObject3D(); disposeMaterial(); disposeTexture()` | Liberación recursiva de recursos Three. |
| `S11` | `src/presentation/three/assets/TextureDecodeService.ts` | `TextureDecodeService` | Decodificar bitmap GPU <=2048px conservando ratio. |
| `S11` | `src/presentation/three/assets/TextureFactory.ts` | `TextureFactory` | Crear texturas de cuadros/paredes y cover UV. |
| `S11` | `src/presentation/three/assets/ThreeAssetLoader.ts` | `ThreeAssetLoader` | Resolver AssetRef y cargar texture/audio/OBJ con errores tipados. |
| `S11` | `src/presentation/three/builders/CorridorBuilder.ts` | `CorridorBuilder` | Piso, techo, paredes y colliders del pasillo. |
| `S11` | `src/presentation/three/builders/DoorFrameBuilder.ts` | `DoorFrameBuilder` | Marco abierto y umbral por plan. |
| `S11` | `src/presentation/three/builders/DoorLabelBuilder.ts` | `DoorLabelBuilder` | CanvasTexture truncada con nombre de salón. |
| `S11` | `src/presentation/three/builders/PictureFrameBuilder.ts` | `PictureFrameBuilder` | Marco, plano, metadata y fallback de cuadro. |
| `S11` | `src/presentation/three/builders/RoomShellBuilder.ts` | `RoomShellBuilder` | Piso, techo, segmentos de pared y superficies. |
| `S11` | `src/presentation/three/builders/PedestalBuilder.ts` | `PedestalBuilder` | Pedestal central y collider. |
| `S11` | `src/presentation/three/builders/ObjExhibitBuilder.ts` | `ObjExhibitBuilder` | Centrar, normalizar, escalar, material fallback y spotlight. |
| `S11` | `src/presentation/three/systems/TrailEffectSystem.ts` | `TrailEffectHandle; TrailEffectSystem` | Tres estelas orbitales con ring buffers. |
| `S11` | `src/presentation/three/systems/ExhibitRotationSystem.ts` | `RotatingExhibit; ExhibitRotationSystem` | Rotación Y de exhibiciones activas. |
| `S11` | `src/presentation/three/runtime/GallerySceneBuilder.ts` | `GallerySceneBuilder` | Materializar GalleryLayoutPlan y snapshots. |
| `S11` | `tests/unit/presentation/three/GallerySceneBuilder.test.ts` | `scene builder tests` | Conteos, transforms, metadata y disposición del mundo. |
| `S11` | `tests/unit/presentation/three/ObjExhibitBuilder.test.ts` | `exhibit builder tests` | Centrado, normalización 1.6m, escala cero y material fallback. |
| `S12` | `src/presentation/three/builders/AvatarBuilder.ts` | `AvatarRig; AvatarBuilder` | Avatar procedural visible y anchors de cámara/ojos. |
| `S12` | `src/presentation/three/controls/InputController.ts` | `InputState; InputController` | Keyboard, mouse delta y pointer lock. |
| `S12` | `src/presentation/three/collision/CollisionWorld.ts` | `CollisionWorld` | Resolver círculo contra segmentos/AABB iterativamente. |
| `S12` | `src/presentation/three/controls/ThirdPersonController.ts` | `ThirdPersonController` | Velocidad, orientación, desplazamiento y colisión. |
| `S12` | `src/presentation/three/controls/ThirdPersonCamera.ts` | `ThirdPersonCamera` | Spring arm, yaw/pitch y obstrucción por raycast. |
| `S12` | `src/presentation/three/systems/AvatarAnimationSystem.ts` | `AvatarAnimationSystem` | Balanceo procedural de marcha/reposo. |
| `S12` | `tests/unit/presentation/three/CollisionWorld.test.ts` | `collision tests` | Círculo-segmento/AABB, sliding, esquina e iteraciones. |
| `S12` | `tests/unit/presentation/three/ThirdPersonCamera.test.ts` | `camera tests` | Spring arm, pitch/yaw, obstrucción y restauración. |
| `S13` | `src/presentation/three/systems/RoomActivationSystem.ts` | `RoomActivationState; RoomActivationSystem` | Detectar zona y activar máximo tres salones. |
| `S13` | `src/presentation/three/systems/RoomEnvironmentSystem.ts` | `RoomEnvironmentSystem` | Interpolar luz ambiental, spotlight y tintes. |
| `S13` | `src/presentation/three/systems/RoomAudioSystem.ts` | `RoomAudioSystem` | AudioListener, carga, loop, crossfade y silencio. |
| `S13` | `src/presentation/three/systems/PictureFocusSystem.ts` | `PictureFocus; PictureFocusSystem` | Filtro distancia/ángulo/raycast a 10Hz. |
| `S13` | `src/presentation/three/runtime/ThreeGalleryRuntime.ts` | `ThreeGalleryRuntimeEvents; ThreeGalleryRuntime` | Loop único, systems, renderer, resize, start/pause/dispose. |
| `S13` | `src/presentation/components/spectator/PictureInfoHud.ts` | `PictureInfoHud` | Nombre, descripción, link y transición. |
| `S13` | `src/presentation/components/spectator/SpectatorControlsHint.ts` | `SpectatorControlsHint` | Ayuda de controles y pointer lock. |
| `S13` | `src/presentation/components/spectator/SpectatorStatusOverlay.ts` | `SpectatorStatusOverlay` | Carga, warnings y error fatal accesible. |
| `S13` | `src/presentation/screens/spectator/SpectatorScreen.ts` | `SpectatorScreenDependencies; SpectatorScreen` | Montar runtime, HUD, events y dispose. |
| `S13` | `src/presentation/styles/spectator.css` | `spectator styles` | Canvas fullscreen, HUD, hints y overlays. |
| `S13` | `tests/unit/presentation/three/PictureFocusSystem.test.ts` | `focus tests` | Distancia, ángulo, raycast, prioridad y frecuencia 10Hz. |
| `S13` | `tests/unit/presentation/three/RoomActivationSystem.test.ts` | `activation tests` | Zonas, transiciones y máximo tres salones costosos. |
| `S13` | `tests/unit/presentation/three/RoomAudioSystem.test.ts` | `audio tests` | Unlock, loop, crossfade, silencio y dispose con audio fake. |
| `S14` | `src/presentation/three/runtime/ThreeResourceTracker.ts` | `ThreeResourceTracker` | Registrar Object3D, textures, audio y disposers por runtime. |
| `S14` | `src/presentation/three/runtime/RuntimePerformanceMonitor.ts` | `FrameMetricsSnapshot; RuntimePerformanceMonitor` | Muestrear frame time, p95 y warnings. |
| `S14` | `src/presentation/three/runtime/WebGlContextGuard.ts` | `WebGlContextGuard` | Detectar soporte, context lost/restored y error fatal. |
| `S14` | `src/presentation/three/runtime/RuntimeDiagnostics.ts` | `RuntimeDiagnosticSeverity; RuntimeDiagnostic; RuntimeDiagnostics` | Canal tipado de fallos no bloqueantes. |
| `S14` | `tests/unit/presentation/three/ThreeResourceTracker.test.ts` | `resource lifecycle tests` | Tracking, dispose único y conteos diagnósticos. |
| `S14` | `tests/unit/presentation/three/RuntimePerformanceMonitor.test.ts` | `performance monitor tests` | Ventana de muestras, p95 y warnings estables. |
| `S15` | `scripts/audit-layer-imports.mjs` | `auditLayerImports()` | Rechazar imports que violen SP2. |
| `S15` | `tests/e2e/home-editor.spec.ts` | `Playwright scenarios` | Inicio, rename, create, modales y persistencia. |
| `S15` | `tests/e2e/room-archive.spec.ts` | `Playwright scenarios` | Export/import round-trip y rechazo corrupto. |
| `S15` | `tests/e2e/spectator.spec.ts` | `Playwright scenarios` | Readiness, movimiento, HUD y link. |
| `S15` | `tests/e2e/lifecycle.spec.ts` | `Playwright scenarios` | Diez mounts y ausencia de recursos duplicados. |
| `S15` | `tests/e2e/performance.spec.ts` | `Playwright benchmark` | Fixture de referencia y p95. |
| `S15` | `tests/fixtures/picture-landscape.png` | `binary fixture` | Imagen horizontal pequeña. |
| `S15` | `tests/fixtures/picture-portrait.png` | `binary fixture` | Imagen vertical pequeña. |
| `S15` | `tests/fixtures/picture-square.png` | `binary fixture` | Imagen cuadrada pequeña. |
| `S15` | `tests/fixtures/exhibit.obj` | `OBJ fixture` | Modelo central mínimo válido. |
| `S15` | `tests/fixtures/ambient.ogg` | `audio fixture` | Audio corto y libre para prueba local. |
| `S15` | `README.md` | `project guide` | Instalación, scripts, alcance y navegación documental. |
| `S15` | `docs/architecture.md` | `architecture guide` | Capas, DI, lifecycle y reglas de imports. |
| `S15` | `docs/data-format.md` | `archive/schema guide` | Snapshots, IndexedDB y formatos de exportación. |
| `S15` | `docs/controls.md` | `user guide` | Editor, teclado/ratón, HUD y límites. |
| `S15` | `docs/acceptance.md` | `acceptance matrix` | FR/NFRE/V trazables a pruebas. |

## 4. File Count by Step

- **S1:** 15 files.
- **S2:** 21 files.
- **S3:** 40 files.
- **S4:** 20 files.
- **S5:** 28 files.
- **S6:** 5 files.
- **S7:** 10 files.
- **S8:** 6 files.
- **S9:** 7 files.
- **S10:** 12 files.
- **S11:** 17 files.
- **S12:** 8 files.
- **S13:** 13 files.
- **S14:** 6 files.
- **S15:** 16 files.


## 5. Public API Restrictions

- Domain and application classes export only the symbols named above.
- Concrete infrastructure classes are instantiated only in `createApplicationContainer.ts`.
- Presentation builders/systems are internal to the presentation layer and are not re-exported from barrel files; no barrel files are planned.
- `main.ts` imports only CSS and `bootstrapApplication`.
- Tests may import concrete infrastructure only in infrastructure integration tests; unit tests target domain/application contracts, components through public behavior, and pure geometry/runtime units.
- Test-only diagnostics are compiled behind `import.meta.env.MODE === 'test'` and are tree-shaken or unreachable in production.
- No `src/index.ts`, generic `utils.ts`, `helpers.ts`, catch-all `services.ts` or global service locator may be added.
