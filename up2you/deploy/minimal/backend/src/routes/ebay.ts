import { Router } from 'express'
import { ebayService } from '../services/ebay.js'

export const ebayRoutes = Router()

ebayRoutes.get('/config', async (req, res) => {
  res.json({ configured: await ebayService.isConfigured() })
})

ebayRoutes.get('/products', async (req, res) => {
  try {
    if (!(await ebayService.isConfigured())) {
      res.status(503).json({ error: 'eBay integration not configured' })
      return
    }
    const q = typeof req.query.q === 'string' ? req.query.q : 'jewelry'
    const products = await ebayService.getProducts(q)
    res.json(products)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

