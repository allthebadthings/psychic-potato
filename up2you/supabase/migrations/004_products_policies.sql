-- Ensure public read access to products for catalog browsing
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products"
ON products FOR SELECT
TO anon, authenticated
USING (true);
