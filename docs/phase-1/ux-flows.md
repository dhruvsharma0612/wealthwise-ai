# Phase 1 UX Flows

> The core journeys at a **flow level** — the sequence of steps and decisions, not visual design. Designers turn these into wireframes and screens (see [Designers guide](../knowledge-transfer/designers.md)). No code or technology here.

Each flow lists the steps, key decision points, and the [business rules](../business-rules.md) it must honor.

---

## Flow 1 — First-run onboarding (sign-up → useful dashboard)

```
Start
  → Create account (secure)
  → Welcome / what to expect
  → Profile basics (name, situation context)
  → State first goal  ──(can skip)──►
  → Coaching preference (encouraging / concise)
  → Capture first income  ──(can skip)──►
  → Capture first expense ──(can skip)──►
  → Land on Dashboard (populated, or with gentle prompts to add data)
End
```
- **Decision:** how much to enter now vs. later — onboarding must reach a useful dashboard even with minimal input (PRD G1, A4).
- **Honors:** privacy explained up front ([BR-10](../business-rules.md#br-10--privacy-is-mandatory-not-optional)); user owns data ([BR-07](../business-rules.md)); no overwhelm ([Accessibility](../principles.md)).

---

## Flow 2 — Record income / expense

```
Dashboard (or quick-add)
  → Choose income or expense
  → Enter amount, category, date
  → (Optional) mark recurring
  → Save
  → Confirmation + dashboard updates immediately
```
- **Decision:** one-off vs. recurring; which category.
- **Honors:** entry feeds the Finance Engine as source of truth ([BR-05](../business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)); immediate, consistent feedback.

---

## Flow 3 — Set up and monitor a budget

```
Budget section
  → Choose period
  → Allocate amounts to categories
  → Save budget
  → Monitor: each category shows budgeted vs. actual
  → Approaching/over limit → notification (Flow 6)
  → Adjust budget as needed
```
- **Decision:** allocation per category; adjust when life changes.
- **Honors:** adapts to real income/expenses; alerts are controllable (no surprises, [BR-18](../business-rules.md)).

---

## Flow 4 — Create and track a goal

```
Goals section
  → Create goal (name, target amount, target date)
  → See required saving pace + on-track status
  → Attribute savings to the goal (Flow ties to Savings)
  → Track progress over time
  → Milestone reached → celebratory notification
  → Goal complete → mark done / archive
```
- **Decision:** target amount/date; how to pace; which savings count toward it.
- **Honors:** progress is real (tied to actual savings); motivating, not pressuring.

---

## Flow 5 — Understand with AI explanation

```
Dashboard
  → "Explain my situation" (or ask a question)
  → AI reads figures from the Finance Engine
  → AI returns a plain-language explanation
  → User can ask "why?" / follow up
  → (If user asks AI to act on money) → AI declines and explains its boundary
```
- **Decision:** what to ask; how deep to go.
- **Honors:** AI reads, never computes money ([BR-06](../business-rules.md)); never transacts ([BR-01](../business-rules.md#br-01--ai-never-executes-financial-transactions)); always explainable ([BR-03](../business-rules.md#br-03--every-recommendation-must-be-explainable)); clearly labeled as AI; defers to humans for regulated advice ([BR-15](../business-rules.md)).

---

## Flow 6 — Receive and manage notifications

```
Event occurs (bill due / budget threshold / goal milestone / unusual spend)
  → Notification delivered per user preferences
  → User taps → relevant screen (budget, goal, transaction)
  → User can adjust notification settings anytime
```
- **Decision:** which notifications matter; frequency; on/off.
- **Honors:** relevant not noisy; user in control ([Accessibility](../principles.md), [BR-18](../business-rules.md)).

---

## Flow 7 — Generate and export a report

```
Reports section
  → Choose period
  → Generate summary (income, spending, savings, budget, goals)
  → Review (numbers match the dashboard)
  → Export / share
```
- **Honors:** report numbers come from the Finance Engine ([BR-05](../business-rules.md)); clear and trustworthy.

---

## Flow 8 — Own and leave with my data

```
Settings / Data
  → Export my data
  → (Optional) delete account → clear explanation of consequences → confirm
```
- **Honors:** data ownership and portability ([BR-07](../business-rules.md#br-07--users-own-their-financial-data), [BR-11](../business-rules.md)); no lock-in ([User First](../principles.md)).

---

## Flow design principles (applied throughout)
- **Progressive disclosure:** never force complexity; reveal depth on demand.
- **Immediate feedback:** every capture updates the picture at once.
- **Plain language:** no jargon without explanation.
- **Always answerable "why?":** any suggestion can be understood.
- **No surprises:** nothing financially consequential happens without the user's awareness.

These flows are inputs to wireframing; the [Designers guide](../knowledge-transfer/designers.md) and [Personas](../personas.md) calibrate tone and depth per user.
