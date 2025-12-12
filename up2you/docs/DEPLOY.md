# Self-Host Deployment Guide

This guide covers deploying the Up2You website (Jewelry Shop + Admin) on your own server while using Supabase Cloud for the database.

## Architecture
- **Backend**: Node.js Express API (runs on port 3000). Handles admin logic, payments, and integrations.
- **Frontend**: React/Vite app (served as static files). Handles customer shop and admin UI.
- **Database**: Supabase Cloud (Postgres). Fully managed, separate from your server.

## Prerequisites
- A Linux server (Ubuntu recommended) with Node.js 18+ and Nginx installed.
- A Supabase account (free tier works).
- A Google Cloud Console project (for Admin OAuth).
- A Stripe account (for payments).
- A domain name (e.g., `up2you.kvn.ltd`) pointed to your server IP.

---

## 1. Database Setup (Supabase)

1. **Create Project**: Log in to Supabase and create a new project in **US-East** (or your preferred region).
2. **Get Credentials**: Go to Project Settings -> API. Copy:
   - `Project URL` (`SUPABASE_URL`)
   - `anon public` key (`SUPABASE_ANON_KEY`)
   - `service_role secret` key (`SUPABASE_SERVICE_ROLE_KEY`)
3. **Apply Schema**:
   - Go to the SQL Editor in Supabase.
   - Open the files in `deploy/minimal/supabase/migrations/` (or copy their content).
   - Run the SQL to create tables (`products`, `orders`, `integrations`) and security policies.
4. **Backups**: Verify that daily backups are enabled in Database -> Backups.

---

## 2. Server Setup (Backend)

1. **Upload Files**: Copy the `deploy/minimal/backend` folder to your server (e.g., `/var/www/up2you/backend`).
2. **Install Dependencies**:
   ```bash
   cd /var/www/up2you/backend
   npm ci
   ```
3. **Configure Environment**:
   - Copy `.env.example` to `.env`.
   - Fill in the values:
     - `PORT=3000`
     - `ADMIN_API_TOKEN`: Generate a secure random string.
     - `ADMIN_JWT_SECRET`: Generate a long random string.
     - `GOOGLE_CLIENT_ID` / `SECRET`: From Google Cloud Console.
     - `GOOGLE_REDIRECT_URI`: `https://your-domain.com/api/auth/google/callback`.
     - `SUPABASE_URL`: Your Supabase URL.
     - `SUPABASE_ANON_KEY`: **IMPORTANT**: Use the `service_role` key here so the backend can write data.
     - `STRIPE_SECRET_KEY` / `WEBHOOK_SECRET`: From Stripe Dashboard.
4. **Build & Run**:
   ```bash
   npm run build
   # Test run
   node dist/index.js
   # Production run (use PM2)
   npm install -g pm2
   pm2 start dist/index.js --name "up2you-backend"
   pm2 save
   ```

---

## 3. Frontend Setup (Jewelry App)

1. **Upload Files**: Copy the `deploy/minimal/jewelry` folder to your server.
2. **Install Dependencies**:
   ```bash
   cd /var/www/up2you/jewelry
   npm ci
   ```
3. **Configure Environment**:
   - Create a `.env` file based on `.env.example`.
   - Fill in:
     - `VITE_SUPABASE_URL`: Your Supabase URL.
     - `VITE_SUPABASE_ANON_KEY`: Use the `anon public` key here (read-only safe).
4. **Build**:
   ```bash
   npm run build
   ```
   This creates a `dist` folder with the static site.

---

## 4. Nginx Configuration

Configure Nginx to serve the frontend and proxy API requests to the backend.

1. Create config file: `/etc/nginx/sites-available/up2you`
   ```nginx
   server {
       server_name up2you.kvn.ltd;

       # Frontend (Static Files)
       location / {
           root /var/www/up2you/jewelry/dist;
           try_files $uri $uri/ /index.html;
           index index.html;
       }

       # Backend (API Proxy)
       location /api {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
2. Enable site and restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/up2you /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```
3. **SSL (HTTPS)**: Use Certbot to secure the site.
   ```bash
   certbot --nginx -d up2you.kvn.ltd
   ```

---

## 5. Final Configuration

1. **Google OAuth**: Add `https://up2you.kvn.ltd/api/auth/google/callback` to Authorized Redirect URIs in Google Cloud Console.
2. **Stripe Webhook**: Add `https://up2you.kvn.ltd/api/stripe/webhook` as a webhook endpoint in Stripe Dashboard.

## Verification

- Visit `https://up2you.kvn.ltd` -> Should see the shop.
- Visit `https://up2you.kvn.ltd/admin/login` -> Sign in with Google.
- Check Dashboard -> Should see system status.
