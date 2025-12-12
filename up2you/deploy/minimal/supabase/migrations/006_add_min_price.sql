-- Add optional min_price for backend use
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_price DECIMAL(10,2);

-- Optional index if querying by min_price
CREATE INDEX IF NOT EXISTS idx_products_min_price ON products(min_price);
