import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { EditorProvider } from '@/components/editor/EditorContext';
import { ShapePanel } from '@/components/editor/ShapePanel';
import { DesignCanvas } from '@/components/editor/DesignCanvas';
import { ToolsPanel } from '@/components/editor/ToolsPanel';
import { TopBar } from '@/components/editor/TopBar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialShapeId?: string;
  initialWidthMm?: number;
  initialHeightMm?: number;
  initialFinish?: string;
  productName?: string;
}

function StudioBootstrap({ shapeId, w, h, finish }: { shapeId?: string; w?: number; h?: number; finish?: string }) {
  const { state, dispatch } = useEditor();
  useKeyboardShortcuts(dispatch, state.selectedLayerId);
  useEffect(() => {
    if (shapeId) dispatch({ type: 'SET_SHAPE', shapeId });
    if (w || h) dispatch({ type: 'SET_DIMENSIONS', width: w, height: h });
    if (finish) dispatch({ type: 'SET_METAL_FINISH', finish: finish as never });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function InlineStudio({ open, onOpenChange, initialShapeId, initialWidthMm, initialHeightMm, initialFinish, productName }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[95vh] p-0 gap-0 bg-background border-oxblood/30 overflow-hidden">
        <VisuallyHidden><DialogTitle>Design Studio {productName ? `— ${productName}` : ''}</DialogTitle></VisuallyHidden>
        <EditorProvider>
          <StudioBootstrap shapeId={initialShapeId} w={initialWidthMm} h={initialHeightMm} finish={initialFinish} />
          <div className="flex flex-col h-full overflow-hidden">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
              <ShapePanel />
              <DesignCanvas />
              <ToolsPanel />
            </div>
          </div>
        </EditorProvider>
      </DialogContent>
    </Dialog>
  );
}
