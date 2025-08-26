# CONTRIBUTING.md

Below are the practices for GIT and code standards.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Commit Format](#commit-format)
3. [Code Quality & ESLint](#code-quality--eslint)

---

## Prerequisites

- **Node.js ≥ 20** and **npm ≥ 10** must be installed.
- **Firebase CLI** must be installed globally using the following command: `npm install -g firebase-tools`.
- Write access to the repo `git@github.com:org/Gamefier.git` is required.

```bash
# Clone the internal repo
$ git clone git@github.com:org/Gamefier.git
$ cd Gamefier

# Install dependencies
$ npm ci
```

---

## Commit Format
Commits must be written in English.

| Type      | Pattern                              | Example                         |
|-----------|--------------------------------------|---------------------------------|
| Feature   | `feat: description`                  | `feat: login-oauth`             |
| Bugfix    | `fix: description`                   | `fix: avatar-null`              |
| Refactor  | `refactor: description`              | `refactor: user-service`        |
| Hotfix    | `hotfix: description`                | `hotfix: prod-crash`            |
| Docs      | `docs: description`                  | `docs: readme`                  |

In short:
```
<type>: short description
```

Example:
```
feat: implement login OAuth2
```

If a commit body is needed, keep each line < 72 characters.

---

## Code Quality & ESLint

- Use **ESLint** for formatting and code quality checks.

Quick commands:
```bash
npm run lint         # analyze everything
npm run lint:fix     # apply automatic fixes
```

---