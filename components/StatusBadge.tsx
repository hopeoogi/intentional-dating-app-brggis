
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge as StatusBadgeType } from '@/types/User';

interface StatusBadgeProps {
  badge: StatusBadgeType;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ badge, size = 'medium' }: StatusBadgeProps) {
  const getBadgeColor = () => {
    switch (badge.tier) {
      case 'basic':
        return '#00BFFF'; // Bright blue
      case 'elite':
        return '#9370DB'; // Purple
      case 'star':
        return '#FFD700'; // Gold
      default:
        return '#00BFFF';
    }
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      fontSize: 10,
      height: 22,
    },
    medium: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      fontSize: 12,
      height: 26,
    },
    large: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      fontSize: 14,
      height: 32,
    },
  };

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          height: sizeStyles[size].height,
        },
      ]}
    >
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
          {badge.type.toUpperCase()}
        </Text>
      </View>
      <View
        style={[
          styles.badgeTriangle,
          {
            borderTopColor: getBadgeColor(),
            borderTopWidth: sizeStyles[size].height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ skewX: '-15deg' }],
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightColor: 'transparent',
    transform: [{ translateX: -1 }],
  },
});
