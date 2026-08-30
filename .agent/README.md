# Agent Workspace Guidelines

Welcome to this workspace. Follow these agent operating rules:

## 1. Local Entrypoint Usage
Always use the local entrypoint located at .agent/brain.py to interact with memory and logs. Do NOT use the consumer factory `core/core_cli.py` for normal Brain commands.

## 2. Workspace Logs
All progress logs must be written through the DB-backed brain CLI.
- To append a log: `python .agent/brain.py append-log -d <domain> -t <title> ...`
- Never edit the logs database or exported log files manually.

## 3. Environment & Security
Ensure your work is committed and tracked. If git is not initialized or there are unstaged changes, confirm with the user before proceeding.
