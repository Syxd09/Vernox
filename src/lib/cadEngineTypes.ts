/**
 * Canonical Vector Document Model (VDM v3) & Manufacturing Types
 * Industrial Vector CAD/CAM Design Platform - Antwerp Metalworks Spec
 */

export type VDMVersion = '3.0.0';
export type UnitOfMeasure = 'mm' | 'inch';
export type MetalSubstrate = 
  | 'mild_steel' 
  | 'stainless_304' 
  | 'aluminum_5052' 
  | 'brass_cz108' 
  | 'copper_c101' 
  | 'corten_weathering';

export type MetalFinish = 
  | 'natural_mill' 
  | 'brushed_hairline' 
  | 'mirror_polish' 
  | 'black_patina' 
  | 'antique_brass' 
  | 'verdigris' 
  | 'corten_rust'
  | 'steel'
  | 'stainless'
  | 'brass'
  | 'copper'
  | 'gold'
  | 'corten'
  | (string & {});

export type CuttingProcessType = 'fiber_laser' | 'co2_laser' | 'waterjet' | 'cnc_router';

export type CAMToolpathLayer = 
  | '0_CUT_INTERNAL'    // Pierced & cut first (letter counters, bolt holes, interior cutouts)
  | '1_CUT_PERIMETER'   // Cut last (outer mounting boundary)
  | '2_VECTOR_SCORE'    // Surface engraving / fold guidelines (low power, high speed)
  | '3_RASTER_ENGRAVE'; // Raster laser fill / marking

export interface Point2D {
  x: number; // Canonical millimetres
  y: number; // Canonical millimetres
}

export interface BoundingBox2D {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  widthMm: number;
  heightMm: number;
}

export interface AffineTransform2D {
  xMm: number;
  yMm: number;
  scaleX: number;
  scaleY: number;
  rotationDeg: number;
}

export type PathCommand =
  | { op: 'M'; p: [number, number] }
  | { op: 'L'; p: [number, number] }
  | { op: 'C'; p: [number, number, number, number, number, number] } // [cp1x, cp1y, cp2x, cp2y, endx, endy]
  | { op: 'Q'; p: [number, number, number, number] }                 // [cpx, cpy, endx, endy]
  | { op: 'A'; p: [number, number, number, boolean, boolean, number, number] } // [rx, ry, rot, large, sweep, endx, endy]
  | { op: 'Z' };

export interface BaseFeatureLayer {
  id?: string;
  name?: string;
  visible?: boolean;
  locked?: boolean;
  transform?: AffineTransform2D;
  camLayer?: CAMToolpathLayer;
  cutSequencePriority?: number; // 0 = earliest
}

export interface TypographyFeatureLayer extends BaseFeatureLayer {
  type: 'typography';
  rawText: string;
  fontFamily?: string;
  fontId?: string;
  fontSizeMm: number;
  letterSpacingMm: number;
  isStencilBridged: boolean;
  bridgeWidthMm: number;
  derivedPathData: string;
}

export interface VectorPathFeatureLayer extends BaseFeatureLayer {
  type: 'vector_path';
  pathData: string;
  isClosed: boolean;
  boundsMm?: BoundingBox2D;
  tracedFromRaster?: boolean;
}

export interface MountingHoleFeatureLayer extends BaseFeatureLayer {
  type: 'mounting_hole';
  diameterMm: number;
  standoffType?: 'flush_screw' | 'barrel_spacer' | 'keyhole_hanger' | string;
  holeType?: string;
  edgeOffsetMm: number;
}

export interface BoundaryFeatureLayer extends BaseFeatureLayer {
  type?: 'boundary';
  shapeTemplateId?: string;
  shapeId?: string;
  widthMm: number;
  heightMm: number;
  cornerRadiusMm: number;
  borderThicknessMm?: number;
  pathData: string;
  aspectRatioLocked?: boolean;
}

export type AnyFeatureLayer = 
  | TypographyFeatureLayer 
  | VectorPathFeatureLayer 
  | MountingHoleFeatureLayer 
  | BoundaryFeatureLayer;

export interface GaugeCuttingParameters {
  gaugeName?: string;
  thicknessMm: number;
  kerfWidthMm: number;
  leadInLengthMm?: number;
  pierceDwellSec?: number;
  dwellTimeMs?: number;
  feedRateMmPerMin?: number;
  feedRateMmMin?: number;
  assistGas?: 'nitrogen' | 'oxygen' | 'compressed_air' | 'none';
  assistGasPressureBar?: number;
  minWebWidthMm: number;
  minHoleDiameterMm: number;
  minEdgeClearanceMm: number;
  densityGPerCm3?: number;
}

export interface MachineManufacturingProfile {
  id: string;
  name: string;
  processType: CuttingProcessType;
  maxBedWidthMm: number;
  maxBedHeightMm: number;
  positionalAccuracyMm: number;
  repeatabilityMm: number;
  taperAngleDeg: number;
  gaugeTable: Record<MetalSubstrate, GaugeCuttingParameters[]>;
}

export interface MaterialSpecification {
  substrate: MetalSubstrate;
  thicknessMm: number;
  finish: MetalFinish;
  machineProfileId?: string;
  activeGaugeParams: GaugeCuttingParameters;
}

export interface ValidationIssue {
  ruleId: string;
  severity: 'error' | 'warning';
  message: string;
  location?: Point2D;
  layerId?: string;
}

export interface VectorDocument {
  version: VDMVersion;
  documentId?: string;
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  unit: UnitOfMeasure;
  material: MaterialSpecification;
  boundary: BoundaryFeatureLayer;
  layers: AnyFeatureLayer[];
  manufacturingAnalytics: {
    totalCutLengthMm: number;
    totalPierceCount: number;
    sheetAreaSqMm?: number;
    estimatedCutTimeSec: number;
    partWeightKg: number;
    isValidated?: boolean;
    validationIssues?: ValidationIssue[];
    scrapPercentage?: number;
    boundingWidthMm?: number;
    boundingHeightMm?: number;
    isManufacturable?: boolean;
  };
  validationIssues?: ValidationIssue[];
}

export const FIBER_LASER_3KW_PROFILE: MachineManufacturingProfile = {
  id: 'fiber_laser_3kw',
  name: 'Industrial 3kW Fiber Laser (Antwerp Metalworks Spec)',
  processType: 'fiber_laser',
  maxBedWidthMm: 1500,
  maxBedHeightMm: 3000,
  positionalAccuracyMm: 0.03,
  repeatabilityMm: 0.02,
  taperAngleDeg: 0.0,
  gaugeTable: {
    mild_steel: [
      { thicknessMm: 1.0, kerfWidthMm: 0.15, leadInLengthMm: 2.0, pierceDwellSec: 0.05, feedRateMmPerMin: 6500, assistGas: 'oxygen', assistGasPressureBar: 0.8, minWebWidthMm: 1.2, minHoleDiameterMm: 1.0, minEdgeClearanceMm: 3.0, densityGPerCm3: 7.85 },
      { thicknessMm: 1.5, kerfWidthMm: 0.18, leadInLengthMm: 2.5, pierceDwellSec: 0.08, feedRateMmPerMin: 4800, assistGas: 'oxygen', assistGasPressureBar: 0.7, minWebWidthMm: 1.5, minHoleDiameterMm: 1.5, minEdgeClearanceMm: 4.0, densityGPerCm3: 7.85 },
      { thicknessMm: 2.0, kerfWidthMm: 0.20, leadInLengthMm: 3.0, pierceDwellSec: 0.12, feedRateMmPerMin: 3600, assistGas: 'oxygen', assistGasPressureBar: 0.6, minWebWidthMm: 2.0, minHoleDiameterMm: 2.0, minEdgeClearanceMm: 4.5, densityGPerCm3: 7.85 },
      { thicknessMm: 3.0, kerfWidthMm: 0.25, leadInLengthMm: 3.5, pierceDwellSec: 0.25, feedRateMmPerMin: 2200, assistGas: 'oxygen', assistGasPressureBar: 0.5, minWebWidthMm: 2.5, minHoleDiameterMm: 3.0, minEdgeClearanceMm: 5.0, densityGPerCm3: 7.85 },
      { thicknessMm: 5.0, kerfWidthMm: 0.32, leadInLengthMm: 4.5, pierceDwellSec: 0.60, feedRateMmPerMin: 1400, assistGas: 'oxygen', assistGasPressureBar: 0.45, minWebWidthMm: 3.5, minHoleDiameterMm: 5.0, minEdgeClearanceMm: 7.0, densityGPerCm3: 7.85 },
      { thicknessMm: 6.0, kerfWidthMm: 0.38, leadInLengthMm: 5.0, pierceDwellSec: 0.90, feedRateMmPerMin: 1050, assistGas: 'oxygen', assistGasPressureBar: 0.4, minWebWidthMm: 4.5, minHoleDiameterMm: 6.0, minEdgeClearanceMm: 8.0, densityGPerCm3: 7.85 }
    ],
    stainless_304: [
      { thicknessMm: 1.0, kerfWidthMm: 0.14, leadInLengthMm: 2.0, pierceDwellSec: 0.05, feedRateMmPerMin: 7200, assistGas: 'nitrogen', assistGasPressureBar: 14.0, minWebWidthMm: 1.2, minHoleDiameterMm: 1.0, minEdgeClearanceMm: 3.0, densityGPerCm3: 7.93 },
      { thicknessMm: 1.5, kerfWidthMm: 0.17, leadInLengthMm: 2.5, pierceDwellSec: 0.10, feedRateMmPerMin: 5100, assistGas: 'nitrogen', assistGasPressureBar: 15.0, minWebWidthMm: 1.5, minHoleDiameterMm: 1.5, minEdgeClearanceMm: 4.0, densityGPerCm3: 7.93 },
      { thicknessMm: 2.0, kerfWidthMm: 0.20, leadInLengthMm: 3.0, pierceDwellSec: 0.15, feedRateMmPerMin: 3800, assistGas: 'nitrogen', assistGasPressureBar: 16.0, minWebWidthMm: 2.0, minHoleDiameterMm: 2.0, minEdgeClearanceMm: 4.5, densityGPerCm3: 7.93 },
      { thicknessMm: 3.0, kerfWidthMm: 0.24, leadInLengthMm: 3.5, pierceDwellSec: 0.30, feedRateMmPerMin: 2400, assistGas: 'nitrogen', assistGasPressureBar: 17.5, minWebWidthMm: 2.5, minHoleDiameterMm: 3.0, minEdgeClearanceMm: 5.0, densityGPerCm3: 7.93 }
    ],
    aluminum_5052: [
      { thicknessMm: 1.5, kerfWidthMm: 0.20, leadInLengthMm: 2.5, pierceDwellSec: 0.10, feedRateMmPerMin: 6000, assistGas: 'nitrogen', assistGasPressureBar: 16.0, minWebWidthMm: 1.8, minHoleDiameterMm: 1.8, minEdgeClearanceMm: 4.0, densityGPerCm3: 2.68 },
      { thicknessMm: 2.0, kerfWidthMm: 0.22, leadInLengthMm: 3.0, pierceDwellSec: 0.18, feedRateMmPerMin: 4500, assistGas: 'nitrogen', assistGasPressureBar: 17.0, minWebWidthMm: 2.2, minHoleDiameterMm: 2.2, minEdgeClearanceMm: 4.5, densityGPerCm3: 2.68 },
      { thicknessMm: 3.0, kerfWidthMm: 0.28, leadInLengthMm: 4.0, pierceDwellSec: 0.35, feedRateMmPerMin: 2800, assistGas: 'nitrogen', assistGasPressureBar: 18.0, minWebWidthMm: 3.0, minHoleDiameterMm: 3.2, minEdgeClearanceMm: 5.5, densityGPerCm3: 2.68 }
    ],
    brass_cz108: [
      { thicknessMm: 1.5, kerfWidthMm: 0.18, leadInLengthMm: 2.5, pierceDwellSec: 0.12, feedRateMmPerMin: 4200, assistGas: 'nitrogen', assistGasPressureBar: 16.0, minWebWidthMm: 1.8, minHoleDiameterMm: 1.8, minEdgeClearanceMm: 4.0, densityGPerCm3: 8.44 },
      { thicknessMm: 2.0, kerfWidthMm: 0.22, leadInLengthMm: 3.0, pierceDwellSec: 0.20, feedRateMmPerMin: 3100, assistGas: 'nitrogen', assistGasPressureBar: 17.0, minWebWidthMm: 2.2, minHoleDiameterMm: 2.2, minEdgeClearanceMm: 4.5, densityGPerCm3: 8.44 },
      { thicknessMm: 3.0, kerfWidthMm: 0.26, leadInLengthMm: 3.5, pierceDwellSec: 0.38, feedRateMmPerMin: 2100, assistGas: 'nitrogen', assistGasPressureBar: 18.0, minWebWidthMm: 2.8, minHoleDiameterMm: 3.0, minEdgeClearanceMm: 5.5, densityGPerCm3: 8.44 }
    ],
    copper_c101: [
      { thicknessMm: 1.5, kerfWidthMm: 0.20, leadInLengthMm: 2.5, pierceDwellSec: 0.15, feedRateMmPerMin: 3800, assistGas: 'oxygen', assistGasPressureBar: 8.0, minWebWidthMm: 2.0, minHoleDiameterMm: 2.0, minEdgeClearanceMm: 4.5, densityGPerCm3: 8.94 },
      { thicknessMm: 2.0, kerfWidthMm: 0.25, leadInLengthMm: 3.2, pierceDwellSec: 0.25, feedRateMmPerMin: 2700, assistGas: 'oxygen', assistGasPressureBar: 8.0, minWebWidthMm: 2.5, minHoleDiameterMm: 2.5, minEdgeClearanceMm: 5.0, densityGPerCm3: 8.94 }
    ],
    corten_weathering: [
      { thicknessMm: 1.5, kerfWidthMm: 0.18, leadInLengthMm: 2.5, pierceDwellSec: 0.08, feedRateMmPerMin: 4600, assistGas: 'oxygen', assistGasPressureBar: 0.7, minWebWidthMm: 1.5, minHoleDiameterMm: 1.5, minEdgeClearanceMm: 4.0, densityGPerCm3: 7.85 },
      { thicknessMm: 2.0, kerfWidthMm: 0.20, leadInLengthMm: 3.0, pierceDwellSec: 0.12, feedRateMmPerMin: 3500, assistGas: 'oxygen', assistGasPressureBar: 0.6, minWebWidthMm: 2.0, minHoleDiameterMm: 2.0, minEdgeClearanceMm: 4.5, densityGPerCm3: 7.85 },
      { thicknessMm: 3.0, kerfWidthMm: 0.25, leadInLengthMm: 3.5, pierceDwellSec: 0.25, feedRateMmPerMin: 2150, assistGas: 'oxygen', assistGasPressureBar: 0.5, minWebWidthMm: 2.5, minHoleDiameterMm: 3.0, minEdgeClearanceMm: 5.0, densityGPerCm3: 7.85 }
    ]
  }
};

export function getGaugeParameters(
  profile: MachineManufacturingProfile,
  substrate: MetalSubstrate,
  thicknessMm: number
): GaugeCuttingParameters {
  const table = profile.gaugeTable[substrate] || profile.gaugeTable.mild_steel;
  let closest = table[0];
  let minDiff = Math.abs(closest.thicknessMm - thicknessMm);
  for (const g of table) {
    const diff = Math.abs(g.thicknessMm - thicknessMm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = g;
    }
  }
  return closest;
}
