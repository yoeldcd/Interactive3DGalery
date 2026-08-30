#!/usr/bin/env python
# Author: Yoel David <yoeldcd@gmail.com>
# X: https://x.com/SAY6267

"""Provide the Brain factory and generated consumer launcher.

The module resolves workspace context from its supported layout, then boots the Brain
package with import roots that work from both core and consumer copies.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Directory containing this entrypoint (`core/` or a consumer `$agent/scripts/`).
HOME_ROOT = Path(__file__).resolve().parent

# The factory lives directly under `core`; generated consumers receive the
# absolute shared core path on this line.
IS_CORE_FACTORY = Path(__file__).name == "core_cli.py" and HOME_ROOT.name == "core"
CORE_ROOT = Path("D:/.agents/@Angi/core")


# A consumer launcher always lives at `<workspace>/$agent/scripts/brain.py`.

def _resolve_workspace_context() -> tuple[Path, Path]:
    """Resolve the workspace root and canonical workspace home.

    Args:
        None.

    Returns:
        tuple[Path, Path]: Workspace root and canonical workspace home.

    Raises:
        RuntimeError: If this file is outside a supported facade layout.
    """

    # The core factory is anchored at the repository root and targets that workspace.

    if IS_CORE_FACTORY:
        workspace_root = CORE_ROOT.parent
        workspace_home = workspace_root / ".agent"

        return workspace_root, workspace_home

    home_name = HOME_ROOT.name.casefold()
    parent_name = HOME_ROOT.parent.name.casefold()

    # Accept the historical nested launcher layout while resolving its workspace home.

    if home_name == "scripts" and parent_name in {"$agent", ".agent", "agent"}:
        workspace_home = HOME_ROOT.parent

        return workspace_home.parent, workspace_home

    # Accept a canonical or legacy workspace-home directory containing the facade.

    if home_name in {"$agent", ".agent", "agent"}:
        return HOME_ROOT.parent, HOME_ROOT

    raise RuntimeError(
        "Brain facade must live at <workspace>/.agent/brain.py or "
        "<workspace>/.agent/scripts/brain.py."
    )


WORKSPACE_ROOT, WORKSPACE_HOME = _resolve_workspace_context()

# The consumer contributes only workspace context. `CORE_ROOT` is a bootstrap
# variable used below to import `core/brain/src`; Brain discovers its own core
# container from the installed package and reads agent_dir from core config.
os.environ["WORKSPACE_ROOT"] = str(WORKSPACE_ROOT)
os.environ["WORKSPACE_HOME"] = str(WORKSPACE_HOME)


def _prioritize_import_path(path: Path) -> None:
    """Move one resolved import root to the front of sys.path.

    Args:
        path: Import root to prioritize.

    Returns:
        None.
    """
    resolved = str(path.resolve())
    normalized = os.path.normcase(os.path.normpath(resolved))
    sys.path[:] = [
        item
        for item in sys.path
        if os.path.normcase(os.path.normpath(os.path.abspath(item or ".")))
        != normalized
    ]
    sys.path.insert(0, resolved)


def main() -> int:
    """Run the Brain command-line interface.

    Returns:
        int: Process exit code returned by the requested Brain command.

    Args:
        None.
    """

    # Keep command output responsive when the host stream supports reconfiguration.

    try:
        sys.stdout.reconfigure(line_buffering=True)

    # Older stream implementations may omit reconfigure; default behavior is sufficient.

    except AttributeError:
        pass

    # Allow create-brain to run from template/factory file
    is_init_cmd = len(sys.argv) > 1 and sys.argv[1] == "create-brain"

    # Prevent the factory template from being used as a normal workspace facade.

    if IS_CORE_FACTORY and not is_init_cmd:
        print(
            "Error: core_cli.py is the consumer factory, not a workspace Brain facade.",
            file=sys.stderr,
        )
        print(
            "\nStep 1: Ensure you initialize your target workspace root:",
            file=sys.stderr,
        )
        print(
            "        python core/core_cli.py create-brain <target_workspace_root>",
            file=sys.stderr,
        )
        print(
            "\nStep 2: Run commands using your local workspace facade copy:",
            file=sys.stderr,
        )
        print("        python .agent/brain.py <command>", file=sys.stderr)

        return 1

    brain_src_dir = CORE_ROOT / "brain" / "src"

    # Put local package roots first so the launcher remains self-contained.

    for import_root in (HOME_ROOT, CORE_ROOT, brain_src_dir):
        _prioritize_import_path(import_root)

    from brain.cli import main as brain_main

    return brain_main()


if __name__ == "__main__":
    raise SystemExit(main())
