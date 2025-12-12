import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    popular: false,
    features: ['Up to 50 bookings/month', 'Email support', 'Basic calendar sync', 'Stripe integration'],
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    popular: true,
    features: ['Up to 500 bookings/month', 'Priority support', 'Advanced calendar sync', 'Custom branding', 'Analytics dashboard'],
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    popular: false,
    features: ['Unlimited bookings', '24/7 phone support', 'Custom integrations', 'White-label solution', 'Dedicated account manager'],
  },
]

export default function Pricing() {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">Choose the plan that fits your coordination needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div key={p.name} className={`bg-white rounded-2xl shadow-lg p-8 relative ${p.popular ? 'ring-2 ring-blue-600' : ''}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</div>}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{p.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold text-gray-900">{p.price}</span>
                  <span className="text-gray-500">{p.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold transition ${p.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-gray-900 font-semibold">Features</th>
                  <th className="pb-3 text-gray-900 font-semibold text-center">Starter</th>
                  <th className="pb-3 text-gray-900 font-semibold text-center">Professional</th>
                  <th className="pb-3 text-gray-900 font-semibold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3">Monthly Bookings</td>
                  <td className="py-3 text-center">50</td>
                  <td className="py-3 text-center">500</td>
                  <td className="py-3 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Support Level</td>
                  <td className="py-3 text-center">Email</td>
                  <td className="py-3 text-center">Priority</td>
                  <td className="py-3 text-center">24/7 Phone</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Custom Branding</td>
                  <td className="py-3 text-center">—</td>
                  <td className="py-3 text-center">✓</td>
                  <td className="py-3 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-3">Analytics Dashboard</td>
                  <td className="py-3 text-center">—</td>
                  <td className="py-3 text-center">✓</td>
                  <td className="py-3 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}