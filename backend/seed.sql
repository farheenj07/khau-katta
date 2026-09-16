-- ============================================================================
-- KHAU KATTA MARKETPLACE (BELAGAVI) - SEED DATA
-- Version: 1.0.0
-- Dialect: ANSI SQL / PostgreSQL / SQLite compatible
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
('role-cust-001', 'customer', 'End consumer browsing stalls and placing home delivery orders'),
('role-admin-002', 'admin', 'Marketplace administrator managing stalls, users, orders, and delivery partners'),
('role-deliv-003', 'delivery_partner', 'Belagavi local delivery rider fulfilling orders from Khau Katta stalls'),
('role-owner-004', 'stall_owner', 'Local merchant running a shop/stall in Khau Katta');

-- 2. USERS
INSERT INTO users (id, role_id, name, email, phone, status, avatar_url) VALUES
('usr-admin-01', 'role-admin-002', 'Basavaraj Patil (Admin)', 'admin@khaukatta.in', '+91 94481 00001', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('usr-cust-01', 'role-cust-001', 'Pooja Kulkarni', 'pooja.k@example.com', '+91 98450 12345', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('usr-deliv-01', 'role-deliv-003', 'Ramesh Naik', 'ramesh.delivery@khaukatta.in', '+91 97400 98765', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('usr-owner-01', 'role-owner-004', 'Mahadev Purohit', 'purohit.kunda@khaukatta.in', '+91 94480 11111', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('usr-owner-02', 'role-owner-004', 'Sunita Jadhav', 'jadhav.misal@khaukatta.in', '+91 94480 22222', 'active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150');

-- 3. USER ADDRESSES
INSERT INTO user_addresses (id, user_id, label, address_line1, address_line2, area, landmark, city, pincode, is_default) VALUES
('addr-01', 'usr-cust-01', 'Home', 'Flat 402, Sai Residency', 'Near Nucleus Mall, Camp', 'Camp', 'Near Nucleus Mall', 'Belagavi', '590001', TRUE),
('addr-02', 'usr-cust-01', 'Office', 'Suite 12, Khanapur Road', 'Opposite Golf Ground', 'Tilakwadi', 'Opposite Golf Ground', 'Belagavi', '590006', FALSE);

-- 4. STALL CATEGORIES (9 primary categories)
INSERT INTO stall_categories (id, name, slug, icon, description, display_order) VALUES
('cat-fb', 'Food & Beverages', 'food-and-beverages', 'Coffee', 'Authentic Belagavi chai, sharbats, juices, and specialty drinks', 1),
('cat-ff', 'Fast Food', 'fast-food', 'Utensils', 'Belagavi girmit, chaats, spicy misal, bajjis, and quick bites', 2),
('cat-des', 'Desserts', 'desserts', 'Cake', 'World-famous Belagavi Kunda, Gokak Karadant, pedhas, and sweets', 3),
('cat-jew', 'Jewellery', 'jewellery', 'Gem', 'Traditional Kolhapuri saaj, silver trinkets, temple & antique jewellery', 4),
('cat-clo', 'Clothing', 'clothing', 'Shirt', 'Shahapur handloom sarees, cotton kurtis, scarves, and ethnic wear', 5),
('cat-toy', 'Toys', 'toys', 'Gamepad2', 'Handcrafted wooden toys, educational puzzles, and play collectibles', 6),
('cat-gif', 'Gifts', 'gifts', 'Gift', 'Brass curios, Belagavi mementos, handmade cards, and festive gift hampers', 7),
('cat-acc', 'Accessories', 'accessories', 'Watch', 'Handcrafted leather chappals, wallets, bags, belts, and daily essentials', 8),
('cat-oth', 'Other', 'other', 'Store', 'Belagavi organic spices, pottery, natural soaps, and local artisanal supplies', 9);

-- 5. STALLS (10 representative Belagavi stalls, ready to scale to 50+)
INSERT INTO stalls (id, category_id, owner_user_id, name, slug, stall_number, short_description, description, image_url, banner_url, rating, review_count, opening_time, closing_time, is_open, is_featured, contact_phone) VALUES
('stall-01', 'cat-des', 'usr-owner-01', 'Belgaum Kunda & Sweets House', 'belgaum-kunda-and-sweets', 'KK-01', 'Iconic caramelized Belagavi Kunda made from slow-cooked pure milk & dry fruits.', 'Founded in 1958, our stall at Khau Katta continues the golden legacy of Belagavi sweet-making. We specialize in hot oven Kunda, rich Gokak Karadant, and handmade Dharwad Pedha using pure A2 cow milk and organic jaggery.', 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1000', 4.9, 342, '09:00 AM', '10:30 PM', TRUE, TRUE, '+91 94480 11111'),

('stall-02', 'cat-ff', 'usr-owner-02', 'Camp Misal & Chaat Durbar', 'camp-misal-chaat-durbar', 'KK-02', 'Fiery Kolhapuri-Belagavi rassa misal, crunchy farsan, and tangy street chaats.', 'A beloved institution at Khau Katta! Our spicy tarri misal is cooked with stone-ground spices and served with piping hot pav and lemon wedges. Also serving crispy sev puri, dahi bhel, and spicy ragda patties.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000', 4.8, 410, '10:00 AM', '10:00 PM', TRUE, TRUE, '+91 94480 22222'),

('stall-03', 'cat-fb', 'usr-owner-01', 'Tilakwadi Kadak Chai & Bun Maska', 'tilakwadi-kadak-chai-bun-maska', 'KK-03', 'Slow-brewed ginger cardamom tea paired with fluffy buttered Irani buns.', 'The premier meeting spot in Khau Katta. Brewed in brass samovars with fresh mountain spices, our kadak chai and warm maska buns offer pure nostalgic warmth on breezy Belagavi evenings.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000', 4.7, 280, '07:30 AM', '11:00 PM', TRUE, FALSE, '+91 94480 33333'),

('stall-04', 'cat-jew', NULL, 'Belagavi Royal Silver & Kolhapuri Saaj', 'belagavi-royal-silver-kolhapuri-saaj', 'KK-04', 'Artisanal 925 sterling silver jewelry, traditional Saaj necklaces, and payals.', 'Showcasing the glorious metallic craftsmanship of North Karnataka and Maharashtra borderlands. Each item is handcrafted by generational silversmiths with hallmarks of purity and heritage finish.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000', 4.9, 185, '10:30 AM', '09:00 PM', TRUE, TRUE, '+91 94480 44444'),

('stall-05', 'cat-clo', NULL, 'Shahapur Handlooms & Ethnic Kurtis', 'shahapur-handlooms-ethnic-kurtis', 'KK-05', 'Breathable cotton sarees, Belagavi handloom weaves, and comfortable daily kurtis.', 'Direct from Shahapur weaver collectives! Featuring natural vegetable-dyed fabrics, Ilkal borders, and airy everyday ethnic garments tailored for Belagavi weather.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000', 4.6, 95, '11:00 AM', '09:30 PM', TRUE, FALSE, '+91 94480 55555'),

('stall-06', 'cat-toy', NULL, 'Chennamma Wooden Toys & Puzzles', 'chennamma-wooden-toys-puzzles', 'KK-06', 'Eco-friendly non-toxic lacquered wooden toys, rocking horses, and brain teasers.', 'Preserving artisanal wooden toymaking traditions. Made from natural Wrightia tinctoria wood with plant-based lacquer dyes, completely safe and durable for young kids and collectors.', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1000', 4.8, 120, '10:00 AM', '09:00 PM', TRUE, FALSE, '+91 94480 66666'),

('stall-07', 'cat-gif', NULL, 'Belagavi Brass & Bell-Metal Gift Emporium', 'belagavi-brass-bell-metal-gifts', 'KK-07', 'Intricately engraved brass diyas, temple bells, handcrafted figurines, and corporate mementos.', 'Belagavi is renowned for its historic brass metalworks. Our stall offers handcrafted pooja brassware, artistic figurines, bells, and decorative wall hangings perfect for festive gifting.', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000', 4.7, 140, '10:00 AM', '08:30 PM', TRUE, TRUE, '+91 94480 77777'),

('stall-08', 'cat-acc', NULL, 'Fort Road Leather Goods & Chappals', 'fort-road-leather-goods-chappals', 'KK-08', 'Genuine handcrafted leather Kolhapuri chappals, durable belts, wallets, and bags.', 'Authentic hand-stitched leather footwear and accessories built to last decades. Features vegetable-tanned leather with traditional braided straps and comfortable ergonomics.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000', 4.7, 210, '10:30 AM', '09:30 PM', TRUE, FALSE, '+91 94480 88888'),

('stall-09', 'cat-ff', NULL, 'Shree Ganesh Mirchi Bajji & Girmit Stall', 'shree-ganesh-mirchi-bajji-girmit', 'KK-09', 'Crispy spicy hot mirchi bajjis and authentic North Karnataka spicy puffed-rice Girmit.', 'The quintessential Belagavi evening snack! Crispy deep-fried gram flour bajjis stuffed with tangy spices, accompanied by Girmit topped with chopped onions, coriander, and roasted peanuts.', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000', 4.9, 520, '03:00 PM', '10:30 PM', TRUE, TRUE, '+91 94480 99999'),

('stall-10', 'cat-oth', NULL, 'Malaprabha Organic Spice & Herbal Corner', 'malaprabha-organic-spice-herbal', 'KK-10', 'Forest honey, Western Ghats whole spices, handmade cold-pressed soaps, and herbal oils.', 'Sourced directly from local farmers along the Malaprabha river basin. Pure unpasteurized forest honey, whole black pepper, cardamom, and natural Ayurvedic skincare bars.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000', 4.8, 160, '09:30 AM', '08:00 PM', FALSE, FALSE, '+91 94480 10101');

-- 6. PRODUCT CATEGORIES (Sub-categories inside stalls)
INSERT INTO product_categories (id, stall_id, name, display_order) VALUES
('pcat-01', 'stall-01', 'Authentic Belgaum Kunda', 1),
('pcat-02', 'stall-01', 'Heritage Sweets', 2),
('pcat-03', 'stall-02', 'Specialty Misal', 1),
('pcat-04', 'stall-02', 'Street Chaats', 2),
('pcat-05', 'stall-03', 'Hot Beverages', 1),
('pcat-06', 'stall-03', 'Bakery & Maska', 2),
('pcat-07', 'stall-04', 'Necklaces & Saaj', 1),
('pcat-08', 'stall-04', 'Earrings & Rings', 2),
('pcat-09', 'stall-05', 'Sarees & Drapes', 1),
('pcat-10', 'stall-06', 'Wooden Toys', 1),
('pcat-11', 'stall-07', 'Brass Decor', 1),
('pcat-12', 'stall-08', 'Kolhapuri Chappals', 1),
('pcat-13', 'stall-09', 'Bajjis & Snacks', 1),
('pcat-14', 'stall-10', 'Spices & Honey', 1);

-- 7. PRODUCTS (35+ products across stalls)
INSERT INTO products (id, stall_id, product_category_id, name, description, price, is_veg, is_available, image_url, badge, preparation_time_mins) VALUES
-- Stall 01: Belgaum Kunda
('prod-01', 'stall-01', 'pcat-01', 'Classic Belgaum Kunda (500g)', 'World famous caramelized milk delicacy roasted to deep brown perfection with cardamom.', 260.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300', 'Bestseller', 10),
('prod-02', 'stall-01', 'pcat-01', 'Dry Fruit Special Kunda (500g)', 'Enriched with roasted cashews, almonds, and pistachios in pure ghee base.', 340.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300', 'Belagavi Special', 10),
('prod-03', 'stall-01', 'pcat-02', 'Gokak Karadant (400g)', 'Nutritious dry fruit chewy fudge made with edible gum (dink), organic jaggery, and dates.', 290.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300', 'Nutritious', 5),
('prod-04', 'stall-01', 'pcat-02', 'Special Dharwad Pedha (250g)', 'Slow roasted caramelized milk fudge dusted with powdered cane sugar.', 180.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300', 'Classic', 5),

-- Stall 02: Camp Misal
('prod-05', 'stall-02', 'pcat-03', 'Special Camp Tarri Misal Pav', 'Spicy sprouted moth bean curry served with crunchy farsan, 2 fresh pavs, lemon & curd.', 110.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', 'Bestseller', 15),
('prod-06', 'stall-02', 'pcat-03', 'Cheese Butter Misal Pav', 'Camp misal generously loaded with molten Amul butter and shredded processed cheese.', 160.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', 'Popular', 15),
('prod-07', 'stall-02', 'pcat-04', 'Special Sev Puri (6 pcs)', 'Crispy puris layered with mashed potatoes, spiced chutneys, sev, and raw mango slivers.', 70.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', 'Crunchy', 10),
('prod-08', 'stall-02', 'pcat-04', 'Dahi Papdi Chaat', 'Crisp papdis drowned in whipped sweet yogurt, date-tamarind chutney, and roasted cumin.', 90.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', 'Refreshing', 10),

-- Stall 03: Kadak Chai
('prod-09', 'stall-03', 'pcat-05', 'Special Masala Kadak Chai', 'Thick brewed tea with crushed fresh ginger, green cardamom, and lemongrass.', 25.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300', 'Top Rated', 5),
('prod-10', 'stall-03', 'pcat-05', 'Saffron Elaichi Chai', 'Royal brew infused with pure Kashmiri saffron strands and ground cardamom pods.', 45.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300', 'Special', 5),
('prod-11', 'stall-03', 'pcat-06', 'Classic Bun Maska', 'Freshly baked pillowy bun slathered with rich salted table butter.', 40.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', 'Breakfast Staple', 5),
('prod-12', 'stall-03', 'pcat-06', 'Bun Maska Jam with Dry Fruits', 'Butter-toasted bun with mixed fruit jam and chopped roasted almond flakes.', 65.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', 'Sweet Delight', 5),

-- Stall 04: Jewellery
('prod-13', 'stall-04', 'pcat-07', 'Handcrafted Kolhapuri Saaj Necklace', 'Gold-plated traditional Maharashtrian/North-Karnataka bridal necklace with 21 symbolic leaves.', 1450.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300', 'Heritage Piece', 20),
('prod-14', 'stall-04', 'pcat-07', '925 Sterling Silver Tribal Choker', 'Hallmarked pure silver adjustable neckpiece engraved with floral filigree motifs.', 2800.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300', 'Pure Silver', 20),
('prod-15', 'stall-04', 'pcat-08', 'Oxidized Silver Jhumkas', 'Dramatic lightweight jhumkas featuring delicate hanging pearls and peacock carvings.', 450.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300', 'Festive Pick', 10),

-- Stall 05: Clothing
('prod-16', 'stall-05', 'pcat-09', 'Shahapur Handloom Cotton Saree', 'Traditional handwoven pure cotton saree with contrast border and soft drape.', 1250.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300', 'Artisanal', 15),
('prod-17', 'stall-05', 'pcat-09', 'Ilkal Silk-Cotton Saree (Red Border)', 'Famous regional weave featuring traditional "tope teni" pallu and temple border.', 2150.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300', 'Authentic Weave', 15),

-- Stall 06: Toys
('prod-18', 'stall-06', 'pcat-10', 'Wooden Rocking Horse Toy', 'Smoothly hand-sanded non-toxic pine wood rocking horse suitable for toddlers.', 780.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300', 'Child Safe', 10),
('prod-19', 'stall-06', 'pcat-10', 'Channapatna Lacquer Spinning Tops (Set of 3)', 'Vibrant natural vegetable lacquer spinning tops that spin effortlessly.', 250.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300', 'Traditional', 5),

-- Stall 07: Gifts
('prod-20', 'stall-07', 'pcat-11', 'Belagavi Handcrafted Brass Mayur Diya', 'Solid brass peacock oil lamp measuring 8 inches, cast using lost-wax technique.', 890.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300', 'Artisanal Brass', 10),
('prod-21', 'stall-07', 'pcat-11', 'Temple Brass Bell with Garuda Handle', 'Clear acoustic resonant bell cast from pure bell metal bronze.', 650.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300', 'Pure Metal', 10),

-- Stall 08: Leather Accessories
('prod-22', 'stall-08', 'pcat-12', 'Classic Belagavi Leather Kolhapuri Chappals', 'Hand-stitched pure buffalo hide chappals with intricate braided strap in natural tan.', 950.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', 'Handmade', 15),
('prod-23', 'stall-08', 'pcat-12', 'Full Grain Leather Bifold Wallet', 'Durable handcrafted leather wallet with 8 card slots and currency compartment.', 480.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', 'Durable', 10),

-- Stall 09: Snacks
('prod-24', 'stall-09', 'pcat-13', 'Belagavi Special Girmit Plate', 'Puffed rice tossed in spicy tamarind-onion-garlic masala, topped with sev and onions.', 50.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300', 'Iconic Street Food', 5),
('prod-25', 'stall-09', 'pcat-13', 'Crispy Mirchi Bajji (4 pcs)', 'Plump green chillies dipped in spiced chickpea batter and deep-fried golden brown.', 40.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300', 'Hot & Crispy', 10),

-- Stall 10: Spices & Honey
('prod-26', 'stall-10', 'pcat-14', 'Raw Western Ghats Forest Honey (500g)', 'Unprocessed multi-flora wild honey sustainably gathered from Belagavi forests.', 380.00, TRUE, FALSE, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', 'Pure & Raw', 5);

-- 8. COUPONS
INSERT INTO coupons (id, code, title, description, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, is_active) VALUES
('cpn-01', 'KHAUKATTA50', '50% Off First Order', 'Welcome gift for first time Belagavi digital shoppers', 'percentage', 50.00, 200.00, 100.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE),
('cpn-02', 'BELAGAVIFREE', 'Free Delivery', 'Get zero delivery fee on orders from any Khau Katta stall', 'flat', 30.00, 150.00, 30.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE);

-- 9. ORDERS (Sample completed order)
INSERT INTO orders (id, order_number, user_id, stall_id, address_id, coupon_id, subtotal, discount_amount, delivery_fee, tax_amount, total_amount, status, special_instructions) VALUES
('ord-001', 'KK-2026-00129', 'usr-cust-01', 'stall-01', 'addr-01', 'cpn-01', 520.00, 100.00, 30.00, 0.00, 450.00, 'delivered', 'Please pack Kunda warm if possible.');

-- 10. ORDER ITEMS
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, notes) VALUES
('item-01', 'ord-001', 'prod-01', 2, 260.00, 520.00, 'Fresh batch please');

-- 11. PAYMENTS
INSERT INTO payments (id, order_id, payment_method, transaction_id, amount, status, payment_gateway, paid_at) VALUES
('pay-001', 'ord-001', 'upi', 'UPI_KK_983742918', 450.00, 'completed', 'PhonePe', '2026-09-08 17:45:00');

-- 12. DELIVERY PARTNERS
INSERT INTO delivery_partners (id, user_id, vehicle_type, vehicle_number, driving_license_number, status, is_available, rating, total_deliveries) VALUES
('del-001', 'usr-deliv-01', 'scooter', 'KA-22-EX-4589', 'DL-KA22-2020-00192', 'approved', TRUE, 4.8, 142);

-- 13. DELIVERY ASSIGNMENTS
INSERT INTO delivery_assignments (id, order_id, delivery_partner_id, status, assigned_at, accepted_at, picked_up_at, delivered_at) VALUES
('asgn-001', 'ord-001', 'del-001', 'delivered', '2026-09-08 17:46:00', '2026-09-08 17:48:00', '2026-09-08 18:05:00', '2026-09-08 18:24:00');

-- 14. DELIVERY LOCATIONS
INSERT INTO delivery_locations (id, delivery_partner_id, latitude, longitude, heading) VALUES
('loc-001', 'del-001', 15.8497, 74.4977, 45.0);

-- 15. REVIEWS
INSERT INTO reviews (id, order_id, user_id, stall_id, rating, comment) VALUES
('rev-001', 'ord-001', 'usr-cust-01', 'stall-01', 5, 'Authentic Belagavi taste! Arrived fresh and hot, beautifully packed.');

-- 16. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
('notif-001', 'usr-cust-01', 'Welcome to Khau Katta Belagavi!', 'Explore over 50 local stalls online and enjoy doorstep delivery across Belagavi.', 'promo', FALSE);
