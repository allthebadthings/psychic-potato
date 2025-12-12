import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [devToken, setDevToken] = useState('')

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) navigate('/admin')
      })
  }, [navigate])

  const handleDevLogin = () => {
    localStorage.setItem('admin_token', devToken)
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your store
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <Button
              onClick={() => window.location.href = '/api/auth/google/start'}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or use dev token</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Dev Admin Token"
              value={devToken}
              onChange={(e) => setDevToken(e.target.value)}
            />
            <Button onClick={handleDevLogin} variant="outline">
              Set Token
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
