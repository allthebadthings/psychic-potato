-- Create products table for jewelry e-commerce
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  metal_type TEXT,
  gemstone TEXT,
  weight DECIMAL(8,2),
  images TEXT[] DEFAULT '{}',
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bundle BOOLEAN DEFAULT FALSE,
  bundle_discount DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_metal_type ON products(metal_type);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_bundle ON products(is_bundle);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT ALL ON products TO service_role;