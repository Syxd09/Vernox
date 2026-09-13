/**
 * Normalized Vector Document Store
 * Manages VectorDocument AST, immutable 30-step history, and reactive CAM analytics
 */

import type {
  VectorDocument,
  AnyFeatureLayer,
  TypographyFeatureLayer,
  MountingHoleFeatureLayer,
  VectorPathFeatureLayer,
  MetalSubstrate,
  MetalFinish,
  Point2D,
  BoundingBox2D,
  AffineTransform2D
} from './cadEngineTypes';
import { FIBER_LASER_3KW_PROFILE, getGaugeParameters } from './cadEngineTypes';
import { VectorGeometryEngine } from './vectorGeometry';
import { validateVectorDocument } from './manufacturingRules';
import { StencilFontRegistry } from './fontRegistry';

export class CadDocumentStore {
  private currentDoc: VectorDocument;
  private past: VectorDocument[] = [];
  private future: VectorDocument[] = [];
  private listeners: Set<(doc: VectorDocument) => void> = new Set();
  private selectedLayerId: string | null = null;
  private transformGestureActive = false;

  constructor(initialDoc?: VectorDocument) {
    this.currentDoc = initialDoc || this.createDefaultDocument();
    this.recomputeAnalytics();
  }

  public getDocument(): VectorDocument {
    return this.currentDoc;
  }

  public getSelectedLayerId(): string | null {
    return this.selectedLayerId;
  }

  public selectLayer(id: string | null): void {
    this.selectedLayerId = id;
    this.notify();
  }

  public subscribe(listener: (doc: VectorDocument) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentDoc);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentDoc);
    }
  }

  private pushHistory(): void {
    // 30-step history limit
    if (this.past.length >= 30) {
      this.past.shift();
    }
    // Deep clone doc structure (lightweight, < 25KB because pure vector numbers)
    this.past.push(JSON.parse(JSON.stringify(this.currentDoc)));
    this.future = [];
  }

  public undo(): boolean {
    if (this.past.length === 0) return false;
    const previous = this.past.pop()!;
    this.future.unshift(this.currentDoc);
    this.currentDoc = previous;
    this.notify();
    return true;
  }

  public redo(): boolean {
    if (this.future.length === 0) return false;
    const next = this.future.shift()!;
    this.past.push(this.currentDoc);
    this.currentDoc = next;
    this.notify();
    return true;
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  // --- Document Mutations ---

  public setMaterial(substrate: MetalSubstrate, thicknessMm: number, finish: MetalFinish): void {
    this.pushHistory();
    const gauge = getGaugeParameters(FIBER_LASER_3KW_PROFILE, substrate, thicknessMm);
    this.currentDoc.material = {
      substrate,
      thicknessMm,
      finish,
      machineProfileId: FIBER_LASER_3KW_PROFILE.id,
      activeGaugeParams: gauge,
    };
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public setBoundary(
    widthMm: number, 
    heightMm: number, 
    cornerRadiusMm = 0, 
    shapeTemplateId?: string, 
    customPathData?: string
  ): void {
    this.pushHistory();
    this.currentDoc.boundary.widthMm = widthMm;
    this.currentDoc.boundary.heightMm = heightMm;
    this.currentDoc.boundary.cornerRadiusMm = cornerRadiusMm;
    if (shapeTemplateId) {
      this.currentDoc.boundary.shapeTemplateId = shapeTemplateId;
    }
    this.currentDoc.boundary.pathData = customPathData || generateRectPath(widthMm, heightMm, cornerRadiusMm);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public addTypography(
    text: string,
    fontFamily = 'antwerp_monogram_stencil',
    fontSizeMm = 60,
    pos: Point2D = { x: 30, y: 30 },
    isStencilBridged = true,
    bridgeWidthMm = 2.0
  ): TypographyFeatureLayer {
    this.pushHistory();
    const registry = StencilFontRegistry.getInstance();
    const layout = registry.layoutStringToPath(
      text,
      fontFamily,
      fontSizeMm,
      1.5,
      isStencilBridged,
      bridgeWidthMm
    );

    const layer: TypographyFeatureLayer = {
      id: `text-${Date.now().toString(36)}`,
      name: `Text: ${text.slice(0, 10)}`,
      type: 'typography',
      visible: true,
      locked: false,
      camLayer: '0_CUT_INTERNAL',
      cutSequencePriority: 1,
      transform: { xMm: pos.x, yMm: pos.y, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      rawText: text,
      fontFamily,
      fontSizeMm,
      letterSpacingMm: 1.5,
      isStencilBridged,
      bridgeWidthMm,
      derivedPathData: layout.pathData,
    };

    this.currentDoc.layers.push(layer);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return layer;
  }

  public addMountingHole(
    diameterMm = 6.0,
    standoffType: 'flush_screw' | 'barrel_spacer' | 'keyhole_hanger' = 'barrel_spacer',
    pos: Point2D = { x: 15, y: 15 },
    edgeOffsetMm = 15.0
  ): MountingHoleFeatureLayer {
    this.pushHistory();
    const layer: MountingHoleFeatureLayer = {
      id: `hole-${Date.now().toString(36)}`,
      name: `Mounting Hole (${diameterMm}mm)`,
      type: 'mounting_hole',
      visible: true,
      locked: false,
      camLayer: '0_CUT_INTERNAL',
      cutSequencePriority: 0,
      transform: { xMm: pos.x, yMm: pos.y, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      diameterMm,
      standoffType,
      edgeOffsetMm,
    };

    this.currentDoc.layers.push(layer);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return layer;
  }

  public addVectorPath(
    pathData: string,
    name: string,
    boundsMm: BoundingBox2D,
    isClosed = true,
    camLayer: '0_CUT_INTERNAL' | '1_CUT_PERIMETER' | '2_VECTOR_SCORE' = '0_CUT_INTERNAL'
  ): VectorPathFeatureLayer {
    this.pushHistory();
    const layer: VectorPathFeatureLayer = {
      id: `path-${Date.now().toString(36)}`,
      name,
      type: 'vector_path',
      visible: true,
      locked: false,
      camLayer,
      cutSequencePriority: camLayer === '0_CUT_INTERNAL' ? 1 : 2,
      transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      pathData,
      isClosed,
      boundsMm,
    };

    this.currentDoc.layers.push(layer);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return layer;
  }

  public addImageTracedPath(
    pathData: string,
    boundsMm: BoundingBox2D,
    name = 'Traced Vector Art'
  ): VectorPathFeatureLayer {
    this.pushHistory();
    const layer: VectorPathFeatureLayer = {
      id: `trace-${Date.now().toString(36)}`,
      name,
      type: 'vector_path',
      visible: true,
      locked: false,
      camLayer: '0_CUT_INTERNAL',
      cutSequencePriority: 1,
      transform: { xMm: 20, yMm: 20, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      pathData,
      isClosed: true,
      boundsMm,
      tracedFromRaster: true,
    };

    this.currentDoc.layers.push(layer);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return layer;
  }

  public updateTransform(layerId: string, transform: Partial<AffineTransform2D>): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer) return;
    this.pushHistory();
    layer.transform = { ...layer.transform, ...transform };
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  /**
   * Begins an interactive transform gesture (e.g. mouse drag, rotate),
   * snapshotting the document for undo/redo history once.
   */
  public beginTransformGesture(): void {
    if (!this.transformGestureActive) {
      this.pushHistory();
      this.transformGestureActive = true;
    }
  }

  /**
   * Fast, 60fps live transform mutation during interactive dragging or rotating.
   * Mutates the layer transform and notifies reactive UI without pushHistory or heavy analytics.
   */
  public updateTransformLive(layerId: string, transform: Partial<AffineTransform2D>): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer) return;
    layer.transform = { ...layer.transform, ...transform };
    this.notify();
  }

  /**
   * Finalizes an interactive drag/rotate transform gesture:
   * Commits the mutation to undo/redo history and executes CAM analytical rules once.
   */
  public commitTransform(): void {
    if (this.transformGestureActive) {
      this.transformGestureActive = false;
      this.currentDoc.updatedAt = Date.now();
      this.recomputeAnalytics();
      this.notify();
    }
  }

  public toggleStencilBridging(layerId: string, isStencilBridged: boolean, bridgeWidthMm = 2.0): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'typography') return;
    this.pushHistory();
    const textLayer = layer as TypographyFeatureLayer;
    textLayer.isStencilBridged = isStencilBridged;
    textLayer.bridgeWidthMm = bridgeWidthMm;

    // Refresh derived path with new bridge state
    const registry = StencilFontRegistry.getInstance();
    const layout = registry.layoutStringToPath(
      textLayer.rawText,
      textLayer.fontFamily,
      textLayer.fontSizeMm,
      textLayer.letterSpacingMm,
      isStencilBridged,
      bridgeWidthMm
    );
    textLayer.derivedPathData = layout.pathData;

    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public updateTypography(
    layerId: string,
    updates: {
      rawText?: string;
      fontFamily?: string;
      fontSizeMm?: number;
      letterSpacingMm?: number;
      isStencilBridged?: boolean;
      bridgeWidthMm?: number;
    }
  ): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'typography') return;
    this.pushHistory();
    const textLayer = layer as TypographyFeatureLayer;
    if (updates.rawText !== undefined) textLayer.rawText = updates.rawText;
    if (updates.fontFamily !== undefined) textLayer.fontFamily = updates.fontFamily;
    if (updates.fontSizeMm !== undefined) textLayer.fontSizeMm = updates.fontSizeMm;
    if (updates.letterSpacingMm !== undefined) textLayer.letterSpacingMm = updates.letterSpacingMm;
    if (updates.isStencilBridged !== undefined) textLayer.isStencilBridged = updates.isStencilBridged;
    if (updates.bridgeWidthMm !== undefined) textLayer.bridgeWidthMm = updates.bridgeWidthMm;

    const registry = StencilFontRegistry.getInstance();
    const layout = registry.layoutStringToPath(
      textLayer.rawText,
      textLayer.fontFamily,
      textLayer.fontSizeMm,
      textLayer.letterSpacingMm,
      textLayer.isStencilBridged,
      textLayer.bridgeWidthMm
    );
    textLayer.derivedPathData = layout.pathData;
    textLayer.name = `Text: ${textLayer.rawText.slice(0, 10)}`;

    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public updateMountingHole(
    layerId: string,
    updates: {
      diameterMm?: number;
      standoffType?: 'flush_screw' | 'barrel_spacer' | 'keyhole_hanger';
      edgeOffsetMm?: number;
    }
  ): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'mounting_hole') return;
    this.pushHistory();
    const holeLayer = layer as MountingHoleFeatureLayer;
    if (updates.diameterMm !== undefined) {
      holeLayer.diameterMm = updates.diameterMm;
      holeLayer.name = `Mounting Hole (${updates.diameterMm}mm)`;
    }
    if (updates.standoffType !== undefined) holeLayer.standoffType = updates.standoffType;
    if (updates.edgeOffsetMm !== undefined) holeLayer.edgeOffsetMm = updates.edgeOffsetMm;

    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public addFourCornerMountingHoles(diameterMm = 6.0, edgeOffsetMm = 15.0): void {
    this.pushHistory();
    const w = this.currentDoc.boundary.widthMm;
    const h = this.currentDoc.boundary.heightMm;

    const corners: [string, number, number][] = [
      ['Top-Left', edgeOffsetMm, edgeOffsetMm],
      ['Top-Right', w - edgeOffsetMm, edgeOffsetMm],
      ['Bottom-Left', edgeOffsetMm, h - edgeOffsetMm],
      ['Bottom-Right', w - edgeOffsetMm, h - edgeOffsetMm],
    ];

    for (const [label, cx, cy] of corners) {
      const layer: MountingHoleFeatureLayer = {
        id: `hole-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: `Standoff ${label} (${diameterMm}mm)`,
        type: 'mounting_hole',
        visible: true,
        locked: false,
        camLayer: '0_CUT_INTERNAL',
        cutSequencePriority: 0,
        transform: { xMm: cx, yMm: cy, scaleX: 1, scaleY: 1, rotationDeg: 0 },
        diameterMm,
        standoffType: 'barrel_spacer',
        edgeOffsetMm,
      };
      this.currentDoc.layers.push(layer);
    }

    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public duplicateLayer(layerId: string): AnyFeatureLayer | null {
    const original = this.currentDoc.layers.find(l => l.id === layerId);
    if (!original) return null;
    this.pushHistory();

    const clone: AnyFeatureLayer = JSON.parse(JSON.stringify(original));
    clone.id = `${original.type}-${Date.now().toString(36)}`;
    clone.name = `${original.name} (Copy)`;
    clone.transform.xMm += 10;
    clone.transform.yMm += 10;

    this.currentDoc.layers.push(clone);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return clone;
  }

  public setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer) return;
    this.pushHistory();
    layer.visible = visible;
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public setLayerLocked(layerId: string, locked: boolean): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer) return;
    this.pushHistory();
    layer.locked = locked;
    this.currentDoc.updatedAt = Date.now();
    this.notify();
  }

  public setLayerCamLayer(layerId: string, camLayer: '0_CUT_INTERNAL' | '1_CUT_PERIMETER' | '2_VECTOR_SCORE'): void {
    const layer = this.currentDoc.layers.find(l => l.id === layerId);
    if (!layer) return;
    this.pushHistory();
    layer.camLayer = camLayer;
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
  }

  public removeLayer(layerId: string): boolean {
    const idx = this.currentDoc.layers.findIndex(l => l.id === layerId);
    if (idx === -1) return false;
    this.pushHistory();
    this.currentDoc.layers.splice(idx, 1);
    this.currentDoc.updatedAt = Date.now();
    this.recomputeAnalytics();
    this.notify();
    return true;
  }

  public reorderLayer(layerId: string, direction: 'up' | 'down'): void {
    const idx = this.currentDoc.layers.findIndex(l => l.id === layerId);
    if (idx === -1) return;
    if (direction === 'up' && idx < this.currentDoc.layers.length - 1) {
      this.pushHistory();
      const tmp = this.currentDoc.layers[idx];
      this.currentDoc.layers[idx] = this.currentDoc.layers[idx + 1];
      this.currentDoc.layers[idx + 1] = tmp;
      this.notify();
    } else if (direction === 'down' && idx > 0) {
      this.pushHistory();
      const tmp = this.currentDoc.layers[idx];
      this.currentDoc.layers[idx] = this.currentDoc.layers[idx - 1];
      this.currentDoc.layers[idx - 1] = tmp;
      this.notify();
    }
  }

  // --- Manufacturing Analytics & Validation ---

  private recomputeAnalytics(): void {
    const doc = this.currentDoc;
    let totalCutLengthMm = 0;
    let totalPierceCount = 0;

    // 1. Outer boundary cut length
    const boundaryCmds = VectorGeometryEngine.parsePath(doc.boundary.pathData);
    totalCutLengthMm += VectorGeometryEngine.computePathLengthMm(boundaryCmds);
    totalPierceCount += 1; // Perimeter cut pierce

    // 2. Layers cut length & pierce counts
    for (const layer of doc.layers) {
      if (!layer.visible) continue;
      if (layer.type === 'mounting_hole') {
        const hole = layer as MountingHoleFeatureLayer;
        const circ = Math.PI * hole.diameterMm;
        totalCutLengthMm += circ;
        totalPierceCount += 1;
      } else if (layer.type === 'typography') {
        const text = layer as TypographyFeatureLayer;
        if (text.derivedPathData) {
          const cmds = VectorGeometryEngine.parsePath(text.derivedPathData);
          totalCutLengthMm += VectorGeometryEngine.computePathLengthMm(cmds);
          // Pierce count = number of 'M' commands
          const moves = cmds.filter(c => c.op === 'M').length;
          totalPierceCount += Math.max(1, moves);
        }
      } else if (layer.type === 'vector_path') {
        const pathLayer = layer as VectorPathFeatureLayer;
        if (pathLayer.pathData) {
          const cmds = VectorGeometryEngine.parsePath(pathLayer.pathData);
          totalCutLengthMm += VectorGeometryEngine.computePathLengthMm(cmds);
          const moves = cmds.filter(c => c.op === 'M').length;
          totalPierceCount += Math.max(1, moves);
        }
      }
    }

    // 3. Physical Area & Part Weight
    const sheetAreaSqMm = doc.boundary.widthMm * doc.boundary.heightMm;
    const areaSqM = sheetAreaSqMm / 1000000;
    const thicknessM = doc.material.thicknessMm / 1000;
    const densityKgPerM3 = doc.material.activeGaugeParams.densityGPerCm3 * 1000; // g/cm3 -> kg/m3
    const partWeightKg = Math.round(areaSqM * thicknessM * densityKgPerM3 * 100) / 100;

    // 4. Cutting Time Estimation
    const feedRateMmPerSec = doc.material.activeGaugeParams.feedRateMmPerMin / 60;
    const cuttingTimeSec = totalCutLengthMm / (feedRateMmPerSec || 50);
    const pierceTimeSec = totalPierceCount * doc.material.activeGaugeParams.pierceDwellSec;
    const estimatedCutTimeSec = Math.round((cuttingTimeSec + pierceTimeSec) * 10) / 10;

    // 5. Automated CAM Validation
    const validationIssues = validateVectorDocument({
      doc,
      machine: FIBER_LASER_3KW_PROFILE,
      gauge: doc.material.activeGaugeParams,
    });

    const hasErrors = validationIssues.some(i => i.severity === 'error');

    doc.manufacturingAnalytics = {
      totalCutLengthMm: Math.round(totalCutLengthMm * 10) / 10,
      totalPierceCount,
      sheetAreaSqMm,
      estimatedCutTimeSec,
      partWeightKg,
      isValidated: !hasErrors,
      validationIssues,
    };
  }

  private createDefaultDocument(): VectorDocument {
    const gauge = getGaugeParameters(FIBER_LASER_3KW_PROFILE, 'mild_steel', 2.0);
    const widthMm = 300;
    const heightMm = 200;

    return {
      version: '3.0.0',
      documentId: `vdm-${Date.now().toString(36)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unit: 'mm',
      material: {
        substrate: 'mild_steel',
        thicknessMm: 2.0,
        finish: 'natural_mill',
        machineProfileId: FIBER_LASER_3KW_PROFILE.id,
        activeGaugeParams: gauge,
      },
      boundary: {
        id: 'boundary-default',
        name: 'Workpiece Boundary',
        type: 'boundary',
        visible: true,
        locked: true,
        camLayer: '1_CUT_PERIMETER',
        cutSequencePriority: 10,
        transform: { xMm: 0, yMm: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
        shapeTemplateId: 'rectangle',
        widthMm,
        heightMm,
        cornerRadiusMm: 0,
        borderThicknessMm: 0,
        pathData: generateRectPath(widthMm, heightMm, 0),
      },
      layers: [],
      manufacturingAnalytics: {
        totalCutLengthMm: 1000,
        totalPierceCount: 1,
        sheetAreaSqMm: 60000,
        estimatedCutTimeSec: 16.7,
        partWeightKg: 0.94,
        isValidated: true,
        validationIssues: [],
      },
    };
  }
}

function generateRectPath(w: number, h: number, r: number): string {
  if (r <= 0) {
    return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
  }
  const rad = Math.min(r, w / 2, h / 2);
  return `M ${rad} 0 L ${w - rad} 0 Q ${w} 0 ${w} ${rad} L ${w} ${h - rad} Q ${w} ${h} ${w - rad} ${h} L ${rad} ${h} Q 0 ${h} 0 ${h - rad} L 0 ${rad} Q 0 0 ${rad} 0 Z`;
}
