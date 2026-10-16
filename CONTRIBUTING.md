# Contributing to FitMeister

Thank you for your interest in contributing to **FitMeister**! We are committed to maintaining a high-performance, secure, and production-grade fitness management ecosystem.

## Code of Conduct

By participating in this project, you agree to abide by our standards of respectful, collaborative, and inclusive communication.

## Branching & Commit Conventions

We follow the **Conventional Commits** specification:

- `feat(scope)`: Introduces a new capability or module.
- `fix(scope)`: Patches a known bug or calculation issue.
- `docs(scope)`: Documentation updates or additions.
- `style(scope)`: Formatting, CSS, or styling adjustments.
- `refactor(scope)`: Code refactoring without behavioral alterations.
- `test(scope)`: Adding or revising test suites.
- `chore(scope)`: Tooling, dependency, or workspace updates.

### Branch Naming:
- `feat/feature-name`
- `fix/issue-description`
- `docs/topic-update`

## Pull Request Guidelines

1. Ensure all TypeScript builds pass without errors (`npm run build`).
2. Run test suites and verify concurrency tests (`npm test`).
3. Maintain test coverage for newly added business logic.
4. Update API documentation in `README.md` and `Backend/src/docs/openapi.ts` if adding or modifying routes.
