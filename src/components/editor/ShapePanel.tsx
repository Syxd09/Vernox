import { shapeDefinitions } from '@/lib/shapes';
import { useEditor } from './EditorContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const presetSizes = [
  { name: '6" × 6"', w: 152, h: 152 },
  { name: '8" × 10"', w: 203, h: 254 },
  { name: '12" × 12"', w: 305, h: 305 },
  { name: '12" × 18"', w: 305, h: 457 },
  { name: '18" × 24"', w: 457, h: 610 },
  { name: '24" × 36"', w: 610, h: 914 },
];

export function ShapePanel() {
  const { state, dispatch } = useEditor();
  const basicShapes = shapeDefinitions.filter(s => s.category === 'basic');
  const decorativeShapes = shapeDefinitions.filter(s => s.category === 'decorative');

  return (
    <div className="w-72 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Shape Library</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Basic Shapes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic</h3>
            <div className="grid grid-cols-4 gap-2">
              {basicShapes.map(shape => {
                const isActive = state.selectedShapeId === shape.id;
                const path = shape.getPath(32, 32);
                return (
                  <button
                    key={shape.id}
                    onClick={() => dispatch({ type: 'SET_SHAPE', shapeId: shape.id })}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg transition-all border",
                      isActive
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-background border-transparent hover:bg-muted hover:border-border text-muted-foreground"
                    )}
                    title={shape.name}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" className="mb-1">
                      <path d={path} fill={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} opacity={isActive ? 0.8 : 0.4} />
                    </svg>
                    <span className="text-[10px] font-medium truncate w-full text-center">{shape.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decorative Shapes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Decorative</h3>
            <div className="grid grid-cols-4 gap-2">
              {decorativeShapes.map(shape => {
                const isActive = state.selectedShapeId === shape.id;
                const path = shape.getPath(32, 32);
                return (
                  <button
                    key={shape.id}
                    onClick={() => dispatch({ type: 'SET_SHAPE', shapeId: shape.id })}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg transition-all border",
                      isActive
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-background border-transparent hover:bg-muted hover:border-border text-muted-foreground"
                    )}
                    title={shape.name}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" className="mb-1">
                      <path d={path} fill={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} opacity={isActive ? 0.8 : 0.4} />
                    </svg>
                    <span className="text-[10px] font-medium truncate w-full text-center">{shape.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Size Configuration */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dimensions</h3>

            <div className="flex gap-2">
              <Select value={state.unit} onValueChange={(v) => dispatch({ type: 'SET_UNIT', unit: v as 'mm' | 'inch' })}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="inch">inch</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => {
                const preset = presetSizes[parseInt(v)];
                dispatch({ type: 'SET_DIMENSIONS', width: preset.w, height: preset.h });
              }}>
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue placeholder="Presets" />
                </SelectTrigger>
                <SelectContent>
                  {presetSizes.map((p, i) => (
                    <SelectItem key={i} value={String(i)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={state.shapeWidth}
                  onChange={(e) => dispatch({ type: 'SET_DIMENSIONS', width: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={state.shapeHeight}
                  onChange={(e) => dispatch({ type: 'SET_DIMENSIONS', height: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Border Thickness: {state.shapeBorderThickness}px</Label>
              <Slider
                value={[state.shapeBorderThickness]}
                onValueChange={([v]) => dispatch({ type: 'SET_BORDER_THICKNESS', value: v })}
                min={0}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Corner Radius: {state.shapeCornerRadius}px</Label>
              <Slider
                value={[state.shapeCornerRadius]}
                onValueChange={([v]) => dispatch({ type: 'SET_CORNER_RADIUS', value: v })}
                min={0}
                max={50}
                step={1}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
