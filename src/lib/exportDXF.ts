/**
 * AutoCAD 2000 (AC1015) DXF CAM Exporter
 * Emits continuous LWPOLYLINE closed toolpaths with topological ordering
 */

import { VectorGeometryEngine } from './vectorGeometry';
import type { PathCommand } from './cadEngineTypes';

export interface DXFExportOptions {
  shapeWidthMm?: number;
  shapeHeightMm?: number;
  outerPerimeterPath?: string;
  innerCutPaths?: string[];
  scorePaths?: string[];
}

export function exportAsDXF(
  shapePath: string, 
  shapeWidth = 300, 
  shapeHeight = 200, 
  options?: Partial<DXFExportOptions>
): string {
  const lines: string[] = [];

  // 1. Header Section
  lines.push('0', 'SECTION', '2', 'HEADER');
  lines.push('9', '$ACADVER', '1', 'AC1015'); // AutoCAD 2000
  lines.push('9', '$INSUNITS', '70', '4');    // 4 = Millimetres
  lines.push('9', '$MEASUREMENT', '70', '1'); // 1 = Metric
  lines.push('9', '$EXTMIN', '10', '0.0', '20', '0.0', '30', '0.0');
  lines.push('9', '$EXTMAX', '10', String(shapeWidth), '20', String(shapeHeight), '30', '0.0');
  lines.push('0', 'ENDSEC');

  // 2. Tables & Layer Definitions
  lines.push('0', 'SECTION', '2', 'TABLES');
  lines.push('0', 'TABLE', '2', 'LAYER', '70', '3');
  // Layer 0_CUT_INNER: Red (Color 1)
  lines.push('0', 'LAYER', '2', '0_CUT_INNER', '70', '0', '62', '1', '6', 'CONTINUOUS');
  // Layer 1_CUT_OUTER: White (Color 7)
  lines.push('0', 'LAYER', '2', '1_CUT_OUTER', '70', '0', '62', '7', '6', 'CONTINUOUS');
  // Layer 2_SCORE_VECTOR: Blue (Color 5)
  lines.push('0', 'LAYER', '2', '2_SCORE_VECTOR', '70', '0', '62', '5', '6', 'CONTINUOUS');
  lines.push('0', 'ENDTAB');
  lines.push('0', 'ENDSEC');

  // 3. Entities Section
  lines.push('0', 'SECTION', '2', 'ENTITIES');

  let entityHandle = 100;

  const emitLwPolyline = (points: [number, number][], layerName: string, isClosed: boolean) => {
    if (points.length < 2) return;
    lines.push('0', 'LWPOLYLINE');
    lines.push('5', (entityHandle++).toString(16).toUpperCase());
    lines.push('8', layerName);
    lines.push('90', String(points.length));
    lines.push('70', isClosed ? '1' : '0'); // 1 = closed polyline
    lines.push('43', '0.0');                // Constant width 0

    for (const [x, y] of points) {
      lines.push('10', x.toFixed(4));
      lines.push('20', (shapeHeight - y).toFixed(4)); // Standard CAD Cartesian coordinates
    }
  };

  // Topological ordering:
  // Step 1: Internal cuts first (holes, inner counters)
  if (options?.innerCutPaths && options.innerCutPaths.length > 0) {
    for (const innerPath of options.innerCutPaths) {
      const pts = pathToDiscretePoints(innerPath);
      emitLwPolyline(pts, '0_CUT_INNER', true);
    }
  }

  // Step 2: Surface scoring lines
  if (options?.scorePaths && options.scorePaths.length > 0) {
    for (const scorePath of options.scorePaths) {
      const pts = pathToDiscretePoints(scorePath);
      emitLwPolyline(pts, '2_SCORE_VECTOR', false);
    }
  }

  // Step 3: Outer perimeter cut last
  const outer = options?.outerPerimeterPath || shapePath;
  if (outer) {
    const pts = pathToDiscretePoints(outer);
    emitLwPolyline(pts, '1_CUT_OUTER', true);
  }

  lines.push('0', 'ENDSEC');
  lines.push('0', 'EOF');

  return lines.join('\n');
}

/**
 * Discretize SVG path commands into sampled 2D metric vertices
 */
function pathToDiscretePoints(pathData: string): [number, number][] {
  const commands = VectorGeometryEngine.parsePath(pathData);
  const points: [number, number][] = [];
  let curX = 0, curY = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    if (cmd.op === 'M') {
      curX = cmd.p[0];
      curY = cmd.p[1];
      startX = curX;
      startY = curY;
      points.push([curX, curY]);
    } else if (cmd.op === 'L') {
      curX = cmd.p[0];
      curY = cmd.p[1];
      points.push([curX, curY]);
    } else if (cmd.op === 'C') {
      const [cp1x, cp1y, cp2x, cp2y, endx, endy] = cmd.p;
      const segs = 16;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const pt = VectorGeometryEngine.sampleCubicBezier(
          { x: curX, y: curY },
          { x: cp1x, y: cp1y },
          { x: cp2x, y: cp2y },
          { x: endx, y: endy },
          t
        );
        points.push([pt.x, pt.y]);
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'Q') {
      const [cpx, cpy, endx, endy] = cmd.p;
      const segs = 12;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const mt = 1 - t;
        const px = mt * mt * curX + 2 * mt * t * cpx + t * t * endx;
        const py = mt * mt * curY + 2 * mt * t * cpy + t * t * endy;
        points.push([px, py]);
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'A') {
      const [rx, ry, _rot, _large, _sweep, endx, endy] = cmd.p;
      const segs = 16;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const px = (1 - t) * curX + t * endx;
        const py = (1 - t) * curY + t * endy;
        points.push([px, py]);
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'Z') {
      // Avoid duplicate vertex if last point matches start
      const last = points[points.length - 1];
      if (last && (Math.hypot(last[0] - startX, last[1] - startY) > 1e-4)) {
        points.push([startX, startY]);
      }
      curX = startX;
      curY = startY;
    }
  }

  return points;
}
