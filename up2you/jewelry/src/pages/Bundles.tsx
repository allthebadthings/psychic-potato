import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../store/cart'
import { Product } from '../services/products'
import { productService } from '../services/products'

export default function Bundles() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    loadBundles()
  }, [])

  const loadBundles = async () => {
    setLoading(true)
    const bundleProducts = await productService.getBundleProducts()
    setProducts(bundleProducts)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bundles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Curated Bundles</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our hand-picked sets and save on matching pieces. 
            Perfect for gifting or completing your look.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    Save {product.bundle_discount}%
                  </div>
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-yellow-600">
                      ${(product.price * (1 - product.bundle_discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const finalPrice = product.price * (1 - product.bundle_discount / 100)
                      
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: finalPrice,
                        category: product.category,
                        metal_type: product.metal_type,
                        images: product.images,
                        is_bundle: product.is_bundle,
                        description: product.description
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add Bundle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bundles available</h2>
            <p className="text-gray-500 mb-6">Check back later for new curated sets.</p>
            <Link 
              to="/catalog"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
            >
              Browse All Jewelry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
