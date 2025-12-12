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

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  return { total, itemCount }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(item => item.product.id === product.id)
        
        let newItems: CartItem[]
        
        if (existing) {
          newItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...items, {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            is_bundle: product.is_bundle
          }]
        }
        
        set({
          items: newItems,
          ...calculateTotals(newItems)
        })
      },
      removeItem: (id) => {
        const newItems = get().items.filter(item => item.id !== id)
        set({
          items: newItems,
          ...calculateTotals(newItems)
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        const newItems = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
        set({
          items: newItems,
          ...calculateTotals(newItems)
        })
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: 'jewelry-cart'
    }
  )
)
