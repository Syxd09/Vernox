import { describe, it, expect } from 'vitest';
import { exportDocumentAsSVG, exportDocumentAsDXF, exportDocumentAsPDF } from '../exportCAM';
import type { VectorDocument } from '../cadEngineTypes';

function createSampleVectorDoc(): VectorDocument {
  return {
    id: 'doc-fixture-cam-001',
    version: '3.0.0',
    unit: 'mm',
    boundary: {
      shapeId: 'arch_monolith',
      widthMm: 300,
      heightMm: 200,
      cornerRadiusMm: 12,
      pathData: 'M 0 12 A 12 12 0 0 1 12 0 L 288 0 A 12 12 0 0 1 300 12 L 300 188 A 12 12 0 0 1 288 200 L 12 200 A 12 12 0 0 1 0 188 Z',
      aspectRatioLocked: false,
    },
    material: {
      substrate: 'mild_steel',
      finish: 'black_patina',
      thicknessMm: 3.0,
      activeGaugeParams: {
        gaugeName: '11 Gauge (3.0mm)',
        thicknessMm: 3.0,
        kerfWidthMm: 0.22,
        feedRateMmMin: 2200,
        dwellTimeMs: 350,
        minHoleDiameterMm: 3.0,
        minWebWidthMm: 2.5,
        minEdgeClearanceMm: 4.0,
      },
    },
    layers: [
      {
        id: 'hole-1',
        name: 'Mounting Standoff Top-Left',
        type: 'mounting_hole',
        visible: true,
        locked: false,
        camLayer: '0_CUT_INTERNAL',
        cutSequencePriority: 1,
        diameterMm: 6.0,
        holeType: 'through_hole',
        edgeOffsetMm: 15.0,
        transform: { xMm: 20, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      },
      {
        id: 'hole-2',
        name: 'Mounting Standoff Top-Right',
        type: 'mounting_hole',
        visible: true,
        locked: false,
        camLayer: '0_CUT_INTERNAL',
        cutSequencePriority: 2,
        diameterMm: 6.0,
        holeType: 'through_hole',
        edgeOffsetMm: 15.0,
        transform: { xMm: 280, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      },
      {
        id: 'typo-1',
        name: 'House Number 42',
        type: 'typography',
        visible: true,
        locked: false,
        camLayer: '0_CUT_INTERNAL',
        cutSequencePriority: 10,
        rawText: '42',
        fontId: 'antwerp_monogram_stencil',
        fontSizeMm: 40,
        letterSpacingMm: 2,
        isStencilBridged: true,
        bridgeWidthMm: 2.5,
        derivedPathData: 'M 10 10 L 30 10 L 30 50 L 10 50 Z',
        transform: { xMm: 120, yMm: 80, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      },
      {
        id: 'score-1',
        name: 'Decorative Bend Line',
        type: 'vector_path',
        visible: true,
        locked: false,
        camLayer: '2_VECTOR_SCORE',
        cutSequencePriority: 50,
        pathData: 'M 20 180 L 280 180',
        isClosed: false,
        transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      },
    ],
    manufacturingAnalytics: {
      totalCutLengthMm: 1245.8,
      totalPierceCount: 4,
      estimatedCutTimeSec: 38.5,
      partWeightKg: 1.34,
      scrapPercentage: 14.2,
      boundingWidthMm: 300,
      boundingHeightMm: 200,
      isManufacturable: true,
    },
    validationIssues: [],
  };
}

describe('CAM Export Engine', () => {
  describe('exportDocumentAsSVG', () => {
    it('generates 1:1 metric SVG with millimeter dimensions and proper viewBox', () => {
      const doc = createSampleVectorDoc();
      const svg = exportDocumentAsSVG(doc);

      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('width="300mm"');
      expect(svg).toContain('height="200mm"');
      expect(svg).toContain('viewBox="0 0 300 200"');
    });

    it('organizes toolpaths into standardized CAM layer groups', () => {
      const doc = createSampleVectorDoc();
      const svg = exportDocumentAsSVG(doc);

      expect(svg).toContain('id="0_CUT_INTERNAL"');
      expect(svg).toContain('id="1_CUT_PERIMETER"');
      expect(svg).toContain('id="2_VECTOR_SCORE"');
    });

    it('contains ZERO raster bitmap <image> tags', () => {
      const doc = createSampleVectorDoc();
      const svg = exportDocumentAsSVG(doc);

      expect(svg).not.toContain('<image');
      expect(svg).not.toContain('data:image/');
    });

    it('embeds manufacturing metadata attributes in the SVG root', () => {
      const doc = createSampleVectorDoc();
      const svg = exportDocumentAsSVG(doc, { applyKerfOffset: true });

      expect(svg).toContain('data-vernox-vdm="3.0.0"');
      expect(svg).toContain('data-material="mild_steel"');
      expect(svg).toContain('data-gauge-mm="3"');
      expect(svg).toContain('data-kerf-compensated="true"');
    });
  });

  describe('exportDocumentAsDXF', () => {
    it('conforms strictly to AutoCAD 2000 AC1015 specification', () => {
      const doc = createSampleVectorDoc();
      const dxf = exportDocumentAsDXF(doc);

      expect(dxf).toContain('$ACADVER\n1\nAC1015');
      expect(dxf).toContain('$INSUNITS\n70\n4'); // 4 = Millimeters
      expect(dxf).toContain('$MEASUREMENT\n70\n1');
      expect(dxf).toContain('0\nEOF');
    });

    it('uses LWPOLYLINE entities with flag 70 set to 1 for closed cutouts', () => {
      const doc = createSampleVectorDoc();
      const dxf = exportDocumentAsDXF(doc);

      expect(dxf).toContain('0\nLWPOLYLINE');
      expect(dxf).toContain('70\n1'); // Closed polyline flag
    });

    it('enforces topological ordering with inner cuts appearing before outer perimeter', () => {
      const doc = createSampleVectorDoc();
      const dxf = exportDocumentAsDXF(doc);

      const firstInnerCutIndex = dxf.indexOf('8\n0_CUT_INNER');
      const firstOuterCutIndex = dxf.indexOf('8\n1_CUT_OUTER');

      expect(firstInnerCutIndex).toBeGreaterThan(0);
      expect(firstOuterCutIndex).toBeGreaterThan(0);
      expect(firstInnerCutIndex).toBeLessThan(firstOuterCutIndex);
    });
  });

  describe('exportDocumentAsPDF', () => {
    it('generates a valid A4 workshop specification sheet PDF', () => {
      const doc = createSampleVectorDoc();
      const pdf = exportDocumentAsPDF(doc, { orderNumber: 'VX-2026-TEST' });

      expect(pdf).toBeDefined();
      const arrayBuffer = pdf.output('arraybuffer');
      expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
      expect(arrayBuffer.byteLength).toBeGreaterThan(1000);
    });

    it('produces a data URI string containing PDF header', () => {
      const doc = createSampleVectorDoc();
      const pdf = exportDocumentAsPDF(doc);

      const dataUri = pdf.output('datauristring');
      expect(dataUri).toMatch(/^data:application\/pdf;/);
    });
  });
});
