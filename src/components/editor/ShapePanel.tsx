import { shapeDefinitions } from '@/lib/shapes';
import { useEditor } from '@/hooks/useEditor';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Preset sizes stored in mm (canonical unit)
const presetSizes = [
  { name: '6" × 6"', w: 152, h: 152 },
  { name: '8" × 10"', w: 203, h: 254 },
  { name: '12" × 12"', w: 305, h: 305 },
  { name: '12" × 18"', w: 305, h: 457 },
  { name: '18" × 24"', w: 457, h: 610 },
  { name: '24" × 36"', w: 610, h: 914 },
];

const MM_PER_INCH = 25.4;

const metalTypes: { id: 'steel' | 'stainless' | 'aluminum' | 'brass' | 'copper' | 'gold' | 'corten'; name: string; swatch: string }[] = [
  { id: 'steel',     name: 'Mild Steel',      swatch: 'linear-gradient(135deg,#4a4a4a,#8a8a8a,#4a4a4a)' },
  { id: 'stainless', name: 'Stainless Steel', swatch: 'linear-gradient(135deg,#9aa0a6,#e8eaed,#9aa0a6)' },
  { id: 'aluminum',  name: 'Aluminum',        swatch: 'linear-gradient(135deg,#b8b8ba,#f0f0f2,#b8b8ba)' },
  { id: 'brass',     name: 'Brass',           swatch: 'linear-gradient(135deg,#a47a2a,#e6c46b,#a47a2a)' },
  { id: 'copper',    name: 'Copper',          swatch: 'linear-gradient(135deg,#a0522d,#d98b5f,#a0522d)' },
  { id: 'gold',      name: 'Gold',            swatch: 'linear-gradient(135deg,#b8860b,#ffd700,#b8860b)' },
  { id: 'corten',    name: 'Corten (Rust)',   swatch: 'linear-gradient(135deg,#7a3a1a,#b5651d,#7a3a1a)' },
];

const thicknessPresets = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];

export function ShapePanel() {
  const { state, dispatch } = useEditor();
  const basicShapes = shapeDefinitions.filter(s => s.category === 'basic');
  const decorativeShapes = shapeDefinitions.filter(s => s.category === 'decorative');

  // Internal canonical unit is mm. Display values convert to inches when selected.
  const toDisplay = (mm: number) => state.unit === 'inch' ? +(mm / MM_PER_INCH).toFixed(3) : mm;
  const toMm = (val: number) => state.unit === 'inch' ? val * MM_PER_INCH : val;
  const unitLabel = state.unit === 'inch' ? 'in' : 'mm';

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
                <Label className="text-xs">Width ({unitLabel})</Label>
                <Input
                  type="number"
                  value={toDisplay(state.shapeWidth)}
                  step={state.unit === 'inch' ? 0.1 : 1}
                  min={state.unit === 'inch' ? 0.5 : 10}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v > 0) {
                      dispatch({ type: 'SET_DIMENSIONS', width: Math.round(toMm(v)) });
                    }
                  }}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Height ({unitLabel})</Label>
                <Input
                  type="number"
                  value={toDisplay(state.shapeHeight)}
                  step={state.unit === 'inch' ? 0.1 : 1}
                  min={state.unit === 'inch' ? 0.5 : 10}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v > 0) {
                      dispatch({ type: 'SET_DIMENSIONS', height: Math.round(toMm(v)) });
                    }
                  }}
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

          <Separator />

          {/* Material */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material</h3>

            <div className="grid grid-cols-2 gap-2">
              {metalTypes.map(m => {
                const active = state.metalType === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => dispatch({ type: 'SET_METAL_TYPE', metalType: m.id })}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md border text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-transparent bg-background hover:bg-muted text-muted-foreground"
                    )}
                    title={m.name}
                  >
                    <span
                      className="w-5 h-5 rounded-sm border border-border flex-shrink-0"
                      style={{ background: m.swatch }}
                    />
                    <span className="text-[11px] font-medium truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Thickness ({unitLabel})</Label>
              <div className="flex gap-2">
                <Select
                  value={String(state.metalThickness)}
                  onValueChange={(v) => dispatch({ type: 'SET_METAL_THICKNESS', thickness: Number(v) })}
                >
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {thicknessPresets.map(t => (
                      <SelectItem key={t} value={String(t)}>
                        {state.unit === 'inch' ? `${(t / MM_PER_INCH).toFixed(3)} in` : `${t} mm`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step={state.unit === 'inch' ? 0.01 : 0.1}
                  min={state.unit === 'inch' ? 0.02 : 0.5}
                  value={toDisplay(state.metalThickness)}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v > 0) {
                      dispatch({ type: 'SET_METAL_THICKNESS', thickness: +toMm(v).toFixed(2) });
                    }
                  }}
                  className="h-8 text-xs w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
