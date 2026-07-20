import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { NotesScreen } from '../screens/NotesScreen';
import { useNotes } from '../features/notes/useNotes';
import { CreateNoteInput, NoteRecord } from '../features/notes/noteTypes';

jest.mock('../features/notes/useNotes', () => ({
  useNotes: jest.fn(),
}));

function makeNote(overrides: Partial<NoteRecord> = {}): NoteRecord {
  return {
    id: 'note-1',
    userId: 'user-1',
    title: 'Captured thought',
    body: 'Keep this idea around for later.',
    source: 'idea_dump',
    sourceEventId: 'event-1',
    sourceStepId: null,
    processed: false,
    archived: false,
    createdAt: new Date(2026, 6, 20, 10, 0, 0),
    updatedAt: new Date(2026, 6, 20, 10, 0, 0),
    ...overrides,
  };
}

describe('NotesScreen', () => {
  it('renders the empty state', () => {
    const mockedUseNotes = useNotes as jest.MockedFunction<typeof useNotes>;
    mockedUseNotes.mockReturnValue({ notes: [], uiState: 'empty', createNote: async () => undefined });

    render(<NotesScreen />);

    expect(screen.getByText('No notes yet.')).toBeTruthy();
    expect(screen.getByText('New Note')).toBeTruthy();
  });

  it('renders saved notes with source metadata', () => {
    const mockedUseNotes = useNotes as jest.MockedFunction<typeof useNotes>;
    mockedUseNotes.mockReturnValue({
      notes: [makeNote(), makeNote({ id: 'note-2', source: 'manual', title: 'Manual note', sourceEventId: null })],
      uiState: 'ready',
      createNote: async () => undefined,
    });

    render(<NotesScreen />);

    expect(screen.getByText('Captured thought')).toBeTruthy();
    expect(screen.getByText('Manual note')).toBeTruthy();
    expect(screen.getByText('Idea Dump')).toBeTruthy();
    expect(screen.getByText('Manual Note')).toBeTruthy();
  });

  it('opens the new note modal and saves a manual note', async () => {
    const createNote = jest.fn(async (_input: CreateNoteInput) => undefined);
    const mockedUseNotes = useNotes as jest.MockedFunction<typeof useNotes>;
    mockedUseNotes.mockReturnValue({ notes: [], uiState: 'empty', createNote });

    render(<NotesScreen />);

    fireEvent.press(screen.getByText('New Note'));
    fireEvent.changeText(screen.getByLabelText('Note title'), 'Inbox thought');
    fireEvent.changeText(screen.getByLabelText('Note body'), 'Capture this before it disappears.');
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Save note'));
    });

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith({
        title: 'Inbox thought',
        body: 'Capture this before it disappears.',
        source: 'manual',
      });
    });
  });
});