import { configService } from './config.js'

interface EbayConfig {
  oauthToken: string
  marketplaceId?: string // default EBAY_US
}

type EbayItem = {
  itemId: string
  title: string
  price?: { value: string }
  image?: { imageUrl: string }
}

export const ebayService = {
  async getConfig(): Promise<EbayConfig | null> {
    const cfg = await configService.getConfig('ebay')
    if (cfg && cfg.is_active) {
      return cfg.config as EbayConfig
    }
    if (process.env.EBAY_OAUTH_TOKEN) {
      return { oauthToken: process.env.EBAY_OAUTH_TOKEN || '', marketplaceId: process.env.EBAY_MARKETPLACE_ID || '' }
    }
    return null
  },

  async isConfigured(): Promise<boolean> {
    const c = await this.getConfig()
    return !!(c && c.oauthToken)
  },

  async getProducts(query = 'jewelry') {
    const cfg = await this.getConfig()
    if (!cfg || !cfg.oauthToken) throw new Error('eBay is not configured')

    const mp = cfg.marketplaceId || 'EBAY_US'
    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cfg.oauthToken}`,
        'X-EBAY-C-MARKETPLACE-ID': mp,
      },
    })
    if (!res.ok) throw new Error(`eBay API error: ${res.status}`)
    const data = await res.json()
    const items: EbayItem[] = data.itemSummaries || []

    return items.map((it) => ({
      id: `ebay_${it.itemId}`,
      name: it.title,
      description: '',
      price: Number(it.price?.value || 0),
      category: 'marketplace',
      metal_type: 'Unknown',
      gemstone: 'Unknown',
      weight: 0,
      images: it.image?.imageUrl ? [it.image.imageUrl] : [],
      sku: it.itemId,
      stock_quantity: 0,
      is_featured: false,
      is_bundle: false,
      bundle_discount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  },
}
