import { useRef, useCallback } from 'react';
import { useEditor } from './EditorContext';
import { getShapeById } from '@/lib/shapes';
import { exportCanvasAsSVG } from '@/lib/imageProcessing';
import { Button } from '@/components/ui/button';
import {
  Upload, Undo2, Redo2, Download, ZoomIn, ZoomOut,
  Grid3X3, FileImage, FileCode
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopBar() {
  const { state, dispatch, addImage } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => addImage(f));
    e.target.value = '';
  }, [addImage]);

  const handleExportPNG = useCallback(() => {
    const shape = getShapeById(state.selectedShapeId);
    if (!shape) return;

    const canvas = document.createElement('canvas');
    canvas.width = state.shapeWidth;
    canvas.height = state.shapeHeight;
    const ctx = canvas.getContext('2d')!;

    // Clip to shape
    const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
    const path2d = new Path2D(shapePath);
    ctx.clip(path2d);

    // Draw layers
    const promises = state.layers
      .filter(l => l.visible)
      .map(layer => new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          ctx.restore();
          resolve();
        };
        img.src = layer.imageData;
      }));

    Promise.all(promises).then(() => {
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = state.shapeBorderThickness;
      ctx.stroke(path2d);

      const link = document.createElement('a');
      link.download = `metal-shape-${state.selectedShapeId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }, [state]);

  const handleExportSVG = useCallback(() => {
    const shape = getShapeById(state.selectedShapeId);
    if (!shape) return;
    const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
    const svgContent = exportCanvasAsSVG(
      shapePath,
      state.shapeWidth,
      state.shapeHeight,
      state.layers.filter(l => l.visible)
    );
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `metal-shape-${state.selectedShapeId}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [state]);

  return (
    <div className="h-12 bg-card border-b border-border flex items-center px-4 gap-2 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">MS</span>
        </div>
        <span className="text-sm font-semibold text-foreground hidden sm:block">MetalShape</span>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp,.pdf"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs gap-1.5">
        <Upload className="w-3.5 h-3.5" /> Upload
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* Undo/Redo */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.historyIndex <= 0}
        className="h-8 w-8"
        title="Undo"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => dispatch({ type: 'REDO' })}
        disabled={state.historyIndex >= state.history.length - 1}
        className="h-8 w-8"
        title="Redo"
      >
        <Redo2 className="w-3.5 h-3.5" />
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* Zoom */}
      <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'SET_ZOOM', zoom: state.zoom - 0.1 })} className="h-8 w-8">
        <ZoomOut className="w-3.5 h-3.5" />
      </Button>
      <span className="text-xs font-mono text-muted-foreground w-10 text-center">{Math.round(state.zoom * 100)}%</span>
      <Button size="icon" variant="ghost" onClick={() => dispatch({ type: 'SET_ZOOM', zoom: state.zoom + 0.1 })} className="h-8 w-8">
        <ZoomIn className="w-3.5 h-3.5" />
      </Button>

      {/* Grid toggle */}
      <Button
        size="icon"
        variant={state.showGrid ? 'secondary' : 'ghost'}
        onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
        className="h-8 w-8"
        title="Toggle Grid"
      >
        <Grid3X3 className="w-3.5 h-3.5" />
      </Button>

      <div className="flex-1" />

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportPNG}>
            <FileImage className="w-4 h-4 mr-2" /> Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportSVG}>
            <FileCode className="w-4 h-4 mr-2" /> Export as SVG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
