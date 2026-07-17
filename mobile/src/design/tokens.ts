export const colors = {
  background: '#F4F8FA',
  surface: '#FCFEFF',
  surfaceMuted: '#E4EEF3',
  surfaceBrand: '#D7E6ED',
  border: '#D3E1E8',
  text: '#0B1F2A',
  textPrimary: '#153748',
  textSecondary: '#496879',
  brand: '#0E5E85',
  dangerSurface: '#FDEAEA',
  dangerText: '#8A1E1E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 24,
};

export const typography = {
  title: {
    fontSize: 30,
    fontWeight: '700' as const,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  helper: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  tabIcon: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
};

export const layout = {
  pagePaddingHorizontal: spacing['2xl'],
  pagePaddingVertical: spacing['3xl'],
  tabBarHeight: 72,
  tabBarPaddingVertical: spacing.md,
  tabIconSize: 28,
  tabIconRadius: 14,
};

export const componentTokens = {
  button: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brand,
    textColor: '#F4F8FA',
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    padding: spacing['2xl'],
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabIcon: {
    backgroundColor: colors.surfaceBrand,
    focusedBackgroundColor: colors.brand,
    textColor: colors.textSecondary,
    focusedTextColor: '#F4F8FA',
  },
} as const;
