import { useCallback, useEffect } from 'react';
import { EditorProvider } from '@/components/editor/EditorContext';
import { useEditor } from '@/hooks/useEditor';
import { ShapePanel } from '@/components/editor/ShapePanel';
import { DesignCanvas } from '@/components/editor/DesignCanvas';
import { ToolsPanel } from '@/components/editor/ToolsPanel';
import { TopBar } from '@/components/editor/TopBar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function EditorLayout() {
  const { state, dispatch, addImage } = useEditor();
  useKeyboardShortcuts(dispatch, state.selectedLayerId);

  // Arrow-key nudge for selected layer (Shift = 10px)
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
      className="h-screen flex flex-col overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ShapePanel />
        <DesignCanvas />
        <ToolsPanel />
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
