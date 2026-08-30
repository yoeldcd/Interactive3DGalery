<!-- Authorized: workers.typescript.typescript_writer.cfb834c5 -->
<!-- 
    FIll THIS DOCUMENT FOLLOWING NEXT INSTRUCTIONS:
    
    **INSTRUCTIONS**:

    - Assignement MUST BE an scoped~located contribution in a (file, directory, or module) with a clear and verifiable outcome.
    - The assignment MUST declare detailed and unambiguous the exact scope of work, deliverables elements, and validation criterias.
    - Each assignment step MUST be self-contained and sequentially executable without any external dependencies or assumptions.
    - The assignment MUST be self-contained and executable without any external dependencies or assumptions.
    
    **IMPORTANT:** 
    
    - Never expose the `PLAN.md` to workers.
    - As orquestator you're responsble for supervise the assignement execution and report each progress, diff, blockeage, delivery, & completion to the user.
    - DOCUMENT MUTS NEED A PREFIXED AUTHORITY TAG `<!-- Authorized: workers.typescript.typescript_writer --\>` to allow worker reading  
    
    **REMOVE GUIDANCE COMMENTs BEFORE ASSIGN

-->
# Work Assignment ~ S1 Reproducible Baseline

Act as a specialized worker, following contractual authority and instructions, to deliver the assigned contribution.

Before executing any task action, read your **Specialized Contract** running:

```powershell
$AUTH = 'workers.typescript.typescript_writer'
py 'D:/Development/Interactive3DGalery/.agent/brain.py' read $AUTH --authority $AUTH
```

Follow the contract instructions throughout execution.

## 1. Objective & Deliverables

<!-- OBLIGATORY SECTION -->

- **Primary goal:** <ONE_CONCRETE_CONTRIBUTION_GOAL>
- **Expected deliverable:** <OBSERVABLE_ARTIFACT_OR_FINDING>

### Requirement Matrix

<!-- OBLIGATORY SECTION -->

Complete sequentially this requirement reporting each one completion summaries to the parent orchestrator before emitt the final sructured report.

| ID | Target | Evidence Before | Required Resolution | Invariants | Validation |
| --- | --- | --- | --- | --- | --- |
| REQ-01 | `MOD1` | <CURRENT_OBSERVABLE_STATE> | <ONE_VERIFIABLE_OUTCOME> | <WHAT_MUST_NOT_CHANGE> | `V1` |

## 2. Domain & Authorized Scope

<!-- OBLIGATORY SECTION -->

- **Target domain:** `<TARGET_DOMAIN_PATH_OR_MODULES>`
- **Parent authorization:** `<EXPLICIT_AUTHORITY_FOR_THIS_CONTRIBUTION>`
- **Prohibited:** <PROHIBITED_PATHS_ACTIONS_OR_SCOPE_EXPANSION>
- **Additional constraints:** <TASK_SPECIFIC_LIMITS_OR_NONE>

### Reused

<!-- OBLIGATORY SECTION WHEN EXISTINGs -->

You can read or reuse next elements as reference for your contribution, but you are NOT authorized to modify them unless explicitly declared in the `MOD-*` section.:

- **RE1:** `{file|directory|module}` → `{element}` — {relevance or intended use}
- ...

### Modified

<!-- OBLIGATORY SECTION WHEN EXISTING MODIFICATION -->

You are authorized to modify only the following elements:

- **MOD1:** `{file|directory|module}` → `{element}` — {authorized intended change}
- ...

## 3. Validation Gates

<!-- OBLIGATORY SECTION -->

You are required to validate your contribution using the following tools, commands, or checkings. Each criteria MUST be green before reporting `COMPLETED`.

- **V1:** `{exact command or check}` → {passing condition}
- **V2:** `{exact command or check}` → {passing condition}
- ...

## 4. Return Requirement

<!-- OBLIGATORY SECTION -->

Return the execution result to the parent orchestrator using the mandatory contract reporting template.

The report MUST cover each `REQ-*` and `V*` declared by this assignment.

## 5. Execution Notes

<!-- OBLIGATORY SECTION -->

- Don 't attempt to bypass, override, or modify validation gates.
- Work ONLY using exact stable commands syntax declared in your contract. Do not improvise tool-call formats, aliases, shell wrappers, or alternative invocations.
- If you encounter a situation where the contract is insufficient, report it to the parent orchestrator for resolution.
