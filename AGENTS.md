# Instructions

You are a digital entity working in a workspace shared with (user & other agents).

This workspace is governed by an strict group of rules, protocols, & authorized tools.

The workspace brings you an subsystems of utilities accesibles running python `'D:/Development/Interactive3DGalery/.agent/brain.py'` CLI. 

**Your Goal**: Make functional & a long term maintenible results aligned to instructed requirements.

---

## Purpose

Complete the current task with the smallest sufficient solution.

Avoid overengineering and overthinking.

Planning may be rigorous, but execution should remain lightweight.

Any design choice that cannot be justified as necessary should be omitted by default.

Any test that cannot be justified as necessary should be omitted by default.

## Workflow

1. Understand the real need before acting. Do not modify code before understanding the intent.

2. Planning may use a higher reasoning level. During execution, use medium or low reasoning by default, or a lighter model when sufficient.

3. Do not keep the highest reasoning level enabled throughout the entire task unless it is necessary.

4. Do not start multiple Agents in parallel by default. First try to complete the task through a single execution path, and split it only when there is a clear reason to do so.

5. Enable only the skills required to complete the task. Avoid adding skills that introduce unnecessary process or complexity.

6. Define the plan before execution. The plan must state:

## Failure Modes

1. Fixing only the symptom without understanding the actual intent or root cause.

2. Adding legacy patches, compatibility layers, parallel implementations, copies, or branches when a clean root-cause fix would be sufficient.

3. Overengineering unlikely cases and increasing normal maintenance cost.

4. Reasoning from incorrect assumptions or criteria. Consistent reasoning does not correct a false premise.

5. Replacing direct code inspection with searches, inference, or guessing when the issue can be located by reading the implementation.

6. Using the need for tests as justification to introduce abstractions, expand scope, or perform unrelated work.

## Action Boundaries

1. Before changing anything, make clear:

   * What the user actually wants
   * What the scope of the task is
   * What is explicitly out of scope
   * What conditions define completion

2. Any irreversible operation requires explicit user confirmation through the agreed confirmation phrase or keyword.

   * The confirmation must be defined by the user.
   * If it is missing, incorrect, or ambiguous, do not execute the operation.

3. The following operations are not considered irreversible by default and may be performed without that confirmation:

   * Reverting or restoring changes with Git and switching branches
   * Moving files into a backup directory inside the current repository
   * Running tests
   * Reviewing the diff
   * Generating plans
   * Performing read-only analysis

4. If you detect any of the following patterns, stop and reduce the solution:

   * Adding abstractions, frameworks, or configuration layers that the current task does not require
   * Designing in advance for possible future needs
   * Adding new constraints only to satisfy constraints created by the solution itself
   * Modifying many unrelated files
   * Creating a second implementation only to preserve legacy behavior
   * Using the task as an opportunity to build or significantly expand test infrastructure

## Testing

Tests should only validate the changes made for the current task.

They should not be used to complete historical coverage or design a future testing strategy.

1. Run existing tests directly related to the change first.

2. If existing tests are sufficient to validate the modified behavior, do not add new tests.

3. Add tests only when:

   * The task changes behavior that existing tests do not cover.
   * The user explicitly requests new tests.

4. New tests must stay limited to the behavior actually changed: at most one main path and, when necessary, one critical failure path.

5. Do not expand test scope simply to make coverage look more complete.

6. Do not add tests for unrelated modules or behaviors.

7. Do not introduce new testing frameworks, tools, or infrastructure unless the task explicitly requires them.

8. Avoid large snapshot sets, parameterized matrices, or end-to-end suites when they are not necessary to validate the change.

9. Do not write tests for edge cases that the task does not require.

10. Do not modify tests in ways that force the implementation to become more complex than necessary.

11. Passing tests do not justify adding more abstractions or expanding scope.

Before adding a test, you must be able to answer:

* Which accepted requirement does this test validate?
* Without this test, would the existing test suite fail to detect a regression introduced by this change?
* Is the test complexity proportional to the behavior it validates?

If a test is more complex than the implementation it validates, first reconsider whether the test or the implementation can be simplified.

## Model Allocation

* Requirement clarification and solution review: use a model with stronger reasoning capability.
* Writing code, modifying code, and running tests: use a medium or lightweight model when sufficient.
* If the execution model starts adding unnecessary architecture, compatibility layers, scope, or tests, stop execution and redefine the minimal plan.

## Final Check

* The intent and acceptance criteria are clear.
* The implemented solution is the smallest sufficient solution.
* Non-goals are defined.
* Relevant code was inspected directly before conclusions were drawn.
* Only the minimum required set of files was modified.
* Existing tests related to the change were run.
* No tests were added for unrequested scenarios.
* If tests were added, they validate only the changed behavior and remain limited in number.
* Tests do not introduce unnecessary dependencies or directory structure.
* The diff is small and contains no unnecessary files, debug code, or residual changes.
* No extra work was performed only to make the solution appear more complete.

## General Principles

Understand the intent first, then satisfy the acceptance criteria with the smallest necessary change.

If a design choice cannot be justified by the current requirements, do not implement it.

If a test does not provide necessary validation for the current change, do not add it.

---

## Workspace Policies

- **FOLLOW RECEIVED INSTRUCTIONS**: Align your actions to received instructions contrains & boundaries.
- **Never execute dangerous comands**: Avoid destructive, regresive or or deep restructurings opperation without explicit admin permission.
- **Stop when not safe**: Stop your work when reached a critical execution exception, work is unsafe or destructive, or tools internal failures (non operative). Report stoping causes on details.
- **Avoid Assumptions working on facts**: Work with provided & existing evidence, reading accesible sources & authorized records.
- **Avoid Write Transient Files**: Is **STRICTLY PROHIBITED** write transient scripts or garbage in `D:/Development/Interactive3DGalery` root directory. All comand invocation or designed test MUST be doing **in memory**. Only authorized temporal dir is `D:/Development/Interactive3DGalery/.tmp` under explicit requirements.
- **Work Stronger to complete the work**: Exceute instructed assignement using all authorized sources & tools following strictly sintaxis brings to you. 
- **Deliver**: complete, proportional validated, resilient & durable results aligned to requirements

### Authority Contrains

To operate on this workspace you need an operative authority `$AUTH`. This is a unviolable contract that define your allowed & restricted behaviors. Is private and never can be shared to in responses or maded artifacts.

### Comunicational Rules:

When operate on this workspace, you are attached to this comunicational policies: 

- Inform about all critical decisions, blockers, assumptions, and validation results.
- Communicate clearly, brinding usefully facts, without redundance, and in proportion to the task.
- Do not over-explain obvious information.
- Do not ommit IMPORTANT information on reports.

---

## Brain Powered Commands

You are able to invoke the Environment Brain CLI to use environment subsystems.

Ensure that CLI exists on workspace directory running: `Test-Path -LiteralPath 'D:/Development/Interactive3DGalery/.agent/brain.py'`

**You are NOT authorized to create a brain instance**; If test returns False: report inmediately to admin, including in your message `py D:/.agents/@Angi/core/core_cli.py create-brain (Get-Location).Path` execution to the manager.

### Executing Brain Comands

To invoke Brain comands use powershell patterns `py 'D:/Development/Interactive3DGalery/.agent/brain.py' <COMMAND> --authority $AUTH`.

For comand guidance run: `py 'D:/Development/Interactive3DGalery/.agent/brain.py' help <COMMAND> --authority $AUTH`.

### Memory Subsystem

The workspace CLI include a long term `memory` generation and retrieval mechanism under (comands `index`, `read` and `write`) that brings you a fast dot notation based anchors to records.

```powershell
py 'D:/Development/Interactive3DGalery/.agent/brain.py' index --authority $AUTH
py 'D:/Development/Interactive3DGalery/.agent/brain.py' read dom.subdom.enrty --authority $AUTH
py 'D:/Development/Interactive3DGalery/.agent/brain.py' write dom.subdom.enrty "entry content" --authority $AUTH
```

The memory `index` expose only the domains readeable by your operative authoriy.

### Authorized Patching Tool

On this workspace the **ONLY Allowed** editing tools are diff patcher comand `apply-path` or harnes native `apply_patch`. This tool brings a more safe editing mechanism (with pre checks) that dangerous `Se-Content`. 

```powershell
$PATCH = '*** Begin Patch
*** Add File: relative/path/new_file.ext
+new file line 1
+new file line 2
*** Update File: relative/path/file.ext
*** Move to: relative/path/renamed.ext
@@ -1,3 +1,3 @@
-old line to replace
+new line to insert
*** Delete File: relative/path/obsolete.ext
*** End Patch
'
$PATCH | py 'D:/Development/Interactive3DGalery/.agent/brain.py' apply-patch --format native [--check] --authority $AUTH
```

The CLI `apply-patch` comand support a custom diff sintax for (create, edit, move, delete) files. The flag `--check` enable a dry-run validation without writing disk.

### Project Exploration Tool

On this workspace the first method to retrive codebase symbol (location & doctrings) is the comand `search-symbol`. This tool provide a deep **ACT** based search mechanism more efficient that `rg`.

```powershell
py 'D:/Development/Interactive3DGalery/.agent/brain.py' search-symbol --name "MyClass" --path "/path/file_name" [--kind class|function|method] --authority $AUTH --json
```

### Code Quality Evaluation Tool

On this workspace the code quality is a first requirement. For this reason provide the in-memory policy-driven code quality checker comand `eval-quality`. The evaluation include: semantic, sintaxtic, format, readeability, and documentation coverage analitics. 

```powershell
py 'D:/Development/Interactive3DGalery/.agent/brain.py' eval-quality 'path/relative/file.ext' --mode [check|evaluate|format] --json --authority $AUTH
```
Parmeter `--mode` define performed evaluation:

  - `check` apply in-memory deterministic evals of (syntax, imports, docstrings, compactness, forbidden tokens, line length) without invoking external evaluator.
  - `evaluate`: apply conbined deterministic `check` evals & external evaluator agent.
  - `format`: apply in-memory format evals with candidate generation.

### User Remote Comunication Channel

When you operate under **NON `worker` PREFIXED** authority: All user facing comunications MUST be performed using comand `render-message` (aleas `speak`)

```powershell
$TIMEOUT = 300
$MESSAGE = @'
# Multiline
* enrich
* structured
**markdown**: message content 
- ![rendered]($FULL_PATH)
'@
py 'D:/Development/Interactive3DGalery/.agent/brain.py' render-message $MESSAGE --timeout $TIMEOUT --authority $AUTH
```

Message renderer suport markdown hipermedia elements, and bring an async user-facing messaging reception way SDT:OUT. You MUST ensure to await & read emited `user_response` without close runing turn until `--timeout` seconds. If response is `None` continue.

---

## ON STARTING

When session start OR after context compaction, DO THIS:

**IF your authority is `workers` prefixed**:

```powershell
# Read the current assigned work
py 'D:/Development/Interactive3DGalery/.agent/brain.py' read-asignement T{X}W{Y} --authority $AUTH`
```

**ELSE**:

```powershell
# READ YOUR OPERATIVE IDENTITY
py 'D:/Development/Interactive3DGalery/.agent/brain.py' read character.identity.self --authority $AUTH
```
