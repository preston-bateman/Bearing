import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, componentTokens, radii, spacing, typography } from '../../design/tokens';

type AppModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  headerAccessory?: ReactNode;
  children: ReactNode;
};

export function AppModal({
  visible,
  title,
  onClose,
  closeLabel = 'Close',
  headerAccessory,
  children,
}: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" style={styles.backdropPressArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.headerActions}>
              {headerAccessory}
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{closeLabel}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 31, 42, 0.42)',
  },
  backdropPressArea: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    borderRadius: componentTokens.button.borderRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
  closeButtonText: {
    ...typography.helper,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    flexShrink: 1,
    minHeight: 0,
    gap: spacing.md,
  },
});
