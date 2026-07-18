import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppModal } from '../ui/AppModal';
import { colors, spacing, typography } from '../../design/tokens';
import { CreateEventInput } from '../../features/calendar/calendarTypes';

type AddEventModalProps = {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSave: (input: CreateEventInput) => Promise<void>;
};

function roundUpToNextHour(date: Date): Date {
  const result = new Date(date);
  result.setMinutes(0, 0, 0);
  result.setHours(result.getHours() + 1);
  return result;
}

function toTimeString(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

/**
 * Parse "YYYY-MM-DD" + "HH:MM" into a Date.
 * Returns null if the input is not parseable.
 */
function parseDateTime(datePart: string, timePart: string): Date | null {
  const dateMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = timePart.match(/^(\d{2}):(\d{2})$/);
  if (!dateMatch || !timeMatch) return null;

  const result = new Date(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
    0,
    0,
  );

  return isNaN(result.getTime()) ? null : result;
}

export function AddEventModal({ visible, initialDate, onClose, onSave }: AddEventModalProps) {
  const defaultStart = roundUpToNextHour(initialDate);
  const defaultEnd = new Date(defaultStart.getTime() + 3_600_000);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datePart, setDatePart] = useState(toDateString(initialDate));
  const [startTime, setStartTime] = useState(toTimeString(defaultStart));
  const [endTime, setEndTime] = useState(toTimeString(defaultEnd));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(): Promise<void> {
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const startAt = parseDateTime(datePart, startTime);
    const endAt = parseDateTime(datePart, endTime);

    if (!startAt) {
      setError('Start time is invalid. Use HH:MM (24-hour).');
      return;
    }

    if (!endAt) {
      setError('End time is invalid. Use HH:MM (24-hour).');
      return;
    }

    if (endAt <= startAt) {
      setError('End time must be after start time.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        startAt,
        endAt,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      // Reset form on success
      setTitle('');
      setDescription('');
      setError(null);
      onClose();
    } catch {
      setError('Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleClose(): void {
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  }

  return (
    <AppModal visible={visible} title="Add Event" onClose={handleClose}>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Event title"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="sentences"
          returnKeyType="next"
          accessibilityLabel="Event title"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description"
          placeholderTextColor={colors.textSecondary}
          multiline
          accessibilityLabel="Event description"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={datePart}
          onChangeText={setDatePart}
          placeholder="2026-07-17"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numbers-and-punctuation"
          accessibilityLabel="Event date"
        />
      </View>

      <View style={styles.timeRow}>
        <View style={[styles.fieldGroup, styles.timeField]}>
          <Text style={styles.fieldLabel}>Start (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="09:00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Start time"
          />
        </View>

        <View style={[styles.fieldGroup, styles.timeField]}>
          <Text style={styles.fieldLabel}>End (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="10:00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="End time"
          />
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text
        style={[styles.saveButton, saving ? styles.saveButtonDisabled : null]}
        onPress={saving ? undefined : handleSave}
        accessibilityRole="button"
        accessibilityLabel="Save event"
        accessibilityState={{ disabled: saving }}
      >
        {saving ? 'Saving…' : 'Save Event'}
      </Text>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeField: {
    flex: 1,
  },
  errorText: {
    ...typography.helper,
    color: colors.dangerText,
  },
  saveButton: {
    ...typography.button,
    color: '#F4F8FA',
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingVertical: spacing.md,
    textAlign: 'center',
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
});
