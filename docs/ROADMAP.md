# Product Roadmap

## Objective
Deliver Bearing from initial setup to production release on iOS App Store and Google Play, including premium monetization and AI-assisted goal planning.

## Delivery Principles
- Build in small validated increments.
- Prioritize public behavior and user outcomes.
- Gate advanced functionality behind observability and testing.
- Keep architecture consistent with Expo + Firebase best practices.

## Milestone Plan

### M0 - Product Definition and Planning
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M0.1 | completed | Create custom delivery agent rules and operating workflow | Agent in place and usable |
| M0.2 | completed | Produce concise product brief | Product scope and requirements documented |
| M0.3 | completed | Produce implementation roadmap | Ordered milestones and dependencies documented |

### M1 - App Foundation and Tooling
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M1.1 | completed | Initialize Expo app and folder structure | Expo TypeScript app scaffolded in mobile/ with baseline structure and config; platform runtime validation deferred per user environment setup |
| M1.2 | completed | Configure Firebase project, auth, env management | Firebase init/auth bootstrap and env strategy validated in development |
| M1.3 | completed | Add lint, formatter, tests, and CI baseline | CI validates lint and tests on PR |
| M1.4 | completed | Set up navigation shell with bottom tabs | Calendar, Goals, Notes, Profile tabs routable |

### M2 - Design System and UX Foundation
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M2.1 | completed | Define visual language, typography, spacing, and component tokens | Design tokens committed and documented |
| M2.2 | in-progress | Build reusable primitives (cards, modals, FAB, list items, headers) | Core UI primitives integrated across tabs |
| M2.3 | not-started | Define interaction states (loading, empty, error, completed/past) | State patterns implemented and consistent |

### M3 - Calendar and Focus Mode
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M3.1 | not-started | Build calendar screen interaction model | Calendar view stable and performant |
| M3.2 | not-started | Implement Focus Mode UI and active event timer | Focus Mode usable from FAB and event state |
| M3.3 | not-started | Implement Idea Dump capture to Notes pipeline | Idea Dump creates note records reliably |
| M3.4 | not-started | Add calendar event CRUD baseline | Local app event lifecycle functional |

### M4 - Goals Core Experience
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M4.1 | not-started | Implement goals list cards with required fields | Cards show goal name, date, next task |
| M4.2 | not-started | Build SMART onboarding + goal creation wizard (manual path) | User can create goal and steps without AI |
| M4.3 | not-started | Implement Goal Details modal with edit capabilities | Goal edit/save/close behavior validated |
| M4.4 | not-started | Implement step list interactions (add, complete, reorder) | Reorder and completion state persist correctly |
| M4.5 | not-started | Implement Step Details modal with schedule action | Step details and linked event list functional |

### M5 - Notes and Profile
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M5.1 | not-started | Build notes list and note CRUD | Notes can be created, edited, deleted |
| M5.2 | not-started | Merge Idea Dump and standard notes flows | Captured notes are discoverable and editable |
| M5.3 | not-started | Build profile account settings and password reset flow | Account actions verified end-to-end |
| M5.4 | not-started | Add tips/life wisdom alert and sound settings | Profile utilities functional and saved |

### M6 - Calendar Integrations and ICS Interop
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M6.1 | not-started | Integrate Google Calendar connectivity | Read/write sync works for connected account |
| M6.2 | not-started | Integrate Microsoft calendar connectivity | Read/write sync works for connected account |
| M6.3 | not-started | Integrate Apple calendar pathway and constraints handling | Compatible import/export path validated |
| M6.4 | not-started | Add .ics import/export/share support | .ics round-trip validated with sample events |
| M6.5 | not-started | Build conflict resolution and sync diagnostics UI | Sync errors are actionable for users |

### M7 - Premium and AI Goal Assistant
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M7.1 | not-started | Implement premium entitlement model and feature gates | Premium gates enforced client and server side |
| M7.2 | not-started | Build AI-assisted goal planning service integration | AI returns editable milestones and steps |
| M7.3 | not-started | Add AI safety, fallback, and failure UX | Users receive clear recovery paths on failure |
| M7.4 | not-started | Instrument premium funnel from upgrade to activation | Conversion analytics captured end-to-end |

### M8 - Quality, Security, and Compliance
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M8.1 | not-started | Expand automated tests for critical user journeys | Core flows covered by stable tests |
| M8.2 | not-started | Perform security hardening and secret management audit | No secrets exposed and auth flows validated |
| M8.3 | not-started | Add analytics dashboards and operational alerts | Product and reliability telemetry available |
| M8.4 | not-started | Finalize legal copy (privacy policy, terms, disclosures) | Store-compliant legal docs available |

### M9 - Monetization Readiness
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M9.1 | not-started | Configure subscription products for iOS and Android | Products testable in sandbox environments |
| M9.2 | not-started | Build paywall UX and entitlement restoration flows | Purchase, restore, and cancel paths validated |
| M9.3 | not-started | Validate regional pricing and trial strategy | Pricing matrix approved for launch markets |

### M10 - Release and Store Deployment
| Task ID | Status | Description | Exit Criteria |
| --- | --- | --- | --- |
| M10.1 | not-started | Prepare release build pipelines and signing setup | Signed release candidates generated |
| M10.2 | not-started | Complete App Store listing assets and metadata | Apple submission package ready |
| M10.3 | not-started | Complete Google Play listing assets and metadata | Play submission package ready |
| M10.4 | not-started | Run beta testing cycles (TestFlight/Internal Testing) | Critical launch blockers resolved |
| M10.5 | not-started | Submit and publish to both stores | App live in both stores |

## Dependency Order Summary
1. M0 Product definition
2. M1 Foundation and tooling
3. M2 UX foundations
4. M3-M5 Core feature pillars (Calendar, Goals, Notes/Profile)
5. M6 Integrations and interoperability
6. M7 Premium and AI layer
7. M8 Quality, security, compliance
8. M9 Monetization readiness
9. M10 Store release

## Validation Gates Per Milestone
- Functional gate: Acceptance criteria met for milestone exit.
- Quality gate: Required automated and manual checks pass.
- Security gate: No sensitive logging, secrets, or unsafe error handling.
- Product gate: UX and copy align with product brief.

## Immediate Next Steps
1. Start M1.3 by configuring lint/test/CI baseline.
2. Start M1.4 by creating bottom-tab navigation shell placeholders.
