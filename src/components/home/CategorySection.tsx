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
    <section className="bg-[#FFFFFF] py-20 lg:py-28 border-b border-[#EBE4D6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans text-[#6B2732] font-semibold mb-2">
              <span className="w-5 h-[1px] bg-[#C6A15B]" />
              <span>Curated Disciplines</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#332522] font-normal tracking-tight">
              EXPLORE OUR COLLECTIONS
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#332522] hover:text-maroon-deep transition-colors"
          >
            <span>View All Works</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Elegant Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categoryCards.map((category) => (
            <Link
              key={category.title}
              to={category.link}
              className="group relative flex flex-col bg-[#F8F3EA] border border-[#EBE4D6] rounded-[2px] overflow-hidden transition-all duration-500 hover:border-[#C6A15B] hover:shadow-md cursor-pointer"
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
                <div className="absolute inset-0 bg-maroon-deep/0 group-hover:bg-maroon-deep/35 transition-all duration-500" />

                {/* Small Gold Accent Lines in Corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Counter Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#F8F3EA] bg-[#332522]/80 backdrop-blur-xs px-2.5 py-1 rounded-[1px]">
                    {category.itemCount}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex flex-col justify-between flex-1 bg-[#F8F3EA] transition-colors group-hover:bg-[#FDFBF7]">
                <div>
                  <h3 className="font-editorial text-xl text-[#332522] group-hover:text-maroon-deep transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#332522]/70 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {category.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EBE4D6] flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B2732] group-hover:text-maroon-deep transition-colors">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#C6A15B]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
