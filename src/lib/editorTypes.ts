export interface EditorLayer {
  id: string;
  type: 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  imageData: string; // data URL
  originalImageData: string;
  // Filters
  brightness?: number;   // -1..1 (Konva: -1..1)
  contrast?: number;     // -100..100
  saturation?: number;   // -2..10
  hue?: number;          // 0..360
  grayscale?: boolean;
  invert?: boolean;
  blur?: number;         // px
}

export interface EditorState {
  selectedShapeId: string;
  shapeWidth: number;
  shapeHeight: number;
  shapeBorderThickness: number;
  shapeCornerRadius: number;
  unit: 'mm' | 'inch';
  layers: EditorLayer[];
  selectedLayerId: string | null;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  history: EditorLayer[][];
  historyIndex: number;
  showGrid: boolean;
  metalPreview: boolean;
  metalFinish: 'steel' | 'stainless' | 'aluminum' | 'brass' | 'copper' | 'gold' | 'corten';
  metalType: 'steel' | 'stainless' | 'aluminum' | 'brass' | 'copper' | 'gold' | 'corten';
  metalThickness: number; // in mm
}

export type EditorAction =
  | { type: 'SET_SHAPE'; shapeId: string }
  | { type: 'SET_DIMENSIONS'; width?: number; height?: number }
  | { type: 'SET_BORDER_THICKNESS'; value: number }
  | { type: 'SET_CORNER_RADIUS'; value: number }
  | { type: 'SET_UNIT'; unit: 'mm' | 'inch' }
  | { type: 'ADD_LAYER'; layer: EditorLayer }
  | { type: 'UPDATE_LAYER'; id: string; updates: Partial<EditorLayer> }
  | { type: 'DUPLICATE_LAYER'; id: string }
  | { type: 'REMOVE_LAYER'; id: string }
  | { type: 'SELECT_LAYER'; id: string | null }
  | { type: 'REORDER_LAYERS'; layers: EditorLayer[] }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_METAL_PREVIEW' }
  | { type: 'SET_METAL_FINISH'; finish: EditorState['metalFinish'] }
  | { type: 'SET_METAL_TYPE'; metalType: EditorState['metalType'] }
  | { type: 'SET_METAL_THICKNESS'; thickness: number }
  | { type: 'LOAD_PROJECT'; state: Partial<EditorState> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' };
