# BRICS Digital Public Infrastructure Portal

React/Vite frontend with an Express API for citizen reports, government triage, voice reporting, cost estimates, and simulated notifications.

## Run locally

Requirements: Node.js 20.19 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Without `GEMINI_API_KEY`, the AI endpoints use the built-in demo responses. To enable Gemini, set `GEMINI_API_KEY` in your environment before starting the server.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Use the repository root as the project root.
3. Let Vercel detect the Express application from `server.ts`.
4. Set the build command to `npm run vercel-build` (or let Vercel run the `vercel-build` lifecycle script).
5. Leave the output directory unset. Vite writes the client bundle to `public/`, which Vercel serves as static assets; `server.ts` is the Express Function for `/api/*` requests.
6. Add `GEMINI_API_KEY` in Project Settings → Environment Variables if Gemini features are needed, then redeploy.

The complaint list and notification feed currently live in process memory and are seeded demo data. Vercel Functions can restart or run in parallel, so user-submitted data is not durable or guaranteed to be shared between requests. A database must be connected before using this as a production grievance system.

## Scripts

- `npm run dev` — local Express server with Vite middleware
- `npm run build` — production client plus local server bundle
- `npm run vercel-build` — client build for Vercel
- `npm run lint` — TypeScript check
- `npm start` — start the locally bundled production server
