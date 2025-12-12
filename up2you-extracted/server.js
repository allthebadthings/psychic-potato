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
