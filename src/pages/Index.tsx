import { useCallback } from 'react';
import { EditorProvider, useEditor } from '@/components/editor/EditorContext';
import { ShapePanel } from '@/components/editor/ShapePanel';
import { DesignCanvas } from '@/components/editor/DesignCanvas';
import { ToolsPanel } from '@/components/editor/ToolsPanel';
import { TopBar } from '@/components/editor/TopBar';

function EditorLayout() {
  const { addImage } = useEditor();

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
