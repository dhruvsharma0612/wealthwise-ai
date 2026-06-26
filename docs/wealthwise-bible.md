# THE WEALTHWISE BIBLE

> **The single source of truth for WealthWise.** When any other document disagrees with this one, this one wins. Everything in [`/docs`](README.md) expands on a section here.

---

## Table of contents
1. [Elevator Pitch](#elevator-pitch)
2. [Vision Statement](#vision-statement)
3. [Mission Statement](#mission-statement)
4. [Product Story](#product-story)
5. [Core Terminology](#core-terminology)
6. [Product Glossary](#product-glossary)
7. [Guiding Principles](#guiding-principles)
8. [User Journey Summary](#user-journey-summary)
9. [Stakeholder Summary](#stakeholder-summary)
10. [Future Vision (5–10 years)](#future-vision-510-years)
11. [Frequently Asked Questions](#frequently-asked-questions)
12. [Assumptions](#assumptions)
13. [Out of Scope](#out-of-scope)
14. [Feature Dependency Map](#feature-dependency-map)
15. [Prioritized Feature Backlog](#prioritized-feature-backlog)
16. [Product Naming Conventions](#product-naming-conventions)
17. [Documentation Standards](#documentation-standards)

---

## Elevator Pitch

> **WealthWise is an AI-powered financial ecosystem — the operating system for personal finance.** It lets anyone see, understand, and grow their money on their own, with an explainable AI coach, or with verified human advisors and agencies. The user always chooses their level of help. AI assists people; it never moves their money and never replaces their advisor. One trusted home for your entire financial life.

---

## Vision Statement

> **To become the operating system for personal finance — a single, trusted ecosystem where every person can understand, plan, and grow their money, choosing freely between doing it themselves, being guided by AI, or working with verified human experts.**

Full detail: [Vision](vision.md).

---

## Mission Statement

> **We help people make confident financial decisions every day by combining simple personal-finance tools, explainable AI guidance, and trustworthy access to human experts — without ever taking control of their money away from them.**

Full detail: [Mission](mission.md).

---

## Product Story

Once, managing money meant a shoebox of receipts and an annual visit to a banker. Then came apps — dozens of them. A banking app here, a budgeting app there, a spreadsheet for goals, a broker, an insurance portal, and, when life got complicated, an advisor found by luck and judged by gut.

The tools multiplied, but the **understanding** didn't. People could see their balance but not their trajectory. They could read advice but not trust it. They could find an advisor but not evaluate one. And the most powerful new tool — AI — arrived without guardrails, ready to confidently say things about money that might be wrong, or worse, to act without permission.

**WealthWise was born from a simple conviction:** people deserve a financial home that is *clear*, *honest*, and *theirs* — one that meets them wherever they are on their journey and gives them a choice about how much help they want.

So we built an ecosystem with four ways in. A student tracks a first paycheck. A young professional asks an AI coach where to start investing. A family connects with a verified advisor to plan for a home. A business owner engages a full agency. **Same platform. Different depth. One source of truth.**

And we drew bright lines that we will never cross: AI explains but never transacts. Every recommendation can be questioned. The user owns their data and can leave with it. Trust isn't a marketing word — it's the architecture.

This is Phase 0: writing it all down, so everyone who builds, sells, designs, advises, and uses WealthWise shares one understanding before a single line of code is written. The rest of the story is the [Roadmap](roadmap.md).

---

## Core Terminology

The handful of terms everyone must know cold:

- **Independence spectrum** — the four ways to use WealthWise: self-directed, AI-guided, advisor-assisted, agency-managed.
- **Finance Engine** — the single source of truth for every financial number.
- **AI Coach** — explainable AI that explains and coaches, but never transacts.
- **Explainability** — every recommendation answers "why?".
- **Data ownership** — the client owns their financial data, always.
- **Data isolation** — one agency can never see another's data.
- **Organization model** — Platform → Agency → Advisor → Client.

---

## Product Glossary

The full glossary lives in its own document: **[Glossary](glossary.md)**. It defines platform, people/role, finance, AI, trust/governance, and roadmap terms. The Bible defers to it for completeness.

---

## Guiding Principles

In priority order (all essential). Full detail: [Principles](principles.md).

1. **Trust** — trust is the product.
2. **Transparency** — no black boxes.
3. **Privacy** — the user's data is theirs.
4. **Security** — safety is foundational.
5. **User First** — the user's interest comes first.
6. **Human + AI Collaboration** — AI assists; humans decide.
7. **Financial Literacy** — we teach, not just track.
8. **Accessibility** — finance for everyone.
9. **Scalability** — built to grow.
10. **Compliance** — we respect the rules of finance.

These are enforced as hard constraints in [Business Rules](business-rules.md).

---

## User Journey Summary

The canonical journey across the [independence spectrum](platform-overview.md#the-independence-spectrum):

```
   ONBOARD → CAPTURE → UNDERSTAND → PLAN → ACT & IMPROVE → (GET HELP) → GROW
      │         │           │         │          │              │          │
   profile   income/     dashboard  budgets/   nudges/      AI coach/   deeper
   & goals   expenses    & AI        goals     progress     advisor/    modules
                         explains                            agency      over time
```

1. **Onboard** — set up profile and goals.
2. **Capture** — record income and expenses; the Finance Engine builds the picture.
3. **Understand** — dashboards, reports, and AI explanations in plain language.
4. **Plan** — budgets, savings, goals.
5. **Act & improve** — nudges, tracking, adjustment.
6. **Get help (optional)** — add AI, an advisor, or an agency at any time.
7. **Grow** — move into investments, insurance, retirement, tax as life evolves.

The user can enter at any step and choose their help level at each one. Persona-specific journeys: [Personas](personas.md).

---

## Stakeholder Summary

Full detail: [Stakeholders](stakeholders.md).

| Stakeholder | Wants in one line |
|---|---|
| Platform Owner / Founders | A durable, trusted, growing financial OS. |
| Product Team | Clear vision and a prioritized backlog that moves the North Star. |
| Developers | Unambiguous requirements and stable rules. |
| Designers | Personas, journeys, principles to design trust and clarity. |
| AI Engineers | Clear, safe boundaries and explainability requirements. |
| Support Team | Product knowledge and escalation paths. |
| Compliance Team | Auditability, privacy, and regulatory boundaries. |
| Investors | A big market, defensible trust-based moat, responsible governance. |
| Individual Users | Understand and improve their money without overwhelm. |
| Premium Users | Deeper insight, planning, and priority help. |
| Financial Advisors | Well-matched clients and less admin. |
| Wealth Agencies | Run and grow a firm with isolation and oversight. |
| Enterprise Clients | Financially healthier people, securely and at scale. |

---

## Future Vision (5–10 years)

- WealthWise is the **default place** people open when they think about money.
- A thriving **ecosystem of advisors and agencies** earns a living on the platform.
- **AI agents**, strictly bounded and supervised, handle routine financial chores with user oversight.
- The platform operates **across multiple countries** with localized compliance.
- A **white-label** version powers banks, employers, and fintechs.
- **Community and learning** make financial literacy mainstream and social.

Throughout, the constants hold: **trust, transparency, privacy, and human + AI collaboration**. See [Roadmap Phase 4](roadmap.md#phase-4--ecosystem--automation).

---

## Frequently Asked Questions

**Is WealthWise a bank?**
No. It does not hold or move money. It helps you understand and plan; it never transacts on your behalf.

**Does the AI invest or move my money?**
Never. AI explains, coaches, and assists — it does not execute transactions ([BR-01](business-rules.md#br-01--ai-never-executes-financial-transactions)).

**Does AI replace human advisors?**
No. AI augments both users and advisors and defers to humans for regulated advice. The human relationship is central ([BR-02](business-rules.md)).

**Who owns my data?**
You do — always. You can grant access to advisors/agencies, revoke it, and export your data ([BR-07](business-rules.md#br-07--users-own-their-financial-data), [BR-11](business-rules.md)).

**Can another agency see my finances?**
No. Strict data isolation makes that impossible ([BR-09](business-rules.md#br-09--agencies-cannot-access-another-agencys-data)).

**Can I use WealthWise entirely on my own?**
Yes. Self-directed use is a first-class path. AI and human help are optional and always your choice.

**What if I want to switch advisors or leave?**
You can, anytime. Access transfers/revokes, and your data stays yours.

**How do I know an advisor is trustworthy?**
Advisors and agencies are verified before serving clients, and you can see transparent profiles and genuine ratings ([Advisor Ecosystem](advisor-ecosystem.md)).

**Is every recommendation explained?**
Yes — no black boxes. You can always ask "why?" ([BR-03](business-rules.md#br-03--every-recommendation-must-be-explainable)).

**How does WealthWise make money?**
Through fair, transparent subscriptions (individual, premium, advisor, agency, enterprise) — never by compromising your privacy ([BR-10](business-rules.md)).

---

## Assumptions

These are the working assumptions Phase 0 rests on; they should be validated as the product develops:

1. People want a single, trusted home for their finances and will consolidate if it earns their trust.
2. A meaningful share of users will pay for premium depth and/or human help.
3. Quality independent advisors and agencies will join a platform that gives them clients and reduces admin.
4. Explainable, bounded AI is both technically feasible and what users actually want.
5. Trust and explainability are durable differentiators, not just features competitors can copy overnight.
6. Regulatory environments, while varied, permit a clearly-bounded education + guidance + (human) advice model.
7. Users will accept staged depth (start simple, grow into complexity) rather than demanding everything at once.

---

## Out of Scope

Explicitly **not** part of WealthWise (now and, for most, by design):

- **Holding, moving, or custodying money** — WealthWise is not a bank, broker, or payment processor.
- **Executing trades or transactions** — including by AI ([BR-01](business-rules.md#br-01--ai-never-executes-financial-transactions)).
- **Automated financial decisions without user awareness/consent** ([BR-18](business-rules.md)).
- **Unexplained "black box" recommendations** ([BR-03](business-rules.md)).
- **Replacing licensed professionals for regulated advice** — humans handle that ([BR-15](business-rules.md)).
- **Selling or monetizing user data in privacy-compromising ways** ([BR-10](business-rules.md)).
- **Phase-0 technology choices** — no APIs, schemas, or stack decisions belong in this documentation set.

---

## Feature Dependency Map

How capabilities depend on one another (conceptual). Arrows mean "depends on."

```
Authentication
   └─> User Profiles
          ├─> Notifications
          └─> FINANCE ENGINE (single source of truth)
                 ├─> Income ──> Expenses ──> Budgeting ──> Savings ──> Goal Planning
                 ├─> Net Worth ──(uses)──> Income, Expenses, Savings, Debt, Investments, Insurance
                 ├─> Emergency Fund ──(uses)──> Income, Expenses, Savings
                 ├─> Debt Management ──(uses)──> Income, Expenses, Budgeting
                 │
                 ├─> INSIGHT
                 │     ├─> Financial Reports
                 │     └─> Analytics
                 │
                 ├─> INTELLIGENCE (reads only; never computes money)
                 │     ├─> AI Coach ──(needs)──> Business Rules
                 │     └─> AI Agents (future) ──(needs)──> AI Coach + permissions + Business Rules
                 │
                 └─> WEALTH PLANNING (Phase 3)
                       ├─> Investment Planning ──> Portfolio Tracking
                       ├─> Insurance
                       ├─> Retirement
                       └─> Tax Planning

HUMAN NETWORK ──(needs)──> Organization Model + Roles + Data Isolation
   ├─> Advisor Marketplace ──> Meetings, Messaging, Document Management
   └─> Agency Portal

OPERATIONS: Admin Portal, Subscriptions ──(span all phases)
ECOSYSTEM (Phase 4): Community, Learning Hub
```

Rules of the map:
- **Everything** depends on Authentication + Profiles.
- **All insight, AI, and human help** depend on the **Finance Engine**.
- **AI** additionally depends on **Business Rules** to stay safe.
- **The human network** depends on the **Organization Model + Roles**.

Module detail: [Modules](modules.md).

---

## Prioritized Feature Backlog

MoSCoW prioritization across the [roadmap](roadmap.md). "Must" = the MVP core; "Future" = later phases.

### Must Have (Phase 1 — Personal Finance MVP)
- Authentication & User Profiles
- Income tracking
- Expense tracking
- Budgeting
- Savings
- Goal planning
- Dashboard (unified financial picture)
- AI Explanation (plain-language explanation of the user's numbers)
- Financial reports
- Notifications

### Should Have (Phase 2 — Human Help & AI Coach)
- Advisor Marketplace
- Agency Portal
- Advisor profiles & verification
- Messaging
- Appointments / Meetings
- AI Coach (interactive coaching)
- Net Worth, Emergency Fund, Debt Management depth

### Could Have (Phase 3 — Wealth Planning Depth)
- Investment planning & portfolio tracking
- Insurance planning
- Retirement planning
- Tax planning
- Family accounts
- Advanced analytics
- Document management

### Future (Phase 4 — Ecosystem & Automation)
- AI Agents (bounded automation)
- Workflow automation
- Enterprise features
- Open APIs
- International expansion
- White-label platform
- Community
- Full Learning Hub

> Priorities are set against personas and [success metrics](success-metrics.md); they move deliberately, not by drift.

---

## Product Naming Conventions

To keep the product and its docs coherent:

- **Product name:** always **WealthWise** (one word, capital W and W). Never "Wealth Wise" or "Wealthwise."
- **Modules:** Title Case, descriptive, conceptual — e.g., **AI Coach**, **Advisor Marketplace**, **Finance Engine**. Avoid technical or trademarked names.
- **Roles:** Title Case and consistent with [Roles](roles.md) — e.g., **Agency Owner**, **Premium Client**.
- **The four help levels:** **self-directed**, **AI-guided**, **advisor-assisted**, **agency-managed** (lowercase in prose).
- **Phases:** **Phase 0–4**, with the theme name — e.g., "Phase 1 — Personal Finance MVP."
- **Business rules:** referenced as **BR-NN** (e.g., BR-01).
- **AI:** describe as "AI Coach" / "AI Agents"; never imply the AI is human, and never describe it as executing transactions.
- **Tone of names:** human, plain, trustworthy — avoid jargon and hype. If a beginner can't guess what it does from the name, reconsider the name.

---

## Documentation Standards

How we keep this knowledge base trustworthy (it's a financial product — even the docs honor the principles):

1. **One source of truth.** This Bible is authoritative; other docs expand on it. Conflicts are resolved in the Bible's favor, then propagated.
2. **Business first, no code.** Phase-0 docs contain no code, APIs, schemas, or technology choices. Every doc explains *why*, *who*, and *value* before *what*.
3. **Plain language.** Anyone — technical or not — can read any page. Define terms in the [Glossary](glossary.md) rather than assuming.
4. **Cross-linked.** Documents link to related documents and to the relevant [business rules](business-rules.md), so the knowledge base is navigable, not siloed.
5. **Living documents.** Each future phase updates the relevant sections in place rather than spawning parallel, divergent docs.
6. **Consistent structure.** Knowledge-transfer guides answer the same five questions; modules answer the same five attributes; rules carry stable IDs.
7. **Honest and current.** Docs reflect reality. When something changes (a rule, a priority), the docs change with it — stale documentation erodes trust like a stale number does.
8. **Markdown, in `/docs`.** All Phase-0 documentation is Markdown, organized as in the [README](README.md).

---

> **This is the WealthWise Bible.** If you read only one document, read this one. If you build, sell, design, advise, or use WealthWise, this is the shared truth you're building on.
