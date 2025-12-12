## Overview
- Backend (Node.js Express API) and `jewelry` frontend with admin run on your server.
- Database lives on Supabase Cloud (managed Postgres) with daily backups and PITR.

## Defaults
- Region: US-East.
- Backups: Daily, 7-day retention, point-in-time recovery.
- Cost: Your server for app; Supabase free tier initially, ~$25/mo+ when scaling.

## Environment Variables (Correct Names)
- Backend `.env`:
  - `PORT=3000`
  - `ADMIN_API_TOKEN=`
  - `ADMIN_JWT_SECRET=`
  - `GOOGLE_CLIENT_ID=`
  - `GOOGLE_CLIENT_SECRET=`
  - `GOOGLE_REDIRECT_URI=https://up2you.kvn.ltd/api/auth/google/callback`
  - `SUPABASE_URL=`
  - `SUPABASE_ANON_KEY=` (set this to your Supabase service-role key for admin writes)
  - `STRIPE_SECRET_KEY=`
  - `STRIPE_WEBHOOK_SECRET=`
  - Optional: `SHOPIFY_*`, `EBAY_*`
- Frontend (`jewelry`) `.env`:
  - `VITE_SUPABASE_URL=`
  - `VITE_SUPABASE_ANON_KEY=`

## Supabase Setup
1. Create Supabase project in US-East.
2. Get `SUPABASE_URL`, `anon` key, and `service-role` key.
3. Apply `supabase/migrations/*.sql` in the SQL editor.
4. Confirm RLS: `anon` can SELECT products; `service_role` full access.
5. Enable daily backups and PITR.

## Deployment Steps
- Backend:
  - `npm ci`, `npm run build` → runs `node dist/index.js` (or PM2/systemd) with `.env` above.
- Frontend:
  - `npm ci`, `npm run build` → serve `jewelry/dist` via Nginx.
- Nginx:
  - Serve static `jewelry/dist` at `https://up2you.kvn.ltd`.
  - Proxy `/api/*` → `http://127.0.0.1:3000`.
  - Enforce HTTPS, gzip/caching for assets.
- OAuth/Stripe:
  - Google OAuth redirect: `https://up2you.kvn.ltd/api/auth/google/callback`.
  - Stripe webhook: `https://up2you.kvn.ltd/api/stripe/webhook` with `STRIPE_WEBHOOK_SECRET` set.

## How It Works
- Public catalog pages read from Supabase directly via the frontend anon key (resilient if backend is down).
- Admin pages call backend `/api/admin/*` (secured with cookie `admin_session` or `x-admin-token` in dev) using the service-role key on the server.
- All data persists on Supabase, independent of backend uptime.

## Deliverables
- `deploy/minimal/`: backend, `jewelry`, `supabase/migrations/`, docs.
- `docs/DEPLOY.md`: self-host steps, envs, Nginx, OAuth/Stripe.
- Updated root `README.md` and unified `.env.example` matching these names.

## Proceed?
- I will fold admin into `jewelry`, prepare `deploy/minimal/`, expand `.env.example`, and write `docs/DEPLOY.md` accordingly once you confirm.