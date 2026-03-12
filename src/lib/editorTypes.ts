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
}

export type EditorAction =
  | { type: 'SET_SHAPE'; shapeId: string }
  | { type: 'SET_DIMENSIONS'; width?: number; height?: number }
  | { type: 'SET_BORDER_THICKNESS'; value: number }
  | { type: 'SET_CORNER_RADIUS'; value: number }
  | { type: 'SET_UNIT'; unit: 'mm' | 'inch' }
  | { type: 'ADD_LAYER'; layer: EditorLayer }
  | { type: 'UPDATE_LAYER'; id: string; updates: Partial<EditorLayer> }
  | { type: 'REMOVE_LAYER'; id: string }
  | { type: 'SELECT_LAYER'; id: string | null }
  | { type: 'REORDER_LAYERS'; layers: EditorLayer[] }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_GRID' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' };
