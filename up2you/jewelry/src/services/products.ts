import { supabase } from '../lib/supabase'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  metal_type: string
  gemstone: string
  weight: number
  images: string[]
  sku: string
  stock_quantity: number
  is_featured: boolean
  is_bundle: boolean
  bundle_discount: number
  created_at: string
  updated_at: string
}

export interface ProductFilters {
  category?: string
  metal_type?: string
  min_price?: number
  max_price?: number
  search?: string
  featured?: boolean
  bundle?: boolean
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.metal_type && filters.metal_type !== 'all') {
      query = query.eq('metal_type', filters.metal_type)
    }

    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price)
    }

    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.featured) {
      query = query.eq('is_featured', true)
    }

    if (filters.bundle) {
      query = query.eq('is_bundle', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(6)

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return data || []
  },

  async getBundleProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_bundle', true)

    if (error) {
      console.error('Error fetching bundle products:', error)
      return []
    }

    return data || []
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categories = data?.map(item => item.category) || []
    return [...new Set(categories)] // Remove duplicates
  },

  async getMetalTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('metal_type')
      .not('metal_type', 'is', null)

    if (error) {
      console.error('Error fetching metal types:', error)
      return []
    }

    const metalTypes = data?.map(item => item.metal_type) || []
    return [...new Set(metalTypes)] // Remove duplicates
  },

  async getShopifyConfig(): Promise<{ configured: boolean }> {
    try {
      const res = await fetch('/api/shopify/config')
      return await res.json()
    } catch {
      return { configured: false }
    }
  },

  async getShopifyProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/shopify/products')
      if (!res.ok) throw new Error('Failed to fetch Shopify products')
      return await res.json()
    } catch {
      console.error('Error fetching Shopify products')
      return []
    }
  },

  async getEbayProducts(q: string = 'jewelry'): Promise<Product[]> {
    try {
      const res = await fetch(`/api/ebay/products?q=${encodeURIComponent(q)}`)
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  }
}
