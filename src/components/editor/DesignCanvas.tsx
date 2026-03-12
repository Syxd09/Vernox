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

  const shape = getShapeById(state.selectedShapeId);
  if (!shape) return null;

  const shapePath = shape.getPath(state.shapeWidth, state.shapeHeight);

  // Center the shape on canvas
  const offsetX = (containerSize.width / state.zoom - state.shapeWidth) / 2;
  const offsetY = (containerSize.height / state.zoom - state.shapeHeight) / 2;

  // Grid lines
  const gridLines = [];
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

  const handleDragEnd = useCallback((layerId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    dispatch({
      type: 'UPDATE_LAYER',
      id: layerId,
      updates: { x: e.target.x() - offsetX, y: e.target.y() - offsetY },
    });
  }, [dispatch, offsetX, offsetY]);

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
        x: node.x() - offsetX,
        y: node.y() - offsetY,
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      },
    });
    dispatch({ type: 'PUSH_HISTORY' });
  }, [dispatch, offsetX, offsetY]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Path' || e.target.getClassName() === 'Rect') {
      dispatch({ type: 'SELECT_LAYER', id: null });
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
    dispatch({ type: 'SET_ZOOM', zoom: state.zoom + delta });
  };

  // Drop handler
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    // We'll use the context's addImage but need to access it differently
    // This is handled in the parent via onDrop
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-muted/30 overflow-hidden relative"
      style={{ cursor: 'default' }}
    >
      {/* Zoom indicator */}
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
          {/* Grid */}
          {gridLines}

          {/* Canvas background */}
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

          {/* Shape clip group */}
          <Group
            x={offsetX}
            y={offsetY}
            clipFunc={(ctx: any) => {
              // Draw clipping path using the SVG path data
              const p = new Path2D(shapePath);
              ctx.beginPath();
              // Manual path following for Konva clipping
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d')!;
              tempCtx.beginPath();

              // We use a trick: parse the SVG path via a Path2D and clip
              // Since Konva doesn't support Path2D directly, we'll draw the shape manually
              drawSVGPathOnContext(ctx, shapePath);
            }}
          >
            {/* Render layers */}
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
                  onDragEnd={(e) => handleDragEnd(layer.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(layer.id, e)}
                  onClick={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                  onTap={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
                />
              );
            })}
          </Group>

          {/* Shape outline (on top) */}
          <Path
            x={offsetX}
            y={offsetY}
            data={shapePath}
            stroke="hsl(220, 20%, 30%)"
            strokeWidth={state.shapeBorderThickness}
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

// Helper to draw SVG path string on a canvas 2D context
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
        x = args[0];
        ctx.lineTo(x, y);
        break;
      case 'V':
        y = args[0];
        ctx.lineTo(x, y);
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
        // Approximate arc with bezier - simplified
        drawArc(ctx, x, y, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        x = args[5]; y = args[6];
        break;
      }
      case 'Z':
        ctx.closePath();
        break;
    }
  }
}

// SVG arc to canvas arc approximation
function drawArc(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  rx: number, ry: number,
  xAxisRotation: number,
  largeArcFlag: number,
  sweepFlag: number,
  x2: number, y2: number
) {
  // Simplified: for circles/ellipses, use canvas arc
  if (rx === 0 || ry === 0) {
    ctx.lineTo(x2, y2);
    return;
  }

  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const phi = (xAxisRotation * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;

  let rxSq = rx * rx, rySq = ry * ry;
  const x1pSq = x1p * x1p, y1pSq = y1p * y1p;

  let lambda = x1pSq / rxSq + y1pSq / rySq;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s; ry *= s;
    rxSq = rx * rx; rySq = ry * ry;
  }

  let sq = Math.max(0, (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq));
  let sign = largeArcFlag === sweepFlag ? -1 : 1;
  const cxp = sign * Math.sqrt(sq) * (rx * y1p / ry);
  const cyp = sign * Math.sqrt(sq) * -(ry * x1p / rx);

  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

  // Use lineTo as a fallback for complex arcs
  const segments = 20;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const px = x1 + t * (x2 - x1);
    const py = y1 + t * (y2 - y1);
    // Simple interpolation (not true arc, but visually okay for clipping)
    const mx = cx + rx * Math.cos(Math.atan2(py - cy, px - cx));
    const my = cy + ry * Math.sin(Math.atan2(py - cy, px - cx));
    ctx.lineTo(px + (mx - px) * 0.5, py + (my - py) * 0.5);
  }
  ctx.lineTo(x2, y2);
}
