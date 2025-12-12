const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEPLOY_DIR = path.join(__dirname, '../deploy/minimal');
const BACKEND_SRC = path.join(__dirname, '../backend');
const JEWELRY_SRC = path.join(__dirname, '../jewelry');
const SUPABASE_SRC = path.join(__dirname, '../supabase');

function clean() {
  console.log('Cleaning deploy directory...');
  if (fs.existsSync(DEPLOY_DIR)) {
    fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
}

function copyDir(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (ignore.includes(entry.name)) continue;
    if (entry.name === 'node_modules') continue;
    if (entry.name === '.git') continue;
    if (entry.name === 'dist') continue;
    if (entry.name === '.env') continue;
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, ignore);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function run() {
  clean();

  console.log('Copying Backend...');
  copyDir(BACKEND_SRC, path.join(DEPLOY_DIR, 'backend'), ['verify_inventory.js']);

  console.log('Copying Jewelry App...');
  copyDir(JEWELRY_SRC, path.join(DEPLOY_DIR, 'jewelry'));

  console.log('Copying Supabase Migrations...');
  copyDir(SUPABASE_SRC, path.join(DEPLOY_DIR, 'supabase'));

  console.log('Deployment package created at deploy/minimal');
}

run();
