import { useEditor } from './EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter,
  AlignStartHorizontal, AlignEndHorizontal,
  AlignStartVertical, AlignEndVertical,
  FlipHorizontal2, FlipVertical2, Copy, RotateCw,
} from 'lucide-react';

function flipImage(src: string, axis: 'h' | 'v'): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(axis === 'h' ? canvas.width : 0, axis === 'v' ? canvas.height : 0);
      ctx.scale(axis === 'h' ? -1 : 1, axis === 'v' ? -1 : 1);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = src;
  });
}

export function PropertiesPanel() {
  const { state, dispatch } = useEditor();
  const layer = state.layers.find(l => l.id === state.selectedLayerId);

  if (!layer) {
    return (
      <p className="text-xs text-muted-foreground text-center py-8">
        Select a layer to edit properties
      </p>
    );
  }

  const update = (updates: Partial<typeof layer>) => {
    dispatch({ type: 'UPDATE_LAYER', id: layer.id, updates });
  };

  const commit = () => dispatch({ type: 'PUSH_HISTORY' });

  const align = (mode: 'left' | 'right' | 'center-h' | 'top' | 'bottom' | 'center-v') => {
    const updates: Partial<typeof layer> = {};
    switch (mode) {
      case 'left': updates.x = 0; break;
      case 'right': updates.x = state.shapeWidth - layer.width; break;
      case 'center-h': updates.x = (state.shapeWidth - layer.width) / 2; break;
      case 'top': updates.y = 0; break;
      case 'bottom': updates.y = state.shapeHeight - layer.height; break;
      case 'center-v': updates.y = (state.shapeHeight - layer.height) / 2; break;
    }
    update(updates);
    commit();
  };

  const flip = async (axis: 'h' | 'v') => {
    const flipped = await flipImage(layer.imageData, axis);
    update({ imageData: flipped });
    commit();
  };

  const handleNumber = (key: 'x' | 'y' | 'width' | 'height' | 'rotation', value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    update({ [key]: key === 'width' || key === 'height' ? Math.max(5, num) : num });
  };

  return (
    <div className="space-y-4">
      {/* Position & size */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transform</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">X</Label>
            <Input
              type="number"
              value={Math.round(layer.x)}
              onChange={(e) => handleNumber('x', e.target.value)}
              onBlur={commit}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Y</Label>
            <Input
              type="number"
              value={Math.round(layer.y)}
              onChange={(e) => handleNumber('y', e.target.value)}
              onBlur={commit}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">W</Label>
            <Input
              type="number"
              value={Math.round(layer.width)}
              onChange={(e) => handleNumber('width', e.target.value)}
              onBlur={commit}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">H</Label>
            <Input
              type="number"
              value={Math.round(layer.height)}
              onChange={(e) => handleNumber('height', e.target.value)}
              onBlur={commit}
              className="h-7 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> Rotation: {Math.round(layer.rotation)}°
          </Label>
          <Slider
            value={[layer.rotation]}
            onValueChange={([v]) => update({ rotation: v })}
            onValueCommit={commit}
            min={-180}
            max={180}
            step={1}
          />
        </div>
      </div>

      <Separator />

      {/* Alignment */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Align to Shape</h4>
        <div className="grid grid-cols-3 gap-1">
          <Button size="icon" variant="outline" className="h-8 w-full" title="Align left" onClick={() => align('left')}>
            <AlignStartVertical className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-full" title="Center horizontally" onClick={() => align('center-h')}>
            <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-full" title="Align right" onClick={() => align('right')}>
            <AlignEndVertical className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-full" title="Align top" onClick={() => align('top')}>
            <AlignStartHorizontal className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-full" title="Center vertically" onClick={() => align('center-v')}>
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-full" title="Align bottom" onClick={() => align('bottom')}>
            <AlignEndHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Flip & duplicate */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
        <div className="grid grid-cols-2 gap-1">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => flip('h')}>
            <FlipHorizontal2 className="w-3.5 h-3.5 mr-1" /> Flip H
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => flip('v')}>
            <FlipVertical2 className="w-3.5 h-3.5 mr-1" /> Flip V
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={() => { dispatch({ type: 'DUPLICATE_LAYER', id: layer.id }); dispatch({ type: 'PUSH_HISTORY' }); }}
        >
          <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate Layer
        </Button>
      </div>
    </div>
  );
}