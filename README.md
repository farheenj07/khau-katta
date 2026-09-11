# Khau Katta — Belagavi Local Marketplace 🏰🍲

> **Stage 1 Foundation & Core UI**: Digital platform connecting ~50 iconic stalls on Club Road, Belagavi directly to customers' doorsteps across the city.

---

## 🌟 1. Project Concept & Vision

**Khau Katta** is Belagavi's celebrated open-air marketplace comprising approximately **50 stalls and shops**:
* 🍲 **Food Stalls & Chaats**: World-famous Belgaum Kunda, fiery Camp Misal, Belagavi Girmit & Mirchi Bajji, Kadak Samovar Chai.
* 💎 **Jewellery Shops**: Authentic Kolhapuri Saaj, 925 sterling silver filigree, temple ornaments.
* 🧵 **Clothing & Handlooms**: Shahapur handwoven cotton sarees, Ilkal borders, ethnic kurtis.
* 🪵 **Toy Shops**: Traditional lacquered wooden toys from local artisans, non-toxic child collectibles.
* 🎁 **Gift Shops**: Cast brass lamps (diyas), temple bells, hand-engraved curios, and festive hampers.
* 🌿 **Local Businesses**: Western Ghats forest honey, organic spices, handmade leather Kolhapuri chappals.

### Strategic Vision & Mission
* **Vision**: *Make Khau Katta accessible beyond its physical location by digitally connecting local businesses with customers.*
* **Mission**: *Empower local stalls and businesses with a digital platform where customers can discover, order, and receive products conveniently at home.*

---

## 🏛️ 2. Architectural Highlights & Roles

### 2.1 Role-Based Route Architecture
Configured with dedicated personas and route guards (`ProtectedRoute.tsx`):
1. **Customer / User**: Browses 50+ stalls, filters by 9 categories, views stall menus, specialties, prices, and availability.
2. **Admin**: Operational dashboard (`/admin`) monitoring marketplace statistics, stall onboarding status, products catalog, order queue, delivery fleet, and platform settings.
3. **Delivery Partner**: Rider portal (`/delivery`) with trip dispatch simulation, vehicle details (KA-22 Scooter), and order pickup/dropoff workflows.

*A interactive **Role Switcher Bar** is permanently fixed at the top of the interface to facilitate rapid evaluation across roles.*

---

## 🗄️ 3. Relational Database Schema (16 Tables)

Designed for horizontal scalability from 10 sample stalls to 50+ merchants without architectural alterations.
Located at: [`backend/schema.sql`](file:///C:/Users/hp/.gemini/antigravity/scratch/khau-katta/backend/schema.sql) and seeded at [`backend/seed.sql`](file:///C:/Users/hp/.gemini/antigravity/scratch/khau-katta/backend/seed.sql).

### Table Schema Index:
1. `roles`: Role definitions (`customer`, `admin`, `delivery_partner`, `stall_owner`).
2. `users`: Multi-role user accounts with phone numbers, emails, and statuses.
3. `user_addresses`: Belagavi delivery locations (Camp, Tilakwadi, Shahapur, Hindwadi, etc.).
4. `stall_categories`: 9 marketplace categories (Food & Beverages, Fast Food, Desserts, Jewellery, Clothing, Toys, Gifts, Accessories, Other).
5. `stalls`: ~50 stall capacity, stall numbers (`KK-01` to `KK-50`), timings, ratings, reviews, open/closed flags.
6. `product_categories`: Stall-level internal groupings (e.g., 'Authentic Belgaum Kunda', 'Street Chaats').
7. `products`: Items with prices, veg/non-veg status, stock availability, badges, prep times.
8. `orders`: Order lifecycle records (`placed`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`).
9. `order_items`: Line items, itemized prices, custom cooking notes.
10. `payments`: Payment records, modes (UPI, Card, COD), gateway tracking.
11. `delivery_partners`: Rider fleet metadata, vehicle numbers (`KA-22`), driver licenses, ratings.
12. `delivery_assignments`: Dispatch pairings connecting orders to delivery partners.
13. `delivery_locations`: Telemetry log storing GPS coordinates and timestamps.
14. `reviews`: Customer ratings (1-5 stars) and testimonials linked to orders and stalls.
15. `notifications`: Push and in-app system messages.
16. `coupons`: Promotional discount rules (e.g. `KHAUKATTA50`, `BELAGAVIFREE`).

---

## 💻 4. Technology Stack

* **Frontend**: React 18 + TypeScript + Vite 8 + Tailwind CSS v4 + Lucide Icons + React Router v6.
* **Backend**: Node.js + Express + TypeScript REST API.
* **Database Scripts**: ANSI SQL DDL & DML (`schema.sql`, `seed.sql`) compatible with SQLite, PostgreSQL, and MySQL.

---

## 🚀 5. Getting Started

### Prerequisites
* Node.js v18+ installed

### Running the Backend
```bash
cd backend
npm.cmd install    # (or npm install)
npm.cmd run build
npm.cmd start      # Runs Express server at http://localhost:5000
```

### Running the Frontend
```bash
cd frontend
npm.cmd install    # (or npm install)
npm.cmd run dev    # Launches Vite at http://localhost:3000
```

---

## 🧭 6. Next Stages Roadmap

* [ ] **Stage 2**: Phone/OTP authentication, Cart state management, Checkout workflow, Payment gateway integration (Razorpay/PhonePe).
* [ ] **Stage 3**: Live GPS rider tracking, Delivery ETA calculations, Real-time WebSockets dispatch.
* [ ] **Stage 4**: In-app push notifications, Customer review submission flow, Advanced analytics dashboards for merchants.
