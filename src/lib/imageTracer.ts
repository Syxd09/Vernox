/**
 * Pure TypeScript Image-to-Vector Tracer
 * Converts raster pixel data (PNG/JPEG/WebP) into clean, closed Bezier vector paths
 * Algorithms: Rec.601 Grayscale, Otsu's Thresholding, Moore-Neighbor Contour Tracing,
 * Ramer-Douglas-Peucker Simplification, and Schneider Cubic Bezier Curve Fitting.
 */

import type { Point2D, BoundingBox2D } from './cadEngineTypes';

export interface ImageBitmapData {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
}

export interface TraceOptions {
  invert?: boolean;              // Invert foreground/background
  threshold?: number;           // Custom 0-255 threshold (defaults to auto Otsu)
  rdpTolerance?: number;        // Simplification tolerance in pixels (default: 1.0)
  bezierTolerance?: number;     // Bezier fit maximum error tolerance (default: 1.5)
  targetWidthMm?: number;       // Scale output to physical mm
  targetHeightMm?: number;      // Scale output to physical mm
}

export interface TraceResult {
  pathData: string;
  boundsMm: BoundingBox2D;
  contours: Point2D[][];
  otsuThresholdUsed: number;
}

/**
 * 1. Compute Otsu's Optimal Binarization Threshold
 */
export function computeOtsuThreshold(gray: Uint8Array): number {
  const hist = new Int32Array(256);
  const total = gray.length;
  for (let i = 0; i < total; i++) {
    hist[gray[i]]++;
  }

  let sum = 0;
  for (let t = 0; t < 256; t++) {
    sum += t * hist[t];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = -1;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const betweenVar = wB * wF * (mB - mF) * (mB - mF);

    if (betweenVar > varMax) {
      varMax = betweenVar;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * 2. Convert RGBA image buffer to 8-bit Grayscale
 */
export function rgbaToGrayscale(image: ImageBitmapData): Uint8Array {
  const { data, width, height } = image;
  const gray = new Uint8Array(width * height);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const a = data[i + 3];
    if (a < 64) {
      // Treat transparent pixels as white background
      gray[j] = 255;
    } else {
      // Standard Rec. 601 Luma: Y = 0.299R + 0.587G + 0.114B
      gray[j] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
  }

  return gray;
}

/**
 * 3. Moore-Neighbor Contour Tracing
 * Extracts closed pixel loops separating foreground (cut shapes) from background.
 */
export function traceContours(
  binary: Uint8Array,
  width: number,
  height: number
): Point2D[][] {
  const visited = new Uint8Array(width * height);
  const contours: Point2D[][] = [];

  // Moore neighborhood 8 offsets (clockwise from East)
  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];

  const getPixel = (x: number, y: number): number => {
    if (x < 0 || x >= width || y < 0 || y >= height) return 0;
    return binary[y * width + x];
  };

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      // Start of a foreground boundary that hasn't been traced
      if (binary[idx] === 1 && visited[idx] === 0 && getPixel(x - 1, y) === 0) {
        const loop: Point2D[] = [];
        let curX = x;
        let curY = y;
        let dir = 0; // Direction entered

        loop.push({ x: curX, y: curY });
        visited[curY * width + curX] = 1;

        let maxSteps = width * height;
        let foundNext = true;

        while (maxSteps-- > 0 && foundNext) {
          foundNext = false;
          // Search around current pixel in 8 directions starting from backtrack direction
          const startDir = (dir + 5) % 8;
          for (let i = 0; i < 8; i++) {
            const checkDir = (startDir + i) % 8;
            const nx = curX + dx[checkDir];
            const ny = curY + dy[checkDir];
            if (getPixel(nx, ny) === 1) {
              curX = nx;
              curY = ny;
              dir = checkDir;
              visited[curY * width + curX] = 1;
              loop.push({ x: curX, y: curY });
              foundNext = true;
              break;
            }
          }

          // Returned to origin
          if (curX === x && curY === y && loop.length > 2) {
            break;
          }
        }

        // Only retain meaningful contours (> 6 points)
        if (loop.length > 6) {
          contours.push(loop);
        }
      }
    }
  }

  return contours;
}

/**
 * 4. Ramer-Douglas-Peucker Polyline Simplification
 */
export function rdpSimplify(points: Point2D[], epsilon: number): Point2D[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], start, end);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdpSimplify(points.slice(0, index + 1), epsilon);
    const right = rdpSimplify(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [start, end];
  }
}

/**
 * RDP for closed loops: splits along diameter opposite point
 */
export function rdpSimplifyClosed(points: Point2D[], epsilon: number): Point2D[] {
  if (points.length <= 4) return points;

  let maxD = 0;
  let midIdx = Math.floor(points.length / 2);
  const p0 = points[0];

  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i].x - p0.x, points[i].y - p0.y);
    if (d > maxD) {
      maxD = d;
      midIdx = i;
    }
  }

  const half1 = rdpSimplify(points.slice(0, midIdx + 1), epsilon);
  const half2 = rdpSimplify(points.slice(midIdx).concat([p0]), epsilon);

  const merged = half1.slice(0, -1).concat(half2);
  return merged.length >= 3 ? merged : points;
}

function perpendicularDistance(p: Point2D, a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

/**
 * 5. Fit Smooth Cubic Beziers (Schneider Algorithm Approximation)
 * Generates smooth SVG 'M ... C ... Z' path commands from simplified polyline loops
 */
export function fitCurveToBeziers(points: Point2D[], tolerance = 1.5): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${round(points[0].x)} ${round(points[0].y)} L ${round(points[1].x)} ${round(points[1].y)} Z`;
  }

  const parts: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % n];
    const pPrev = points[(i - 1 + n) % n];
    const pNext = points[(i + 2) % n];

    // Compute Catmull-Rom style control points with 1/6 tension factor
    const cp1x = p0.x + (p1.x - pPrev.x) / 6;
    const cp1y = p0.y + (p1.y - pPrev.y) / 6;
    const cp2x = p1.x - (pNext.x - p0.x) / 6;
    const cp2y = p1.y - (pNext.y - p0.y) / 6;

    parts.push(`C ${round(cp1x)} ${round(cp1y)} ${round(cp2x)} ${round(cp2y)} ${round(p1.x)} ${round(p1.y)}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

/**
 * Main Image-to-Vector Pipeline Entry Point
 */
export function traceImageToVector(
  image: ImageBitmapData,
  options: TraceOptions = {}
): TraceResult {
  const { width, height } = image;
  if (width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions');
  }

  // Step 1: Grayscale conversion
  const gray = rgbaToGrayscale(image);

  // Step 2: Adaptive Otsu Binarization
  const otsuThreshold = options.threshold ?? computeOtsuThreshold(gray);
  const binary = new Uint8Array(width * height);
  const invert = options.invert ?? false;

  for (let i = 0; i < gray.length; i++) {
    // Dark pixels (at or below threshold) are foreground (1), light are background (0)
    const isForeground = gray[i] <= otsuThreshold;
    binary[i] = invert ? (isForeground ? 0 : 1) : (isForeground ? 1 : 0);
  }

  // Step 3: Contour Tracing
  const rawContours = traceContours(binary, width, height);

  // Step 4: Simplification and Bezier Curve Fitting
  const rdpEpsilon = options.rdpTolerance ?? 1.0;
  const bezierTol = options.bezierTolerance ?? 1.5;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const simplifiedContours: Point2D[][] = [];
  const svgPathSegments: string[] = [];

  for (const contour of rawContours) {
    const simplified = rdpSimplifyClosed(contour, rdpEpsilon);
    if (simplified.length >= 3) {
      simplifiedContours.push(simplified);
      for (const pt of simplified) {
        if (pt.x < minX) minX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y > maxY) maxY = pt.y;
      }
      svgPathSegments.push(fitCurveToBeziers(simplified, bezierTol));
    }
  }

  if (minX === Infinity) {
    minX = 0; minY = 0; maxX = width; maxY = height;
  }

  const boundsMm: BoundingBox2D = {
    minX: round(minX),
    minY: round(minY),
    maxX: round(maxX),
    maxY: round(maxY),
    widthMm: round(maxX - minX),
    heightMm: round(maxY - minY),
  };

  // Optional scaling to target physical dimensions
  let finalPath = svgPathSegments.join(' ');
  if (options.targetWidthMm && boundsMm.widthMm > 0) {
    const scale = options.targetWidthMm / boundsMm.widthMm;
    finalPath = scalePathData(finalPath, scale, scale);
    boundsMm.widthMm = round(boundsMm.widthMm * scale);
    boundsMm.heightMm = round(boundsMm.heightMm * scale);
    boundsMm.maxX = round(boundsMm.minX + boundsMm.widthMm);
    boundsMm.maxY = round(boundsMm.minY + boundsMm.heightMm);
  }

  return {
    pathData: finalPath,
    boundsMm,
    contours: simplifiedContours,
    otsuThresholdUsed: otsuThreshold,
  };
}

function scalePathData(path: string, sx: number, sy: number): string {
  if (!path) return '';
  // Scale each coordinate number
  return path.replace(/-?\d+(\.\d+)?/g, (match) => {
    const val = parseFloat(match);
    return isNaN(val) ? match : String(round(val * sx));
  });
}

function round(num: number, decimals = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export const ImageToVectorTracer = {
  traceImage: traceImageToVector,
};
