# Inventory App - Setup Guide

## Quick Start

### 1. Backend Setup
```bash
mkdir -p /var/www/inventory-api
cd /var/www/inventory-api

# Copy server.js here
# Copy package.json (rename from backend-package.json)
cp backend-package.json package.json

npm install
```

### 2. Start Backend
```bash
# Option A: Direct
node server.js

# Option B: Background (recommended)
nohup node server.js > server.log 2>&1 &

# Option C: Using PM2 (persistent, auto-restart)
npm install -g pm2
pm2 start server.js --name "inventory-api"
pm2 startup
pm2 save
```

Backend will run on port 3001 (or set PORT env var)

---

### 3. Frontend Setup
Use Create React App:
```bash
npx create-react-app inventory-web
cd inventory-web

# Replace src/App.js with App.jsx
# Replace src/App.css with App.css

# Update .env to point to your API:
echo "REACT_APP_API_URL=http://inventory.kvn.ltd:3001" > .env
```

### 4. Build Frontend
```bash
npm run build
```

This creates a `build/` folder ready to serve.

---

### 5. Nginx Configuration
Add this to your Nginx config to serve both frontend and proxy backend:

```nginx
server {
    listen 80;
    server_name inventory.kvn.ltd;

    # Frontend (React)
    location / {
        root /var/www/inventory-web/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/inventory-api/uploads/;
    }
}
```

Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## File Structure (on server)
```
/var/www/
├── inventory-api/
│   ├── server.js
│   ├── package.json
│   ├── inventory.db (auto-created)
│   └── uploads/ (auto-created)
├── inventory-web/
│   ├── build/ (from npm run build)
│   └── public/
```

---

## Troubleshooting

**Backend not starting?**
- Check port 3001 is open: `lsof -i :3001`
- Check logs: `tail server.log`
- Ensure Node.js is installed: `node -v`

**Frontend not loading?**
- Check Nginx config is correct
- Check React build exists: `ls /var/www/inventory-web/build/index.html`
- Clear browser cache (Ctrl+Shift+Del)

**API calls failing?**
- Check CORS is working (backend allows requests)
- Check firewall allows traffic between frontend and API
- Check .env file has correct API_URL

**Database issues?**
- Delete inventory.db and restart (fresh database)
- Check write permissions on /var/www/inventory-api/ directory

---

## Updates

To update the frontend:
```bash
cd /var/www/inventory-web
npm run build
sudo systemctl reload nginx
```

To restart the API:
```bash
# If using PM2:
pm2 restart inventory-api

# If using direct process, kill and restart:
pkill -f "node server.js"
nohup node server.js > server.log 2>&1 &
```

---

## Monitoring

**Check if API is running:**
```bash
curl http://localhost:3001/health
```

**View API logs:**
```bash
tail -f /var/www/inventory-api/server.log
```

**Check database size:**
```bash
ls -lh /var/www/inventory-api/inventory.db
```
