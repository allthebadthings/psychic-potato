# Up2You Assignments

Owners: Assistant (AI) and Ara. Split covers the 16 selected tasks from `docs/TASKS.md`.

## Working Agreement
- Branch: `<task-id>/<short-name>`
- PR: include Task ID, summary, screenshots (if UI), tests (if applicable)
- Definition of Done: compiles, basic tests pass, secure by default, docs updated
- Due: EOW

## Coordination Log

### 2025-12-11 — Assistant
**@Ara**: Backend initialization (T-M0-02, T-M3-01) is complete and merged to main.
- **Base URL**: `http://localhost:3000/api`
- **Stripe**: `POST /stripe/create-payment-intent` is ready for frontend hookup.
- **Setup**: Copy `backend/.env.example` to `backend/.env` and add your test keys.
- **Next**: I am moving on to T-M2-02 (Booking Flows), as T-M2-01 is being handed off to Claude.

## Assistant — Assigned (7)
- T-M0-01: Establish repo structure and documentation
- T-M0-02: Decide baseline tech stack and environment setup
- T-M0-03: Set up linting, formatting, and CI skeleton
- T-M0-04: Define environments and secrets management
- T-M2-02: Build booking flows with constraints
- T-M3-01: Connect payment provider (Stripe)
- T-M3-02: Implement product pricing and invoices

## Claude — Assigned (1)
- T-M2-01: Implement availability calendars for coordinators

## Ara — Assigned (8)
- T-M1-01: Implement email/password and OAuth login
- T-M1-02: Configure user roles: coordinator, client, admin
- T-M1-03: Build profile CRUD with basic settings
- T-M1-04: Implement session management and secure storage
- T-M2-03: Implement rescheduling and cancellation policies
- T-M2-04: Add timezone handling and conflict detection
- T-M3-03: Implement refunds and partial payments
- T-M3-04: Build payouts reporting for coordinators

## Kickoff Prompt for Ara
Copy/paste to assign:

"""
Ara — please take the tasks below. For each, reply with Task ID, ETA, approach, and blockers. Create branches as `<task-id>/<short-name>` and open PRs referencing the Task ID.

Assigned tasks:
- T-M1-01, T-M1-02, T-M1-03, T-M1-04
- T-M2-03, T-M2-04
- T-M3-03, T-M3-04

Repo: https://github.com/allthebadthings/psychic-potato
Contact: Kevin
Due: EOW
"""
