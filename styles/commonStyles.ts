
import { StyleSheet } from 'react-native';

// Intentional Dating App - Raya-inspired Color Palette
export const colors = {
  // Primary colors
  background: '#000000',
  backgroundLight: '#1a1a1a',
  surface: '#2a2a2a',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  textTertiary: '#666666',
  
  // Accent colors
  primary: '#ffffff',
  secondary: '#666666',
  accent: '#4a9eff',
  
  // Status colors
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  
  // Badge colors
  badgeBasic: '#4a9eff',      // Blue
  badgeElite: '#9c27b0',      // Purple
  badgeStar: '#ffd700',       // Gold
  
  // UI elements
  border: '#333333',
  divider: '#2a2a2a',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Transparent variants
  primaryTransparent: 'rgba(255, 255, 255, 0.1)',
  accentTransparent: 'rgba(74, 158, 255, 0.1)',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Text styles
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  
  bodySecondary: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  inputFocused: {
    borderColor: colors.accent,
  },
  
  // Button styles
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  
  buttonSecondary: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  
  // Spacing
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mb32: { marginBottom: 32 },
  
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mt32: { marginTop: 32 },
  
  p16: { padding: 16 },
  p24: { padding: 24 },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  outlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  
  disabled: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  
  disabledText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
