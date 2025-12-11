# Up2You Master Task List

This breaks the roadmap into assignable units with IDs. Use IDs when distributing, tracking, and creating branches/PRs. Priorities reflect delivery order; adjust as needed.

| ID | Milestone | Title | Priority |
|---|---|---|---|
| T-M0-01 | M0 | Establish repo structure and documentation | High |
| T-M0-02 | M0 | Decide baseline tech stack and environment setup | High |
| T-M0-03 | M0 | Set up linting, formatting, and CI skeleton | High |
| T-M0-04 | M0 | Define environments and secrets management | High |
| T-M1-01 | M1 | Implement email/password and OAuth login | High |
| T-M1-02 | M1 | Configure user roles: coordinator, client, admin | High |
| T-M1-03 | M1 | Build profile CRUD with basic settings | High |
| T-M1-04 | M1 | Implement session management and secure storage | High |
| T-M2-01 | M2 | Implement availability calendars for coordinators | Medium |
| T-M2-02 | M2 | Build booking flows with constraints | Medium |
| T-M2-03 | M2 | Implement rescheduling and cancellation policies | Medium |
| T-M2-04 | M2 | Add timezone handling and conflict detection | Medium |
| T-M3-01 | M3 | Connect payment provider (Stripe) | High |
| T-M3-02 | M3 | Implement product pricing and invoices | Medium |
| T-M3-03 | M3 | Implement refunds and partial payments | Medium |
| T-M3-04 | M3 | Build payouts reporting for coordinators | Medium |
| T-M4-01 | M4 | Implement email and in-app notifications | Medium |
| T-M4-02 | M4 | Create message templates and audit trail | Medium |
| T-M4-03 | M4 | Add webhooks for external events | Medium |
| T-M4-04 | M4 | Build notification preferences per user | Low |
| T-M5-01 | M5 | Build dashboards: bookings, revenue, churn | Medium |
| T-M5-02 | M5 | Implement export data (CSV) | Low |
| T-M5-03 | M5 | Admin controls: users, roles, flags | Medium |
| T-M5-04 | M5 | Add system health and logs | Medium |
| T-B-01 | Backlog | Mobile-friendly layout for key flows | Medium |
| T-B-02 | Backlog | Multi-language support (EN first) | Low |
| T-B-03 | Backlog | Access logs and IP allow/deny lists | Medium |
| T-B-04 | Backlog | Data retention policies and backups | High |
| T-B-05 | Backlog | Error tracking and performance monitoring | High |
| T-B-06 | Backlog | Role-based feature gates | Low |
| T-B-07 | Backlog | Import existing contacts and schedules (CSV) | Low |
| T-B-08 | Backlog | API keys for third-party integrations | Low |

## Milestone M0 — Foundation & Bootstrap
- T-M0-01: Establish repo structure and documentation
- T-M0-02: Decide baseline tech stack and environment setup
- T-M0-03: Set up linting, formatting, and CI skeleton
- T-M0-04: Define environments and secrets management

## Milestone M1 — Authentication & Profiles
- T-M1-01: Implement email/password and OAuth login
- T-M1-02: Configure user roles: coordinator, client, admin
- T-M1-03: Build profile CRUD with basic settings
- T-M1-04: Implement session management and secure storage

## Milestone M2 — Scheduling Core
- T-M2-01: Implement availability calendars for coordinators
- T-M2-02: Build booking flows with constraints
- T-M2-03: Implement rescheduling and cancellation policies
- T-M2-04: Add timezone handling and conflict detection

## Milestone M3 — Payments
- T-M3-01: Connect payment provider (Stripe)
- T-M3-02: Implement product pricing and invoices
- T-M3-03: Implement refunds and partial payments
- T-M3-04: Build payouts reporting for coordinators

## Milestone M4 — Communications
- T-M4-01: Implement email and in-app notifications
- T-M4-02: Create message templates and audit trail
- T-M4-03: Add webhooks for external events
- T-M4-04: Build notification preferences per user

## Milestone M5 — Insights & Admin
- T-M5-01: Build dashboards: bookings, revenue, churn
- T-M5-02: Implement export data (CSV)
- T-M5-03: Admin controls: users, roles, flags
- T-M5-04: Add system health and logs

## Backlog
- T-B-01: Mobile-friendly layout for key flows
- T-B-02: Multi-language support (EN first)
- T-B-03: Access logs and IP allow/deny lists
- T-B-04: Data retention policies and backups
- T-B-05: Error tracking and performance monitoring
- T-B-06: Role-based feature gates
- T-B-07: Import existing contacts and schedules (CSV)
- T-B-08: API keys for third-party integrations

---

# Distribution Prompt (Half of Tasks)

Copy and paste the following when assigning work:

"""
Team — we’re kicking off Up2You delivery. Please claim one task below and reply with: Task ID, ETA, approach, and blockers. Create a branch named `<task-id>/<short-name>` and open a PR with the same Task ID in the title.

Scope: implement minimally viable, testable increments. Prefer clarity, security, and observability.

Selected tasks (16 of 32):
- T-M0-01: Establish repo structure and documentation
- T-M0-02: Decide baseline tech stack and environment setup
- T-M0-03: Set up linting, formatting, and CI skeleton
- T-M0-04: Define environments and secrets management
- T-M1-01: Implement email/password and OAuth login
- T-M1-02: Configure user roles: coordinator, client, admin
- T-M1-03: Build profile CRUD with basic settings
- T-M1-04: Implement session management and secure storage
- T-M2-01: Implement availability calendars for coordinators
- T-M2-02: Build booking flows with constraints
- T-M2-03: Implement rescheduling and cancellation policies
- T-M2-04: Add timezone handling and conflict detection
- T-M3-01: Connect payment provider (Stripe)
- T-M3-02: Implement product pricing and invoices
- T-M3-03: Implement refunds and partial payments
- T-M3-04: Build payouts reporting for coordinators

Process:
- Branch: `<task-id>/<short-name>`
- PR: Include Task ID, summary, screenshots (if UI), tests (if applicable)
- Definition of Done: code compiles, basic tests pass, secure by default, docs updated

Context:
- Repo: https://github.com/allthebadthings/psychic-potato
- Contact: Kevin
- Due: EOW
"""
