# Phase 1 PRD — Personal Finance MVP

> **Product Requirements Document.** Business-level only — no code, APIs, schemas, or technology choices. This turns [Roadmap Phase 1](../roadmap.md#phase-1--personal-finance-mvp) into something a team can plan and build against.

---

## 1. Summary

Phase 1 delivers a **single-user, self-directed personal finance experience with AI explanation**. A person can capture their income and expenses, set a budget and goals, save toward them, see a unified dashboard, get plain-language AI explanations of their situation, receive reports, and be nudged by notifications.

It deliberately excludes advisors, agencies, and deep wealth planning (later phases). The goal is to prove the **core promise**: clarity + understanding, on the user's own.

---

## 2. Goals & non-goals

### Goals
- G1 — A new user can go from sign-up to a trustworthy view of their finances in one sitting.
- G2 — The user understands *why* their numbers look the way they do (AI explanation).
- G3 — The user can set and track progress toward a budget and at least one goal.
- G4 — The user trusts the platform with sensitive financial data (security, privacy, data ownership).
- G5 — The user forms a habit of returning (notifications, visible progress).

### Non-goals (Phase 1)
- NG1 — No human advisors, agencies, messaging, or meetings (Phase 2).
- NG2 — No investments, insurance, retirement, or tax planning (Phase 3).
- NG3 — No AI that gives prescriptive financial *advice* or executes anything — explanation and light coaching only.
- NG4 — No multi-user / household / family accounts (Phase 3).
- NG5 — No community or marketplace.

---

## 3. Target users

Primarily the self-directed end-user personas from [Personas](../personas.md): the **Student**, **Young Professional**, and the individual side of the **Married Family** and **Parent**. Phase 1 must work for both an anxious beginner and a confident DIY user.

---

## 4. Success criteria

Phase 1 is successful when (aligned to [Success Metrics](../success-metrics.md)):
- **Activation:** a strong share of sign-ups complete onboarding and capture their first financial picture.
- **Understanding:** a meaningful share of active users engage with AI explanations.
- **Outcome signal:** active users show early savings-rate or goal-progress improvement.
- **Retention:** users return on a regular cadence.
- **Trust guardrail:** zero AI transactions, zero unexplained recommendations, no privacy regressions.

---

## 5. Scope — feature requirements

Each feature references its [module](../modules.md). Requirements are written as capabilities, not implementations.

### 5.1 Authentication `(module: Authentication)`
- R1.1 — A person can create an account and securely sign in.
- R1.2 — Sensitive actions are protected appropriately.
- R1.3 — A user can recover access if they lose it.
- R1.4 — Sessions end safely (sign-out, expiry).
- *Guardrail:* security is foundational ([Principles](../principles.md)).

### 5.2 User Profiles `(module: User Profiles)`
- R2.1 — A user can set up a profile: basic details, financial situation context, and preferences.
- R2.2 — A user states initial goals and risk/coaching preferences to personalize the experience.
- R2.3 — A user can edit their profile at any time.
- R2.4 — The user owns this data and can export/delete it ([BR-07](../business-rules.md#br-07--users-own-their-financial-data), [BR-11](../business-rules.md)).

### 5.3 Income tracking `(module: Income)`
- R3.1 — A user can record income, including one-off and recurring.
- R3.2 — A user can categorize income and see total income over a period.
- R3.3 — Irregular income is supported (variable amounts/timing).
- R3.4 — Income feeds the Finance Engine as the source of truth ([BR-05](../business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)).

### 5.4 Expense tracking `(module: Expenses)`
- R4.1 — A user can record expenses with category, amount, and date.
- R4.2 — A user can mark recurring expenses.
- R4.3 — A user can see where money goes (by category, over time).
- R4.4 — A user can edit and delete entries.

### 5.5 Budgeting `(module: Budgeting)`
- R5.1 — A user can set a budget (allocations across categories) for a period.
- R5.2 — A user can see actual spending vs. budget.
- R5.3 — A user is alerted as they approach/exceed a category budget (via notifications).
- R5.4 — Budgets adapt to the user's real income and expenses.

### 5.6 Savings `(module: Savings)`
- R6.1 — A user can record/track savings.
- R6.2 — A user can see their savings rate and trend.
- R6.3 — Savings connect to goals (contributing toward them).

### 5.7 Goal planning `(module: Goal Planning)`
- R7.1 — A user can create a financial goal (name, target amount, target date).
- R7.2 — A user can track progress toward each goal.
- R7.3 — The user can see whether they're on track and what pace is needed.
- R7.4 — A user can edit, complete, or remove goals.

### 5.8 Dashboard `(module spans the Finance Engine + Insight)`
- R8.1 — A unified view shows the user's overall financial picture (income, spending, savings, budget status, goal progress).
- R8.2 — The dashboard is the default landing experience after sign-in.
- R8.3 — All figures come from the Finance Engine (consistency).

### 5.9 AI Explanation `(module: AI Coach — explanation stage)`
- R9.1 — The user can ask the AI to explain their financial situation in plain language.
- R9.2 — Explanations reference real figures *read from the Finance Engine* — the AI never invents or computes numbers ([BR-06](../business-rules.md)).
- R9.3 — Every explanation is understandable and auditable ("why?") ([BR-03](../business-rules.md#br-03--every-recommendation-must-be-explainable)).
- R9.4 — The AI never executes transactions and never gives prescriptive regulated advice ([BR-01](../business-rules.md#br-01--ai-never-executes-financial-transactions), [BR-15](../business-rules.md)).
- R9.5 — The AI is clearly identified as AI, never as a human.
- R9.6 — Tone adapts to the user (encouraging for beginners, concise for confident users).

### 5.10 Financial reports `(module: Financial Reports)`
- R10.1 — A user can generate a periodic summary (e.g., monthly) of their finances.
- R10.2 — Reports are clear, trustworthy, and shareable/exportable.
- R10.3 — Report numbers come from the Finance Engine.

### 5.11 Notifications `(module: Notifications)`
- R11.1 — A user receives timely, relevant nudges (bill due, budget threshold, goal milestone, unusual spend).
- R11.2 — A user controls notification preferences (frequency, type).
- R11.3 — Notifications encourage good habits without overwhelming.

---

## 6. Cross-cutting requirements

- **CC1 — Single source of truth:** every displayed number originates from the Finance Engine ([BR-05](../business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)).
- **CC2 — Privacy & ownership:** mandatory privacy; the user owns and can export their data ([BR-07](../business-rules.md), [BR-10](../business-rules.md#br-10--privacy-is-mandatory-not-optional), [BR-11](../business-rules.md)).
- **CC3 — Explainability:** anything the platform suggests can be understood by the user ([BR-03](../business-rules.md)).
- **CC4 — Accessibility:** works for beginners and power users; plain language; progressive disclosure ([Principles](../principles.md)).
- **CC5 — Security:** sensitive financial data protected from day one.
- **CC6 — No surprise actions:** nothing financially consequential happens without the user's awareness ([BR-18](../business-rules.md)).

---

## 7. Assumptions & dependencies
- Users will manually enter (at minimum) their income and expenses in Phase 1; automatic bank connections are a later enhancement, not an MVP dependency.
- The Finance Engine exists as the single calculation source before AI explanation is built (AI depends on it).
- Phase 0 documentation is the source of vision, rules, and personas this PRD rests on.

## 8. Open questions
- What reporting period(s) are default (monthly vs. user-defined)?
- How much light *coaching* (vs. pure explanation) is in scope for the AI in Phase 1?
- What is the minimum onboarding to reach a useful dashboard (how few inputs)?
- Default budgeting method (category-based vs. flexible)?

*These are resolved before/at the start of build, and the answers are recorded back here.*

---

## 9. Phasing within Phase 1 (suggested build order)
1. Authentication + Profiles (foundation)
2. Income + Expenses (capture → Finance Engine)
3. Dashboard + Reports (make it visible)
4. Budgeting + Savings + Goals (make it actionable)
5. AI Explanation (make it understandable)
6. Notifications (make it sticky)

This order ensures the Finance Engine and data capture exist before the insight, AI, and engagement layers that depend on them.
