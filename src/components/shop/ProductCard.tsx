import { Link } from 'react-router-dom';
import { Product } from '@/lib/catalog';
import { ShapeThumb } from './ShapeThumb';

export function ProductCard({ product }: { product: Product }) {
  const defaultFinish = product.finishes[0];
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex flex-col rounded-lg overflow-hidden bg-card border border-border/60 hover:border-oxblood/50 transition-all duration-500 hover:shadow-luxe"
    >
      <div className="relative aspect-square bg-gradient-to-br from-background via-card to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105">
          <ShapeThumb shapeId={product.shapeId} finish={defaultFinish} className="w-full h-full" />
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.bestseller && <span className="text-[10px] tracking-widest uppercase bg-oxblood text-primary-foreground px-2 py-0.5 rounded">Bestseller</span>}
          {product.isNew && <span className="text-[10px] tracking-widest uppercase bg-foreground text-background px-2 py-0.5 rounded">New</span>}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-1">
        <h3 className="font-display text-lg group-hover:text-brass transition-colors">{product.name}</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium">From ${product.price}</span>
          <div className="flex gap-1">
            {product.finishes.slice(0, 3).map(f => (
              <span key={f} className="w-3 h-3 rounded-full border border-white/20"
                style={{ background: f === 'brass' ? 'linear-gradient(135deg,#e6c069,#8a6a2a)'
                       : f === 'copper' ? 'linear-gradient(135deg,#e08a5a,#7a3a1e)'
                       : f === 'gold' ? 'linear-gradient(135deg,#f5d97a,#a37c22)'
                       : f === 'stainless' ? 'linear-gradient(135deg,#d8d8d8,#8a8a8a)'
                       : f === 'corten' ? 'linear-gradient(135deg,#c05a2a,#5a2010)'
                       : 'linear-gradient(135deg,#3a3a3a,#111)' }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}