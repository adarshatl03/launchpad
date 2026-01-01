<!-- 
  ⚠️ AUTO-GENERATED FILE. DO NOT EDIT. 
  Source: CHANGELOG.md (Private Master)
  Run 'node scripts/generate-public-changelog.js' to update.
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-01-01

### Added

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