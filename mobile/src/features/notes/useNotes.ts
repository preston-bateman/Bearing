import { useCallback, useEffect, useState } from 'react';

import { getFirebaseAuth } from '../../services/firebase/firebaseAuth';
import { createNote as createFirebaseNote, subscribeToNotes } from '../../services/firebase/firebaseNotes';
import { CreateNoteInput, NoteRecord, NoteUiState } from './noteTypes';

export type UseNotesReturn = {
  notes: NoteRecord[];
  uiState: NoteUiState;
  createNote: (input: CreateNoteInput) => Promise<void>;
};

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [uiState, setUiState] = useState<NoteUiState>('loading');

  useEffect(() => {
    const userId = getFirebaseAuth().currentUser?.uid;

    if (!userId) {
      setUiState('error');
      return;
    }

    setUiState('loading');

    const unsubscribe = subscribeToNotes(
      userId,
      (fetchedNotes) => {
        setNotes(fetchedNotes);
        setUiState(fetchedNotes.length === 0 ? 'empty' : 'ready');
      },
      () => {
        setUiState('error');
      },
    );

    return unsubscribe;
  }, []);

  const createNote = useCallback(async (input: CreateNoteInput): Promise<void> => {
    const userId = getFirebaseAuth().currentUser?.uid;
    if (!userId) {
      throw new Error('User is not authenticated.');
    }

    await createFirebaseNote(userId, input);
  }, []);

  return { notes, uiState, createNote };
}