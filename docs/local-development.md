# Running HTML5 Football Manager Locally

Follow these steps to set up the project on your machine and start iterating on the game.

## Prerequisites

- [Node.js](https://nodejs.org/) **18.0.0 or later** (Vite 5 requires Node 18+).
- npm (bundled with Node.js).

Check your versions:

```bash
node --version
npm --version
```

## Install dependencies

From the repository root, install the project dependencies:

```bash
npm install
```

This will fetch TypeScript, Vite, and other tooling specified in `package.json`.

## Start the development server

Launch Vite's dev server with hot module replacement:

```bash
npm run dev
```

The terminal will print a local URL (typically `http://localhost:5173`). Open it in your browser to see the game. Changes to TypeScript, HTML, or CSS files will automatically trigger a reload.

## Build for production

Generate an optimized production build:

```bash
npm run build
```

This command type-checks the code and emits static assets in the `dist/` folder.

## Preview the production build

Serve the built assets locally to verify the production output:

```bash
npm run preview
```

This runs a static server backed by the `dist/` directory. Stop the server with `Ctrl+C` when you're done.

## Troubleshooting

- Delete `node_modules` and run `npm install` again if dependency issues appear.
- Ensure no other process is using the dev server port (`5173` by default).
- Use a modern Chromium, Firefox, or WebKit-based browser for the best experience.
