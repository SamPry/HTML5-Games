# HTML5 Football Manager

A browser-based football management prototype built with TypeScript, Vite, and a canvas-driven UI. The simulation focuses on deterministic results, squad building depth, and a slick management layer inspired by modern sports titles.

## Feature highlights

- 🌍 **Global league world** – Manage any club across the top 10 divisions, with second tiers for the leading six nations and third tiers for the top three.
- 🏟️ **Club onboarding** – Start each career by choosing your club from a glassmorphic selector. Your choice persists across saves and drives every dashboard view.
- 🛠️ **Create-a-club** – Found a new team, pick league placement, colours, ambition, and let the game spin up a bespoke squad with budgets shaped by real-world valuations.
- ⚽ **Seeded simulations** – Deterministic match engine with manual instant-result controls and daily scheduling so careers remain reproducible.
- 📊 **Dynamic insights** – Standings browser, form trackers, scouting snapshots, and tactical breakdowns updated as you progress through the season.
- 🤝 **Transfers & finances** – Market listings, bid flows, wage budgets, and club finances that update in real time.
- 🎨 **Adaptive themes** – Light/dark palettes, gradients, and responsive cards tuned for desktop and tablet play.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open the printed URL (defaults to `http://localhost:5173`) in your browser. The app is a single-page experience—no extra backend setup required.
3. **Build for production**
   ```bash
   npm run build
   ```
   Output files appear in `dist/` and can be served from any static host.

4. **Launch without a dev server (optional)**
   ```bash
   npm run build:standalone
   ```
   This generates a precompiled bundle in `standalone/`. Opening `index.html` directly from disk will automatically fall back to this bundle if the TypeScript sources cannot be loaded.

For troubleshooting tips, dependency notes, and environment configuration details, see [docs/local-development.md](docs/local-development.md).

## Project structure

```
src/
  app/         # store setup, world bootstrapping, commands
  core/        # shared math, RNG, scheduler logic
  data/        # league packs, team definitions, fixtures
  domain/      # typed models for clubs, players, transfers
  engine/      # match simulation utilities and schedulers
  ui/          # screens, components, canvas pitch renderer
  styles.css   # design tokens and theme definitions
```

### Key scripts

- `npm run dev` – start the Vite dev server with hot module replacement.
- `npm run build` – create an optimised production bundle.
- `npm run build:standalone` – refresh the on-disk bundle used when opening `index.html` without running a server.
- `npm run preview` – serve the production build locally for smoke testing.

### Tech stack

- **Language:** TypeScript (strict mode)
- **Bundler:** Vite + ESBuild
- **State:** Zustand with Immer for mutations
- **UI:** HTML/CSS with canvas-driven match visualisations
- **Persistence:** IndexedDB (via lightweight repository utilities)

## Save data

Save games, theme choices, and simulation seeds are stored in the browser. Use the in-app export controls (coming soon) to back up your careers or migrate them to another device.
