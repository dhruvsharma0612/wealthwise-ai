# Modules

This document describes every current and future module of WealthWise **conceptually** — no implementation details, no technology choices. Each module explains:

- **Why it exists**
- **Who uses it**
- **Value delivered**
- **Dependencies**
- **Future possibilities**

Modules are grouped as in the [Platform Overview](platform-overview.md). The roadmap phase where each module is expected appears in brackets — see [Roadmap](roadmap.md).

---

## Foundation

### Authentication `[Phase 1]`
- **Why:** Finance is sensitive; nothing happens until we know securely who someone is and that their access is protected.
- **Who:** Everyone — users, advisors, agency staff, admins.
- **Value:** Trust and safety from the first second; the basis for personalization and data ownership.
- **Dependencies:** None (it is foundational); everything depends on it.
- **Future:** Stronger assurance for higher-risk actions, organization-level access controls, delegated access (e.g., a partner or advisor with permission).

### User Profiles `[Phase 1]`
- **Why:** Guidance is only useful when it fits the person — their situation, goals, risk tolerance, and preferences.
- **Who:** All end users; advisors view client profiles (with permission).
- **Value:** Personalized experience; the context that makes AI and human advice relevant.
- **Dependencies:** Authentication.
- **Future:** Household/family profiles, life-stage detection, richer preference and goal modeling.

### Notifications `[Phase 1]`
- **Why:** Good financial habits depend on timely awareness — a bill due, a goal milestone, an unusual expense.
- **Who:** All users; advisors and agencies for client-related events.
- **Value:** Keeps users engaged and proactive without overwhelming them.
- **Dependencies:** Most modules generate notifications; depends on Profiles for preferences.
- **Future:** Smart, AI-prioritized notifications; channel preferences; quiet hours; advisor-triggered nudges.

---

## Finance Engine

> The Finance Engine is the **single source of truth** for all financial numbers. A core [business rule](business-rules.md): every calculation in the platform — including anything the AI references — originates here.

### Income Tracking `[Phase 1]`
- **Why:** You cannot plan what you cannot see; income is the foundation of every plan.
- **Who:** All end users.
- **Value:** A clear picture of what comes in, including irregular income.
- **Dependencies:** Profiles.
- **Future:** Income forecasting, irregular-income smoothing, multiple income streams, employer integration.

### Expense Tracking `[Phase 1]`
- **Why:** Spending awareness is the single biggest lever for most people's finances.
- **Who:** All end users.
- **Value:** Understand where money goes; spot leaks; enable budgeting.
- **Dependencies:** Income (for context), Profiles.
- **Future:** Auto-categorization, recurring-expense detection, merchant insights, shared/household expenses.

### Budgeting `[Phase 1]`
- **Why:** A budget turns awareness into a plan — intentional allocation of money.
- **Who:** All end users.
- **Value:** Control and confidence; a framework for trade-offs.
- **Dependencies:** Income, Expenses.
- **Future:** Flexible budgeting methods, AI-suggested budgets, adaptive budgets for variable income.

### Savings `[Phase 1]`
- **Why:** Saving is the bridge from income to goals and security.
- **Who:** All end users.
- **Value:** A visible, motivating savings habit.
- **Dependencies:** Income, Expenses, Budgeting.
- **Future:** Automated savings rules, multiple savings buckets, round-ups, savings challenges.

### Goal Planning `[Phase 1]`
- **Why:** Money is a means to ends — a home, education, freedom. Goals give finance purpose.
- **Who:** All end users.
- **Value:** Motivation and direction; progress people can feel.
- **Dependencies:** Savings, Income, Budgeting.
- **Future:** Goal prioritization, trade-off simulation, shared family goals, advisor-assisted goals.

### Net Worth `[Phase 1/2]`
- **Why:** The single clearest measure of financial health over time is net worth (assets minus liabilities).
- **Who:** All end users; advisors for client overviews.
- **Value:** The "big picture" number; long-term progress tracking.
- **Dependencies:** Income, Expenses, Savings, Debt, (later) Investments, Insurance.
- **Future:** Asset/liability aggregation, trend analysis, scenario projections.

### Emergency Fund `[Phase 1/2]`
- **Why:** A safety buffer is the foundation of financial resilience; without it, every shock becomes a crisis.
- **Who:** All end users.
- **Value:** Peace of mind; protection against debt spirals.
- **Dependencies:** Income, Expenses, Savings.
- **Future:** Personalized target sizing, automated buffering, replenishment nudges.

### Debt Management `[Phase 1/2]`
- **Why:** High-interest debt is the biggest drag on most people's wealth; managing it well is transformative.
- **Who:** Users with debt; advisors.
- **Value:** A clear payoff strategy; reduced interest paid; momentum.
- **Dependencies:** Income, Expenses, Budgeting.
- **Future:** Payoff strategy modeling (avalanche/snowball), consolidation guidance, advisor collaboration.

---

## Wealth Planning

### Investment Planning `[Phase 3]`
- **Why:** Building long-term wealth requires investing; many people need help starting responsibly.
- **Who:** Users ready to invest; advisors.
- **Value:** Confidence to begin; alignment of investments with goals and risk tolerance. *(WealthWise plans and educates; it does not execute trades.)*
- **Dependencies:** Net Worth, Goals, Profiles (risk tolerance).
- **Future:** Portfolio tracking, rebalancing guidance, scenario analysis — always with human oversight for advice.

### Insurance `[Phase 3]`
- **Why:** Protection planning prevents catastrophe from derailing a financial life.
- **Who:** Families, parents, business owners; advisors.
- **Value:** Appropriate coverage; gaps identified; peace of mind.
- **Dependencies:** Profiles, Net Worth, Goals.
- **Future:** Coverage-gap analysis, life-event-triggered reviews, advisor referral for policies.

### Retirement `[Phase 3]`
- **Why:** Retirement is the largest financial goal most people face and the easiest to under-prepare for.
- **Who:** All adults, increasingly with age; advisors.
- **Value:** Confidence about the long term; drawdown clarity for retirees.
- **Dependencies:** Savings, Investments, Net Worth, Goals.
- **Future:** Accumulation and drawdown modeling, longevity scenarios, tax-aware withdrawal sequencing.

### Tax Planning `[Phase 3]`
- **Why:** Tax is a major, often-overlooked lever; planning ahead saves real money.
- **Who:** Business owners, higher earners, investors; advisors.
- **Value:** Reduced surprises; legitimate optimization; readiness. *(Education and planning, not filing or advice that requires a licensed professional.)*
- **Dependencies:** Income, Investments, Profiles, jurisdiction.
- **Future:** Localized tax modeling, advisor/accountant collaboration.

---

## Insight

### Financial Reports `[Phase 1]`
- **Why:** People need clear, periodic summaries they can trust and share.
- **Who:** All users; advisors share reports with clients.
- **Value:** Clarity, accountability, shareable understanding.
- **Dependencies:** Finance Engine (source of all numbers).
- **Future:** Customizable reports, advisor-branded reports, exportable summaries.

### Analytics `[Phase 2/3]`
- **Why:** Patterns and trends reveal opportunities individuals can't see in raw numbers.
- **Who:** Users (personal insight); advisors and agencies (practice insight); platform (product insight, privacy-preserving).
- **Value:** Deeper understanding, better decisions, early risk detection.
- **Dependencies:** Finance Engine, Reports.
- **Future:** Predictive insight, benchmarking (anonymized/consented), agency performance analytics.

---

## Intelligence

### AI Coach `[Phase 1 explanations → Phase 2 full coach]`
- **Why:** Most people want guidance but can't afford a human for everyday questions. AI can explain and coach at scale.
- **Who:** All end users; advisors (as an assistant — drafting, summarizing).
- **Value:** Plain-language understanding, 24/7 availability, gentle coaching toward better habits.
- **Dependencies:** Finance Engine (reads from it — never calculates money itself), Profiles, Business Rules.
- **Boundaries:** Never executes transactions; never gives unexplained advice; never replaces a human advisor; defers to humans for regulated advice. See [Business Rules](business-rules.md).
- **Future:** Proactive coaching, deeper personalization, multilingual support, advisor co-pilot.

### AI Agents `[Phase 4]`
- **Why:** Routine financial chores (categorizing, reminding, drafting plans, monitoring) can be delegated safely with the right guardrails.
- **Who:** Users who opt in; advisors and agencies for workflow automation.
- **Value:** Time saved; consistency; proactive management — under human and user oversight.
- **Dependencies:** AI Coach, Finance Engine, strict Business Rules and permissions.
- **Boundaries:** Agents act only within explicit, revocable permissions and never move money without human-confirmed authorization.
- **Future:** Marketplace of specialized agents; agent + advisor collaboration; automation with full auditability.

---

## Human Network

### Advisor Marketplace `[Phase 2]`
- **Why:** Finding a trustworthy advisor is hard; a transparent marketplace solves discovery and trust.
- **Who:** Users seeking human help; independent advisors seeking clients.
- **Value:** Matched, verified, transparently-rated advisors; for advisors, a client pipeline.
- **Dependencies:** Profiles, verification, ratings, Roles.
- **Future:** Smart matching, specialty filtering, transparent pricing, performance signals.

### Agency Portal `[Phase 2]`
- **Why:** Agencies need to manage teams of advisors and books of clients with oversight and isolation.
- **Who:** Agency owners and admins; advisors within an agency.
- **Value:** Run and grow a practice on the platform; quality and compliance oversight.
- **Dependencies:** Organization Model, Roles, data isolation, Marketplace.
- **Future:** Advisor performance management, branded experiences, business analytics.

### Meetings `[Phase 2]`
- **Why:** Advice often happens in conversation; scheduling and conducting meetings should be frictionless.
- **Who:** Clients and advisors.
- **Value:** Easy booking, prepared context, continuity.
- **Dependencies:** Profiles, Messaging, Notifications, advisor availability.
- **Future:** In-context meeting notes, AI meeting summaries, follow-up task tracking.

### Messaging `[Phase 2]`
- **Why:** Ongoing client–advisor relationships need secure, contextual communication.
- **Who:** Clients, advisors, agency staff.
- **Value:** Continuity, recordkeeping, trust.
- **Dependencies:** Profiles, Roles, data isolation.
- **Future:** AI-assisted replies, summarization, compliance-friendly archiving.

### Document Management `[Phase 2/3]`
- **Why:** Financial relationships generate documents (plans, statements, agreements) that must be stored and shared securely.
- **Who:** Clients, advisors, agencies.
- **Value:** Organized, secure, permissioned document exchange.
- **Dependencies:** Profiles, Roles, data isolation, security.
- **Future:** Document-aware AI summaries, e-signature, retention policies.

---

## Operations

### Admin Portal `[Phase 1 internal → grows each phase]`
- **Why:** The platform must be operated, supported, and governed.
- **Who:** Platform admins, support, compliance.
- **Value:** Safe operation, support, oversight, and policy enforcement.
- **Dependencies:** Roles, all modules (for oversight).
- **Future:** Compliance tooling, fraud/risk monitoring, advisor/agency vetting workflows.

### Subscriptions `[Phase 1/2]`
- **Why:** A sustainable business needs clear, fair monetization.
- **Who:** Individual/premium users, advisors, agencies, enterprises.
- **Value:** Access to the right tier of value; predictable revenue for the business.
- **Dependencies:** Profiles, Roles.
- **Future:** Tiered plans, agency/enterprise billing, advisor revenue models, usage-based AI tiers.

---

## Ecosystem

### Community `[Phase 4]`
- **Why:** Money is social; peer support and shared learning improve outcomes and engagement.
- **Who:** All end users; moderated by the platform.
- **Value:** Motivation, accountability, shared wisdom, reduced stigma around money.
- **Dependencies:** Profiles, moderation, privacy controls.
- **Future:** Groups, challenges, expert AMAs, advisor visibility.

### Learning Hub `[Phase 1 lightweight → Phase 4 full]`
- **Why:** Financial literacy is a core mission pillar; education is a first-class feature.
- **Who:** All users, calibrated to life stage and persona.
- **Value:** Confidence and competence; better decisions; reduced anxiety.
- **Dependencies:** Profiles (for relevance), AI Coach (for contextual learning).
- **Future:** Personalized learning paths, certifications, advisor-authored content.

---

## Module dependency summary

- **Everything** depends on Authentication and Profiles.
- **All insight, AI, and human-help** depend on the Finance Engine as the single source of truth.
- **The Human Network** depends on the [Organization Model](organization-model.md) and [Roles](roles.md).
- **AI modules** depend on [Business Rules](business-rules.md) to stay safe.

A consolidated feature dependency map is maintained in the [WealthWise Bible](wealthwise-bible.md#feature-dependency-map).
