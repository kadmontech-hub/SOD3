# Architecture

## Runtime

`server.mjs` serves the app and provides a small JSON API. `public/js/app.js` owns route rendering and lifecycle cleanup. Views remain data-driven through `content.js`, while user progression is persisted in localStorage through `store.js`. Private journal entries are persisted in `data/store.json` through the API.

## Experience layers

1. DOM shell: routes, forms, accessible controls, settings and content.
2. Immersive scene: `HubScene` renders camera movement, star field, grid, orb and hotspots.
3. Spatial UI: synchronized DOM panels and Canvas hotspot feedback.
4. Audio: opt-in Web Audio generator.
5. Data/progression: local state plus replaceable server API.

## Replacement path

- Replace `HubScene` with a React Three Fiber package while keeping universe slugs and action contracts.
- Replace `api.dialogue()` endpoint implementation with an LLM provider adapter.
- Replace local auth state with secure server sessions.
- Migrate JSON storage to PostgreSQL without changing the public client API.
- Import official Elementos and Semillas into structured data; never hardcode them into visual components.
