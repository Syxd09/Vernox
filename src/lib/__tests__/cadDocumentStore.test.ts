/**
 * Unit tests for CadDocumentStore
 * Validates document lifecycle, layer mutations, undo/redo stack, and CAM analytics
 */

import { describe, it, expect } from 'vitest';
import { CadDocumentStore } from '../cadDocumentStore';

describe('CadDocumentStore', () => {
  it('initializes with valid default document and analytics', () => {
    const store = new CadDocumentStore();
    const doc = store.getDocument();

    expect(doc.version).toBe('3.0.0');
    expect(doc.boundary.widthMm).toBe(300);
    expect(doc.boundary.heightMm).toBe(200);
    expect(doc.material.substrate).toBe('mild_steel');
    expect(doc.manufacturingAnalytics.sheetAreaSqMm).toBe(60000);
    expect(doc.manufacturingAnalytics.totalPierceCount).toBe(1);
    expect(doc.manufacturingAnalytics.partWeightKg).toBeGreaterThan(0);
    expect(doc.manufacturingAnalytics.isValidated).toBe(true);
  });

  it('adds typography layer and recomputes analytics', () => {
    const store = new CadDocumentStore();
    const layer = store.addTypography('VERNOX', 'antwerp_monogram_stencil', 40, { x: 50, y: 50 });

    expect(layer.type).toBe('typography');
    expect(layer.rawText).toBe('VERNOX');
    expect(layer.derivedPathData).toBeTruthy();

    const doc = store.getDocument();
    expect(doc.layers.length).toBe(1);
    // Total cut length should have increased from boundary (1000) by letters cut length
    expect(doc.manufacturingAnalytics.totalCutLengthMm).toBeGreaterThan(1000);
  });

  it('supports undo and redo on feature addition and transform updates', () => {
    const store = new CadDocumentStore();
    expect(store.canUndo()).toBe(false);

    // 1. Add a hole
    const hole = store.addMountingHole(6.0, 'flush_screw', { x: 25, y: 25 }, 25);
    expect(store.getDocument().layers.length).toBe(1);
    expect(store.canUndo()).toBe(true);

    // 2. Update transform
    store.updateTransform(hole.id, { xMm: 30, yMm: 30 });
    expect(store.getDocument().layers[0].transform.xMm).toBe(30);

    // 3. Undo transform
    store.undo();
    expect(store.getDocument().layers[0].transform.xMm).toBe(25);
    expect(store.canRedo()).toBe(true);

    // 4. Undo hole addition
    store.undo();
    expect(store.getDocument().layers.length).toBe(0);

    // 5. Redo hole addition
    store.redo();
    expect(store.getDocument().layers.length).toBe(1);
    expect(store.getDocument().layers[0].transform.xMm).toBe(25);

    // 6. Redo transform update
    store.redo();
    expect(store.getDocument().layers[0].transform.xMm).toBe(30);
  });

  it('updates material specifications and recalculates part weight', () => {
    const store = new CadDocumentStore();
    const initialWeight = store.getDocument().manufacturingAnalytics.partWeightKg;

    // Switch from 2mm steel to 6mm steel (3x thickness)
    store.setMaterial('mild_steel', 6.0, 'brushed_hairline');
    const heavierDoc = store.getDocument();
    expect(heavierDoc.material.thicknessMm).toBe(6.0);
    expect(heavierDoc.manufacturingAnalytics.partWeightKg).toBeCloseTo(initialWeight * 3, 1);
    const steelWeight = heavierDoc.manufacturingAnalytics.partWeightKg;

    // Switch to aluminum (density ~2.68 vs ~7.85)
    store.setMaterial('aluminum_5052', 6.0, 'natural_mill');
    const aluminumDoc = store.getDocument();
    expect(aluminumDoc.manufacturingAnalytics.partWeightKg).toBeLessThan(steelWeight);
  });

  it('reactively triggers CAM validation warnings when rule is violated', () => {
    const store = new CadDocumentStore();
    // Add hole too close to boundary (< minWebWidthMm)
    store.addMountingHole(5.0, 'barrel_spacer', { x: 1, y: 1 }, 1.0);

    const doc = store.getDocument();
    expect(doc.manufacturingAnalytics.isValidated).toBe(false);
    const hasCam02 = doc.manufacturingAnalytics.validationIssues.some(i => i.ruleId === 'CAM-02');
    expect(hasCam02).toBe(true);

    // Remove the violating hole
    store.removeLayer(doc.layers[0].id);
    const resolvedDoc = store.getDocument();
    expect(resolvedDoc.manufacturingAnalytics.isValidated).toBe(true);
  });

  it('aggregates CAM-01 enclosed island warnings and clears when converted to vector score', () => {
    const store = new CadDocumentStore();
    // Path with outer square (0..100) and 3 inner concentric squares (islands)
    const donutPath = 'M 0 0 L 100 0 L 100 100 L 0 100 Z M 10 10 L 90 10 L 90 90 L 10 90 Z M 20 20 L 80 20 L 80 80 L 20 80 Z M 30 30 L 70 30 L 70 70 L 30 70 Z';
    const layer = store.addVectorPath(donutPath, 'Floral Art Clipart', { minX: 0, minY: 0, maxX: 100, maxY: 100, widthMm: 100, heightMm: 100 }, true, '0_CUT_INTERNAL');

    const docBefore = store.getDocument();
    const cam01Issues = docBefore.manufacturingAnalytics.validationIssues.filter(i => i.ruleId === 'CAM-01');
    // Exactly 1 aggregated issue per layer, not flooded
    expect(cam01Issues.length).toBe(1);
    expect(cam01Issues[0].message).toContain('Floral Art Clipart');
    expect(cam01Issues[0].message).toContain('unbridged enclosed island');

    // Convert layer to 2_VECTOR_SCORE (Surface Etch)
    store.setLayerCamLayer(layer.id, '2_VECTOR_SCORE');
    const docAfter = store.getDocument();
    const cam01After = docAfter.manufacturingAnalytics.validationIssues.filter(i => i.ruleId === 'CAM-01');
    // Zero fallout violations on vector score!
    expect(cam01After.length).toBe(0);
  });
});
