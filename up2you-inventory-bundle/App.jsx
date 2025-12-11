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
