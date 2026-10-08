import { Truck, Layers, Award, Compass } from 'lucide-react';

export function AtelierTrustBar() {
  const trustPoints = [
    {
      title: 'Solid 3.0mm Belgian Plate',
      subtitle: 'Never pressed foil · 24kg/m² monumental mass',
      icon: Layers,
    },
    {
      title: '3kW Nitrogen Laser Cut',
      subtitle: '±0.05mm micro-kerf · Mirror-smooth edge finish',
      icon: Compass,
    },
    {
      title: 'Insured White-Glove Crate',
      subtitle: 'Reinforced timber transit · 100% covered worldwide',
      icon: Truck,
    },
    {
      title: 'Numbered Atelier Hallmark',
      subtitle: 'Signed physical Certificate of Authenticity',
      icon: Award,
    },
  ];

  return (
    <section className="bg-[#FAF8F5] border-y border-[#EBE4D6] py-7 px-6 text-dark-brown relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {trustPoints.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-[2px] bg-white border border-[#EBE4D6] flex items-center justify-center shrink-0 text-burgundy group-hover:border-burgundy group-hover:bg-burgundy group-hover:text-cream transition-all duration-300 shadow-2xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-dark-brown font-sans">
                  {item.title}
                </h4>
                <p className="text-[11px] text-dark-brown/65 font-sans leading-snug">
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
