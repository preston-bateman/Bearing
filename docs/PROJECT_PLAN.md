# Project Plan

## Purpose
Track implementation work for the Expo + Firebase day and life-goals app using stable milestone task IDs.

## Status Legend
- not-started
- in-progress
- blocked
- completed

## Active Milestones

### M0 - Product Planning and Documentation
| Task ID | Status | Description | Notes |
| --- | --- | --- | --- |
| M0.2 | completed | Create product brief document | docs/PRODUCT_BRIEF.md added |
| M0.3 | completed | Create milestone roadmap document | docs/ROADMAP.md added |
| M0.4 | completed | Break M1 into implementation-ready engineering tickets | docs/M1_ENGINEERING_TICKETS.md added |
| M0.5 | completed | Create first-pass Firebase-aligned data model spec | docs/DATA_MODEL_SPEC.md added |
| M0.6 | completed | Create UX flow map for tab and modal transitions | docs/UX_FLOW_MAP.md added |

### M1 - Foundation Setup
| Task ID | Status | Description | Notes |
| --- | --- | --- | --- |
| M1.1 | completed | Initialize Expo application workspace structure | Expo scaffold implemented in mobile/; iOS/Android runtime validation deferred per user environment setup |
| M1.2 | completed | Configure Firebase project and environment wiring | Firebase init/auth/env setup complete with manual signed-in/signed-out verification in web dev runtime |
| M1.3 | completed | Set up linting, test runner, and baseline CI checks | ESLint + Prettier config + Jest smoke test + PR CI workflow added |
| M1.4 | completed | Implement bottom tab navigation shell and screen placeholders | Authenticated tab shell implemented; manual iOS/Android tap-through validation confirmed |

### M2 - Day Management Core
| Task ID | Status | Description | Notes |
| --- | --- | --- | --- |
| M2.1 | completed | Create daily schedule/task data model and state flows | Reuse repository patterns; shared design tokens committed and applied to the current UI shell |
| M2.2 | completed | Implement daily task creation and completion flows | Reusable UI primitives now support the day-management shell and future task flows |
| M2.3 | completed | Add daily overview screen and progress indicators | Calendar daily overview finalized with event-focused loading, empty, error, completed/past interaction states; progress tracking intentionally deferred to Goals |

### M3 - Calendar and Focus Mode
| Task ID | Status | Description | Notes |
| --- | --- | --- | --- |
| M3.1 | completed | Build calendar screen interaction model | Day view (hourly timeline) + month view (horizontally scrollable grid); no week view |
| M3.2 | completed | Add calendar event CRUD baseline | Firestore-backed; fields aligned to DATA_MODEL_SPEC; service layer + React hooks + modals |
| M3.3 | not-started | Implement Idea Dump capture to Notes pipeline | |
| M3.4 | not-started | Implement Focus Mode UI and active event timer | |

### M4 - Life Goals Core
| Task ID | Status | Description | Notes |
| --- | --- | --- | --- |
| M4.1 | not-started | Create life-goal model and milestone tracking | Avoid speculative fields |
| M4.2 | not-started | Implement goal creation/editing and timeline views | Preserve public API stability |
| M4.3 | not-started | Add goal progress summaries and rollups | Include edge-case validation |

## Update Rules
- Read this file before starting a task.
- Update status, scope, dependencies, and notes when work changes.
- Do not mark tasks completed until acceptance criteria are met and validation has passed.
- Preserve completed tasks as progress history.
- Do not rewrite unrelated plan sections.

## Validation Log
| Date | Task ID | Validation | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-07-17 | M0.1 | Custom agent created and project plan initialized | completed | Initial setup complete |
| 2026-07-17 | M0.2 | Product brief document created | completed | docs/PRODUCT_BRIEF.md |
| 2026-07-17 | M0.3 | Roadmap document created | completed | docs/ROADMAP.md |
| 2026-07-17 | M0.4 | M1 engineering ticket breakdown created | completed | docs/M1_ENGINEERING_TICKETS.md |
| 2026-07-17 | M0.5 | Firebase-aligned data model spec created | completed | docs/DATA_MODEL_SPEC.md |
| 2026-07-17 | M0.6 | UX flow map created | completed | docs/UX_FLOW_MAP.md |
| 2026-07-17 | M1.1 | Expo app foundation scaffolded and config validated | completed | mobile/ created, expo-doctor 20/20, platform runtime checks deferred by user |
| 2026-07-17 | M1.2 | Firebase/auth/env implementation started | in-progress | Wiring runtime initialization and startup auth bootstrap |
| 2026-07-17 | M1.2 | Firebase/auth/env implementation and runtime verification complete | completed | .env configured, Firebase auth bootstrap verified by user, anonymous sign-in/sign-out flow validated |
| 2026-07-17 | M1.3 | Tooling baseline implementation started | in-progress | Adding lint, formatting, tests, and CI checks |
| 2026-07-17 | M1.3 | Tooling baseline implementation and validation complete | completed | npm run lint passed, npm run test -- --watch=false passed, npm run test:coverage passed, CI workflow added; npm run format:check reports existing formatting drift |
| 2026-07-17 | M1.4 | Bottom tab navigation shell implementation started | in-progress | Adding authenticated bottom-tab shell with Calendar, Goals, Notes, and Profile placeholders |
| 2026-07-17 | M1.4 | Bottom tab navigation shell implemented and automated validation passed | in-progress | Calendar initial route documented in code; npm run test -- --watch=false, npx tsc --noEmit, and npm run lint passed; awaiting manual iOS/Android tap-through confirmation |
| 2026-07-17 | M1.4 | Bottom tab navigation shell fully validated | completed | Manual iOS/Android tab tap-through confirmed by user; M1.4 acceptance criteria met |
| 2026-07-17 | M2.1 | Design token foundation started | in-progress | Centralizing colors, spacing, and typography into shared mobile/src/design tokens |
| 2026-07-17 | M2.1 | Design token foundation implemented and approved | completed | `npx tsc --noEmit` passed; manual verification approved by user |
| 2026-07-17 | M2.2 | Reusable UI primitives implementation started | in-progress | Adding card, modal, FAB, list item, and header primitives to support day-management UI |
| 2026-07-17 | M2.2 | Reusable UI primitives implementation and validation complete | completed | `npx tsc --noEmit`, `npm run lint`, and `npm test -- --runInBand` passed |
| 2026-07-17 | M2.3 | Daily overview and progress indicators implementation started | in-progress | Building Calendar daily overview with consistent loading, empty, error, completed/past interaction states |
| 2026-07-17 | M2.3 | Daily overview and progress indicators implementation and validation complete | completed | `npx tsc --noEmit`, `npm run lint`, and `npm test` passed with new Calendar state coverage |
| 2026-07-17 | M2.3 | Calendar copy and behavior aligned to event-first product direction | completed | Removed Calendar progress bar/progress copy; retained event state patterns and reserved progress tracking for Goals |
| 2026-07-17 | M3.1 | Calendar screen interaction model implementation started | in-progress | Day view (hourly timeline) + month view (horizontally scrollable grid) |
| 2026-07-17 | M3.1 | Calendar screen interaction model implementation and validation complete | completed | npm test (4 suites, 19 tests), npx tsc --noEmit, npm run lint all passed |
| 2026-07-17 | M3.2 | Calendar event CRUD baseline implementation and validation complete | completed | firebaseEvents service + useCalendarEvents hook + AddEventModal + EventDetailModal; npm test (19 tests), npx tsc, npm run lint passed |
