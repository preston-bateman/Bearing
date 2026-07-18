import { useCallback, useEffect, useState } from 'react';

import { getFirebaseAuth } from '../../services/firebase/firebaseAuth';
import {
  createEvent as createFirebaseEvent,
  deleteEvent as deleteFirebaseEvent,
  subscribeToEventsByDateRange,
  updateEvent as updateFirebaseEvent,
} from '../../services/firebase/firebaseEvents';
import {
  CalendarEvent,
  CalendarUiState,
  CreateEventInput,
  UpdateEventInput,
} from './calendarTypes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export type UseCalendarEventsReturn = {
  /** All events loaded for the visible month. */
  events: CalendarEvent[];
  /** Events filtered to the given date. */
  eventsForDate: (date: Date) => CalendarEvent[];
  uiState: CalendarUiState;
  createEvent: (input: CreateEventInput) => Promise<void>;
  updateEvent: (eventId: string, fields: UpdateEventInput) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
};

/**
 * Loads and subscribes to events for the month containing `selectedDate`.
 * Re-subscribes automatically when the month changes.
 */
export function useCalendarEvents(selectedDate: Date): UseCalendarEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [uiState, setUiState] = useState<CalendarUiState>('loading');

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  useEffect(() => {
    const userId = getFirebaseAuth().currentUser?.uid;

    if (!userId) {
      setUiState('error');
      return;
    }

    setUiState('loading');

    const monthStart = getMonthStart(new Date(year, month, 1));
    const monthEnd = getMonthEnd(new Date(year, month, 1));

    const unsubscribe = subscribeToEventsByDateRange(
      userId,
      monthStart,
      monthEnd,
      (fetched) => {
        setEvents(fetched);
        setUiState(fetched.length === 0 ? 'empty' : 'ready');
      },
      () => {
        setUiState('error');
      },
    );

    return unsubscribe;
  }, [year, month]);

  const eventsForDate = useCallback(
    (date: Date): CalendarEvent[] => events.filter((e) => isSameCalendarDay(e.startAt, date)),
    [events],
  );

  const createEvent = useCallback(async (input: CreateEventInput): Promise<void> => {
    const userId = getFirebaseAuth().currentUser?.uid;
    if (!userId) throw new Error('User is not authenticated.');
    await createFirebaseEvent(userId, input);
  }, []);

  const updateEvent = useCallback(
    async (eventId: string, fields: UpdateEventInput): Promise<void> => {
      const userId = getFirebaseAuth().currentUser?.uid;
      if (!userId) throw new Error('User is not authenticated.');
      await updateFirebaseEvent(userId, eventId, fields);
    },
    [],
  );

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    const userId = getFirebaseAuth().currentUser?.uid;
    if (!userId) throw new Error('User is not authenticated.');
    await deleteFirebaseEvent(userId, eventId);
  }, []);

  return { events, eventsForDate, uiState, createEvent, updateEvent, deleteEvent };
}
