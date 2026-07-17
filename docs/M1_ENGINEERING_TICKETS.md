# M1 Engineering Tickets

## Scope
Implementation-ready tickets for M1 Foundation and Tooling from roadmap item M1.1 through M1.4.

## Definition of Done for M1
- Expo app runs on iOS and Android.
- Firebase auth and environment wiring work in development.
- Linting, tests, and CI checks are configured.
- Bottom-tab navigation shell is functional for Calendar, Goals, Notes, and Profile.

## Ticket Table

| Ticket ID | Status | Summary | Depends On |
| --- | --- | --- | --- |
| M1.1 | completed | Initialize Expo app structure and baseline app config | None |
| M1.2 | not-started | Configure Firebase project setup, auth bootstrap, and env strategy | M1.1 |
| M1.3 | not-started | Set up linting, formatting, tests, and CI checks | M1.1 |
| M1.4 | not-started | Implement bottom tab navigation shell and screen placeholders | M1.1, M1.2 |

---

## M1.1 Initialize Expo App Structure

### Objective
Create a production-ready Expo baseline using a folder layout aligned to Expo app folder structure guidance.

### Deliverables
- Expo project initialized.
- Baseline folders for app routes/screens, components, features, services, and docs.
- App config prepared for Firebase and multi-environment configuration.
- README section with local setup and run instructions.

### Acceptance Criteria
- Project starts successfully with Expo.
- iOS and Android both render initial app shell.
- No build-time config errors in app startup path.
- Folder structure and naming conventions are documented.

### Implementation Notes
- Prefer Expo Router-compatible layout if chosen at project bootstrap.
- Keep architecture minimal and avoid one-off abstractions.

### Validation Commands
- npx expo start
- npx expo start --ios
- npx expo start --android
- npx expo-doctor

### Implementation Notes (2026-07-17)
- Expo app scaffolded in `mobile/` because repository root already contained planning/agent files.
- Dynamic Expo config set via `mobile/app.config.ts` with environment-ready Firebase extras.
- Static `mobile/app.json` removed to avoid config conflicts with dynamic config.
- `npx expo-doctor` passed with 20/20 checks after config fix.
- iOS and Android runtime validation deferred by user due local environment setup dependency.

---

## M1.2 Firebase Setup, Auth, and Environment Wiring

### Objective
Integrate Firebase project configuration and establish secure environment variable handling.

### Deliverables
- Firebase project setup documentation.
- App-side Firebase initialization module.
- Authentication bootstrap flow (session detection and sign-in entry path).
- Environment variable strategy for dev/stage/prod.

### Acceptance Criteria
- App can initialize Firebase in development using env configuration.
- Authentication bootstrap can detect signed-in vs signed-out state.
- Missing env values produce actionable startup errors.
- No secrets committed in source control.

### Implementation Notes
- Keep initialization idempotent.
- Preserve causal chain in thrown errors.

### Validation Commands
- npx expo start
- npm run lint
- npm run test -- --watch=false
- Verify auth bootstrap behavior in simulator/emulator manually

---

## M1.3 Lint, Tests, and CI Baseline

### Objective
Create baseline quality gates so feature work in later milestones has consistent validation.

### Deliverables
- ESLint and formatting configuration.
- Test runner setup for React Native/Expo-compatible tests.
- At least one smoke test for app shell rendering.
- CI workflow that runs lint + tests on pull requests.

### Acceptance Criteria
- Lint passes locally.
- Tests run in non-watch mode locally.
- CI executes lint and tests on PR events.
- Failing lint/tests block CI success.

### Implementation Notes
- Test public behavior, not internal implementation details.
- Keep initial test set small and reliable.

### Validation Commands
- npm run lint
- npm run test -- --watch=false
- npm run test -- --coverage
- Trigger CI pipeline and verify status checks

---

## M1.4 Bottom Tab Navigation Shell

### Objective
Provide the app-level navigation backbone with four tabs and placeholder screens.

### Deliverables
- Bottom tabs: Calendar, Goals, Notes, Profile.
- Placeholder screens with stable route identifiers.
- Navigation state persistence behavior defined (if enabled).

### Acceptance Criteria
- User can switch between all four tabs.
- Tab icons/labels are visible and tappable.
- Initial route selection is intentional and documented.
- No navigation crashes when switching tabs repeatedly.

### Implementation Notes
- Keep tabs aligned to product brief naming.
- Avoid feature logic in placeholder screens.

### Validation Commands
- npx expo start --ios
- npx expo start --android
- npm run test -- --watch=false
- Manual tap-through test across all tabs

---

## Risks and Mitigations
- Risk: Firebase env values misconfigured across environments.
  - Mitigation: Add strict startup validation and setup checklist.
- Risk: Tooling churn from over-configuring quality stack early.
  - Mitigation: Keep minimal baseline and expand in later milestones.
- Risk: Navigation architecture mismatch with planned modals.
  - Mitigation: Document route conventions and modal strategy before M3/M4 implementation.

## Handoff to M2+
- Carry forward folder and routing conventions.
- Reuse quality gates from M1.3 for all later milestones.
- Keep M1 artifacts as baseline; avoid re-platforming in M2.
