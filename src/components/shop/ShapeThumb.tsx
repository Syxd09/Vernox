import { useState, useId } from 'react';
import { shapeDefinitions } from '@/lib/shapes';

interface Props {
  shapeId: string;
  finish?: string;
  className?: string;
}

const finishGradients: Record<string, string[]> = {
  steel:     ['#5c5c5c', '#2c2c2c', '#151515', '#0c0c0c'],
  stainless: ['#ffffff', '#dfdfdf', '#a8a8a8', '#686868', '#383838'],
  aluminum:  ['#f5f5f5', '#cccccc', '#949494', '#5e5e5e'],
  brass:     ['#ffe79a', '#dca842', '#b27b16', '#664103'],
  copper:    ['#ffc4a6', '#e0764c', '#b54b20', '#631e05'],
  gold:      ['#fff6d1', '#e8c95e', '#bc9a24', '#755b0a'],
  corten:    ['#f29f63', '#d9653b', '#963c11', '#4d1902'],
};

export function ShapeThumb({ shapeId, finish = 'brass', className }: Props) {
  const shape = shapeDefinitions.find(s => s.id === shapeId) ?? shapeDefinitions[0];
  const w = 200, h = 200;
  const path = shape.getPath(w, h);
  const stops = finishGradients[finish] ?? finishGradients.brass;
  const uid = useId().replace(/:/g, '');
  const gid = `grad-${shapeId}-${finish}-${uid}`;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg 
      viewBox={`0 0 ${w} ${h}`} 
      className={`${className} transition-transform duration-300 ease-out will-change-transform ${isHovered ? 'scale-105 -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden
    >
      <defs>
        {/* Metallic base gradient */}
        <linearGradient 
          id={gid} 
          x1="0.2" 
          y1="0" 
          x2="0.8" 
          y2="1"
        >
          {stops.map((color, index) => (
            <stop 
              key={index} 
              offset={`${(index / (stops.length - 1)) * 100}%`} 
              stopColor={color} 
            />
          ))}
        </linearGradient>

        {/* Diagonal sheen glare reflection overlay */}
        <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.0} />
          <stop offset="35%" stopColor="#ffffff" stopOpacity={0.0} />
          <stop offset="50%" stopColor="#ffffff" stopOpacity={isHovered ? 0.35 : 0.1} />
          <stop offset="65%" stopColor="#ffffff" stopOpacity={0.0} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
        </linearGradient>

        {/* Premium 3D Bevel and specular metallic lighting filter (static geometry for GPU raster caching) */}
        <filter id={`${gid}-luxe-filter`} x="-20%" y="-20%" width="140%" height="140%">
          {/* Drop shadow */}
          <feDropShadow 
            dx="0" 
            dy={isHovered ? 14 : 8} 
            stdDeviation={isHovered ? 14 : 8} 
            floodColor="#000000" 
            floodOpacity={isHovered ? 0.4 : 0.28} 
          />

          {/* Ambient occlusion and edge beveling mapping */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feSpecularLighting 
            in="blur" 
            specularExponent="35" 
            specularConstant="1.5" 
            surfaceScale="2" 
            lightingColor="#ffffff" 
            result="specOut"
          >
            <feDistantLight azimuth={225} elevation={42} />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOutAlpha" />
          <feComposite in="SourceGraphic" in2="specOutAlpha" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
        </filter>
      </defs>

      {/* Solid metal plate with lux-lighting bevel filter */}
      <path 
        d={path} 
        fill={`url(#${gid})`} 
        filter={`url(#${gid}-luxe-filter)`} 
      />

      {/* Sweeping dynamic sheen layer */}
      <path 
        d={path} 
        fill={`url(#${gid}-sheen)`}
        className="transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      {/* Subtle edge highlight */}
      <path 
        d={path} 
        fill="none" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="1.2" 
      />
    </svg>
  );
}