import { Link, Outlet } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useCart } from '../store/cart'
import { useState } from 'react'

export default function Layout() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-serif text-yellow-600">Up2You</Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/catalog" className="text-gray-700 hover:text-yellow-600 transition">Catalog</Link>
              <Link to="/bundles" className="text-gray-700 hover:text-yellow-600 transition">Bundles</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-yellow-600 transition">
                <Search size={20} />
              </button>
              <button className="text-gray-700 hover:text-yellow-600 transition">
                <User size={20} />
              </button>
              <Link to="/cart" className="relative text-gray-700 hover:text-yellow-600 transition">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          {open && (
            <nav className="md:hidden pb-4 space-y-2">
              <Link to="/catalog" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-yellow-600">Catalog</Link>
              <Link to="/bundles" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-yellow-600">Bundles</Link>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">LuxeJewels</h3>
              <p className="text-gray-400">Premium jewelry crafted with care and elegance.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/catalog" className="hover:text-white transition">Rings</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition">Necklaces</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition">Earrings</Link></li>
                <li><Link to="/bundles" className="hover:text-white transition">Bundles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-white transition">Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-white transition">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400">Follow us for new collections and exclusive offers.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Up2You. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
