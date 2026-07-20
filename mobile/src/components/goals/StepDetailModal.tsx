import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppCard } from '../ui/AppCard';
import { AppModal } from '../ui/AppModal';
import { colors, radii, spacing, typography } from '../../design/tokens';
import { CalendarEvent } from '../../features/calendar/calendarTypes';
import { GoalStepRecord } from '../../features/goals/goalTypes';
import { GoalStepEventsUiState } from '../../features/goals/useGoalStepEvents';

type StepDetailModalProps = {
  goalTitle: string;
  step: GoalStepRecord | null;
  visible: boolean;
  linkedEvents: CalendarEvent[];
  linkedEventsState: GoalStepEventsUiState;
  onClose: () => void;
  onSaveStep: (stepId: string, fields: { title: string; description: string; starter: string; estimatedFinishDate: Date | null }) => Promise<void>;
  onSchedule: (step: GoalStepRecord) => void;
  onToggleComplete: (step: GoalStepRecord) => Promise<void>;
};

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateString(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLinkedEvent(event: CalendarEvent): string {
  return event.startAt.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function StepDetailModal({
  goalTitle,
  step,
  visible,
  linkedEvents,
  linkedEventsState,
  onClose,
  onSaveStep,
  onSchedule,
  onToggleComplete,
}: StepDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [starter, setStarter] = useState('');
  const [estimatedFinishDate, setEstimatedFinishDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!step || !visible) {
      return;
    }

    setEditMode(false);
    setTitle(step.title);
    setDescription(step.description);
    setStarter(step.starter);
    setEstimatedFinishDate(step.estimatedFinishDate ? formatDateString(step.estimatedFinishDate) : '');
    setSaving(false);
    setError(null);
  }, [step, visible]);

  async function handleSave(): Promise<void> {
    if (!step) {
      return;
    }

    if (!title.trim()) {
      setError('Step name is required.');
      return;
    }

    if (estimatedFinishDate.trim() && !parseDateString(estimatedFinishDate)) {
      setError('Estimated finish date must use YYYY-MM-DD.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSaveStep(step.id, {
        title: title.trim(),
        description: description.trim(),
        starter: starter.trim(),
        estimatedFinishDate: parseDateString(estimatedFinishDate),
      });
      setEditMode(false);
    } catch {
      setError('Failed to save step changes.');
    } finally {
      setSaving(false);
    }
  }

  const headerAccessory = step ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={editMode ? 'Cancel step editing' : 'Edit step'}
      onPress={() => {
        setError(null);
        setEditMode((current) => !current);
      }}
      style={({ pressed }) => [styles.headerButton, pressed ? styles.buttonPressed : null]}
    >
      <Text style={styles.headerButtonText}>{editMode ? 'Cancel' : 'Edit'}</Text>
    </Pressable>
  ) : null;

  return (
    <AppModal
      visible={visible}
      title="Step Details"
      onClose={onClose}
      closeLabel="Back"
      headerAccessory={headerAccessory}
    >
      {step ? (
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.summaryCard}>
            <Text style={styles.goalLabel}>{goalTitle}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepStatus}>{step.status === 'completed' ? 'Completed' : 'In Progress'}</Text>
          </AppCard>

          {editMode ? (
            <View style={styles.section}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Step name</Text>
                <TextInput accessibilityLabel="Edit step name" value={title} onChangeText={setTitle} style={styles.input} />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  accessibilityLabel="Edit step description"
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.input, styles.textArea]}
                  multiline
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Starter</Text>
                <TextInput accessibilityLabel="Edit step starter" value={starter} onChangeText={setStarter} style={styles.input} />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Estimated finish date (YYYY-MM-DD)</Text>
                <TextInput
                  accessibilityLabel="Edit step estimated finish date"
                  value={estimatedFinishDate}
                  onChangeText={setEstimatedFinishDate}
                  style={styles.input}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save step changes"
                onPress={handleSave}
                disabled={saving}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && !saving ? styles.buttonPressed : null,
                  saving ? styles.buttonDisabled : null,
                ]}
              >
                <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.section}>
              <AppCard style={styles.summaryCard}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoValue}>{step.description || 'No description yet.'}</Text>
                <Text style={styles.infoLabel}>Starter</Text>
                <Text style={styles.infoValue}>{step.starter || 'No starter added yet.'}</Text>
                <Text style={styles.infoLabel}>Estimated finish date</Text>
                <Text style={styles.infoValue}>
                  {step.estimatedFinishDate ? formatDateString(step.estimatedFinishDate) : 'Not set'}
                </Text>
              </AppCard>

              <View style={styles.actionColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Schedule event"
                  onPress={() => onSchedule(step)}
                  style={({ pressed }) => [styles.primaryButton, pressed ? styles.buttonPressed : null]}
                >
                  <Text style={styles.primaryButtonText}>Schedule Event</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={step.status === 'completed' ? 'Mark step pending' : 'Mark step complete'}
                  onPress={() => void onToggleComplete(step)}
                  style={({ pressed }) => [styles.secondaryButton, pressed ? styles.buttonPressed : null]}
                >
                  <Text style={styles.secondaryButtonText}>
                    {step.status === 'completed' ? 'Mark Step Pending' : 'Mark Step Complete'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Events</Text>

            {linkedEventsState === 'loading' ? (
              <AppCard style={styles.summaryCard}>
                <Text style={styles.infoValue}>Loading linked events...</Text>
              </AppCard>
            ) : null}

            {linkedEventsState === 'error' ? (
              <AppCard style={styles.summaryCard}>
                <Text style={styles.infoValue}>Unable to load linked events.</Text>
              </AppCard>
            ) : null}

            {linkedEventsState === 'empty' || linkedEventsState === 'idle' ? (
              <AppCard style={styles.summaryCard}>
                <Text style={styles.infoValue}>No linked events yet.</Text>
              </AppCard>
            ) : null}

            {linkedEventsState === 'ready'
              ? linkedEvents.map((event) => (
                  <AppCard key={event.id} style={styles.summaryCard}>
                    <Text style={[styles.infoValue, event.endAt < new Date() ? styles.pastEvent : null]}>
                      {event.title}
                    </Text>
                    <Text style={[styles.infoLabel, event.endAt < new Date() ? styles.pastEvent : null]}>
                      {formatLinkedEvent(event)}
                    </Text>
                  </AppCard>
                ))
              : null}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
      ) : null}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  goalLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  stepTitle: {
    ...typography.button,
    fontSize: 18,
    color: colors.text,
  },
  stepStatus: {
    ...typography.helper,
    color: colors.brand,
    fontWeight: '700',
  },
  section: {
    gap: spacing.md,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  infoLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...typography.button,
    color: colors.text,
  },
  headerButton: {
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerButtonText: {
    ...typography.helper,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  secondaryButton: {
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  actionColumn: {
    gap: spacing.md,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  pastEvent: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  errorText: {
    ...typography.helper,
    color: colors.dangerText,
  },
});