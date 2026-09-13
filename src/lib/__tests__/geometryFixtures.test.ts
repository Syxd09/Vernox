/**
 * Phase 0 Geometry & Manufacturing Validation Test Fixtures
 * Tests geometric math, bounding box accuracy, CAM rules, and DXF AC1015 output
 */

import { describe, it, expect } from 'vitest';
import { VectorGeometryEngine } from '../vectorGeometry';
import { 
  FIBER_LASER_3KW_PROFILE, 
  getGaugeParameters, 
  type VectorDocument 
} from '../cadEngineTypes';
import { validateVectorDocument } from '../manufacturingRules';
import { exportAsDXF } from '../exportDXF';

describe('Phase 0: Geometry Engine & Fixture Certification', () => {
  // FIXTURE-01: Circle 100mm Outer Cut
  it('FIXTURE-01: Circle 100mm true circular contour bounds and analytical length', () => {
    // 100mm circle centered at (50, 50) using 4 standard cubic bezier quadrants
    const circleSvg = 'M 50 0 C 77.614 0 100 22.386 100 50 C 100 77.614 77.614 100 50 100 C 22.386 100 0 77.614 0 50 C 0 22.386 22.386 0 50 0 Z';
    const commands = VectorGeometryEngine.parsePath(circleSvg);
    expect(commands.length).toBeGreaterThan(0);

    // Bounding box test
    const bounds = VectorGeometryEngine.computeBoundingBox(commands);
    expect(bounds.minX).toBeCloseTo(0, 0);
    expect(bounds.minY).toBeCloseTo(0, 0);
    expect(bounds.maxX).toBeCloseTo(100, 0);
    expect(bounds.maxY).toBeCloseTo(100, 0);
    expect(bounds.widthMm).toBeCloseTo(100, 0);
    expect(bounds.heightMm).toBeCloseTo(100, 0);

    // Analytical circumference: pi * 100 = 314.159 mm
    const length = VectorGeometryEngine.computePathLengthMm(commands);
    expect(Math.abs(length - 314.159)).toBeLessThanOrEqual(0.6); // within 0.2%
  });

  // FIXTURE-02: Unbridged Letter O Fallout Detection
  it('FIXTURE-02: Detects unbridged island fallout for closed letterforms (CAM-01)', () => {
    const gauge = getGaugeParameters(FIBER_LASER_3KW_PROFILE, 'mild_steel', 3.0);
    const mockDoc: VectorDocument = {
      version: '3.0.0',
      documentId: 'test-doc-02',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unit: 'mm',
      material: {
        substrate: 'mild_steel',
        thicknessMm: 3.0,
        finish: 'natural_mill',
        machineProfileId: FIBER_LASER_3KW_PROFILE.id,
        activeGaugeParams: gauge,
      },
      boundary: {
        id: 'boundary-1',
        name: 'Outer Boundary',
        type: 'boundary',
        visible: true,
        locked: true,
        camLayer: '1_CUT_PERIMETER',
        cutSequencePriority: 10,
        transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
        shapeTemplateId: 'rect',
        widthMm: 200,
        heightMm: 150,
        cornerRadiusMm: 0,
        borderThicknessMm: 0,
        pathData: 'M 0 0 L 200 0 L 200 150 L 0 150 Z'
      },
      layers: [
        {
          id: 'text-unbridged-1',
          name: 'Customer Monogram',
          type: 'typography',
          visible: true,
          locked: false,
          camLayer: '0_CUT_INTERNAL',
          cutSequencePriority: 1,
          transform: { xMm: 20, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
          rawText: 'MOON',
          fontFamily: 'Antwerp Serif',
          fontSizeMm: 50,
          letterSpacingMm: 1,
          isStencilBridged: false, // Unbridged!
          bridgeWidthMm: 0,
          derivedPathData: ''
        }
      ],
      manufacturingAnalytics: {
        totalCutLengthMm: 0,
        totalPierceCount: 0,
        sheetAreaSqMm: 30000,
        estimatedCutTimeSec: 0,
        partWeightKg: 0.7,
        isValidated: false,
        validationIssues: []
      }
    };

    const issues = validateVectorDocument({
      doc: mockDoc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge
    });

    const cam01 = issues.find(i => i.ruleId === 'CAM-01');
    expect(cam01).toBeDefined();
    expect(cam01?.severity).toBe('error');
    expect(cam01?.message).toContain('stencil bridges');

    // When stencil bridging is marked true, CAM-01 should clear
    (mockDoc.layers[0] as any).isStencilBridged = true;
    const resolvedIssues = validateVectorDocument({
      doc: mockDoc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge
    });
    expect(resolvedIssues.find(i => i.ruleId === 'CAM-01')).toBeUndefined();
  });

  // FIXTURE-03: Minimum Hole Piercing Limit Failure
  it('FIXTURE-03: Flags holes smaller than sheet thickness piercing limit (CAM-03)', () => {
    const gauge6mm = getGaugeParameters(FIBER_LASER_3KW_PROFILE, 'mild_steel', 6.0);
    expect(gauge6mm.minHoleDiameterMm).toBe(6.0);

    const mockDoc: VectorDocument = {
      version: '3.0.0',
      documentId: 'test-doc-03',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unit: 'mm',
      material: {
        substrate: 'mild_steel',
        thicknessMm: 6.0,
        finish: 'natural_mill',
        machineProfileId: FIBER_LASER_3KW_PROFILE.id,
        activeGaugeParams: gauge6mm,
      },
      boundary: {
        id: 'boundary-1',
        name: 'Outer Boundary',
        type: 'boundary',
        visible: true,
        locked: true,
        camLayer: '1_CUT_PERIMETER',
        cutSequencePriority: 10,
        transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
        shapeTemplateId: 'rect',
        widthMm: 200,
        heightMm: 150,
        cornerRadiusMm: 0,
        borderThicknessMm: 0,
        pathData: 'M 0 0 L 200 0 L 200 150 L 0 150 Z'
      },
      layers: [
        {
          id: 'hole-1',
          name: 'Standoff Hole 1',
          type: 'mounting_hole',
          visible: true,
          locked: false,
          camLayer: '0_CUT_INTERNAL',
          cutSequencePriority: 1,
          transform: { xMm: 20, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
          diameterMm: 4.0, // 4mm is < 6.0mm sheet thickness!
          standoffType: 'flush_screw',
          edgeOffsetMm: 15.0
        }
      ],
      manufacturingAnalytics: {
        totalCutLengthMm: 0,
        totalPierceCount: 0,
        sheetAreaSqMm: 30000,
        estimatedCutTimeSec: 0,
        partWeightKg: 1.4,
        isValidated: false,
        validationIssues: []
      }
    };

    const issues = validateVectorDocument({
      doc: mockDoc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge: gauge6mm
    });

    const cam03 = issues.find(i => i.ruleId === 'CAM-03');
    expect(cam03).toBeDefined();
    expect(cam03?.severity).toBe('error');
    expect(cam03?.message).toContain('piercing limit');

    // On 3mm sheet, a 4mm hole should pass CAM-03
    const gauge3mm = getGaugeParameters(FIBER_LASER_3KW_PROFILE, 'mild_steel', 3.0);
    mockDoc.material.thicknessMm = 3.0;
    mockDoc.material.activeGaugeParams = gauge3mm;
    const validIssues = validateVectorDocument({
      doc: mockDoc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge: gauge3mm
    });
    expect(validIssues.find(i => i.ruleId === 'CAM-03')).toBeUndefined();
  });

  // FIXTURE-04: Mounting Standoff Edge Web Clearance Violation
  it('FIXTURE-04: Flags mounting holes too close to sheet edge (CAM-02)', () => {
    const gauge3mm = getGaugeParameters(FIBER_LASER_3KW_PROFILE, 'mild_steel', 3.0);
    expect(gauge3mm.minWebWidthMm).toBe(2.5);

    const mockDoc: VectorDocument = {
      version: '3.0.0',
      documentId: 'test-doc-04',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unit: 'mm',
      material: {
        substrate: 'mild_steel',
        thicknessMm: 3.0,
        finish: 'natural_mill',
        machineProfileId: FIBER_LASER_3KW_PROFILE.id,
        activeGaugeParams: gauge3mm,
      },
      boundary: {
        id: 'boundary-1',
        name: 'Outer Boundary',
        type: 'boundary',
        visible: true,
        locked: true,
        camLayer: '1_CUT_PERIMETER',
        cutSequencePriority: 10,
        transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
        shapeTemplateId: 'rect',
        widthMm: 200,
        heightMm: 150,
        cornerRadiusMm: 0,
        borderThicknessMm: 0,
        pathData: 'M 0 0 L 200 0 L 200 150 L 0 150 Z'
      },
      layers: [
        {
          id: 'hole-too-close',
          name: 'Edge Standoff Hole',
          type: 'mounting_hole',
          visible: true,
          locked: false,
          camLayer: '0_CUT_INTERNAL',
          cutSequencePriority: 1,
          transform: { xMm: 1.5, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
          diameterMm: 5.0,
          standoffType: 'flush_screw',
          edgeOffsetMm: 1.5 // 1.5mm < minWebWidth 2.5mm
        }
      ],
      manufacturingAnalytics: {
        totalCutLengthMm: 0,
        totalPierceCount: 0,
        sheetAreaSqMm: 30000,
        estimatedCutTimeSec: 0,
        partWeightKg: 0.7,
        isValidated: false,
        validationIssues: []
      }
    };

    const issues = validateVectorDocument({
      doc: mockDoc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge: gauge3mm
    });

    const cam02 = issues.find(i => i.ruleId === 'CAM-02');
    expect(cam02).toBeDefined();
    expect(cam02?.severity).toBe('error');
    expect(cam02?.message).toContain('minimum web');
  });

  // FIXTURE-05: DXF LWPOLYLINE AC1015 Compliance Check
  it('FIXTURE-05: Verifies DXF export emits valid AutoCAD 2000 AC1015 format with closed LWPOLYLINE', () => {
    const outerPath = 'M 0 0 L 100 0 L 100 100 L 0 100 Z';
    const innerPath = 'M 40 40 L 60 40 L 60 60 L 40 60 Z';

    const dxf = exportAsDXF(outerPath, 100, 100, {
      outerPerimeterPath: outerPath,
      innerCutPaths: [innerPath],
      scorePaths: []
    });

    // 1. Verify AC1015 version header
    expect(dxf).toContain('$ACADVER');
    expect(dxf).toContain('AC1015');

    // 2. Verify metric units
    expect(dxf).toContain('$INSUNITS');
    expect(dxf).toContain('\n4\n');

    // 3. Verify closed LWPOLYLINE flag 70 = 1
    expect(dxf).toContain('LWPOLYLINE');
    expect(dxf).toContain('70\n1');

    // 4. Verify topological layering: 0_CUT_INNER precedes 1_CUT_OUTER
    const innerIndex = dxf.indexOf('0_CUT_INNER');
    const outerIndex = dxf.indexOf('1_CUT_OUTER');
    expect(innerIndex).toBeGreaterThan(-1);
    expect(outerIndex).toBeGreaterThan(-1);
    expect(innerIndex).toBeLessThan(outerIndex);
  });
});
