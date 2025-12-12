import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = '/api'

export default function Home() {
  const [health, setHealth] = useState<{ status: string; timestamp: string; services?: Record<string, string> } | null>(null)
  const [stripe, setStripe] = useState<{ configured: boolean; webhook: boolean } | null>(null)
  const [amount, setAmount] = useState('1000')
  const [paymentResult, setPaymentResult] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null))

    fetch(`${API_BASE}/stripe/config`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setStripe)
      .catch(() => setStripe(null))
  }, [])

  const createPaymentIntent = async () => {
    setPaymentResult(null)
    try {
      const res = await fetch(`${API_BASE}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), currency: 'usd' }),
      })
      const data = await res.json()
      setPaymentResult(res.ok ? `client_secret: ${data.clientSecret}` : `Error: ${data.error}`)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setPaymentResult(`Error: ${e.message}`)
      } else {
        setPaymentResult('Error: An unknown error occurred')
      }
    }
  }

  const badge = (ok?: boolean) => (
    <span className={`px-2 py-1 rounded text-xs ${ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {ok ? 'Healthy' : 'Unhealthy'}
    </span>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Up2You Dashboard</h1>
            <Link to="/admin" className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded">
                Admin Panel
            </Link>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-medium mb-3">API Health</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {health ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Overall</span>
                  {badge(health.status === 'ok')}
                </div>
                <div className="text-sm text-slate-400">Last check: {new Date(health.timestamp).toLocaleString()}</div>
                {health.services && (
                  <div className="mt-3 space-y-1">
                    {Object.entries(health.services).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{k}</span>
                        {badge(v === 'healthy')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400">Loading…</div>
            )}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium mb-3">Stripe Config</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {stripe ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Secret Key</span>
                  {badge(stripe.configured)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Webhook Secret</span>
                  {badge(stripe.webhook)}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Loading…</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-3">Payment Intent Demo</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
            <div>
              <label className="block text-sm mb-1">Amount (cents)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
              />
            </div>
            <button
              onClick={createPaymentIntent}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
              Create Payment Intent
            </button>
            {paymentResult && (
              <pre className="mt-3 text-xs bg-slate-900 border border-slate-700 rounded p-3 overflow-auto">{paymentResult}</pre>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
