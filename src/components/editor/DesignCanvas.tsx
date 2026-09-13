/**
 * Interactive 2D Vector CAD/CAM Drafting Studio Canvas
 * Native SVG DOM implementation replacing raster Konva
 * Supports 1:1 metric millimetre rendering, interactive transform handles,
 * pan/zoom, metric grid, and Realistic Metal vs CNC Toolpath modes.
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useVectorDocument } from '@/hooks/useVectorDocument';
import { useTheme } from 'next-themes';
import { 
  ZoomIn, ZoomOut, Maximize2, Grid3X3, Sparkles, Cpu, 
  Move, RotateCw, CheckCircle2, AlertTriangle, Crosshair
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AnyFeatureLayer, MetalSubstrate } from '@/lib/cadEngineTypes';

// Metal gradients & finishes for realistic mode
const METAL_SHADERS: Record<MetalSubstrate, {
  gradientId: string;
  stops: { offset: string; color: string; opacity?: number }[];
  border: string;
  specular: string;
}> = {
  mild_steel: {
    gradientId: 'shader-mild-steel',
    stops: [
      { offset: '0%', color: '#3f3f46' },
      { offset: '30%', color: '#71717a' },
      { offset: '60%', color: '#52525b' },
      { offset: '100%', color: '#27272a' },
    ],
    border: '#18181b',
    specular: '#a1a1aa',
  },
  stainless_304: {
    gradientId: 'shader-stainless',
    stops: [
      { offset: '0%', color: '#64748b' },
      { offset: '25%', color: '#cbd5e1' },
      { offset: '50%', color: '#94a3b8' },
      { offset: '75%', color: '#f1f5f9' },
      { offset: '100%', color: '#475569' },
    ],
    border: '#334155',
    specular: '#ffffff',
  },
  aluminum_5052: {
    gradientId: 'shader-aluminum',
    stops: [
      { offset: '0%', color: '#94a3b8' },
      { offset: '35%', color: '#e2e8f0' },
      { offset: '70%', color: '#cbd5e1' },
      { offset: '100%', color: '#64748b' },
    ],
    border: '#475569',
    specular: '#ffffff',
  },
  brass_cz108: {
    gradientId: 'shader-brass',
    stops: [
      { offset: '0%', color: '#854d0e' },
      { offset: '30%', color: '#fef08a' },
      { offset: '65%', color: '#ca8a04' },
      { offset: '100%', color: '#713f12' },
    ],
    border: '#583108',
    specular: '#fef9c3',
  },
  copper_c101: {
    gradientId: 'shader-copper',
    stops: [
      { offset: '0%', color: '#9a3412' },
      { offset: '25%', color: '#fdba74' },
      { offset: '60%', color: '#ea580c' },
      { offset: '100%', color: '#7c2d12' },
    ],
    border: '#601e06',
    specular: '#ffedd5',
  },
  corten_weathering: {
    gradientId: 'shader-corten',
    stops: [
      { offset: '0%', color: '#451a03' },
      { offset: '35%', color: '#b45309' },
      { offset: '70%', color: '#7c2d12' },
      { offset: '100%', color: '#2d0f02' },
    ],
    border: '#1c0701',
    specular: '#d97706',
  },
};

export function DesignCanvas() {
  const { 
    doc, 
    analytics, 
    selectedLayerId, 
    selectLayer, 
    updateTransform,
    beginTransformGesture,
    updateTransformLive,
    commitTransform, 
    removeLayer 
  } = useVectorDocument();
  
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Viewport transformation (zoom & pan)
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState<'realistic' | 'cam_toolpath'>('realistic');

  // Dragging & Interaction State
  const [dragState, setDragState] = useState<{
    mode: 'pan' | 'move_layer' | 'rotate_layer';
    startX: number;
    startY: number;
    layerInitialX?: number;
    layerInitialY?: number;
    layerInitialRot?: number;
    layerCenterMm?: { x: number; y: number };
  } | null>(null);

  const selectedLayer = useMemo(() => {
    return doc.layers.find(l => l.id === selectedLayerId);
  }, [doc.layers, selectedLayerId]);

  // Auto-fit to viewport on mount or document boundary change
  const autoFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    const padding = 80;
    const availableW = clientWidth - padding * 2;
    const availableH = clientHeight - padding * 2;

    const scaleX = availableW / doc.boundary.widthMm;
    const scaleY = availableH / doc.boundary.heightMm;
    const initialScale = Math.min(scaleX, scaleY, 2.5);

    setZoom(initialScale);
    // Center in viewport
    const offsetX = (clientWidth - doc.boundary.widthMm * initialScale) / 2;
    const offsetY = (clientHeight - doc.boundary.heightMm * initialScale) / 2;
    setPan({ x: offsetX, y: offsetY });
  }, [doc.boundary.widthMm, doc.boundary.heightMm]);

  useEffect(() => {
    autoFit();
  }, [autoFit]);

  // Handle Zoom via Mouse Wheel with active non-passive listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom((prevZoom) => {
        const newZoom = Math.max(0.15, Math.min(5.0, prevZoom * zoomFactor));
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom),
          y: mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom),
        }));

        return newZoom;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Start Panning or Layer Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Space key held down pans the canvas
    if (e.button === 1 || e.altKey || (e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-bg')) {
      if (e.button === 0 && (e.target as HTMLElement).id === 'canvas-bg') {
        selectLayer(null);
      }
      setDragState({
        mode: 'pan',
        startX: e.clientX,
        startY: e.clientY,
      });
    }
  };

  // Layer Move MouseDown
  const handleLayerMouseDown = (e: React.MouseEvent, layer: AnyFeatureLayer) => {
    e.stopPropagation();
    selectLayer(layer.id);
    if (layer.locked) return;

    beginTransformGesture();
    setDragState({
      mode: 'move_layer',
      startX: e.clientX,
      startY: e.clientY,
      layerInitialX: layer.transform.xMm,
      layerInitialY: layer.transform.yMm,
    });
  };

  // Rotation Handle MouseDown
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLayer || selectedLayer.locked) return;

    beginTransformGesture();
    const layerCenterMm = getLayerCenter(selectedLayer);
    setDragState({
      mode: 'rotate_layer',
      startX: e.clientX,
      startY: e.clientY,
      layerInitialRot: selectedLayer.transform.rotationDeg || 0,
      layerCenterMm,
    });
  };

  // Global Pointer Movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;

    if (dragState.mode === 'pan') {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragState(prev => prev ? { ...prev, startX: e.clientX, startY: e.clientY } : null);
    } else if (dragState.mode === 'move_layer' && selectedLayer) {
      const dxMm = (e.clientX - dragState.startX) / zoom;
      const dyMm = (e.clientY - dragState.startY) / zoom;

      // 0.5mm snapping
      const rawX = (dragState.layerInitialX ?? 0) + dxMm;
      const rawY = (dragState.layerInitialY ?? 0) + dyMm;
      const snapX = Math.round(rawX * 2) / 2;
      const snapY = Math.round(rawY * 2) / 2;

      updateTransformLive(selectedLayer.id, { xMm: snapX, yMm: snapY });
    } else if (dragState.mode === 'rotate_layer' && selectedLayer && dragState.layerCenterMm) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerScreenX = pan.x + dragState.layerCenterMm.x * zoom;
      const centerScreenY = pan.y + dragState.layerCenterMm.y * zoom;

      const angleRad = Math.atan2(e.clientY - centerScreenY, e.clientX - centerScreenX);
      let angleDeg = (angleRad * 180) / Math.PI + 90; // Top is 0 deg
      if (angleDeg < 0) angleDeg += 360;

      // Snap to 15 degree increments if Shift is pressed
      if (e.shiftKey) {
        angleDeg = Math.round(angleDeg / 15) * 15;
      } else {
        angleDeg = Math.round(angleDeg);
      }

      updateTransformLive(selectedLayer.id, { rotationDeg: angleDeg });
    }
  };

  const handleMouseUp = () => {
    if (dragState?.mode === 'move_layer' || dragState?.mode === 'rotate_layer') {
      commitTransform();
    }
    setDragState(null);
  };

  // Keyboard Delete
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedLayerId && (e.key === 'Delete' || e.key === 'Backspace')) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        removeLayer(selectedLayerId);
        selectLayer(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedLayerId, removeLayer, selectLayer]);

  const activeShader = METAL_SHADERS[doc.material.substrate] || METAL_SHADERS.mild_steel;

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 min-w-0 h-full w-full overflow-hidden select-none bg-slate-950 cursor-default"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full absolute inset-0 pointer-events-auto"
        id="canvas-bg"
      >
        <defs>
          {/* 10mm Minor & 50mm Major Metric Grid */}
          <pattern
            id="minorGrid"
            width={10 * zoom}
            height={10 * zoom}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${10 * zoom} 0 L 0 0 0 ${10 * zoom}`}
              fill="none"
              stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
              strokeWidth="0.7"
            />
          </pattern>
          <pattern
            id="majorGrid"
            width={50 * zoom}
            height={50 * zoom}
            patternUnits="userSpaceOnUse"
          >
            <rect width={50 * zoom} height={50 * zoom} fill="url(#minorGrid)" />
            <path
              d={`M ${50 * zoom} 0 L 0 0 0 ${50 * zoom}`}
              fill="none"
              stroke={theme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.12)'}
              strokeWidth="1.2"
            />
          </pattern>

          {/* Realistic Metal Gradients */}
          {Object.entries(METAL_SHADERS).map(([key, shader]) => (
            <linearGradient
              key={key}
              id={shader.gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {shader.stops.map((s, idx) => (
                <stop
                  key={idx}
                  offset={s.offset}
                  stopColor={s.color}
                  stopOpacity={s.opacity ?? 1}
                />
              ))}
            </linearGradient>
          ))}

          {/* Soft Drop Shadow Filter for realistic sheet elevation */}
          <filter id="metal-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          {/* Beveled Edge Lighting Filter */}
          <filter id="metal-bevel">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="spec">
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="over" />
          </filter>
        </defs>

        {/* 1. Metric Background Grid */}
        {showGrid && (
          <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            fill="url(#majorGrid)" 
            className="pointer-events-none" 
          />
        )}

        {/* 2. Main CAD Viewport Group (Scaled & Panned) */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          
          {/* Workpiece Boundary Silhouette */}
          {viewMode === 'realistic' ? (
            <path
              d={doc.boundary.pathData}
              fill={`url(#${activeShader.gradientId})`}
              stroke={activeShader.border}
              strokeWidth="0.6"
              filter="url(#metal-shadow)"
              className="transition-colors duration-300"
            />
          ) : (
            // CAM Laser Mode: Clean Zinc Outer Boundary Toolpath
            <path
              d={doc.boundary.pathData}
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#38BDF8"
              strokeWidth="0.8"
              strokeDasharray="none"
            />
          )}

          {/* Layers: Mounting Holes, Typography, and Vector Paths */}
          {doc.layers.map(layer => {
            if (!layer.visible) return null;
            const isSelected = selectedLayerId === layer.id;

            return (
              <g
                key={layer.id}
                id={`layer-${layer.id}`}
                transform={`translate(${layer.transform.xMm}, ${layer.transform.yMm}) rotate(${layer.transform.rotationDeg || 0})`}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                className={cn(
                  "cursor-pointer transition-opacity",
                  layer.locked ? "cursor-not-allowed opacity-80" : "hover:opacity-90"
                )}
              >
                {/* 1. Mounting Hole Feature */}
                {layer.type === 'mounting_hole' && (
                  <g>
                    {viewMode === 'realistic' ? (
                      <>
                        {/* Cutout hole showing background */}
                        <circle
                          cx="0"
                          cy="0"
                          r={layer.diameterMm / 2}
                          fill="#090d16"
                          stroke="#18181b"
                          strokeWidth="0.4"
                        />
                        {/* Standoff Barrel Spacer Rim / Highlight */}
                        <circle
                          cx="0"
                          cy="0"
                          r={(layer.diameterMm / 2) + 2.5}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.25)"
                          strokeWidth="0.4"
                          strokeDasharray="1,1"
                        />
                      </>
                    ) : (
                      // CAM Laser Toolpath: Red pierce circle with center crosshair
                      <>
                        <circle
                          cx="0"
                          cy="0"
                          r={layer.diameterMm / 2}
                          fill="rgba(239, 68, 68, 0.2)"
                          stroke="#EF4444"
                          strokeWidth="0.5"
                        />
                        <line x1="-2" y1="0" x2="2" y2="0" stroke="#EF4444" strokeWidth="0.3" />
                        <line x1="0" y1="-2" x2="0" y2="2" stroke="#EF4444" strokeWidth="0.3" />
                      </>
                    )}
                  </g>
                )}

                {/* 2. Typography Stencil Feature */}
                {layer.type === 'typography' && layer.derivedPathData && (
                  <path
                    d={layer.derivedPathData}
                    fill={viewMode === 'realistic' ? '#090d16' : 'rgba(239, 68, 68, 0.25)'}
                    stroke={viewMode === 'realistic' ? '#18181b' : '#EF4444'}
                    strokeWidth={viewMode === 'realistic' ? '0.3' : '0.5'}
                  />
                )}

                {/* 3. Custom / Traced Vector Path Feature */}
                {layer.type === 'vector_path' && layer.pathData && (
                  <path
                    d={layer.pathData}
                    fill={
                      layer.camLayer === '2_VECTOR_SCORE' 
                        ? 'none' 
                        : (viewMode === 'realistic' ? '#090d16' : 'rgba(239, 68, 68, 0.2)')
                    }
                    stroke={
                      layer.camLayer === '2_VECTOR_SCORE' 
                        ? '#3B82F6' 
                        : (viewMode === 'realistic' ? '#18181b' : '#EF4444')
                    }
                    strokeWidth="0.5"
                    strokeDasharray={layer.camLayer === '2_VECTOR_SCORE' ? '2,1' : 'none'}
                  />
                )}
              </g>
            );
          })}

          {/* Interactive Bounding Box & Transform Handles for Selected Layer */}
          {selectedLayer && (
            <g
              transform={`translate(${selectedLayer.transform.xMm}, ${selectedLayer.transform.yMm}) rotate(${selectedLayer.transform.rotationDeg || 0})`}
              className="pointer-events-none"
            >
              {(() => {
                const b = getLayerBounds(selectedLayer);
                const handleSize = 6 / zoom; // Constant on-screen size
                const stalkLength = 18 / zoom;

                return (
                  <g className="pointer-events-auto">
                    {/* Dashed Selection Rectangle */}
                    <rect
                      x={b.minX}
                      y={b.minY}
                      width={b.width}
                      height={b.height}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth={1.2 / zoom}
                      strokeDasharray={`${3 / zoom},${3 / zoom}`}
                    />

                    {/* Rotation Handle & Connecting Stalk */}
                    <line
                      x1={b.minX + b.width / 2}
                      y1={b.minY}
                      x2={b.minX + b.width / 2}
                      y2={b.minY - stalkLength}
                      stroke="#38BDF8"
                      strokeWidth={1.2 / zoom}
                    />
                    <circle
                      cx={b.minX + b.width / 2}
                      cy={b.minY - stalkLength}
                      r={handleSize / 1.5}
                      fill="#38BDF8"
                      stroke="#FFFFFF"
                      strokeWidth={1 / zoom}
                      className="cursor-grab active:cursor-grabbing"
                      onMouseDown={handleRotateMouseDown}
                    />

                    {/* 4 Corner Resize / Anchor Points */}
                    <rect
                      x={b.minX - handleSize / 2}
                      y={b.minY - handleSize / 2}
                      width={handleSize}
                      height={handleSize}
                      fill="#FFFFFF"
                      stroke="#38BDF8"
                      strokeWidth={1 / zoom}
                    />
                    <rect
                      x={b.minX + b.width - handleSize / 2}
                      y={b.minY - handleSize / 2}
                      width={handleSize}
                      height={handleSize}
                      fill="#FFFFFF"
                      stroke="#38BDF8"
                      strokeWidth={1 / zoom}
                    />
                    <rect
                      x={b.minX - handleSize / 2}
                      y={b.minY + b.height - handleSize / 2}
                      width={handleSize}
                      height={handleSize}
                      fill="#FFFFFF"
                      stroke="#38BDF8"
                      strokeWidth={1 / zoom}
                    />
                    <rect
                      x={b.minX + b.width - handleSize / 2}
                      y={b.minY + b.height - handleSize / 2}
                      width={handleSize}
                      height={handleSize}
                      fill="#FFFFFF"
                      stroke="#38BDF8"
                      strokeWidth={1 / zoom}
                    />

                    {/* Position Tooltip Tag */}
                    <g transform={`translate(${b.minX}, ${b.minY + b.height + 4 / zoom})`}>
                      <rect
                        width={65 / zoom}
                        height={14 / zoom}
                        fill="rgba(15, 23, 42, 0.85)"
                        rx={2 / zoom}
                      />
                      <text
                        x={4 / zoom}
                        y={10 / zoom}
                        fill="#38BDF8"
                        fontSize={8 / zoom}
                        fontFamily="monospace"
                      >
                        {Math.round(selectedLayer.transform.xMm)}, {Math.round(selectedLayer.transform.yMm)} mm
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 3. Outer Millimeter Dimension Guides */}
          <g className="pointer-events-none opacity-40">
            {/* Bottom width dimension */}
            <line
              x1="0"
              y1={doc.boundary.heightMm + 6}
              x2={doc.boundary.widthMm}
              y2={doc.boundary.heightMm + 6}
              stroke="#94A3B8"
              strokeWidth="0.4"
            />
            <text
              x={doc.boundary.widthMm / 2}
              y={doc.boundary.heightMm + 12}
              fill="#94A3B8"
              fontSize="6"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {doc.boundary.widthMm} mm
            </text>

            {/* Right height dimension */}
            <line
              x1={doc.boundary.widthMm + 6}
              y1="0"
              x2={doc.boundary.widthMm + 6}
              y2={doc.boundary.heightMm}
              stroke="#94A3B8"
              strokeWidth="0.4"
            />
            <text
              x={doc.boundary.widthMm + 12}
              y={doc.boundary.heightMm / 2}
              fill="#94A3B8"
              fontSize="6"
              dominantBaseline="middle"
              fontFamily="monospace"
            >
              {doc.boundary.heightMm} mm
            </text>
          </g>
        </g>
      </svg>

      {/* Floating Canvas HUD Controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        {/* View Mode Toggle Pill */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5 shadow-xl">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('realistic')}
            className={cn(
              "h-7 text-xs px-2.5 gap-1.5 rounded-md",
              viewMode === 'realistic' ? "bg-primary text-primary-foreground font-semibold" : "text-slate-400 hover:text-white"
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>Realistic</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('cam_toolpath')}
            className={cn(
              "h-7 text-xs px-2.5 gap-1.5 rounded-md",
              viewMode === 'cam_toolpath' ? "bg-primary text-primary-foreground font-semibold" : "text-slate-400 hover:text-white"
            )}
          >
            <Cpu className="w-3 h-3" />
            <span>Laser CAM</span>
          </Button>
        </div>

        {/* Manufacturing Status Pill */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-mono font-medium border backdrop-blur-md shadow-xl",
          analytics.isValidated
            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
            : "bg-amber-950/80 border-amber-500/40 text-amber-400"
        )}>
          {analytics.isValidated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Laser Cut Ready</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{analytics.validationIssues?.length || 0} Warning(s)</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom Floating Viewport Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-xl">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowGrid(!showGrid)}
          className={cn("h-7 w-7", showGrid ? "text-primary" : "text-slate-400")}
          title="Toggle Metric Grid"
        >
          <Grid3X3 className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-slate-800 mx-0.5" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setZoom(prev => Math.max(0.15, prev * 0.85))}
          className="h-7 w-7 text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>

        <span className="text-xs font-mono text-slate-300 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setZoom(prev => Math.min(5.0, prev * 1.15))}
          className="h-7 w-7 text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-slate-800 mx-0.5" />

        <Button
          size="icon"
          variant="ghost"
          onClick={autoFit}
          className="h-7 w-7 text-slate-300 hover:text-white"
          title="Auto-Fit Workpiece"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Part Specifications Badge (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-400 shadow-lg">
        <span className="text-white font-medium">{doc.boundary.widthMm} × {doc.boundary.heightMm} mm</span>
        <span className="text-slate-600">|</span>
        <span>{doc.material.thicknessMm}mm {doc.material.substrate.replace(/_/g, ' ')}</span>
        <span className="text-slate-600">|</span>
        <span>{analytics.partWeightKg.toFixed(2)} kg</span>
      </div>
    </div>
  );
}

/**
 * Helper to compute bounding box of any layer type in local layer coordinates
 */
function getLayerBounds(layer: AnyFeatureLayer): { minX: number; minY: number; width: number; height: number } {
  if (layer.type === 'mounting_hole') {
    const r = layer.diameterMm / 2;
    return { minX: -r, minY: -r, width: layer.diameterMm, height: layer.diameterMm };
  } else if (layer.type === 'typography') {
    const w = (layer.fontSizeMm * (layer.rawText?.length || 1) * 0.7);
    const h = layer.fontSizeMm;
    return { minX: 0, minY: 0, width: w, height: h };
  } else if (layer.type === 'vector_path') {
    const bw = layer.boundsMm?.widthMm || 50;
    const bh = layer.boundsMm?.heightMm || 50;
    return { minX: 0, minY: 0, width: bw, height: bh };
  }
  return { minX: 0, minY: 0, width: 40, height: 40 };
}

/**
 * Helper to get center of layer in mm
 */
function getLayerCenter(layer: AnyFeatureLayer): { x: number; y: number } {
  const b = getLayerBounds(layer);
  return {
    x: layer.transform.xMm + b.minX + b.width / 2,
    y: layer.transform.yMm + b.minY + b.height / 2,
  };
}
