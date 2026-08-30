<!-- Authorized: workers.project.project_explorer.45892f90 -->
# Work Assignment ~ Planning Package Content Map

Act as a specialized worker, following contractual authority and instructions, to deliver the assigned contribution.

Before executing any task action, read your **Specialized Contract** running:

```powershell
$AUTH = 'workers.project.project_explorer'
py 'D:/Development/Interactive3DGalery/.agent/brain.py' read $AUTH --authority $AUTH
```

Follow the contract instructions throughout execution.

## 1. Objective & Deliverables

- **Primary goal:** Inspect the planning package content permutation and produce a complete evidence-backed mapping from every currently named normative document/source file to the path its content actually belongs to.
- **Expected deliverable:** A final read-only report containing current path, detected document identity, intended path, evidence, duplicate/missing identities, and any ambiguity that prevents a safe orchestrator repair.

### Requirement Matrix

| ID | Target | Evidence Before | Required Resolution | Invariants | Validation |
| --- | --- | --- | --- | --- | --- |
| REQ-01 | `.plans/tasks/t1/documents/spec_*.md` | Filenames may not match internal `SP*` headings and contracts. | Map every SP1–SP12 content identity to its intended `spec_XX_*.md` path using headings and declared symbols. | Read-only; do not infer identity from filename alone. | `V1`, `V3` |
| REQ-02 | `.plans/tasks/t1/documents/step_S*.md` | At least `step_S1.md` contains S13 and `step_S11.md` contains S1. | Map every S1–S15 content identity to its intended `step_SX.md` path using internal step heading, satisfies/depends/outcomes, inputs and outputs. | Read-only; preserve exact content and report all duplicates/missing steps. | `V1`, `V3` |
| REQ-03 | `.plans/tasks/t1/sources/*`, `.plans/tasks/t1/README.md`, `.plans/tasks/t1/documents/planning_audith.md` | `sources/MANIFEST.sha256` currently begins as SVG XML. | Identify actual content type and intended path of each source/support artifact; report whether four distinct SVGs and one checksum manifest can be reconstructed from existing content. | Never modify, rename, copy, hash-write, or delete any artifact. | `V2`, `V3` |
| REQ-04 | Complete package identity set | Prior audit claims 12 specs, 15 steps and 4 SVGs. | Produce a bijection audit of expected identities versus observed identities, identifying exact surplus, missing, duplicate or ambiguous content. | Claims require direct file evidence; do not treat prior audit claims as proof. | `V3` |

## 2. Domain & Authorized Scope

- **Target domain:** Planning package integrity under `.plans/tasks/t1`, excluding `plan.md` and assignments.
- **Parent authorization:** Read every file under `.plans/tasks/t1/documents` and `.plans/tasks/t1/sources`, plus `.plans/tasks/t1/README.md`; inspect Git metadata and diffs read-only when useful.
- **Prohibited:** Reading `.plans/tasks/t1/plan.md`; modifying any file; staging; running builds, package installs, application tests, network operations, or creating temporary artifacts.
- **Additional constraints:** Use repository-relative paths in commands and report. Complete the full mapping even if some files are binary, malformed, duplicated or mislabeled. Do not stop after confirming the known examples.

### Reused

- **RE1:** `.plans/tasks/t1/documents/spec_*.md` → normative candidates — identify by internal SP headings, contracts and symbols.
- **RE2:** `.plans/tasks/t1/documents/step_S*.md` → implementation-step candidates — identify by internal S headings and dependency/output declarations.
- **RE3:** `.plans/tasks/t1/sources/*` → visual/checksum candidates — identify via signatures, SVG title/content and checksum syntax.
- **RE4:** `.plans/tasks/t1/documents/planning_audith.md` and `.plans/tasks/t1/README.md` → support candidates — identify by headings and purpose.

### Modified

No files are authorized for modification. This is a read-only exploration assignment.

## 3. Validation Gates

- **V1:** Enumerate every `documents/spec_*.md` and `documents/step_S*.md`, read each from first line to EOF, and provide one mapping row per file.
- **V2:** Inspect every file under `sources` by signature/content and provide one mapping row per file, including detected content type.
- **V3:** Reconcile observed identities against exactly SP1–SP12, S1–S15, four named SVG visuals, checksum manifest, README and planning audit; report a bijection only if every expected identity appears exactly once with direct evidence.
- **V4:** `git status --short` before and after inspection must show no worker-caused change.

## 4. Return Requirement

Return the execution result to the parent orchestrator using the mandatory contract reporting template. Cover every `REQ-*` and `V*`, include complete mapping tables, exact commands, integrity evidence, unresolved ambiguities and truthful status.

## 5. Execution Notes

- Do not attempt to bypass, override, or modify validation gates.
- Work only using exact stable command syntax declared in your contract.
- If a tool-call syntax error occurs, retry once using native Codex tool syntax.
- If existing content is insufficient to derive a unique intended path, report the ambiguity rather than inventing a mapping.
