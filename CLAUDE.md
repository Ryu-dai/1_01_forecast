# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (also validates TypeScript via Next.js)
npm run lint     # ESLint check
```

Type-check without building:
```bash
node -e "require('./node_modules/typescript/lib/tsc.js')"
```

> Note: `npx tsc` and `./node_modules/.bin/tsc` are broken on Node v22 due to symlink resolution. Use the `node -e require(...)` form above instead.

There are no tests in this project.

## Architecture

Single-page app (`src/app/page.tsx`, `"use client"`). All state lives in the `useSimulation` hook — no routing, no server components beyond the root layout.

### Data flow

```
SimParams (user input)
  → useSimulation (useState + useMemo + 150ms debounce)
    → runSimulation(params): SimResult   [src/lib/calc.ts]
      → getAwarenessWeights()            [src/lib/awareness.ts]
    → rendered by dashboard components
```

**Debounce split**: sliders call `setParams` (debounced 150ms); number inputs and buttons call `setParamsImmediate` (instant). Both update the same `params` state but only flush `debouncedParams` at different rates.

### Key calculations (`src/lib/calc.ts`)

- **Effective margin** = `(price - cogs) × channel-weighted margin multiplier`
- **Required units** = `⌈targetProfit ÷ effectiveMargin⌉`
- **Monthly units** distributed by awareness weights (normalized to sum = 1.0)
- **Achievability %** = `min(100, maxPossibleProfit ÷ targetProfit × 100)` where max possible profit is limited by `min(weeklyProductionCap, teamSize × productionPerPerson ÷ 4.33)`

### Tailwind CSS v4 dark mode

No `tailwind.config.js` exists. Dark mode is class-based, configured in `globals.css`:
```css
@variant dark (&:where(.dark, .dark *));
```
All theme colors are CSS variables (`--background`, `--card-bg`, `--border`, `--muted`, `--chart-*`) defined in `:root` and `.dark` blocks. Use these variables in components rather than hardcoded Tailwind color classes.

### Recharts Tooltip formatter typing

Recharts passes `value: number | undefined` and `name: string | undefined` to `formatter`. Always type both as nullable:
```tsx
formatter={(value: number | undefined, name: string | undefined) => [...]}
```

### Channel 100% constraint

`ChannelDistribution.tsx` uses proportional redistribution: when one channel changes, the other three are rescaled proportionally to their current values. Rounding errors are absorbed by the largest remaining channel.
