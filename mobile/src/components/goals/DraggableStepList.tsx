import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radii, spacing, typography } from '../../design/tokens';
import { GoalStepRecord } from '../../features/goals/goalTypes';

type DraggableStepListProps = {
  steps: GoalStepRecord[];
  onOpenStep: (step: GoalStepRecord) => void;
  onToggleStepStatus: (step: GoalStepRecord) => void;
  onReorder: (orderedStepIds: string[]) => Promise<void> | void;
};

const ITEM_HEIGHT = 104;

function clampIndex(index: number, maxIndex: number): number {
  return Math.min(Math.max(index, 0), maxIndex);
}

export function DraggableStepList({
  steps,
  onOpenStep,
  onToggleStepStatus,
  onReorder,
}: DraggableStepListProps) {
  const sortedSteps = useMemo(() => [...steps].sort((left, right) => left.order - right.order), [steps]);
  const stepById = useMemo(
    () => new Map(sortedSteps.map((step) => [step.id, step])),
    [sortedSteps],
  );

  const [orderedIds, setOrderedIds] = useState<string[]>(sortedSteps.map((step) => step.id));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [positionValues, setPositionValues] = useState<Record<string, Animated.Value>>({});
  const [responders, setResponders] = useState<Record<string, PanResponderInstance>>({});
  const orderedIdsRef = useRef<string[]>(orderedIds);
  const numericPositionsRef = useRef<Record<string, number>>({});
  const dragStartTopRef = useRef(0);
  const dragStartIdsRef = useRef<string[]>(orderedIds);

  const ensureNumericPosition = useCallback((stepId: string, top: number): void => {
    if (numericPositionsRef.current[stepId] === undefined) {
      numericPositionsRef.current[stepId] = top;
    }
  }, []);

  const setPosition = useCallback(
    (stepId: string, top: number): void => {
      const animatedValue = positionValues[stepId];
      if (!animatedValue) {
        return;
      }

      animatedValue.setValue(top);
      numericPositionsRef.current[stepId] = top;
    },
    [positionValues],
  );

  const animatePosition = useCallback(
    (stepId: string, top: number): void => {
      const animatedValue = positionValues[stepId];
      if (!animatedValue) {
        return;
      }

      Animated.spring(animatedValue, {
      toValue: top,
      useNativeDriver: false,
      speed: 22,
      bounciness: 0,
    }).start();
      numericPositionsRef.current[stepId] = top;
    },
    [positionValues],
  );

  useEffect(() => {
    const nextIds = sortedSteps.map((step) => step.id);
    setOrderedIds(nextIds);
    orderedIdsRef.current = nextIds;
    dragStartIdsRef.current = nextIds;

    setPositionValues((current) => {
      const next = { ...current };
      let changed = false;

      nextIds.forEach((stepId, index) => {
        const top = index * ITEM_HEIGHT;
        ensureNumericPosition(stepId, top);
        if (!next[stepId]) {
          next[stepId] = new Animated.Value(top);
          changed = true;
        }
      });

      Object.keys(next).forEach((stepId) => {
        if (!nextIds.includes(stepId)) {
          delete next[stepId];
          delete numericPositionsRef.current[stepId];
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [ensureNumericPosition, sortedSteps]);

  useEffect(() => {
    orderedIds.forEach((stepId, index) => {
      if (draggingId === stepId) {
        return;
      }

      animatePosition(stepId, index * ITEM_HEIGHT);
    });
  }, [animatePosition, draggingId, orderedIds]);

  const animateNonDraggingItems = useCallback((ids: string[], excludedId: string): void => {
    ids.forEach((stepId, index) => {
      if (stepId === excludedId) {
        return;
      }

      animatePosition(stepId, index * ITEM_HEIGHT);
    });
  }, [animatePosition]);

  const finishDrag = useCallback((stepId: string): void => {
    const finalIds = orderedIdsRef.current;
    const finalIndex = finalIds.indexOf(stepId);
    animatePosition(stepId, finalIndex * ITEM_HEIGHT);
    setDraggingId(null);

    if (dragStartIdsRef.current.join('|') !== finalIds.join('|')) {
      void onReorder(finalIds);
    }
  }, [animatePosition, onReorder]);

  const buildResponder = useCallback((stepId: string): PanResponderInstance => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => steps.length > 1,
      onMoveShouldSetPanResponder: (_event, gestureState) =>
        steps.length > 1 && Math.abs(gestureState.dy) > 2,
      onPanResponderGrant: () => {
        setDraggingId(stepId);
        dragStartTopRef.current = numericPositionsRef.current[stepId] ?? 0;
        dragStartIdsRef.current = orderedIdsRef.current;
      },
      onPanResponderMove: (_event, gestureState) => {
        const maxIndex = orderedIdsRef.current.length - 1;
        const unclampedTop = dragStartTopRef.current + gestureState.dy;
        const nextTop = Math.max(0, Math.min(unclampedTop, maxIndex * ITEM_HEIGHT));
        setPosition(stepId, nextTop);

        const targetIndex = clampIndex(Math.round(nextTop / ITEM_HEIGHT), maxIndex);
        const currentIds = orderedIdsRef.current;
        const currentIndex = currentIds.indexOf(stepId);

        if (targetIndex === currentIndex) {
          return;
        }

        const nextIds = [...currentIds];
        nextIds.splice(currentIndex, 1);
        nextIds.splice(targetIndex, 0, stepId);
        orderedIdsRef.current = nextIds;
        setOrderedIds(nextIds);
        animateNonDraggingItems(nextIds, stepId);
      },
      onPanResponderRelease: () => {
        finishDrag(stepId);
      },
      onPanResponderTerminate: () => {
        finishDrag(stepId);
      },
    });
  }, [animateNonDraggingItems, finishDrag, setPosition, steps.length]);

  useEffect(() => {
    const nextResponders: Record<string, PanResponderInstance> = {};

    orderedIds.forEach((stepId) => {
      nextResponders[stepId] = buildResponder(stepId);
    });

    setResponders(nextResponders);
  }, [buildResponder, orderedIds]);

  return (
    <View style={[styles.container, { height: orderedIds.length * ITEM_HEIGHT }]}> 
      {orderedIds.map((stepId, index) => {
        const step = stepById.get(stepId);
        const animatedTop = positionValues[stepId];
        if (!step) {
          return null;
        }

        if (!animatedTop) {
          return null;
        }

        const responder = responders[stepId];
        const completed = step.status === 'completed';

        return (
          <Animated.View
            key={stepId}
            style={[
              styles.absoluteRow,
              { top: animatedTop, zIndex: draggingId === stepId ? 10 : 1 },
              draggingId === stepId ? styles.draggingRow : null,
            ]}
          >
            <View style={styles.rowCard}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${step.title}`}
                onPress={() => onOpenStep(step)}
                style={({ pressed }) => [styles.rowMain, pressed ? styles.rowMainPressed : null]}
              >
                <Text style={[styles.rowTitle, completed ? styles.completedText : null]}>{step.title}</Text>
                <Text style={[styles.rowDescription, completed ? styles.completedText : null]}>
                  {step.description || step.starter || 'No extra details yet.'}
                </Text>
              </Pressable>

              <View style={styles.rowActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={completed ? `Mark ${step.title} pending` : `Mark ${step.title} complete`}
                  onPress={() => onToggleStepStatus(step)}
                  style={({ pressed }) => [
                    styles.statusButton,
                    completed ? styles.statusButtonCompleted : null,
                    pressed ? styles.statusButtonPressed : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      completed ? styles.statusButtonCompletedText : null,
                    ]}
                  >
                    {completed ? 'Completed' : 'Mark Done'}
                  </Text>
                </Pressable>

                <View
                  accessibilityLabel={`Reorder ${step.title}`}
                  style={[styles.handle, steps.length < 2 ? styles.handleDisabled : null]}
                  {...(steps.length > 1 ? responder.panHandlers : {})}
                >
                  <Text style={styles.handleText}>≡</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  absoluteRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    paddingBottom: spacing.md,
  },
  draggingRow: {
    opacity: 0.96,
  },
  rowCard: {
    flex: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  rowMain: {
    flex: 1,
    gap: spacing.xs,
  },
  rowMainPressed: {
    opacity: 0.82,
  },
  rowTitle: {
    ...typography.button,
    color: colors.text,
  },
  rowDescription: {
    ...typography.helper,
    color: colors.textSecondary,
  },
  completedText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  rowActions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  statusButton: {
    borderRadius: radii.md,
    backgroundColor: colors.surfaceBrand,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusButtonCompleted: {
    backgroundColor: colors.surfaceMuted,
  },
  statusButtonPressed: {
    opacity: 0.84,
  },
  statusButtonText: {
    ...typography.helper,
    color: colors.brand,
    fontWeight: '700',
  },
  statusButtonCompletedText: {
    color: colors.textSecondary,
  },
  handle: {
    minWidth: 42,
    minHeight: 42,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleDisabled: {
    opacity: 0.45,
  },
  handleText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});