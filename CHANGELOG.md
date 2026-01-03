<!-- 
  ⚠️ AUTO-GENERATED FILE. DO NOT EDIT. 
  Source: CHANGELOG.md (Private Master)
  Run 'node scripts/generate-public-changelog.js' to update.
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-01

### Added

- [FE] Build Public Shared View (Token-based Read-only)
- Security: Ensure no edit capabilities
- [BE] Implement Share Token Logic (Read-only access)
- Layout: Clean, distinct from Web UI
- [BE] Implement `calculateMVPComplexity(inputs)`
- Rule: No Auth -> Roles disabled
- Rule: Subscriptions -> Increase Billing complexity
- Rule: Admin Panel -> High complexity bump
- [BE] Implement `generateRoadmap(complexity)`
- Logic: Map score to timeline bands (weeks, not dates)
- Logic: Identify External Dependencies (Rights/Risk)
- [BE] Implement `recommendTechStack(constraints)`
- Rule: Small team + speed -> Next.js + Supabase
- Rule: Scale required -> Next.js + Postgres + AWS
- Rule: Payments needed -> Stripe
- **Rules Engine Implementation** (`src/lib/logic/rulesEngine.ts`):
  - `calculateComplexity`: Dynamic score based on features.
  - `generateRoadmap`: Server-side timeline generation.
  - `recommendTechStack`: Context-aware stack recommendations.
- **Backend Persistence**:
  - Wired Steps 1-5 to Supabase via Server Actions (`planActions.ts`).
  - Implemented `createPlan`, `updatePlanStep`, and `finishPlan`.
  - Added data pre-filling for all wizard steps ("Edit Mode").
- **UI Improvements**:
  - Refactored Wizard Steps to Server Component + Client Form pattern.
  - Interactive Complexity Meter (Step 2).
  - Status-aware Stepper Navigation (Step 5).
- Shared Feature Configuration (`src/lib/config/features.ts`).

## [0.1.10] - 2026-01-02

### Added

- [FE] Build Category Selection UI (Auth, Roles, Core Features)
- UI: Toggle switches / Multi-select cards
- [FE] Implement Complexity Score Calculation
- Logic: Real-time update of complexity bar/meter
- [FE] Display Milestones and Dependencies
- [FE] Implement Inputs: Problem, User, Value Prop, Alternatives
- Field: Non-Goals (Mandatory)
- [FE] Implement Auto-save logic
- Show "Saving..." / "Saved" status
- [BE] Generate TypeScript types from schema
- [FE] Build Review Page (Read-only summary)
- Generated: "Product Brief" summary section
- [FE] Implement PDF Export functionality
- [FE] Implement Timeline Generation Logic based on Complexity
- [FE] Build Input Form (Product Type, Scale, Team)
- [FE] Display Recommended Stack
- [FE] Build Public Landing Page (Home)
- [FE] Create Dashboard Layout
- [FE] Build Login Page
- Implement Form Validation (Zod/HTML5)
- Handle Loading & Error States (via Server Actions)
- [FE] Build Signup Page
- [FE] Implement Auth Context/Middleware for protected routes
- Redirect unauthenticated users to Landing Page
- Persist session on reload
- [BE] Set up Supabase project
- [BE] Configure Supabase Auth (Email/Password)
- [BE] Create `ProductPlan` table schema
- [BE] Create `PlanVersion` table schema
- Script: `release-cut.ts` (Automated Version Bump)
- Workflow: `release-main.yml` (Trigger Release)
- Workflow: `back-merge.yml` (Sync `main` -> `develop`)
- [FE] Initialize Next.js app with TypeScript & TailwindCSS
- [FE] Configure ESLint and Prettier
- [FE] Set up absolute imports and directory structure
- [FE] Install ShadcnUI/Component library dependencies
- Logic: Recursive directory walk
- Rule: Folders must be `kebab-case`
- Rule: Components must be `PascalCase`
- Rule: Utils/Hooks must be `camelCase`
- Scan: `src/**/*.tsx` for `process.env.*` usages
- Alert: If client-side code uses non-public env vars
- Integration: Add to `lint-staged` or `pre-push`
- Regex: Detect `import ... from '../src/...'` patterns
- Fix: Suggest alias usage `@/`
- [DOCS] Create README, ARCHITECTURE, CONTRIBUTING
- [DOCS] Define Project Rules (Rules Engine)
- [DOCS] Create `generate-docs-tree.ts`
- [DOCS] Create `generate-rules-summary.ts`
- [DOCS] Create `generate-public-changelog.ts`
- Initial project structure.
- Documentation: README, ARCHITECTURE, CONTRIBUTING, TESTING, ENVIRONMENT.
- Agent rules and context files.

## [0.1.0] - 2026-01-01

### Added

- Project initialization with Next.js, TypeScript, TailwindCSS, and ESLint.
- Shadcn/UI configuration.