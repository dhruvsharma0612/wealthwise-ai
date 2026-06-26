# Roles

Roles define **what each kind of person can do** on WealthWise. This document describes responsibilities and capabilities **conceptually** — not how permissions are implemented.

Roles map onto the [Organization Model](organization-model.md) hierarchy and are governed by the principle of **least privilege**: each role can do what it needs, and no more.

---

## Role summary

| Role | Belongs to | Primary purpose |
|---|---|---|
| Platform Super Admin | Platform | Ultimate governance and control |
| Platform Admin | Platform | Day-to-day platform operations |
| Agency Owner | Agency | Run a wealth-management firm |
| Agency Admin | Agency | Operate an agency on the owner's behalf |
| Advisor | Agency or independent | Serve assigned clients |
| Support Staff | Platform | Help users and resolve issues |
| Client | (Independent or under advisor/agency) | Manage their own finances |
| Premium Client | Same as Client + premium | Access advanced capabilities |
| Future Roles | Various | Planned expansions |

---

## Platform Super Admin
- **Who:** The highest-trust platform operators (founders, senior platform engineers/ops).
- **Can:** Govern the entire platform; manage Platform Admins; set platform-wide policy; access the most sensitive operational controls; act as the final escalation point.
- **Responsibilities:** Stewardship of the entire ecosystem's safety, integrity, and trust. The most accountable role on the platform.
- **Boundaries:** Even at this level, access to individual client financial data is governed, logged, and limited to legitimate purposes — power is not a license to browse user finances.

## Platform Admin
- **Who:** Platform operations staff.
- **Can:** Operate the platform day-to-day; manage agencies and advisors (verification, status); configure platform settings within policy; oversee health and operations; assist compliance.
- **Responsibilities:** Keep the platform running safely and within policy; uphold verification standards for professionals.
- **Boundaries:** No arbitrary access to client finances; cannot override Super Admin governance.

## Agency Owner
- **Who:** The principal of a wealth-management firm on the platform.
- **Can:** Set up and manage the agency; add/remove Agency Admins and Advisors; assign clients to advisors; oversee the agency's clients and performance (within its own data only); manage agency branding and business settings.
- **Responsibilities:** Quality, compliance, and conduct of the firm; advisor management; client relationships at the firm level.
- **Boundaries:** **Cannot access any other agency's data** (a hard [business rule](business-rules.md)); does not own client data — access is granted by clients.

## Agency Admin
- **Who:** Operations/management staff within an agency, acting for the owner.
- **Can:** Most agency-management functions the owner delegates — manage advisors, assist with client assignment, handle agency operations.
- **Responsibilities:** Smooth running of the agency; supporting advisors and the owner.
- **Boundaries:** Scope set by the owner; limited to the agency's own data; cannot perform owner-only governance actions (e.g., dissolving the agency) unless delegated.

## Advisor
- **Who:** A verified financial professional — independent or within an agency.
- **Can:** View and work with **assigned clients'** data (as granted); build plans; communicate (messaging, meetings); prepare reports; use AI as an assistant; maintain a professional profile and reputation.
- **Responsibilities:** Provide quality, explainable, professional guidance; protect client trust and privacy; maintain compliance.
- **Boundaries:** Access limited to assigned clients only; cannot see the agency's full book unless their role grants oversight; does not own client data; cannot execute transactions on the platform's behalf (the platform does not move money).

## Support Staff
- **Who:** Platform support team.
- **Can:** Assist users with account, usage, and technical issues; access the information needed to resolve a given issue (governed and logged); escalate to engineering or compliance.
- **Responsibilities:** Fast, accurate, empathetic resolution; faithful escalation; protecting user privacy during support.
- **Boundaries:** Need-to-know access only; cannot make financial decisions for users; cannot access data beyond the support context.

## Client
- **Who:** An end user managing their own finances (may be independent, or working with an advisor/agency).
- **Can:** Use all core finance tools; set goals and budgets; use AI guidance; grant or revoke advisor/agency access; choose their help level; own and export their data.
- **Responsibilities:** Provide accurate information; make their own decisions; manage who can access their data.
- **Boundaries:** Sees only their own data; cannot act on behalf of other users.

## Premium Client
- **Who:** A client on a premium subscription.
- **Can:** Everything a Client can, plus advanced modules (e.g., deeper planning, analytics), enhanced AI access, priority support, and richer advisor/agency access — per the subscription tier.
- **Responsibilities & Boundaries:** Same as Client; differences are about *depth of access*, not different powers over others' data.

---

## Future Roles (planned)

These are anticipated as the platform grows (see [Roadmap](roadmap.md)). Documented now so the model can accommodate them:

- **Compliance Officer** — A dedicated role for regulatory oversight, audit, and policy enforcement, distinct from general platform admin.
- **Agency Advisor Manager** — A mid-level agency role overseeing a team of advisors without full owner powers.
- **Enterprise Admin** — Manages an enterprise/white-label deployment for an organization's members (with privacy-preserving aggregate views only).
- **Delegated Access (e.g., Partner/Family)** — A client granting a spouse, family member, or caretaker scoped access to their finances.
- **AI Agent (as an actor)** — A future, opt-in, strictly-bounded automated actor operating within explicit, revocable permissions and full auditability (see [AI Agents module](modules.md#ai-agents)).

---

## Cross-cutting rules for all roles

1. **Least privilege:** every role sees and does only what it needs.
2. **Client data ownership is absolute:** no role's powers override a client's ownership of their own data.
3. **Isolation is sacred:** no role bridges one agency's data to another.
4. **Accountability:** access to sensitive data is governed and logged, regardless of role.
5. **No automated money movement:** no role (human or future AI) moves money without explicit, human-confirmed authorization — the platform does not transact on users' behalf.

These rules are formalized in [Business Rules](business-rules.md).
