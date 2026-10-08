import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Upload, Move, ZoomIn, RotateCcw, User, Check, Ruler } from 'lucide-react';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { Product } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface Props {
  product?: Product;
  shapeId: string;
  finish: string;
  widthMm: number;
  heightMm: number;
}

interface RoomEnv {
  id: string;
  name: string;
  image: string;
  wallWidthCm: number;
  defaultY: number;
}

const ROOM_ENVIRONMENTS: RoomEnv[] = [
  {
    id: 'salon',
    name: 'Living Salon',
    image: '/images/hero-art-lounge.jpg',
    wallWidthCm: 320,
    defaultY: 38,
  },
  {
    id: 'office',
    name: 'Executive Suite',
    image: '/images/office-decor.jpg',
    wallWidthCm: 280,
    defaultY: 36,
  },
  {
    id: 'bedroom',
    name: 'Master Suite',
    image: '/images/space-bedroom.jpg',
    wallWidthCm: 300,
    defaultY: 35,
  },
  {
    id: 'penthouse',
    name: 'Penthouse Gallery',
    image: '/images/hero-penthouse-brass.jpg',
    wallWidthCm: 340,
    defaultY: 40,
  },
];

export function WallPreview({ product, shapeId, finish, widthMm, heightMm }: Props) {
  const [selectedEnvId, setSelectedEnvId] = useState<string>('salon');
  const [customWallSrc, setCustomWallSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [showHuman, setShowHuman] = useState(true);
  const [guideMode, setGuideMode] = useState<'auto' | 'always' | 'off'>('auto');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [justResized, setJustResized] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const startInteracting = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsInteracting(true);
  };

  const stopInteracting = (delayMs = 350) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, delayMs);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const isSculpture = product?.category === 'sculptures' || product?.category === 'showpieces';

  const activeEnv = useMemo(() => {
    return ROOM_ENVIRONMENTS.find(e => e.id === selectedEnvId) || ROOM_ENVIRONMENTS[0];
  }, [selectedEnvId]);

  // Position on wall (sculptures placed lower near table/plinth by default)
  const [pos, setPos] = useState(() => ({
    x: 50,
    y: isSculpture ? 48 : activeEnv.defaultY,
  }));

  // Trigger brief highlight animation whenever dimensions change
  useEffect(() => {
    setJustResized(true);
    const timer = setTimeout(() => setJustResized(false), 1200);
    return () => clearTimeout(timer);
  }, [widthMm, heightMm]);

  const currentWallSrc = customWallSrc || activeEnv.image;
  const currentWallWidthCm = activeEnv.wallWidthCm;

  // Handle custom file upload
  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setCustomWallSrc(url);
    setSelectedEnvId('custom');
  };

  // Base catalog dimensions (from product specification)
  const baseWidthCm = Number((widthMm / 10).toFixed(1));
  const baseHeightCm = Number((heightMm / 10).toFixed(1));
  const baseWidthIn = (widthMm / 25.4).toFixed(1);
  const baseHeightIn = (heightMm / 25.4).toFixed(1);
  const baseWidthFt = (widthMm / 304.8).toFixed(1);
  const baseHeightFt = (heightMm / 304.8).toFixed(1);

  // Exact live calibrated dimensions (updates in real time as user adjusts calibration slider)
  const isTrueScale = Math.abs(scale - 1) < 0.005;
  const calWidthMm = widthMm * scale;
  const calHeightMm = heightMm * scale;

  const calWidthCm = (calWidthMm / 10).toFixed(1).replace(/\.0$/, '');
  const calHeightCm = (calHeightMm / 10).toFixed(1).replace(/\.0$/, '');
  const calWidthIn = (calWidthMm / 25.4).toFixed(1);
  const calHeightIn = (calHeightMm / 25.4).toFixed(1);
  const calWidthFt = (calWidthMm / 304.8).toFixed(1);
  const calHeightFt = (calHeightMm / 304.8).toFixed(1);

  // Dimension guide flip logic so brackets never clip on boundary edges
  const showDimensionsOnLeft = pos.x > 68;
  const showDimensionsOnTop = pos.y > 72;

  // Visibility logic: Auto-hides after moving, shows while dragging/calibrating or hovering
  const showGuides = guideMode !== 'off';
  const guidesVisible = guideMode === 'always' || (guideMode === 'auto' && (isInteracting || justResized));

  // Accurate true-to-scale calculation that visibly scales on size change
  // Container viewport aspect ratio = 16:10 = 1.6
  // Room width represented = currentWallWidthCm (e.g. 320cm)
  // Room height represented = currentWallWidthCm / 1.6 (e.g. 200cm)
  const { pieceWidthPct, pieceHeightPct } = useMemo(() => {
    const roomHeightCm = currentWallWidthCm / 1.6;

    if (isSculpture) {
      // For freestanding sculptures (e.g. Bronze Figure 48cm vs 72cm):
      // Height is calibrated against the room height with a 1.35x visual prominence multiplier
      const hPct = ((baseHeightCm / roomHeightCm) * 100 * 1.35) * scale;

      // Real physical aspect ratio (widthMm / heightMm)
      const physicalAspect = Math.max(widthMm / heightMm, 0.2);

      // In 16:10 container, to keep width:height equal to physicalAspect in screen pixels:
      // (wPct * containerWidth) / (hPct * containerHeight) = physicalAspect
      // Since containerWidth / containerHeight = 1.6:
      // wPct = (hPct * physicalAspect) / 1.6
      const wPct = (hPct * physicalAspect) / 1.6;

      return {
        pieceWidthPct: Math.min(Math.max(wPct, 3.5), 65),
        pieceHeightPct: Math.min(Math.max(hPct, 12), 85),
      };
    } else {
      // For wall-mounted art, frames, and geometric canvases:
      // Width as direct percentage of room wall width
      const wPct = ((baseWidthCm / currentWallWidthCm) * 100) * scale;
      // Height as direct percentage of room height
      const hPct = ((baseHeightCm / roomHeightCm) * 100) * scale;

      return {
        pieceWidthPct: Math.min(Math.max(wPct, 10), 90),
        pieceHeightPct: Math.min(Math.max(hPct, 10), 88),
      };
    }
  }, [isSculpture, baseWidthCm, baseHeightCm, widthMm, heightMm, currentWallWidthCm, scale]);

  // Dragging interaction
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startInteracting();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    startInteracting();
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 8), 92);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 10), 85);
    setPos({ x, y });
  };

  const onPointerUp = () => {
    dragging.current = false;
    stopInteracting(300); // Gone right after moving!
  };

  const resetPosition = () => {
    setPos({ x: 50, y: isSculpture ? 48 : activeEnv.defaultY });
    setScale(1);
    startInteracting();
    stopInteracting(1000);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans">
      {/* Top Environment Selector & Scale Spec Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Environment selector pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          {ROOM_ENVIRONMENTS.map(env => (
            <button
              key={env.id}
              type="button"
              onClick={() => {
                setSelectedEnvId(env.id);
                setCustomWallSrc(null);
                setPos(p => ({ ...p, y: isSculpture ? 48 : env.defaultY }));
              }}
              className={cn(
                'px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-sans font-semibold rounded-[2px] transition-all cursor-pointer border',
                selectedEnvId === env.id && !customWallSrc
                  ? 'bg-burgundy text-white border-burgundy shadow-2xs'
                  : 'bg-white text-dark-brown/70 border-[#EBE4D6] hover:bg-[#FAF8F5] hover:text-dark-brown'
              )}
            >
              {env.name}
            </button>
          ))}

          {/* Upload Custom Wall Option */}
          <label className={cn(
            'px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-sans font-semibold rounded-[2px] transition-all cursor-pointer border flex items-center gap-1',
            customWallSrc
              ? 'bg-burgundy text-white border-burgundy shadow-2xs'
              : 'bg-white text-dark-brown/70 border-[#EBE4D6] hover:bg-[#FAF8F5] hover:text-dark-brown'
          )}>
            <Upload className="w-3 h-3 text-gold" />
            <span>{customWallSrc ? 'Custom Wall' : 'Upload Wall'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Real Dimensions Callout with Size Change Pulse */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-[2px] text-[10px] text-dark-brown font-mono self-start sm:self-auto shadow-2xs transition-all duration-300",
          justResized
            ? "border-burgundy ring-2 ring-burgundy/25 bg-[#FAF8F5] scale-105"
            : !isTrueScale
              ? "border-burgundy/40 bg-[#FAF8F5]"
              : "border-[#EBE4D6]"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
            justResized ? "bg-burgundy animate-ping" : isTrueScale ? "bg-emerald-600" : "bg-amber-500"
          )} />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-dark-brown font-sans">
              {calWidthCm} × {calHeightCm} cm
            </span>
            <span className="text-dark-brown/60">
              ({calWidthIn}″ × {calHeightIn}″ · {calWidthFt} × {calHeightFt} ft)
            </span>
            {isTrueScale ? (
              <span className="text-[9px] uppercase tracking-wider font-sans font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-[1px] border border-emerald-200">
                1:1 True Scale
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-sans font-semibold text-burgundy bg-burgundy/10 px-1.5 py-0.2 rounded-[1px] border border-burgundy/20">
                <span>Calibrated {Math.round(scale * 100)}%</span>
                <span className="text-dark-brown/50 font-normal">
                  (Base: {baseWidthCm} × {baseHeightCm} cm)
                </span>
              </span>
            )}
          </div>
          {justResized && (
            <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider font-sans font-bold text-burgundy ml-1">
              <Check className="w-2.5 h-2.5 text-burgundy" />
              Scale Updated
            </span>
          )}
        </div>
      </div>

      {/* Main Room Scale Stage (Always visible and full width) */}
      <div
        ref={containerRef}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[2px] overflow-hidden border border-[#EBE4D6] bg-[#222] select-none shadow-sm cursor-crosshair"
        onPointerMove={onPointerMove}
      >
        {/* Room Background Image */}
        <img
          src={currentWallSrc}
          alt={activeEnv.name}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Subtle Ambient Lighting Gradient Over Room */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Human Silhouette Scale Reference (175cm tall) */}
        {showHuman && (
          <div
            className="absolute bottom-0 right-[8%] sm:right-[12%] pointer-events-none select-none flex flex-col items-center opacity-85 z-10 transition-opacity"
            style={{ height: '72%' }} // 175cm / 240cm wall height ≈ 72%
          >
            {/* SVG Minimalist Architectural Human Figure */}
            <svg
              viewBox="0 0 100 300"
              className="h-full w-auto fill-dark-brown/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            >
              {/* Head */}
              <circle cx="50" cy="22" r="14" />
              {/* Torso & Neck */}
              <path d="M42 40 L58 40 L65 110 L50 115 L35 110 Z" />
              {/* Arms */}
              <path d="M35 44 L20 120 L28 122 L40 50 Z" />
              <path d="M65 44 L80 120 L72 122 L60 50 Z" />
              {/* Lower Body & Legs */}
              <path d="M37 115 L35 270 L48 270 L48 120 Z" />
              <path d="M63 115 L65 270 L52 270 L52 120 Z" />
              {/* Shoes/Feet */}
              <ellipse cx="40" cy="275" rx="10" ry="4" />
              <ellipse cx="60" cy="275" rx="10" ry="4" />
            </svg>
            <div className="bg-black/75 backdrop-blur-xs text-white text-[8px] font-mono px-1.5 py-0.5 rounded-[1px] mt-1 whitespace-nowrap shadow-xs">
              1.75 m (5′9″)
            </div>
          </div>
        )}

        {/* The Artwork Rendered at True Proportion with Smooth Dynamic Transition on Size Change */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none z-20 group"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pieceWidthPct}%`,
            height: `${pieceHeightPct}%`,
            transition: isSliding
              ? 'none'
              : 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          title="Drag to reposition on the wall"
        >
          {/* Piece Rendering */}
          {product?.imageUrl ? (
            <div className={cn(
              "relative w-full h-full rounded-[1px] overflow-hidden select-none transition-all duration-300",
              isSculpture
                ? "drop-shadow-[0_25px_30px_rgba(0,0,0,0.55)]"
                : "border-[2px] border-[#3B342C]/40 shadow-[0_22px_36px_rgba(0,0,0,0.65),0_4px_10px_rgba(0,0,0,0.35)]"
            )}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className={cn(
                  "w-full h-full pointer-events-none select-none transition-all duration-300",
                  isSculpture ? "object-contain" : "object-cover"
                )}
                draggable={false}
              />
              {/* Subtle glass reflection effect on canvas */}
              {!isSculpture && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40" />
              )}
            </div>
          ) : (
            <div className="relative w-full h-full select-none drop-shadow-[0_22px_32px_rgba(0,0,0,0.5)]">
              <ShapeThumb shapeId={shapeId} finish={finish} className="w-full h-full pointer-events-none" />
            </div>
          )}

          {/* Architectural Dimension Lines: Auto-hides after moving, visible while dragging/calibrating/hovering */}
          {showGuides && (
            <>
              {/* Vertical Height Dimension Bracket (Beside artwork) */}
              <div
                className={cn(
                  "absolute top-0 bottom-0 flex items-center pointer-events-none z-30 transition-all duration-300",
                  showDimensionsOnLeft ? "-left-5 sm:-left-7" : "-right-5 sm:-right-7",
                  guidesVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <div className="relative h-full flex items-center">
                  {/* Top tick cap */}
                  <div className={cn(
                    "absolute top-0 w-2.5 h-[1.5px] bg-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
                    showDimensionsOnLeft ? "right-0" : "left-0"
                  )} />
                  {/* Vertical guideline */}
                  <div className="h-full w-[1.5px] bg-gold/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
                  {/* Bottom tick cap */}
                  <div className={cn(
                    "absolute bottom-0 w-2.5 h-[1.5px] bg-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
                    showDimensionsOnLeft ? "right-0" : "left-0"
                  )} />

                  {/* Height Callout Pill */}
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md text-white border border-gold/40 px-2 py-1 rounded-[2px] shadow-2xl flex flex-col pointer-events-none transition-all",
                      showDimensionsOnLeft ? "right-3.5 items-end text-right" : "left-3.5 items-start text-left"
                    )}
                  >
                    <span className="font-mono text-[9px] sm:text-[11px] font-bold text-white flex items-center gap-1 leading-none">
                      <span>↕</span>
                      <span>{calHeightCm} cm</span>
                    </span>
                    <span className="font-sans text-[7px] sm:text-[8px] text-white/70 leading-tight mt-0.5">
                      {calHeightIn}″ ({calHeightFt} ft)
                    </span>
                    {!isTrueScale ? (
                      <span className="font-sans text-[7px] uppercase tracking-wider text-gold font-bold leading-tight mt-0.5">
                        {Math.round(scale * 100)}% Cal.
                      </span>
                    ) : (
                      <span className="font-sans text-[7px] uppercase tracking-wider text-emerald-400 font-bold leading-tight mt-0.5">
                        1:1 True Scale
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Horizontal Width Dimension Bracket (Below or Above artwork) */}
              <div
                className={cn(
                  "absolute left-0 right-0 flex justify-center pointer-events-none z-30 transition-all duration-300",
                  showDimensionsOnTop ? "-top-5 sm:-top-7" : "-bottom-5 sm:-bottom-7",
                  guidesVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <div className="relative w-full flex justify-center">
                  {/* Left tick cap */}
                  <div className={cn(
                    "absolute left-0 h-2 w-[1.5px] bg-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
                    showDimensionsOnTop ? "bottom-0" : "top-0"
                  )} />
                  {/* Horizontal guideline */}
                  <div className={cn(
                    "w-full h-[1.5px] bg-gold/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
                    showDimensionsOnTop ? "mb-0" : "mt-0"
                  )} />
                  {/* Right tick cap */}
                  <div className={cn(
                    "absolute right-0 h-2 w-[1.5px] bg-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
                    showDimensionsOnTop ? "bottom-0" : "top-0"
                  )} />

                  {/* Width Callout Pill */}
                  <div
                    className={cn(
                      "absolute whitespace-nowrap bg-black/90 backdrop-blur-md text-white border border-gold/40 px-2 py-0.5 rounded-[2px] shadow-2xl flex items-center gap-1.5 pointer-events-none transition-all",
                      showDimensionsOnTop ? "bottom-2.5" : "top-2.5"
                    )}
                  >
                    <span className="font-mono text-[9px] sm:text-[11px] font-bold text-white leading-none">
                      ↔ {calWidthCm} cm
                    </span>
                    <span className="font-sans text-[7px] sm:text-[8px] text-white/70 leading-none">
                      ({calWidthIn}″)
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Dynamic Scale & Dimension Header Badge: Auto-hides after moving */}
          {showGuides && (
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-30 transition-all duration-300",
                showDimensionsOnTop ? "-top-10 sm:-top-11" : "-top-7 sm:-top-8",
                guidesVisible ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
              )}
            >
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[8px] sm:text-[9px] font-mono shadow-md border backdrop-blur-md transition-colors",
                isTrueScale
                  ? "bg-black/85 text-white border-white/20"
                  : "bg-burgundy text-white border-burgundy ring-1 ring-gold/40"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isTrueScale ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                )} />
                <span className="font-bold text-white">{calWidthCm} × {calHeightCm} cm</span>
                <span className="text-white/70">({calWidthIn}″ × {calHeightIn}″)</span>
                <span className={cn(
                  "font-sans uppercase tracking-wider text-[7px] sm:text-[8px] px-1 py-0.2 rounded-[1px] font-bold ml-0.5",
                  isTrueScale ? "bg-emerald-500/20 text-emerald-300" : "bg-white/20 text-gold"
                )}>
                  {isTrueScale ? '1:1 True Scale' : `${Math.round(scale * 100)}% Calibrated`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Guide Cue on Bottom Left */}
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-[1px] text-[9px] text-white/90 font-sans">
          <Move className="w-3 h-3 text-gold shrink-0" />
          <span>Click & Drag artwork anywhere in the room</span>
        </div>
      </div>

      {/* Bottom Visualizer Controls Bar */}
      <div className="flex flex-col gap-2.5 p-2.5 sm:p-3 bg-white border border-[#EBE4D6] rounded-[2px] text-xs overflow-hidden w-full max-w-full box-border">
        {/* ROW 1: Calibration Slider & Exact Dimensions Display */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          {/* Calibrate Slider & Percentage */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-dark-brown/70 font-sans flex items-center gap-1 shrink-0">
              <ZoomIn className="w-3.5 h-3.5 text-gold" />
              <span>Calibrate:</span>
              <strong className="font-mono text-dark-brown text-[11px] min-w-[32px]">{Math.round(scale * 100)}%</strong>
            </span>
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.01}
              value={scale}
              onMouseDown={() => { setIsSliding(true); startInteracting(); }}
              onMouseUp={() => { setIsSliding(false); stopInteracting(500); }}
              onTouchStart={() => { setIsSliding(true); startInteracting(); }}
              onTouchEnd={() => { setIsSliding(false); stopInteracting(500); }}
              onChange={e => {
                setScale(Number(e.target.value));
                startInteracting();
                stopInteracting(700);
              }}
              className="w-20 sm:w-28 accent-burgundy cursor-pointer"
              title="Calibrate room visual scale (70% - 140%)"
            />
          </div>

          {/* Exact Live Calibrated Dimensions & Snap to True Scale */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] bg-[#FAF8F5] border border-[#EBE4D6] text-[10px] font-mono shadow-2xs whitespace-nowrap">
              <span className="text-dark-brown/60 text-[9px] uppercase font-sans font-semibold">
                {!isTrueScale ? 'Cal:' : 'Size:'}
              </span>
              <strong className="font-bold text-dark-brown">{calWidthCm} × {calHeightCm} cm</strong>
              <span className="text-dark-brown/50 text-[9px]">({calWidthIn}″ × {calHeightIn}″)</span>
            </div>

            {/* True Scale Button or Active Badge */}
            {!isTrueScale ? (
              <button
                type="button"
                onClick={() => {
                  setScale(1);
                  startInteracting();
                  stopInteracting(800);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-[9px] uppercase tracking-[0.14em] font-sans font-bold bg-burgundy text-white hover:bg-burgundy/90 active:scale-98 transition shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
                title={`Reset calibration to True Scale 1:1 (${baseWidthCm} × ${baseHeightCm} cm)`}
              >
                <RotateCcw className="w-2.5 h-2.5 text-gold" />
                <span>True Scale (1:1)</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-[9px] uppercase tracking-wider font-sans font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 whitespace-nowrap shadow-2xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>1:1 True Scale</span>
              </span>
            )}
          </div>
        </div>

        {/* ROW 2: Staging Tools & Quick Scale Presets (Clean horizontal strip) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#EBE4D6]">
          {/* Visual Guides & Staging Toggles */}
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Dimension Guides Toggle */}
            <button
              type="button"
              onClick={() => {
                setGuideMode(prev => prev === 'auto' ? 'always' : prev === 'always' ? 'off' : 'auto');
              }}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] uppercase tracking-[0.14em] font-sans font-semibold transition-all cursor-pointer border whitespace-nowrap",
                guideMode !== 'off'
                  ? "bg-burgundy/10 text-burgundy border-burgundy shadow-2xs"
                  : "bg-[#FAF8F5] text-dark-brown/60 border-[#EBE4D6] hover:bg-white hover:text-dark-brown"
              )}
              title="Toggle architectural measurement lines (Auto on move, Always on, or Off)"
            >
              <Ruler className="w-3 h-3" />
              <span>
                {guideMode === 'auto' ? 'Guides: On Move' : guideMode === 'always' ? 'Guides: Always On' : 'Guides: Off'}
              </span>
            </button>

            {/* Human Scale Silhouette Toggle */}
            <button
              type="button"
              onClick={() => setShowHuman(prev => !prev)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] uppercase tracking-[0.14em] font-sans font-semibold transition-all cursor-pointer border whitespace-nowrap",
                showHuman
                  ? "bg-burgundy/10 text-burgundy border-burgundy shadow-2xs"
                  : "bg-[#FAF8F5] text-dark-brown/60 border-[#EBE4D6] hover:bg-white hover:text-dark-brown"
              )}
            >
              <User className="w-3 h-3" />
              <span>{showHuman ? 'Human: 1.75m' : 'Human Scale'}</span>
            </button>

            {/* Center / Reset Artwork Position */}
            <button
              type="button"
              onClick={resetPosition}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] uppercase tracking-[0.14em] font-sans text-dark-brown/60 hover:text-dark-brown border border-[#EBE4D6] bg-[#FAF8F5] hover:bg-white transition cursor-pointer whitespace-nowrap"
              title="Recenter artwork position in room"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Center</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1 self-start sm:self-auto">
            <span className="text-[9px] uppercase tracking-wider text-dark-brown/50 font-sans mr-0.5">Presets:</span>
            {[
              { val: 0.85, label: '85%' },
              { val: 1.0, label: '100% True Scale' },
              { val: 1.2, label: '120%' },
              { val: 1.4, label: '140%' },
            ].map(preset => (
              <button
                key={preset.val}
                type="button"
                onClick={() => {
                  setScale(preset.val);
                  startInteracting();
                  stopInteracting(800);
                }}
                className={cn(
                  "px-1.5 py-0.5 text-[9px] font-mono rounded-[1px] transition border cursor-pointer whitespace-nowrap",
                  Math.abs(scale - preset.val) < 0.01
                    ? "bg-burgundy text-white border-burgundy font-bold shadow-2xs"
                    : "bg-[#FAF8F5] text-dark-brown/70 border-[#EBE4D6] hover:bg-white hover:text-dark-brown"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
