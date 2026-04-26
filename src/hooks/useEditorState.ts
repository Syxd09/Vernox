import { useReducer, useCallback } from 'react';
import { EditorState, EditorAction, EditorLayer } from '@/lib/editorTypes';

const initialState: EditorState = {
  selectedShapeId: 'circle',
  shapeWidth: 200,
  shapeHeight: 200,
  shapeBorderThickness: 2,
  shapeCornerRadius: 0,
  unit: 'mm',
  layers: [],
  selectedLayerId: null,
  zoom: 1,
  canvasWidth: 600,
  canvasHeight: 600,
  history: [[]],
  historyIndex: 0,
  showGrid: true,
  metalPreview: false,
  metalFinish: 'steel',
  metalType: 'steel',
  metalThickness: 3,
};

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_SHAPE':
      return { ...state, selectedShapeId: action.shapeId };
    case 'SET_DIMENSIONS':
      return {
        ...state,
        shapeWidth: action.width ?? state.shapeWidth,
        shapeHeight: action.height ?? state.shapeHeight,
      };
    case 'SET_BORDER_THICKNESS':
      return { ...state, shapeBorderThickness: action.value };
    case 'SET_CORNER_RADIUS':
      return { ...state, shapeCornerRadius: action.value };
    case 'SET_UNIT':
      return { ...state, unit: action.unit };
    case 'ADD_LAYER':
      return { ...state, layers: [...state.layers, action.layer], selectedLayerId: action.layer.id };
    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map(l => l.id === action.id ? { ...l, ...action.updates } : l),
      };
    case 'DUPLICATE_LAYER': {
      const original = state.layers.find(l => l.id === action.id);
      if (!original) return state;
      const copy: EditorLayer = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} copy`,
        x: original.x + 20,
        y: original.y + 20,
      };
      return { ...state, layers: [...state.layers, copy], selectedLayerId: copy.id };
    }
    case 'REMOVE_LAYER':
      return {
        ...state,
        layers: state.layers.filter(l => l.id !== action.id),
        selectedLayerId: state.selectedLayerId === action.id ? null : state.selectedLayerId,
      };
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.id };
    case 'REORDER_LAYERS':
      return { ...state, layers: action.layers };
    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.1, Math.min(5, action.zoom)) };
    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };
    case 'TOGGLE_METAL_PREVIEW':
      return { ...state, metalPreview: !state.metalPreview };
    case 'SET_METAL_FINISH':
      return { ...state, metalFinish: action.finish, metalType: action.finish };
    case 'SET_METAL_TYPE':
      return { ...state, metalType: action.metalType, metalFinish: action.metalType, metalPreview: true };
    case 'SET_METAL_THICKNESS':
      return { ...state, metalThickness: action.thickness };
    case 'LOAD_PROJECT':
      return { ...state, ...action.state, history: [JSON.parse(JSON.stringify(action.state.layers ?? []))], historyIndex: 0 };
    case 'PUSH_HISTORY': {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.layers)));
      return { ...state, history: newHistory, historyIndex: newHistory.length - 1 };
    }
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      return { ...state, layers: JSON.parse(JSON.stringify(state.history[idx])), historyIndex: idx };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      return { ...state, layers: JSON.parse(JSON.stringify(state.history[idx])), historyIndex: idx };
    }
    default:
      return state;
  }
}

export function useEditorState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Calculate scale to cover the shape by default
        const targetW = state.shapeWidth;
        const targetH = state.shapeHeight;
        const scaleX = targetW / img.width;
        const scaleY = targetH / img.height;
        const scale = Math.max(scaleX, scaleY);
        
        const layerWidth = img.width * scale;
        const layerHeight = img.height * scale;

        const layer: EditorLayer = {
          id: crypto.randomUUID(),
          type: 'image',
          name: file.name,
          x: (targetW - layerWidth) / 2,
          y: (targetH - layerHeight) / 2,
          width: layerWidth,
          height: layerHeight,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          imageData: dataUrl,
          originalImageData: dataUrl,
        };
        dispatch({ type: 'ADD_LAYER', layer });
        dispatch({ type: 'PUSH_HISTORY' });
      };
      img.src = dataUrl;

    };
    reader.readAsDataURL(file);
  }, [state.shapeWidth, state.shapeHeight]);

  return { state, dispatch, addImage };
}
