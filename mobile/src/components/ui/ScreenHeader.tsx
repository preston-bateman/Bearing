import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../design/tokens';

type ScreenHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  trailing?: ReactNode;
};

export function ScreenHeader({ title, description, eyebrow, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copyBlock}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
  },
  trailing: {
    alignSelf: 'flex-start',
  },
});
