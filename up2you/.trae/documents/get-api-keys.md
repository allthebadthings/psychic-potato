# Get API Keys and Tokens

This guide explains how the site owner can obtain and configure API credentials for third‑party integrations.

## eBay (Buy Browse API)

### Prerequisites
- eBay Developer account: `https://developer.ebay.com`
- Access to the Developer Portal to create App Keys and generate OAuth tokens

### Steps: Create App Keys
1. Sign in to the eBay Developer Portal
2. Go to "Apps" → "Create a new keyset"
3. Create keys for Production (recommended) or Sandbox
   - Client ID (App ID)
   - Client Secret (Cert ID)
   - (Optional) RuName for user flows — not required for Browse API

### Steps: Generate an Application Access Token
The Browse API uses an application access token (Client Credentials Grant), no user consent required.

1. In the Developer Portal, open "OAuth Token Tool"
2. Select Environment: `Production`
3. Grant type: `Client Credentials`
4. Scopes (at minimum):
   - `https://api.ebay.com/oauth/api_scope`
   - `https://api.ebay.com/oauth/api_scope/buy.browse`
   - If the tool lists `buy.browse.readonly`, include that as well
5. Click "Get Token" and copy the token string (`eyJ...`)

### Configure in Backend
Add the token to the backend environment. Use either a `.env` file (not committed) or your hosting environment variables.

```
# backend/.env
EBAY_OAUTH_TOKEN=eyJhbGciOi...
EBAY_MARKETPLACE_ID=EBAY_US
```

Restart the backend server after setting the variables.

### Verify
1. `GET /api/ebay/config` → `{ "configured": true }`
2. `GET /api/ebay/products?q=jewelry` → returns a JSON array of products
3. Jewelry site catalog will automatically include eBay items in listings

### Notes
- Tokens expire (typically in hours). Regenerate as needed, or switch to programmatic token acquisition in code.
- `EBAY_MARKETPLACE_ID` defaults to `EBAY_US`. Set other IDs as needed (e.g., `EBAY_GB`).
- Do not commit secrets to source control.

## Shopify
For Admin API access:
1. In Shopify Admin, create a Private App (or Custom App) with read permissions for Products
2. Copy the Access Token
3. Configure via backend `.env` or Admin → Integrations tab

```
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_...
```

Verify with: `GET /api/shopify/config` → `{ "configured": true }`

