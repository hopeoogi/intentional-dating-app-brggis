
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge as StatusBadgeType } from '@/types/User';
import { colors } from '@/styles/commonStyles';

interface StatusBadgeProps {
  badge: StatusBadgeType;
  size?: 'small' | 'medium' | 'large';
  mode?: 'dating' | 'social';
  style?: any;
}

export default function StatusBadge({ badge, size = 'small', mode = 'dating', style }: StatusBadgeProps) {
  const getBadgeColor = () => {
    switch (badge.tier) {
      case 'basic':
        return mode === 'dating' ? '#3B82F6' : '#60A5FA';
      case 'elite':
        return mode === 'dating' ? '#8B5CF6' : '#A78BFA';
      case 'star':
        return mode === 'dating' ? '#F59E0B' : '#FBBF24';
      default:
        return '#3B82F6';
    }
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 10,
    },
    medium: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      fontSize: 12,
    },
    large: {
      paddingHorizontal: 18,
      paddingVertical: 9,
      fontSize: 14,
    },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBadgeColor(),
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: sizeStyles[size].fontSize }]}>
        {badge.type.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    alignSelf: 'flex-start',
    transform: [{ skewX: '-10deg' }],
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
