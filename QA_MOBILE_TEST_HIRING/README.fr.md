# Detox + Cucumber — Exercice QA E2E Mobile

[🇬🇧 English](./README.md) · 🇫🇷 Français

Une petite application React Native (un flux de connexion) accompagnée d'une **suite de
tests end-to-end bâtie sur [Detox](https://wix.github.io/Detox/) +
[Cucumber.js](https://github.com/cucumber/cucumber-js)**.

La suite reproduit un standard E2E mobile de production : fichiers de features Gherkin,
Page Object Model, step definitions réutilisables, hooks de cycle de vie, tags et un
`Scenario Outline` piloté par les données.

---

## 🎯 L'exercice

Cette suite E2E a été écrite dans la précipitation. Elle présente **deux** types de
problèmes :

- **Quelques scénarios échouent réellement** quand on lance la suite. Ils échouent pour
  des raisons concrètes et réparables — ton job est d'en diagnostiquer la cause racine
  et de les corriger.
- **La plupart des scénarios passent, mais la suite est truffée d'anti-patterns et de
  code smells** qu'un·e QA senior doit repérer en revue : des choses qui la rendent
  *flaky*, fragile, lente, difficile à maintenir, ou — pire — qui la font **passer au
  vert alors qu'elle devrait échouer**.

Ta mission :

1. **Installe et lance la suite** (instructions ci-dessous). Note quels scénarios échouent.
2. **Diagnostique et corrige les scénarios en échec.** Pour chacun, explique la cause
   racine (assertion vs app, locator, données de test…) et ta correction.
3. **Passe en revue tout le dossier `e2e/`** (features, step definitions, page objects,
   hooks) et **identifie les anti-patterns** y compris dans les tests qui *passent*.
   Pour chaque trouvaille, indique :
   - *où* c'est (fichier + quoi),
   - *pourquoi* c'est un problème (impact : flakiness, faux vert, maintenabilité…),
   - *comment* tu corrigerais.
4. **Corrige** autant que tu peux, en gardant la suite verte **pour les bonnes raisons**.
5. **(Bonus)** Étends la couverture avec 1–2 nouveaux scénarios, écrits *correctement*.

Il n'y a pas de nombre de réponses « attendu » — ce qui nous intéresse, c'est ton
raisonnement, ta maîtrise des idiomes Detox + Cucumber, et la qualité de tes correctifs.

> Les scénarios tagués `@smoke` passent actuellement — lance `yarn e2e:cucumber:ios:smoke`
> pour obtenir une base verte rapide avant d'attaquer la suite complète.

---

## L'application testée

Deux écrans, navigation pilotée par l'état local (pas de backend) :

- **Login** — identifiant / mot de passe, validés contre des identifiants fixes
  (`tomsmith` / `SuperSecretPassword!`). Des identifiants erronés affichent un bandeau
  d'erreur.
- **Secure Area** — atteint après une connexion réussie ; affiche un bandeau de succès
  et un bouton de déconnexion qui ramène à la page Login avec un bandeau de confirmation.

Chaque élément interactif expose un `testID` stable (ex. `username-input`,
`login-button`, `error-banner`, `logout-button`).

---

## Prérequis

| Outil | Version | Notes |
|------|---------|-------|
| Node | **22+** | Cucumber 12 exige Node 22/24/26. Un `.nvmrc` est fourni : `nvm use`. |
| Yarn | 3.x (Berry) | Embarqué via le `.yarnrc.yml` du repo. |
| Ruby | 3.x avec CocoaPods | Pour `pod install` (iOS). CocoaPods `1.15.x` recommandé. |
| Xcode + Simulateur iOS | — | Voie iOS. Un simulateur démarré/disponible est requis. |
| Android Studio + AVD | — | Voie Android (optionnelle). |
| [Detox CLI](https://wix.github.io/Detox/docs/introduction/getting-started) | `detox-cli` | `npm i -g detox-cli` (optionnel, les scripts utilisent le binaire local). |

---

## Installation

```bash
nvm use                 # Node 22 (voir .nvmrc)
yarn install            # dépendances JS

# dépendances natives iOS
cd ios && bundle exec pod install && cd ..
```

---

## Builder l'app pour Detox

Detox s'exécute sur sa propre sortie de build (`ios/build/...`), distincte de
`react-native run-ios`.

```bash
# iOS (build debug pour le simulateur)
yarn detox:build:ios

# Android
yarn detox:build:android
```

---

## Lancer les tests E2E

La config Cucumber est dans [`cucumber.js`](./cucumber.js) ; features et step
definitions sont sous [`e2e/`](./e2e).

```bash
# iOS — suite complète
yarn e2e:cucumber:ios

# iOS — smoke uniquement (tag @smoke)
yarn e2e:cucumber:ios:smoke

# Android
yarn e2e:cucumber:android
yarn e2e:cucumber:android:smoke
```

> **OS du simulateur** — les scripts iOS fixent `DETOX_DEVICE_OS="iOS 18.0"` et le type
> d'appareil dans [`.detoxrc.js`](./.detoxrc.js) est `iPhone 16 Pro`. Ajuste les deux
> pour coller à un simulateur installé sur ta machine
> (`xcrun simctl list devices available`).

Les rapports sont écrits dans `e2e/reports/` (`cucumber-report.html`, `.json`) et un
résumé dans `cucumber-report.txt` (tous git-ignorés).

---

## Structure de la suite de tests

```
cucumber.js                         # Config Cucumber (formatters, chemins, babel)
e2e/
├── features/                       # Specs Gherkin (langage métier)
│   ├── 1-Login/1-Login.feature
│   └── 2-SecureArea/1-SecureArea.feature
├── step_definitions/
│   ├── Hooks.js                    # Cycle de vie Detox via detox/internals
│   ├── CommonSteps.js
│   ├── LoginSteps.js
│   └── SecureAreaSteps.js
├── pageObjects/                    # Page Object Model (getters by.id)
│   ├── CommonPage.js
│   ├── LoginPage.js
│   └── SecureAreaPage.js
├── utils/platformUtils.js          # helpers isIOS / isAndroid
├── config/credentials.js           # données de test centralisées
└── data/                           # messages.json, credentials.json
```
