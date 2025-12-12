# Deploy Checklist - up2you.kvn.ltd

## Step 1: Backend Setup (on your server)
```bash
mkdir -p /var/www/inventory-api
cd /var/www/inventory-api

# Copy these files from /tmp:
# - server.js
# - backend-package.json (rename to package.json)

npm install
```

## Step 2: Start Backend
```bash
# Option A: Simple (for testing)
node server.js

# Option B: Background (production)
nohup node server.js > server.log 2>&1 &

# Option C: PM2 (best - auto-restart)
npm install -g pm2
pm2 start server.js --name "inventory-api"
pm2 save
```

Verify it's running:
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

## Step 3: Frontend Setup
```bash
# Option A: Use Create React App (easiest)
npx create-react-app /var/www/inventory-web
cd /var/www/inventory-web

# Copy App.jsx to src/App.js
# Copy App.css to src/App.css

# Set API endpoint
echo "REACT_APP_API_URL=http://localhost:3001" > .env

# Build
npm run build

# Result: /var/www/inventory-web/build/ ready to serve
```

## Step 4: Nginx Configuration
```bash
# Add this config to your Nginx sites-available/
sudo nano /etc/nginx/sites-available/inventory

# Paste the nginx-up2you.conf content

# Enable it
sudo ln -s /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

## Step 5: Verify
- Visit: http://up2you.kvn.ltd
- Should load the app
- Try adding an item
- Check CSV export works

## That's It
Your sister can now go to up2you.kvn.ltd and start adding her inventory.

---

## Quick Troubleshooting

**API not responding?**
```bash
ps aux | grep "node server.js"
tail -f /var/www/inventory-api/server.log
```

**Frontend not loading?**
```bash
ls -la /var/www/inventory-web/build/index.html
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

**Database issues?**
```bash
rm /var/www/inventory-api/inventory.db
# Restart backend, it'll auto-create new one
```
