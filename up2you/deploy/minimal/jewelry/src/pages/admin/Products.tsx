import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    metal_type: '',
    gemstone: ''
  })

  const headers = {
    'x-admin-token': localStorage.getItem('admin_token') || '',
    'Content-Type': 'application/json'
  }

  const fetchProducts = () => {
    fetch('/api/admin/products', { headers })
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing 
      ? `/api/admin/products/${editing.id}`
      : '/api/admin/products'
    
    const method = editing ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity)
        })
      })

      if (res.ok) {
        setEditing(null)
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          metal_type: '',
          gemstone: ''
        })
        fetchProducts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (p: any) => {
    setEditing(p)
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock_quantity: p.stock_quantity,
      category: p.category || '',
      metal_type: p.metal_type || '',
      gemstone: p.gemstone || ''
    })
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Button onClick={() => setEditing({})}>Add Product</Button>
      </div>

      {(editing !== null) && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">{editing.id ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(value: string) => setFormData({...formData, name: value})}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(value: string) => setFormData({...formData, description: value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                value={formData.price}
                onChange={(value: string) => setFormData({...formData, price: value})}
                required
              />
              <Input
                label="Stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(value: string) => setFormData({...formData, stock_quantity: value})}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Category"
                value={formData.category}
                onChange={(value: string) => setFormData({...formData, category: value})}
              />
              <Input
                label="Metal"
                value={formData.metal_type}
                onChange={(value: string) => setFormData({...formData, metal_type: value})}
              />
              <Input
                label="Gemstone"
                value={formData.gemstone}
                onChange={(value: string) => setFormData({...formData, gemstone: value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 truncate">{product.name}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>
                          ${product.price} • Stock: {product.stock_quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(product)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
