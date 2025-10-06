# Git Hooks

This project uses Husky to manage git hooks.

## Pre-commit Hook

The pre-commit hook automatically runs:
- `lint-staged` - Lints and formats only staged files
- Biome checks and formatting
- Ultracite fixes for code quality

Files are automatically fixed before commit when possible.
