import { EditorState } from './editorTypes';

const STORAGE_KEY = 'metalshape-projects';

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  state: Partial<EditorState>;
}

export function listProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedProject[];
  } catch {
    return [];
  }
}

export function saveProject(name: string, state: EditorState, id?: string): SavedProject {
  const projects = listProjects();
  const now = Date.now();
  const snapshot: Partial<EditorState> = {
    selectedShapeId: state.selectedShapeId,
    shapeWidth: state.shapeWidth,
    shapeHeight: state.shapeHeight,
    shapeBorderThickness: state.shapeBorderThickness,
    shapeCornerRadius: state.shapeCornerRadius,
    unit: state.unit,
    layers: state.layers,
    selectedLayerId: state.selectedLayerId,
    metalFinish: state.metalFinish,
  };

  const existingIdx = id ? projects.findIndex(p => p.id === id) : -1;
  let project: SavedProject;
  if (existingIdx >= 0) {
    project = { ...projects[existingIdx], name, state: snapshot, updatedAt: now };
    projects[existingIdx] = project;
  } else {
    project = { id: crypto.randomUUID(), name, state: snapshot, createdAt: now, updatedAt: now };
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return project;
}

export function deleteProject(id: string) {
  const projects = listProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProject(id: string): SavedProject | null {
  return listProjects().find(p => p.id === id) ?? null;
}