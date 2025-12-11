# INVENTORY APP - COMPLETE DEPLOYMENT PACKAGE
# Hand this entire file to the person setting up the server

## WHAT THIS IS
A web app for selling jewelry/handmade items online. Tracks inventory, prices, quantities, storage locations, photos. Has a dashboard with stats and CSV export.

**Domain:** up2you.kvn.ltd
**Tech:** Node.js backend + React frontend + SQLite database

---

## STEP 1: CREATE SUBDOMAIN
Ask the domain admin to create: **up2you.kvn.ltd** pointing to this server's IP address.

Wait for DNS to propagate (can take a few minutes to hours).

Verify it's working:
```bash
ping up2you.kvn.ltd
```

---

## STEP 2: CREATE DIRECTORIES
```bash
sudo mkdir -p /var/www/inventory-api
sudo mkdir -p /var/www/inventory-web
sudo chown -R $USER:$USER /var/www/inventory-*
```

---

## STEP 3: SETUP BACKEND

### Create /var/www/inventory-api/package.json
```json
{
  "name": "inventory-api",
  "version": "1.0.0",
  "description": "Inventory management API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1"
  }
}
```

### Create /var/www/inventory-api/server.js
```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Photo upload setup
const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'inventory.db'), (err) => {
  if (err) console.error('DB error:', err);
  else console.log('Database connected');
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      materials TEXT,
      category TEXT,
      price REAL,
      quantity INTEGER DEFAULT 0,
      location TEXT,
      photo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper: Run promise-based DB queries
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// API Routes

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await dbAll('SELECT * FROM items ORDER BY created_at DESC');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single item
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await dbGet('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item
app.post('/api/items', upload.single('photo'), async (req, res) => {
  try {
    const { name, description, materials, category, price, quantity, location } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Item name required' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const q = quantity ? parseInt(quantity) : 0;
    const p = price ? parseFloat(price) : 0;

    const result = await dbRun(
      'INSERT INTO items (name, description, materials, category, price, quantity, location, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), description || '', materials || '', category || '', p, q, location || '', photo]
    );

    res.json({ id: result.lastID, name, photo, quantity: q, price: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
app.put('/api/items/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, description, materials, category, price, quantity, location } = req.body;
    const id = req.params.id;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Item name required' });
    }

    const item = await dbGet('SELECT * FROM items WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const photo = req.file ? `/uploads/${req.file.filename}` : item.photo;
    const q = quantity !== undefined ? parseInt(quantity) : item.quantity;
    const p = price !== undefined ? parseFloat(price) : item.price;

    await dbRun(
      'UPDATE items SET name = ?, description = ?, materials = ?, category = ?, price = ?, quantity = ?, location = ?, photo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), description || '', materials || '', category || '', p, q, location || '', photo, id]
    );

    res.json({ id, name, photo, quantity: q, price: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await dbGet('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await dbRun('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export CSV
app.get('/api/export/csv', async (req, res) => {
  try {
    const items = await dbAll('SELECT * FROM items ORDER BY created_at DESC');
    
    let csv = 'Name,Category,Description,Materials,Price,Quantity,Location\n';
    items.forEach(item => {
      const row = [
        `"${item.name}"`,
        `"${item.category || ''}"`,
        `"${item.description || ''}"`,
        `"${item.materials || ''}"`,
        item.price,
        item.quantity,
        `"${item.location || ''}"`
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const total = await dbGet('SELECT COUNT(*) as count, SUM(quantity) as total_qty, SUM(price * quantity) as total_value FROM items');
    const byCategory = await dbAll('SELECT category, COUNT(*) as count, SUM(quantity) as qty FROM items GROUP BY category');
    
    res.json({
      total_items: total.count || 0,
      total_quantity: total.total_qty || 0,
      total_value: parseFloat(total.total_value) || 0,
      by_category: byCategory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Install backend dependencies
```bash
cd /var/www/inventory-api
npm install
```

### Start backend (pick one)
```bash
# Option 1: Test mode (see output)
node server.js

# Option 2: Background mode (recommended)
nohup node server.js > server.log 2>&1 &

# Option 3: Using PM2 (auto-restart on reboot)
npm install -g pm2
pm2 start server.js --name "inventory-api"
pm2 startup
pm2 save
```

### Verify backend is running
```bash
curl http://localhost:3001/health
# Should see: {"status":"ok"}
```

---

## STEP 4: SETUP FRONTEND

### Option A: Use Create React App (easiest)
```bash
cd /var/www
npx create-react-app inventory-web
cd inventory-web
```

### Create src/App.js (replace existing)
```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard or add
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    materials: '',
    location: '',
    photo: null
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      alert('Error loading inventory: ' + err.message);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  // Quick add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      alert('Need an item name');
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('category', formData.category);
      fd.append('price', formData.price || 0);
      fd.append('quantity', formData.quantity || 0);
      fd.append('description', formData.description);
      fd.append('materials', formData.materials);
      fd.append('location', formData.location);
      if (formData.photo) fd.append('photo', formData.photo);

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/api/items/${editingId}` : `${API_URL}/api/items`;

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Failed to save');

      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        materials: '',
        location: '',
        photo: null
      });
      setEditingId(null);
      setView('dashboard');

      await fetchItems();
      await fetchStats();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchItems();
      await fetchStats();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    window.location.href = `${API_URL}/api/export/csv`;
  };

  // Filter & display
  const displayItems = filterCategory === 'all' 
    ? items 
    : items.filter(i => i.category === filterCategory);

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="app">
      <header className="header">
        <h1>Inventory</h1>
        <div className="header-actions">
          <button 
            className={`tab ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab ${view === 'add' ? 'active' : ''}`}
            onClick={() => {
              setView('add');
              setEditingId(null);
              setFormData({ name: '', category: '', price: '', quantity: '', description: '', materials: '', location: '', photo: null });
            }}
          >
            + Add Item
          </button>
        </div>
      </header>

      {view === 'dashboard' ? (
        <div className="dashboard">
          {/* Stats */}
          {stats && (
            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">{stats.total_items}</div>
                <div className="stat-label">Total Items</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.total_quantity}</div>
                <div className="stat-label">Total Qty</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">${stats.total_value.toFixed(2)}</div>
                <div className="stat-label">Total Value</div>
              </div>
            </div>
          )}

          {/* Filter & Export */}
          <div className="toolbar">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={handleExportCSV} className="btn-secondary">Download CSV</button>
          </div>

          {/* Items List */}
          <div className="items-list">
            {displayItems.length === 0 ? (
              <p className="empty">No items yet. Add one to get started.</p>
            ) : (
              displayItems.map(item => (
                <div key={item.id} className="item-card">
                  {item.photo && (
                    <img src={item.photo} alt={item.name} className="item-photo" />
                  )}
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    {item.category && <p className="category">{item.category}</p>}
                    {item.materials && <p className="meta">{item.materials}</p>}
                    <div className="item-details">
                      <span>${item.price.toFixed(2)}</span>
                      <span className="qty">Qty: {item.quantity}</span>
                      {item.location && <span className="location">{item.location}</span>}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => {
                        setFormData({
                          name: item.name,
                          category: item.category || '',
                          price: item.price.toString(),
                          quantity: item.quantity.toString(),
                          description: item.description || '',
                          materials: item.materials || '',
                          location: item.location || '',
                          photo: null
                        });
                        setEditingId(item.id);
                        setView('add');
                      }}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddItem} className="form-add">
          <div className="form-section">
            <label>Item Name *</label>
            <input
              type="text"
              placeholder="e.g., Silver Ring"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-section">
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g., Rings, Bracelets"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="form-section">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-section">
              <label>Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Materials</label>
            <input
              type="text"
              placeholder="e.g., Sterling Silver, Gemstone"
              value={formData.materials}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label>Description</label>
            <textarea
              placeholder="Notes about this item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-section">
            <label>Storage Location</label>
            <input
              type="text"
              placeholder="e.g., Drawer A, Shelf 2"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setView('dashboard');
                setEditingId(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default App;
```

### Create src/App.css (replace existing)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f8f9fa;
  color: #333;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.tab {
  padding: 10px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #000;
  border-bottom-color: #000;
  font-weight: 600;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #000;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-transform: uppercase;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.filter {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

/* Items List */
.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  padding: 20px;
}

.item-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f0f0f0;
}

.item-info {
  padding: 15px;
  flex: 1;
}

.item-info h3 {
  font-size: 16px;
  margin-bottom: 6px;
  line-height: 1.3;
}

.category {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
}

.item-details span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 3px;
}

.item-details .qty {
  font-weight: 600;
}

.item-actions {
  display: flex;
  gap: 8px;
  padding: 12px 15px;
  border-top: 1px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-edit {
  background: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background: #e0e0e0;
}

.btn-delete {
  background: #f5f5f5;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #ffebee;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

/* Form */
.form-add {
  background: white;
  padding: 30px;
  max-width: 600px;
  margin: 20px auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-section {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.form-section label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-section input,
.form-section textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-section input:focus,
.form-section textarea:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .items-list {
    grid-template-columns: 1fr;
  }

  .form-add {
    padding: 20px;
    margin: 20px;
  }
}
```

### Set API URL and build
```bash
echo "REACT_APP_API_URL=http://localhost:3001" > .env
npm run build
```

This creates `/var/www/inventory-web/build/` - this is what gets served.

---

## STEP 5: NGINX CONFIGURATION

### Create Nginx config file
Create `/etc/nginx/sites-available/inventory`:

```nginx
server {
    listen 80;
    server_name up2you.kvn.ltd;

    # Frontend (React build)
    location / {
        root /var/www/inventory-web/build;
        try_files $uri /index.html;
        expires 1h;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Photo uploads
    location /uploads/ {
        alias /var/www/inventory-api/uploads/;
        expires 30d;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001;
    }
}
```

### Enable the config
```bash
sudo ln -s /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## STEP 6: VERIFY EVERYTHING

### Test backend
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

### Test in browser
Visit: **http://up2you.kvn.ltd**

Should see the inventory app. Try adding an item.

---

## TROUBLESHOOTING

**Backend not starting?**
```bash
ps aux | grep "node server.js"
tail -f /var/www/inventory-api/server.log
```

**Frontend showing blank/errors?**
```bash
# Check build exists
ls -la /var/www/inventory-web/build/index.html

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

**API calls failing?**
```bash
# Test API directly
curl http://localhost:3001/api/items
```

**CORS or connection errors?**
- Make sure backend is running on port 3001
- Check firewall allows traffic
- Verify Nginx proxy_pass is correct

**Database corrupted?**
```bash
rm /var/www/inventory-api/inventory.db
# Restart backend - creates new database
```

---

## DONE
Your sister can now visit up2you.kvn.ltd and add her inventory.

When she's adding items, she just:
1. Click "+ Add Item"
2. Type name (required), add optional details
3. Add photo (optional)
4. Click "Add Item"
5. Repeat

Dashboard shows totals and she can export CSV anytime.

Good luck.
