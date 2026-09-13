/**
 * Vector Feature Layer Properties Panel
 * Controls precise metric coordinates, alignment, typography parameters,
 * hole dimensions, and CAM layer assignments for the selected layer.
 */

import { useVectorDocument } from '@/hooks/useVectorDocument';
import { StencilFontRegistry } from '@/lib/fontRegistry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter,
  AlignStartHorizontal, AlignEndHorizontal,
  AlignStartVertical, AlignEndVertical,
  RotateCw, Trash2, Copy, Eye, EyeOff, Lock, Unlock,
  Type, CircleDot, Spline
} from 'lucide-react';
import type { 
  TypographyFeatureLayer, 
  MountingHoleFeatureLayer, 
  VectorPathFeatureLayer 
} from '@/lib/cadEngineTypes';

export function PropertiesPanel() {
  const { 
    doc, 
    selectedLayerId, 
    updateTransform, 
    updateTypography, 
    updateMountingHole,
    duplicateLayer,
    removeLayer,
    setLayerVisibility,
    setLayerLocked,
    setLayerCamLayer,
    selectLayer
  } = useVectorDocument();

  const layer = doc.layers.find(l => l.id === selectedLayerId);

  if (!layer) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center mb-3 text-slate-500">
          <Spline className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-slate-400">No Layer Selected</p>
        <p className="text-[11px] text-slate-600 mt-1">Click any element on the canvas to inspect its CAM parameters</p>
      </div>
    );
  }

  const availableFonts = StencilFontRegistry.getInstance().getAvailableFonts();

  // Alignment against workpiece boundary
  const align = (mode: 'left' | 'right' | 'center-h' | 'top' | 'bottom' | 'center-v') => {
    let newX = layer.transform.xMm;
    let newY = layer.transform.yMm;
    const bw = doc.boundary.widthMm;
    const bh = doc.boundary.heightMm;

    // Estimate width/height of layer
    let lw = 40;
    let lh = 40;
    if (layer.type === 'mounting_hole') {
      lw = layer.diameterMm;
      lh = layer.diameterMm;
    } else if (layer.type === 'typography') {
      lw = (layer.fontSizeMm * (layer.rawText?.length || 1) * 0.65);
      lh = layer.fontSizeMm;
    } else if (layer.type === 'vector_path' && layer.boundsMm) {
      lw = layer.boundsMm.widthMm;
      lh = layer.boundsMm.heightMm;
    }

    switch (mode) {
      case 'left': newX = 15; break;
      case 'right': newX = bw - lw - 15; break;
      case 'center-h': newX = Math.round((bw - lw) / 2); break;
      case 'top': newY = 15; break;
      case 'bottom': newY = bh - lh - 15; break;
      case 'center-v': newY = Math.round((bh - lh) / 2); break;
    }

    updateTransform(layer.id, { xMm: Math.max(0, newX), yMm: Math.max(0, newY) });
  };

  return (
    <div className="space-y-4">
      {/* Header with Layer Identity and Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          {layer.type === 'typography' && <Type className="w-4 h-4 text-primary flex-shrink-0" />}
          {layer.type === 'mounting_hole' && <CircleDot className="w-4 h-4 text-primary flex-shrink-0" />}
          {layer.type === 'vector_path' && <Spline className="w-4 h-4 text-primary flex-shrink-0" />}
          <span className="text-xs font-semibold text-foreground truncate block" title={layer.name}>
            {layer.name}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setLayerVisibility(layer.id, !layer.visible)}
            title={layer.visible ? "Hide Layer" : "Show Layer"}
          >
            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setLayerLocked(layer.id, !layer.locked)}
            title={layer.locked ? "Unlock Layer" : "Lock Layer"}
          >
            {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => duplicateLayer(layer.id)}
            title="Duplicate Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-destructive hover:bg-destructive/10"
            onClick={() => {
              removeLayer(layer.id);
              selectLayer(null);
            }}
            title="Delete Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Metric Transform Coordinates */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Metric Position & Rotation
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">X (mm)</Label>
            <Input
              type="number"
              value={Math.round(layer.transform.xMm * 10) / 10}
              onChange={(e) => updateTransform(layer.id, { xMm: Number(e.target.value) || 0 })}
              className="h-7 text-xs font-mono"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Y (mm)</Label>
            <Input
              type="number"
              value={Math.round(layer.transform.yMm * 10) / 10}
              onChange={(e) => updateTransform(layer.id, { yMm: Number(e.target.value) || 0 })}
              className="h-7 text-xs font-mono"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Rot (°)</Label>
            <Input
              type="number"
              value={Math.round(layer.transform.rotationDeg || 0)}
              onChange={(e) => updateTransform(layer.id, { rotationDeg: Number(e.target.value) || 0 })}
              className="h-7 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Boundary Alignment Controls */}
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          Workpiece Alignment
        </Label>
        <div className="flex gap-1 bg-muted/40 p-1 rounded-md justify-between">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('left')} title="Align Left">
            <AlignStartHorizontal className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('center-h')} title="Center Horizontally">
            <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('right')} title="Align Right">
            <AlignEndHorizontal className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-5 bg-border my-auto" />
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('top')} title="Align Top">
            <AlignStartVertical className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('center-v')} title="Center Vertically">
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => align('bottom')} title="Align Bottom">
            <AlignEndVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Typography Specific Controls */}
      {layer.type === 'typography' && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Typography Parameters
          </h4>

          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Text String</Label>
            <Input
              value={layer.rawText}
              onChange={(e) => updateTypography(layer.id, { rawText: e.target.value })}
              className="h-8 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Laser Stencil Font</Label>
            <Select
              value={layer.fontFamily}
              onValueChange={(fontFamily) => updateTypography(layer.id, { fontFamily })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableFonts.map(f => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Font Size</span>
              <span className="font-mono font-medium">{layer.fontSizeMm} mm</span>
            </div>
            <Slider
              value={[layer.fontSizeMm]}
              min={15}
              max={150}
              step={1}
              onValueChange={([val]) => updateTypography(layer.id, { fontSizeMm: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Stencil Bridges</Label>
              <p className="text-[10px] text-muted-foreground">Laser-cut retention tabs</p>
            </div>
            <Switch
              checked={layer.isStencilBridged}
              onCheckedChange={(checked) => updateTypography(layer.id, { isStencilBridged: checked })}
            />
          </div>

          {layer.isStencilBridged && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Bridge Width</span>
                <span className="font-mono font-medium">{layer.bridgeWidthMm} mm</span>
              </div>
              <Slider
                value={[layer.bridgeWidthMm]}
                min={1.5}
                max={6.0}
                step={0.5}
                onValueChange={([val]) => updateTypography(layer.id, { bridgeWidthMm: val })}
              />
            </div>
          )}
        </div>
      )}

      {/* Mounting Hole Specific Controls */}
      {layer.type === 'mounting_hole' && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Standoff Hole Parameters
          </h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Diameter</span>
              <span className="font-mono font-medium">{layer.diameterMm} mm</span>
            </div>
            <Slider
              value={[layer.diameterMm]}
              min={3}
              max={20}
              step={0.5}
              onValueChange={([val]) => updateMountingHole(layer.id, { diameterMm: val })}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Standoff Hardware Type</Label>
            <Select
              value={layer.standoffType}
              onValueChange={(val: any) => updateMountingHole(layer.id, { standoffType: val })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barrel_spacer">Barrel Spacer (Wall Mount)</SelectItem>
                <SelectItem value="flush_screw">Flush Countersunk Screw</SelectItem>
                <SelectItem value="keyhole_hanger">Keyhole Blind Slot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Vector Path Specific Controls */}
      {layer.type === 'vector_path' && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Toolpath Layer
          </h4>

          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">CAM Laser Bucket</Label>
            <Select
              value={layer.camLayer}
              onValueChange={(val: any) => setLayerCamLayer(layer.id, val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0_CUT_INTERNAL">0_CUT_INTERNAL (Through Cut)</SelectItem>
                <SelectItem value="2_VECTOR_SCORE">2_VECTOR_SCORE (Surface Score/Bend)</SelectItem>
                <SelectItem value="1_CUT_PERIMETER">1_CUT_PERIMETER (Outer Perimeter)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}