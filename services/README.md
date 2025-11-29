# Services

Backend services for the project.

This folder contains a git submodule that points to the public repo `TilovD/belegbuch-match` which provides parsing logic, supabase functions, and integrations.

Submodule path: `services/belegbuch-match/`

Quick start options:

- Option A: Run Supabase Functions locally (recommended for testing)
  1. Install Supabase CLI: https://supabase.com/docs/guides/cli
  2. Start supabase local dev stack:
	  ```bash
	  cd services/belegbuch-match
	  supabase start
	  ```
  3. Serve functions locally and test `process-receipt`:
	  ```bash
	  cd services/belegbuch-match/supabase
	  supabase functions serve process-receipt
	  ```
  4. Call function from frontend (local dev):
	  - `POST http://localhost:54322/functions/v1/process-receipt` with JSON body {document_id}

- Option B: Deploy functions to a Supabase project and call them from the frontend
  1. Configure `.env` in frontend with `VITE_SUPABASE_URL` & `VITE_SUPABASE_KEY`
  2. Deploy functions using Supabase CLI or the Supabase dashboard

Notes:
- The `belegbuch-match` codebase uses Deno for functions; follow the submodule README for exact `supabase` function deployment instructions.
- If you prefer not to run Supabase locally, we can add a lightweight Node adapter that exposes the same function endpoints and runs the parsing logic inside a Node container (optionally via Docker). Ask and I'll create a POC adapter.
