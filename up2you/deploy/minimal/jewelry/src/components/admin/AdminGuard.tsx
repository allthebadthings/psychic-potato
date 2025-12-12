import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Layout from './Layout'

interface AuthState {
  checked: boolean
  authenticated: boolean
  user?: {
    email: string
    name: string
  }
}

export default function AdminGuard() {
  const [auth, setAuth] = useState<AuthState>({ checked: false, authenticated: false })
  const location = useLocation()

  useEffect(() => {
    fetch('/api/auth/me', {
      headers: {
        'x-admin-token': localStorage.getItem('admin_token') || ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setAuth({
          checked: true,
          authenticated: data.authenticated,
          user: data.user
        })
      })
      .catch(() => {
        setAuth({ checked: true, authenticated: false })
      })
  }, [location.pathname])

  if (!auth.checked) {
    return <div className="flex min-h-screen items-center justify-center">Loading admin session...</div>
  }

  if (!auth.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="/admin/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Products
                </a>
                <a href="/admin/orders" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Orders
                </a>
                <a href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Back to Shop
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">{auth.user?.email}</span>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/admin/login')
                }}
                className="text-sm text-red-600 hover:text-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
