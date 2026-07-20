import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { GoalsScreen } from '../screens/GoalsScreen';
import { CreateGoalInput, GoalStepRecord, GoalWithSteps } from '../features/goals/goalTypes';
import { useGoals } from '../features/goals/useGoals';
import { useGoalStepEvents } from '../features/goals/useGoalStepEvents';
import { createEvent } from '../services/firebase/firebaseEvents';

jest.mock('../features/goals/useGoals', () => ({
  useGoals: jest.fn(),
}));

jest.mock('../features/goals/useGoalStepEvents', () => ({
  useGoalStepEvents: jest.fn(),
}));

jest.mock('../services/firebase/firebaseEvents', () => ({
  createEvent: jest.fn(),
  subscribeToEventsByDateRange: jest.fn(() => jest.fn()),
  subscribeToEventsByStepId: jest.fn(() => jest.fn()),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock('../services/firebase/firebaseAuth', () => ({
  getFirebaseAuth: jest.fn(() => ({ currentUser: { uid: 'test-user' } })),
}));

function makeStep(overrides: Partial<GoalStepRecord> = {}): GoalStepRecord {
  return {
    id: 'step-1',
    userId: 'user-1',
    goalId: 'goal-1',
    title: 'Buy running shoes',
    description: 'Pick a pair that can handle weekly mileage.',
    starter: 'Check two stores',
    estimatedFinishDate: new Date(2026, 6, 25),
    order: 0,
    status: 'pending',
    completedAt: null,
    createdAt: new Date(2026, 6, 20),
    updatedAt: new Date(2026, 6, 20),
    ...overrides,
  };
}

function makeGoal(overrides: Partial<GoalWithSteps> = {}): GoalWithSteps {
  const steps = overrides.steps ?? [makeStep()];

  return {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Run a 10k',
    description: 'Build an eight-week training block.',
    smartMeta: {
      specific: 'Complete a 10k race',
      measurable: 'Finish the race in under 60 minutes',
      achievable: 'Train four times each week',
      relevant: 'Improve overall fitness',
      timeBound: 'By October 1',
    },
    estimatedCompletionDate: new Date(2026, 8, 1),
    nextStepId: steps[0]?.id ?? null,
    status: 'active',
    isAiAssisted: false,
    aiPlanVersion: null,
    createdAt: new Date(2026, 6, 20),
    updatedAt: new Date(2026, 6, 20),
    steps,
    nextStep: steps[0] ?? null,
    completedStepCount: 0,
    totalStepCount: steps.length,
    progressText: `0 of ${steps.length} steps completed`,
    ...overrides,
  };
}

describe('GoalsScreen', () => {
  it('renders the empty state', () => {
    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [],
      uiState: 'empty',
      createGoal: async () => undefined,
      updateGoal: async () => undefined,
      markGoalCompleted: async () => undefined,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({ events: [], uiState: 'idle' });

    render(<GoalsScreen />);

    expect(screen.getByText('No goals yet.')).toBeTruthy();
    expect(screen.getByText('New Goal')).toBeTruthy();
  });

  it('renders goal cards with target date and next step', () => {
    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [makeGoal()],
      uiState: 'ready',
      createGoal: async () => undefined,
      updateGoal: async () => undefined,
      markGoalCompleted: async () => undefined,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({ events: [], uiState: 'idle' });

    render(<GoalsScreen />);

    expect(screen.getByText('Run a 10k')).toBeTruthy();
    expect(screen.getByText('Next task: Buy running shoes')).toBeTruthy();
    expect(screen.getByText('0 of 1 steps completed')).toBeTruthy();
  });

  it('walks the manual goal wizard and saves a goal', async () => {
    let savedGoalInput: CreateGoalInput | null = null;
    const createGoalMock = jest.fn(async (input: CreateGoalInput) => {
      savedGoalInput = input;
    });
    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [],
      uiState: 'empty',
      createGoal: createGoalMock,
      updateGoal: async () => undefined,
      markGoalCompleted: async () => undefined,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({ events: [], uiState: 'idle' });

    render(<GoalsScreen />);

    fireEvent.press(screen.getByText('New Goal'));
    fireEvent.press(screen.getByLabelText('Continue'));

    fireEvent.changeText(screen.getByLabelText('Goal name'), 'Run a 10k');
    fireEvent.changeText(screen.getByLabelText('Goal description'), 'Train consistently for eight weeks.');
    expect(screen.getByText('Simple SMART example')).toBeTruthy();
    expect(screen.getByText('Good goal: Walk 30 minutes after work, 4 days a week, for the next 6 weeks.')).toBeTruthy();
    expect(screen.queryByLabelText('SMART Specific')).toBeNull();
    fireEvent.press(screen.getByLabelText('Continue'));
    fireEvent.press(screen.getByLabelText('Open goal target month dropdown'));
    fireEvent.press(screen.getByLabelText('Select goal target month 10 - Oct'));
    fireEvent.press(screen.getByLabelText('Open goal target day dropdown'));
    fireEvent.press(screen.getByLabelText('Select goal target day 01'));
    fireEvent.press(screen.getByLabelText('Open goal target year dropdown'));
    fireEvent.press(screen.getByLabelText('Select goal target year 2026'));
    expect(screen.queryByText('AI planning is coming soon.')).toBeNull();
    fireEvent.press(screen.getByLabelText('Continue'));
    expect(screen.getByText('AI planning is coming soon.')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Continue'));
    fireEvent.changeText(screen.getByLabelText('Draft step 1 name'), 'Buy running shoes');
    fireEvent.changeText(screen.getByLabelText('Draft step 1 description'), 'Choose a supportive pair.');
    fireEvent.changeText(screen.getByLabelText('Draft step 1 starter'), 'Visit two stores');
    expect(screen.queryByLabelText('Draft step 1 estimated finish date')).toBeNull();
    fireEvent.press(screen.getByLabelText('Open draft step 1 month dropdown'));
    fireEvent.press(screen.getByLabelText('Select draft step 1 month 08 - Aug'));
    fireEvent.press(screen.getByLabelText('Open draft step 1 day dropdown'));
    fireEvent.press(screen.getByLabelText('Select draft step 1 day 05'));

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Save goal'));
    });

    await waitFor(() => {
      expect(createGoalMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Run a 10k',
          isAiAssisted: false,
          steps: [
            expect.objectContaining({
              title: 'Buy running shoes',
              starter: 'Visit two stores',
            }),
          ],
        }),
      );

      expect(createGoalMock).toHaveBeenCalledTimes(1);
      expect(savedGoalInput?.steps[0].estimatedFinishDate).toEqual(new Date(2026, 7, 5));
    });
  });

  it('limits year choices to the present or future and rejects a non-future target date', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 6, 20, 9, 0, 0));

    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [],
      uiState: 'empty',
      createGoal: async () => undefined,
      updateGoal: async () => undefined,
      markGoalCompleted: async () => undefined,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({ events: [], uiState: 'idle' });

    render(<GoalsScreen />);

    fireEvent.press(screen.getByText('New Goal'));
    fireEvent.press(screen.getByLabelText('Continue'));
    fireEvent.changeText(screen.getByLabelText('Goal name'), 'Run a 10k');
    fireEvent.changeText(screen.getByLabelText('Goal description'), 'Train consistently for eight weeks.');
    fireEvent.press(screen.getByLabelText('Continue'));

    expect(screen.getByText('Selected date: 07-21-2026')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Open goal target year dropdown'));
    expect(screen.queryByText('2025')).toBeNull();
    expect(screen.getByLabelText('Select goal target year 2026')).toBeTruthy();
    expect(screen.getByLabelText('Select goal target year 2076')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Select goal target year 2026'));
    fireEvent.press(screen.getByLabelText('Open goal target month dropdown'));
    fireEvent.press(screen.getByLabelText('Select goal target month 07 - Jul'));
    fireEvent.press(screen.getByLabelText('Open goal target day dropdown'));
    fireEvent.press(screen.getByLabelText('Select goal target day 20'));
    fireEvent.press(screen.getByLabelText('Continue'));

    expect(screen.getByText('Estimated completion date must be in the future.')).toBeTruthy();

    jest.useRealTimers();
  });

  it('opens goal details and marks a goal complete from edit mode', async () => {
    const markGoalCompletedMock = jest.fn(async () => undefined);
    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [makeGoal()],
      uiState: 'ready',
      createGoal: async () => undefined,
      updateGoal: async () => undefined,
      markGoalCompleted: markGoalCompletedMock,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({ events: [], uiState: 'idle' });

    render(<GoalsScreen />);

    fireEvent.press(screen.getByText('Run a 10k'));
    fireEvent.press(screen.getByLabelText('Edit goal'));

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Mark goal complete'));
    });

    await waitFor(() => {
      expect(markGoalCompletedMock).toHaveBeenCalledWith('goal-1');
    });
  });

  it('opens step scheduling with a prefilled event title and linked ids', async () => {
    const mockedUseGoals = useGoals as jest.MockedFunction<typeof useGoals>;
    const mockedUseGoalStepEvents = useGoalStepEvents as jest.MockedFunction<typeof useGoalStepEvents>;

    mockedUseGoals.mockReturnValue({
      goals: [makeGoal()],
      uiState: 'ready',
      createGoal: async () => undefined,
      updateGoal: async () => undefined,
      markGoalCompleted: async () => undefined,
      createStep: async () => undefined,
      updateStep: async () => undefined,
      reorderSteps: async () => undefined,
    });
    mockedUseGoalStepEvents.mockReturnValue({
      events: [
        {
          id: 'event-1',
          userId: 'user-1',
          title: 'Treadmill session',
          description: '',
          startAt: new Date(2026, 6, 27, 9, 0, 0),
          endAt: new Date(2026, 6, 27, 10, 0, 0),
          timezone: 'UTC',
          source: 'local',
          externalEventId: null,
          calendarConnectionId: null,
          goalId: 'goal-1',
          stepId: 'step-1',
          status: 'scheduled',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      uiState: 'ready',
    });

    render(<GoalsScreen />);

    fireEvent.press(screen.getByText('Run a 10k'));
    fireEvent.press(screen.getByText('Buy running shoes'));
    expect(screen.getByText('Treadmill session')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Schedule event'));

    expect(screen.getByDisplayValue('Buy running shoes')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Save event'));
    });

    await waitFor(() => {
      expect(createEvent).toHaveBeenCalledWith(
        'test-user',
        expect.objectContaining({
          title: 'Buy running shoes',
          goalId: 'goal-1',
          stepId: 'step-1',
        }),
      );
    });
  });
});