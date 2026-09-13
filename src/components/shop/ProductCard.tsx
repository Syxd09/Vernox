import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Product, finishLabels } from '@/lib/catalog';
import { ShapeThumb } from './ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Sparkles, Star, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalog } from '@/lib/catalogContext';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { reviews, wishlist, toggleWishlist, storeConfig } = useCatalog();
  
  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : null;
    
  const isWishlisted = wishlist.includes(product.id);
  
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);
  const [showVectorThumb, setShowVectorThumb] = useState(!product.imageUrl);
  const [isHovered, setIsHovered] = useState(false);

  const defaultSize = product.sizes[0];
  const startingPrice = product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    add({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      shapeId: product.shapeId,
      sizeLabel: defaultSize.label,
      widthMm: defaultSize.widthMm,
      heightMm: defaultSize.heightMm,
      finish: selectedFinish,
      unitPrice: startingPrice,
      quantity: 1
    });
    
    toast.success(`${product.name} added to your collection`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (product.imageUrl) setShowVectorThumb(false);
      }}
      className="group relative flex flex-col rounded-sm overflow-hidden bg-card border border-border/70 hover:border-oxblood/40 transition-all duration-500 hover:shadow-luxe"
    >
      {/* Visual Presentation / Media Area */}
      <Link 
        to={`/product/${product.slug}`} 
        className="block relative aspect-square bg-gradient-to-b from-muted/30 to-card overflow-hidden cursor-pointer"
      >
        {/* Real architectural photography when available, with smooth fallback to vector metallic thumb */}
        {product.imageUrl && !showVectorThumb ? (
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-10 bg-gradient-to-b from-card via-background to-muted/20">
            <ShapeThumb 
              shapeId={product.shapeId} 
              finish={selectedFinish} 
              className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)]" 
            />
          </div>
        )}

        {/* Heritage Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="text-[8px] uppercase tracking-[0.25em] bg-oxblood text-ivory px-2.5 py-1 rounded-sm font-semibold shadow-sm">
              Atelier Archive
            </span>
          )}
          {product.isNew && (
            <span className="text-[8px] uppercase tracking-[0.25em] bg-foreground text-background px-2.5 py-1 rounded-sm font-semibold shadow-sm">
              New Edition
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/80 hover:bg-background text-muted-foreground hover:text-red-500 transition shadow-sm"
            title={isWishlisted ? "Remove from Atelier Wishlist" : "Save to Atelier Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Quick Material Switcher on Hover */}
        {product.imageUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowVectorThumb(!showVectorThumb);
            }}
            className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-sm bg-background/85 backdrop-blur-md border border-border/80 text-[8px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition opacity-0 group-hover:opacity-100"
          >
            {showVectorThumb ? "View Interior" : "Inspect Vector"}
          </button>
        )}
      </Link>

      {/* Editorial Information */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-brass font-bold">
            <span>{product.alloySpec || `${product.category} · Belgian Steel`}</span>
            {avgRating && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-2.5 h-2.5 fill-brass text-brass" /> {avgRating}
              </span>
            )}
          </div>

          <Link 
            to={`/product/${product.slug}`} 
            className="font-display text-lg text-oxblood-deep group-hover:text-brass transition-colors font-semibold block leading-tight truncate"
          >
            {product.name}
          </Link>
          
          <p className="text-xs text-muted-foreground/90 line-clamp-1 font-serif-italic">
            {product.tagline}
          </p>
        </div>

        {/* Metal Finishes & Pricing Row */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          {/* Circular Metallic Swatches */}
          <div className="flex items-center gap-1.5">
            {product.finishes.slice(0, 4).map(f => (
              <button
                key={f}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedFinish(f);
                  setShowVectorThumb(true);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedFinish === f 
                    ? 'ring-2 ring-oxblood ring-offset-1 scale-110' 
                    : 'border-white/30 hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ background: finishLabels[f]?.swatch ?? '#333' }}
                title={finishLabels[f]?.name ?? f}
              />
            ))}
            {product.finishes.length > 4 && (
              <span className="text-[9px] font-mono text-muted-foreground">
                +{product.finishes.length - 4}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="text-right">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block leading-none">Starting at</span>
            <span className="text-sm font-semibold font-mono text-oxblood-deep leading-tight mt-0.5 inline-block">
              {storeConfig.currency}{startingPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-sm bg-background border border-border/90 hover:border-oxblood text-oxblood-deep hover:text-oxblood text-xs uppercase tracking-wider font-semibold transition group/btn"
          >
            Configure
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="h-9 px-3 rounded-sm bg-oxblood hover:bg-oxblood-deep text-ivory transition flex items-center justify-center shadow-sm"
            title="Quick Add Edition to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}