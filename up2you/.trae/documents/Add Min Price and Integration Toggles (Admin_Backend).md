## Objectives

* Add a backend-only `min_price` on products (not displayed to shoppers).

* Extend Admin UI to set `min_price` and persist it via API.

* Add integration toggles for marketplaces (e.g., eBay, Whatnot) alongside Shopify, backed by DB configs.

## Database

* Add `min_price DECIMAL(10,2)` to `products` and index `idx_products_min_price`.

* Ensure migrations run cleanly and do not break existing queries.

## Backend APIs

* Products:

  * Accept `min_price` in `POST /api/admin/products` and `PATCH /api/admin/products/:id` (optional).

  * Persist to `products.min_price` when provided; omit from public GET responses (or include only in admin responses).

* Integrations:

  * Generalize config service to support multiple services (`shopify`, `ebay`, `whatnot`).

  * Add endpoints:

    * `GET /api/admin/config/:service` (existing pattern)

    * `POST /api/admin/config/:service` to toggle `is_active` and save any service-specific keys.

  * Keep all admin routes protected by `x-admin-token`.

## Admin UI (Frontend)

* Inventory → Add Product form:

  * Add a new input for `Min Price` (optional). Place in an "Advanced" collapsible section.

  * Include it in the payload to the admin product API.

  * Do not show `min_price` in product list table or any customer-facing views.

* Integrations tab:

  * Add toggle cards for `eBay` and `Whatnot` (similar to Shopify):

    * A simple enable/disable switch.

    * Optional fields for credentials if needed later (kept minimal for now).

  * Persist via `POST /api/admin/config/:service`.

## Security & Validation

* Validate `min_price ≥ 0` server-side; ignore if missing.

* Never return `min_price` from public product endpoints.

* Keep all integration config behind admin auth; never leak secrets.

## Verification

* Lint and type-check all apps.

* Backend: exercise admin endpoints:

  * Create/patch product with `min_price`; confirm stored in DB and not shown on public queries.

  * Toggle eBay/Whatnot configs and verify persisted state via `GET /api/admin/config/:service`.

* Frontend: confirm Admin UI behaves; shoppers do not see `min_price`.

## Rollout

* Apply migration; deploy backend.

* No changes to public UIs required; only Admin UI updates.

* Document usage in README/Admin help (optional).

