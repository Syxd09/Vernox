import { useEffect } from 'react';
import { EditorAction } from '@/lib/editorTypes';

export function useKeyboardShortcuts(dispatch: React.Dispatch<EditorAction>, selectedLayerId: string | null) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        e.preventDefault();
        dispatch({ type: 'REMOVE_LAYER', id: selectedLayerId });
        dispatch({ type: 'PUSH_HISTORY' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'SELECT_LAYER', id: null });
      } else if (e.key === '+' || e.key === '=') {
        if (ctrl) { e.preventDefault(); dispatch({ type: 'SET_ZOOM', zoom: 0.1 }); }
      } else if (e.key === '-') {
        if (ctrl) { e.preventDefault(); dispatch({ type: 'SET_ZOOM', zoom: -0.1 }); }
      } else if (ctrl && e.key === 'g') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_GRID' });
      } else if (ctrl && e.key === 'd' && selectedLayerId) {
        e.preventDefault();
        dispatch({ type: 'DUPLICATE_LAYER', id: selectedLayerId });
        dispatch({ type: 'PUSH_HISTORY' });
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, selectedLayerId]);
}
