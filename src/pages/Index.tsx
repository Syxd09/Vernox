import { useCallback, useEffect } from 'react';
import { EditorProvider } from '@/components/editor/EditorContext';
import { useEditor } from '@/hooks/useEditor';
import { ShapePanel } from '@/components/editor/ShapePanel';
import { DesignCanvas } from '@/components/editor/DesignCanvas';
import { ToolsPanel } from '@/components/editor/ToolsPanel';
import { TopBar } from '@/components/editor/TopBar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Square, Layers, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EditorLayout() {
  const { state, dispatch, addImage } = useEditor();
  const isMobile = useIsMobile();
  useKeyboardShortcuts(dispatch, state.selectedLayerId);

  // ... (rest of the logic remains the same)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!state.selectedLayerId) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      if (!arrows.includes(e.key)) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const layer = state.layers.find(l => l.id === state.selectedLayerId);
      if (!layer) return;
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
      dispatch({ type: 'UPDATE_LAYER', id: layer.id, updates: { x: layer.x + dx, y: layer.y + dy } });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.layers, state.selectedLayerId, dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    files.forEach(f => addImage(f));
  }, [addImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-background"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebars */}
        {!isMobile && <ShapePanel />}
        
        <DesignCanvas />
        
        {!isMobile && <ToolsPanel />}

        {/* Mobile Navigation Bar */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Square className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <ShapePanel />
              </SheetContent>
            </Sheet>

            <div className="w-px h-6 bg-border mx-1" />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Layers className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <ToolsPanel />
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
};

export default Index;
