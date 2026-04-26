import { useRef, useCallback, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

import { useEditor } from './EditorContext';
import { getShapeById } from '@/lib/shapes';
import { exportCanvasAsSVG } from '@/lib/imageProcessing';
import { exportAsDXF } from '@/lib/exportDXF';
import { Button } from '@/components/ui/button';
import {
  Upload, Undo2, Redo2, Download, ZoomIn, ZoomOut,
  Grid3X3, FileImage, FileCode, Scissors, Sparkles, Save, FolderOpen, Trash2,
  FileText, FileJson, Layers, ChevronDown
} from 'lucide-react';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { listProjects, saveProject, loadProject, deleteProject, SavedProject } from '@/lib/projectStorage';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


export function TopBar() {
  const { state, dispatch, addImage } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    if (saveOpen || loadOpen) setProjects(listProjects());
  }, [saveOpen, loadOpen]);

  const handleSave = () => {
    const name = projectName.trim() || `Project ${new Date().toLocaleString()}`;
    saveProject(name, state);
    toast({ title: 'Project saved', description: name });
    setSaveOpen(false);
    setProjectName('');
  };

  const handleLoad = (id: string) => {
    const project = loadProject(id);
    if (!project) return;
    dispatch({ type: 'LOAD_PROJECT', state: project.state });
    toast({ title: 'Project loaded', description: project.name });
    setLoadOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(listProjects());
  };

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

  const handleExportJPG = useCallback(() => {
    const shape = getShapeById(state.selectedShapeId);
    if (!shape) return;

    const canvas = document.createElement('canvas');
    canvas.width = state.shapeWidth;
    canvas.height = state.shapeHeight;
    const ctx = canvas.getContext('2d')!;

    // Fill white background for JPG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      ctx.strokeStyle = '#333';
      ctx.lineWidth = state.shapeBorderThickness;
      ctx.stroke(path2d);

      const link = document.createElement('a');
      link.download = `metal-shape-${state.selectedShapeId}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    });
  }, [state]);

  const handleExportPDF = useCallback(() => {
    const shape = getShapeById(state.selectedShapeId);
    if (!shape) return;

    const canvas = document.createElement('canvas');
    canvas.width = state.shapeWidth * 2; // Higher resolution for PDF
    canvas.height = state.shapeHeight * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(2, 2);

    const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
    const path2d = new Path2D(shapePath);
    ctx.clip(path2d);

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
      ctx.strokeStyle = '#333';
      ctx.lineWidth = state.shapeBorderThickness;
      ctx.stroke(path2d);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: state.shapeWidth > state.shapeHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [state.shapeWidth, state.shapeHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, state.shapeWidth, state.shapeHeight);
      pdf.save(`metal-shape-${state.selectedShapeId}.pdf`);
    });
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
        onClick={() => {
          const nextState = !state.showGrid;
          dispatch({ type: 'TOGGLE_GRID' });
          toast({ 
            title: nextState ? "Grid Enabled" : "Grid Disabled",
            description: nextState ? "Guidelines are now visible" : "Guidelines are now hidden"
          });
        }}
        className="h-8 w-8"
        title="Toggle Grid"
      >
        <Grid3X3 className="w-3.5 h-3.5" />
      </Button>



      <div className="h-6 w-px bg-border" />

      {/* Metal preview toggle + finish picker */}
      <div className="flex items-center gap-0">
        <Button
          size="sm"
          variant={state.metalPreview ? 'secondary' : 'ghost'}
          className={cn(
            "h-8 text-xs gap-1.5 px-2 rounded-r-none border-r-0",
            state.metalPreview && "bg-secondary text-secondary-foreground"
          )}
          onClick={() => {
            const nextState = !state.metalPreview;
            dispatch({ type: 'TOGGLE_METAL_PREVIEW' });
            toast({ 
              title: nextState ? "Metal Preview Enabled" : "Metal Preview Disabled",
              description: nextState ? `Visualizing with ${state.metalFinish} finish` : "Returned to design mode"
            });
          }}
          title="Toggle Metal Preview"

        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline capitalize">{state.metalPreview ? state.metalFinish : 'Preview'}</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant={state.metalPreview ? 'secondary' : 'ghost'} 
              className="h-8 w-5 px-0 rounded-l-none border-l-0"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold">Select Material Finish</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={state.metalFinish}
              onValueChange={(v) => {
                dispatch({ type: 'SET_METAL_FINISH', finish: v as any });
                if (!state.metalPreview) dispatch({ type: 'TOGGLE_METAL_PREVIEW' });
              }}
            >
              <DropdownMenuRadioItem value="steel" className="text-xs">Brushed Steel</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="brass" className="text-xs">Brass</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="copper" className="text-xs">Copper</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="gold" className="text-xs">Gold</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="h-6 w-px bg-border" />

      {/* Save / Load */}
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8" 
        title="Save Project"
        onClick={() => setSaveOpen(true)}
      >
        <Save className="w-3.5 h-3.5" />
      </Button>
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-xs text-muted-foreground">Project name</label>
            <Input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My metal sign"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8" 
        title="Open Project"
        onClick={() => {
          setProjects(listProjects());
          setLoadOpen(true);
        }}
      >
        <FolderOpen className="w-3.5 h-3.5" />
      </Button>
      <Dialog open={loadOpen} onOpenChange={setLoadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto -mx-2 px-2">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No saved projects yet.</p>
            ) : (
              <ul className="space-y-1">
                {projects.sort((a, b) => b.updatedAt - a.updatedAt).map(p => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted group"
                  >
                    <button
                      onClick={() => handleLoad(p.id)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(p.updatedAt).toLocaleString()} · {(p.state.layers?.length ?? 0)} layers
                      </div>
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
          <DropdownMenuItem onClick={handleExportJPG}>
            <FileImage className="w-4 h-4 mr-2 text-orange-500" /> Export as JPG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportSVG}>
            <FileCode className="w-4 h-4 mr-2" /> Export as SVG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2 text-red-500" /> Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportSVG}>
            <Layers className="w-4 h-4 mr-2 text-blue-500" /> Export for CorelDRAW (SVG)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            const shape = getShapeById(state.selectedShapeId);
            if (!shape) return;
            const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
            const dxfContent = exportAsDXF(shapePath, state.shapeWidth, state.shapeHeight);
            const blob = new Blob([dxfContent], { type: 'application/dxf' });
            const link = document.createElement('a');
            link.download = `metal-shape-${state.selectedShapeId}.dxf`;
            link.href = URL.createObjectURL(blob);
            link.click();
          }}>
            <Scissors className="w-4 h-4 mr-2" /> Export as DXF (Laser)
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
