# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

You must response in Japanese.

## Project Overview

This is a **門田匡陽 (Monden MASAAKI) Timeline Website** project that converts musician activity records from Markdown files into a timeline visualization. The project consists of:

1. **Data Processing Pipeline**: Converts 500+ Markdown articles about Monden MASAAKI's musical activities into structured JSON timeline data
2. **Timeline Website**: Will display a Japanese vertical text, horizontal scroll timeline interface with a minimalist monochrome design

## Core Architecture

### Data Layer

- **Source Data**: `data/articles/*.md` - 500+ chronologically-named Markdown files (format: YYYY-MM-DD-HHMMSS.md)
- **Output Data**: `data/timeline.json` - Structured timeline data following defined schema in `docs/design-spec.md`
- **Content Structure**: Each Markdown file has YAML frontmatter (title, date, tags) plus structured content sections

### Processing Pipeline

- **Main Script**: `scripts/convert-articles-to-timeline.js` - ESM module that processes all articles
- **LLM Integration**: Uses Claude API (Anthropic) for intelligent content summarization (with fallback to rule-based logic)
- **Data Transformation**: Extracts metadata, categorizes events (release/live/collaboration/other), generates concise descriptions

### Timeline Data Schema

Each timeline entry contains:

- `id`: Generated from filename
- `date`: YYYY-MM-DD format
- `title`: Cleaned title (dates removed automatically)
- `description`: ~20 character LLM-generated summary
- `projectCategory`: Auto-categorized from tags (BURGER NUDS, Good Dog Happy Men, Poet-type.M, etc.)
- `eventType`: release|live|collaboration|other
- `media`: Optional YouTube/image embedments

## Essential Commands

### Monorepo Management

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Start development servers
pnpm run dev

# Timeline website specific
pnpm run timeline:dev

# Data processing
pnpm run timeline:build
```

### Data Processing

```bash
# Convert all Markdown articles to timeline JSON
cd apps/data-processor
pnpm run build

# With Claude API for better summaries (requires ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY="your-key"
cd apps/data-processor
pnpm run build
```

### Development Environment

- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Module System**: ESM (package.json has "type": "module")
- **Workspaces**: apps/timeline-website, apps/data-processor, packages/shared

## Data Processing Behavior

### Title Cleaning

Automatically removes date patterns from titles:

- `2024-03-13 - Title` → `Title`
- `Title (2024-03-13)` → `Title`
- `2024年3月13日 - Title` → `Title`

### LLM Summarization

- **Primary**: Claude API (Haiku model) generates ~20 character summaries
- **Fallback**: Rule-based logic when API unavailable
- **Context-Aware**: Recognizes release dates, venues, event types
- **Progress Tracking**: Shows processing status for 500+ files

### Event Categorization

Auto-detects from frontmatter tags:

- **Release**: Albums, singles, demos
- **Live**: Concert performances
- **Collaboration**: Joint projects
- **Other**: Studios, labels, misc activities

## File Naming Conventions

- Articles: `YYYY-MM-DD-HHMMSS.md` (chronological order)
- Multiple same-day events: `_1`, `_01`, etc. suffixes
- Special entries: Descriptive names like `knockout.md` for venue info

## Timeline Website Architecture (Future)

Based on `docs/design-spec.md`:

- **Framework**: Next.js static export
- **Layout**: Year sections → Month sections → Events
- **Design**: Monochrome, minimalist, soft Japanese aesthetic
- **Target**: PC-first (mobile later)

## Content Processing Notes

- **Frontmatter**: YAML with title, date, tags array
- **Content Sections**: Structured with ## headers (基本情報, 収録曲, etc.)
- **Media Extraction**: Auto-detects YouTube URLs and image references
- **Japanese Text**: Handles vertical writing, kanji dates, music terminology
- **Historical Span**: Covers 1999-2025 (25+ years of activity)

## Environment Variables

- `ANTHROPIC_API_KEY`: Required for Claude API summarization (optional, has fallback)

## File Organization Rules

- stories ファイルは実装ファイルとおなじディレクトリに配置する

## Development Philosophy

- Web 標準に則った実装を行う
- React Component の設計・実装は Dan Abarmov の方針に従う

## Japanese Text Design Considerations

- WebUI において、日本語では Italic を使うと読みづらいので使わない

## CSS Framework Strategy

### Tailwind CSS v4 を採用

**採用理由：**
- 既存環境に含まれており追加設定が最小限
- ユーティリティファーストで開発効率が高い
- Next.js 15 + TypeScriptとの親和性が高い
- レスポンシブ対応が簡潔（sm:, md:, lg: prefix）
- 日本語フォント対応とカスタマイズ性に優れる

**実装方針：**
- インラインスタイルからTailwindクラスへ段階的移行
- レスポンシブデザインパターンの統一
- 日本語表示に最適化されたタイポグラフィ設定
- カスタムカラーパレットでブランド一貫性確保

**デザインシステム：**
- モノクロ基調の minimalist デザイン
- 日本語縦書き対応（将来的）
- PC-first design with mobile optimization

## Task Completion Reminder

- タスク完了後は必ず git commit を実行すること
- 変更内容を適切にコミットメッセージに記載すること
- Claude が実装したことがわかるようにすること

## Development Workflow

- デザイン確認をするときは、該当のコンポーネントのみを Storybook で表示して、Playwright MCP で確認する。
- `--initial-path` で該当のコンポーネントへのパスを指定して単独表示
- `STORYBOOK_ENABLE_FULLSCREEN=true` の環境変数を渡すことで、全画面表示にする

## Build and Testing Considerations

- ビルドによるエラーの確認は、pnpm run typecheck で行う
- モノレポ全体のビルドは、pnpm run build で行う
- 個別アプリケーションのテストは、各ディレクトリで実行

## Command Line Tools

- より高速なコマンドとして、findコマンドのかわりにfdfind、grepの代わりにrgコマンドが利用できるため、優先してください