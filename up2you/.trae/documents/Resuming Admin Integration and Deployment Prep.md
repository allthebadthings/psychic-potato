## Resuming Execution
I was interrupted while implementing the plan to fold the admin interface into the `jewelry` app and prepare the self-host deployment pack. I will resume immediately from where I left off.

## Current State
- I have researched the backend auth endpoints (`/api/auth/me`, `/api/auth/google/start`, `/api/admin/*`) and the frontend structure (`jewelry/src/App.tsx`).
- The todo list is active and accurate.
- Next step is to implement the admin routes, components, and auth guard in the `jewelry` frontend.

## Next Actions
1. **Frontend Admin Implementation**:
   - Create `jewelry/src/components/AdminGuard.tsx` to protect routes.
   - Create `jewelry/src/pages/admin/Login.tsx` (OAuth flow).
   - Create `jewelry/src/pages/admin/Dashboard.tsx` (Stats/Health).
   - Create `jewelry/src/pages/admin/Products.tsx` (CRUD).
   - Update `jewelry/src/App.tsx` to include `/admin` routes.
2. **Deploy Prep**:
   - Create `deploy/minimal/` directory.
   - Populate with backend and jewelry source.
   - Add `supabase/migrations` and docs.
3. **Docs**:
   - Write `docs/DEPLOY.md`.
   - Update `README.md` and `.env.example` files.

I will proceed directly with these tasks.