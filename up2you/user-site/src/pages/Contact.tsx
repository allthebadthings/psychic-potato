import { useState } from 'react'
import { Mail, Phone, Clock, MapPin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to Supabase contact_submissions
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>hello@up2you.co</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Mon-Fri 9AM-6PM EST</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>New York, NY</span>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
          {sent && <div className="bg-green-50 text-green-700 border border-green-200 rounded p-3 text-sm">Message sent! We'll get back to you soon.</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handle} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handle} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input name="subject" value={form.subject} onChange={handle} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea name="message" value={form.message} onChange={handle} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Send Message</button>
        </form>
      </div>
    </div>
  )
}