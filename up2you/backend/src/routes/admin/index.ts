import { Router } from 'express'
import { supabase } from '../../db/supabase.ts'

const router = Router()

interface Product {
  id: string
  name: string
  price: number
  description?: string
  stock: number
}

// Fallback in-memory store if DB is not configured
let localProducts: Product[] = []
const useDb = !!process.env.SUPABASE_URL

router.get('/health', (req, res) => {
  res.json({ status: 'ok', storage: useDb ? 'supabase' : 'memory' })
})

router.get('/stats', async (req, res) => {
  if (useDb) {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true })
    if (error) {
        // Fallback to 0 if table doesn't exist yet
        res.json({ users: 0, products: 0, orders: 0, error: error.message })
        return
    }
    res.json({ users: 0, products: count || 0, orders: 0 })
  } else {
    res.json({ users: 0, products: localProducts.length, orders: 0 })
  }
})

router.get('/products', async (req, res) => {
  if (useDb) {
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    res.json({ items: data })
  } else {
    res.json({ items: localProducts })
  }
})

router.post('/products', async (req, res) => {
  const { name, price, description, stock } = req.body
  
  if (!name || typeof price !== 'number') {
    res.status(400).json({ error: 'Invalid input: name and price are required' })
    return
  }

  const productData = {
    name,
    price,
    description: description || '',
    stock: stock || 0
  }

  if (useDb) {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
    
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    res.status(201).json(data)
  } else {
    const newProduct: Product = {
        id: Date.now().toString(),
        ...productData
    }
    localProducts.push(newProduct)
    res.status(201).json(newProduct)
  }
})

router.patch('/products/:id', async (req, res) => {
  const { id } = req.params

  if (useDb) {
    const { data, error } = await supabase
        .from('products')
        .update(req.body)
        .eq('id', id)
        .select()
        .single()
    
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    if (!data) {
        res.status(404).json({ error: 'Product not found' })
        return
    }
    res.json(data)
  } else {
    const index = localProducts.findIndex(p => p.id === id)
    if (index === -1) {
        res.status(404).json({ error: 'Product not found' })
        return
    }
    
    localProducts[index] = { ...localProducts[index], ...req.body }
    res.json(localProducts[index])
  }
})

router.delete('/products/:id', async (req, res) => {
    const { id } = req.params

    if (useDb) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
        
        if (error) {
            res.status(500).json({ error: error.message })
            return
        }
        res.json({ success: true })
    } else {
        const initialLength = localProducts.length
        localProducts = localProducts.filter(p => p.id !== id)
        
        if (localProducts.length === initialLength) {
            res.status(404).json({ error: 'Product not found' })
            return
        }
        res.json({ success: true })
    }
})

router.get('/orders', (req, res) => {
  res.json({ items: [] })
})

router.get('/system/info', (req, res) => {
  res.json({ 
      node: process.version, 
      env: process.env.NODE_ENV || 'development',
      db: useDb ? 'connected' : 'not_configured'
  })
})

export const adminRoutes = router
