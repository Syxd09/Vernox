import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Product, finishLabels } from '@/lib/catalog';
import { ShapeThumb } from './ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Star, Heart, ArrowRight } from 'lucide-react';
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
      className="group relative flex flex-col rounded-sm overflow-hidden bg-card border border-border/60 hover-lift hover-glow"
    >
      {/* ── Visual Media Area ── */}
      <Link 
        to={`/product/${product.slug}`} 
        className="block relative aspect-[4/5] bg-gradient-to-b from-muted/20 to-card overflow-hidden cursor-pointer"
      >
        {/* Architectural photography with cinematic zoom */}
        {product.imageUrl && !showVectorThumb ? (
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover img-zoom"
              loading="lazy"
            />
            {/* Refined gradient veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-700" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-card via-background to-muted/15">
            <ShapeThumb 
              shapeId={product.shapeId} 
              finish={selectedFinish} 
              className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:rotate-[0.5deg]" 
            />
          </div>
        )}

        {/* Heritage Badges — refined positioning with backdrop blur */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="text-[7px] uppercase tracking-[0.3em] bg-oxblood/90 backdrop-blur-sm text-ivory px-2.5 py-1 rounded-[2px] font-semibold shadow-sm">
              Atelier Archive
            </span>
          )}
          {product.isNew && (
            <span className="text-[7px] uppercase tracking-[0.3em] bg-foreground/90 backdrop-blur-sm text-background px-2.5 py-1 rounded-[2px] font-semibold shadow-sm">
              New Edition
            </span>
          )}
        </div>

        {/* Wishlist — refined with scale spring */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/20 text-muted-foreground hover:text-red-500 transition-all duration-300 ease-out shadow-sm hover:scale-110 active:scale-95"
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          </button>
        </div>

        {/* Material toggle — slides in from bottom */}
        {product.imageUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowVectorThumb(!showVectorThumb);
            }}
            className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-[2px] bg-background/80 backdrop-blur-md border border-white/15 text-[8px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {showVectorThumb ? "View Interior" : "Inspect Vector"}
          </button>
        )}
      </Link>

      {/* ── Editorial Information ── */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Alloy spec + rating */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-brass font-bold">
            <span>{product.alloySpec || `${product.category} · Belgian Steel`}</span>
            {avgRating && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-2.5 h-2.5 fill-brass text-brass" /> {avgRating}
              </span>
            )}
          </div>

          {/* Product name with understated hover color shift */}
          <Link 
            to={`/product/${product.slug}`} 
            className="font-display text-[17px] text-oxblood-deep group-hover:text-brass transition-colors duration-500 font-semibold block leading-snug truncate"
          >
            {product.name}
          </Link>
          
          <p className="text-[11px] text-muted-foreground/80 line-clamp-1 font-serif-italic leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Finish Swatches + Price */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          {/* Metallic swatches with spring scale */}
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
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ease-spring ${
                  selectedFinish === f 
                    ? 'ring-[1.5px] ring-oxblood ring-offset-2 ring-offset-card scale-110 border-transparent' 
                    : 'border-border/50 hover:scale-110 hover:border-brass/60 opacity-75 hover:opacity-100'
                }`}
                style={{ background: finishLabels[f]?.swatch ?? '#333' }}
                title={finishLabels[f]?.name ?? f}
              />
            ))}
            {product.finishes.length > 4 && (
              <span className="text-[9px] font-mono text-muted-foreground/70 ml-0.5">
                +{product.finishes.length - 4}
              </span>
            )}
          </div>

          {/* Price — refined typography */}
          <div className="text-right">
            <span className="text-[7px] uppercase tracking-[0.2em] text-muted-foreground/70 block leading-none">From</span>
            <span className="text-sm font-semibold font-mono text-oxblood-deep leading-tight mt-0.5 inline-block">
              {(storeConfig.currency && storeConfig.currency !== '$') ? storeConfig.currency : '₹'}{startingPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action row — magnetic buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-[2px] bg-background border border-border/80 hover:border-oxblood/60 text-oxblood-deep hover:text-oxblood text-[10px] uppercase tracking-[0.15em] font-semibold btn-magnetic group/btn"
          >
            Configure
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="h-9 w-9 rounded-[2px] bg-oxblood hover:bg-oxblood-deep text-ivory btn-magnetic flex items-center justify-center"
            title="Quick Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}