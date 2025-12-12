import { Router } from 'express';
import { shopifyService } from '../services/shopify.js';

export const shopifyRoutes = Router();

shopifyRoutes.get('/config', async (req, res) => {
  res.json({
    configured: await shopifyService.isConfigured()
  });
});

shopifyRoutes.get('/products', async (req, res) => {
  if (!await shopifyService.isConfigured()) {
    return res.status(503).json({ error: 'Shopify integration not configured' });
  }

  try {
    const products = await shopifyService.getProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
