/**
 * React Hook for Vector Document Store
 * Exposes document state, CAM analytics, undo/redo, and feature actions
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CadDocumentStore } from '../lib/cadDocumentStore';
import type { 
  VectorDocument, 
  Point2D, 
  BoundingBox2D, 
  MetalSubstrate, 
  MetalFinish,
  AffineTransform2D 
} from '../lib/cadEngineTypes';

// Global singleton store for active CAD session
let globalCadStore: CadDocumentStore | null = null;

export function getGlobalCadStore(): CadDocumentStore {
  if (!globalCadStore) {
    globalCadStore = new CadDocumentStore();
  }
  return globalCadStore;
}

export function useVectorDocument(initialDoc?: VectorDocument) {
  const store = useMemo(() => {
    if (initialDoc) return new CadDocumentStore(initialDoc);
    return getGlobalCadStore();
  }, [initialDoc]);

  const [doc, setDoc] = useState<VectorDocument>(() => store.getDocument());
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(() => store.getSelectedLayerId());

  useEffect(() => {
    return store.subscribe(updatedDoc => {
      setDoc({ ...updatedDoc });
      setSelectedLayerId(store.getSelectedLayerId());
    });
  }, [store]);

  const selectLayer = useCallback((id: string | null) => store.selectLayer(id), [store]);
  const undo = useCallback(() => store.undo(), [store]);
  const redo = useCallback(() => store.redo(), [store]);
  const canUndo = store.canUndo();
  const canRedo = store.canRedo();

  const setMaterial = useCallback((substrate: MetalSubstrate, thicknessMm: number, finish: MetalFinish) => {
    store.setMaterial(substrate, thicknessMm, finish);
  }, [store]);

  const setBoundary = useCallback((widthMm: number, heightMm: number, cornerRadiusMm = 0, shapeTemplateId?: string, customPathData?: string) => {
    store.setBoundary(widthMm, heightMm, cornerRadiusMm, shapeTemplateId, customPathData);
  }, [store]);

  const addTypography = useCallback((text: string, fontId?: string, sizeMm?: number, pos?: Point2D, bridged?: boolean, bridgeWidth?: number) => {
    return store.addTypography(text, fontId, sizeMm, pos, bridged, bridgeWidth);
  }, [store]);

  const updateTypography = useCallback((layerId: string, updates: Parameters<typeof store.updateTypography>[1]) => {
    store.updateTypography(layerId, updates);
  }, [store]);

  const addMountingHole = useCallback((diameterMm?: number, standoffType?: any, pos?: Point2D, edgeOffset?: number) => {
    return store.addMountingHole(diameterMm, standoffType, pos, edgeOffset);
  }, [store]);

  const updateMountingHole = useCallback((layerId: string, updates: Parameters<typeof store.updateMountingHole>[1]) => {
    store.updateMountingHole(layerId, updates);
  }, [store]);

  const addFourCornerMountingHoles = useCallback((diameterMm = 6.0, edgeOffsetMm = 15.0) => {
    store.addFourCornerMountingHoles(diameterMm, edgeOffsetMm);
  }, [store]);

  const addVectorPath = useCallback((pathData: string, name: string, boundsMm: BoundingBox2D, isClosed?: boolean, camLayer?: any) => {
    return store.addVectorPath(pathData, name, boundsMm, isClosed, camLayer);
  }, [store]);

  const addImageTracedPath = useCallback((pathData: string, boundsMm: BoundingBox2D, name?: string) => {
    return store.addImageTracedPath(pathData, boundsMm, name);
  }, [store]);

  const updateTransform = useCallback((layerId: string, transform: Partial<AffineTransform2D>) => {
    store.updateTransform(layerId, transform);
  }, [store]);

  const beginTransformGesture = useCallback(() => {
    store.beginTransformGesture();
  }, [store]);

  const updateTransformLive = useCallback((layerId: string, transform: Partial<AffineTransform2D>) => {
    store.updateTransformLive(layerId, transform);
  }, [store]);

  const commitTransform = useCallback(() => {
    store.commitTransform();
  }, [store]);

  const toggleStencilBridging = useCallback((layerId: string, bridged: boolean, bridgeWidthMm?: number) => {
    store.toggleStencilBridging(layerId, bridged, bridgeWidthMm);
  }, [store]);

  const duplicateLayer = useCallback((layerId: string) => {
    return store.duplicateLayer(layerId);
  }, [store]);

  const setLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    store.setLayerVisibility(layerId, visible);
  }, [store]);

  const setLayerLocked = useCallback((layerId: string, locked: boolean) => {
    store.setLayerLocked(layerId, locked);
  }, [store]);

  const setLayerCamLayer = useCallback((layerId: string, camLayer: '0_CUT_INTERNAL' | '1_CUT_PERIMETER' | '2_VECTOR_SCORE') => {
    store.setLayerCamLayer(layerId, camLayer);
  }, [store]);

  const removeLayer = useCallback((layerId: string) => {
    return store.removeLayer(layerId);
  }, [store]);

  const reorderLayer = useCallback((layerId: string, direction: 'up' | 'down') => {
    store.reorderLayer(layerId, direction);
  }, [store]);

  return {
    doc,
    analytics: doc.manufacturingAnalytics,
    canUndo,
    canRedo,
    undo,
    redo,
    setMaterial,
    setBoundary,
    addTypography,
    updateTypography,
    addMountingHole,
    updateMountingHole,
    addFourCornerMountingHoles,
    addVectorPath,
    addImageTracedPath,
    updateTransform,
    beginTransformGesture,
    updateTransformLive,
    commitTransform,
    toggleStencilBridging,
    duplicateLayer,
    setLayerVisibility,
    setLayerLocked,
    setLayerCamLayer,
    removeLayer,
    reorderLayer,
    selectedLayerId,
    selectLayer,
  };
}
