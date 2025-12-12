# Up2You Jewelry Store

A full-stack e-commerce platform featuring a React frontend, Node.js/Express backend, and Supabase database integration.

## Architecture

- **Frontend (`jewelry/`)**: React + Vite application. Contains the customer-facing shop and a secured Admin Dashboard.
- **Backend (`backend/`)**: Express.js API. Handles business logic, payments (Stripe), integrations (Shopify/eBay), and admin operations.
- **Database**: Supabase (Postgres). Managed externally for reliability.
- **Deployment**: Self-hosted on Linux/Node.js with Nginx reverse proxy.

## Quickstart (Local Development)

This project is set up as a monorepo. You can run everything from the root.

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   - Copy `backend/.env.example` to `backend/.env` and fill in credentials.
   - Copy `jewelry/.env.example` to `jewelry/.env` and fill in credentials.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start both the backend (port 3000) and frontend (port 5173) simultaneously.

   - **Shop**: [http://localhost:5173](http://localhost:5173)
   - **Admin**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

## Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md) for detailed self-hosting instructions using the `deploy/minimal` package.

## Project Structure

- `backend/`: Source code for the API server.
- `jewelry/`: Source code for the frontend application (Shop + Admin).
- `supabase/`: SQL migrations for the database.
- `deploy/minimal/`: The "upload-ready" folder containing the optimized production build.
- `docs/`: Project documentation.
