# Organization Model

WealthWise serves both **individuals** and **professional organizations**. To do that safely, it uses a clear hierarchy that defines responsibility, ownership, permissions, and — most importantly — **data isolation**.

This document describes the model **conceptually**. It does not specify implementation.

---

## The hierarchy

```
                 ┌─────────────────────────────┐
                 │     WEALTHWISE PLATFORM      │   ← owns the platform, sets the rules
                 └──────────────┬──────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌──────────┐     ┌──────────┐      (Independent
        │  AGENCY  │     │  AGENCY  │       Advisors can
        └────┬─────┘     └────┬─────┘       exist directly
             │                │             under the Platform)
        ┌────┴────┐      ┌────┴────┐
        ▼         ▼      ▼         ▼
    ┌────────┐ ┌────────┐    ┌────────┐
    │ADVISOR │ │ADVISOR │    │ADVISOR │
    └───┬────┘ └───┬────┘    └───┬────┘
        │          │             │
        ▼          ▼             ▼
    ┌────────┐ ┌────────┐    ┌────────┐
    │ CLIENT │ │ CLIENT │    │ CLIENT │   ← owns their own financial data
    └────────┘ └────────┘    └────────┘
```

**Two important nuances:**
1. **Independent advisors** can operate directly under the Platform without belonging to an agency.
2. **Independent users** (the majority) belong to no advisor or agency at all — they use WealthWise on their own, with or without AI. The hierarchy only applies once human professionals are involved.

---

## The four levels

### 1. WealthWise Platform
- **Is:** The top of the hierarchy — the company that builds, operates, and governs the ecosystem.
- **Responsibilities:** Set the rules; ensure security, privacy, and compliance; verify advisors and agencies; operate the marketplace; provide AI; protect users.
- **Owns:** The platform itself, the rules, and the trust framework — **not** the users' financial data (users own that).

### 2. Agency
- **Is:** A wealth-management firm operating on the platform, employing or contracting multiple advisors.
- **Responsibilities:** Manage its advisors; oversee service quality and compliance within the firm; manage its book of client relationships; uphold its brand.
- **Owns:** Its organizational structure, advisor roster, and the *relationship* with its clients — **not** the clients' financial data (clients own that; the agency is granted access).

### 3. Advisor
- **Is:** A verified financial professional — either independent or part of an agency — who serves clients.
- **Responsibilities:** Provide quality, explainable guidance to assigned clients; maintain professionalism and compliance; build trust and reputation.
- **Owns:** Their professional profile and reputation — **not** the clients' financial data (granted access only, for assigned clients).

### 4. Client
- **Is:** An end user who has chosen to work with an advisor or agency.
- **Responsibilities:** Provide accurate information; make their own financial decisions; manage who has access to their data.
- **Owns:** **Their own financial data — always.** This is a foundational [business rule](business-rules.md).

---

## Ownership: the cardinal rule

> **The client owns their financial data. Period.**

Agencies and advisors are **granted access** to a client's data — they never own it. Access is:
- **Explicit** — the client grants it.
- **Scoped** — limited to what's needed for the relationship.
- **Revocable** — the client can withdraw it (advisor switching; see [Advisor Ecosystem](advisor-ecosystem.md)).
- **Auditable** — who accessed what is recorded.

When a client leaves an advisor or agency, their data goes with them; the professional's access ends.

---

## Permissions (conceptual)

Permissions answer "who can see and do what." Detailed role responsibilities are in [Roles](roles.md). At the organizational level:

| Level | Can see | Can do (conceptually) |
|---|---|---|
| Platform | Operational/oversight views; aggregate, privacy-respecting data; not arbitrary access to client finances | Govern, verify, support, enforce policy |
| Agency | Data for *its own* clients (as granted); its advisors' activity | Manage advisors, assign clients, oversee quality |
| Advisor | Data for *their assigned* clients (as granted) | Advise, plan, communicate, prepare reports |
| Client | All of *their own* data | Manage finances, grant/revoke access, choose help level |

Permissions are **least-privilege**: each level sees only what it needs.

---

## Data isolation

Data isolation is what makes the multi-tenant ecosystem trustworthy. The principles:

1. **Agency-to-agency isolation:** One agency can **never** access another agency's clients or data. (Core [business rule](business-rules.md).)
2. **Advisor scoping:** An advisor sees only the clients assigned to them, not the agency's entire book (unless their role grants broader oversight).
3. **Client privacy:** A client's data is invisible to any professional they have not granted access to.
4. **Platform restraint:** Even the platform does not browse client finances arbitrarily; operational access is governed, logged, and limited to legitimate purposes (support, compliance, safety).

Isolation failures are among the most serious risks on the platform — see [Risks](risks.md).

---

## How relationships form and dissolve

- **Formation:** A client connects with an advisor/agency via the [Advisor Marketplace](modules.md#advisor-marketplace) or is onboarded by an agency. Access is granted at this point.
- **Assignment:** Within an agency, the owner/admin assigns clients to advisors.
- **Switching:** A client may switch advisors or agencies; access transfers accordingly and old access is revoked.
- **Dissolution:** When a relationship ends, professional access ends; the client retains all their data.

Full lifecycles are documented in the [Advisor Ecosystem](advisor-ecosystem.md).

---

## Why this model matters

- It lets WealthWise serve solo users **and** professional firms in one platform.
- It makes **trust** structural, not just promised: ownership and isolation are built into the model.
- It scales: new agencies, advisors, and clients slot into a clear, repeatable structure.
