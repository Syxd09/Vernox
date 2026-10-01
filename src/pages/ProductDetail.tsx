import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finishLabels, Product } from '@/lib/catalog';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { WallTiltPreview } from '@/components/experience/WallTiltPreview';
import { WallPreview } from '@/components/experience/WallPreview';
import { InlineStudio } from '@/components/experience/InlineStudio';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { 
  Check, 
  Compass, 
  ChevronDown, 
  ShoppingBag, 
  ArrowLeft, 
  Ruler, 
  Hammer, 
  Wind, 
  Star, 
  Heart, 
  Award, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Sparkles,
  Layers,
  Eye,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'photo' | 'preview' | 'wall' | 'story';

export default function ProductDetail() {
  const { getProductBySlug, products, reviews, addReview, currentCustomer, wishlist, toggleWishlist, storeConfig } = useCatalog();
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  
  const productReviews = product ? reviews.filter(r => r.productId === product.id) : [];
  const avgRating = productReviews.length 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '5.0';
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const navigate = useNavigate();
  const { add } = useCart();
  const [finish, setFinish] = useState(product?.finishes[0] ?? 'brass');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>(() => product?.imageUrl ? 'photo' : 'preview');
  const [studioOpen, setStudioOpen] = useState(false);

  // When product changes, reset defaults
  useEffect(() => {
    if (product) {
      setFinish(product.finishes[0] || 'brass');
      setSizeIdx(0);
      setQty(1);
      setTab(product.imageUrl ? 'photo' : 'preview');
    }
  }, [product?.id]);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (currentCustomer) {
      setReviewName(currentCustomer.name);
    }
  }, [currentCustomer]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in your name and comment.");
      return;
    }
    setIsSubmittingReview(true);
    await addReview({
      productId: product.id,
      customerName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      placedAt: Date.now()
    });
    setIsSubmittingReview(false);
    setReviewComment('');
    setReviewRating(5);
    toast.success("Thank you for your feedback! Review published.");
  };

  // Related products from the atelier
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F3EA]">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
          <p className="font-editorial text-3xl text-[#332522]">Artwork Not Found</p>
          <p className="text-xs text-[#332522]/70 font-sans max-w-sm">The requested atelier edition may have moved or been decommissioned.</p>
          <Link to="/shop" className="mt-2 inline-flex items-center gap-2 bg-maroon-deep text-cream text-xs uppercase tracking-[0.2em] font-sans font-semibold px-6 py-3 rounded-[2px]">
            Return to Collection
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const size = product.sizes[sizeIdx] || product.sizes[0] || { label: 'Standard', widthMm: 800, heightMm: 800, priceDelta: 0 };
  const unitPrice = product.price + size.priceDelta;
  const currencySymbol = storeConfig.currency || '$';

  const handleAdd = () => {
    add({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      shapeId: product.shapeId || 'circle',
      sizeLabel: size.label,
      widthMm: size.widthMm,
      heightMm: size.heightMm,
      finish,
      unitPrice,
      quantity: qty,
    });
    toast.success(`${product.name} reserved in your bag`, {
      description: `Bespoke ${finishLabels[finish]?.name || finish} edition added.`
    });
  };

  const formattedCategory = product.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA]">
      <SiteHeader />
      
      {/* Editorial Breadcrumbs */}
      <div className="border-b border-[#EBE4D6] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[11px] font-sans text-[#332522]/70">
            <Link to="/shop" className="hover:text-maroon-deep transition-colors">
              Collection
            </Link>
            <span className="text-[#332522]/30">/</span>
            <Link to={`/shop/${product.category}`} className="hover:text-maroon-deep transition-colors">
              {formattedCategory}
            </Link>
            <span className="text-[#332522]/30">/</span>
            <span className="text-[#332522] font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#6B2732] hover:text-maroon-deep transition cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Atelier Product Section */}
      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-14 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Gallery & Interactive Visualizers (Sticky to prevent blank void) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-4 min-w-0 w-full max-w-full">
            
            {/* View Switcher Tabs - Grid layout ensures it stays strictly within the left column */}
            <div className="w-full max-w-full p-1 bg-white border border-[#EBE4D6] rounded-[2px] shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full">
                {([
                  ...(product.imageUrl ? [{ id: 'photo', label: 'Architectural Photo', icon: Eye }] : []),
                  { id: 'preview', label: '3D Vector', icon: Sparkles },
                  { id: 'wall', label: 'Room Scale', icon: Maximize2 },
                  { id: 'story', label: 'Atelier Making', icon: Layers },
                ] as { id: Tab; label: string; icon: any }[]).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-sans font-semibold rounded-[2px] transition cursor-pointer text-center truncate',
                      tab === t.id
                        ? 'bg-maroon-deep text-cream shadow-xs'
                        : 'text-[#332522]/70 hover:text-[#332522] hover:bg-[#F8F3EA]'
                    )}
                  >
                    <t.icon className={cn('w-3.5 h-3.5 shrink-0', tab === t.id ? 'text-[#C6A15B]' : 'text-[#332522]/50')} />
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stage Display Area */}
            <div className="bg-white border border-[#EBE4D6] rounded-[2px] overflow-hidden shadow-xs relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab === 'photo' && product.imageUrl && (
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#FAF8F5] overflow-hidden group">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      
                      {/* Floating In-Situ Label */}
                      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-[2px] bg-white/95 backdrop-blur-md border border-[#EBE4D6] flex items-center justify-between shadow-xs">
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.26em] text-[#6B2732] font-sans font-semibold">
                            Atelier Installation
                          </div>
                          <div className="font-editorial text-sm sm:text-base font-normal text-[#332522] mt-0.5">
                            {product.name} · {product.alloySpec || 'Belgian Solid Plate'}
                          </div>
                        </div>
                        <div className="text-[10px] text-[#332522]/60 font-mono tracking-wider">
                          Antwerp Atelier
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'preview' && (
                    <div className="p-4 sm:p-6 bg-[#FAF8F5] min-h-[420px] flex items-center justify-center">
                      <WallTiltPreview shapeId={product.shapeId || 'circle'} finish={finish} />
                    </div>
                  )}

                  {tab === 'wall' && (
                    <div className="p-4 sm:p-6 bg-[#FAF8F5] min-h-[420px] flex items-center justify-center">
                      <WallPreview
                        shapeId={product.shapeId || 'circle'}
                        finish={finish}
                        widthMm={size.widthMm}
                        heightMm={size.heightMm}
                      />
                    </div>
                  )}

                  {tab === 'story' && (
                    <div className="p-6 sm:p-8 bg-[#FAF8F5]">
                      <StoryScroll finish={finishLabels[finish]?.name || finish} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Multi-Angle / View Thumbnails Row (Fills out the left column cleanly) */}
            <div className="grid grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setTab('photo')}
                className={cn(
                  'relative aspect-[4/3] rounded-[2px] overflow-hidden border transition-all cursor-pointer bg-white',
                  tab === 'photo' ? 'border-[#6B2732] ring-1 ring-[#6B2732]' : 'border-[#EBE4D6] hover:border-[#6B2732]/40 opacity-80 hover:opacity-100'
                )}
              >
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="Architectural Angle" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-sans text-[#332522]">Photo</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-wider py-0.5 text-center font-sans">
                  Gallery
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTab('preview')}
                className={cn(
                  'relative aspect-[4/3] rounded-[2px] overflow-hidden border transition-all cursor-pointer bg-white flex flex-col items-center justify-center p-2',
                  tab === 'preview' ? 'border-[#6B2732] ring-1 ring-[#6B2732]' : 'border-[#EBE4D6] hover:border-[#6B2732]/40 opacity-80 hover:opacity-100'
                )}
              >
                <Sparkles className="w-4 h-4 text-[#C6A15B] mb-1" />
                <span className="text-[9px] uppercase tracking-wider font-sans font-semibold text-[#332522]">3D Vector</span>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-wider py-0.5 text-center font-sans">
                  Interactive
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTab('wall')}
                className={cn(
                  'relative aspect-[4/3] rounded-[2px] overflow-hidden border transition-all cursor-pointer bg-white flex flex-col items-center justify-center p-2',
                  tab === 'wall' ? 'border-[#6B2732] ring-1 ring-[#6B2732]' : 'border-[#EBE4D6] hover:border-[#6B2732]/40 opacity-80 hover:opacity-100'
                )}
              >
                <Maximize2 className="w-4 h-4 text-[#6B2732] mb-1" />
                <span className="text-[9px] uppercase tracking-wider font-sans font-semibold text-[#332522]">Room Scale</span>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-wider py-0.5 text-center font-sans">
                  Scale
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTab('story')}
                className={cn(
                  'relative aspect-[4/3] rounded-[2px] overflow-hidden border transition-all cursor-pointer bg-white flex flex-col items-center justify-center p-2',
                  tab === 'story' ? 'border-[#6B2732] ring-1 ring-[#6B2732]' : 'border-[#EBE4D6] hover:border-[#6B2732]/40 opacity-80 hover:opacity-100'
                )}
              >
                <Layers className="w-4 h-4 text-[#6B2732] mb-1" />
                <span className="text-[9px] uppercase tracking-wider font-sans font-semibold text-[#332522]">Crafting</span>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] uppercase tracking-wider py-0.5 text-center font-sans">
                  Atelier
                </div>
              </button>
            </div>

            {/* Atelier Craftsmanship Highlights Bar below Left Column */}
            <div className="p-4 bg-white border border-[#EBE4D6] rounded-[2px] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-sans text-[#6B2732] font-semibold">Gauge</div>
                <div className="text-xs font-sans font-medium text-[#332522] mt-0.5">3.0mm Solid</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-sans text-[#6B2732] font-semibold">Mounting</div>
                <div className="text-xs font-sans font-medium text-[#332522] mt-0.5">Floating Standoff</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-sans text-[#6B2732] font-semibold">Provenance</div>
                <div className="text-xs font-sans font-medium text-[#332522] mt-0.5">Signed Hallmark</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-sans text-[#6B2732] font-semibold">Freight</div>
                <div className="text-xs font-sans font-medium text-[#332522] mt-0.5">Insured Crated</div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Configuration, Specifications, Purchase & Commerce */}
          <div className="lg:col-span-5 space-y-8 min-w-0 w-full">
            
            {/* Product Title & Brand Identity */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-[1px] bg-[#C6A15B]" />
                <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-[#6B2732] font-semibold">
                  {product.tagline || formattedCategory}
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl text-[#332522] font-normal tracking-tight leading-[1.05] mb-3">
                {product.name}
              </h1>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#C6A15B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                  ))}
                </div>
                <span className="font-sans font-medium text-[#332522] text-xs">
                  {avgRating}
                </span>
                <span className="text-[#332522]/50 text-xs">
                  ({Math.max(productReviews.length, 12)} verified commissions)
                </span>
              </div>
            </div>

            {/* Price & Atelier Spec Strip */}
            <div className="p-4 bg-white border border-[#EBE4D6] rounded-[2px] space-y-3">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-3xl sm:text-4xl text-[#332522] font-normal">
                    {currencySymbol}{unitPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#332522]/60 font-sans">
                    USD · Bespoke Atelier Edition
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.22em] font-sans text-[#6B2732] bg-[#6B2732]/10 px-2.5 py-1 rounded-[1px] font-semibold">
                  Tax Included
                </span>
              </div>

              {product.alloySpec && (
                <div className="pt-3 border-t border-[#EBE4D6] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shrink-0" />
                    <span className="font-sans text-[11px] text-[#332522]/85 font-medium">
                      {product.alloySpec}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[#C6A15B] font-mono font-semibold shrink-0">
                    Certified Alloy
                  </span>
                </div>
              )}
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-[#332522]/80 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.24em] font-sans text-[#332522]">
                  Select Finish & Patina
                </label>
                <span className="text-xs font-sans text-[#6B2732] font-medium">
                  {finishLabels[finish]?.name || finish}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.finishes.map(f => {
                  const isSelected = finish === f;
                  const label = finishLabels[f]?.name ?? f;
                  const swatch = finishLabels[f]?.swatch ?? '#4A4A4F';

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFinish(f)}
                      title={label}
                      className={cn(
                        'group/swatch relative p-1 rounded-[2px] transition-all cursor-pointer flex items-center gap-2 border text-xs font-sans',
                        isSelected
                          ? 'border-[#6B2732] bg-white ring-1 ring-[#6B2732] text-[#332522] font-semibold shadow-xs'
                          : 'border-[#EBE4D6] bg-white/70 hover:bg-white text-[#332522]/70 hover:text-[#332522]'
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-[1px] border border-black/10 shrink-0"
                        style={{ background: swatch }}
                      />
                      <span className="pr-1 text-[11px]">{label}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#6B2732]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimensions & Scale Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.24em] font-sans text-[#332522]">
                  Scale & Dimensions
                </label>
                <span className="text-[10px] uppercase tracking-wider text-[#332522]/50 font-sans">
                  ±0.05mm laser tolerance
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {product.sizes.map((s, i) => {
                  const isSelected = sizeIdx === i;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSizeIdx(i)}
                      className={cn(
                        'flex justify-between items-center px-4 py-3 rounded-[2px] border text-xs text-left transition-all cursor-pointer',
                        isSelected
                          ? 'border-[#6B2732] bg-white ring-1 ring-[#6B2732] shadow-xs'
                          : 'border-[#EBE4D6] bg-white/70 hover:bg-white text-[#332522]/80 hover:text-[#332522]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Ruler className={cn('w-3.5 h-3.5', isSelected ? 'text-[#6B2732]' : 'text-[#C6A15B]')} />
                        <span className={cn('font-sans', isSelected ? 'font-semibold text-[#332522]' : 'text-[#332522]/80')}>
                          {s.label}
                        </span>
                      </div>
                      <span className={cn('font-mono text-xs', isSelected ? 'font-semibold text-[#6B2732]' : 'text-[#332522]/60')}>
                        {s.priceDelta > 0 ? `+${currencySymbol}${s.priceDelta}` : 'Standard Edition'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commission Quantity & Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-semibold uppercase tracking-[0.24em] font-sans text-[#332522]">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-[#EBE4D6] rounded-[2px] bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 hover:bg-[#F8F3EA] transition font-semibold text-xs text-[#332522] cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 min-w-10 text-center font-mono text-xs font-semibold text-[#332522]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(q => q + 1)}
                    className="px-3.5 py-1.5 hover:bg-[#F8F3EA] transition font-semibold text-xs text-[#332522] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Order + Customise + Wishlist */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 bg-maroon-deep hover:opacity-90 text-cream font-semibold text-xs uppercase tracking-[0.2em] font-sans px-7 py-4 rounded-[2px] transition shadow-xs cursor-pointer hover:border-b-2 hover:border-[#C6A15B]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                  <span>Add to Order · {currencySymbol}{(unitPrice * qty).toLocaleString()}</span>
                </button>

                {product.customizable && (
                  <button
                    type="button"
                    onClick={() => setStudioOpen(true)}
                    className="inline-flex items-center justify-center gap-2 border border-[#6B2732]/40 hover:border-[#6B2732] bg-white text-[#6B2732] font-semibold text-xs uppercase tracking-[0.18em] font-sans px-5 py-4 rounded-[2px] hover:bg-[#6B2732]/5 transition cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Custom CAD</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(isWishlisted ? "Removed from private catalog" : "Saved to private catalog");
                  }}
                  className={cn(
                    'inline-flex items-center justify-center p-4 rounded-[2px] border transition-all cursor-pointer',
                    isWishlisted 
                      ? 'border-[#6B2732] bg-[#6B2732]/10 text-[#6B2732]' 
                      : 'border-[#EBE4D6] bg-white text-[#332522]/70 hover:border-[#6B2732]/50 hover:text-[#332522]'
                  )}
                  title={isWishlisted ? "Remove from Saved" : "Save to Private Catalog"}
                >
                  <Heart className={cn('w-4 h-4', isWishlisted && 'fill-[#6B2732] text-[#6B2732]')} />
                </button>
              </div>
            </div>

            {/* Real-Time Atelier Dispatch & Crating Promise */}
            <div className="p-4 rounded-[2px] bg-white border border-[#EBE4D6] space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#332522] font-sans">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>Priority Dispatch: Order within 3h 48m for Tuesday Dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#332522]/75 font-sans">
                <Truck className="w-4 h-4 text-[#6B2732] shrink-0" />
                <span>Complimentary Insured White-Glove Crated Shipping worldwide</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-emerald-800 font-sans font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock in Antwerp Atelier · Ready for Laser Final Inspection</span>
              </div>
            </div>

            {/* 4 Core Trust Attributes */}
            <div className="pt-6 border-t border-[#EBE4D6] grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
              {[
                { icon: Hammer, label: 'Alloy Gauge', v: 'Solid 3.0mm Belgian Plate' },
                { icon: Award, label: 'Provenance', v: 'Numbered Hallmark & Signed Certificate' },
                { icon: Wind, label: 'Mounting', v: 'Concealed 20mm Rear Float Standoffs' },
                { icon: ShieldCheck, label: 'Warranty', v: '10-Year Anti-Corrosion Guarantee' },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-2.5">
                  <f.icon className="w-4 h-4 text-[#C6A15B] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#6B2732] font-sans font-semibold">
                      {f.label}
                    </div>
                    <div className="text-[#332522] font-medium font-sans mt-0.5">
                      {f.v}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architectural Specifications Accordions */}
            <div className="border-t border-[#EBE4D6] pt-6 space-y-3">
              <details className="group border border-[#EBE4D6] rounded-[2px] p-3.5 bg-white transition open:shadow-xs">
                <summary className="text-xs font-semibold uppercase tracking-[0.18em] font-sans text-[#332522] cursor-pointer flex items-center justify-between list-none">
                  <span>Metallurgy & Precision Tolerance</span>
                  <ChevronDown className="w-4 h-4 text-[#C6A15B] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pt-3 text-xs text-[#332522]/80 leading-relaxed space-y-2 font-sans border-t border-[#EBE4D6] mt-3">
                  <p>
                    Cold-rolled Belgian metallurgical plate with an uncompromising 3.0mm thickness (gauge weight approx. 24kg/m²). Cut with fiber-optic nitrogen assist laser to ±0.05mm precision.
                  </p>
                  <p>
                    Surface passivated to prevent natural oxidation while maintaining the tactile brushed metallurgical grain.
                  </p>
                </div>
              </details>

              <details className="group border border-[#EBE4D6] rounded-[2px] p-3.5 bg-white transition open:shadow-xs">
                <summary className="text-xs font-semibold uppercase tracking-[0.18em] font-sans text-[#332522] cursor-pointer flex items-center justify-between list-none">
                  <span>Concealed Float Mounting & Installation</span>
                  <ChevronDown className="w-4 h-4 text-[#C6A15B] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pt-3 text-xs text-[#332522]/80 leading-relaxed space-y-2 font-sans border-t border-[#EBE4D6] mt-3">
                  <p>
                    Each piece includes our signature rear standoff system: 4× machined 20mm brass cylinders that mount invisibly to drywall, masonry, or timber cladding.
                  </p>
                  <p>
                    A full-scale 1:1 paper drill template, stainless masonry screws, and Fischer wall anchors are included inside every crate.
                  </p>
                </div>
              </details>

              <details className="group border border-[#EBE4D6] rounded-[2px] p-3.5 bg-white transition open:shadow-xs">
                <summary className="text-xs font-semibold uppercase tracking-[0.18em] font-sans text-[#332522] cursor-pointer flex items-center justify-between list-none">
                  <span>Insured Freight, Zero-Deflection Crating & Returns</span>
                  <ChevronDown className="w-4 h-4 text-[#C6A15B] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pt-3 text-xs text-[#332522]/80 leading-relaxed space-y-2 font-sans border-t border-[#EBE4D6] mt-3">
                  <p>
                    Shipped in archival plywood crates reinforced with shock-absorbing foam. Fully insured door-to-door with DHL Express / FedEx Priority.
                  </p>
                  <p>
                    Enjoy our 30-Day Interior Evaluation privilege. If the piece does not resonate with your space, return it for an immediate exchange or refund.
                  </p>
                </div>
              </details>
            </div>

            {/* Trade & Architecture Project Concierge Banner */}
            <div className="p-4 bg-white border border-[#EBE4D6] rounded-[2px] flex items-center justify-between gap-4 shadow-2xs">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#332522] font-sans">
                  Specifying for an Interior Project?
                </div>
                <div className="text-[11px] text-[#332522]/70 font-sans mt-0.5">
                  Custom dimensions, 3D CAD DXF files & trade tier discounts available.
                </div>
              </div>
              <a 
                href="mailto:concierge@vernoxatelier.com?subject=Trade Specification Request"
                className="text-xs font-semibold uppercase tracking-[0.18em] font-sans text-maroon-deep border border-[#6B2732]/40 px-3.5 py-1.5 rounded-[2px] hover:bg-[#6B2732] hover:text-cream transition shrink-0"
              >
                Inquire
              </a>
            </div>

          </div>
        </div>
      </main>

      {/* Sticky Mobile Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#EBE4D6] px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6B2732] truncate font-sans">
              {product.name}
            </div>
            <div className="text-xs font-mono font-bold text-[#332522]">
              {currencySymbol}{(unitPrice * qty).toLocaleString()}
              <span className="text-[9px] font-sans text-[#332522]/60 font-normal ml-1">· {size.label}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 bg-maroon-deep text-cream text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-[2px] shadow-sm active:scale-95 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Add to Order</span>
          </button>
        </div>
      </div>

      {/* Interactive CAD Studio Modal */}
      <InlineStudio
        open={studioOpen}
        onOpenChange={setStudioOpen}
        initialShapeId={product.shapeId || 'circle'}
        initialWidthMm={size.widthMm}
        initialHeightMm={size.heightMm}
        initialFinish={finish}
        productName={product.name}
      />

      {/* Reviews & Client Trade Feedback Section */}
      <section className="bg-white border-t border-[#EBE4D6] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] font-sans text-[#6B2732] font-semibold mb-2">
                <span className="w-4 h-[1px] bg-[#C6A15B]" />
                <span>Verified Client Feedback</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#332522] font-normal tracking-tight">
                CLIENT REVIEWS & TRADE COMMISSIONS
              </h2>
              <p className="text-xs text-[#332522]/70 font-sans mt-1">
                Authenticated feedback from architects, interior designers, and private collectors.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#332522]/80 font-sans">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>100% Authenticated Commissions</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 lg:gap-14">
            {/* Left: Rating Breakdown & Write Review */}
            <div className="space-y-6">
              <div className="bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans text-[#6B2732] font-semibold">
                  Rating Breakdown
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-5xl font-normal text-[#332522]">{avgRating}</span>
                  <span className="text-[#332522]/60 text-sm font-sans">out of 5.0</span>
                </div>
                <div className="flex text-[#C6A15B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C6A15B] text-[#C6A15B]" />
                  ))}
                </div>

                {/* Rating Percentage Bars */}
                <div className="space-y-2 pt-2 border-t border-[#EBE4D6]">
                  {[
                    { star: 5, pct: 92 },
                    { star: 4, pct: 8 },
                    { star: 3, pct: 0 },
                    { star: 2, pct: 0 },
                    { star: 1, pct: 0 },
                  ].map(b => (
                    <div key={b.star} className="flex items-center gap-2 text-[11px] text-[#332522]/70 font-mono">
                      <span className="w-4 inline-flex items-center gap-0.5">
                        {b.star}<Star className="w-2 h-2 fill-[#C6A15B] text-[#C6A15B] inline" />
                      </span>
                      <div className="flex-1 bg-[#EBE4D6] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C6A15B] rounded-full" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="w-7 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans text-[#332522] font-semibold">
                  Write an Atelier Review
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#332522]/70 font-sans font-semibold">
                    Your Name & Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jean Dupont (Architect, Paris)"
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full bg-white border border-[#EBE4D6] rounded-[2px] px-3 py-2 text-xs text-[#332522] outline-none focus:border-[#6B2732]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#332522]/70 font-sans font-semibold block">
                    Rating
                  </label>
                  <div className="flex gap-1.5 text-[#C6A15B]">
                    {[1, 2, 3, 4, 5].map(stars => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setReviewRating(stars)}
                        className="hover:scale-110 transition cursor-pointer p-0.5"
                      >
                        <Star className={cn('w-4 h-4', stars <= reviewRating ? 'fill-[#C6A15B] text-[#C6A15B]' : 'text-[#EBE4D6]')} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#332522]/70 font-sans font-semibold">
                    Comments & Experience
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share feedback regarding metallurgical finish, edge accuracy, and packaging..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-[#EBE4D6] rounded-[2px] px-3 py-2 text-xs text-[#332522] outline-none focus:border-[#6B2732] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-maroon-deep text-cream text-[10px] uppercase tracking-[0.2em] font-sans font-semibold py-3 rounded-[2px] hover:opacity-90 transition disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {isSubmittingReview ? 'Publishing...' : 'Submit Authenticated Review'}
                </button>
              </form>
            </div>

            {/* Right: Reviews List */}
            <div className="space-y-4">
              {productReviews.length > 0 ? (
                <div className="divide-y divide-[#EBE4D6] space-y-4">
                  {productReviews.map((r, idx) => (
                    <div key={r.id} className={cn('space-y-2', idx > 0 && 'pt-4')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#332522] text-xs font-sans">{r.customerName}</span>
                          <span className="text-[8px] uppercase tracking-wider bg-[#6B2732]/10 text-[#6B2732] px-2 py-0.5 rounded-[1px] font-semibold font-sans">
                            Verified Commission
                          </span>
                        </div>
                        <span className="text-[10px] text-[#332522]/50 font-mono">
                          {new Date(r.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex text-[#C6A15B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('w-3.5 h-3.5', i < r.rating ? 'fill-[#C6A15B] text-[#C6A15B]' : 'text-[#EBE4D6]')} />
                        ))}
                      </div>
                      <p className="text-xs text-[#332522]/80 leading-relaxed font-sans">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Default exemplary architect testimonials */}
                  <div className="bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#332522] text-sm font-sans">Marcus Van Houten</span>
                        <span className="text-[9px] uppercase tracking-wider bg-emerald-700/10 text-emerald-800 px-2 py-0.5 rounded-[1px] font-semibold font-sans">
                          Principal Architect, Studio Antwerp
                        </span>
                      </div>
                      <span className="text-[10px] text-[#332522]/50 font-mono">Verified Project</span>
                    </div>
                    <div className="flex text-[#C6A15B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#332522]/85 leading-relaxed font-sans">
                      "The laser edge tolerance is impeccable. At 3.0mm, the plate has real architectural mass and gravity. The 20mm float standoffs cast exactly the delicate shadow line we specified for the gallery reception."
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EBE4D6] rounded-[2px] p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#332522] text-sm font-sans">Elena Rostova</span>
                        <span className="text-[9px] uppercase tracking-wider bg-[#6B2732]/10 text-[#6B2732] px-2 py-0.5 rounded-[1px] font-semibold font-sans">
                          Private Collector, Zurich
                        </span>
                      </div>
                      <span className="text-[10px] text-[#332522]/50 font-mono">Verified Commission</span>
                    </div>
                    <div className="flex text-[#C6A15B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#332522]/85 leading-relaxed font-sans">
                      "The wood crate packaging was museum-grade. Accompanied by the signed certificate of authenticity and numbered hallmark seal. A centerpiece in our dining hall."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Complementary Works from the Atelier Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#F8F3EA] py-16 sm:py-20 border-t border-[#EBE4D6]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] font-sans text-[#6B2732] font-semibold mb-2">
                  <span className="w-4 h-[1px] bg-[#C6A15B]" />
                  <span>Curator's Pairing</span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#332522] font-normal tracking-tight">
                  COMPLEMENTARY MASTERWORKS
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-maroon-deep hover:opacity-80 transition"
              >
                View Full Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function StoryScroll({ finish }: { finish: string }) {
  const chapters = [
    { n: '01', title: 'Sourced sheet', body: 'A 3mm sheet of Belgian steel is trimmed to blank in our Antwerp workshop, weighed, and paired with an order card.' },
    { n: '02', title: 'Cut by fibre laser', body: 'Two minutes of focused light. The blank leaves the bed with an edge you can read a paragraph off — no burrs, no dross.' },
    { n: '03', title: 'Hand-finished', body: `Sanded, brushed, and finished in ${finish}. Each piece signed on the reverse by the maker.` },
    { n: '04', title: 'Yours in ten days', body: 'Packed in wool felt, shipped with concealed hardware. Hang it. Live with it.' },
  ];
  return (
    <div className="space-y-6">
      {chapters.map((c, i) => (
        <motion.div 
          key={c.n}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="relative pl-12 py-3 border-l-2 border-[#6B2732]/20"
        >
          <span className="absolute left-0 -translate-x-1/2 top-2.5 w-8 h-8 rounded-full bg-white border border-[#6B2732] flex items-center justify-center font-editorial text-[#6B2732] text-xs font-semibold shadow-2xs">
            {c.n}
          </span>
          <h4 className="font-editorial text-lg text-[#332522] mb-1 font-normal">{c.title}</h4>
          <p className="text-xs text-[#332522]/75 leading-relaxed font-sans">{c.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
