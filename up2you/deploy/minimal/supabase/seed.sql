-- Insert sample jewelry products
INSERT INTO products (name, description, price, category, metal_type, gemstone, weight, images, sku, stock_quantity, is_featured, is_bundle, bundle_discount) VALUES
('Classic Gold Ring', 'Elegant 18k gold ring with timeless design', 899.00, 'rings', '18k Gold', 'None', 4.5, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=18k%20gold%20ring%20elegant%20classic%20design%20luxury%20jewelry&image_size=square'], 'RING-001', 15, true, false, 0),

('Diamond Stud Earrings', 'Brilliant diamond stud earrings in 14k white gold', 1299.00, 'earrings', '14k Gold', 'Diamond', 2.8, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=diamond%20stud%20earrings%2014k%20white%20gold%20brilliant%20luxury&image_size=square'], 'EAR-001', 8, true, false, 0),

('Pearl Necklace', 'Sophisticated cultured pearl necklace with gold clasp', 799.00, 'necklaces', '18k Gold', 'Pearl', 12.5, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cultured%20pearl%20necklace%2018k%20gold%20clasp%20sophisticated%20elegant&image_size=square'], 'NECK-001', 12, true, false, 0),

('Gold Bracelet', 'Delicate 14k gold chain bracelet with charm', 649.00, 'bracelets', '14k Gold', 'None', 8.2, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=14k%20gold%20chain%20bracelet%20delicate%20charm%20elegant&image_size=square'], 'BRACE-001', 20, false, false, 0),

('Sapphire Ring', 'Stunning blue sapphire ring in platinum setting', 1899.00, 'rings', 'Platinum', 'Sapphire', 6.1, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20sapphire%20ring%20platinum%20setting%20stunning%20luxury&image_size=square'], 'RING-002', 5, true, false, 0),

('Gold Chain Necklace', 'Classic 18k gold chain necklace, perfect for everyday wear', 749.00, 'necklaces', '18k Gold', 'None', 15.3, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=18k%20gold%20chain%20necklace%20classic%20everyday%20elegant&image_size=square'], 'NECK-002', 25, false, false, 0),

('Ruby Earrings', 'Elegant ruby drop earrings in 14k yellow gold', 999.00, 'earrings', '14k Gold', 'Ruby', 4.7, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ruby%20drop%20earrings%2014k%20yellow%20gold%20elegant%20luxury&image_size=square'], 'EAR-002', 10, false, false, 0),

('Silver Cuff Bracelet', 'Modern sterling silver cuff bracelet', 449.00, 'bracelets', 'Sterling Silver', 'None', 18.9, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sterling%20silver%20cuff%20bracelet%20modern%20elegant&image_size=square'], 'BRACE-002', 18, false, false, 0),

('Bridal Ring Set', 'Complete bridal set with engagement ring and wedding band', 2499.00, 'rings', '18k Gold', 'Diamond', 8.5, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=bridal%20ring%20set%20engagement%20wedding%20band%2018k%20gold%20diamond&image_size=square'], 'RING-SET-001', 3, true, true, 15.00),

('Luxury Bundle', 'Complete jewelry set with necklace, earrings, and bracelet', 1899.00, 'bundles', '18k Gold', 'Mixed', 25.6, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20jewelry%20bundle%20necklace%20earrings%20bracelet%2018k%20gold%20elegant&image_size=square'], 'BUNDLE-001', 6, true, true, 20.00),

('Vintage Emerald Ring', 'Art Deco style emerald and diamond ring', 1599.00, 'rings', 'Platinum', 'Emerald', 7.2, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=art%20deco%20emerald%20diamond%20ring%20platinum%20vintage%20luxury&image_size=square'], 'RING-003', 7, false, false, 0),

('Tennis Bracelet', 'Classic diamond tennis bracelet in 14k white gold', 2199.00, 'bracelets', '14k Gold', 'Diamond', 22.1, ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=diamond%20tennis%20bracelet%2014k%20white%20gold%20classic%20luxury&image_size=square'], 'BRACE-003', 4, true, false, 0);