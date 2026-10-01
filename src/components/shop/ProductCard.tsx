import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Product } from '@/lib/catalog';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalog } from '@/lib/catalogContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const { wishlist, toggleWishlist, storeConfig } = useCatalog();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const defaultSize = product.sizes?.[0] || { label: 'Standard', widthMm: 800, heightMm: 800, priceDelta: 0 };
  const price = product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    add({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      shapeId: product.shapeId || 'rectangle',
      sizeLabel: defaultSize.label,
      widthMm: defaultSize.widthMm,
      heightMm: defaultSize.heightMm,
      finish: product.finishes?.[0] || 'gold',
      unitPrice: price,
      quantity: 1,
    });

    toast.success(`${product.name} added to your cart`, {
      description: 'Handcrafted piece reserved in your bag.',
    });
  };

  const formattedCategory = product.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-[#EBE4D6] rounded-[2px] transition-all duration-300 hover:border-[#C6A15B]/50 hover:shadow-xs"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] bg-[#FAF8F5] overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#EBE4D6] flex items-center justify-center text-[#332522] hover:text-maroon-deep hover:border-maroon-deep/30 transition-all duration-200 cursor-pointer shadow-xs"
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-200 ${
              isWishlisted ? 'fill-maroon-deep text-maroon-deep' : 'text-[#332522]'
            }`}
          />
        </button>

        {/* Subtle Badge (Top-Left) if Bestseller or New */}
        {(product.bestseller || product.isNew) && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="text-[8px] uppercase tracking-[0.22em] font-sans font-medium px-2 py-0.5 rounded-[1px] bg-maroon-deep text-cream">
              {product.isNew ? 'New' : 'Curated'}
            </span>
          </div>
        )}

        {/* Subtle Slide-Up Add to Cart Button on Hover */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 transition-all duration-300 ease-out z-20 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 rounded-[2px] bg-maroon-deep hover:opacity-90 text-cream text-[10px] uppercase tracking-[0.22em] font-sans font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-b-2 hover:border-[#C6A15B]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category */}
          <div className="text-[9px] uppercase tracking-[0.24em] text-[#6B2732] font-sans font-medium mb-1.5">
            {formattedCategory}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="font-editorial text-base sm:text-lg text-[#332522] hover:text-maroon-deep transition-colors leading-snug line-clamp-1 block font-normal"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Quick Link */}
        <div className="mt-3 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
          <span className="text-xs sm:text-sm font-sans font-medium text-[#332522]">
            ${price.toLocaleString()}
          </span>
          <Link
            to={`/product/${product.slug}`}
            className="text-[10px] uppercase tracking-[0.2em] text-[#6B2732] hover:text-maroon-deep transition-colors font-sans"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}