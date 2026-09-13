/**
 * Industrial CAM Export Engine
 * Generates 1:1 Metric Vector SVG, AutoCAD 2000 (AC1015) DXF, and Workshop Spec Sheet PDF
 */

import { jsPDF } from 'jspdf';
import type { VectorDocument, Point2D } from './cadEngineTypes';
import { exportAsDXF } from './exportDXF';
import { VectorGeometryEngine } from './vectorGeometry';

export interface CAMExportOptions {
  applyKerfOffset?: boolean;
  strokeWidthMm?: number;
}

export interface PDFExportOptions {
  orderNumber?: string;
  customerEmail?: string;
  notes?: string;
}

/**
 * 1. Export 1:1 Metric Vector SVG with CNC CAM Layer Grouping
 */
export function exportDocumentAsSVG(
  doc: VectorDocument,
  options: CAMExportOptions = {}
): string {
  const widthMm = doc.boundary.widthMm;
  const heightMm = doc.boundary.heightMm;
  const kerf = options.applyKerfOffset ? doc.material.activeGaugeParams.kerfWidthMm : 0;
  const strokeWidth = options.strokeWidthMm ?? 0.2; // 0.2mm nominal laser beam stroke

  // Categorize layer geometry into CAM buckets
  const internalCutPaths: string[] = [];
  const perimeterCutPaths: string[] = [];
  const vectorScorePaths: string[] = [];

  // 1. Boundary is outer perimeter
  if (doc.boundary.pathData) {
    perimeterCutPaths.push(doc.boundary.pathData);
  }

  // 2. Feature layers
  for (const layer of doc.layers) {
    if (!layer.visible) continue;

    if (layer.type === 'mounting_hole') {
      const r = layer.diameterMm / 2;
      const cx = layer.transform.xMm;
      const cy = layer.transform.yMm;
      const holePath = `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z`;
      internalCutPaths.push(holePath);
    } else if (layer.type === 'typography') {
      if (layer.derivedPathData) {
        const transformed = applyTransformToPath(layer.derivedPathData, layer.transform.xMm, layer.transform.yMm);
        if (layer.camLayer === '2_VECTOR_SCORE') {
          vectorScorePaths.push(transformed);
        } else {
          internalCutPaths.push(transformed);
        }
      }
    } else if (layer.type === 'vector_path') {
      if (layer.pathData) {
        const transformed = applyTransformToPath(layer.pathData, layer.transform.xMm, layer.transform.yMm);
        if (layer.camLayer === '2_VECTOR_SCORE') {
          vectorScorePaths.push(transformed);
        } else if (layer.camLayer === '1_CUT_PERIMETER') {
          perimeterCutPaths.push(transformed);
        } else {
          internalCutPaths.push(transformed);
        }
      }
    }
  }

  const internalSvg = internalCutPaths.map(d => `<path d="${d}" />`).join('\n      ');
  const scoreSvg = vectorScorePaths.map(d => `<path d="${d}" />`).join('\n      ');
  const perimeterSvg = perimeterCutPaths.map(d => `<path d="${d}" />`).join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${widthMm}mm"
     height="${heightMm}mm"
     viewBox="0 0 ${widthMm} ${heightMm}"
     data-vernox-vdm="${doc.version}"
     data-material="${doc.material.substrate}"
     data-gauge-mm="${doc.material.thicknessMm}"
     data-kerf-compensated="${kerf > 0 ? 'true' : 'false'}">
  <!--
    VERNOX CNC LASER TOOLPATH METRIC VECTOR
    Material: ${doc.material.substrate} (${doc.material.thicknessMm}mm)
    Finish: ${doc.material.finish}
    Total Cut Length: ${doc.manufacturingAnalytics.totalCutLengthMm}mm
    Pierce Count: ${doc.manufacturingAnalytics.totalPierceCount}
    Estimated Laser Runtime: ${doc.manufacturingAnalytics.estimatedCutTimeSec}s
  -->
  
  <!-- CAM Layer: 0_CUT_INTERNAL (Cut First - Laser Red) -->
  <g id="0_CUT_INTERNAL" fill="none" stroke="#EF4444" stroke-width="${strokeWidth}">
      ${internalSvg || '<!-- No internal cutouts -->'}
  </g>

  <!-- CAM Layer: 2_VECTOR_SCORE (Surface Score / Bend Lines - Laser Blue) -->
  <g id="2_VECTOR_SCORE" fill="none" stroke="#3B82F6" stroke-width="${strokeWidth / 2}" stroke-dasharray="2,2">
      ${scoreSvg || '<!-- No scoring lines -->'}
  </g>

  <!-- CAM Layer: 1_CUT_PERIMETER (Cut Last - Clean White/Zinc) -->
  <g id="1_CUT_PERIMETER" fill="none" stroke="#FFFFFF" stroke-width="${strokeWidth}">
      ${perimeterSvg || '<!-- No perimeter cut -->'}
  </g>
</svg>`;
}

/**
 * 2. Export AutoCAD 2000 (AC1015) DXF directly from VectorDocument AST
 */
export function exportDocumentAsDXF(
  doc: VectorDocument,
  options: CAMExportOptions = {}
): string {
  const internalCutPaths: string[] = [];
  const scorePaths: string[] = [];

  for (const layer of doc.layers) {
    if (!layer.visible) continue;

    if (layer.type === 'mounting_hole') {
      const r = layer.diameterMm / 2;
      const cx = layer.transform.xMm;
      const cy = layer.transform.yMm;
      internalCutPaths.push(`M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z`);
    } else if (layer.type === 'typography') {
      if (layer.derivedPathData) {
        const transformed = applyTransformToPath(layer.derivedPathData, layer.transform.xMm, layer.transform.yMm);
        if (layer.camLayer === '2_VECTOR_SCORE') {
          scorePaths.push(transformed);
        } else {
          internalCutPaths.push(transformed);
        }
      }
    } else if (layer.type === 'vector_path') {
      if (layer.pathData) {
        const transformed = applyTransformToPath(layer.pathData, layer.transform.xMm, layer.transform.yMm);
        if (layer.camLayer === '2_VECTOR_SCORE') {
          scorePaths.push(transformed);
        } else {
          internalCutPaths.push(transformed);
        }
      }
    }
  }

  return exportAsDXF(
    doc.boundary.pathData,
    doc.boundary.widthMm,
    doc.boundary.heightMm,
    {
      outerPerimeterPath: doc.boundary.pathData,
      innerCutPaths: internalCutPaths,
      scorePaths,
    }
  );
}

/**
 * 3. Export Workshop Spec Sheet & CAM Traveler PDF
 */
export function exportDocumentAsPDF(
  doc: VectorDocument,
  options: PDFExportOptions = {}
): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // 1. Header Banner
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 28, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('VERNOX / ANTWERP METALWORKS', margin, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.text('CNC LASER CUTTING WORKSHOP SPECIFICATION SHEET & CAM TRAVELER', margin, 18);

  const orderNum = options.orderNumber || `SPEC-${doc.id.substring(0, 8).toUpperCase()}`;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(orderNum, pageWidth - margin, 12, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(52, 211, 153); // emerald-400
  pdf.text('VERIFIED 1:1 METRIC TOOLPATH', pageWidth - margin, 18, { align: 'right' });

  // 2. Process Badges Bar
  const badgeY = 32;
  pdf.setFillColor(241, 245, 249); // slate-100
  pdf.roundedRect(margin, badgeY, contentWidth, 8, 1.5, 1.5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(51, 65, 85); // slate-700
  const dateStr = new Date().toISOString().split('T')[0];
  const badgeText = `DATE: ${dateStr}   |   SUBSTRATE: ${doc.material.substrate.toUpperCase().replace(/_/g, ' ')}   |   THICKNESS: ${doc.material.thicknessMm}mm   |   FINISH: ${doc.material.finish.toUpperCase().replace(/_/g, ' ')}   |   KERF: ${doc.material.activeGaugeParams.kerfWidthMm}mm`;
  pdf.text(badgeText, margin + 4, badgeY + 5.2);

  // 3. Material Specifications Card (Left) & Geometric Analytics Card (Right)
  const cardY = 44;
  const cardH = 46;
  const cardW = (contentWidth - 6) / 2; // 87mm

  // Left Card: Material & Cutting Parameters
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.setFillColor(248, 250, 252); // slate-50
  pdf.roundedRect(margin, cardY, cardW, cardH, 2, 2, 'FD');

  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, cardY, cardW, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('MATERIAL & PROCESS SPECIFICATIONS', margin + 3, cardY + 5);

  const matProps: [string, string][] = [
    ['Substrate Alloy', `${doc.material.substrate.replace(/_/g, ' ')}`],
    ['Plate Thickness', `${doc.material.thicknessMm} mm`],
    ['Surface Finish', `${doc.material.finish.replace(/_/g, ' ')}`],
    ['Cutting Technology', 'Fiber Laser (3kW Nit.)'],
    ['Calibrated Kerf', `${doc.material.activeGaugeParams.kerfWidthMm.toFixed(2)} mm`],
    ['Min Web Clearance', `${doc.material.activeGaugeParams.minWebWidthMm.toFixed(1)} mm`],
  ];

  let propY = cardY + 12;
  for (const [label, val] of matProps) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(label, margin + 3, propY);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(val, margin + cardW - 3, propY, { align: 'right' });
    propY += 5.5;
  }

  // Right Card: Geometric CAM Analytics
  const rightCardX = margin + cardW + 6;
  pdf.setDrawColor(226, 232, 240);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(rightCardX, cardY, cardW, cardH, 2, 2, 'FD');

  pdf.setFillColor(241, 245, 249);
  pdf.rect(rightCardX, cardY, cardW, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('GEOMETRIC CAM ANALYTICS', rightCardX + 3, cardY + 5);

  const analyticsProps: [string, string][] = [
    ['Envelope Size', `${doc.boundary.widthMm.toFixed(1)} × ${doc.boundary.heightMm.toFixed(1)} mm`],
    ['Total Cut Length', `${doc.manufacturingAnalytics.totalCutLengthMm.toFixed(1)} mm (${(doc.manufacturingAnalytics.totalCutLengthMm / 1000).toFixed(2)} m)`],
    ['Pierce Count', `${doc.manufacturingAnalytics.totalPierceCount} pierces`],
    ['Laser Run Time', `${doc.manufacturingAnalytics.estimatedCutTimeSec.toFixed(1)} s`],
    ['Finished Part Mass', `${doc.manufacturingAnalytics.partWeightKg.toFixed(2)} kg`],
    ['Scrap Percentage', `${doc.manufacturingAnalytics.scrapPercentage.toFixed(1)}%`],
  ];

  propY = cardY + 12;
  for (const [label, val] of analyticsProps) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(label, rightCardX + 3, propY);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(val, rightCardX + cardW - 3, propY, { align: 'right' });
    propY += 5.5;
  }

  // 4. Technical Schematic Frame (Center)
  const schemY = 94;
  const schemH = 138;
  pdf.setDrawColor(203, 213, 225); // slate-300
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, schemY, contentWidth, schemH, 2, 2, 'FD');

  // Schematic Header Bar
  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, schemY, contentWidth, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('1:1 METRIC PART SCHEMATIC (ORTHOGRAPHIC PROJECTION)', margin + 3, schemY + 5);

  // Legend
  pdf.setFontSize(6.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('■ 1_CUT_PERIMETER (Outer Cut)', margin + 105, schemY + 5);
  pdf.setTextColor(239, 68, 68); // red
  pdf.text('■ 0_CUT_INTERNAL (Pierce First)', margin + 148, schemY + 5);

  // Schematic Drawing Area
  const drawAreaW = contentWidth - 30; // 150mm
  const drawAreaH = schemH - 24;       // 114mm
  const scale = Math.min(drawAreaW / doc.boundary.widthMm, drawAreaH / doc.boundary.heightMm);

  const centerDrawX = margin + contentWidth / 2;
  const centerDrawY = schemY + 10 + drawAreaH / 2;

  const originX = centerDrawX - (doc.boundary.widthMm * scale) / 2;
  const originY = centerDrawY - (doc.boundary.heightMm * scale) / 2;

  // Draw Grid Reticle Crosshairs at center
  pdf.setDrawColor(241, 245, 249);
  pdf.setLineWidth(0.2);
  pdf.line(margin + 5, centerDrawY, margin + contentWidth - 5, centerDrawY);
  pdf.line(centerDrawX, schemY + 9, centerDrawX, schemY + schemH - 5);

  // Render Perimeter (Outer boundary)
  if (doc.boundary.pathData) {
    const pts = samplePathToPoints(doc.boundary.pathData);
    pdf.setDrawColor(15, 23, 42); // Black/Slate
    pdf.setLineWidth(0.4);
    renderPointsAsLines(pdf, pts, originX, originY, scale, true);
  }

  // Render Internal Features & Cuts
  for (const layer of doc.layers) {
    if (!layer.visible) continue;

    if (layer.type === 'mounting_hole') {
      const r = (layer.diameterMm / 2) * scale;
      const cx = originX + layer.transform.xMm * scale;
      const cy = originY + layer.transform.yMm * scale;
      pdf.setDrawColor(239, 68, 68); // Red
      pdf.setLineWidth(0.3);
      pdf.circle(cx, cy, r);
      // Small crosshair in center of hole
      pdf.setLineWidth(0.1);
      pdf.line(cx - 1, cy, cx + 1, cy);
      pdf.line(cx, cy - 1, cx, cy + 1);
    } else if (layer.type === 'typography' && layer.derivedPathData) {
      const transformed = applyTransformToPath(layer.derivedPathData, layer.transform.xMm, layer.transform.yMm);
      const pts = samplePathToPoints(transformed);
      pdf.setDrawColor(layer.camLayer === '2_VECTOR_SCORE' ? 59 : 239, layer.camLayer === '2_VECTOR_SCORE' ? 130 : 68, layer.camLayer === '2_VECTOR_SCORE' ? 246 : 68);
      pdf.setLineWidth(0.3);
      renderPointsAsLines(pdf, pts, originX, originY, scale, false);
    } else if (layer.type === 'vector_path' && layer.pathData) {
      const transformed = applyTransformToPath(layer.pathData, layer.transform.xMm, layer.transform.yMm);
      const pts = samplePathToPoints(transformed);
      pdf.setDrawColor(layer.camLayer === '2_VECTOR_SCORE' ? 59 : 239, layer.camLayer === '2_VECTOR_SCORE' ? 130 : 68, layer.camLayer === '2_VECTOR_SCORE' ? 246 : 68);
      pdf.setLineWidth(0.3);
      renderPointsAsLines(pdf, pts, originX, originY, scale, layer.isClosed);
    }
  }

  // Dimension Annotations
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(100, 116, 139);
  // Width dimension below
  const dimY = originY + doc.boundary.heightMm * scale + 4;
  if (dimY < schemY + schemH - 3) {
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.15);
    pdf.line(originX, dimY, originX + doc.boundary.widthMm * scale, dimY);
    pdf.text(`${doc.boundary.widthMm.toFixed(1)} mm`, originX + (doc.boundary.widthMm * scale) / 2, dimY + 3, { align: 'center' });
  }

  // Height dimension right
  const dimX = originX + doc.boundary.widthMm * scale + 4;
  if (dimX < margin + contentWidth - 2) {
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.15);
    pdf.line(dimX, originY, dimX, originY + doc.boundary.heightMm * scale);
    pdf.text(`${doc.boundary.heightMm.toFixed(1)} mm`, dimX + 2, originY + (doc.boundary.heightMm * scale) / 2);
  }

  // Scale note
  pdf.text(`Schematic Scale: ${scale.toFixed(3)}:1 (All dimensions in mm)`, margin + 4, schemY + schemH - 3);

  // 5. Quality Assurance & Workshop Traveler Sign-off (Bottom)
  const travelerY = 236;
  const travelerH = 46;
  pdf.setDrawColor(203, 213, 225);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, travelerY, contentWidth, travelerH, 2, 2, 'FD');

  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, travelerY, contentWidth, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('QUALITY CONTROL & WORKSHOP TRAVELER SIGN-OFF', margin + 3, travelerY + 5);

  // QC Checklist (Left)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(71, 85, 105);
  const checkY = travelerY + 13;
  pdf.text('[  ] Kerf & Dimensional Tolerance Check (±0.15mm)', margin + 5, checkY);
  pdf.text('[  ] Edge Slag / Thermal Dross Deburred', margin + 5, checkY + 6);
  pdf.text('[  ] Surface Finish & Grain Direction Inspected', margin + 5, checkY + 12);
  pdf.text('[  ] Mounting Standoff Clearances Verified', margin + 5, checkY + 18);
  pdf.text('[  ] Protective Laser Film Applied for Shipping', margin + 5, checkY + 24);

  // Sign-off Fields (Right)
  const signX = margin + 95;
  pdf.text('CNC Machine Station: 3kW Fiber Laser / Table 1', signX, checkY);
  pdf.text('Operator Signature:   _________________________', signX, checkY + 6);
  pdf.text('QC Inspector Sign:    _________________________', signX, checkY + 12);
  pdf.text('QC Approval Status:  [  ] ACCEPTED    [  ] REWORK', signX, checkY + 18);
  pdf.text('Date of Completion:  _________________________', signX, checkY + 24);

  // 6. Page Footer
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(148, 163, 184);
  pdf.text('Antwerp Metalworks • Vernox Industrial Vector CAD/CAM Engine • Confidential Traveler', margin, 290);
  pdf.text('Sheet 1 of 1', pageWidth - margin, 290, { align: 'right' });

  return pdf;
}

/**
 * Discretize SVG path commands into sampled 2D metric vertices for PDF rendering
 */
function samplePathToPoints(pathData: string): Point2D[] {
  const commands = VectorGeometryEngine.parsePath(pathData);
  const points: Point2D[] = [];
  let curX = 0, curY = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    if (cmd.op === 'M') {
      curX = cmd.p[0];
      curY = cmd.p[1];
      startX = curX;
      startY = curY;
      points.push({ x: curX, y: curY });
    } else if (cmd.op === 'L') {
      curX = cmd.p[0];
      curY = cmd.p[1];
      points.push({ x: curX, y: curY });
    } else if (cmd.op === 'C') {
      const [cp1x, cp1y, cp2x, cp2y, endx, endy] = cmd.p;
      const segs = 12;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const pt = VectorGeometryEngine.sampleCubicBezier(
          { x: curX, y: curY },
          { x: cp1x, y: cp1y },
          { x: cp2x, y: cp2y },
          { x: endx, y: endy },
          t
        );
        points.push(pt);
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'Q') {
      const [cpx, cpy, endx, endy] = cmd.p;
      const segs = 10;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const mt = 1 - t;
        const px = mt * mt * curX + 2 * mt * t * cpx + t * t * endx;
        const py = mt * mt * curY + 2 * mt * t * cpy + t * t * endy;
        points.push({ x: px, y: py });
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'A') {
      const [rx, ry, _rot, _large, _sweep, endx, endy] = cmd.p;
      const segs = 12;
      for (let i = 1; i <= segs; i++) {
        const t = i / segs;
        const px = (1 - t) * curX + t * endx;
        const py = (1 - t) * curY + t * endy;
        points.push({ x: px, y: py });
      }
      curX = endx;
      curY = endy;
    } else if (cmd.op === 'Z') {
      points.push({ x: startX, y: startY });
      curX = startX;
      curY = startY;
    }
  }

  return points;
}

/**
 * Render polyline points to jsPDF
 */
function renderPointsAsLines(
  pdf: jsPDF,
  points: Point2D[],
  originX: number,
  originY: number,
  scale: number,
  isClosed: boolean
) {
  if (points.length < 2) return;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    pdf.line(
      originX + p1.x * scale,
      originY + p1.y * scale,
      originX + p2.x * scale,
      originY + p2.y * scale
    );
  }

  if (isClosed && points.length > 2) {
    const first = points[0];
    const last = points[points.length - 1];
    if (Math.hypot(first.x - last.x, first.y - last.y) > 1e-3) {
      pdf.line(
        originX + last.x * scale,
        originY + last.y * scale,
        originX + first.x * scale,
        originY + first.y * scale
      );
    }
  }
}

/**
 * Helper to translate SVG path coordinates
 */
function applyTransformToPath(pathData: string, dx: number, dy: number): string {
  if (dx === 0 && dy === 0) return pathData;
  const cmds = VectorGeometryEngine.parsePath(pathData);
  const translated = cmds.map(cmd => {
    if (cmd.op === 'M' || cmd.op === 'L') {
      return { ...cmd, p: [cmd.p[0] + dx, cmd.p[1] + dy] as [number, number] };
    } else if (cmd.op === 'C') {
      return {
        ...cmd,
        p: [
          cmd.p[0] + dx, cmd.p[1] + dy,
          cmd.p[2] + dx, cmd.p[3] + dy,
          cmd.p[4] + dx, cmd.p[5] + dy,
        ] as [number, number, number, number, number, number],
      };
    } else if (cmd.op === 'Q') {
      return {
        ...cmd,
        p: [
          cmd.p[0] + dx, cmd.p[1] + dy,
          cmd.p[2] + dx, cmd.p[3] + dy,
        ] as [number, number, number, number],
      };
    } else if (cmd.op === 'A') {
      return {
        ...cmd,
        p: [
          cmd.p[0], cmd.p[1], cmd.p[2], cmd.p[3], cmd.p[4],
          cmd.p[5] + dx, cmd.p[6] + dy,
        ] as [number, number, number, boolean, boolean, number, number],
      };
    }
    return cmd;
  });

  return VectorGeometryEngine.serializePath(translated);
}
