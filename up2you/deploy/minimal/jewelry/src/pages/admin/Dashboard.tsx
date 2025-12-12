import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const headers = { 'x-admin-token': localStorage.getItem('admin_token') || '' }
    
    Promise.all([
      fetch('/api/admin/health', { headers }).then(res => res.json()),
      fetch('/api/admin/stats', { headers }).then(res => res.json())
    ]).then(([healthData, statsData]) => {
      setHealth(healthData)
      setStats(statsData)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* System Health */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-3 w-3 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
                  <dd className="text-lg font-medium text-gray-900">{health?.status === 'ok' ? 'Operational' : 'Issues Detected'}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">
              Storage: {health?.storage ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.products || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <a href="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </a>
          </div>
        </div>

        {/* Order Count */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.orders || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <a href="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
