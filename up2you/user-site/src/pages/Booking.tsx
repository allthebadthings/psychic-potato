import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

const services = ['Initial Consultation', 'Follow-up Session', 'Group Workshop', 'Corporate Training']
const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

export default function Booking() {
  const [service, setService] = useState(services[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState(times[0])
  const [submitted, setSubmitted] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to Supabase booking_initiations
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Session</h1>
          <p className="text-gray-600">Select your preferred service, date, and time.</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-6">
          {submitted && <div className="bg-green-50 text-green-700 border border-green-200 rounded p-3 text-sm">Booking request submitted! We'll confirm your appointment shortly.</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {services.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <div className="relative">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <div className="relative">
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {times.map((t) => <option key={t}>{t}</option>)}
              </select>
              <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">Submit Booking Request</button>
        </form>
      </div>
    </div>
  )
}