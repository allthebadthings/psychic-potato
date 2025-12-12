import { CheckCircle, Package, Clock, Home, Truck } from 'lucide-react'
import { useCart } from '../store/cart'

export default function Confirmation() {
  const { items, total } = useCart()
  
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
  
  const calculateBundleSavings = () => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    if (itemCount >= 3) {
      return total * 0.15
    }
    return 0
  }
  
  const bundleSavings = calculateBundleSavings()
  const finalTotal = total - bundleSavings
  const tax = finalTotal * 0.08
  const grandTotal = finalTotal + tax

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Order Number: <span className="font-medium text-gray-900">#{orderNumber}</span></p>
                <p>Order Date: <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span></p>
                <p>Estimated Delivery: <span className="font-medium text-gray-900">{estimatedDelivery}</span></p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>123 Main Street</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.product.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {bundleSavings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Bundle Discount (15%)</span>
                  <span>-${bundleSavings.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Processing</h3>
              <p className="text-sm text-gray-600">Your order is being prepared</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Shipping</h3>
              <p className="text-sm text-gray-600">Estimated delivery by {estimatedDelivery}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Tracking</h3>
              <p className="text-sm text-gray-600">You'll receive tracking info via email</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Print Receipt
          </button>
        </div>

        {/* Customer Service */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Questions about your order? Contact us at <span className="font-medium text-yellow-600">support@jewelrystore.com</span></p>
          <p>Order reference: #{orderNumber}</p>
        </div>
      </div>
    </div>
  )
}