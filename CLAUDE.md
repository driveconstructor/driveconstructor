# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application (runs Jest tests first)
- `npm run serve` - Serve the built application from `out` directory

### Testing

- `npm run test` - Run unit tests with Jest
- `npm run test:e2e` - Run end-to-end tests with Playwright (requires built
  application)

### Code Quality

- `npm run format` - Format all code with Prettier
- `npm run verify` - Full verification pipeline (format, build, e2e tests)

**Code Style**: Always use Prettier for code formatting. Run `npm run format`
after making changes to ensure consistent code style across the project.

### Setup

- `npm install` - Install dependencies
- `npx playwright install` - Install Playwright browser dependencies (for e2e
  tests)

## Project Architecture

### Core Application Structure

DriveConstructor is an educational tool for electrical engineers built with
Next.js 15 and React 19. The application helps users design and analyze
electrical drive systems through interactive modeling.

### Key Architectural Patterns

#### Model-View Architecture

- **Models** (`src/model/`): Core business logic for electrical systems and
  components
- **Views** (`src/app/`): Next.js App Router pages and components
- **Store** (`src/model/store.ts`): LocalStorage-based persistence with system
  CRUD operations

#### System Types and Component Modeling

- **System Types**: Pump, Winch, Wind, Conveyor systems with variants (Fc, GbFc,
  FcTr, GbFcTr)
- **Components**: EMachine, FConverter, Cable, Gearbox, Trafo with sizing
  algorithms
- **Dynamic Model Customization**: Components adapt based on system
  configuration (e.g., SyRM motors limit frequency converter types)

#### Data Flow

1. User inputs system parameters
2. `updateParam()` triggers recalculation and sizing
3. `withCandidates()` generates component options
4. System state persisted to localStorage
5. Real-time updates to UI and validation

### Key Files and Directories

#### Core Model Files

- `src/model/system.tsx` - System type definitions and model registry
- `src/model/component.tsx` - Component model framework
- `src/model/store.ts` - System persistence and state management
- `src/model/sizing.ts` - Component sizing algorithms
- `src/model/*-system.tsx` - Individual system type definitions
- `src/model/*-component.tsx` - Component-specific models and sizing

#### Application Pages

- `src/app/(home)/systems/[kind]/page.tsx` - System design interface
- `src/app/(home)/my-systems/page.tsx` - Saved systems management
- `src/app/docs/` - Documentation site using Fumadocs

#### Documentation

- `content/docs/` - MDX documentation source
- `source.config.ts` - Fumadocs configuration for documentation processing

### Technology Stack

- **Framework**: Next.js 15 with App Router and static export
- **UI**: React 19, Tailwind CSS, Heroicons
- **Documentation**: Fumadocs with MDX, KaTeX for math rendering
- **Testing**: Jest (unit), Playwright (e2e)
- **Build**: TypeScript, ESLint, Prettier
- **Charts**: Chart.js with react-chartjs-2

### Testing Strategy

- Unit tests in `src/model/__tests__/` focus on sizing algorithms and utilities
- E2E tests in `tests/` verify complete system workflows
- Tests run on production build (`npm run serve`) for realistic conditions

### Build and Deployment

- Static site generation with Next.js export
- GitHub Actions workflow deploys to staging repository
- Content Security Policy configured for static hosting
- Math rendering with KaTeX, image optimization

### Development Notes

- Uses localStorage for client-side persistence
- System IDs generated with crypto.randomUUID()
- Draft systems have `draft_` prefix for temporary storage
- Component candidates generated dynamically based on system requirements
- Real-time validation and error display for system parameters
