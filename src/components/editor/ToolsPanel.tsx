/**
 * Industrial CAD/CAM Tools Panel
 * Provides Vector Typography, Standoff Hole Placer, Image-to-Vector Tracer,
 * Layer Hierarchy Manager, and Live CAM Linter with Manufacturing Analytics.
 */

import { useState, useRef } from 'react';
import { useVectorDocument } from '@/hooks/useVectorDocument';
import { StencilFontRegistry } from '@/lib/fontRegistry';
import { ImageToVectorTracer } from '@/lib/imageTracer';
import { PropertiesPanel } from './PropertiesPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Type, CircleDot, Spline, Layers, Settings2, Activity,
  Upload, Eye, EyeOff, Lock, Unlock, Trash2, Copy,
  ArrowUp, ArrowDown, CheckCircle2, AlertTriangle, Wand2, ShieldAlert,
  Sparkles, Maximize2
} from 'lucide-react';

export function ToolsPanel() {
  const {
    doc,
    analytics,
    selectedLayerId,
    selectLayer,
    addTypography,
    addMountingHole,
    addFourCornerMountingHoles,
    addImageTracedPath,
    updateTransform,
    removeLayer,
    duplicateLayer,
    reorderLayer,
    setLayerVisibility,
    setLayerLocked,
    setLayerCamLayer,
  } = useVectorDocument();

  const [activeTab, setActiveTab] = useState<'tools' | 'layers' | 'properties' | 'cam'>('tools');

  // Typography state
  const [textInput, setTextInput] = useState('VERNOX');
  const [selectedFont, setSelectedFont] = useState('antwerp_monogram_stencil');
  const [fontSizeMm, setFontSizeMm] = useState(45);
  const [bridged, setBridged] = useState(true);
  const [bridgeWidthMm, setBridgeWidthMm] = useState(2.0);

  // Standoff state
  const [holeDiameterMm, setHoleDiameterMm] = useState(6.0);
  const [edgeOffsetMm, setEdgeOffsetMm] = useState(15.0);

  // Image to vector state
  const [isTracing, setIsTracing] = useState(false);
  const [invertTrace, setInvertTrace] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableFonts = StencilFontRegistry.getInstance().getAvailableFonts();

  // 1. Add Typography Layer (Centered safely in workpiece)
  const handleAddTypography = () => {
    if (!textInput.trim()) return;
    const estWidth = textInput.trim().length * fontSizeMm * 0.7;
    const posX = Math.max(15, Math.round((doc.boundary.widthMm - estWidth) / 2));
    const posY = Math.max(15, Math.round((doc.boundary.heightMm - fontSizeMm) / 2));
    const layer = addTypography(
      textInput.trim(),
      selectedFont,
      fontSizeMm,
      { x: posX, y: posY },
      bridged,
      bridgeWidthMm
    );
    selectLayer(layer.id);
    toast({
      title: "Typography Feature Added",
      description: `Bridged stencil text "${textInput}" placed on internal cut layer.`,
    });
  };

  // 2. Add Single Mounting Hole
  const handleAddSingleHole = () => {
    const layer = addMountingHole(
      holeDiameterMm,
      'barrel_spacer',
      { x: edgeOffsetMm, y: edgeOffsetMm },
      edgeOffsetMm
    );
    selectLayer(layer.id);
    toast({
      title: "Standoff Hole Added",
      description: `${holeDiameterMm}mm standoff hole placed.`,
    });
  };

  // 3. Auto Add 4 Corner Standoffs
  const handleAdd4CornerHoles = () => {
    addFourCornerMountingHoles(holeDiameterMm, edgeOffsetMm);
    toast({
      title: "4-Corner Standoffs Inserted",
      description: `Placed 4 × ${holeDiameterMm}mm standoff holes inset by ${edgeOffsetMm}mm.`,
    });
  };

  // 4. Image-to-Vector Tracing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTracing(true);
    toast({
      title: "Tracing Vector Contours",
      description: "Running Otsu binarization and Bezier curve fitting...",
    });

    let objectUrl = '';
    try {
      const img = new Image();
      objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Render to offscreen canvas to extract pixel data
      const canvas = document.createElement('canvas');
      // Normalize to manageable resolution for fast, clean contour extraction
      const maxDim = 600;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not acquire canvas 2D context");

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);

      // Invert if requested
      if (invertTrace) {
        for (let i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i] = 255 - imgData.data[i];
          imgData.data[i + 1] = 255 - imgData.data[i + 1];
          imgData.data[i + 2] = 255 - imgData.data[i + 2];
        }
      }

      const result = ImageToVectorTracer.traceImage(imgData, {
        targetWidthMm: Math.min(doc.boundary.widthMm * 0.7, 180),
      });

      const layer = addImageTracedPath(
        result.pathData,
        result.boundsMm,
        file.name.replace(/\.[^/.]+$/, '')
      );
      selectLayer(layer.id);

      toast({
        title: "Vector Toolpath Generated",
        description: `Extracted ${result.contours.length} contours. Ready for laser cut.`,
      });
    } catch (err: any) {
      console.error("Vector trace error:", err);
      toast({
        title: "Tracing Failed",
        description: err.message || "Failed to extract vector contours from image.",
        variant: "destructive",
      });
    } finally {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (_) {}
      }
      setIsTracing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full md:w-[350px] lg:w-[360px] flex-shrink-0 border-l border-border bg-card flex flex-col h-full min-w-0">
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex flex-col h-full">
        {/* Navigation Tabs Header */}
        <div className="p-2 border-b border-border bg-card">
          <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/60 p-0.5">
            <TabsTrigger value="tools" className="text-[11px] gap-1 px-1">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Tools</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-[11px] gap-1 px-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-[11px] gap-1 px-1">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </TabsTrigger>
            <TabsTrigger value="cam" className="text-[11px] gap-1 px-1 relative">
              <Activity className="w-3.5 h-3.5" />
              <span>CAM</span>
              {!analytics.isValidated && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Vector CAD Tools */}
        <TabsContent value="tools" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* 1. Laser Stencil Typography Tool */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Laser Stencil Typography
                  </h3>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Text String</Label>
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. 42 HIGH ST"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] text-muted-foreground">Laser Stencil Font</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
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

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Font Size</span>
                      <span className="font-mono font-medium">{fontSizeMm} mm</span>
                    </div>
                    <Slider
                      value={[fontSizeMm]}
                      min={15}
                      max={120}
                      step={1}
                      onValueChange={([val]) => setFontSizeMm(val)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-medium">Stencil Bridges</Label>
                      <p className="text-[10px] text-muted-foreground">Laser fallout prevention</p>
                    </div>
                    <Switch checked={bridged} onCheckedChange={setBridged} />
                  </div>

                  <Button
                    onClick={handleAddTypography}
                    className="w-full h-8 text-xs font-medium gap-1.5 mt-2"
                  >
                    <Type className="w-3.5 h-3.5" />
                    Insert Stencil Text
                  </Button>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* 2. Mounting Standoff Hole Placer */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Mounting Standoffs
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Hole Diameter</span>
                      <span className="font-mono font-medium">{holeDiameterMm} mm</span>
                    </div>
                    <Slider
                      value={[holeDiameterMm]}
                      min={3}
                      max={16}
                      step={0.5}
                      onValueChange={([val]) => setHoleDiameterMm(val)}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Corner Edge Inset</span>
                      <span className="font-mono font-medium">{edgeOffsetMm} mm</span>
                    </div>
                    <Slider
                      value={[edgeOffsetMm]}
                      min={8}
                      max={40}
                      step={1}
                      onValueChange={([val]) => setEdgeOffsetMm(val)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      onClick={handleAddSingleHole}
                      className="h-8 text-xs font-medium"
                    >
                      + Single Hole
                    </Button>
                    <Button
                      onClick={handleAdd4CornerHoles}
                      className="h-8 text-xs font-medium bg-primary/90"
                    >
                      4 Corners Auto
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* 3. Image-to-Vector Tracer (Otsu + Bezier) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Spline className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Image to Laser Vector
                  </h3>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Trace logos and silhouettes into mathematical closed Bezier curves. Zero raster bitmaps in laser output.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center justify-between py-1">
                  <Label className="text-xs text-muted-foreground">Invert Threshold</Label>
                  <Switch checked={invertTrace} onCheckedChange={setInvertTrace} />
                </div>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTracing}
                  className="w-full h-8 text-xs font-medium gap-1.5 border-dashed"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isTracing ? "Extracting Vectors..." : "Upload & Trace Vector Contour"}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 2: Layers Hierarchy */}
        <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Feature Layers ({doc.layers.length})
                </span>
              </div>

              {doc.layers.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No features added yet.<br />Use Tools tab to add typography or holes.
                </div>
              ) : (
                doc.layers.map((layer, idx) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => selectLayer(layer.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer group",
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground font-medium shadow-sm"
                          : "bg-background/60 border-border hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        {layer.type === 'typography' && <Type className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        {layer.type === 'mounting_hole' && <CircleDot className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        {layer.type === 'vector_path' && <Spline className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        <span className="truncate text-xs font-medium block" title={layer.name}>
                          {layer.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderLayer(layer.id, 'up');
                          }}
                          disabled={idx === doc.layers.length - 1}
                          className="p-1 rounded hover:bg-muted hover:text-foreground disabled:opacity-25 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderLayer(layer.id, 'down');
                          }}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-muted hover:text-foreground disabled:opacity-25 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLayerVisibility(layer.id, !layer.visible);
                          }}
                          className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors"
                          title={layer.visible ? "Hide Layer" : "Show Layer"}
                        >
                          {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLayer(layer.id);
                            if (selectedLayerId === layer.id) selectLayer(null);
                          }}
                          className="p-1 rounded hover:bg-destructive/15 hover:text-destructive text-muted-foreground transition-colors"
                          title="Delete Layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 3: Inspect Properties */}
        <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <PropertiesPanel />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 4: CAM Linter & Analytics */}
        <TabsContent value="cam" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-5">
              {/* Feasibility Alert Card */}
              <div className={cn(
                "p-3 rounded-lg border flex items-start gap-2.5",
                analytics.isValidated
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-300"
              )}>
                {analytics.isValidated ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-semibold">
                    {analytics.isValidated ? "100% Laser Cutting Feasible" : "Manufacturing Warnings Found"}
                  </h4>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    {analytics.isValidated
                      ? "All contours closed, kerf clearances validated, and structural stencil bridges verified."
                      : "The active design violates one or more CNC cutting rules. Review issues below before cutting."}
                  </p>
                </div>
              </div>

              {/* Validation Issues List */}
              {analytics.validationIssues && analytics.validationIssues.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Violations ({analytics.validationIssues.length})
                  </Label>
                  <div className="space-y-2">
                    {analytics.validationIssues.map((issue, idx) => {
                      const targetLayer = issue.layerId ? doc.layers.find(l => l.id === issue.layerId) : null;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "p-2.5 rounded-md border text-xs space-y-1.5",
                            issue.severity === 'error'
                              ? "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                              : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                          )}
                        >
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                            <ShieldAlert className="w-3.5 h-3.5 text-destructive" />
                            <span>[{issue.ruleId}]</span>
                          </div>
                          <p className="text-[11px] leading-tight text-foreground/90">
                            {issue.message}
                          </p>

                          {/* Quick-Fix for CAM-01: Convert to Vector Score (Etch) */}
                          {issue.ruleId === 'CAM-01' && targetLayer && targetLayer.type === 'vector_path' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] gap-1.5 mt-1 border-primary/40 hover:bg-primary/20 text-primary w-full justify-center font-medium"
                              onClick={() => {
                                setLayerCamLayer(targetLayer.id, '2_VECTOR_SCORE');
                                selectLayer(targetLayer.id);
                                toast({
                                  title: "Converted to Surface Score/Etch",
                                  description: `Layer "${targetLayer.name}" will be surface-scored. Fallout risk eliminated.`,
                                });
                              }}
                            >
                              <Sparkles className="w-3 h-3 text-primary" />
                              Convert to Vector Score (Surface Etch)
                            </Button>
                          )}

                          {/* Quick-Fix for CAM-04: Auto-Center in Safe Zone */}
                          {issue.ruleId === 'CAM-04' && targetLayer && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] gap-1.5 mt-1 border-amber-500/40 hover:bg-amber-500/20 text-amber-300 w-full justify-center font-medium"
                              onClick={() => {
                                const w = targetLayer.type === 'typography'
                                  ? (targetLayer.rawText?.length || 1) * targetLayer.fontSizeMm * 0.7
                                  : targetLayer.type === 'vector_path'
                                  ? targetLayer.boundsMm?.widthMm || 50
                                  : targetLayer.type === 'mounting_hole'
                                  ? targetLayer.diameterMm
                                  : targetLayer.widthMm;
                                const h = targetLayer.type === 'typography'
                                  ? targetLayer.fontSizeMm
                                  : targetLayer.type === 'vector_path'
                                  ? targetLayer.boundsMm?.heightMm || 50
                                  : targetLayer.type === 'mounting_hole'
                                  ? targetLayer.diameterMm
                                  : targetLayer.heightMm;
                                const newX = Math.max(15, Math.round((doc.boundary.widthMm - w) / 2));
                                const newY = Math.max(15, Math.round((doc.boundary.heightMm - h) / 2));
                                updateTransform(targetLayer.id, { xMm: newX, yMm: newY });
                                selectLayer(targetLayer.id);
                                toast({
                                  title: "Auto-Centered Feature",
                                  description: `Layer "${targetLayer.name}" safely positioned inside plate margins.`,
                                });
                              }}
                            >
                              <Maximize2 className="w-3 h-3 text-amber-300" />
                              Auto-Center in Safe Zone
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manufacturing Metrics Table */}
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Laser Machine Telemetry
                </Label>
                <div className="rounded-lg border border-border bg-background/50 overflow-hidden divide-y divide-border text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Machine Process</span>
                    <span className="font-semibold">3kW Fiber Laser</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Total Cut Length</span>
                    <span className="font-mono font-semibold">
                      {analytics.totalCutLengthMm.toFixed(1)} mm ({(analytics.totalCutLengthMm / 1000).toFixed(2)} m)
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Pierce Count</span>
                    <span className="font-mono font-semibold">{analytics.totalPierceCount} pierces</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Est. Laser Runtime</span>
                    <span className="font-mono font-semibold">{analytics.estimatedCutTimeSec.toFixed(1)} s</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Finished Part Mass</span>
                    <span className="font-mono font-semibold">{analytics.partWeightKg.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Calibrated Kerf Offset</span>
                    <span className="font-mono font-semibold">{doc.material.activeGaugeParams.kerfWidthMm} mm</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">Assist Gas</span>
                    <span className="font-semibold">High-Pressure N₂</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
