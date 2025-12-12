import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const nav = [
    { to: '/', label: 'Home' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
    { to: '/booking', label: 'Book Now' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">Up2You</Link>
          <nav className="hidden md:flex gap-6">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className={`text-sm ${pathname === n.to ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>{n.label}</Link>
            ))}
          </nav>
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav className="md:hidden px-6 pb-4 space-y-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`block text-sm ${pathname === n.to ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>{n.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-50 text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-gray-900 mb-2">Up2You</div>
            <p>Streamlined scheduling, communications, and payments for coordinators.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-2">Quick Links</div>
            <div className="space-y-1">
              <Link to="/pricing" className="block hover:text-blue-600">Pricing</Link>
              <Link to="/contact" className="block hover:text-blue-600">Contact</Link>
              <Link to="/booking" className="block hover:text-blue-600">Book Now</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-2">Contact</div>
            <div className="space-y-1">
              <a href="mailto:hello@up2you.co" className="block hover:text-blue-600">hello@up2you.co</a>
              <div>Mon-Fri 9AM-6PM EST</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 text-center">© 2025 Up2You. All rights reserved.</div>
      </footer>
    </div>
  )
}