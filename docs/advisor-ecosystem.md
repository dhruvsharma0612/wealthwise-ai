# Advisor Ecosystem

WealthWise gives every user a choice: manage finances **independently**, or connect with **human financial professionals** — and AI assists in both cases. This document describes the human-help side of the ecosystem: how advisors and agencies join, how clients connect to them, how trust is established, and how AI fits in.

The structural foundation is the [Organization Model](organization-model.md); the powers of each party are in [Roles](roles.md).

---

## The core promise

> Users are never forced into a relationship with a human. When they want one, finding a trustworthy professional is transparent, and their context comes with them. AI **assists** people — it never replaces the human advisor.

---

## Lifecycles

### Advisor lifecycle
1. **Discovery** — A professional learns they can build or grow a practice on WealthWise.
2. **Application** — They apply to join, providing professional credentials.
3. **Verification** — The platform (or their agency) verifies credentials and standing. *Trust is earned before exposure to clients.*
4. **Profile creation** — They build a professional profile: specialties, experience, approach, availability.
5. **Activation** — Once verified, they appear in the [Marketplace](modules.md#advisor-marketplace) (if independent) or are activated within their agency.
6. **Serving clients** — They take on assigned/matched clients, advise, communicate, and build reputation through ratings.
7. **Growth** — Strong service and ratings attract more clients.
8. **Offboarding** — If they leave, their access to client data ends; clients retain their data and can be reassigned.

### Agency lifecycle
1. **Application** — A firm applies to operate on the platform.
2. **Verification** — The platform verifies the firm's legitimacy and standing.
3. **Setup** — The agency configures its organization, branding, and settings ([Agency Portal](modules.md#agency-portal)).
4. **Advisor onboarding** — The agency adds and verifies its advisors.
5. **Operation** — The agency takes on clients, assigns them to advisors, and oversees quality and compliance.
6. **Growth** — The firm scales its advisor roster and client book.
7. **Offboarding** — If the agency leaves, clients retain their data; relationships are gracefully unwound and access revoked.

### Client onboarding (into a human relationship)
1. **Decision** — A user decides they want human help.
2. **Discovery** — They browse the Marketplace or are referred to an agency.
3. **Matching/selection** — They select (or are matched with) an advisor/agency.
4. **Consent & access grant** — They explicitly grant scoped access to their financial data.
5. **Kickoff** — An initial meeting; the advisor already has context, so the conversation starts ahead.
6. **Ongoing relationship** — Meetings, messaging, plans, reports.

### Advisor onboarding (into an agency)
1. The agency invites the advisor.
2. The agency verifies credentials.
3. The advisor sets up their profile within the agency.
4. The agency assigns clients.

### Agency onboarding (onto the platform)
Covered by the agency lifecycle above — application, verification, setup.

---

## Client assignment

- **Independent advisors:** Clients connect directly via the Marketplace; the connection *is* the assignment.
- **Within an agency:** The Agency Owner/Admin assigns clients to specific advisors based on fit, specialty, and capacity.
- **Reassignment:** Clients can be reassigned within an agency (e.g., advisor leaves, specialty change). Access follows the assignment.

---

## Advisor switching

A client is never locked in.

- A client can **switch** advisors (within or across agencies) at any time.
- On switching, the **new** advisor is granted access; the **old** advisor's access is **revoked**.
- The client's data **stays with the client** throughout — they own it ([Organization Model](organization-model.md)).
- Switching should be low-friction and judgment-free; freedom to leave is what makes staying meaningful.

---

## Trust & verification

Trust is a product principle ([Principles](principles.md)), made concrete here:

- **Verification before exposure:** Advisors and agencies are verified before they can serve clients.
- **Transparent profiles:** Clients can see specialties, experience, approach, and standing.
- **Ratings & reviews:** Real client feedback builds (or erodes) reputation.
- **Ongoing standards:** Professionals must maintain conduct and compliance to remain active.
- **Explainability:** Whether advice comes from AI or a human, the client can always ask "why?" and get a real answer.

### Ratings
- Ratings reflect genuine client experience.
- They inform matching and discovery.
- They create accountability and reward good service.
- They must be protected against manipulation (see [Risks](risks.md)).

---

## Appointments & communication

- **Appointments/Meetings** ([module](modules.md#meetings)): Clients book time with advisors; context is pre-loaded so meetings are productive.
- **Messaging** ([module](modules.md#messaging)): Secure, contextual, ongoing communication between meetings.
- **Document Management** ([module](modules.md#document-management)): Plans, statements, and agreements are shared securely and with permission.

All communication respects data isolation and client privacy.

---

## How AI assists the ecosystem

AI is a force multiplier for humans, not a substitute:

**For clients:**
- Explains their situation in plain language before and after advisor meetings.
- Helps them prepare good questions.
- Provides everyday guidance for things that don't need a human.

**For advisors:**
- Drafts and summarizes (plans, meeting notes, messages) — the advisor reviews and owns the output.
- Surfaces relevant context about a client quickly.
- Handles routine work so advisors spend more time on high-value advising.

**Guardrails (always):**
- AI never executes transactions.
- AI never replaces the human relationship — it defers to humans for regulated advice and complex judgment.
- AI output is explainable and, in professional contexts, reviewed by the responsible human.

See [Business Rules](business-rules.md) for the hard constraints on AI.

---

## Why the ecosystem matters

- It makes **trustworthy human help accessible** — solving discovery and trust, the two hardest problems in finding an advisor.
- It gives **professionals a viable business** on the platform, which sustains supply.
- It lets **AI and humans collaborate**, each doing what they do best.
- It keeps the **client in control** — of their data, their choice of help, and their freedom to switch.
