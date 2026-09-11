import {
  StallCategory,
  Stall,
  Product,
  ProductCategory,
  User,
  Role,
  DeliveryPartner,
  Order,
  OrderItem,
  UserAddress,
  Review,
  ReviewReport,
  ReviewRatingBreakdown,
  OtpRecord,
  AdminStats,
  Cart,
  CartItem,
  CartSummary
} from '../types';

export const roles: Role[] = [
  { id: 'role-cust-001', name: 'customer', description: 'End consumer browsing stalls and placing home delivery orders', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'role-admin-002', name: 'admin', description: 'Marketplace administrator managing stalls, users, orders, and delivery partners', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'role-deliv-003', name: 'delivery_partner', description: 'Belagavi local delivery rider fulfilling orders from Khau Katta stalls', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'role-owner-004', name: 'stall_owner', description: 'Local merchant running a shop/stall in Khau Katta', createdAt: '2026-01-01T00:00:00Z' }
];

export const users: User[] = [
  {
    id: 'usr-admin-01',
    roleId: 'role-admin-002',
    name: 'Basavaraj Patil (Admin)',
    email: 'admin@khaukatta.in',
    phone: '9448100001',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-cust-01',
    roleId: 'role-cust-001',
    name: 'Pooja Kulkarni',
    email: 'pooja.k@example.com',
    phone: '9845012345',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z'
  },
  {
    id: 'usr-cust-02',
    roleId: 'role-cust-001',
    name: 'Anand Deshpande',
    email: 'anand.d@example.com',
    phone: '9845099999',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2026-02-20T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z'
  },
  {
    id: 'usr-deliv-01',
    roleId: 'role-deliv-003',
    name: 'Ramesh Naik',
    email: 'ramesh.delivery@khaukatta.in',
    phone: '9740098765',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z'
  }
];

export const userAddresses: UserAddress[] = [
  {
    id: 'addr-01',
    userId: 'usr-cust-01',
    label: 'Home',
    addressLine1: 'Flat 402, Sai Residency, Club Road',
    addressLine2: 'Near Nucleus Mall, Camp',
    area: 'Camp',
    landmark: 'Near Nucleus Mall',
    city: 'Belagavi',
    pincode: '590001',
    isDefault: true,
    createdAt: '2026-02-15T00:00:00Z'
  },
  {
    id: 'addr-02',
    userId: 'usr-cust-01',
    label: 'Office',
    addressLine1: 'Suite 12, Khanapur Road',
    addressLine2: 'Opposite Golf Ground',
    area: 'Tilakwadi',
    landmark: 'Opposite Golf Ground',
    city: 'Belagavi',
    pincode: '590006',
    isDefault: false,
    createdAt: '2026-02-20T00:00:00Z'
  }
];

export const categories: StallCategory[] = [
  { id: 'cat-fb', name: 'Food & Beverages', slug: 'food-and-beverages', icon: 'Coffee', description: 'Authentic Belagavi chai, sharbats, juices, and specialty drinks', displayOrder: 1, isActive: true },
  { id: 'cat-ff', name: 'Fast Food', slug: 'fast-food', icon: 'Utensils', description: 'Belagavi girmit, chaats, spicy misal, bajjis, and quick bites', displayOrder: 2, isActive: true },
  { id: 'cat-des', name: 'Desserts', slug: 'desserts', icon: 'Cake', description: 'World-famous Belagavi Kunda, Gokak Karadant, pedhas, and sweets', displayOrder: 3, isActive: true },
  { id: 'cat-jew', name: 'Jewellery', slug: 'jewellery', icon: 'Gem', description: 'Traditional Kolhapuri saaj, silver trinkets, temple & antique jewellery', displayOrder: 4, isActive: true },
  { id: 'cat-clo', name: 'Clothing', slug: 'clothing', icon: 'Shirt', description: 'Shahapur handloom sarees, cotton kurtis, scarves, and ethnic wear', displayOrder: 5, isActive: true },
  { id: 'cat-toy', name: 'Toys', slug: 'toys', icon: 'Gamepad2', description: 'Handcrafted wooden toys, educational puzzles, and play collectibles', displayOrder: 6, isActive: true },
  { id: 'cat-gif', name: 'Gifts', slug: 'gifts', icon: 'Gift', description: 'Brass curios, Belagavi mementos, handmade cards, and festive gift hampers', displayOrder: 7, isActive: true },
  { id: 'cat-acc', name: 'Accessories', slug: 'accessories', icon: 'Watch', description: 'Handcrafted leather chappals, wallets, bags, belts, and daily essentials', displayOrder: 8, isActive: true },
  { id: 'cat-oth', name: 'Other', slug: 'other', icon: 'Store', description: 'Belagavi organic spices, pottery, natural soaps, and local artisanal supplies', displayOrder: 9, isActive: true }
];

export const stalls: Stall[] = [
  {
    id: 'stall-01',
    categoryId: 'cat-des',
    name: 'Belgaum Kunda & Sweets House',
    slug: 'belgaum-kunda-and-sweets',
    stallNumber: 'KK-01',
    shortDescription: 'Iconic caramelized Belagavi Kunda made from slow-cooked pure milk & dry fruits.',
    description: 'Founded in 1958, our stall at Khau Katta continues the golden legacy of Belagavi sweet-making. We specialize in hot oven Kunda, rich Gokak Karadant, and handmade Dharwad Pedha using pure A2 cow milk and organic jaggery.',
    imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop',
    openingTime: '09:00 AM',
    closingTime: '10:30 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 11111'
  },
  {
    id: 'stall-02',
    categoryId: 'cat-ff',
    name: 'Camp Misal & Chaat Durbar',
    slug: 'camp-misal-chaat-durbar',
    stallNumber: 'KK-02',
    shortDescription: 'Fiery Kolhapuri-Belagavi rassa misal, crunchy farsan, and tangy street chaats.',
    description: 'A beloved institution at Khau Katta! Our spicy tarri misal is cooked with stone-ground spices and served with piping hot pav and lemon wedges. Also serving crispy sev puri, dahi bhel, and spicy ragda patties.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop',
    openingTime: '10:00 AM',
    closingTime: '10:00 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 22222'
  },
  {
    id: 'stall-03',
    categoryId: 'cat-fb',
    name: 'Tilakwadi Kadak Chai & Bun Maska',
    slug: 'tilakwadi-kadak-chai-bun-maska',
    stallNumber: 'KK-03',
    shortDescription: 'Slow-brewed ginger cardamom tea paired with fluffy buttered Irani buns.',
    description: 'The premier meeting spot in Khau Katta. Brewed in brass samovars with fresh mountain spices, our kadak chai and warm maska buns offer pure nostalgic warmth on breezy Belagavi evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop',
    openingTime: '07:30 AM',
    closingTime: '11:00 PM',
    isOpen: true,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 33333'
  },
  {
    id: 'stall-04',
    categoryId: 'cat-jew',
    name: 'Belagavi Royal Silver & Kolhapuri Saaj',
    slug: 'belagavi-royal-silver-kolhapuri-saaj',
    stallNumber: 'KK-04',
    shortDescription: 'Artisanal 925 sterling silver jewelry, traditional Saaj necklaces, and payals.',
    description: 'Showcasing the glorious metallic craftsmanship of North Karnataka and Maharashtra borderlands. Each item is handcrafted by generational silversmiths with hallmarks of purity and heritage finish.',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop',
    openingTime: '10:30 AM',
    closingTime: '09:00 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 44444'
  },
  {
    id: 'stall-05',
    categoryId: 'cat-clo',
    name: 'Shahapur Handlooms & Ethnic Kurtis',
    slug: 'shahapur-handlooms-ethnic-kurtis',
    stallNumber: 'KK-05',
    shortDescription: 'Breathable cotton sarees, Belagavi handloom weaves, and comfortable daily kurtis.',
    description: 'Direct from Shahapur weaver collectives! Featuring natural vegetable-dyed fabrics, Ilkal borders, and airy everyday ethnic garments tailored for Belagavi weather.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop',
    openingTime: '11:00 AM',
    closingTime: '09:30 PM',
    isOpen: true,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 55555'
  },
  {
    id: 'stall-06',
    categoryId: 'cat-toy',
    name: 'Chennamma Wooden Toys & Puzzles',
    slug: 'chennamma-wooden-toys-puzzles',
    stallNumber: 'KK-06',
    shortDescription: 'Eco-friendly non-toxic lacquered wooden toys, rocking horses, and brain teasers.',
    description: 'Preserving artisanal wooden toymaking traditions. Made from natural Wrightia tinctoria wood with plant-based lacquer dyes, completely safe and durable for young kids and collectors.',
    imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&auto=format&fit=crop',
    openingTime: '10:00 AM',
    closingTime: '09:00 PM',
    isOpen: true,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 66666'
  },
  {
    id: 'stall-07',
    categoryId: 'cat-gif',
    name: 'Belagavi Brass & Bell-Metal Gift Emporium',
    slug: 'belagavi-brass-bell-metal-gifts',
    stallNumber: 'KK-07',
    shortDescription: 'Intricately engraved brass diyas, temple bells, handcrafted figurines, and corporate mementos.',
    description: 'Belagavi is renowned for its historic brass metalworks. Our stall offers handcrafted pooja brassware, artistic figurines, bells, and decorative wall hangings perfect for festive gifting.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop',
    openingTime: '10:00 AM',
    closingTime: '08:30 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 77777'
  },
  {
    id: 'stall-08',
    categoryId: 'cat-acc',
    name: 'Fort Road Leather Goods & Chappals',
    slug: 'fort-road-leather-goods-chappals',
    stallNumber: 'KK-08',
    shortDescription: 'Genuine handcrafted leather Kolhapuri chappals, durable belts, wallets, and bags.',
    description: 'Authentic hand-stitched leather footwear and accessories built to last decades. Features vegetable-tanned leather with traditional braided straps and comfortable ergonomics.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop',
    openingTime: '10:30 AM',
    closingTime: '09:30 PM',
    isOpen: true,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 88888'
  },
  {
    id: 'stall-09',
    categoryId: 'cat-ff',
    name: 'Shree Ganesh Mirchi Bajji & Girmit Stall',
    slug: 'shree-ganesh-mirchi-bajji-girmit',
    stallNumber: 'KK-09',
    shortDescription: 'Crispy spicy hot mirchi bajjis and authentic North Karnataka spicy puffed-rice Girmit.',
    description: 'The quintessential Belagavi evening snack! Crispy deep-fried gram flour bajjis stuffed with tangy spices, accompanied by Girmit topped with chopped onions, coriander, and roasted peanuts.',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop',
    openingTime: '03:00 PM',
    closingTime: '10:30 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 99999'
  },
  {
    id: 'stall-10',
    categoryId: 'cat-oth',
    name: 'Malaprabha Organic Spice & Herbal Corner',
    slug: 'malaprabha-organic-spice-herbal',
    stallNumber: 'KK-10',
    shortDescription: 'Forest honey, Western Ghats whole spices, handmade cold-pressed soaps, and herbal oils.',
    description: 'Sourced directly from local farmers along the Malaprabha river basin. Pure unpasteurized forest honey, whole black pepper, cardamom, and natural Ayurvedic skincare bars.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop',
    openingTime: '09:30 AM',
    closingTime: '08:00 PM',
    isOpen: false,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 10101'
  }
];

export const products: Product[] = [
  // Stall 01: Belgaum Kunda
  { id: 'prod-01', stallId: 'stall-01', name: 'Classic Belgaum Kunda (500g)', description: 'World famous caramelized milk delicacy roasted to deep brown perfection with cardamom.', price: 260, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&auto=format&fit=crop', badge: 'Bestseller', preparationTimeMins: 10 },
  { id: 'prod-02', stallId: 'stall-01', name: 'Dry Fruit Special Kunda (500g)', description: 'Enriched with roasted cashews, almonds, and pistachios in pure ghee base.', price: 340, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&auto=format&fit=crop', badge: 'Belagavi Special', preparationTimeMins: 10 },
  { id: 'prod-03', stallId: 'stall-01', name: 'Gokak Karadant (400g)', description: 'Nutritious dry fruit chewy fudge made with edible gum (dink), organic jaggery, and dates.', price: 290, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&auto=format&fit=crop', badge: 'Nutritious', preparationTimeMins: 5 },
  { id: 'prod-04', stallId: 'stall-01', name: 'Special Dharwad Pedha (250g)', description: 'Slow roasted caramelized milk fudge dusted with powdered cane sugar.', price: 180, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&auto=format&fit=crop', badge: 'Classic', preparationTimeMins: 5 },

  // Stall 02: Camp Misal
  { id: 'prod-05', stallId: 'stall-02', name: 'Special Camp Tarri Misal Pav', description: 'Spicy sprouted moth bean curry served with crunchy farsan, 2 fresh pavs, lemon & curd.', price: 110, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', badge: 'Bestseller', preparationTimeMins: 15 },
  { id: 'prod-06', stallId: 'stall-02', name: 'Cheese Butter Misal Pav', description: 'Camp misal generously loaded with molten Amul butter and shredded processed cheese.', price: 160, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', badge: 'Popular', preparationTimeMins: 15 },
  { id: 'prod-07', stallId: 'stall-02', name: 'Special Sev Puri (6 pcs)', description: 'Crispy puris layered with mashed potatoes, spiced chutneys, sev, and raw mango slivers.', price: 70, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', badge: 'Crunchy', preparationTimeMins: 10 },
  { id: 'prod-08', stallId: 'stall-02', name: 'Dahi Papdi Chaat', description: 'Crisp papdis drowned in whipped sweet yogurt, date-tamarind chutney, and roasted cumin.', price: 90, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', badge: 'Refreshing', preparationTimeMins: 10 },

  // Stall 03: Kadak Chai
  { id: 'prod-09', stallId: 'stall-03', name: 'Special Masala Kadak Chai', description: 'Thick brewed tea with crushed fresh ginger, green cardamom, and lemongrass.', price: 25, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop', badge: 'Top Rated', preparationTimeMins: 5 },
  { id: 'prod-10', stallId: 'stall-03', name: 'Saffron Elaichi Chai', description: 'Royal brew infused with pure Kashmiri saffron strands and ground cardamom pods.', price: 45, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop', badge: 'Special', preparationTimeMins: 5 },
  { id: 'prod-11', stallId: 'stall-03', name: 'Classic Bun Maska', description: 'Freshly baked pillowy bun slathered with rich salted table butter.', price: 40, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop', badge: 'Staple', preparationTimeMins: 5 },
  { id: 'prod-12', stallId: 'stall-03', name: 'Bun Maska Jam with Dry Fruits', description: 'Butter-toasted bun with mixed fruit jam and chopped roasted almond flakes.', price: 65, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop', badge: 'Sweet Delight', preparationTimeMins: 5 },

  // Stall 04: Jewellery
  { id: 'prod-13', stallId: 'stall-04', name: 'Handcrafted Kolhapuri Saaj Necklace', description: 'Gold-plated traditional Maharashtrian/North-Karnataka bridal necklace with 21 symbolic leaves.', price: 1450, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop', badge: 'Heritage', preparationTimeMins: 20 },
  { id: 'prod-14', stallId: 'stall-04', name: '925 Sterling Silver Tribal Choker', description: 'Hallmarked pure silver adjustable neckpiece engraved with floral filigree motifs.', price: 2800, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop', badge: 'Pure Silver', preparationTimeMins: 20 },
  { id: 'prod-15', stallId: 'stall-04', name: 'Oxidized Silver Jhumkas', description: 'Dramatic lightweight jhumkas featuring delicate hanging pearls and peacock carvings.', price: 450, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop', badge: 'Festive Pick', preparationTimeMins: 10 },

  // Stall 05: Clothing
  { id: 'prod-16', stallId: 'stall-05', name: 'Shahapur Handloom Cotton Saree', description: 'Traditional handwoven pure cotton saree with contrast border and soft drape.', price: 1250, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop', badge: 'Artisanal', preparationTimeMins: 15 },
  { id: 'prod-17', stallId: 'stall-05', name: 'Ilkal Silk-Cotton Saree (Red Border)', description: 'Famous regional weave featuring traditional "tope teni" pallu and temple border.', price: 2150, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop', badge: 'Authentic Weave', preparationTimeMins: 15 },

  // Stall 06: Toys
  { id: 'prod-18', stallId: 'stall-06', name: 'Wooden Rocking Horse Toy', description: 'Smoothly hand-sanded non-toxic pine wood rocking horse suitable for toddlers.', price: 780, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&auto=format&fit=crop', badge: 'Child Safe', preparationTimeMins: 10 },
  { id: 'prod-19', stallId: 'stall-06', name: 'Channapatna Lacquer Spinning Tops (Set of 3)', description: 'Vibrant natural vegetable lacquer spinning tops that spin effortlessly.', price: 250, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&auto=format&fit=crop', badge: 'Traditional', preparationTimeMins: 5 },

  // Stall 07: Gifts
  { id: 'prod-20', stallId: 'stall-07', name: 'Belagavi Handcrafted Brass Mayur Diya', description: 'Solid brass peacock oil lamp measuring 8 inches, cast using lost-wax technique.', price: 890, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop', badge: 'Artisanal Brass', preparationTimeMins: 10 },
  { id: 'prod-21', stallId: 'stall-07', name: 'Temple Brass Bell with Garuda Handle', description: 'Clear acoustic resonant bell cast from pure bell metal bronze.', price: 650, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop', badge: 'Pure Metal', preparationTimeMins: 10 },

  // Stall 08: Leather Accessories
  { id: 'prod-22', stallId: 'stall-08', name: 'Classic Belagavi Leather Kolhapuri Chappals', description: 'Hand-stitched pure buffalo hide chappals with intricate braided strap in natural tan.', price: 950, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop', badge: 'Handmade', preparationTimeMins: 15 },
  { id: 'prod-23', stallId: 'stall-08', name: 'Full Grain Leather Bifold Wallet', description: 'Durable handcrafted leather wallet with 8 card slots and currency compartment.', price: 480, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop', badge: 'Durable', preparationTimeMins: 10 },

  // Stall 09: Snacks
  { id: 'prod-24', stallId: 'stall-09', name: 'Belagavi Special Girmit Plate', description: 'Puffed rice tossed in spicy tamarind-onion-garlic masala, topped with sev and onions.', price: 50, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop', badge: 'Iconic Street Food', preparationTimeMins: 5 },
  { id: 'prod-25', stallId: 'stall-09', name: 'Crispy Mirchi Bajji (4 pcs)', description: 'Plump green chillies dipped in spiced chickpea batter and deep-fried golden brown.', price: 40, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop', badge: 'Hot & Crispy', preparationTimeMins: 10 },

  // Stall 10: Spices & Honey
  { id: 'prod-26', stallId: 'stall-10', name: 'Raw Western Ghats Forest Honey (500g)', description: 'Unprocessed multi-flora wild honey sustainably gathered from Belagavi forests.', price: 380, isVeg: true, isAvailable: false, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop', badge: 'Pure & Raw', preparationTimeMins: 5 }
];

// Seed completed orders to enable verified purchase review testing
export const orders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'KK-2026-00129',
    userId: 'usr-cust-01', // Pooja Kulkarni
    stallId: 'stall-01', // Belgaum Kunda House
    addressId: 'addr-01',
    couponId: 'cpn-01',
    subtotal: 520,
    discountAmount: 100,
    deliveryFee: 30,
    taxAmount: 0,
    totalAmount: 450,
    status: 'delivered',
    specialInstructions: 'Please pack Kunda warm if possible.',
    createdAt: '2026-09-08T17:45:00Z',
    updatedAt: '2026-09-08T18:24:00Z'
  },
  {
    id: 'ord-002',
    orderNumber: 'KK-2026-00145',
    userId: 'usr-cust-01', // Pooja Kulkarni
    stallId: 'stall-02', // Camp Misal & Chaat
    addressId: 'addr-01',
    subtotal: 180,
    discountAmount: 0,
    deliveryFee: 30,
    taxAmount: 0,
    totalAmount: 210,
    status: 'delivered', // Delivered, eligible to review!
    createdAt: '2026-09-09T12:30:00Z',
    updatedAt: '2026-09-09T13:15:00Z'
  },
  {
    id: 'ord-003',
    orderNumber: 'KK-2026-00156',
    userId: 'usr-cust-01',
    stallId: 'stall-03', // Tilakwadi Kadak Chai
    addressId: 'addr-01',
    subtotal: 90,
    discountAmount: 0,
    deliveryFee: 30,
    taxAmount: 0,
    totalAmount: 120,
    status: 'preparing', // In progress, cannot be reviewed yet!
    createdAt: '2026-09-10T20:00:00Z',
    updatedAt: '2026-09-10T20:05:00Z'
  },
  {
    id: 'ord-004',
    orderNumber: 'KK-2026-00110',
    userId: 'usr-cust-02', // Anand Deshpande
    stallId: 'stall-01',
    addressId: 'addr-01',
    subtotal: 340,
    discountAmount: 0,
    deliveryFee: 30,
    taxAmount: 0,
    totalAmount: 370,
    status: 'delivered',
    createdAt: '2026-09-05T15:00:00Z',
    updatedAt: '2026-09-05T15:45:00Z'
  }
];

export const orderItems: OrderItem[] = [
  { id: 'item-01', orderId: 'ord-001', productId: 'prod-01', quantity: 2, unitPrice: 260, totalPrice: 520, productName: 'Classic Belgaum Kunda (500g)', isReviewed: true },
  { id: 'item-02', orderId: 'ord-002', productId: 'prod-05', quantity: 1, unitPrice: 110, totalPrice: 110, productName: 'Special Camp Tarri Misal Pav', isReviewed: false },
  { id: 'item-03', orderId: 'ord-002', productId: 'prod-07', quantity: 1, unitPrice: 70, totalPrice: 70, productName: 'Special Sev Puri (6 pcs)', isReviewed: false },
  { id: 'item-04', orderId: 'ord-003', productId: 'prod-09', quantity: 2, unitPrice: 25, totalPrice: 50, productName: 'Special Masala Kadak Chai', isReviewed: false },
  { id: 'item-05', orderId: 'ord-003', productId: 'prod-11', quantity: 1, unitPrice: 40, totalPrice: 40, productName: 'Classic Bun Maska', isReviewed: false },
  { id: 'item-06', orderId: 'ord-004', productId: 'prod-02', quantity: 1, unitPrice: 340, totalPrice: 340, productName: 'Dry Fruit Special Kunda (500g)', isReviewed: true }
];

// Reviews database with verified orders
export const reviews: Review[] = [
  {
    id: 'rev-001',
    orderId: 'ord-001',
    orderItemId: 'item-01',
    userId: 'usr-cust-01',
    userName: 'Pooja Kulkarni',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    stallId: 'stall-01',
    productId: 'prod-01',
    rating: 5,
    comment: 'Authentic Belagavi taste! Arrived fresh and warm in Club Road packaging. The caramelized milk texture was absolute perfection.',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400'],
    createdAt: '2026-09-08T19:00:00Z'
  },
  {
    id: 'rev-002',
    orderId: 'ord-004',
    orderItemId: 'item-06',
    userId: 'usr-cust-02',
    userName: 'Anand Deshpande',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    stallId: 'stall-01',
    productId: 'prod-02',
    rating: 5,
    comment: 'Generous dry fruits and pure ghee aroma. Easily the best Kunda in Belagavi. Highly recommend the dry fruit variant.',
    status: 'ACTIVE',
    images: [],
    createdAt: '2026-09-06T10:30:00Z'
  },
  {
    id: 'rev-003',
    orderId: 'ord-001',
    userId: 'usr-cust-01',
    userName: 'Pooja Kulkarni',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    stallId: 'stall-02',
    productId: 'prod-05',
    rating: 4,
    comment: 'Super spicy tarri and fresh crunchy farsan. Felt just like sitting in Camp Khau Katta in the evening!',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'],
    createdAt: '2026-09-07T14:15:00Z'
  },
  {
    id: 'rev-004',
    orderId: 'ord-004',
    userId: 'usr-cust-02',
    userName: 'Anand Deshpande',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    stallId: 'stall-04',
    rating: 5,
    comment: 'Exquisite silver filigree! The Kolhapuri saaj pattern has genuine hallmarks and pure finish.',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'],
    createdAt: '2026-09-04T16:20:00Z'
  }
];

export const reviewReports: ReviewReport[] = [];

// OTP In-Memory Storage
export const otpStore = new Map<string, OtpRecord>();

// Dynamic rating calculation helpers
export function getStallRating(stallId: string): { averageRating: number; reviewCount: number } {
  const activeReviews = reviews.filter(r => r.stallId === stallId && r.status === 'ACTIVE');
  if (activeReviews.length === 0) {
    return { averageRating: 4.8, reviewCount: 0 }; // Baseline default if no reviews
  }
  const sum = activeReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Number((sum / activeReviews.length).toFixed(1));
  return { averageRating: avg, reviewCount: activeReviews.length };
}

export function getProductRating(productId: string): { averageRating: number; reviewCount: number } {
  const activeReviews = reviews.filter(r => r.productId === productId && r.status === 'ACTIVE');
  if (activeReviews.length === 0) {
    return { averageRating: 4.7, reviewCount: 0 };
  }
  const sum = activeReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Number((sum / activeReviews.length).toFixed(1));
  return { averageRating: avg, reviewCount: activeReviews.length };
}

export function getRatingBreakdown(stallId?: string, productId?: string): ReviewRatingBreakdown {
  const filtered = reviews.filter(r => {
    if (r.status !== 'ACTIVE') return false;
    if (stallId && r.stallId !== stallId) return false;
    if (productId && r.productId !== productId) return false;
    return true;
  });

  const total = filtered.length;
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  filtered.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      counts[r.rating as keyof typeof counts]++;
    }
  });

  const percentages = {
    5: total > 0 ? Math.round((counts[5] / total) * 100) : 0,
    4: total > 0 ? Math.round((counts[4] / total) * 100) : 0,
    3: total > 0 ? Math.round((counts[3] / total) * 100) : 0,
    2: total > 0 ? Math.round((counts[2] / total) * 100) : 0,
    1: total > 0 ? Math.round((counts[1] / total) * 100) : 0
  };

  const avg = total > 0 ? Number((filtered.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)) : 5.0;

  return {
    averageRating: avg,
    totalReviews: total,
    counts,
    percentages
  };
}

export const adminStats: AdminStats = {
  totalUsers: 1240,
  totalStalls: 52,
  totalOrders: 3845,
  totalRevenue: 1428500,
  activeDeliveries: 18,
  totalProducts: products.length,
  categoriesCount: categories.length,
  totalReviews: reviews.length,
  pendingReports: reviewReports.filter(r => r.status === 'PENDING').length
};

// ---------------------------------------------------------------------------
// CARTS & CART ITEMS IN-MEMORY PERSISTENCE
// ---------------------------------------------------------------------------
export const carts: Cart[] = [];
export const cartItems: CartItem[] = [];

export function getOrCreateCart(userId: string): Cart {
  let cart = carts.find(c => c.userId === userId);
  if (!cart) {
    cart = {
      id: `cart-${userId}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    carts.push(cart);
  }
  return cart;
}

export function getUserCartSummary(userId: string): CartSummary {
  const cart = getOrCreateCart(userId);
  const items = cartItems.filter(ci => ci.cartId === cart.id);

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = items.length > 0 ? 30 : 0;
  const discount = 0;
  const grandTotal = subtotal + deliveryFee - discount;

  return {
    id: cart.id,
    userId,
    items,
    totalItems,
    subtotal,
    deliveryFee,
    discount,
    grandTotal
  };
}

export function addToCart(
  userId: string,
  productId: string,
  quantityToAdd: number = 1
): { success: boolean; message?: string; cart?: CartSummary } {
  const product = products.find(p => p.id === productId);
  if (!product) {
    return { success: false, message: 'Product not found in Belagavi marketplace.' };
  }

  if (!product.isAvailable) {
    return { success: false, message: `"${product.name}" is currently marked out of stock.` };
  }

  const stall = stalls.find(s => s.id === product.stallId);
  if (!stall || stall.isActive === false || stall.status === 'INACTIVE') {
    return { success: false, message: 'This stall is currently inactive or not accepting orders.' };
  }

  const cart = getOrCreateCart(userId);
  const existing = cartItems.find(ci => ci.cartId === cart.id && ci.productId === productId);

  if (existing) {
    existing.quantity += quantityToAdd;
    existing.itemTotal = existing.quantity * product.price;
  } else {
    const newItem: CartItem = {
      id: `ci-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cartId: cart.id,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      stallId: stall.id,
      stallName: stall.name,
      price: product.price, // strictly from DB
      quantity: quantityToAdd,
      itemTotal: product.price * quantityToAdd,
      isVeg: product.isVeg,
      isAvailable: product.isAvailable
    };
    cartItems.push(newItem);
  }

  cart.updatedAt = new Date().toISOString();
  return { success: true, cart: getUserCartSummary(userId) };
}

export function updateCartItemQuantity(
  userId: string,
  productId: string,
  newQuantity: number
): { success: boolean; message?: string; cart?: CartSummary } {
  const cart = getOrCreateCart(userId);
  const index = cartItems.findIndex(ci => ci.cartId === cart.id && ci.productId === productId);

  if (index === -1) {
    return { success: false, message: 'Item not found in your cart.' };
  }

  if (newQuantity <= 0) {
    cartItems.splice(index, 1);
  } else {
    const product = products.find(p => p.id === productId);
    const unitPrice = product ? product.price : cartItems[index].price;
    cartItems[index].quantity = newQuantity;
    cartItems[index].itemTotal = newQuantity * unitPrice;
  }

  cart.updatedAt = new Date().toISOString();
  return { success: true, cart: getUserCartSummary(userId) };
}

export function removeFromCart(
  userId: string,
  productId: string
): { success: boolean; cart?: CartSummary } {
  const cart = getOrCreateCart(userId);
  const idx = cartItems.findIndex(ci => ci.cartId === cart.id && ci.productId === productId);
  if (idx !== -1) {
    cartItems.splice(idx, 1);
  }
  cart.updatedAt = new Date().toISOString();
  return { success: true, cart: getUserCartSummary(userId) };
}

export function clearCart(userId: string): { success: boolean; cart?: CartSummary } {
  const cart = getOrCreateCart(userId);
  const toKeep = cartItems.filter(ci => ci.cartId !== cart.id);
  cartItems.length = 0;
  cartItems.push(...toKeep);
  cart.updatedAt = new Date().toISOString();
  return { success: true, cart: getUserCartSummary(userId) };
}

// ---------------------------------------------------------------------------
// STALL MANAGEMENT OPERATIONS
// ---------------------------------------------------------------------------
export function hasStallOrders(stallId: string): boolean {
  return orders.some(o => o.stallId === stallId);
}

export function createStall(stallData: Partial<Stall>): Stall {
  const count = stalls.length + 1;
  const stallNum = stallData.stallNumber || `KK-${count < 10 ? '0' + count : count}`;
  const slug = stallData.slug || (stallData.name ? stallData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `stall-${Date.now()}`);
  const id = `stall-${Date.now()}`;

  const newStall: Stall = {
    id,
    categoryId: stallData.categoryId || 'cat-oth',
    ownerUserId: stallData.ownerUserId || 'usr-admin-01',
    name: stallData.name || 'New Khau Katta Stall',
    slug,
    stallNumber: stallNum,
    shortDescription: stallData.shortDescription || (stallData.description ? stallData.description.slice(0, 100) : 'Belagavi local specialty stall.'),
    description: stallData.description || 'Welcome to our stall in Khau Katta, Belagavi.',
    imageUrl: stallData.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop',
    bannerUrl: stallData.bannerUrl || stallData.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop',
    openingTime: stallData.openingTime || '10:00 AM',
    closingTime: stallData.closingTime || '10:00 PM',
    isOpen: stallData.isOpen !== undefined ? stallData.isOpen : true,
    isFeatured: stallData.isFeatured || false,
    isActive: stallData.isActive !== undefined ? stallData.isActive : true,
    status: stallData.status || (stallData.isActive === false ? 'INACTIVE' : 'ACTIVE'),
    location: stallData.location || 'Club Road, Belagavi 590001',
    contactPhone: stallData.contactPhone || '+91 94480 00000'
  };

  stalls.unshift(newStall);
  return newStall;
}

export function updateStall(id: string, updateData: Partial<Stall>): Stall | null {
  const stall = stalls.find(s => s.id === id);
  if (!stall) return null;

  if (updateData.name !== undefined) stall.name = updateData.name;
  if (updateData.categoryId !== undefined) stall.categoryId = updateData.categoryId;
  if (updateData.stallNumber !== undefined) stall.stallNumber = updateData.stallNumber;
  if (updateData.shortDescription !== undefined) stall.shortDescription = updateData.shortDescription;
  if (updateData.description !== undefined) stall.description = updateData.description;
  if (updateData.imageUrl !== undefined) stall.imageUrl = updateData.imageUrl;
  if (updateData.bannerUrl !== undefined) stall.bannerUrl = updateData.bannerUrl;
  if (updateData.openingTime !== undefined) stall.openingTime = updateData.openingTime;
  if (updateData.closingTime !== undefined) stall.closingTime = updateData.closingTime;
  if (updateData.contactPhone !== undefined) stall.contactPhone = updateData.contactPhone;
  if (updateData.location !== undefined) stall.location = updateData.location;
  if (updateData.isOpen !== undefined) stall.isOpen = updateData.isOpen;
  if (updateData.isFeatured !== undefined) stall.isFeatured = updateData.isFeatured;
  if (updateData.isActive !== undefined) {
    stall.isActive = updateData.isActive;
    stall.status = updateData.isActive ? 'ACTIVE' : 'INACTIVE';
  }
  if (updateData.status !== undefined) {
    stall.status = updateData.status;
    stall.isActive = updateData.status === 'ACTIVE';
  }

  return stall;
}

export function toggleStallStatus(id: string, isActive: boolean): Stall | null {
  const stall = stalls.find(s => s.id === id);
  if (!stall) return null;
  stall.isActive = isActive;
  stall.status = isActive ? 'ACTIVE' : 'INACTIVE';
  if (!isActive) stall.isOpen = false;
  return stall;
}

export function deleteStall(id: string): { success: boolean; message?: string } {
  const stallIndex = stalls.findIndex(s => s.id === id);
  if (stallIndex === -1) {
    return { success: false, message: 'Stall not found.' };
  }

  if (hasStallOrders(id)) {
    return {
      success: false,
      message: 'Cannot permanently delete stall with historical customer orders. Please deactivate the stall (set status to INACTIVE) instead to preserve customer order history and review audit records.'
    };
  }

  const remainingProducts = products.filter(p => p.stallId !== id);
  products.length = 0;
  products.push(...remainingProducts);

  const remainingReviews = reviews.filter(r => r.stallId !== id);
  reviews.length = 0;
  reviews.push(...remainingReviews);

  stalls.splice(stallIndex, 1);
  return { success: true };
}

