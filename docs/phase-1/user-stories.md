# Phase 1 User Stories

> User stories with acceptance criteria for the [Personal Finance MVP](prd.md). Grouped by epic. Business-level — no implementation detail.

**Format:** `As a [user], I want [capability], so that [value].` Each story has acceptance criteria (AC) and a stable ID. Stories trace back to PRD requirements (e.g., `R3.1`).

**Priority:** `[M]` Must (MVP), `[S]` Should (include if capacity allows in Phase 1).

---

## Epic A — Account & onboarding

### A1 `[M]` Create an account — *(R1.1)*
As a new user, I want to create an account securely, so that my financial data is private and protected.
- AC1: I can sign up and am told clearly how my data is protected.
- AC2: I cannot proceed without meeting basic security requirements.
- AC3: On success, I land in onboarding.

### A2 `[M]` Sign in and out — *(R1.1, R1.4)*
As a returning user, I want to sign in and out safely, so that only I can access my finances.
- AC1: I can sign in with my credentials.
- AC2: I can sign out, ending my session.
- AC3: My session expires safely after inactivity.

### A3 `[M]` Recover access — *(R1.3)*
As a user who lost access, I want to recover my account, so that I don't lose my financial history.
- AC1: I can initiate recovery through a secure process.
- AC2: Recovery does not expose my data to anyone else.

### A4 `[M]` Set up my profile — *(R2.1, R2.2)*
As a new user, I want to set up my profile and goals during onboarding, so that the experience is personalized to me.
- AC1: I can enter basic details and financial context.
- AC2: I can state at least one initial goal and my coaching preference.
- AC3: I can skip optional steps and complete them later.
- AC4: Onboarding ends at a useful dashboard, even with minimal input.

### A5 `[M]` Manage my data — *(R2.3, R2.4, CC2)*
As a user, I want to edit, export, and delete my data, so that I stay in control and own it.
- AC1: I can edit my profile anytime.
- AC2: I can export my data.
- AC3: I can delete my account/data, and I'm told what that means.

---

## Epic B — Capture income & expenses

### B1 `[M]` Record income — *(R3.1, R3.2)*
As a user, I want to record my income, so that my financial picture is complete.
- AC1: I can add income with amount, source/category, and date.
- AC2: I can see total income for a period.
- AC3: The entry immediately updates the dashboard.

### B2 `[M]` Record recurring income — *(R3.1, R3.3)*
As a salaried user, I want to mark income as recurring, so that I don't re-enter it each period.
- AC1: I can set income to recur on a schedule.
- AC2: I can edit/stop a recurring income.

### B3 `[S]` Handle irregular income — *(R3.3)*
As a user with variable income, I want to capture irregular amounts/timing, so that my picture stays accurate.
- AC1: I can record income that varies in amount and timing.
- AC2: Budgeting and dashboard handle variable income gracefully.

### B4 `[M]` Record an expense — *(R4.1, R4.4)*
As a user, I want to record expenses, so that I know where my money goes.
- AC1: I can add an expense with category, amount, and date.
- AC2: I can edit or delete an expense.
- AC3: The dashboard updates immediately.

### B5 `[M]` Mark recurring expenses — *(R4.2)*
As a user, I want to flag recurring expenses, so that bills are anticipated.
- AC1: I can set an expense to recur.
- AC2: Recurring expenses are reflected in budgets and notifications.

### B6 `[M]` See where money goes — *(R4.3)*
As a user, I want to see spending by category over time, so that I can spot patterns and leaks.
- AC1: I can view spending broken down by category.
- AC2: I can view spending over a chosen period.

---

## Epic C — Plan & act

### C1 `[M]` Set a budget — *(R5.1)*
As a user, I want to set a budget across categories, so that I spend intentionally.
- AC1: I can allocate amounts to categories for a period.
- AC2: I can edit my budget.

### C2 `[M]` Track budget vs. actual — *(R5.2)*
As a user, I want to see actual spending against my budget, so that I know if I'm on track.
- AC1: Each category shows budgeted vs. actual.
- AC2: Over/under status is clear at a glance.

### C3 `[M]` Get budget alerts — *(R5.3, R11.1)*
As a user, I want to be alerted near/over a budget limit, so that I can adjust in time.
- AC1: I'm notified as I approach a category limit.
- AC2: I'm notified when I exceed it.
- AC3: I can control these alerts (Epic E).

### C4 `[M]` Track savings — *(R6.1, R6.2)*
As a user, I want to track my savings and savings rate, so that I can see progress.
- AC1: I can record/track savings.
- AC2: I can see my savings rate and trend over time.

### C5 `[M]` Create a goal — *(R7.1)*
As a user, I want to create a financial goal, so that I have something concrete to work toward.
- AC1: I can create a goal with name, target amount, and target date.
- AC2: I can create more than one goal.

### C6 `[M]` Track goal progress — *(R7.2, R7.3)*
As a user, I want to see progress toward each goal, so that I stay motivated and know my pace.
- AC1: Each goal shows progress and whether I'm on track.
- AC2: I can see the saving pace needed to hit the target date.

### C7 `[M]` Connect savings to goals — *(R6.3)*
As a user, I want my savings to count toward goals, so that progress is real, not abstract.
- AC1: I can attribute savings to a goal.
- AC2: Goal progress reflects attributed savings.

### C8 `[S]` Manage goals over their life — *(R7.4)*
As a user, I want to edit, complete, or remove goals, so that my goals reflect my real life.
- AC1: I can edit a goal's details.
- AC2: I can mark a goal complete and celebrate it.
- AC3: I can remove a goal.

---

## Epic D — Understand (dashboard, AI, reports)

### D1 `[M]` See my financial picture — *(R8.1, R8.2, R8.3)*
As a user, I want a single dashboard of my finances, so that I understand my situation at a glance.
- AC1: The dashboard shows income, spending, savings, budget status, and goal progress.
- AC2: It's the default view after sign-in.
- AC3: All numbers are consistent (one source of truth).

### D2 `[M]` Ask AI to explain my situation — *(R9.1, R9.2, R9.3)*
As a user, I want the AI to explain my finances in plain language, so that I actually understand them.
- AC1: I can ask the AI to explain my situation.
- AC2: The explanation uses my real figures (read from the Finance Engine).
- AC3: The explanation is in plain language I can understand.
- AC4: I can always see *why* — the reasoning is clear.

### D3 `[M]` Trust the AI's boundaries — *(R9.4, R9.5)*
As a user, I want assurance the AI won't act on my money, so that I can trust it.
- AC1: The AI is clearly labeled as AI, never posing as a human.
- AC2: The AI never executes a transaction or moves money.
- AC3: The AI defers to qualified humans for regulated advice rather than overstepping.

### D4 `[S]` AI that fits me — *(R9.6)*
As a user, I want the AI's tone to suit me, so that it feels helpful, not generic.
- AC1: Beginners get encouraging, jargon-free explanations.
- AC2: Confident users can get concise, direct explanations.

### D5 `[M]` Get a periodic report — *(R10.1, R10.2, R10.3)*
As a user, I want a periodic financial summary, so that I can review and share my progress.
- AC1: I can generate a summary for a period (e.g., monthly).
- AC2: The report is clear and exportable.
- AC3: Report numbers match the dashboard (one source of truth).

---

## Epic E — Stay engaged (notifications)

### E1 `[M]` Get timely nudges — *(R11.1)*
As a user, I want timely reminders and nudges, so that I stay on top of my money.
- AC1: I'm nudged for relevant events (bill due, budget threshold, goal milestone, unusual spend).
- AC2: Nudges are relevant and not noisy.

### E2 `[M]` Control my notifications — *(R11.2, R11.3)*
As a user, I want to control notifications, so that I'm informed but not overwhelmed.
- AC1: I can choose which notifications I receive.
- AC2: I can adjust frequency.
- AC3: I can turn them off.

---

## Traceability summary

| Epic | Covers PRD requirements |
|---|---|
| A — Account & onboarding | R1.x, R2.x |
| B — Capture income & expenses | R3.x, R4.x |
| C — Plan & act | R5.x, R6.x, R7.x |
| D — Understand | R8.x, R9.x, R10.x |
| E — Stay engaged | R11.x |

Cross-cutting requirements (CC1–CC6) apply to **all** stories — every story must honor the single-source-of-truth, privacy/ownership, explainability, accessibility, security, and no-surprise-actions guarantees from the [PRD](prd.md#6-cross-cutting-requirements).
