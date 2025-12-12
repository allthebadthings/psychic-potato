import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Product = {
  id: string
  name: string
  price: number
  category: string
  metal_type: string
  images: string[]
  is_bundle: boolean
  description?: string
  gemstone?: string
}

export type CartItem = {
  id: string
  product: Product
  quantity: number
  is_bundle: boolean
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(item => item.product.id === product.id)
        
        if (existing) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, {
              id: `${product.id}-${Date.now()}`,
              product,
              quantity,
              is_bundle: product.is_bundle
            }]
          })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      },
      get itemCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'jewelry-cart'
    }
  )
)