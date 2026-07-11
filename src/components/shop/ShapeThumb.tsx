import { shapeDefinitions } from '@/lib/shapes';

interface Props {
  shapeId: string;
  finish?: string;
  className?: string;
}

const finishGradient: Record<string, { a: string; b: string; c: string }> = {
  steel:     { a: '#4a4a4a', b: '#1a1a1a', c: '#0a0a0a' },
  stainless: { a: '#e8e8e8', b: '#a0a0a0', c: '#606060' },
  aluminum:  { a: '#d0d0d0', b: '#909090', c: '#5a5a5a' },
  brass:     { a: '#f0d078', b: '#a37c2a', c: '#5a3a10' },
  copper:    { a: '#f0a070', b: '#a3562a', c: '#5a2010' },
  gold:      { a: '#ffe390', b: '#c9a34c', c: '#7a5a1a' },
  corten:    { a: '#d06a30', b: '#8a3a1a', c: '#3a1508' },
};

export function ShapeThumb({ shapeId, finish = 'brass', className }: Props) {
  const shape = shapeDefinitions.find(s => s.id === shapeId) ?? shapeDefinitions[0];
  const w = 200, h = 200;
  const path = shape.getPath(w, h);
  const g = finishGradient[finish] ?? finishGradient.brass;
  const gid = `grad-${shapeId}-${finish}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.a} />
          <stop offset="55%" stopColor={g.b} />
          <stop offset="100%" stopColor={g.c} />
        </linearGradient>
        <filter id={`${gid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <path d={path} fill={`url(#${gid})`} filter={`url(#${gid}-shadow)`} />
      <path d={path} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}