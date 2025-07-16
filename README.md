# Timeline Monorepo

門田匡陽 (Monden MASAAKI) Timeline Website - A turborepo monorepo project that converts musician activity records from Markdown files into a timeline visualization.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Start development
pnpm run dev
```

## Project Structure

```
├── apps/
│   ├── timeline-website/    # Next.js timeline website
│   └── data-processor/      # Data processing scripts
├── packages/
│   └── shared/              # Shared types and utilities
├── data/                    # 500+ Markdown files
└── scripts/                 # Legacy scripts
```

## Development

### Monorepo Commands
```bash
pnpm run dev            # Start all apps in dev mode
pnpm run build          # Build all packages
pnpm run typecheck      # Type check all packages
pnpm run lint           # Lint all packages
pnpm run format         # Format all packages
pnpm run clean          # Clean all build artifacts
```

### App-specific Commands
```bash
pnpm run timeline:dev   # Start timeline website only
pnpm run timeline:build # Build data processor only
```

### Individual Package Development
```bash
cd apps/timeline-website
pnpm run dev            # Development server
pnpm run storybook      # Component development

cd apps/data-processor
pnpm run build          # Process markdown files
```

## Features

- **Timeline Website**: Interactive timeline with year/month navigation
- **Data Processing**: LLM-powered content summarization
- **Responsive Design**: Mobile-first approach
- **Media Support**: YouTube and image embeds
- **URL Sharing**: Anchor-based navigation
- **Monorepo**: Turborepo with pnpm workspaces

## Tech Stack

- **Build System**: Turborepo + pnpm
- **Frontend**: Next.js 15, React 19, TypeScript
- **Data Processing**: Node.js, Claude API
- **Styling**: Tailwind CSS (v4)
- **Development**: Storybook, ESLint, Prettier