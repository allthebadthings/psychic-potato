#!/bin/bash
# Deploy up2you inventory app to server
# UPDATE: Replace 'user@up2you.kvn.ltd' with your SSH details

echo "Copying files to server..."
scp -r up2you-extracted/* user@up2you.kvn.ltd:/tmp/

echo "SSH to server for deploy..."
ssh user@up2you.kvn.ltd &quot;
  cd /tmp
  # Backend setup
  sudo mkdir -p /var/www/inventory-api /var/www/inventory-web
  cd /var/www/inventory-api
  sudo cp /tmp/server.js /tmp/backend-package.json .
  sudo mv backend-package.json package.json
  sudo npm install
  sudo pm2 restart inventory-api || sudo pm2 start server.js --name inventory-api
  sudo pm2 save
  # Frontend build
  cd /tmp
  sudo cp -r App.jsx App.css /var/www/inventory-web/src/
  cd /var/www/inventory-web
  sudo npm install react react-dom axios
  sudo npm run build || echo &quot;Build may need full package.json&quot;
  # Nginx reload
  sudo nginx -t &amp;&amp; sudo nginx -s reload
  # Cleanup
  sudo rm -rf /tmp/up2you-extracted
&quot;
echo &quot;Deploy complete! Check up2you.kvn.ltd&quot;