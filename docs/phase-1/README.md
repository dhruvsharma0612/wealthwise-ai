# Phase 1 — Personal Finance MVP

> The bridge from [Phase 0 discovery](../README.md) to a buildable product. These documents are still **business-level** — they describe *what* to build and *why*, not *how*. No code, APIs, schemas, or technology choices.

## Theme
**The user manages their own money — and understands it.**

Phase 1 proves the core promise of WealthWise: a person can see, understand, and start improving their finances entirely on their own, with AI explaining what the numbers mean. See [Roadmap → Phase 1](../roadmap.md#phase-1--personal-finance-mvp).

## What's in this folder

| Document | Purpose |
|---|---|
| [prd.md](prd.md) | Product Requirements — goals, scope, requirements, success criteria for the MVP |
| [user-stories.md](user-stories.md) | User stories with acceptance criteria, grouped by epic |
| [ux-flows.md](ux-flows.md) | The core journeys at a flow level (no visual design) |

## Scope at a glance (the Must-Haves)
Authentication · User Profiles · Income · Expenses · Budgeting · Savings · Goals · Dashboard · **AI Explanation** · Reports · Notifications.

Full backlog priority context: [WealthWise Bible → Prioritized Backlog](../wealthwise-bible.md#prioritized-feature-backlog).

## Guardrails carried from Phase 0
Every Phase 1 feature honors the [Business Rules](../business-rules.md). The ones most relevant here:
- All numbers come from the Finance Engine ([BR-05](../business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)).
- AI reads from the Finance Engine and never computes money or transacts ([BR-01](../business-rules.md#br-01--ai-never-executes-financial-transactions), [BR-06](../business-rules.md)).
- Every AI explanation is explainable in plain language ([BR-03](../business-rules.md#br-03--every-recommendation-must-be-explainable)).
- The user owns their data and can export it ([BR-07](../business-rules.md#br-07--users-own-their-financial-data), [BR-11](../business-rules.md)).

## Out of scope for Phase 1
Advisors, agencies, messaging, meetings (Phase 2); investments, insurance, retirement, tax (Phase 3); AI agents, community, white-label (Phase 4). The platform is **single-user, self-directed, AI-explained** in Phase 1.
