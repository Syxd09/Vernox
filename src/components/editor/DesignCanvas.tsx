import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Group, Path, Image as KonvaImage, Transformer, Line, Rect } from 'react-konva';
import { useEditor } from './EditorContext';
import { getShapeById } from '@/lib/shapes';
import Konva from 'konva';

const METAL_FINISHES: Record<string, { base: string; highlight: string; shadow: string; border: string }> = {
  steel:  { base: '#9ea4ad', highlight: '#e8ecf1', shadow: '#4a4f57', border: '#2c3036' },
  brass:  { base: '#b8923d', highlight: '#f5dc8a', shadow: '#5e4516', border: '#3a2c0e' },
  copper: { base: '#b8693d', highlight: '#f0a877', shadow: '#5e2e16', border: '#3a1c0e' },
  gold:   { base: '#d4a93a', highlight: '#fceb95', shadow: '#7a5a10', border: '#4a3608' },
};

export function DesignCanvas() {
  const { state, dispatch } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [gridImage, setGridImage] = useState<HTMLCanvasElement | null>(null);

  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Initialize grid pattern
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      // Draw grid cell lines
      ctx.moveTo(0, 0);
      ctx.lineTo(50, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 50);
      ctx.stroke();
    }
    setGridImage(canvas);
  }, []);


  // Load images
  useEffect(() => {
    state.layers.forEach(layer => {
      if (!loadedImages[layer.id] || loadedImages[layer.id].src !== layer.imageData) {
        const img = new window.Image();
        img.src = layer.imageData;
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [layer.id]: img }));
        };
      }
    });
  }, [state.layers]);

  // Update transformer
  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (state.selectedLayerId) {
      const node = stage.findOne(`#layer-${state.selectedLayerId}`);
      if (node) {
        tr.nodes([node]);
        tr.getLayer()?.batchDraw();
        return;
      }
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [state.selectedLayerId, state.layers]);

  const handleDragEnd = useCallback((layerId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    dispatch({
      type: 'UPDATE_LAYER',
      id: layerId,
      updates: { x: e.target.x(), y: e.target.y() },
    });
    dispatch({ type: 'PUSH_HISTORY' });
  }, [dispatch]);

  const handleTransformEnd = useCallback((layerId: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    dispatch({
      type: 'UPDATE_LAYER',
      id: layerId,
      updates: {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      },
    });
    dispatch({ type: 'PUSH_HISTORY' });
  }, [dispatch]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      dispatch({ type: 'SELECT_LAYER', id: null });
    }
  }, [dispatch]);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const delta = e.evt.deltaY > 0 ? -0.05 : 0.05;
    dispatch({ type: 'SET_ZOOM', zoom: state.zoom + delta });
  }, [dispatch, state.zoom]);

  // Middle-click panning
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1 || (e.evt.button === 0 && e.evt.altKey)) {
      isPanning.current = true;
      lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY };
      e.evt.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isPanning.current) return;
    const dx = e.evt.clientX - lastPointer.current.x;
    const dy = e.evt.clientY - lastPointer.current.y;
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const shape = getShapeById(state.selectedShapeId);
  if (!shape) return <div className="flex-1 flex items-center justify-center text-muted-foreground">No shape selected</div>;

  const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
  const offsetX = (containerSize.width / state.zoom - state.shapeWidth) / 2 + panOffset.x / state.zoom;
  const offsetY = (containerSize.height / state.zoom - state.shapeHeight) / 2 + panOffset.y / state.zoom;

  // Grid pattern rect
  const gridRect = state.showGrid && gridImage && (
    <Rect
      x={0}
      y={0}
      width={containerSize.width / state.zoom}
      height={containerSize.height / state.zoom}
      fillPatternImage={gridImage as any}
      fillPatternOffset={{ 
        x: -panOffset.x / state.zoom, 
        y: -panOffset.y / state.zoom 
      }}
      listening={false}
      opacity={state.metalPreview ? 0.4 : 1}
    />
  );



  // Center guides for shape
  const centerGuides = (
    <>
      <Line
        points={[offsetX + state.shapeWidth / 2, offsetY - 15, offsetX + state.shapeWidth / 2, offsetY + state.shapeHeight + 15]}
        stroke="hsl(220, 70%, 50%)"
        strokeWidth={0.5}
        dash={[4, 4]}
        opacity={0.3}
      />
      <Line
        points={[offsetX - 15, offsetY + state.shapeHeight / 2, offsetX + state.shapeWidth + 15, offsetY + state.shapeHeight / 2]}
        stroke="hsl(220, 70%, 50%)"
        strokeWidth={0.5}
        dash={[4, 4]}
        opacity={0.3}
      />
    </>
  );

  const finish = METAL_FINISHES[state.metalFinish] ?? METAL_FINISHES.steel;

  return (
    <div ref={containerRef} className="flex-1 bg-muted/30 overflow-hidden relative cursor-crosshair">
      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded-md px-3 py-1.5 text-xs font-mono text-muted-foreground shadow-sm">
        {Math.round(state.zoom * 100)}%
      </div>

      {state.metalPreview && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card border border-border rounded-md px-3 py-1.5 text-xs font-medium text-foreground shadow-sm capitalize">
          {state.metalFinish} Preview
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 z-10 bg-card/80 border border-border rounded-md px-3 py-1.5 text-[10px] text-muted-foreground shadow-sm space-x-3">
        <span>Ctrl+Z Undo</span>
        <span>Del Remove</span>
        <span>Scroll Zoom</span>
        <span>Alt+Drag Pan</span>
      </div>

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        scaleX={state.zoom}
        scaleY={state.zoom}
        onClick={handleStageClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {gridRect}


          {/* Shape background shadow */}
          <Rect
            x={offsetX - 10}
            y={offsetY - 10}
            width={state.shapeWidth + 20}
            height={state.shapeHeight + 20}
            fill={state.metalPreview ? 'transparent' : 'white'}
            shadowColor={state.metalPreview ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}
            shadowBlur={state.metalPreview ? 35 : 25}
            shadowOffsetY={state.metalPreview ? 12 : 6}
            cornerRadius={4}
          />

          {/* Metal base fill */}
          {state.metalPreview && (
            <Path
              x={offsetX}
              y={offsetY}
              data={shapePath}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: state.shapeWidth, y: state.shapeHeight }}
              fillLinearGradientColorStops={[
                0, finish.highlight,
                0.35, finish.base,
                0.7, finish.shadow,
                1, finish.base,
              ]}
              listening={false}
            />
          )}

          {/* Center guides */}
          {!state.metalPreview && centerGuides}

          {/* Ghost image (unclipped) - only for selected layer to show cropping area */}
          <Group x={offsetX} y={offsetY} listening={false}>
            {state.layers.map(layer => {
              if (state.selectedLayerId !== layer.id || !layer.visible || !loadedImages[layer.id]) return null;
              return (
                <KonvaImage
                  key={`ghost-${layer.id}`}
                  image={loadedImages[layer.id]}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  rotation={layer.rotation}
                  opacity={0.15}
                />
              );
            })}
          </Group>

          {/* Clipped image group */}

          <Group
            x={offsetX}
            y={offsetY}
            clipFunc={(ctx: any) => {
              const p = new Path2D(shapePath);
              ctx.clip(p);
            }}

          >
            {/* Inner fill — white in design mode, transparent over metal in preview */}
            {!state.metalPreview && (
              <Rect x={0} y={0} width={state.shapeWidth} height={state.shapeHeight} fill="white" />
            )}

            {state.layers.map(layer => {
              if (!layer.visible || !loadedImages[layer.id]) return null;
              return (
                <KonvaImage
                  key={layer.id}
                  id={`layer-${layer.id}`}
                  image={loadedImages[layer.id]}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  rotation={layer.rotation}
                  opacity={layer.opacity * (state.metalPreview ? 0.92 : 1)}
                  draggable={!layer.locked}
                  onDragEnd={(e) => handleDragEnd(layer.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(layer.id, e)}
                  onClick={(e) => { e.cancelBubble = true; dispatch({ type: 'SELECT_LAYER', id: layer.id }); }}
                  onTap={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                />
              );
            })}

            {/* Metallic sheen overlay inside shape */}
            {state.metalPreview && (
              <>
                <Rect
                  x={0}
                  y={0}
                  width={state.shapeWidth}
                  height={state.shapeHeight}
                  fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                  fillLinearGradientEndPoint={{ x: state.shapeWidth, y: state.shapeHeight }}
                  fillLinearGradientColorStops={[
                    0, 'rgba(255,255,255,0.45)',
                    0.4, 'rgba(255,255,255,0)',
                    0.6, 'rgba(0,0,0,0)',
                    1, 'rgba(0,0,0,0.35)',
                  ]}
                  listening={false}
                />
                <Rect
                  x={0}
                  y={0}
                  width={state.shapeWidth}
                  height={state.shapeHeight}
                  fillLinearGradientStartPoint={{ x: state.shapeWidth, y: 0 }}
                  fillLinearGradientEndPoint={{ x: 0, y: state.shapeHeight }}
                  fillLinearGradientColorStops={[
                    0, 'rgba(255,255,255,0.2)',
                    0.5, 'rgba(255,255,255,0)',
                    1, 'rgba(0,0,0,0.15)',
                  ]}
                  listening={false}
                />
              </>
            )}
          </Group>

          {/* Shape border */}
          <Path
            x={offsetX}
            y={offsetY}
            data={shapePath}
            stroke={state.metalPreview ? finish.border : 'hsl(220, 20%, 30%)'}
            strokeWidth={state.metalPreview ? Math.max(state.shapeBorderThickness, 1.5) : state.shapeBorderThickness}
            fill="transparent"
            listening={false}
          />

          {/* Transformer */}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
            borderStroke="hsl(220, 70%, 50%)"
            anchorStroke="hsl(220, 70%, 50%)"
            anchorFill="white"
            anchorSize={8}
            anchorCornerRadius={2}
          />
        </Layer>
      </Stage>
    </div>
  );
}


