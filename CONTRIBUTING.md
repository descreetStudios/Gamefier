# CONTRIBUTING.md

Di seguito sono riportate le pratiche per GIT e per il codice.

---

## Sommario

1. [Prerequisiti](#prerequisiti)
2. [Formato dei commit](#formato-dei-commit)
3. [Qualità del codice & ESLint](#qualità-del-codice--eslint)

---

## Prerequisiti

- **Node.js ≥ 20** e **npm ≥ 10** installati.
- Accesso in scrittura al repo `git@github.com:org/Gamefier.git`.

```bash
# Clona il repo interno
$ git clone git@github.com:org/Gamefier.git
$ cd Gamefier

# Installa le dipendenze
$ npm ci
```

---

## Formato dei commit
I commit vengono fatti in lignua Inglese

| Tipo      | Pattern                              | Esempio                         |
|-----------|--------------------------------------|---------------------------------|
| Feature   | `feat: descrizione`                  | `feat: login-oauth`             |
| Bugfix    | `fix: descrizione`                   | `fix: avatar-null`              |
| Refactor  | `refactor: descrizione`              | `refactor: user-service`        |
| Hotfix    | `hotfix: descrizione`                | `hotfix: prod-crash`            |
| Docs      | `docs: descrizione`                  | `docs: readme`                  |

In breve:
```
<tipo>: descrizione sintetica
```

Esempio:
```
feat: implement login OAuth2
```

Se serve un corpo commit, mantienilo < 72 caratteri per riga.

---

## Qualità del codice & ESLint

- Usare **ESLint** per la formattazione.

Comandi rapidi:
```bash
npm run lint         # analizza tutto
npm run lint:fix     # fix automatici
```

---
