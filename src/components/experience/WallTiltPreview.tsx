import { useRef, useState } from 'react';
import { ShapeThumb } from '@/components/shop/ShapeThumb';

interface Props {
  shapeId: string;
  finish: string;
}

/** Interactive 3D-tilt preview of the metal piece on a warm wall backdrop. */
export function WallTiltPreview({ shapeId, finish }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -18, y: (px - 0.5) * 22 });
    setGlare({ x: px * 100, y: py * 100 });
  };
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setGlare({ x: 50, y: 50 }); };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative aspect-square w-full rounded-lg overflow-hidden bg-gradient-to-br from-[#f0e6d6] via-[#e2d2b8] to-[#c9a888] shadow-luxe"
      style={{ perspective: '1200px' }}
    >
      {/* wall texture */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, transparent, rgba(60,30,20,0.35))' }} />
      <div className="absolute inset-0 paper-grain opacity-60" />

      {/* baseboard hint */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#8a6a4a]/60 to-transparent" />

      {/* the metal piece */}
      <div
        className="absolute inset-0 flex items-center justify-center p-16 transition-transform duration-100 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          <ShapeThumb shapeId={shapeId} finish={finish} className="w-full h-full drop-shadow-2xl" />
          {/* moving glare */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60"
            style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,240,210,0.9), transparent 45%)` }}
          />
          {/* cast shadow */}
          <div
            className="absolute inset-0 -z-10 blur-2xl opacity-70"
            style={{ transform: `translate(${(glare.x - 50) * 0.3}px, ${20 + Math.abs(tilt.x)}px)`, background: 'radial-gradient(ellipse, rgba(60,20,25,0.55), transparent 60%)' }}
          />
        </div>
      </div>

      {/* corner label */}
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] bg-oxblood/90 text-ivory px-2 py-1 rounded">
        Live 3D preview · move cursor
      </div>
    </div>
  );
}
