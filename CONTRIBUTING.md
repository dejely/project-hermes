# Contributing

Thank you for contributing to Project HERMES.

This repository is intended to stay readable, reviewable, and safe to run. Keep contributions focused on improving the product, clarifying the codebase, or fixing operational issues.

## Before you start

- Read the [README](README.md) for product context.
- Read the [Setup Guide](docs/setup.md) if you need a local environment.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Do not commit secrets, tokens, or personal credentials.

## Contribution workflow

1. Fork the repository or create a working branch from the main project.
2. Create a focused branch such as `feature/incidents-map-filter` or `fix/export-date-range`.
3. Make the smallest reasonable change that solves one clear problem.
4. Run the local checks before opening a pull request.
5. Open a pull request with a clear description of the change, the reason for it, and how it was tested.

## Local checks

Run these commands before submitting a pull request:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Pull request expectations

- Keep PRs scoped to a single change or closely related set of changes.
- Explain user-facing impact, not just code changes.
- Include screenshots or short screen recordings for UI changes when possible.
- Note any environment variables, migrations, or webhook changes that reviewers need to know about.

## Commit guidance

This repository uses commit linting. Prefer clear, conventional commit messages such as:

```text
feat: add area-based advisory targeting
fix: correct incident map coordinate parsing
docs: rewrite setup guide for local demo
```

## Licensing

By contributing, you agree that your contributions will be licensed under the project [LICENSE](LICENSE).
