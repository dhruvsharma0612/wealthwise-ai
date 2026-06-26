# Glossary

A shared vocabulary so that founders, developers, designers, advisors, agencies, and users mean the same thing by the same words. Terms are grouped for easy scanning. When a term has a dedicated document, it is linked.

---

## Platform & ecosystem terms

**WealthWise** — The AI-powered financial ecosystem described throughout this documentation; aspires to be the "operating system for personal finance."

**Ecosystem** — The full network of users, advisors, agencies, AI, community, and (future) agents and partners that make up WealthWise.

**Operating system for personal finance** — The long-term vision: a single trusted layer that manages a person's complete financial picture and runs financial "applications" on it. See [Vision](vision.md).

**Independence spectrum** — The four ways to use WealthWise: self-directed, AI-guided, advisor-assisted, agency-managed. The user chooses and can move freely. See [Platform Overview](platform-overview.md#the-independence-spectrum).

**Module** — A conceptual capability area of the platform (e.g., Budgeting, AI Coach, Advisor Marketplace). See [Modules](modules.md).

**North Star** — The single guiding measure of success: did the user end up financially better off and understand why? See [Success Metrics](success-metrics.md).

---

## People & roles

**User** — Anyone with a WealthWise account. Often used for end users managing their own money.

**Client** — An end user who is working with an advisor or agency. Always **owns their own financial data**. See [Roles](roles.md).

**Premium Client / Premium User** — A client on a premium subscription with deeper access.

**Advisor** — A verified financial professional, independent or within an agency, who serves clients.

**Independent Advisor** — An advisor operating directly under the platform, not part of an agency.

**Agency** — A wealth-management firm operating on the platform with multiple advisors. See [Organization Model](organization-model.md).

**Agency Owner** — The principal who runs an agency.

**Agency Admin** — Staff who operate an agency on the owner's behalf.

**Platform Super Admin** — The highest-trust platform governance role.

**Platform Admin** — Platform operations role.

**Support Staff** — The team that helps users and resolves issues.

**Enterprise Client** — An organization offering WealthWise (potentially white-labeled) to its employees or customers.

**Stakeholder** — Any party with an interest in WealthWise. See [Stakeholders](stakeholders.md).

**Persona** — A representative archetype of a user, used to ground product decisions. See [Personas](personas.md).

---

## Finance terms

**Finance Engine** — The single source of truth for all financial calculations on the platform. Every number — including anything AI references — comes from here. See [BR-05](business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine).

**Income** — Money coming in; tracked per user.

**Expense** — Money going out; tracked and categorized.

**Budget** — A plan for allocating income across spending and saving.

**Savings** — Money set aside, often toward goals or a buffer.

**Goal** — A financial objective (e.g., a home, education, travel) tracked toward completion.

**Net Worth** — Assets minus liabilities; the clearest single measure of financial health over time.

**Emergency Fund** — A savings buffer for financial shocks; foundation of resilience.

**Debt Management** — Tools and strategy for paying down and managing debt.

**Investment Planning** — Planning and educating around investments (the platform does not execute trades).

**Insurance (planning)** — Protection planning to cover risks.

**Retirement (planning)** — Planning for accumulation and drawdown of retirement resources.

**Tax (planning)** — Planning to manage and anticipate tax (not filing or licensed advice).

**Portfolio Tracking** — Monitoring investment holdings (a future module).

---

## AI terms

**AI Coach** — The AI capability that explains the user's finances in plain language and coaches better habits. Bounded by [business rules](business-rules.md). See [Modules](modules.md#ai-coach).

**AI Explanation** — The Phase 1 entry point of AI: explaining a user's numbers without full coaching.

**AI Agent** — A future, opt-in, strictly bounded automated actor that performs routine financial chores within explicit, revocable permissions. Never moves money without human confirmation. See [Modules](modules.md#ai-agents).

**Explainability** — The requirement that every recommendation can be understood and audited by the user ("no black boxes"). See [BR-03](business-rules.md#br-03--every-recommendation-must-be-explainable).

**Guardrail** — A hard boundary on AI/automation behavior (e.g., never transact). See [Business Rules](business-rules.md).

---

## Trust, access & governance terms

**Data ownership** — The principle that the client owns their financial data at all times. See [BR-07](business-rules.md#br-07--users-own-their-financial-data).

**Data isolation** — Strict separation ensuring one agency can never access another's data. See [BR-09](business-rules.md#br-09--agencies-cannot-access-another-agencys-data).

**Least privilege** — Each role gets only the access it needs, and no more.

**Access grant** — Explicit, scoped, revocable, audited permission a client gives a professional or the platform.

**Verification** — The process of confirming an advisor's or agency's credentials before they serve clients. See [BR-12](business-rules.md#br-12--advisors-and-agencies-are-verified-before-serving-clients).

**Ratings & Reviews** — Genuine client feedback that builds professional reputation. See [Advisor Ecosystem](advisor-ecosystem.md).

**Business rule** — A non-negotiable constraint the product must honor. See [Business Rules](business-rules.md).

**Principle** — A guiding value used to make and resolve decisions. See [Principles](principles.md).

**White-label** — A future offering letting partners run WealthWise under their own brand.

**Onboarding** — The process of bringing a user, advisor, or agency onto the platform. See [Advisor Ecosystem](advisor-ecosystem.md).

**Advisor switching** — A client's ability to change advisors freely, taking their data with them.

---

## Roadmap terms

**Phase 0–4** — The sequential stages of the [Roadmap](roadmap.md): Discovery, Personal Finance MVP, Human Help & AI Coach, Wealth Planning Depth, Ecosystem & Automation.

**MVP** — Minimum Viable Product; the smallest release that delivers the core promise (Phase 1).

**Phase 0** — This documentation and discovery phase.

---

> Add new terms here as the product vocabulary grows. A consistent glossary is part of our [documentation standards](wealthwise-bible.md#documentation-standards).
