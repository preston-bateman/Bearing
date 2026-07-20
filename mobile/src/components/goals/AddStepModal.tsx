import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppModal } from '../ui/AppModal';
import { colors, radii, spacing, typography } from '../../design/tokens';
import { CreateGoalStepInput } from '../../features/goals/goalTypes';

type AddStepModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: CreateGoalStepInput) => Promise<void>;
};

function parseDateString(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function AddStepModal({ visible, onClose, onSave }: AddStepModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [starter, setStarter] = useState('');
  const [estimatedFinishDate, setEstimatedFinishDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm(): void {
    setTitle('');
    setDescription('');
    setStarter('');
    setEstimatedFinishDate('');
    setSaving(false);
    setError(null);
  }

  function handleClose(): void {
    resetForm();
    onClose();
  }

  async function handleSave(): Promise<void> {
    if (!title.trim()) {
      setError('Step title is required.');
      return;
    }

    const parsedDate = estimatedFinishDate.trim()
      ? parseDateString(estimatedFinishDate)
      : null;

    if (estimatedFinishDate.trim() && !parsedDate) {
      setError('Estimated finish date must use YYYY-MM-DD.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        starter: starter.trim(),
        estimatedFinishDate: parsedDate,
      });
      handleClose();
    } catch {
      setError('Failed to save step. Please try again.');
      setSaving(false);
    }
  }

  return (
    <AppModal visible={visible} title="Add Step" onClose={handleClose}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Step name</Text>
        <TextInput
          accessibilityLabel="Step name"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Add the next action"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          accessibilityLabel="Step description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Optional details"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Starter</Text>
        <TextInput
          accessibilityLabel="Step starter"
          value={starter}
          onChangeText={setStarter}
          style={styles.input}
          placeholder="Optional starter cue"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Estimated finish date (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="Step estimated finish date"
          value={estimatedFinishDate}
          onChangeText={setEstimatedFinishDate}
          style={styles.input}
          placeholder="2026-08-15"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save step"
        onPress={handleSave}
        disabled={saving}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && !saving ? styles.saveButtonPressed : null,
          saving ? styles.saveButtonDisabled : null,
        ]}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Step'}</Text>
      </Pressable>
    </AppModal>
  );
}

const styles = StyleSheet.create({
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
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorText: {
    ...typography.helper,
    color: colors.dangerText,
  },
  saveButton: {
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  saveButtonPressed: {
    opacity: 0.88,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});