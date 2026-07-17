import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type TabPlaceholderScreenProps = {
  title: string;
  description: string;
  routeId: string;
  children?: ReactNode;
};

export function TabPlaceholderScreen({ title, description, routeId, children }: TabPlaceholderScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Route ID</Text>
        <Text style={styles.metaValue}>{routeId}</Text>
      </View>

      {children ? <View style={styles.actionBlock}>{children}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F8FA',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
  },
  heroBlock: {
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#153748',
  },
  metaCard: {
    borderRadius: 16,
    backgroundColor: '#E4EEF3',
    padding: 16,
    gap: 6,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#496879',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E5E85',
  },
  actionBlock: {
    gap: 12,
  },
});