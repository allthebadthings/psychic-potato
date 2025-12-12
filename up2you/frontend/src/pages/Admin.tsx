import { useState, useEffect } from 'react'

const API_BASE = '/api'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  stock: number
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // New Product Form State
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [])

  const verifyToken = async () => {
    try {
      // Just try to fetch products to verify token
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { 'x-admin-token': token }
      })
      if (res.ok) {
        setIsLoggedIn(true)
        localStorage.setItem('admin_token', token)
        const data = await res.json()
        setProducts(data.items || [])
        setError(null)
      } else {
        setError('Invalid token or session expired')
        setIsLoggedIn(false)
      }
    } catch (e) {
      setError('Failed to connect to server')
      setIsLoggedIn(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    verifyToken()
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('admin_token')
    setIsLoggedIn(false)
    setProducts([])
  }

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: { 'x-admin-token': token }
    })
    if (res.ok) {
      const data = await res.json()
      setProducts(data.items || [])
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          name: newName,
          price: Number(newPrice),
          stock: Number(newStock),
          description: newDesc
        })
      })
      if (res.ok) {
        setNewName('')
        setNewPrice('')
        setNewStock('')
        setNewDesc('')
        fetchProducts()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add product')
      }
    } catch (e) {
      alert('Error adding product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      })
      if (res.ok) {
        fetchProducts()
      }
    } catch (e) {
      alert('Error deleting product')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-100">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm mb-2">Admin Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
              placeholder="Enter admin token..."
            />
          </div>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Product Form */}
        <div className="md:col-span-1">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h2 className="text-lg font-medium mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Price</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 h-20"
                />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2 text-sm">
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="md:col-span-2">
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-750">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{product.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">${product.price}</td>
                      <td className="px-4 py-3 text-slate-300">{product.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-slate-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
