import React from 'react';
import {
  Compass,
  Target,
  Heart,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Store,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#a84e12] via-[#c25e1a] to-[#8a3809] text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-[#e8c4a2]/40 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-amber-100 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={14} /> The Digital Marketplace of Belagavi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Preserving Heritage, Powering Belagavi&apos;s Local Stalls
          </h1>
          <p className="text-base sm:text-lg text-amber-50/90 leading-relaxed">
            Khau Katta on Club Road is the cultural heart of Belagavi. Discover how our digital platform is connecting approximately 50 local stalls directly to every home.
          </p>
        </div>
      </div>

      {/* 1. VISION & MISSION SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8" id="vision">
        {/* Vision Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#fffdfb]/95 border-2 border-[#eed7c2] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#c86228] text-white flex items-center justify-center shadow-lg shadow-[#c86228]/30">
              <Compass size={28} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#c86228] block mb-1">
                Strategic North Star
              </span>
              <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Our Vision</h2>
            </div>
            <p className="text-base sm:text-lg font-medium text-[#2e1b10] leading-relaxed italic bg-[#faf2e8] p-5 rounded-2xl border border-[#eed7c2] shadow-xs">
              &ldquo;Make Khau Katta accessible beyond its physical location by digitally connecting local businesses with customers.&rdquo;
            </p>
            <p className="text-xs text-[#735442] leading-relaxed">
              We envision a Belagavi where distance, evening traffic, and busy schedules never prevent families from enjoying the authentic flavors and timeless craftsmanship that our city was built upon.
            </p>
          </div>
          <div className="pt-6 border-t border-orange-100 mt-6 flex items-center gap-2 text-xs font-bold text-orange-700">
            <CheckCircle2 size={16} /> Accessible Belagavi Heritage for Every Citizen
          </div>
        </div>

        {/* Mission Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#fffdfb]/95 border-2 border-[#eed7c2] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d97706] text-white flex items-center justify-center shadow-lg shadow-[#d97706]/30">
              <Target size={28} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#d97706] block mb-1">
                Execution Commitment
              </span>
              <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg font-medium text-[#2e1b10] leading-relaxed italic bg-[#faf2e8] p-5 rounded-2xl border border-[#eed7c2] shadow-xs">
              &ldquo;Empower local stalls and businesses with a digital platform where customers can discover, order, and receive products conveniently at home.&rdquo;
            </p>
            <p className="text-xs text-[#735442] leading-relaxed">
              We equip small street vendors, sweet-makers, silversmiths, and artisans with enterprise-grade digital storefronts, order handling, and dependable local home delivery without corporate commissions that eat away their livelihoods.
            </p>
          </div>
          <div className="pt-6 border-t border-[#eed7c2]/60 mt-6 flex items-center gap-2 text-xs font-bold text-[#8c502b]">
            <CheckCircle2 size={16} className="text-[#c86228]" /> Empowering 50+ Local Belagavi Entrepreneurs
          </div>
        </div>
      </section>

      {/* 2. ABOUT KHAU KATTA */}
      <section className="bg-[#fffdfb]/95 rounded-3xl p-8 sm:p-12 border border-[#eed7c2] shadow-xs space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c86228]">The Story</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2e1b10] tracking-tight mt-1 mb-4">
            About Khau Katta Belagavi
          </h2>
          <p className="text-sm text-[#735442] leading-relaxed mb-4">
            Located in the vibrant center of Belagavi along Club Road, <strong>Khau Katta</strong> is much more than a food street — it is an open-air cultural marketplace. Over decades, it has blossomed into a bustling ecosystem of approximately 50 stalls spanning culinary legends, traditional silver jewellery artisans, handloom weavers from Shahapur, handcrafted wooden toymakers, brass engravers, and gift shops.
          </p>
          <p className="text-sm text-[#735442] leading-relaxed">
            Until now, savoring these authentic items required physically traveling through crowded evening lanes and waiting in lines. Khau Katta&apos;s digital platform preserves this irreplaceable local fabric while catapulting our merchants into the digital commerce era.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#eed7c2]/60">
          <div className="p-4 rounded-2xl bg-[#faf2e8] text-center border border-[#eed7c2]/60">
            <span className="text-2xl font-black text-[#c86228] block">~50</span>
            <span className="text-xs text-[#735442] font-medium">Local Stalls &amp; Shops</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#faf2e8] text-center border border-[#eed7c2]/60">
            <span className="text-2xl font-black text-[#d97706] block">9</span>
            <span className="text-xs text-[#735442] font-medium">Diverse Categories</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#faf2e8] text-center border border-[#eed7c2]/60">
            <span className="text-2xl font-black text-emerald-700 block">100%</span>
            <span className="text-xs text-[#735442] font-medium">Belagavi Authentic</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#faf2e8] text-center border border-[#eed7c2]/60">
            <span className="text-2xl font-black text-[#2e1b10] block">Club Rd</span>
            <span className="text-xs text-[#735442] font-medium">Central Landmark</span>
          </div>
        </div>
      </section>

      {/* 3. WHY KHAU KATTA? */}
      <section className="space-y-6" id="why">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c86228]">Distinct Identity</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2e1b10] tracking-tight mt-1">
            Why Khau Katta?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#faf2e8] text-[#c86228] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-[#2e1b10] text-base">Not an Impersonal Mega-App</h3>
            <p className="text-xs text-[#735442] leading-relaxed">
              Mainstream aggregators treat stalls like generic SKUs and burden them with 25-30% commissions. Khau Katta is a tailor-made platform celebrating Belagavi&apos;s heritage stalls with hyper-local dignity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#faf2e8] text-[#d97706] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-[#2e1b10] text-base">Food + Artisan Shopping Together</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Unlike single-vertical apps, Khau Katta brings together Misal and Kunda alongside Ilkal sarees, brass pooja gifts, Kolhapuri saaj, and chappals in one unified Belagavi portal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-base">Generational Trust &amp; Quality</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every stall in Khau Katta has a proven physical track record in Belagavi. You receive authentic goods crafted with generations of passion and pride.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BENEFITS: CUSTOMERS VS LOCAL BUSINESSES */}
      <section className="space-y-6" id="benefits">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Mutual Value</span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Empowering Both Sides of the Marketplace
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefits for Customers */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Benefits for Customers</h3>
                <span className="text-xs text-orange-700 font-medium">Belagavi Citizens &amp; Food Enthusiasts</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <span><strong>Authentic Belagavi Flavors at Home:</strong> Enjoy hot Belgaum Kunda, tarri misal, and girmit delivered right to your living room.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <span><strong>Skip the Parking &amp; Crowds:</strong> Avoid evening traffic and parking crunches around Club Road and Camp.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <span><strong>Unified Multi-Category Shopping:</strong> Order dinner, a festive gift, and handmade toys from separate Khau Katta stalls in one spot.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <span><strong>Direct Support to Local Economy:</strong> Every rupee spent directly strengthens local Belagavi families and crafts.</span>
              </li>
            </ul>
          </div>

          {/* Benefits for Local Businesses */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Benefits for Local Businesses</h3>
                <span className="text-xs text-amber-800 font-medium">Khau Katta Stall Owners &amp; Merchants</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Tech Barrier to Entry:</strong> Simple digital presence without needing an expensive independent e-commerce app.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Expand Beyond Physical Footprint:</strong> Reach customers across Tilakwadi, Shahapur, Hindwadi, and Udyambag who cannot visit every night.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Protection Against Aggregator Exploitation:</strong> Fair, cooperative marketplace terms tailored specifically for Belagavi small merchants.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Local Delivery Partner Network:</strong> Seamless order pickup and reliable last-mile delivery provided by the Khau Katta fleet.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-[#5a2912] to-[#7a3713] text-white rounded-3xl p-10 sm:p-12 shadow-xl border border-[#9c4618]">
        <h3 className="text-2xl font-black mb-3">Be Part of the Belagavi Digital Renaissance</h3>
        <p className="text-xs text-[#eed7c2]/80 max-w-xl mx-auto mb-6">
          Explore the current stalls online, discover their menus and artisan crafts, or preview the admin management tools.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/stalls"
            className="px-6 py-3 bg-gradient-to-r from-[#c25e1a] to-[#d97706] hover:from-[#a84e12] hover:to-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Explore 50+ Khau Katta Stalls
          </Link>
          <Link
            to="/admin"
            className="px-6 py-3 bg-[#451f0e] hover:bg-[#5a2912] text-[#f5d9c2] font-bold text-xs rounded-xl border border-[#733718] transition-colors cursor-pointer"
          >
            View Admin Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};
