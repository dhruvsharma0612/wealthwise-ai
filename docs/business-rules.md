# Business Rules

Business rules are the **non-negotiable constraints** WealthWise must always honor. They are not features or preferences — they are the boundaries that keep the product trustworthy, safe, and true to its [Principles](principles.md). Every feature, in every phase, must respect these rules.

This document states the rules at a **business level**. It does not specify implementation.

---

## How to read these rules

Each rule has an ID for reference (e.g., `BR-01`), a statement, and the reasoning behind it. When a proposed feature conflicts with a business rule, the rule wins — or the rule is formally revisited, never quietly ignored.

---

## AI & automation rules

### BR-01 — AI never executes financial transactions
AI (the AI Coach, and future AI Agents) must **never** move money, execute trades, or commit the user to a financial transaction on its own.
**Why:** Finance is high-stakes; automated money movement without human confirmation is unacceptable risk. The platform does not transact on users' behalf, and AI especially does not.

### BR-02 — AI assists; it does not replace human advisors
AI augments both users and professionals but does not substitute for the human advisor relationship, and it defers to qualified humans for regulated advice and complex judgment.
**Why:** The product promise is human + AI collaboration, not AI replacement.

### BR-03 — Every recommendation must be explainable
Any recommendation, nudge, or insight — from AI or surfaced by the platform — must come with a clear, plain-language reason the user can understand and audit.
**Why:** No black boxes in finance. Explainability is the basis of trust and the user's ability to make informed decisions.

### BR-04 — Future AI Agents act only within explicit, revocable permissions
Any automated agent operates strictly inside permissions the user has explicitly granted, with full auditability, and can be revoked at any time. Agents still never move money without human-confirmed authorization (see BR-01).
**Why:** Automation must never outrun consent or accountability.

---

## Finance Engine rules

### BR-05 — All financial calculations come only from the Finance Engine
Every number shown anywhere — dashboards, reports, AI explanations, advisor views — originates from the single Finance Engine source of truth. No module (including AI) computes financial figures independently.
**Why:** One source of truth prevents inconsistency and error in a domain where wrong numbers are dangerous.

### BR-06 — AI reads from the Finance Engine; it does not compute money itself
AI explains, summarizes, and coaches based on Finance Engine outputs. It does not invent or independently calculate the user's financial figures.
**Why:** Keeps numbers consistent and auditable (supports BR-05) and prevents AI hallucination of financial facts.

---

## Data ownership & privacy rules

### BR-07 — Users own their financial data
The user (client) owns their financial data at all times. Advisors, agencies, and the platform are granted access — they never own it.
**Why:** Ownership is the foundation of trust and the user's control over their financial life.

### BR-08 — Data access is explicit, scoped, revocable, and auditable
Any access to a user's data by a professional or the platform must be explicitly granted, limited to what's needed, revocable by the user, and recorded.
**Why:** Least-privilege access and accountability protect users and the ecosystem.

### BR-09 — Agencies cannot access another agency's data
Strict isolation: one agency can never see another agency's clients or data, under any circumstances.
**Why:** Multi-tenant trust depends on absolute isolation between firms.

### BR-10 — Privacy is mandatory, not optional
Privacy protections apply by default to all users. The business will not monetize in ways that compromise user privacy.
**Why:** Trust is the product's core asset; privacy is its precondition.

### BR-11 — Users can export and take their data with them
A user can obtain their data and leave; switching advisors, agencies, or leaving the platform never strands their data.
**Why:** No lock-in; ownership (BR-07) is meaningful only if data is portable.

---

## Trust, conduct & verification rules

### BR-12 — Advisors and agencies are verified before serving clients
No professional or firm is exposed to clients before verification of credentials and standing.
**Why:** Trust must be earned before access; protects users from bad actors.

### BR-13 — Trust is a product principle and a hard requirement
Decisions that would erode user trust for short-term gain are not permitted.
**Why:** Trust compounds; once lost in finance, it rarely returns.

### BR-14 — Ratings and reviews reflect genuine experience
Reputation signals must be protected against manipulation and reflect real client experiences.
**Why:** The marketplace only works if reputation is honest.

---

## Boundaries of advice rules

### BR-15 — Education, guidance, and regulated advice are distinguished
The platform clearly separates general education, AI/coaching guidance, and regulated financial advice (which requires a qualified human within applicable rules).
**Why:** Regulatory compliance and user safety; users must know what kind of help they're getting.

### BR-16 — The platform operates within applicable regulation in each market
Features respect the financial and data regulations of the jurisdictions they serve.
**Why:** A financial platform that ignores regulation cannot be trusted or sustained.

---

## User control rules

### BR-17 — The user always chooses their level of help
Self-directed, AI-guided, advisor-assisted, or agency-managed — the user decides and can change at any time.
**Why:** Choice and control are the defining promise of WealthWise.

### BR-18 — No surprise actions on the user's behalf
Nothing financially consequential happens without the user's awareness and, where material, explicit confirmation.
**Why:** Users must always feel — and be — in control.

---

## Applying the rules

- **Product/Design:** Every spec is checked against these rules before build.
- **Engineering/AI:** These rules are constraints on architecture and model behavior, even though this document names no technology.
- **Compliance/Support:** These rules are the baseline for what is and isn't allowed.
- **Governance:** Changing a business rule is a deliberate, documented decision — never an accident.

Related: [Principles](principles.md) (the values behind these rules) and [Risks](risks.md) (what happens if a rule is violated).
