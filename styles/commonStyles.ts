
import { StyleSheet, useColorScheme } from 'react-native';

const lightColors = {
  primary: '#6A5ACD',
  primaryLight: '#E6E3F5',
  secondary: '#FF6B9D',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  accent: '#F0F4FF',
  basicBadge: '#3B82F6',
  eliteBadge: '#8B5CF6',
  starBadge: '#F59E0B',
};

const darkColors = {
  primary: '#8B7FD8',
  primaryLight: '#2A2640',
  secondary: '#FF8AB5',
  background: '#1A1A1A',
  card: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  warningLight: '#78350F',
  info: '#60A5FA',
  accent: '#1E1E2E',
  basicBadge: '#60A5FA',
  eliteBadge: '#A78BFA',
  starBadge: '#FBBF24',
};

export const colors = lightColors;

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
}

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.card,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
