/**
 * Configurable Manufacturing Validation Engine
 * Evaluates geometric features against active machine profiles and gauge parameters
 */

import type {
  VectorDocument,
  MachineManufacturingProfile,
  GaugeCuttingParameters,
  ValidationIssue,
  TypographyFeatureLayer,
  MountingHoleFeatureLayer,
  VectorPathFeatureLayer
} from './cadEngineTypes';
import { VectorGeometryEngine } from './vectorGeometry';

export interface ValidationContext {
  doc: VectorDocument;
  machine: MachineManufacturingProfile;
  gauge: GaugeCuttingParameters;
}

export interface RuleDefinition {
  id: string;
  name: string;
  severity: 'error' | 'warning';
  description: string;
  check: (ctx: ValidationContext) => ValidationIssue[];
}

export const MANUFACTURING_RULES: Record<string, RuleDefinition> = {
  'CAM-01': {
    id: 'CAM-01',
    name: 'Unbridged Island Fallout',
    severity: 'error',
    description: 'Enclosed negative spaces inside letters or vector artwork will drop out during laser cutting.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      
      // Check typography layers
      ctx.doc.layers.forEach(layer => {
        if (layer.type === 'typography') {
          const textLayer = layer as TypographyFeatureLayer;
          if (!textLayer.isStencilBridged && /[ABDOPQR04689%&@]/.test(textLayer.rawText)) {
            issues.push({
              ruleId: 'CAM-01',
              severity: 'error',
              message: `Text "${textLayer.rawText}" contains enclosed characters (A, B, D, O, P, Q, R, 0, 4, 6, 8, 9) without stencil bridges. Centers will drop out.`,
              layerId: layer.id
            });
          }
        }
      });

      // Check raw vector path layers: detect multiple 'M' subpaths where one is enclosed by another
      ctx.doc.layers.forEach(layer => {
        if (layer.type === 'vector_path') {
          const pathLayer = layer as VectorPathFeatureLayer;
          // CRITICAL: Vector score layers (2_VECTOR_SCORE) do NOT cut through the plate;
          // surface etching/scoring has zero risk of negative island fallout!
          if (pathLayer.camLayer === '2_VECTOR_SCORE') {
            return;
          }

          const cmds = VectorGeometryEngine.parsePath(pathLayer.pathData);
          const moveIndices = cmds
            .map((c, idx) => c.op === 'M' ? idx : -1)
            .filter(idx => idx !== -1);

          // If multiple subpaths exist, check for enclosed loops (islands)
          if (moveIndices.length > 1) {
            const loops: { bounds: any; cmds: any[] }[] = [];
            for (let i = 0; i < moveIndices.length; i++) {
              const start = moveIndices[i];
              const end = i + 1 < moveIndices.length ? moveIndices[i + 1] : cmds.length;
              const subCmds = cmds.slice(start, end);
              loops.push({
                bounds: VectorGeometryEngine.computeBoundingBox(subCmds),
                cmds: subCmds
              });
            }

            let enclosedCount = 0;
            for (let i = 0; i < loops.length; i++) {
              for (let j = 0; j < loops.length; j++) {
                if (i !== j) {
                  const bOuter = loops[i].bounds;
                  const bInner = loops[j].bounds;
                  // If inner loop is geometrically inside outer loop
                  if (
                    bInner.minX > bOuter.minX &&
                    bInner.maxX < bOuter.maxX &&
                    bInner.minY > bOuter.minY &&
                    bInner.maxY < bOuter.maxY
                  ) {
                    enclosedCount++;
                  }
                }
              }
            }

            if (enclosedCount > 0) {
              issues.push({
                ruleId: 'CAM-01',
                severity: 'error',
                message: `Vector layer "${pathLayer.name}" contains ${enclosedCount} unbridged enclosed island${enclosedCount > 1 ? 's' : ''}. Interior pieces will fall out during through-cutting. Convert layer to Vector Score (Etch) or add stencil bridges.`,
                layerId: layer.id
              });
            }
          }
        }
      });

      return issues;
    }
  },

  'CAM-02': {
    id: 'CAM-02',
    name: 'Minimum Web / Strut Thickness',
    severity: 'error',
    description: 'Metal webs narrower than the active gauge minimum will warp, burn, or melt under laser heat.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      const minRequired = ctx.gauge.minWebWidthMm;

      // Check distance from mounting holes to plate edges
      ctx.doc.layers.filter(l => l.type === 'mounting_hole').forEach(layer => {
        const hole = layer as MountingHoleFeatureLayer;
        if (hole.edgeOffsetMm < minRequired) {
          issues.push({
            ruleId: 'CAM-02',
            severity: 'error',
            message: `Mounting hole edge distance (${hole.edgeOffsetMm}mm) is less than required minimum web (${minRequired}mm) for ${ctx.gauge.thicknessMm}mm ${ctx.doc.material.substrate}.`,
            layerId: layer.id
          });
        }
      });

      return issues;
    }
  },

  'CAM-03': {
    id: 'CAM-03',
    name: 'Minimum Hole Diameter Piercing Limit',
    severity: 'error',
    description: 'Piercing holes smaller than process limits causes beam reflection and nozzle damage.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      const minHoleLimit = ctx.gauge.minHoleDiameterMm;

      ctx.doc.layers.filter(l => l.type === 'mounting_hole').forEach(layer => {
        const hole = layer as MountingHoleFeatureLayer;
        if (hole.diameterMm < minHoleLimit) {
          issues.push({
            ruleId: 'CAM-03',
            severity: 'error',
            message: `Hole diameter (${hole.diameterMm}mm) is below machine piercing limit (${minHoleLimit}mm) for ${ctx.gauge.thicknessMm}mm plate.`,
            layerId: layer.id
          });
        }
      });

      // Also check vector path layers that resemble tiny holes
      ctx.doc.layers.filter(l => l.type === 'vector_path' && l.camLayer === '0_CUT_INTERNAL').forEach(layer => {
        const path = layer as VectorPathFeatureLayer;
        if (path.boundsMm.widthMm > 0 && path.boundsMm.heightMm > 0) {
          const maxDim = Math.max(path.boundsMm.widthMm, path.boundsMm.heightMm);
          if (maxDim < minHoleLimit) {
            issues.push({
              ruleId: 'CAM-03',
              severity: 'error',
              message: `Internal cutout diameter (${maxDim.toFixed(1)}mm) is below minimum piercing diameter (${minHoleLimit}mm).`,
              layerId: layer.id
            });
          }
        }
      });

      return issues;
    }
  },

  'CAM-04': {
    id: 'CAM-04',
    name: 'Perimeter Boundary Clearance',
    severity: 'warning',
    description: 'Cuts closer than the heat-affected zone clearance to sheet perimeter cause edge blowout.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      const minClearance = ctx.gauge.minEdgeClearanceMm;
      const b = ctx.doc.boundary;

      ctx.doc.layers.forEach(layer => {
        if (layer.type === 'vector_path' || layer.type === 'typography') {
          let w = 40;
          let h = 40;
          if (layer.type === 'typography') {
            const tl = layer as TypographyFeatureLayer;
            w = (tl.rawText?.length || 1) * tl.fontSizeMm * 0.7;
            h = tl.fontSizeMm;
          } else if (layer.type === 'vector_path') {
            const vp = layer as VectorPathFeatureLayer;
            w = vp.boundsMm?.widthMm || 40;
            h = vp.boundsMm?.heightMm || 40;
          }

          const minX = layer.transform.xMm;
          const minY = layer.transform.yMm;
          const maxX = layer.transform.xMm + w;
          const maxY = layer.transform.yMm + h;

          const isNearPerimeter = 
            minX < minClearance || 
            minY < minClearance || 
            (b.widthMm > 0 && maxX > b.widthMm - minClearance) || 
            (b.heightMm > 0 && maxY > b.heightMm - minClearance);

          if (isNearPerimeter) {
            issues.push({
              ruleId: 'CAM-04',
              severity: 'warning',
              message: `Feature "${layer.name}" is within ${minClearance}mm of outer plate boundary. Risk of thermal edge warping.`,
              layerId: layer.id
            });
          }
        }
      });

      return issues;
    }
  },

  'CAM-05': {
    id: 'CAM-05',
    name: 'Closed Toolpath Loop Verification',
    severity: 'error',
    description: 'All cutting toolpaths on 0_CUT_INTERNAL and 1_CUT_PERIMETER must be closed loops.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      ctx.doc.layers.filter(l => l.type === 'vector_path').forEach(layer => {
        const path = layer as VectorPathFeatureLayer;
        if (path.camLayer !== '2_VECTOR_SCORE' && !path.isClosed) {
          issues.push({
            ruleId: 'CAM-05',
            severity: 'error',
            message: `Layer "${layer.name}" contains an open cut path. Laser cutting requires closed loops.`,
            layerId: layer.id
          });
        }
      });
      return issues;
    }
  },

  'CAM-06': {
    id: 'CAM-06',
    name: 'Machine Bed Capacity',
    severity: 'error',
    description: 'Workpiece dimensions exceed machine bed envelope.',
    check: (ctx) => {
      const issues: ValidationIssue[] = [];
      const b = ctx.doc.boundary;
      if (b.widthMm > ctx.machine.maxBedWidthMm || b.heightMm > ctx.machine.maxBedHeightMm) {
        issues.push({
          ruleId: 'CAM-06',
          severity: 'error',
          message: `Workpiece (${b.widthMm}x${b.heightMm}mm) exceeds machine bed capacity (${ctx.machine.maxBedWidthMm}x${ctx.machine.maxBedHeightMm}mm).`
        });
      }
      return issues;
    }
  }
};

/**
 * Run all manufacturing checks against a VectorDocument
 */
export function validateVectorDocument(ctx: ValidationContext): ValidationIssue[] {
  const allIssues: ValidationIssue[] = [];
  for (const rule of Object.values(MANUFACTURING_RULES)) {
    const issues = rule.check(ctx);
    allIssues.push(...issues);
  }
  return allIssues;
}
