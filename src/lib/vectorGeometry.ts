/**
 * Headless Vector Geometry Engine
 * Implements core CAD/CAM geometric math and path operations
 */

import { SVGPathData } from 'svg-pathdata';
import type { 
  Point2D, 
  BoundingBox2D, 
  PathCommand, 
  AnyFeatureLayer,
  AffineTransform2D 
} from './cadEngineTypes';

export class VectorGeometryEngine {
  /**
   * Parse standard SVG path string into normalized absolute PathCommand array
   */
  public static parsePath(d: string): PathCommand[] {
    if (!d || d.trim().length === 0) return [];
    
    // Parse using svg-pathdata
    const parser = new SVGPathData(d);
    // Normalize relative commands and H/V to absolute M/L/C/Q/A/Z
    const normalized = parser.toAbs();
    const commands: PathCommand[] = [];

    let currentPoint: Point2D = { x: 0, y: 0 };
    let subpathStart: Point2D = { x: 0, y: 0 };

    for (const cmd of normalized.commands) {
      switch (cmd.type) {
        case SVGPathData.MOVE_TO:
          currentPoint = { x: cmd.x, y: cmd.y };
          subpathStart = { ...currentPoint };
          commands.push({ op: 'M', p: [cmd.x, cmd.y] });
          break;
        case SVGPathData.LINE_TO:
          currentPoint = { x: cmd.x, y: cmd.y };
          commands.push({ op: 'L', p: [cmd.x, cmd.y] });
          break;
        case SVGPathData.HORIZ_LINE_TO:
          currentPoint = { x: cmd.x, y: currentPoint.y };
          commands.push({ op: 'L', p: [cmd.x, currentPoint.y] });
          break;
        case SVGPathData.VERT_LINE_TO:
          currentPoint = { x: currentPoint.x, y: cmd.y };
          commands.push({ op: 'L', p: [currentPoint.x, cmd.y] });
          break;
        case SVGPathData.CURVE_TO:
          commands.push({ op: 'C', p: [cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y] });
          currentPoint = { x: cmd.x, y: cmd.y };
          break;
        case SVGPathData.QUAD_TO:
          commands.push({ op: 'Q', p: [cmd.x1, cmd.y1, cmd.x, cmd.y] });
          currentPoint = { x: cmd.x, y: cmd.y };
          break;
        case SVGPathData.ARC:
          commands.push({ 
            op: 'A', 
            p: [cmd.rX, cmd.rY, cmd.xRot, Boolean(cmd.lArcFlag), Boolean(cmd.sweepFlag), cmd.x, cmd.y] 
          });
          currentPoint = { x: cmd.x, y: cmd.y };
          break;
        case SVGPathData.CLOSE_PATH:
          commands.push({ op: 'Z' });
          currentPoint = { ...subpathStart };
          break;
        default:
          break;
      }
    }

    return commands;
  }

  /**
   * Serialize PathCommand array to SVG path data string
   */
  public static serializePath(commands: PathCommand[]): string {
    const parts: string[] = [];
    for (const cmd of commands) {
      if (cmd.op === 'M') {
        parts.push(`M ${round(cmd.p[0])} ${round(cmd.p[1])}`);
      } else if (cmd.op === 'L') {
        parts.push(`L ${round(cmd.p[0])} ${round(cmd.p[1])}`);
      } else if (cmd.op === 'C') {
        parts.push(`C ${round(cmd.p[0])} ${round(cmd.p[1])} ${round(cmd.p[2])} ${round(cmd.p[3])} ${round(cmd.p[4])} ${round(cmd.p[5])}`);
      } else if (cmd.op === 'Q') {
        parts.push(`Q ${round(cmd.p[0])} ${round(cmd.p[1])} ${round(cmd.p[2])} ${round(cmd.p[3])}`);
      } else if (cmd.op === 'A') {
        parts.push(`A ${round(cmd.p[0])} ${round(cmd.p[1])} ${cmd.p[2]} ${cmd.p[3] ? 1 : 0} ${cmd.p[4] ? 1 : 0} ${round(cmd.p[5])} ${round(cmd.p[6])}`);
      } else if (cmd.op === 'Z') {
        parts.push('Z');
      }
    }
    return parts.join(' ');
  }

  /**
   * Sample point along cubic Bezier curve at parameter t in [0, 1]
   */
  public static sampleCubicBezier(p0: Point2D, p1: Point2D, p2: Point2D, p3: Point2D, t: number): Point2D {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    };
  }

  /**
   * Compute tight bounding box of path including Bezier extrema
   */
  public static computeBoundingBox(commands: PathCommand[]): BoundingBox2D {
    if (commands.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, widthMm: 0, heightMm: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const includePoint = (x: number, y: number) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    };

    let curX = 0;
    let curY = 0;

    for (const cmd of commands) {
      if (cmd.op === 'M' || cmd.op === 'L') {
        includePoint(cmd.p[0], cmd.p[1]);
        curX = cmd.p[0];
        curY = cmd.p[1];
      } else if (cmd.op === 'C') {
        const [cp1x, cp1y, cp2x, cp2y, endx, endy] = cmd.p;
        includePoint(curX, curY);
        includePoint(endx, endy);

        // Find extrema for x and y
        const rootsX = findCubicBezierExtrema(curX, cp1x, cp2x, endx);
        for (const t of rootsX) {
          if (t > 0 && t < 1) {
            const pt = this.sampleCubicBezier(
              { x: curX, y: curY },
              { x: cp1x, y: cp1y },
              { x: cp2x, y: cp2y },
              { x: endx, y: endy },
              t
            );
            includePoint(pt.x, pt.y);
          }
        }

        const rootsY = findCubicBezierExtrema(curY, cp1y, cp2y, endy);
        for (const t of rootsY) {
          if (t > 0 && t < 1) {
            const pt = this.sampleCubicBezier(
              { x: curX, y: curY },
              { x: cp1x, y: cp1y },
              { x: cp2x, y: cp2y },
              { x: endx, y: endy },
              t
            );
            includePoint(pt.x, pt.y);
          }
        }

        curX = endx;
        curY = endy;
      } else if (cmd.op === 'Q') {
        const [cpx, cpy, endx, endy] = cmd.p;
        includePoint(curX, curY);
        includePoint(endx, endy);
        // Quadratic extrema: B'(t) = 2(1-t)(cp - p0) + 2t(p1 - cp) = 0 => t = (p0 - cp) / (p0 - 2cp + p1)
        const denomX = curX - 2 * cpx + endx;
        if (Math.abs(denomX) > 1e-6) {
          const tx = (curX - cpx) / denomX;
          if (tx > 0 && tx < 1) {
            const x = (1 - tx) * (1 - tx) * curX + 2 * (1 - tx) * tx * cpx + tx * tx * endx;
            const y = (1 - tx) * (1 - tx) * curY + 2 * (1 - tx) * tx * cpy + tx * tx * endy;
            includePoint(x, y);
          }
        }
        const denomY = curY - 2 * cpy + endy;
        if (Math.abs(denomY) > 1e-6) {
          const ty = (curY - cpy) / denomY;
          if (ty > 0 && ty < 1) {
            const x = (1 - ty) * (1 - ty) * curX + 2 * (1 - ty) * ty * cpx + ty * ty * endx;
            const y = (1 - ty) * (1 - ty) * curY + 2 * (1 - ty) * ty * cpy + ty * ty * endy;
            includePoint(x, y);
          }
        }
        curX = endx;
        curY = endy;
      } else if (cmd.op === 'A') {
        const [rx, ry, _rot, _large, _sweep, endx, endy] = cmd.p;
        includePoint(curX, curY);
        includePoint(endx, endy);
        // Approximate arc bounding by sampling along arc
        const samples = 16;
        for (let s = 1; s < samples; s++) {
          const t = s / samples;
          const x = (1 - t) * curX + t * endx;
          const y = (1 - t) * curY + t * endy;
          includePoint(x, y);
        }
        // Include radii extents
        includePoint(Math.min(curX, endx) - rx * 0.1, Math.min(curY, endy) - ry * 0.1);
        includePoint(Math.max(curX, endx) + rx * 0.1, Math.max(curY, endy) + ry * 0.1);
        curX = endx;
        curY = endy;
      }
    }

    if (minX === Infinity) {
      minX = 0; minY = 0; maxX = 0; maxY = 0;
    }

    return {
      minX: round(minX),
      minY: round(minY),
      maxX: round(maxX),
      maxY: round(maxY),
      widthMm: round(maxX - minX),
      heightMm: round(maxY - minY),
    };
  }

  /**
   * Compute total linear path length in millimetres
   */
  public static computePathLengthMm(commands: PathCommand[]): number {
    let totalLength = 0;
    let curX = 0;
    let curY = 0;
    let startX = 0;
    let startY = 0;

    for (const cmd of commands) {
      if (cmd.op === 'M') {
        curX = cmd.p[0];
        curY = cmd.p[1];
        startX = curX;
        startY = curY;
      } else if (cmd.op === 'L') {
        const dx = cmd.p[0] - curX;
        const dy = cmd.p[1] - curY;
        totalLength += Math.sqrt(dx * dx + dy * dy);
        curX = cmd.p[0];
        curY = cmd.p[1];
      } else if (cmd.op === 'C') {
        const [cp1x, cp1y, cp2x, cp2y, endx, endy] = cmd.p;
        // 16-point Gauss-Legendre or subdivision sampling
        let prevPt: Point2D = { x: curX, y: curY };
        const segments = 16;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const pt = this.sampleCubicBezier(
            { x: curX, y: curY },
            { x: cp1x, y: cp1y },
            { x: cp2x, y: cp2y },
            { x: endx, y: endy },
            t
          );
          const dx = pt.x - prevPt.x;
          const dy = pt.y - prevPt.y;
          totalLength += Math.sqrt(dx * dx + dy * dy);
          prevPt = pt;
        }
        curX = endx;
        curY = endy;
      } else if (cmd.op === 'Q') {
        const [cpx, cpy, endx, endy] = cmd.p;
        let prevPt: Point2D = { x: curX, y: curY };
        const segments = 16;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const mt = 1 - t;
          const pt: Point2D = {
            x: mt * mt * curX + 2 * mt * t * cpx + t * t * endx,
            y: mt * mt * curY + 2 * mt * t * cpy + t * t * endy,
          };
          const dx = pt.x - prevPt.x;
          const dy = pt.y - prevPt.y;
          totalLength += Math.sqrt(dx * dx + dy * dy);
          prevPt = pt;
        }
        curX = endx;
        curY = endy;
      } else if (cmd.op === 'A') {
        // Approximate arc length
        const [rx, ry, _rot, _large, _sweep, endx, endy] = cmd.p;
        const chord = Math.hypot(endx - curX, endy - curY);
        const avgR = (rx + ry) / 2;
        // Arc length = 2 * R * asin(chord / 2R) if chord <= 2R
        if (chord <= 2 * avgR && avgR > 0) {
          const angle = 2 * Math.asin(Math.min(1, chord / (2 * avgR)));
          totalLength += avgR * angle;
        } else {
          totalLength += chord;
        }
        curX = endx;
        curY = endy;
      } else if (cmd.op === 'Z') {
        const dx = startX - curX;
        const dy = startY - curY;
        if (Math.hypot(dx, dy) > 1e-4) {
          totalLength += Math.hypot(dx, dy);
        }
        curX = startX;
        curY = startY;
      }
    }

    return round(totalLength, 3);
  }

  /**
   * Topological sorting of toolpaths:
   * 1. 0_CUT_INTERNAL (pierce holes and interior islands first)
   * 2. 2_VECTOR_SCORE (surface fold lines and engravings)
   * 3. 1_CUT_PERIMETER (outer boundary cut last to prevent movement)
   */
  public static sortCutToolpaths(layers: AnyFeatureLayer[]): AnyFeatureLayer[] {
    const priorityMap: Record<string, number> = {
      '0_CUT_INTERNAL': 1,
      '2_VECTOR_SCORE': 2,
      '3_RASTER_ENGRAVE': 3,
      '1_CUT_PERIMETER': 4
    };

    return [...layers].sort((a, b) => {
      const pA = priorityMap[a.camLayer] ?? 2;
      const pB = priorityMap[b.camLayer] ?? 2;
      if (pA !== pB) return pA - pB;
      return a.cutSequencePriority - b.cutSequencePriority;
    });
  }

  /**
   * Check if a point is inside a polygon defined by points (Ray-casting algorithm)
   */
  public static isPointInPolygon(pt: Point2D, poly: Point2D[]): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}

/**
 * Solve cubic bezier derivative roots for finding bounding box extrema
 */
function findCubicBezierExtrema(p0: number, p1: number, p2: number, p3: number): number[] {
  const a = 3 * (-p0 + 3 * p1 - 3 * p2 + p3);
  const b = 6 * (p0 - 2 * p1 + p2);
  const c = 3 * (-p0 + p1);

  if (Math.abs(a) < 1e-9) {
    if (Math.abs(b) > 1e-9) {
      return [-c / b];
    }
    return [];
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];

  const sqrtD = Math.sqrt(discriminant);
  return [
    (-b + sqrtD) / (2 * a),
    (-b - sqrtD) / (2 * a)
  ];
}

function round(val: number, decimals = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
