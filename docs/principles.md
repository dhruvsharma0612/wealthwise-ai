# Product Principles

Principles are the **values that guide every decision** at WealthWise — the "how we think" behind the "what we build." Where [Business Rules](business-rules.md) are hard constraints, principles are the reasoning that produces those rules and resolves the gray areas the rules don't cover.

When two good options conflict, return to these principles. They are listed roughly in priority order, but all are essential.

---

## 1. Trust
**Trust is the product.** WealthWise is in the business of helping people with the most sensitive part of their lives after health. Every interaction either builds or spends trust. We optimize for trust over short-term gain, always.
- *In practice:* Verified professionals, honest reputation, no dark patterns, no surprises.

## 2. Transparency
**No black boxes.** Users can always understand what's happening and why. Recommendations are explainable; pricing is clear; data use is disclosed.
- *In practice:* Every AI or platform recommendation answers "why?"; fees and tiers are upfront. (See [BR-03](business-rules.md#br-03--every-recommendation-must-be-explainable).)

## 3. Privacy
**The user's data is theirs.** Privacy is the default, not a setting buried three menus deep. We collect what we need, protect it rigorously, and never monetize it in ways that betray the user.
- *In practice:* Mandatory privacy, least-privilege access, data portability. (See [BR-07](business-rules.md#data-ownership--privacy-rules), [BR-10](business-rules.md#br-10--privacy-is-mandatory-not-optional).)

## 4. Security
**Safety is foundational.** A financial platform that isn't secure has no right to exist. Security underpins trust and privacy.
- *In practice:* Security considered from day one; sensitive actions protected; access governed and logged.

## 5. User First
**The user's interest comes first** — ahead of the platform's, the agency's, or the advisor's short-term interest. When incentives conflict, we choose the user.
- *In practice:* No lock-in (users can leave with their data), honest defaults, advice that serves the user.

## 6. Human + AI Collaboration
**AI assists; humans decide.** AI scales guidance and removes busywork; humans bring judgment, accountability, and relationship. Neither replaces the other.
- *In practice:* AI never transacts or replaces advisors; AI makes advisors more effective and users more informed. (See [BR-01](business-rules.md#br-01--ai-never-executes-financial-transactions), [BR-02](business-rules.md#br-02--ai-assists-it-does-not-replace-human-advisors).)

## 7. Financial Literacy
**We teach, not just track.** Empowerment comes from understanding. Education is a first-class feature, woven through the product, not bolted on.
- *In practice:* Plain-language explanations, the Learning Hub, contextual teaching moments.

## 8. Accessibility
**Finance for everyone.** The product must work for the student and the retiree, the expert and the anxious beginner, across abilities and contexts.
- *In practice:* Inclusive design, plain language, progressive disclosure so power doesn't overwhelm.

## 9. Scalability
**Built to grow.** Decisions account for a future of many users, advisors, agencies, markets, and modules — without compromising the principles above.
- *In practice:* A clear organization model, repeatable structures, a roadmap that builds in layers.

## 10. Compliance
**We respect the rules of finance.** Operating responsibly within regulation isn't a constraint on the mission — it's part of being trustworthy.
- *In practice:* Education/guidance/advice distinguished; market-specific regulation respected. (See [BR-15](business-rules.md#br-15--education-guidance-and-regulated-advice-are-distinguished), [BR-16](business-rules.md#br-16--the-platform-operates-within-applicable-regulation-in-each-market).)

---

## How principles resolve tensions

Real decisions involve trade-offs. The principles give us a consistent way to resolve them:

| Tension | Principle that decides |
|---|---|
| More engagement vs. user wellbeing | **User First** — engagement that doesn't help the user isn't worth it. |
| Powerful AI autonomy vs. safety | **Human + AI Collaboration** + **Trust** — AI stays bounded. |
| Faster monetization vs. privacy | **Privacy** + **Trust** — never monetize at the user's expense. |
| Feature richness vs. simplicity | **Accessibility** — progressive disclosure, not feature overload. |
| Agency/advisor convenience vs. client control | **User First** — the client owns the relationship and the data. |

---

## Using the principles

- **Product & Design:** Pressure-test every decision against the principles; cite them in design rationale.
- **Engineering & AI:** Treat them as design constraints alongside business rules.
- **Leadership:** Use them to say no — a principled no is how trust is protected.

> If a decision is hard, the principles aren't there to make it easy — they're there to make it **consistent and trustworthy**.
