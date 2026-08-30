### S12 — Implementar avatar, entrada, colisiones y cámara

<!-- Mandatory Steep Specification Structure for each Steep on the plan -->

- **Satisfies:** FR30, FR31, FR35, NFRE6
- **Depends:** S10, S11
- **Validation:** V14, V15, V19
- **Outcome:** Tercera persona navegable con avatar visible, colisión estable y cámara sin clipping.

### Inputs

<!-- Mandatory Section when modified some element -->

- **S12-IN1:** `.plans/tasks/T3DG-001/documents/spec_06_spectator_runtime.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S12-IN2:** `.plans/tasks/T3DG-001/documents/spec_07_procedural_geometry.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S12-IN3:** `.plans/tasks/T3DG-001/documents/spec_09_validation_tests.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S12-IN4:** `.plans/tasks/T3DG-001/documents/spec_12_threejs_symbol_contracts.md` → `normative specification` — fuente obligatoria; resolver cualquier contradicción antes de escribir código.
- **S12-IN5:** `src/presentation/three/layout/**, src/presentation/three/runtime/GallerySceneBuilder.ts` → `implemented dependency` — mundo y colliders construidos en S10–S11.

### Outputs:

<!-- Mandatory Sub-section (all steep include inputs and outputs, the outputs of an steep can be the input of other) -->

- **S12-OUT0:** `.plans/tasks/T3DG-001/plan.md` → `Execution History / Progress` — trazabilidad de preflight, validación y cierre del paso.
- **S12-OUT1:** `src/presentation/three/builders/AvatarBuilder.ts` → `AvatarRig; AvatarBuilder` — Avatar procedural visible y anchors de cámara/ojos.
- **S12-OUT2:** `src/presentation/three/controls/InputController.ts` → `InputState; InputController` — Keyboard, mouse delta y pointer lock.
- **S12-OUT3:** `src/presentation/three/collision/CollisionWorld.ts` → `CollisionWorld` — Resolver círculo contra segmentos/AABB iterativamente.
- **S12-OUT4:** `src/presentation/three/controls/ThirdPersonController.ts` → `ThirdPersonController` — Velocidad, orientación, desplazamiento y colisión.
- **S12-OUT5:** `src/presentation/three/controls/ThirdPersonCamera.ts` → `ThirdPersonCamera` — Spring arm, yaw/pitch y obstrucción por raycast.
- **S12-OUT6:** `src/presentation/three/systems/AvatarAnimationSystem.ts` → `AvatarAnimationSystem` — Balanceo procedural de marcha/reposo.
- **S12-OUT7:** `tests/unit/presentation/three/CollisionWorld.test.ts` → `collision tests` — Círculo-segmento/AABB, sliding, esquina e iteraciones.
- **S12-OUT8:** `tests/unit/presentation/three/ThirdPersonCamera.test.ts` → `camera tests` — Spring arm, pitch/yaw, obstrucción y restauración.
- **S12-OUT9:** `workspace` → `S12 integrated increment` — todos los símbolos del paso compilan y quedan conectados únicamente por dependencias permitidas.
- **S12-OUT10:** `.plans/tasks/T3DG-001/plan.md` → `V14, V15, V19 result` — evidencia reproducible del postcondition de este paso.

### Actions

<!-- Mandatory Sub-Section -->

Desglose at attomic level of all required actions, including inpuths procedure outputs and responsible executor.

**Action Types Signatures**: REVIEW `REV`, MODIFICATION `MOD`, ADITION `ADD`, INTEGRATION `INT`, VALIDATION `VAL`, CLEANINNG `CLN`, DOCUMENTATION `DOC`  
**Action State**: COMPLETED `CPT`, PARTIAL `PTL`, BLOCKED `BLK`

| Action | Description | Depends | Inputs | Outputs | Contribution | Agent:Contract |
| --- | --- | --- | --- | --- | --- | --- |
| `REV-1` | Revisar íntegramente los inputs, comprobar que existen los outputs de `S10, S11`, registrar incompatibilidades y detener escritura ante una contradicción no resuelta. | ~ | `S12-IN1`, `S12-IN2`, `S12-IN3`, `S12-IN4`, `S12-IN5` | `S12-OUT0` | Evita implementar sobre contratos implícitos o estado incompleto. | `ORQ`:`~` |
| `ADD-1` | Implementar en `src/presentation/three/builders/AvatarBuilder.ts` `AvatarRig; AvatarBuilder` para Avatar procedural visible y anchors de cámara/ojos. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `REV-1` | `S12-IN1`, `S12-IN2` | `S12-OUT1` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-2` | Implementar en `src/presentation/three/controls/InputController.ts` `InputState; InputController` para Keyboard, mouse delta y pointer lock. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-1` | `S12-IN1`, `S12-IN2`, `S12-OUT1` | `S12-OUT2` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-3` | Implementar en `src/presentation/three/collision/CollisionWorld.ts` `CollisionWorld` para Resolver círculo contra segmentos/AABB iterativamente. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-2` | `S12-IN1`, `S12-IN2`, `S12-OUT2` | `S12-OUT3` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-4` | Implementar en `src/presentation/three/controls/ThirdPersonController.ts` `ThirdPersonController` para Velocidad, orientación, desplazamiento y colisión. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-3` | `S12-IN1`, `S12-IN2`, `S12-OUT3` | `S12-OUT4` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-5` | Implementar en `src/presentation/three/controls/ThirdPersonCamera.ts` `ThirdPersonCamera` para Spring arm, yaw/pitch y obstrucción por raycast. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-4` | `S12-IN1`, `S12-IN2`, `S12-OUT4` | `S12-OUT5` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-6` | Implementar en `src/presentation/three/systems/AvatarAnimationSystem.ts` `AvatarAnimationSystem` para Balanceo procedural de marcha/reposo. Respetar firmas, parámetros, retornos, errores y ownership declarados en SP2–SP12. | `ADD-5` | `S12-IN1`, `S12-IN2`, `S12-OUT5` | `S12-OUT6` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-7` | Implementar en `tests/unit/presentation/three/CollisionWorld.test.ts` los casos `collision tests` para círculo-segmento/aabb, sliding, esquina e iteraciones. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-6` | `S12-IN1`, `S12-IN2`, `S12-OUT6` | `S12-OUT7` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `ADD-8` | Implementar en `tests/unit/presentation/three/ThirdPersonCamera.test.ts` los casos `camera tests` para spring arm, pitch/yaw, obstrucción y restauración. Cubrir éxito, límite y fallo tipado definidos en SP9 sin usar red real. | `ADD-7` | `S12-IN1`, `S12-IN2`, `S12-OUT7` | `S12-OUT8` | Materializa una responsabilidad única de S12; FR30, FR31, FR35, NFRE6. | `ORQ`:`~` |
| `INT-1` | Conectar los outputs del paso por imports explícitos e inyección de constructor; resolver ciclos, eliminar código provisional y garantizar que ningún caller salte una capa. | `ADD-8` | `S12-OUT1`, `S12-OUT2`, `S12-OUT3`, `S12-OUT4`, `S12-OUT5`, `S12-OUT6`, `S12-OUT7`, `S12-OUT8` | `S12-OUT9` | Convierte archivos aislados en el incremento ejecutable declarado. | `ORQ`:`~` |
| `VAL-1` | Ejecutar `npx vitest run tests/unit/presentation/three/CollisionWorld.test.ts tests/unit/presentation/three/ThirdPersonCamera.test.ts` y `npm run build`; verificar sliding, esquinas y obstrucción. Registrar comandos, navegador cuando aplique y resultado exacto; un fallo deja el paso `BLK`. | `INT-1` | `S12-OUT9` | `S12-OUT10` | Demuestra V14, V15, V19 antes de habilitar consumidores posteriores. | `ORQ`:`~` |
| `DOC-1` | Actualizar `Execution Progress` y añadir entradas por REV/ADD/MOD/INT/VAL en `Execution History`; marcar `S12` DONE solo si `VAL-1` pasa sin excepción. | `VAL-1` | `S12-OUT10`, `S12-OUT0` | `S12-OUT0` | Mantiene trazabilidad técnica y hace explícito el estado heredado por el próximo paso. | `ORQ`:`~` |
