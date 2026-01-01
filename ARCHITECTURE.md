# ARCHITECTURE

This document defines architectural decisions for **AtoZyx LaunchPad**.

---

## Architecture Style: Modular Monolith

We use a **Modular Monolith** architecture. This means the application is deployed as a single unit (Next.js App), but the code is organized into distinct, loosely coupled modules or features. We avoid the complexity of microservices while maintaining the maintainability of separation of concerns.

## Layers

1.  **UI Layer**: Client Components (Interactions, Forms) and Server Components (Layouts, Data Fetching).
2.  **Application Layer**: Orchestration of logic, coordinating between UI and Domain layers.
3.  **Domain Layer**: Pure business logic (Rules Engine, Scope Calculation). This layer should be framework-agnostic where possible.
4.  **Data Layer**: Database interaction (Supabase Client), External APIs.

## Directory Structure

We follow a feature-driven structure combined with standard Next.js conventions.

- `src/app`: **Routes**. Defines the URL structure. Keeps logic minimal, delegating to features.
- `src/components/ui`: **Design System**. Shared, dumb components (Buttons, Inputs) powered by Shadcn/ui.
- `src/features`: **Vertical Slices**. Contains components, hooks, and logic specific to a feature (e.g., `features/auth`, `features/roadmap`).
- `src/lib`: **Core Logic**. Shared utilities and the **Rules Engine**.
- `src/services` or `src/api`: **Data Access**. Encapsulates Supabase calls and API requests.
- `src/hooks`: **Global Hooks**. Reusable React hooks.

## Data Flow

### Server Components

- **Fetch**: Directly communicate with Supabase using the Service Role or Authenticated Client.
- **Render**: Pass data down to Client Components as props.

### Client Components

- **Fetch**: Use **React Query** (TanStack Query) to manage server state (caching, loading, error states).
- **Mutate**: Use React Query mutations for POST/PUT/DELETE operations.
- **State**: Local state for UI interactions; URL search params for shareable state.

## The Rules Engine

A core differentiator of LaunchPad is **Deterministic Logic**.

- Located in `src/lib/rules-engine`.
- **Input**: User answers (Forms).
- **Process**: Pure functions applying strict business rules.
- **Output**: Calculated Scope, Roadmap, and Tech Stack.
- **No Magic**: Every output must be traceable to a specific rule.

## Key Principles

- **Opinionated Defaults**: Don't ask the user if we can decide for them.
- **No Business Logic in UI**: Components should only care about presentation. Move logic to hooks or utility functions.
- **Versioned Data**: Product Plans are versioned. Immutability is preferred for historical records.

---

Architecture exists to protect clarity.
