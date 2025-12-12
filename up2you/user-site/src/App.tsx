import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Booking from './pages/Booking'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}