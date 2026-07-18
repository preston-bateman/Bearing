import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { DayNavBar } from '../components/calendar/DayNavBar';
import { ViewModeToggle } from '../components/calendar/ViewModeToggle';
import { HourlyTimeline } from '../components/calendar/HourlyTimeline';
import { MonthGrid, MONTH_NAMES } from '../components/calendar/MonthGrid';
import { AddEventModal } from '../components/calendar/AddEventModal';
import { EventDetailModal } from '../components/calendar/EventDetailModal';
import { colors, layout, spacing, typography } from '../design/tokens';
import {
  CalendarEvent,
  CalendarUiState,
  CreateEventInput,
  ViewMode,
} from '../features/calendar/calendarTypes';
import { useCalendarEvents } from '../features/calendar/useCalendarEvents';

// ---------------------------------------------------------------------------
// Month carousel data
// ---------------------------------------------------------------------------

type MonthItem = { year: number; month: number };

const MONTH_RANGE = 12; // months before and after today

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

function buildMonthList(baseDate: Date): MonthItem[] {
  const items: MonthItem[] = [];
  for (let i = -MONTH_RANGE; i <= MONTH_RANGE; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
    items.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Props (test overrides only)
// ---------------------------------------------------------------------------

export type CalendarScreenProps = {
  stateOverride?: CalendarUiState;
  eventsOverride?: CalendarEvent[];
  initialDateOverride?: Date;
  initialViewMode?: ViewMode;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CalendarScreen({
  stateOverride,
  eventsOverride,
  initialDateOverride,
  initialViewMode = 'day',
}: CalendarScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateOverride ?? new Date());
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [addEventVisible, setAddEventVisible] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  // Real data from hook (test overrides only when eventsOverride provided)
  const { events: realEvents, eventsForDate, uiState: realUiState, createEvent, deleteEvent } =
    useCalendarEvents(selectedDate);

  const uiState: CalendarUiState = stateOverride ?? realUiState;
  const dayEvents: CalendarEvent[] =
    eventsOverride ?? eventsForDate(selectedDate);

  // Month carousel
  const baseDate = initialDateOverride ?? new Date();
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();
  const monthList = useMemo(
    () => buildMonthList(baseDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseYear, baseMonth],
  );
  const initialMonthIndex = MONTH_RANGE;

  const flatListRef = useRef<FlatList<MonthItem>>(null);
  const [visibleMonthIndex, setVisibleMonthIndex] = useState(initialMonthIndex);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        setVisibleMonthIndex(viewableItems[0].index);
      }
    },
    [],
  );

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function handlePrevDay(): void {
    setSelectedDate((d) => addDays(d, -1));
  }

  function handleNextDay(): void {
    setSelectedDate((d) => addDays(d, 1));
  }

  function handleSelectDate(date: Date): void {
    setSelectedDate(date);
    setViewMode('day');
  }

  function handlePrevMonth(): void {
    const newIndex = Math.max(0, visibleMonthIndex - 1);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }

  function handleNextMonth(): void {
    const newIndex = Math.min(monthList.length - 1, visibleMonthIndex + 1);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }

  async function handleAddEvent(input: CreateEventInput): Promise<void> {
    try {
      await createEvent(input);
      setAddEventVisible(false);
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  }

  async function handleDeleteEvent(eventId: string): Promise<void> {
    try {
      await deleteEvent(eventId);
      setActiveEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  function handlePressAddEvent(): void {
    setAddEventVisible(true);
  }

  function handlePressEvent(event: CalendarEvent): void {
    setActiveEvent(event);
  }

  const visibleMonth = monthList[visibleMonthIndex];

  return (
    <View style={styles.screen}>
      <ViewModeToggle mode={viewMode} onChange={setViewMode} />

      {viewMode === 'day' ? (
        <>
          <DayNavBar date={selectedDate} onPrev={handlePrevDay} onNext={handleNextDay} />
          <HourlyTimeline
            date={selectedDate}
            events={dayEvents}
            onPressEvent={handlePressEvent}
            uiState={uiState}
          />
        </>
      ) : (
        <View style={styles.monthContainer}>
          {/* Month nav header */}
          <View style={styles.monthNavRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={handlePrevMonth}
              style={({ pressed }) => [styles.monthArrow, pressed ? styles.monthArrowPressed : null]}
            >
              <Text style={styles.monthArrowText}>‹</Text>
            </Pressable>
            {visibleMonth ? (
              <Text style={styles.monthNavTitle}>
                {MONTH_NAMES[visibleMonth.month]} {visibleMonth.year}
              </Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={handleNextMonth}
              style={({ pressed }) => [styles.monthArrow, pressed ? styles.monthArrowPressed : null]}
            >
              <Text style={styles.monthArrowText}>›</Text>
            </Pressable>
          </View>

          {/* Horizontally pageable month grids */}
          <FlatList
            ref={flatListRef}
            data={monthList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialMonthIndex}
            keyExtractor={({ year, month }) => `${year}-${month}`}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            viewabilityConfig={VIEWABILITY_CONFIG}
            onViewableItemsChanged={handleViewableItemsChanged}
            renderItem={({ item: { year, month } }) => {
              const eventDays = new Set<number>();
              realEvents.forEach((event) => {
                if (
                  event.startAt.getFullYear() === year &&
                  event.startAt.getMonth() === month
                ) {
                  eventDays.add(event.startAt.getDate());
                }
              });

              return (
                <MonthGrid
                  year={year}
                  month={month}
                  selectedDate={selectedDate}
                  eventDays={eventDays}
                  onSelectDate={handleSelectDate}
                  width={screenWidth}
                />
              );
            }}
          />
        </View>
      )}

      {/* Floating action button */}
      <View style={styles.fabContainer}>
        <FloatingActionButton
          label="Add Event"
          onPress={handlePressAddEvent}
          disabled={uiState === 'loading'}
        />
      </View>

      {/* Modals */}
      <AddEventModal
        visible={addEventVisible}
        initialDate={selectedDate}
        onClose={() => setAddEventVisible(false)}
        onSave={handleAddEvent}
      />
      <EventDetailModal event={activeEvent} onClose={() => setActiveEvent(null)} onDelete={handleDeleteEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  monthContainer: {
    flex: 1,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  monthArrow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minWidth: 36,
    alignItems: 'center',
  },
  monthArrowPressed: {
    opacity: 0.6,
  },
  monthArrowText: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.brand,
    fontWeight: '300',
  },
  monthNavTitle: {
    ...typography.button,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: layout.pagePaddingVertical,
    right: layout.pagePaddingHorizontal,
  },
});