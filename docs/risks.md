# Risks

A financial platform that handles people's money and trust carries serious risk. This document catalogs the major risks across categories and, for each, a **mitigation strategy**. Risks are described at a business level; mitigations reference our [Principles](principles.md) and [Business Rules](business-rules.md).

Risks are rated by **likelihood** and **impact** (Low / Medium / High) to aid prioritization. These are initial assessments to be refined with data.

---

## Business Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Low adoption** — users don't see enough value to switch from existing tools | Medium | High | Nail the Phase 1 core promise (clarity + understanding); strong onboarding; persona-driven value. |
| **Two-sided marketplace cold start** — not enough advisors or clients to attract the other | Medium | High | Seed verified advisors before opening demand; serve independent users first so the platform has value even without advisors. |
| **Unclear monetization / weak unit economics** | Medium | Medium | Clear tiered subscriptions; ecosystem revenue from advisors/agencies; avoid privacy-compromising monetization. |
| **Brand/trust damage from any single failure** | Low | High | Trust-first culture; conservative defaults; transparent communication; treat trust as the core asset. |

## Technical Risks

> *(Described as product risks; no implementation detail.)*

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Inconsistent or wrong financial numbers** | Medium | High | Single Finance Engine source of truth ([BR-05](business-rules.md#br-05--all-financial-calculations-come-only-from-the-finance-engine)); AI reads, never computes money ([BR-06](business-rules.md)). |
| **Scalability strain as users/agencies grow** | Medium | Medium | Scalability as a principle; layered roadmap; repeatable organization model. |
| **Integration fragility (future external connections)** | Medium | Medium | Treat integrations as additive; degrade gracefully; never make core value depend on a single integration. |

## Compliance Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Crossing from guidance into regulated advice without authorization** | Medium | High | Clear separation of education / guidance / regulated advice ([BR-15](business-rules.md#br-15--education-guidance-and-regulated-advice-are-distinguished)); humans handle regulated advice. |
| **Operating outside market-specific regulation** | Medium | High | Compliance principle; respect each market's rules ([BR-16](business-rules.md)); dedicated compliance oversight; phased international expansion. |
| **Inadequate auditability of recommendations** | Low | High | Explainability requirement ([BR-03](business-rules.md#br-03--every-recommendation-must-be-explainable)); access logging ([BR-08](business-rules.md)). |

## Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Bad-actor advisors or agencies harming clients** | Medium | High | Verification before exposure ([BR-12](business-rules.md#br-12--advisors-and-agencies-are-verified-before-serving-clients)); honest ratings ([BR-14](business-rules.md)); ongoing conduct standards; escalation paths. |
| **Support failures eroding trust** | Medium | Medium | Trained support; clear escalation to compliance/engineering; documented business rules as the support baseline. |
| **Ratings manipulation** | Medium | Medium | Protect reputation integrity ([BR-14](business-rules.md)); detect and act on manipulation. |

## Security Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Data breach of sensitive financial data** | Low | Critical | Security as a foundational principle; least-privilege access; protect sensitive actions; minimize data collected. |
| **Cross-agency data leakage** | Low | Critical | Absolute data isolation ([BR-09](business-rules.md#br-09--agencies-cannot-access-another-agencys-data)); zero-tolerance guardrail metric. |
| **Account takeover** | Medium | High | Strong authentication; protection for high-risk actions; anomaly awareness. |
| **Insider misuse of access** | Low | High | Governed, logged access for all roles including admins ([BR-08](business-rules.md)); need-to-know support access. |

## AI Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **AI hallucinating financial facts or numbers** | Medium | High | AI reads from the Finance Engine, never invents figures ([BR-06](business-rules.md)); explainability ([BR-03](business-rules.md)). |
| **AI overstepping into transactions** | Low | Critical | Hard rule: AI never executes transactions ([BR-01](business-rules.md#br-01--ai-never-executes-financial-transactions)). |
| **AI replacing/undermining human advisors** | Low | Medium | AI assists, defers to humans for regulated advice ([BR-02](business-rules.md)). |
| **Unexplainable or biased AI recommendations** | Medium | High | Explainability mandatory ([BR-03](business-rules.md)); human review in professional contexts; ongoing quality monitoring. |
| **Future AI agents acting beyond consent** | Low | High | Agents bound to explicit, revocable, audited permissions ([BR-04](business-rules.md)); never move money without human confirmation. |

## Scalability Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Quality dilution as advisor/agency base grows** | Medium | Medium | Ongoing verification and conduct standards; reputation signals; oversight tooling. |
| **Complexity overwhelming new users as modules grow** | Medium | Medium | Accessibility principle; progressive disclosure; persona-calibrated experience. |
| **International expansion outpacing compliance** | Medium | High | Phase expansion deliberately; localize compliance before launch in a market. |

---

## Risk governance

- **Ownership:** Each risk category has an accountable owner (e.g., compliance risks → Compliance Team).
- **Review cadence:** Risks are reviewed at the start of each [roadmap phase](roadmap.md) and updated with real data.
- **Guardrail metrics:** Several risks map directly to [guardrail metrics](success-metrics.md#guardrail-metrics-must-not-get-worse) that must not regress.
- **Escalation:** Critical risks (breach, isolation failure, AI overstepping) have zero tolerance and immediate escalation to the highest authority ([Platform Super Admin](roles.md)).

> The biggest risk of all is **losing user trust**. Nearly every mitigation above ultimately protects that single asset.
