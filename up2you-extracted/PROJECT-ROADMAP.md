# JEWELRY INVENTORY + BUNDLE E-COMMERCE SYSTEM
## Complete Project Roadmap & Documentation

**Project Name:** up2you Jewelry Inventory & Bundle Storefront  
**Domain:** up2you.kvn.ltd  
**Status:** In Development  
**Last Updated:** 2025-12-11

---

## PROJECT OVERVIEW

### What This System Does
1. **Inventory Management Backend** - Sister logs all jewelry/handmade items (name, price, quantity, photos, materials, location)
2. **Public Storefront** - Customers browse items by category
3. **Bundle Builder** - Customers select items to create custom "looks" or themed bundles
4. **Pricing & Bundles** - She sets base item prices + bundle pricing (minimum + suggested markup)
5. **Payment Processing** - Shopify checkout integration (secure payments)
6. **Real-time Inventory Sync** - Syncs across Shopify, eBay, and internal database
7. **Order Management** - Dashboard to track orders across all platforms
8. **Fulfillment** - She assembles bundles and ships (with integration for labels later)

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER FACING                             │
├─────────────────────────────────────────────────────────────────┤
│  Public Storefront (React)                                      │
│  ├── Item Browse (filtered by category)                         │
│  ├── Bundle Builder (add items to cart)                         │
│  ├── Bundle Preview (shows items + total price)                 │
│  └── Checkout (Shopify payment)                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Node.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Routes:                                                        │
│  ├── /api/items (get all, add, edit, delete)                   │
│  ├── /api/bundles (create, update, get templates)              │
│  ├── /api/orders (get, update status)                          │
│  ├── /api/checkout (create Shopify session)                    │
│  ├── /api/sync (inventory sync logic)                          │
│  └── /api/stats (dashboard data)                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (SQLite)                          │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                        │
│  ├── items (id, name, price, quantity, category, photo, etc)   │
│  ├── bundles (id, name, items_json, base_price, suggested_price)
│  ├── orders (id, customer_email, bundle_items, total, status)   │
│  ├── order_items (maps items to orders for tracking)           │
│  └── platform_sync (syncs between Shopify/eBay)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                              │
├─────────────────────────────────────────────────────────────────┤
│  ├── Shopify API (orders, inventory, checkout)                 │
│  ├── eBay API (inventory sync, orders)                         │
│  └── Stripe/PayPal (backup payment if not using Shopify)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## PROJECT PHASES

### PHASE 1: MVP - CORE FUNCTIONALITY ✓ IN PROGRESS
**Timeline:** 1-2 weeks  
**Goal:** Get up and running with inventory + storefront + bundles

#### 1.1: Enhance Backend (CURRENT)
- [x] Inventory management API (done - COMPLETE-HANDOFF.md)
- [ ] Bundle management endpoints
  - POST /api/bundles (create bundle template)
  - GET /api/bundles (list all bundles)
  - PUT /api/bundles/:id (update bundle pricing)
  - DELETE /api/bundles/:id
- [ ] Order management endpoints
  - POST /api/orders (create order from bundle)
  - GET /api/orders (list all orders)
  - PUT /api/orders/:id (update order status)
- [ ] Inventory deduction logic
  - When order completes, reduce item quantities
  - Prevent overselling (check stock before order)
- [ ] Basic stats endpoint
  - Total revenue, items sold, pending orders

#### 1.2: Build Public Storefront
- [ ] Item catalog page
  - Grid/list view of all items
  - Filter by category
  - Search by name
  - Show price, photo, materials
- [ ] Item detail modal/page
  - Full description, all photos
  - Add to bundle button
- [ ] Bundle builder interface
  - Add items to bundle
  - Remove items
  - See running total
  - "Save this look" option (for templates)
  - "Checkout" button

#### 1.3: Shopify Integration (Basic)
- [ ] Create Shopify app credentials
- [ ] Shopify checkout flow
  - Generate Shopify checkout URL
  - Pass bundle items to Shopify
  - Redirect customer to Shopify payment
- [ ] Order webhook from Shopify
  - When order paid, create order in our DB
  - Deduct inventory
  - Send confirmation email
- [ ] Inventory sync (one-way: our DB → Shopify)
  - Push item quantities to Shopify
  - Push bundle products to Shopify (or dynamic pricing)

#### 1.4: Pricing Logic
- [ ] Base item pricing (from inventory)
- [ ] Bundle pricing options:
  - Minimum bundle price (floor)
  - Suggested markup % (e.g., +15%)
  - Custom per-bundle pricing
- [ ] Price calculator
  - Sum of items + markup = final price
  - Show breakdown to customer

#### 1.5: Admin Backend (Sister's Dashboard)
- [ ] Login/auth (simple, just password)
- [ ] View all orders
  - Order ID, customer email, items, status
  - Filter by status (pending, paid, shipped, etc)
- [ ] Inventory management (reuse from Phase 0)
  - Add/edit/delete items
  - View current quantities
  - Alerts for low stock
- [ ] Bundle templates
  - Create preset bundles (e.g., "Summer Collection")
  - Edit bundle pricing
  - See which bundles are popular
- [ ] Basic reporting
  - Total revenue this month
  - Items sold per category
  - Popular bundles

---

### PHASE 2: eBay SYNC & MULTI-PLATFORM
**Timeline:** 2-3 weeks (after Phase 1 complete)  
**Goal:** Real-time inventory sync across Shopify + eBay

#### 2.1: eBay API Integration
- [ ] Connect eBay seller account
- [ ] Pull eBay listings
  - Get all active listings
  - Map to our inventory items
  - Track eBay quantities
- [ ] Order sync from eBay
  - Fetch new eBay orders
  - Create order in our DB
  - Deduct from shared inventory

#### 2.2: Real-time Inventory Sync
- [ ] Centralized inventory pool
  - One quantity number across Shopify + eBay
  - When item sells anywhere, quantity updates globally
- [ ] Sync logic
  - Every 15 min: pull Shopify + eBay orders
  - Update inventory
  - Push updated quantities back to both platforms
  - Prevent overselling (lock if qty drops below threshold)
- [ ] Conflict resolution
  - If both platforms claim a sale simultaneously, handle gracefully
  - Refund logic if oversold

#### 2.3: Order Management Dashboard
- [ ] View orders from all platforms
  - Filter by platform (Shopify, eBay)
  - Filter by status
  - Sort by date
- [ ] Order fulfillment workflow
  - Mark as "packed"
  - Mark as "shipped"
  - Generate shipping labels (integrate with Pirate Ship or Stamps.com)
- [ ] Customer communication
  - Auto-send tracking info
  - Note any delays

#### 2.4: Advanced Reporting
- [ ] Revenue breakdown by platform
- [ ] Inventory turnover (which items sell fastest)
- [ ] Bundle performance (which bundles sell most)
- [ ] Profit margins (cost of goods vs selling price)

---

### PHASE 3: POLISH & OPTIMIZATION
**Timeline:** 1-2 weeks  
**Goal:** Make it production-ready and performant

#### 3.1: Frontend Polish
- [ ] Mobile optimization (responsive design)
- [ ] Image optimization (lazy load, compression)
- [ ] Search functionality (full-text search across items)
- [ ] Customer reviews/ratings
- [ ] Wishlist feature

#### 3.2: Backend Optimization
- [ ] Database indexing (speed up queries)
- [ ] Caching (Redis for fast lookups)
- [ ] Rate limiting (prevent abuse)
- [ ] Error handling & logging
- [ ] Automated backups

#### 3.3: Security
- [ ] HTTPS/SSL (already on kvn.ltd)
- [ ] Input validation (prevent injection)
- [ ] Admin auth (stronger than password)
- [ ] Data encryption (sensitive data)
- [ ] PCI compliance (for payment data)

#### 3.4: Testing & Monitoring
- [ ] Load testing (can it handle 100 concurrent users?)
- [ ] Integration testing (Shopify/eBay sync)
- [ ] Uptime monitoring
- [ ] Error alerts (if sync fails)

---

### PHASE 4: ADVANCED FEATURES
**Timeline:** Optional, post-launch  
**Goal:** Competitive features & scaling

#### 4.1: Customer Features
- [ ] Accounts & order history
- [ ] Save favorite bundles
- [ ] Size/fit guide
- [ ] Bundle recommendations (AI)
- [ ] Social sharing (Instagram integration)

#### 4.2: Admin Features
- [ ] Bulk operations (add 50 items at once)
- [ ] CSV import/export
- [ ] Automatic reorder alerts
- [ ] Supplier management
- [ ] Cost tracking (material costs)

#### 4.3: Marketing
- [ ] Email campaigns (to past customers)
- [ ] Discount codes/coupons
- [ ] Seasonal promotions
- [ ] Analytics (Google Analytics integration)
- [ ] SEO optimization

#### 4.4: Expansion
- [ ] Multi-currency support
- [ ] International shipping
- [ ] Subscription boxes (curated monthly bundles)
- [ ] Custom orders (customer can request specific bundle)

---

## DETAILED SPECIFICATIONS

### DATABASE SCHEMA

#### items table
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  materials TEXT,
  category TEXT,
  price REAL,
  quantity INTEGER DEFAULT 0,
  location TEXT,
  photo TEXT,
  cost_of_goods REAL, -- for profit tracking (Phase 4)
  sku TEXT UNIQUE, -- for eBay/Shopify sync
  shopify_id TEXT, -- Shopify product ID
  ebay_id TEXT, -- eBay item ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### bundles table
```sql
CREATE TABLE bundles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  items_json TEXT, -- JSON: [{item_id: 1, item_id: 2}, ...]
  base_price REAL, -- minimum price
  suggested_price REAL, -- base + markup
  custom_price REAL, -- if sister sets specific price
  photo TEXT, -- bundle cover image
  is_template BOOLEAN DEFAULT 0, -- 1 = preset bundle, 0 = custom
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### orders table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE,
  customer_email TEXT,
  customer_name TEXT,
  bundle_items_json TEXT, -- JSON: [{item_id: 1, qty: 1}, ...]
  bundle_id INTEGER, -- reference to bundles table (if from template)
  subtotal REAL,
  tax REAL,
  shipping REAL,
  total REAL,
  status TEXT, -- 'pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled'
  payment_method TEXT, -- 'shopify', 'stripe', 'paypal'
  shopify_order_id TEXT,
  ebay_order_id TEXT,
  shipping_address_json TEXT, -- JSON of address
  tracking_number TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### order_items table (for tracking inventory deduction)
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  item_id INTEGER,
  quantity INTEGER,
  price_at_purchase REAL, -- capture price in case it changes later
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(item_id) REFERENCES items(id)
);
```

#### platform_sync table (for tracking syncs)
```sql
CREATE TABLE platform_sync (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT, -- 'shopify' or 'ebay'
  sync_type TEXT, -- 'inventory', 'orders', 'listings'
  last_sync DATETIME,
  next_sync DATETIME,
  status TEXT, -- 'success', 'pending', 'error'
  error_message TEXT,
  items_synced INTEGER
);
```

---

### API ENDPOINTS (Full List)

#### ITEMS
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/category/:category` - Filter by category
- `GET /api/items/low-stock` - Items below threshold (Phase 2)

#### BUNDLES
- `GET /api/bundles` - Get all bundles
- `GET /api/bundles/:id` - Get single bundle
- `POST /api/bundles` - Create bundle
- `PUT /api/bundles/:id` - Update bundle
- `DELETE /api/bundles/:id` - Delete bundle
- `POST /api/bundles/calculate-price` - Calculate bundle price given items
- `GET /api/bundles/templates` - Get preset bundles

#### ORDERS
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order from bundle (after payment)
- `PUT /api/orders/:id` - Update order (status, tracking, etc)
- `GET /api/orders/status/:status` - Filter by status

#### CHECKOUT
- `POST /api/checkout/shopify` - Create Shopify checkout session
- `POST /api/checkout/webhook/shopify` - Webhook from Shopify (payment confirmation)

#### INVENTORY SYNC (Phase 2)
- `POST /api/sync/shopify` - Manual sync to Shopify
- `POST /api/sync/ebay` - Manual sync to eBay
- `GET /api/sync/status` - Check sync status
- `POST /api/sync/auto` - Start automatic sync loop

#### ADMIN/STATS
- `GET /api/stats` - Dashboard stats (revenue, items sold, etc)
- `POST /api/admin/login` - Sister login
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/orders/export` - Export orders as CSV

#### PUBLIC (CUSTOMER FACING)
- `GET /api/public/items` - Get all items (no auth)
- `GET /api/public/items/:id` - Get item details
- `GET /api/public/bundles/templates` - Get preset bundles
- `POST /api/public/bundles/preview` - Preview bundle pricing (no payment)

---

### ENVIRONMENT VARIABLES

```bash
# Backend
PORT=3001
NODE_ENV=production
DATABASE_PATH=/var/www/inventory-api/inventory.db
UPLOAD_PATH=/var/www/inventory-api/uploads

# Shopify
SHOPIFY_API_KEY=xxxxx
SHOPIFY_API_SECRET=xxxxx
SHOPIFY_SHOP_NAME=sister-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=xxxxx

# eBay (Phase 2)
EBAY_CLIENT_ID=xxxxx
EBAY_CLIENT_SECRET=xxxxx
EBAY_REFRESH_TOKEN=xxxxx
EBAY_SANDBOX=false

# Admin Auth
ADMIN_PASSWORD=xxxxx (use proper auth in production)

# Frontend
REACT_APP_API_URL=http://up2you.kvn.ltd
REACT_APP_ENV=production
```

---

## FILE STRUCTURE (Final)

```
/var/www/
├── inventory-api/
│   ├── server.js (main backend - will expand)
│   ├── package.json
│   ├── inventory.db (SQLite database)
│   ├── uploads/ (customer photos)
│   ├── routes/
│   │   ├── items.js
│   │   ├── bundles.js
│   │   ├── orders.js
│   │   ├── checkout.js
│   │   ├── sync.js (Phase 2)
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── shopify.js (Phase 1.3)
│   │   ├── ebay.js (Phase 2.1)
│   │   └── sync.js (Phase 2.2)
│   └── .env
│
├── inventory-web/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── pages/
│   │   │   ├── Storefront.js (public - Phase 1.2)
│   │   │   ├── BundleBuilder.js (public - Phase 1.2)
│   │   │   ├── Checkout.js (public - Phase 1.3)
│   │   │   ├── AdminDashboard.js (private - Phase 1.5)
│   │   │   ├── InventoryManagement.js (reuse from Phase 0)
│   │   │   ├── OrderManagement.js (Phase 1.5)
│   │   │   └── OrderManagementMulti.js (Phase 2.3)
│   │   ├── components/
│   │   │   ├── ItemCard.js
│   │   │   ├── BundlePreview.js
│   │   │   ├── PriceCalculator.js
│   │   │   └── ...
│   │   └── .env
│   ├── package.json
│   └── build/ (after npm run build)
```

---

## IMPLEMENTATION TIMELINE

| Phase | What | Timeline | Status |
|-------|------|----------|--------|
| 0 | Inventory API + Basic Storefront | ✓ DONE | Complete |
| 1.1 | Bundle management endpoints | Week 1 | Ready to start |
| 1.2 | Public storefront UI | Week 1-2 | Ready to start |
| 1.3 | Shopify integration | Week 2 | Ready to start |
| 1.4 | Pricing logic | Week 2 | Ready to start |
| 1.5 | Admin dashboard | Week 2 | Ready to start |
| 2 | eBay sync + multi-platform | Week 3-5 | After Phase 1 |
| 3 | Polish & optimization | Week 5-6 | After Phase 2 |
| 4 | Advanced features | Ongoing | Post-launch |

---

## WHAT'S ALREADY BUILT (PHASE 0 - COMPLETE)

✓ **Backend API** (server.js)
- Express.js server
- SQLite database
- Item CRUD endpoints
- CSV export
- Photo upload
- Dashboard stats

✓ **Frontend** (App.jsx + App.css)
- Inventory management interface
- Item add/edit/delete
- Category filtering
- Photo support
- CSV export

✓ **Deployment**
- Nginx configuration (up2you.kvn.ltd)
- PM2 auto-restart setup
- File structure on server

---

## DEPENDENCIES (All Phases)

### Backend
```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "dotenv": "^16.0.3",
  "shopify-api-node": "^3.11.6", // Phase 1.3
  "ebay-api": "^1.2.6", // Phase 2.1
  "node-cron": "^3.0.2", // Phase 2.2 (for scheduled sync)
  "axios": "^1.3.0", // HTTP requests
  "redis": "^4.6.0", // Phase 3.2 (optional caching)
  "winston": "^3.8.0" // Phase 3.2 (logging)
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.3.0", // API calls
  "react-router-dom": "^6.8.0", // Phase 1.2 (multi-page routing),
  "shopify-buy": "^3.11.0" // Phase 1.3 (Shopify checkout)
}
```

---

## KNOWN RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Overselling (item sells on 2 platforms simultaneously) | Customer disappointment, refunds | Implement inventory locking, real-time sync every 5 min |
| Shopify/eBay API rate limits | Sync delays | Implement backoff/retry logic, batch operations |
| Database corruption | Data loss | Automated daily backups, transaction logging |
| High traffic (many customers browsing) | Slow page load | Caching, database indexing, CDN for images |
| Payment processing errors | Failed orders, lost sales | Robust error handling, webhook retries |
| Complex bundle pricing logic | Incorrect charges | Unit tests on pricing calculator |

---

## SUCCESS METRICS (Post-Launch)

- [ ] System up 99.9% of the time
- [ ] Checkout takes <3 seconds
- [ ] Orders process within 1 hour
- [ ] Customer support tickets <5/week
- [ ] Revenue tracking accurate ±$0
- [ ] Inventory syncs within 5 minutes across platforms
- [ ] Sister can manage 1000+ items without performance issues

---

## NEXT STEPS (What to Build Now)

1. **Expand Backend** - Add bundle, order, and checkout endpoints (Phase 1.1)
2. **Build Storefront UI** - Public-facing item browse + bundle builder (Phase 1.2)
3. **Integrate Shopify** - Connect API, handle payments (Phase 1.3)
4. **Admin Dashboard** - Sister's control panel for orders & inventory (Phase 1.5)
5. **Test** - Ensure everything works end-to-end

---

## CONTACT & SUPPORT

- Questions? Ask directly.
- Bugs? Create detailed logs and provide error messages.
- Changes? Document them and update this roadmap.

---

**Created:** 2025-12-11  
**Last Updated:** 2025-12-11  
**Status:** In Development (Phase 1 Starting)
