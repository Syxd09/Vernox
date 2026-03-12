import { useEditor } from './EditorContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { removeBackgroundAuto, convertToClipart } from '@/lib/imageProcessing';
import { Eye, EyeOff, Lock, Unlock, Trash2, ArrowUp, ArrowDown, Wand2, Eraser, Palette } from 'lucide-react';
import { useState } from 'react';

export function ToolsPanel() {
  const { state, dispatch } = useEditor();
  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
  const [bgThreshold, setBgThreshold] = useState(30);
  const [clipartThreshold, setClipartThreshold] = useState(50);
  const [posterizeLevels, setPosterizeLevels] = useState(4);
  const [clipartMode, setClipartMode] = useState<'posterize' | 'edge'>('posterize');
  const [processing, setProcessing] = useState(false);

  const handleRemoveBg = async () => {
    if (!selectedLayer) return;
    setProcessing(true);
    try {
      const result = await removeBackgroundAuto(selectedLayer.imageData, bgThreshold);
      dispatch({ type: 'UPDATE_LAYER', id: selectedLayer.id, updates: { imageData: result } });
      dispatch({ type: 'PUSH_HISTORY' });
    } finally {
      setProcessing(false);
    }
  };

  const handleClipartConvert = async () => {
    if (!selectedLayer) return;
    setProcessing(true);
    try {
      const result = await convertToClipart(selectedLayer.originalImageData, {
        threshold: clipartThreshold,
        posterizeLevels,
        edgeDetect: clipartMode === 'edge',
      });
      dispatch({ type: 'UPDATE_LAYER', id: selectedLayer.id, updates: { imageData: result } });
      dispatch({ type: 'PUSH_HISTORY' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (!selectedLayer) return;
    dispatch({ type: 'UPDATE_LAYER', id: selectedLayer.id, updates: { imageData: selectedLayer.originalImageData } });
    dispatch({ type: 'PUSH_HISTORY' });
  };

  const moveLayer = (dir: 'up' | 'down') => {
    if (!selectedLayer) return;
    const idx = state.layers.findIndex(l => l.id === selectedLayer.id);
    const newLayers = [...state.layers];
    const swapIdx = dir === 'up' ? idx + 1 : idx - 1;
    if (swapIdx < 0 || swapIdx >= newLayers.length) return;
    [newLayers[idx], newLayers[swapIdx]] = [newLayers[swapIdx], newLayers[idx]];
    dispatch({ type: 'REORDER_LAYERS', layers: newLayers });
  };

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tools & Layers</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="layers">
            <TabsList className="w-full">
              <TabsTrigger value="layers" className="flex-1 text-xs">Layers</TabsTrigger>
              <TabsTrigger value="edit" className="flex-1 text-xs">Edit</TabsTrigger>
              <TabsTrigger value="clipart" className="flex-1 text-xs">Clipart</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="mt-4 space-y-2">
              {state.layers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Upload an image to get started</p>
              ) : (
                state.layers.slice().reverse().map(layer => (
                  <div
                    key={layer.id}
                    onClick={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors border ${
                      state.selectedLayerId === layer.id
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-background border-transparent hover:bg-muted'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-8 h-8 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img src={layer.imageData} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs truncate flex-1">{layer.name}</span>
                    <div className="flex gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'UPDATE_LAYER', id: layer.id, updates: { visible: !layer.visible } }); }}
                        className="p-1 rounded hover:bg-muted"
                      >
                        {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'UPDATE_LAYER', id: layer.id, updates: { locked: !layer.locked } }); }}
                        className="p-1 rounded hover:bg-muted"
                      >
                        {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_LAYER', id: layer.id }); dispatch({ type: 'PUSH_HISTORY' }); }}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {selectedLayer && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => moveLayer('up')}>
                        <ArrowUp className="w-3 h-3 mr-1" /> Up
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => moveLayer('down')}>
                        <ArrowDown className="w-3 h-3 mr-1" /> Down
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Opacity: {Math.round(selectedLayer.opacity * 100)}%</Label>
                      <Slider
                        value={[selectedLayer.opacity]}
                        onValueChange={([v]) => dispatch({ type: 'UPDATE_LAYER', id: selectedLayer.id, updates: { opacity: v } })}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="edit" className="mt-4 space-y-4">
              {!selectedLayer ? (
                <p className="text-xs text-muted-foreground text-center py-8">Select a layer to edit</p>
              ) : (
                <>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Eraser className="w-3.5 h-3.5" /> Background Removal
                    </h4>
                    <div className="space-y-2">
                      <Label className="text-xs">Sensitivity: {bgThreshold}</Label>
                      <Slider value={[bgThreshold]} onValueChange={([v]) => setBgThreshold(v)} min={5} max={100} step={1} />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleRemoveBg}
                      disabled={processing}
                      className="w-full text-xs"
                    >
                      <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                      {processing ? 'Processing...' : 'Remove Background'}
                    </Button>
                  </div>

                  <Separator />

                  <Button size="sm" variant="outline" onClick={handleRestoreOriginal} className="w-full text-xs">
                    Restore Original
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="clipart" className="mt-4 space-y-4">
              {!selectedLayer ? (
                <p className="text-xs text-muted-foreground text-center py-8">Select a layer to convert</p>
              ) : (
                <>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" /> Clipart Conversion
                    </h4>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={clipartMode === 'posterize' ? 'default' : 'outline'}
                        onClick={() => setClipartMode('posterize')}
                        className="flex-1 text-xs"
                      >
                        Posterize
                      </Button>
                      <Button
                        size="sm"
                        variant={clipartMode === 'edge' ? 'default' : 'outline'}
                        onClick={() => setClipartMode('edge')}
                        className="flex-1 text-xs"
                      >
                        Edge Detect
                      </Button>
                    </div>

                    {clipartMode === 'posterize' ? (
                      <div className="space-y-2">
                        <Label className="text-xs">Color Levels: {posterizeLevels}</Label>
                        <Slider value={[posterizeLevels]} onValueChange={([v]) => setPosterizeLevels(v)} min={2} max={8} step={1} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="text-xs">Edge Threshold: {clipartThreshold}</Label>
                        <Slider value={[clipartThreshold]} onValueChange={([v]) => setClipartThreshold(v)} min={10} max={150} step={1} />
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={handleClipartConvert}
                      disabled={processing}
                      className="w-full text-xs"
                    >
                      <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                      {processing ? 'Converting...' : 'Convert to Clipart'}
                    </Button>
                  </div>

                  <Separator />

                  <Button size="sm" variant="outline" onClick={handleRestoreOriginal} className="w-full text-xs">
                    Restore Original
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
