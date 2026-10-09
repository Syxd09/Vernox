/**
 * Industrial Atelier Vector Trace Studio Modal
 * Interactive vectorization workshop with real-time preview,
 * Normal Box Crop, Freehand Lasso Crop, 4x3 Collage Grid Presets,
 * Adaptive Sauvola vs Otsu thresholding, corner crispness tuning, and frame-stripping.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Spline,
  Crop,
  Check,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers,
  Pencil,
  RotateCcw,
  Square,
  Grid,
} from 'lucide-react';
import {
  ImageToVectorTracer,
  type TraceResult,
} from '@/lib/imageTracer';
import { cn } from '@/lib/utils';
import type { BoundingBox2D, Point2D } from '@/lib/cadEngineTypes';
import { toast } from 'sonner';

interface VectorTraceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  workpieceWidthMm: number;
  onApplyVector: (pathData: string, boundsMm: BoundingBox2D, name: string, userImagePreview?: string) => void;
}

export function VectorTraceModal({
  open,
  onOpenChange,
  imageFile,
  workpieceWidthMm,
  onApplyVector,
}: VectorTraceModalProps) {
  // Source Image state
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Cropping Mode: 'box' (normal rectangle) or 'lasso' (freehand drawing)
  const [cropMode, setCropMode] = useState<'box' | 'lasso'>('box');

  // Box Crop (normalized percentages 0..100)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 100,
    h: 100,
  });

  // Freehand Lasso Points (normalized percentages 0..100)
  const [lassoPoints, setLassoPoints] = useState<Point2D[]>([]);
  const [isDrawingLasso, setIsDrawingLasso] = useState(false);

  // Box dragging state
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const [dragAction, setDragAction] = useState<
    'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w' | 'draw_new' | null
  >(null);
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startCrop: typeof cropBox;
    containerRect: DOMRect | null;
  }>({
    mouseX: 0,
    mouseY: 0,
    startCrop: { x: 0, y: 0, w: 100, h: 100 },
    containerRect: null,
  });

  // Algorithm tuning parameters
  const [thresholdMode, setThresholdMode] = useState<'adaptive' | 'otsu' | 'manual'>('adaptive');
  const [manualThreshold, setManualThreshold] = useState(128);
  const [invert, setInvert] = useState(false);
  const [removeFrame, setRemoveFrame] = useState(true);
  const [cornerAngle, setCornerAngle] = useState(38);
  const [minArea, setMinArea] = useState(15);

  // Trace result
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image when file changes
  useEffect(() => {
    if (!imageFile || !open) return;
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.src = url;
    img.onerror = () => {
      setImgElement(null);
      toast.error('Corrupted or unsupported image file. Unable to decode artwork.');
      onOpenChange(false);
    };
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (w <= 0 || h <= 0) {
        toast.error('Image contains invalid dimensions.');
        onOpenChange(false);
        return;
      }
      if (w > 8192 || h > 8192) {
        toast.error(`Image dimensions (${w}×${h}px) exceed safe processing limit of 8192px.`);
        onOpenChange(false);
        return;
      }
      setImgElement(img);
      setNaturalWidth(w);
      setNaturalHeight(h);
      setCropBox({ x: 0, y: 0, w: 100, h: 100 });
      setLassoPoints([]);
    };
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile, open, onOpenChange]);

  // Main Vectorization Pipeline
  const runVectorization = useCallback(() => {
    if (!imgElement || naturalWidth <= 0 || naturalHeight <= 0) return;

    setIsProcessing(true);

    try {
      let renderW: number;
      let renderH: number;
      let pxX = 0;
      let pxY = 0;
      let pxW = naturalWidth;
      let pxH = naturalHeight;

      if (cropMode === 'lasso' && lassoPoints.length >= 4) {
        // Freehand Lasso Mode: Find bounding box of lasso
        let minX = 100, minY = 100, maxX = 0, maxY = 0;
        for (const p of lassoPoints) {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }

        // Add 2% padding
        minX = Math.max(0, minX - 2);
        minY = Math.max(0, minY - 2);
        maxX = Math.min(100, maxX + 2);
        maxY = Math.min(100, maxY + 2);

        pxX = Math.round((minX / 100) * naturalWidth);
        pxY = Math.round((minY / 100) * naturalHeight);
        pxW = Math.max(8, Math.round(((maxX - minX) / 100) * naturalWidth));
        pxH = Math.max(8, Math.round(((maxY - minY) / 100) * naturalHeight));
      } else {
        // Normal Box Crop Mode
        pxX = Math.round((cropBox.x / 100) * naturalWidth);
        pxY = Math.round((cropBox.y / 100) * naturalHeight);
        pxW = Math.max(8, Math.round((cropBox.w / 100) * naturalWidth));
        pxH = Math.max(8, Math.round((cropBox.h / 100) * naturalHeight));
      }

      // Max processing resolution
      const maxDim = 800;
      renderW = pxW;
      renderH = pxH;
      if (renderW > maxDim || renderH > maxDim) {
        if (renderW > renderH) {
          renderH = Math.round((renderH * maxDim) / renderW);
          renderW = maxDim;
        } else {
          renderW = Math.round((renderW * maxDim) / renderH);
          renderH = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = renderW;
      canvas.height = renderH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background with white (or black if inverted)
      ctx.fillStyle = invert ? '#000000' : '#FFFFFF';
      ctx.fillRect(0, 0, renderW, renderH);

      ctx.save();
      if (cropMode === 'lasso' && lassoPoints.length >= 4) {
        // Mask with the freehand lasso loop!
        ctx.beginPath();
        const scaleX = renderW / pxW;
        const scaleY = renderH / pxH;
        lassoPoints.forEach((p, idx) => {
          const ptX = ((p.x / 100) * naturalWidth - pxX) * scaleX;
          const ptY = ((p.y / 100) * naturalHeight - pxY) * scaleY;
          if (idx === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });
        ctx.closePath();
        ctx.clip(); // Strictly mask everything outside the freehand loop
      }

      // Draw cropped slice
      ctx.drawImage(imgElement, pxX, pxY, pxW, pxH, 0, 0, renderW, renderH);
      ctx.restore();

      const imgData = ctx.getImageData(0, 0, renderW, renderH);

      // Run Potrace-grade vectorization
      const result = ImageToVectorTracer.traceImage(imgData, {
        thresholdMode,
        threshold: manualThreshold,
        invert,
        removeFrame,
        cornerThresholdDeg: cornerAngle,
        minArea,
        targetWidthMm: Math.min(workpieceWidthMm * 0.7, 180),
      });

      setTraceResult(result);
    } catch (e) {
      console.error('Vectorization error', e);
    } finally {
      setIsProcessing(false);
    }
  }, [
    imgElement,
    naturalWidth,
    naturalHeight,
    cropMode,
    cropBox,
    lassoPoints,
    thresholdMode,
    manualThreshold,
    invert,
    removeFrame,
    cornerAngle,
    minArea,
    workpieceWidthMm,
  ]);

  // Debounced auto-run
  useEffect(() => {
    const timer = setTimeout(() => {
      runVectorization();
    }, 60);
    return () => clearTimeout(timer);
  }, [runVectorization]);

  // -------------------------------------------------------------
  // FREEHAND LASSO MOUSE INTERACTION
  // -------------------------------------------------------------
  const handleLassoMouseDown = (e: React.MouseEvent) => {
    if (cropMode !== 'lasso' || !cropContainerRef.current) return;
    e.preventDefault();
    const rect = cropContainerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setIsDrawingLasso(true);
    setLassoPoints([{ x: Math.round(xPct), y: Math.round(yPct) }]);
  };

  const handleLassoMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingLasso || cropMode !== 'lasso' || !cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setLassoPoints(prev => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(last.x - xPct, last.y - yPct) < 0.8) return prev;
      return [...prev, { x: Math.round(xPct * 10) / 10, y: Math.round(yPct * 10) / 10 }];
    });
  };

  const handleLassoMouseUp = () => {
    if (isDrawingLasso) {
      setIsDrawingLasso(false);
    }
  };

  // -------------------------------------------------------------
  // NORMAL RECTANGULAR BOX CROP INTERACTION
  // -------------------------------------------------------------
  const handleBoxMouseDown = (
    e: React.MouseEvent,
    action: typeof dragAction
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cropContainerRef.current) return;

    setDragAction(action);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startCrop: { ...cropBox },
      containerRect: cropContainerRef.current.getBoundingClientRect(),
    };
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (cropMode === 'lasso') {
      handleLassoMouseDown(e);
      return;
    }
    // Clicking outside box starts a NEW drag crop
    if (!cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setDragAction('draw_new');
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startCrop: { x: xPct, y: yPct, w: 0, h: 0 },
      containerRect: rect,
    };
    setCropBox({ x: Math.round(xPct), y: Math.round(yPct), w: 1, h: 1 });
  };

  useEffect(() => {
    if (!dragAction) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = dragStartRef.current.containerRect;
      if (!rect) return;
      const dxPct = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const dyPct = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;
      const start = dragStartRef.current.startCrop;

      if (dragAction === 'move') {
        const newX = Math.max(0, Math.min(100 - start.w, start.x + dxPct));
        const newY = Math.max(0, Math.min(100 - start.h, start.y + dyPct));
        setCropBox({ ...start, x: Math.round(newX), y: Math.round(newY) });
      } else if (dragAction === 'draw_new') {
        const curX = ((e.clientX - rect.left) / rect.width) * 100;
        const curY = ((e.clientY - rect.top) / rect.height) * 100;
        const minX = Math.max(0, Math.min(start.x, curX));
        const minY = Math.max(0, Math.min(start.y, curY));
        const maxX = Math.min(100, Math.max(start.x, curX));
        const maxY = Math.min(100, Math.max(start.y, curY));
        setCropBox({
          x: Math.round(minX),
          y: Math.round(minY),
          w: Math.max(5, Math.round(maxX - minX)),
          h: Math.max(5, Math.round(maxY - minY)),
        });
      } else if (dragAction === 'se') {
        const w = Math.max(5, Math.min(100 - start.x, start.w + dxPct));
        const h = Math.max(5, Math.min(100 - start.y, start.h + dyPct));
        setCropBox(prev => ({ ...prev, w: Math.round(w), h: Math.round(h) }));
      } else if (dragAction === 'nw') {
        const x = Math.max(0, Math.min(start.x + start.w - 5, start.x + dxPct));
        const y = Math.max(0, Math.min(start.y + start.h - 5, start.y + dyPct));
        setCropBox({
          x: Math.round(x),
          y: Math.round(y),
          w: Math.round(start.w - (x - start.x)),
          h: Math.round(start.h - (y - start.y)),
        });
      } else if (dragAction === 'ne') {
        const y = Math.max(0, Math.min(start.y + start.h - 5, start.y + dyPct));
        const w = Math.max(5, Math.min(100 - start.x, start.w + dxPct));
        setCropBox({
          x: start.x,
          y: Math.round(y),
          w: Math.round(w),
          h: Math.round(start.h - (y - start.y)),
        });
      } else if (dragAction === 'sw') {
        const x = Math.max(0, Math.min(start.x + start.w - 5, start.x + dxPct));
        const h = Math.max(5, Math.min(100 - start.y, start.h + dyPct));
        setCropBox({
          x: Math.round(x),
          y: start.y,
          w: Math.round(start.w - (x - start.x)),
          h: Math.round(h),
        });
      }
    };

    const handleMouseUp = () => {
      setDragAction(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragAction]);

  // -------------------------------------------------------------
  // 4x3 COLLAGE GRID PRESET TILES
  // -------------------------------------------------------------
  const applyTile = (row: number, col: number) => {
    setCropMode('box');
    const tileW = 100 / 4;
    const tileH = 100 / 3;
    setCropBox({
      x: Math.round(col * tileW),
      y: Math.round(row * tileH),
      w: Math.round(tileW),
      h: Math.round(tileH),
    });
  };

  const handleApply = () => {
    if (!traceResult || !traceResult.pathData) return;
    const name = imageFile?.name
      ? `Laser ${imageFile.name.replace(/\.[^/.]+$/, '')}`
      : 'Bespoke Laser Contour';

    // Capture optimized user reference artwork snapshot
    let userImagePreview: string | undefined = undefined;
    if (imgElement) {
      try {
        const offscreen = document.createElement('canvas');
        const maxDim = 800;
        let w = imgElement.naturalWidth || imgElement.width || 400;
        let h = imgElement.naturalHeight || imgElement.height || 400;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        offscreen.width = w;
        offscreen.height = h;
        const ctx = offscreen.getContext('2d');
        if (ctx) {
          ctx.drawImage(imgElement, 0, 0, w, h);
          userImagePreview = offscreen.toDataURL('image/jpeg', 0.82);
        }
      } catch {
        userImagePreview = imgElement.src;
      }
    }

    onApplyVector(traceResult.pathData, traceResult.boundsMm, name, userImagePreview);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[94vh] w-[95vw] sm:w-full flex flex-col p-0 overflow-hidden bg-card border-border">
        {/* Header */}
        <DialogHeader className="p-3.5 border-b border-border/80 bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-burgundy/10 border border-burgundy/25 flex items-center justify-center text-burgundy shadow-2xs">
                <Spline className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold tracking-wider uppercase font-brand text-dark-brown">
                  Atelier Vector Synthesizer & Crop Studio
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground">
                  Freehand Lasso or Normal Box Cropping with Potrace-grade Bezier curve fitting.
                </DialogDescription>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] gap-1 border-burgundy/30 text-burgundy">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero Balloons</span>
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] gap-1 border-border text-muted-foreground">
                <span>Closed Loop CAM</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Studio Workspace: 2-Column Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto md:overflow-hidden min-h-0">
          {/* Left Column: Source Image & Interactive Freehand/Box Cropping */}
          <div className="p-3.5 md:border-r border-b md:border-b-0 border-border/70 flex flex-col bg-muted/10 overflow-hidden">
            {/* Cropping Mode Switcher */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
              <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border bg-background shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCropMode('box')}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer",
                    cropMode === 'box'
                      ? "bg-burgundy text-cream shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Square className="w-3 h-3" />
                  <span>Normal Box Crop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCropMode('lasso')}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer",
                    cropMode === 'lasso'
                      ? "bg-burgundy text-cream shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Pencil className="w-3 h-3" />
                  <span>Freehand Lasso</span>
                </button>
              </div>

              {cropMode === 'lasso' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLassoPoints([])}
                  className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                  title="Clear Lasso to Redraw"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </Button>
              )}
            </div>

            {/* 4x3 Collage Grid Quick Tile Selector (Specially for sheet of 12 logos) */}
            <div className="mb-2 p-1.5 rounded-md border border-border/70 bg-background/60">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-1">
                <span className="flex items-center gap-1">
                  <Grid className="w-3 h-3 text-burgundy" />
                  <span>1-Click 4×3 Collage Tile Selector:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCropBox({ x: 0, y: 0, w: 100, h: 100 })}
                  className="underline hover:text-dark-brown cursor-pointer"
                >
                  Full Sheet
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { r: 0, c: 0, label: 'Logo 1' },
                  { r: 0, c: 1, label: 'Logo 2' },
                  { r: 0, c: 2, label: 'Logo 3' },
                  { r: 0, c: 3, label: 'Logo 4' },
                  { r: 1, c: 0, label: 'Logo 5' },
                  { r: 1, c: 1, label: 'Logo 6' },
                  { r: 1, c: 2, label: 'Logo 7' },
                  { r: 1, c: 3, label: 'Logo 8' },
                  { r: 2, c: 0, label: 'Logo 9' },
                  { r: 2, c: 1, label: 'Logo 10' },
                  { r: 2, c: 2, label: 'Logo 11' },
                  { r: 2, c: 3, label: 'Logo 12' },
                ].map(tile => (
                  <button
                    key={tile.label}
                    type="button"
                    onClick={() => applyTile(tile.r, tile.c)}
                    className="py-1 px-1 text-[10px] font-mono rounded border border-border/80 bg-background hover:bg-burgundy hover:text-cream hover:border-burgundy text-dark-brown transition-all text-center cursor-pointer shadow-2xs truncate"
                  >
                    {tile.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Image Viewport */}
            <div
              ref={cropContainerRef}
              onMouseDown={handleContainerMouseDown}
              onMouseMove={handleLassoMouseMove}
              onMouseUp={handleLassoMouseUp}
              className={cn(
                "relative flex-1 rounded-md border border-border/80 bg-stone-900/10 dark:bg-stone-950/40 overflow-hidden flex items-center justify-center select-none",
                cropMode === 'lasso' ? "cursor-crosshair" : "cursor-default"
              )}
            >
              {imgElement && (
                <div className="relative max-h-full max-w-full inline-block">
                  <img
                    src={imgElement.src}
                    alt="Source"
                    className="max-h-[300px] max-w-full object-contain pointer-events-none rounded"
                  />

                  {/* 1. NORMAL BOX CROP OVERLAY */}
                  {cropMode === 'box' && (
                    <>
                      {/* Darkened mask outside crop box */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to right, rgba(0,0,0,0.55) ${cropBox.x}%, transparent ${cropBox.x}%, transparent ${cropBox.x + cropBox.w}%, rgba(0,0,0,0.55) ${cropBox.x + cropBox.w}%)`,
                        }}
                      />

                      {/* Draggable & Resizable Crop Box */}
                      <div
                        onMouseDown={(e) => handleBoxMouseDown(e, 'move')}
                        className="absolute border-2 border-burgundy shadow-lg cursor-move transition-all group"
                        style={{
                          left: `${cropBox.x}%`,
                          top: `${cropBox.y}%`,
                          width: `${cropBox.w}%`,
                          height: `${cropBox.h}%`,
                          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                        }}
                      >
                        {/* 3x3 Rule of Thirds */}
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none border border-burgundy/40">
                          <div className="border-r border-b border-burgundy/25" />
                          <div className="border-r border-b border-burgundy/25" />
                          <div className="border-b border-burgundy/25" />
                          <div className="border-r border-b border-burgundy/25" />
                          <div className="border-r border-b border-burgundy/25" />
                          <div className="border-b border-burgundy/25" />
                          <div className="border-r border-b border-burgundy/25" />
                          <div className="border-r border-b border-burgundy/25" />
                          <div />
                        </div>

                        {/* 4 Corner Handles */}
                        <div
                          onMouseDown={(e) => handleBoxMouseDown(e, 'nw')}
                          className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-burgundy border-2 border-white rounded-full cursor-nwse-resize shadow-md"
                        />
                        <div
                          onMouseDown={(e) => handleBoxMouseDown(e, 'ne')}
                          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-burgundy border-2 border-white rounded-full cursor-nesw-resize shadow-md"
                        />
                        <div
                          onMouseDown={(e) => handleBoxMouseDown(e, 'sw')}
                          className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-burgundy border-2 border-white rounded-full cursor-nesw-resize shadow-md"
                        />
                        <div
                          onMouseDown={(e) => handleBoxMouseDown(e, 'se')}
                          className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-burgundy border-2 border-white rounded-full cursor-nwse-resize shadow-md"
                        />
                      </div>
                    </>
                  )}

                  {/* 2. FREEHAND LASSO OVERLAY */}
                  {cropMode === 'lasso' && lassoPoints.length > 1 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <polygon
                        points={lassoPoints.map(p => `${p.x}%,${p.y}%`).join(' ')}
                        fill="rgba(91, 38, 44, 0.25)"
                        stroke="#5B262C"
                        strokeWidth="2"
                        strokeDasharray="4,3"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-1.5">
              {cropMode === 'box'
                ? 'Drag corners/edges to crop, drag center to move, or click tile buttons.'
                : 'Click and drag freely around your logo to circle and isolate it.'}
            </p>
          </div>

          {/* Right Column: Live Vector Preview & Parameter Controls */}
          <div className="p-3.5 flex flex-col bg-background overflow-y-auto space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
              <div className="flex items-center gap-1.5 font-medium text-xs text-dark-brown">
                <Cpu className="w-3.5 h-3.5 text-burgundy" />
                <span>Live Laser Vector Preview</span>
              </div>
              {traceResult && (
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  {traceResult.contours.length} Loop(s) · {traceResult.nodeCount} Nodes
                </span>
              )}
            </div>

            {/* Live SVG Vector Rendering */}
            <div className="relative h-44 rounded-md border border-border bg-slate-950 flex items-center justify-center overflow-hidden p-2 shadow-inner">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-xs font-mono text-cream">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-burgundy" />
                    <span>Fitting closed Bezier loops...</span>
                  </div>
                </div>
              )}

              {traceResult && traceResult.pathData ? (
                <svg
                  viewBox={`${traceResult.boundsMm.minX} ${traceResult.boundsMm.minY} ${traceResult.boundsMm.widthMm} ${traceResult.boundsMm.heightMm}`}
                  className="w-full h-full max-h-40"
                  style={{ vectorEffect: 'non-scaling-stroke' }}
                >
                  <path
                    d={traceResult.pathData}
                    fill="rgba(248, 244, 231, 0.85)"
                    stroke="#EF4444"
                    strokeWidth="1.2"
                    fillRule="evenodd"
                  />
                </svg>
              ) : (
                <div className="text-xs text-slate-500 text-center font-mono">
                  No vector paths detected in selection.
                </div>
              )}

              {traceResult && (
                <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-[9px] font-mono text-slate-300">
                  {Math.round(traceResult.boundsMm.widthMm)} × {Math.round(traceResult.boundsMm.heightMm)} mm
                </div>
              )}
            </div>

            {/* Control Sliders & Settings */}
            <div className="space-y-2.5 pt-1">
              {/* 1. Threshold Binarization Mode */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <Label className="text-[11px] font-semibold text-dark-brown">Binarization Strategy</Label>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {thresholdMode}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg border border-border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setThresholdMode('adaptive')}
                    className={cn(
                      "py-1 text-[11px] font-medium rounded transition-all cursor-pointer",
                      thresholdMode === 'adaptive'
                        ? "bg-burgundy text-cream shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Sauvola Local Window - Best for collages, textures, and mixed backgrounds"
                  >
                    Adaptive
                  </button>
                  <button
                    type="button"
                    onClick={() => setThresholdMode('otsu')}
                    className={cn(
                      "py-1 text-[11px] font-medium rounded transition-all cursor-pointer",
                      thresholdMode === 'otsu'
                        ? "bg-burgundy text-cream shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Global Otsu Optimal Split"
                  >
                    Otsu (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setThresholdMode('manual')}
                    className={cn(
                      "py-1 text-[11px] font-medium rounded transition-all cursor-pointer",
                      thresholdMode === 'manual'
                        ? "bg-burgundy text-cream shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Manual Threshold Slider"
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* Manual Threshold Slider */}
              {thresholdMode === 'manual' && (
                <div className="space-y-1 p-2 rounded border border-border/70 bg-muted/20">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Cutoff Luminance</span>
                    <span className="font-mono font-medium">{manualThreshold} / 255</span>
                  </div>
                  <Slider
                    value={[manualThreshold]}
                    min={20}
                    max={235}
                    step={1}
                    onValueChange={([val]) => setManualThreshold(val)}
                  />
                </div>
              )}

              {/* 2. Invert & Frame Removal Toggles */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/70">
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold text-dark-brown">Invert Polarity</Label>
                    <p className="text-[9px] text-muted-foreground">
                      {invert ? 'Light on Dark' : 'Dark on Light'}
                    </p>
                  </div>
                  <Switch checked={invert} onCheckedChange={setInvert} />
                </div>

                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/70">
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold text-dark-brown">Strip Outer Frame</Label>
                    <p className="text-[9px] text-muted-foreground">
                      {removeFrame ? 'Border Removed' : 'Keep Border'}
                    </p>
                  </div>
                  <Switch checked={removeFrame} onCheckedChange={setRemoveFrame} />
                </div>
              </div>

              {/* 3. Corner Crispness & Ballooning Prevention Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Corner Crispness</span>
                  <span className="font-mono font-medium text-dark-brown">
                    {cornerAngle}° ({cornerAngle <= 32 ? 'Sharp Architectural' : 'Smooth Organics'})
                  </span>
                </div>
                <Slider
                  value={[cornerAngle]}
                  min={20}
                  max={60}
                  step={1}
                  onValueChange={([val]) => setCornerAngle(val)}
                />
              </div>

              {/* 4. Speckle / Noise Filter Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Noise Specks Filter</span>
                  <span className="font-mono font-medium text-dark-brown">{minArea} px</span>
                </div>
                <Slider
                  value={[minArea]}
                  min={5}
                  max={80}
                  step={5}
                  onValueChange={([val]) => setMinArea(val)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-3 border-t border-border bg-muted/20 flex items-center justify-between sm:justify-between flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleApply}
              disabled={!traceResult || !traceResult.pathData}
              className="bg-burgundy hover:bg-burgundy-hover text-cream text-xs font-semibold gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Vector into CAD Plate</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
