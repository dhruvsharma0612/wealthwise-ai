# Platform Overview

This document describes WealthWise at a high level — the shape of the whole product — so anyone can form a mental model before diving into individual [modules](modules.md).

---

## The big picture

WealthWise is a layered ecosystem. Think of it as concentric rings, from the user's own data outward to the wider community and future automation.

```
                ┌─────────────────────────────────────────────┐
                │              FUTURE: AI AGENTS                │
                │   automation • open APIs • white-label        │
                │  ┌───────────────────────────────────────┐   │
                │  │           COMMUNITY & LEARNING         │   │
                │  │  ┌─────────────────────────────────┐   │   │
                │  │  │     HUMAN HELP LAYER            │   │   │
                │  │  │  advisors • agencies • meetings │   │   │
                │  │  │  ┌───────────────────────────┐  │   │   │
                │  │  │  │      AI GUIDANCE LAYER    │  │   │   │
                │  │  │  │   AI Coach • nudges •     │  │   │   │
                │  │  │  │   explanations           │  │   │   │
                │  │  │  │  ┌─────────────────────┐  │  │   │   │
                │  │  │  │  │   FINANCE ENGINE    │  │  │   │   │
                │  │  │  │  │  income • expense • │  │  │   │   │
                │  │  │  │  │  budget • savings • │  │  │   │   │
                │  │  │  │  │  goals • net worth  │  │  │   │   │
                │  │  │  │  └─────────────────────┘  │  │   │   │
                │  │  │  │   ↑ the source of truth   │  │   │   │
                │  │  │  └───────────────────────────┘  │   │   │
                │  │  └─────────────────────────────────┘   │   │
                │  └───────────────────────────────────────┘   │
                │         IDENTITY • PROFILES • PRIVACY          │
                └─────────────────────────────────────────────┘
```

- **Identity & Profiles** wrap everything — who you are and what you've allowed.
- **The Finance Engine** is the source of truth for all numbers. *Every* calculation comes from here (a core [business rule](business-rules.md)).
- **The AI Guidance Layer** reads from the Finance Engine to explain and coach — it never calculates money itself and never transacts.
- **The Human Help Layer** lets users bring in advisors and agencies, who see the user's context (with permission).
- **Community & Learning** surround the experience with education and peer support.
- **Future AI Agents, APIs, and white-label** extend the platform into an open ecosystem.

---

## Core experience flow

1. **Onboard** — Create an account, set up a profile, state goals and preferences.
2. **Capture** — Record (or connect) income and expenses; the Finance Engine builds the picture.
3. **Understand** — See dashboards and reports; ask the AI Coach to explain.
4. **Plan** — Set budgets, savings targets, and goals.
5. **Act & improve** — Follow nudges, track progress, adjust.
6. **Get help (optional)** — Bring in AI, an advisor, or an agency as needed.
7. **Grow** — Move into deeper modules (investments, insurance, retirement, tax) over time.

The user can enter at any step and choose how much help they want at each one.

---

## The independence spectrum

The defining characteristic of WealthWise is **choice of help level**:

| Level | Who drives | What WealthWise provides |
|---|---|---|
| Self-directed | The user | Tools, reports, education |
| AI-guided | The user + AI | Explanations, nudges, coaching |
| Advisor-assisted | The user + a human advisor | Marketplace match, shared context, meetings |
| Agency-managed | A professional firm | Full-service, multi-advisor, branded experience |

A user can move between levels at any time without losing their history or context.

---

## Module groups at a glance

The platform's capabilities are organized into groups. Each is detailed in [Modules](modules.md).

- **Foundation:** Authentication, User Profiles, Notifications
- **Finance Engine:** Income, Expenses, Budgeting, Savings, Goal Planning, Net Worth, Emergency Fund, Debt Management
- **Wealth Planning:** Investment Planning, Insurance, Retirement, Tax Planning
- **Insight:** Financial Reports, Analytics
- **Intelligence:** AI Coach, AI Agents (future)
- **Human Network:** Advisor Marketplace, Agency Portal, Meetings, Messaging, Document Management
- **Operations:** Admin Portal, Subscriptions
- **Ecosystem:** Community, Learning Hub

---

## What WealthWise is not

- **Not a bank.** It does not hold or move money.
- **Not a robo-trader.** AI does not execute trades or transactions.
- **Not a replacement for human advisors.** It augments and connects to them.
- **Not a black box.** Every recommendation is explainable.

---

## How the pieces depend on each other (conceptually)

- Everything depends on **Identity & Profiles**.
- All insight, AI, and human-help layers depend on the **Finance Engine** as the single source of truth.
- The **Human Network** depends on the **Organization Model** ([Platform → Agency → Advisor → Client](organization-model.md)) for structure and data isolation.
- **Intelligence (AI)** depends on clear **Business Rules** to stay safe and bounded.

A full dependency map lives in the [WealthWise Bible](wealthwise-bible.md#feature-dependency-map).
