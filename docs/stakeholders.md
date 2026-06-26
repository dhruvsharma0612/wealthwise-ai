# Stakeholders

This document lists every party with a stake in WealthWise and what each wants from the platform. Understanding these motivations keeps product decisions honest — a feature that delights end users but betrays compliance, or pleases agencies but burdens advisors, is not a good feature.

Stakeholders fall into two groups:
- **Internal stakeholders** — the people who build, run, and fund WealthWise.
- **External stakeholders** — the people who use, sell on, or are served by the platform.

---

## Internal Stakeholders

### Platform Owner / Founders
**What they want:** A durable, trusted, growing business that becomes the operating system for personal finance. Sustainable unit economics, a defensible market position, and a brand synonymous with financial trust.
**Success looks like:** Strong retention, healthy revenue, an active advisor/agency ecosystem, and a reputation for trustworthiness.

### Product Team
**What they want:** Clear product vision, prioritized backlog, and the ability to ship value users feel. A shared understanding (this documentation) so decisions are coherent across phases.
**Success looks like:** Features that move the North Star, low rework, and alignment between business goals and what gets built.

### Developers
**What they want:** Unambiguous requirements, stable architecture decisions, clear business rules, and a knowledge base that explains the *why* behind features so they can make good judgment calls.
**Success looks like:** Building the right thing once; minimal thrash from misunderstood requirements.

### Designers
**What they want:** Deep understanding of personas, journeys, and principles so they can design interfaces that make complex finance feel simple, trustworthy, and accessible.
**Success looks like:** Users who feel calm and in control, not overwhelmed; designs that embody transparency and trust.

### AI Engineers
**What they want:** Clear boundaries on what AI may and may not do, requirements for explainability, and an understanding of where AI fits across modules and roles.
**Success looks like:** AI that is helpful, bounded, explainable, and safe — assisting people without overstepping into transactions or unaccountable advice.

### Support Team
**What they want:** Clear product knowledge, defined escalation paths, and documented business rules so they can resolve issues confidently and consistently.
**Success looks like:** Fast, accurate resolutions; users who feel heard; clear handoffs to compliance or engineering when needed.

### Compliance Team
**What they want:** Business rules that respect financial regulation, auditability of recommendations, data-privacy guarantees, and clear separation between education, guidance, and regulated advice.
**Success looks like:** The platform operates within regulatory boundaries in every market; risks are documented and mitigated (see [Risks](risks.md)).

### Investors
**What they want:** A large addressable market, a credible path to leadership, defensible moats (trust, ecosystem, data with consent), and responsible governance of a high-stakes financial product.
**Success looks like:** Growth metrics, expanding ecosystem, and a brand that compounds trust over time.

---

## External Stakeholders

### Individual Users
**What they want:** To understand and improve their finances without feeling judged or overwhelmed. Simple tools, plain-language guidance, and help when they want it.
**Success looks like:** They feel more in control of their money and can see measurable progress on their goals.

### Premium Users
**What they want:** Everything individual users want, plus deeper insight, advanced planning (investments, retirement, tax), priority support, and richer AI and advisor access.
**Success looks like:** They feel the premium tier pays for itself in clarity, time saved, and better outcomes.

### Financial Advisors
**What they want:** A steady stream of well-matched clients, tools that reduce administrative overhead, AI that helps them serve more clients well, transparent reputation-building, and fair economics.
**Success looks like:** They grow their practice and serve clients better with less busywork.

### Wealth Management Agencies
**What they want:** A platform to manage a team of advisors and a book of clients, with proper data isolation, oversight tools, branding, and a viable business model.
**Success looks like:** They run and grow their practice on WealthWise, with healthy advisor utilization and client retention.

### Enterprise Clients
**What they want:** To offer financial wellness to their employees or customers — potentially white-labeled — with security, compliance, reporting, and reliability at scale.
**Success looks like:** Their people are financially healthier; the platform integrates cleanly and reports clearly.

---

## Stakeholder tension map

Good product decisions balance competing wants. Common tensions to watch:

| Tension | Resolution principle |
|---|---|
| Growth (Owner/Investors) vs. Privacy (Users/Compliance) | Trust wins; never monetize by eroding privacy. |
| AI autonomy (engineering ambition) vs. Safety (Compliance/Users) | AI assists, never transacts; everything explainable. |
| Agency control vs. Advisor independence vs. Client ownership of data | The client owns their data; agencies and advisors are granted access, not ownership. |
| Feature depth (Premium) vs. Simplicity (new Users) | Progressive disclosure — power is available, not imposed. |

See [Principles](principles.md) for how these tensions are resolved, and [Business Rules](business-rules.md) for the hard constraints.
