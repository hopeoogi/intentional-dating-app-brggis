
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge as StatusBadgeType } from '@/types/User';
import { colors } from '@/styles/commonStyles';

interface StatusBadgeProps {
  badge: StatusBadgeType;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ badge, size = 'small' }: StatusBadgeProps) {
  const getBadgeColor = () => {
    switch (badge.tier) {
      case 'basic':
        return colors.basicBadge;
      case 'elite':
        return colors.eliteBadge;
      case 'star':
        return colors.starBadge;
      default:
        return colors.basicBadge;
    }
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 10,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 12,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: sizeStyles[size].fontSize }]}>
        {badge.type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
