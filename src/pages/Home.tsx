import { useState } from 'react';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ShopBySpace } from '@/components/home/ShopBySpace';
import { MaroonCollection } from '@/components/home/MaroonCollection';
import { BrandStory } from '@/components/home/BrandStory';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { CraftingStudioSection } from '@/components/home/CraftingStudioSection';
import { AtelierTrustBar } from '@/components/editorial/AtelierTrustBar';
import { ArchitecturalProof } from '@/components/editorial/ArchitecturalProof';
import { InteriorInspiration } from '@/components/editorial/InteriorInspiration';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { B2BTradeModal } from '@/components/shop/B2BTradeModal';

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);
  const [b2bOpen, setB2bOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-dark-brown selection:bg-maroon-deep selection:text-cream">
      {/* 01. Clean Sticky Header */}
      <SiteHeader onOpenStudio={() => setStudioOpen(true)} />

      {/* Main Luxury Minimalist Ecommerce Flow */}
      <main className="flex-1">
        {/* 02. Split Editorial Hero Slider */}
        <HeroSlider />

        {/* 03. Atelier Quality & Trust Bar */}
        <AtelierTrustBar />

        {/* 04. Explore Our Collections Category Grid */}
        <CategorySection />

        {/* 05. Curated for Your Space - Product Grid */}
        <FeaturedProducts />

        {/* 06. Real Architectural Installations & Spaces Showcase */}
        <InteriorInspiration />

        {/* 07. The Bespoke Crafting Studio - Design Your Own */}
        <CraftingStudioSection onOpenStudio={() => setStudioOpen(true)} />

        {/* 08. Find Art for Your Space - Architectural Environments */}
        <ShopBySpace />

        {/* 09. The Maroon Collection - Deep Maroon Editorial Feature */}
        <MaroonCollection />

        {/* 10. Architectural Provenance & Collector Voices */}
        <ArchitecturalProof />

        {/* 11. Art for the Way You Live - Asymmetric Brand Story */}
        <BrandStory />

        {/* 12. Stay Inspired - Luxury Minimalist Newsletter */}
        <NewsletterSection />
      </main>

      {/* 09. Deep Maroon Luxury Footer */}
      <SiteFooter />

      {/* Bespoke Studio & Trade Inquiries Modals */}
      <InlineStudio open={studioOpen} onOpenChange={setStudioOpen} />
      <B2BTradeModal open={b2bOpen} onOpenChange={setB2bOpen} />
    </div>
  );
}
