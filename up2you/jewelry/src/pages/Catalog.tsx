import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../store/cart'
import { Product } from '../services/products'
import { productService } from '../services/products'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const { addItem } = useCart()

  const categories = ['all', 'rings', 'necklaces', 'earrings', 'bracelets']

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, priceRange, searchTerm, products])

  const loadProducts = async () => {
    const data = await productService.getProducts()
    setProducts(data)
    setFilteredProducts(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-4 md:mb-0">Jewelry Collection</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} pieces
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-yellow-600 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{product.metal_type}</p>
                <p className="text-sm text-gray-500 mb-2">{product.gemstone}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-yellow-600">${product.price}</span>
                  <button
                    onClick={() => addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category,
                      metal_type: product.metal_type,
                      images: product.images,
                      is_bundle: product.is_bundle,
                      description: product.description
                    })}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setPriceRange([0, 500])
                setSearchTerm('')
              }}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}