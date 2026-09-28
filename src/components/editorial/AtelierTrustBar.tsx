import { ShieldCheck, Truck, Layers, Award, Sparkles, Compass } from 'lucide-react';

export function AtelierTrustBar() {
  const trustPoints = [
    {
      title: 'Solid 3.0mm Belgian Plate',
      subtitle: 'Never pressed foil (approx. 24kg/m² mass)',
      icon: Layers,
    },
    {
      title: '3kW Nitrogen Laser Cut',
      subtitle: '±0.05mm kerf with mirror-smooth edges',
      icon: Compass,
    },
    {
      title: 'Insured White-Glove Crate',
      subtitle: 'Foam-damped reinforced timber transit',
      icon: Truck,
    },
    {
      title: 'Numbered Atelier Hallmark',
      subtitle: 'Signed Certificate of Authenticity',
      icon: Award,
    },
  ];

  return (
    <section className="bg-white border-b border-[#E6E2D8] py-8 px-6 text-[#18181B] relative z-20 shadow-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {trustPoints.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-[2px] bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-center shrink-0 text-[#C5A880] group-hover:border-[#C5A880] group-hover:bg-[#121316] group-hover:text-white transition-all duration-300">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#18181B]/60 font-sans leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
