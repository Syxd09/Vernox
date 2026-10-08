import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCard {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  itemCount: string;
}

const categoryCards: CategoryCard[] = [
  {
    title: 'Wall Art',
    subtitle: 'Textured canvases, original impasto & minimalist prints',
    image: '/images/prod-abstract-horizon.jpg',
    link: '/shop/wall-art',
    itemCount: '16 Works',
  },
  {
    title: 'Sculptures',
    subtitle: 'Cast bronze, brushed gold & travertine pedestal forms',
    image: '/images/sculpture-showpiece.jpg',
    link: '/shop/sculptures',
    itemCount: '12 Forms',
  },
  {
    title: 'Statement Pieces',
    subtitle: 'Architectural focal points and large-scale luxury accents',
    image: '/images/statement-piece.jpg',
    link: '/shop/statement',
    itemCount: '9 Editions',
  },
  {
    title: 'Office Décor',
    subtitle: 'Executive desk sculptures and boardroom wall accents',
    image: '/images/office-decor.jpg',
    link: '/shop/office',
    itemCount: '14 Pieces',
  },
];

export function CategorySection() {
  return (
    <section className="bg-white py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="mb-2">
              <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
                Curated Disciplines
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-dark-brown font-normal tracking-tight">
              EXPLORE OUR COLLECTIONS
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-sans font-medium text-dark-brown hover:text-burgundy transition-colors"
          >
            <span>View All Works</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Elegant Image Cards Grid (2 columns on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {categoryCards.map((category) => (
            <Link
              key={category.title}
              to={category.link}
              className="group relative flex flex-col bg-cream border border-[#EBE4D6] rounded-[2px] overflow-hidden transition-all duration-500 hover:border-gold hover:shadow-md cursor-pointer"
            >
              {/* Image Container with Maroon Overlay on Hover */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />

                {/* Subtle Maroon Overlay on Hover */}
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/35 transition-all duration-500" />

                {/* Small Gold Accent Lines in Corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Counter Badge */}
                <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-mono text-cream bg-dark-brown/80 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[1px]">
                    {category.itemCount}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 bg-cream transition-colors group-hover:bg-[#FDFBF7]">
                <div>
                  <h3 className="font-editorial text-sm sm:text-xl text-dark-brown group-hover:text-burgundy transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-dark-brown/70 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {category.subtitle}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#EBE4D6] flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-sans text-burgundy group-hover:text-burgundy transition-colors">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-gold" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
