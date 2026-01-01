# AtoZyx LaunchPad

## 📊 Project Dashboard

**Current Status**: 🚧 In Progress
**Active Phase**: Phase 1 (MVP) -> Database & Authentication

| Metric              | Status         | Progress |
| :------------------ | :------------- | :------- |
| **Overall Phase 1** | 🚧 In Progress | 5%       |
| **Frontend**        | ⚪ Pending     | 0%       |
| **Backend**         | 🚧 Active      | 10%      |
| **Testing**         | ⚪ Pending     | 0%       |

### 🧪 Test coverage

| Type            | Count | Status |
| :-------------- | :---- | :----- |
| **Unit Tests**  | 0     | ⚪     |
| **Integration** | 0     | ⚪     |
| **E2E**         | 0     | ⚪     |

### 🏎️ Current Focus: Database & Authentication

- [ ] Set up Supabase project
- [ ] Configure Supabase Auth
- [ ] Create `ProductPlan` table schema
- [ ] Create `PlanVersion` table schema
- [ ] Generate TypeScript types

---

**Turn product ideas into execution-ready plans.**

AtoZyx LaunchPad is a structured web application that helps founders and product teams convert vague ideas into **clear, buildable, execution-ready product plans** — before writing production code.

This project is opinionated by design. It enforces clarity, constraints, and engineering discipline where most products fail: **before development starts**.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL (or Supabase project)
- npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-org/atozyx-launchpad.git
    cd atozyx-launchpad
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Duplicate `.env.example` to `.env.local` and fill in the required values.

    ```bash
    cp .env.example .env.local
    ```

    See [ENVIRONMENT.md](ENVIRONMENT.md) for details.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Project Structure

This project follows a modular monolith structure within the Next.js App Router.

- `src/app`: Application routes and pages.
- `src/components/ui`: Reusable UI components (Shadcn/ui).
- `src/features`: Feature-specific components and logic.
- `src/lib`: Core utilities and business logic (Rules Engine).
- `src/services`: API clients and data fetching services.

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown.

---

## Documentation

- **Contributing**: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- **Core Principles**: [README.md](README.md)
  The detailed documentation is currently internal. The public roadmap and architecture overview are available below.

- **Roadmap**: [ROADMAP.md](ROADMAP.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Why this exists

Most products struggle early due to:

- Unclear problem definition
- Endless scope creep
- No explicit MVP boundaries
- Weak technical planning
- Misalignment between founders and developers

LaunchPad solves this by guiding users through a **deterministic, step-by-step flow** that answers:

1. What should we build?
2. What should we not build?
3. How should it be built?

---

## Core Capabilities

- Idea Clarifier
- MVP Scope Builder
- Execution Roadmap
- Tech Stack Recommendation
- Versioned Product Plans
- Export & Share (PDF / DOCX)

---

## Product Principles

- Opinionated over flexible
- Constraints over customization
- Clarity over speed
- Deterministic logic over magic
- Engineering discipline first

---

## Tech Stack

- Next.js (App Router)
- React
- PostgreSQL
- Supabase (Auth & DB)
- Tailwind CSS & Shadcn/ui

---

## License

MIT License

---

## About AtoZyx

AtoZyx is a product-first software engineering company.

> **A–Z Solutions. From Idea to Product.**

<!-- DYNAMIC_DASHBOARD_START -->

### 🎯 Project Progress (Task Board)

| Phase / File         | Total | Done | Progress       |
| :------------------- | :---- | :--- | :------------- |
| **Master Task List** | 131   | 20   | ██░░░░░░░░ 15% |

### 🚧 Active Stories (Branches)

| Type       | Story (Branch)                      | Tasks (Commits) | Last Update | Report                                                           |
| :--------- | :---------------------------------- | :-------------- | :---------- | :--------------------------------------------------------------- |
| **'chore** | `'chore/fe/project-initialization'` | 0               |             | [View Report](work-reports/'chore/fe/project-initialization'.md) |
| **other**  | `'develop'`                         | 0               |             | [View Report](work-reports/'develop'.md)                         |
| **other**  | `'master'`                          | 0               |             | [View Report](work-reports/'master'.md)                          |

<!-- DYNAMIC_DASHBOARD_END -->
