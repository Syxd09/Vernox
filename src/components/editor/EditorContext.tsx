import React, { createContext, useContext, ReactNode } from 'react';
import { useEditorState } from '@/hooks/useEditorState';
import { EditorState, EditorAction } from '@/lib/editorTypes';

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addImage: (file: File) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const editor = useEditorState();
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}
