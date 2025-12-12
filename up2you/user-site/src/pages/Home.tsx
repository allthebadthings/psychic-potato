import { Link } from 'react-router-dom'
import { Calendar, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Scheduling Made Simple</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Up2You helps coordinators manage appointments, communicate with clients, and handle payments—all in one place.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Book Now</Link>
            <Link to="/pricing" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">View Pricing</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Up2You?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <Calendar className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Simple calendar interface with availability management and automatic conflict detection.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <Users className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="text-lg font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">Keep track of client information, preferences, and history in one secure place.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <Zap className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="text-lg font-semibold mb-2">Fast Payments</h3>
              <p className="text-gray-600">Integrated Stripe payments with instant booking confirmation and automated invoicing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join hundreds of coordinators who trust Up2You to manage their scheduling and payments.</p>
          <Link to="/booking" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Start Your Free Trial</Link>
        </div>
      </section>
    </>
  )
}