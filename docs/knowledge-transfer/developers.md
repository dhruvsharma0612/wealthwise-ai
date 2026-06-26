# Knowledge Transfer: Developers

> For engineers building WealthWise. This is product context, not technical spec — no code, APIs, or technology here (those come in later phases).

## What is WealthWise?
An AI-powered financial ecosystem offering an [independence spectrum](../platform-overview.md#the-independence-spectrum): self-directed, AI-guided, advisor-assisted, or agency-managed. You're building a trusted financial home, not just a CRUD app. See [Platform Overview](../platform-overview.md).

## Why does it exist?
To help people understand and improve their finances — alone, with AI, or with humans — without the platform ever taking control of their money. See [Vision](../vision.md) and [Mission](../mission.md).

## How do you use it (as a developer)?
- **Build from the modules.** Each capability is defined conceptually in [Modules](../modules.md), tagged by [roadmap phase](../roadmap.md).
- **Honor the architecture-shaping rules** even before any tech is chosen:
  - The **Finance Engine is the single source of truth** — every number comes from it ([BR-05](../business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)).
  - **AI reads from the Finance Engine; it never computes money** ([BR-06](../business-rules.md)).
  - **AI never executes transactions** ([BR-01](../business-rules.md#br-01--ai-never-executes-financial-transactions)).
  - **Data ownership and isolation** are structural, not optional ([BR-07](../business-rules.md#br-07--users-own-their-financial-data), [BR-09](../business-rules.md#br-09--agencies-cannot-access-another-agencys-data)).
- **Respect the [Organization Model](../organization-model.md) and [Roles](../roles.md)** — least privilege, scoped access, auditability.

## What are your responsibilities?
- Build the **right** thing — use this documentation to understand the *why*, so judgment calls align with intent.
- Treat **business rules as hard constraints** on whatever you build. A feature that violates one is wrong, however elegant.
- Bake in **security, privacy, and explainability** from the start ([Principles](../principles.md)) — they're not retrofittable.
- Surface conflicts: if a requirement clashes with a business rule, raise it; rules are changed deliberately, never quietly bypassed.

## What value do you receive?
- Clear requirements and a stable set of decisions, reducing rework.
- A shared mental model so the whole team builds coherently across phases.
- Meaningful work: a product where correctness and trust genuinely matter.

## Mental model to keep
```
Identity/Profiles → Finance Engine (source of truth) → Insight/AI (read-only on money) → Human network (scoped, isolated)
```
Everything depends on identity; all numbers come from the Finance Engine; AI explains but never calculates or transacts; humans get scoped, isolated, auditable access.

## Where to go next
[Modules](../modules.md) · [Business Rules](../business-rules.md) · [Organization Model](../organization-model.md) · [Roles](../roles.md) · [WealthWise Bible](../wealthwise-bible.md)
