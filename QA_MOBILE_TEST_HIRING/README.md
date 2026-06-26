# Detox + Cucumber — Mobile E2E QA Exercise

🇬🇧 English · [🇫🇷 Français](./README.fr.md)

A small React Native app (a login flow) wired with an **end-to-end test suite built
on [Detox](https://wix.github.io/Detox/) + [Cucumber.js](https://github.com/cucumber/cucumber-js)**.

The suite mirrors a production mobile E2E standard: Gherkin feature files, a Page
Object Model, reusable step definitions, lifecycle hooks, tags and a data-driven
`Scenario Outline`.

---

## 🎯 The exercise

This E2E suite was written by someone in a hurry. It has **two** kinds of problems:

- **A few scenarios genuinely fail** when you run the suite. They fail for concrete,
  fixable reasons — your job is to diagnose the root cause of each and fix it.
- **Most scenarios pass, but the suite is riddled with anti-patterns and code smells**
  that a senior QA should catch in review: things that make it flaky, brittle, slow,
  hard to maintain, or — worse — that make it **pass when it should fail**.

Your task:

1. **Set up and run the suite** (instructions below). Note which scenarios fail.
2. **Diagnose and fix the failing scenarios.** For each, explain the root cause
   (assertion vs. app, locator, test data…) and your fix.
3. **Review the whole `e2e/` folder** (features, step definitions, page objects, hooks)
   and **identify the anti-patterns** in the *passing* tests too. For each finding, note:
   - *where* it is (file + what),
   - *why* it is a problem (impact: flakiness, false green, maintainability…),
   - *how you would fix it.*
4. **Fix** as many as you can, keeping the suite green **for the right reasons**.
5. **(Bonus)** Extend the coverage with 1–2 new scenarios, written the *right* way.

There is no single right answer count — we are interested in your reasoning, your
familiarity with Detox + Cucumber idioms, and the quality of your fixes.

> The `@smoke`-tagged scenarios currently pass — run `yarn e2e:cucumber:ios:smoke` for a
> quick green baseline before you dig into the full suite.

---

## The app under test

Two screens, navigation driven by local state (no backend):

- **Login** — username / password, validated against fixed credentials
  (`tomsmith` / `SuperSecretPassword!`). Wrong credentials show an error banner.
- **Secure Area** — reached after a successful login; shows a success banner and a
  logout button that returns to the Login page with a confirmation banner.

Every interactive element exposes a stable `testID` (e.g. `username-input`,
`login-button`, `error-banner`, `logout-button`).

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node | **22+** | Cucumber 12 requires Node 22/24/26. An `.nvmrc` is provided: `nvm use`. |
| Yarn | 3.x (Berry) | Bundled via the repo's `.yarnrc.yml`. |
| Ruby | 3.x with CocoaPods | For `pod install` (iOS). CocoaPods `1.15.x` recommended. |
| Xcode + iOS Simulator | — | iOS path. A booted/available simulator is required. |
| Android Studio + AVD | — | Android path (optional). |
| [Detox CLI](https://wix.github.io/Detox/docs/introduction/getting-started) | `detox-cli` | `npm i -g detox-cli` (optional, scripts use the local binary). |

---

## Setup

```bash
nvm use                 # Node 22 (see .nvmrc)
yarn install            # JS dependencies

# iOS native deps
cd ios && bundle exec pod install && cd ..
```

---

## Build the app for Detox

Detox runs against its own build output (`ios/build/...`), separate from
`react-native run-ios`.

```bash
# iOS (debug build for the simulator)
yarn detox:build:ios

# Android
yarn detox:build:android
```

---

## Run the E2E tests

The Cucumber config lives in [`cucumber.js`](./cucumber.js); features and step
definitions live under [`e2e/`](./e2e).

```bash
# iOS — full suite
yarn e2e:cucumber:ios

# iOS — smoke only (@smoke tag)
yarn e2e:cucumber:ios:smoke

# Android
yarn e2e:cucumber:android
yarn e2e:cucumber:android:smoke
```

> **Simulator OS** — the iOS scripts pin `DETOX_DEVICE_OS="iOS 18.0"` and the device
> type in [`.detoxrc.js`](./.detoxrc.js) is `iPhone 16 Pro`. Adjust both to match a
> simulator installed on your machine (`xcrun simctl list devices available`).

Reports are written to `e2e/reports/` (`cucumber-report.html`, `.json`) and a summary
to `cucumber-report.txt` (all git-ignored).

---

## Test suite structure

```
cucumber.js                         # Cucumber config (formatters, paths, babel)
e2e/
├── features/                       # Gherkin specs (business language)
│   ├── 1-Login/1-Login.feature
│   └── 2-SecureArea/1-SecureArea.feature
├── step_definitions/
│   ├── Hooks.js                    # Detox lifecycle via detox/internals
│   ├── CommonSteps.js
│   ├── LoginSteps.js
│   └── SecureAreaSteps.js
├── pageObjects/                    # Page Object Model (by.id getters)
│   ├── CommonPage.js
│   ├── LoginPage.js
│   └── SecureAreaPage.js
├── utils/platformUtils.js          # isIOS / isAndroid helpers
├── config/credentials.js           # centralised test data
└── data/                           # messages.json, credentials.json
```
