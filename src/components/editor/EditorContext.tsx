import React, { createContext, useContext, ReactNode } from 'react';
import { useEditorState } from '@/hooks/useEditorState';
import { EditorState, EditorAction } from '@/lib/editorTypes';

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addImage: (file: File) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const editor = useEditorState();
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
