# Copilot Instructions for FishCast

## Build & Dev Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check (`tsc -b`) then bundle with Vite
- `npm run lint` — ESLint across all TS/TSX files
- `npm run preview` — Preview the production build locally

No test framework is configured.

## Architecture

FishCast is a PWA that recommends bass fishing lures, colors, retrieves, and depths based on real-time weather and location data. All APIs used (Open-Meteo weather/geocoding, Browser Geolocation) are free and require no API keys.

### Data flow

```
User input (geolocation or zip/city)
  → services/location-service  (resolve coordinates)
  → services/weather-service   (fetch from Open-Meteo)
  → services/condition-deriver (pure functions: weather → fishing conditions)
  → engine/recommendation-engine (score & rank lure/color/retrieve/depth combos)
  → store/app-store            (Zustand — single source of truth)
  → components/*               (read from store, render)
```

The `useFishCast` hook orchestrates this entire pipeline — it is the only place that calls services and writes to the store.

### Key layers

- **`src/engine/`** — Pure, deterministic scoring logic. Each lure, color, retrieve, and depth defines a `ScoreFn` that returns `{ points, reasons }`. The engine combines these via affinity matrices that prevent nonsensical combos (e.g., topwater lure + deep depth). Domain types live in `engine/types.ts`.
- **`src/services/`** — Data fetching and transformation. Services return fully-typed objects; all external calls go through here. Temperature values flow in Fahrenheit internally; components handle conversion for display.
- **`src/store/`** — Zustand store with selective persistence (`fishcast-settings` key persists only user settings). Components use selector pattern: `useAppStore((s) => s.field)`.
- **`src/components/`** — Presentational React components. Full-screen overlays (DetailView, Settings) are conditionally rendered in App.tsx, not routed.
- **`src/hooks/`** — `useFishCast` is the sole orchestration hook bridging services → engine → store.

## Conventions

### TypeScript

- Use the **const-as-enum pattern** for domain enums, not TypeScript `enum`:
  ```ts
  export const WaterClarity = { Clear: 'Clear', Stained: 'Stained', Muddy: 'Muddy' } as const;
  export type WaterClarity = typeof WaterClarity[keyof typeof WaterClarity];
  ```
- All domain types are centralized in `src/engine/types.ts`. Import from there.
- Use `import type { ... }` for type-only imports (enforced by `verbatimModuleSyntax`).
- No `any` types — the codebase is strict TypeScript with `noUnusedLocals` enabled.

### Scoring functions

Every lure, color, retrieve, and depth definition includes a `score: ScoreFn` that receives `(conditions: DerivedConditions, weather: WeatherData)` and returns `{ points: number, reasons: string[] }`. Reasons are human-readable strings displayed in the UI. When adding new scoring items, you must also add entries to the affinity matrices in `recommendation-engine.ts` (`lureRetrieveAffinity`, `lureDepthAffinity`).

### Zustand store

- Always access via selector: `useAppStore((s) => s.location)` — never import the store object directly into components.
- Actions follow `set<Entity>` / `set<Entity>Loading` / `set<Entity>Error` naming.
- Only `settings` is persisted; all other state resets on reload.

### Styling

- Tailwind CSS 4 via Vite plugin (no PostCSS config). No external UI component library.
- Primary color: `emerald-600`. Confidence levels: `emerald-500` (high), `yellow-500` (medium), `orange-500` (low).
- Cards use `rounded-2xl`, buttons use `rounded-xl`, tags/badges use `rounded-full`.
- Icons are inline SVGs (Heroicons style), not an icon library import.

### Components

- Functional components only. PascalCase filenames (e.g., `RecommendationCard.tsx`).
- Full-screen overlays pattern: `{condition && <Overlay onClose={() => setCondition(false)} />}` in App.tsx.
- IDs use kebab-case. Recommendation IDs are composite: `${lureId}-${colorId}`.

### Package management

- npm with `legacy-peer-deps=true` (see `.npmrc`).
