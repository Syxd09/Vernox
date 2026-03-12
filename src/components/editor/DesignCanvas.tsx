import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Group, Path, Image as KonvaImage, Transformer, Line, Rect } from 'react-konva';
import { useEditor } from './EditorContext';
import { getShapeById } from '@/lib/shapes';
import Konva from 'konva';

export function DesignCanvas() {
  const { state, dispatch } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

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

  const handleDragEnd = useCallback((layerId: string, e: Konva.KonvaEventObject<DragEvent>, oX: number, oY: number) => {
    dispatch({
      type: 'UPDATE_LAYER',
      id: layerId,
      updates: { x: e.target.x() - oX, y: e.target.y() - oY },
    });
  }, [dispatch]);

  const handleTransformEnd = useCallback((layerId: string, e: Konva.KonvaEventObject<Event>, oX: number, oY: number) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    dispatch({
      type: 'UPDATE_LAYER',
      id: layerId,
      updates: {
        x: node.x() - oX,
        y: node.y() - oY,
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      },
    });
    dispatch({ type: 'PUSH_HISTORY' });
  }, [dispatch]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const className = e.target.getClassName();
    if (e.target === e.target.getStage() || className === 'Path' || className === 'Rect' || className === 'Line') {
      dispatch({ type: 'SELECT_LAYER', id: null });
    }
  }, [dispatch]);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
    dispatch({ type: 'SET_ZOOM', zoom: state.zoom + delta });
  }, [dispatch, state.zoom]);

  const shape = getShapeById(state.selectedShapeId);
  if (!shape) return <div className="flex-1 flex items-center justify-center text-muted-foreground">No shape selected</div>;

  const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);
  const offsetX = (containerSize.width / state.zoom - state.shapeWidth) / 2;
  const offsetY = (containerSize.height / state.zoom - state.shapeHeight) / 2;

  // Grid lines
  const gridLines: React.ReactNode[] = [];
  if (state.showGrid) {
    const gridSize = 20;
    const w = containerSize.width / state.zoom;
    const h = containerSize.height / state.zoom;
    for (let x = 0; x < w; x += gridSize) {
      gridLines.push(<Line key={`gv-${x}`} points={[x, 0, x, h]} stroke="hsl(220, 14%, 86%)" strokeWidth={0.5} opacity={0.3} />);
    }
    for (let y = 0; y < h; y += gridSize) {
      gridLines.push(<Line key={`gh-${y}`} points={[0, y, w, y]} stroke="hsl(220, 14%, 86%)" strokeWidth={0.5} opacity={0.3} />);
    }
  }

  return (
    <div ref={containerRef} className="flex-1 bg-muted/30 overflow-hidden relative">
      <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded-md px-3 py-1.5 text-xs font-mono text-muted-foreground shadow-sm">
        {Math.round(state.zoom * 100)}%
      </div>

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        scaleX={state.zoom}
        scaleY={state.zoom}
        onClick={handleStageClick}
        onWheel={handleWheel}
      >
        <Layer>
          {gridLines}

          <Rect
            x={offsetX - 10}
            y={offsetY - 10}
            width={state.shapeWidth + 20}
            height={state.shapeHeight + 20}
            fill="white"
            shadowColor="rgba(0,0,0,0.08)"
            shadowBlur={20}
            shadowOffsetY={4}
            cornerRadius={4}
          />

          <Group
            x={offsetX}
            y={offsetY}
            clipFunc={(ctx: any) => {
              drawSVGPathOnContext(ctx, shapePath);
            }}
          >
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
                  opacity={layer.opacity}
                  draggable={!layer.locked}
                  onDragEnd={(e) => handleDragEnd(layer.id, e, offsetX, offsetY)}
                  onTransformEnd={(e) => handleTransformEnd(layer.id, e, offsetX, offsetY)}
                  onClick={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                  onTap={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                />
              );
            })}
          </Group>

          <Path
            x={offsetX}
            y={offsetY}
            data={shapePath}
            stroke="hsl(220, 20%, 30%)"
            strokeWidth={state.shapeBorderThickness}
            fill="transparent"
            listening={false}
          />

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

function drawSVGPathOnContext(ctx: CanvasRenderingContext2D, pathData: string) {
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  let x = 0, y = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

    switch (type.toUpperCase()) {
      case 'M':
        ctx.moveTo(args[0], args[1]);
        x = args[0]; y = args[1];
        break;
      case 'L':
        ctx.lineTo(args[0], args[1]);
        x = args[0]; y = args[1];
        break;
      case 'H':
        x = args[0]; ctx.lineTo(x, y);
        break;
      case 'V':
        y = args[0]; ctx.lineTo(x, y);
        break;
      case 'C':
        ctx.bezierCurveTo(args[0], args[1], args[2], args[3], args[4], args[5]);
        x = args[4]; y = args[5];
        break;
      case 'Q':
        ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
        x = args[2]; y = args[3];
        break;
      case 'A': {
        approximateArc(ctx, x, y, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        x = args[5]; y = args[6];
        break;
      }
      case 'Z':
        ctx.closePath();
        break;
    }
  }
}

function approximateArc(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  rx: number, ry: number,
  _rotation: number, _largeArc: number, _sweep: number,
  x2: number, y2: number
) {
  if (rx === 0 || ry === 0) { ctx.lineTo(x2, y2); return; }
  // Approximate with line segments along the arc path
  const segments = 24;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    // Parametric approximation
    const angle = Math.PI * t;
    const mx = x1 + (x2 - x1) * t;
    const my = y1 + (y2 - y1) * t;
    // Add curvature
    const bulge = Math.sin(angle) * Math.min(rx, ry) * 0.5 * (_sweep ? 1 : -1);
    const dx = -(y2 - y1);
    const dy = x2 - x1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.lineTo(mx + (dx / len) * bulge, my + (dy / len) * bulge);
  }
}
