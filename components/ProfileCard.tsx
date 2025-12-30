
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { User, getLastActiveText } from '@/types/User';
import { colors } from '@/styles/commonStyles';
import StatusBadge from './StatusBadge';

interface ProfileCardProps {
  user: User;
  onPress?: () => void;
  showDistance?: boolean;
  distance?: number;
}

export default function ProfileCard({ user, onPress, showDistance, distance }: ProfileCardProps) {
  const mainPhoto = user.photos.find((p) => p.type === 'selfie') || user.photos[0];
  const lastActiveText = getLastActiveText(user.lastActive);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: mainPhoto.url }} style={styles.image} />
        <View style={styles.badgeContainer}>
          {user.statusBadges.slice(0, 2).map((badge, index) => (
            <StatusBadge key={badge.id} badge={badge} size="small" style={{ marginLeft: index > 0 ? -8 : 0 }} />
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          {showDistance && distance && (
            <Text style={styles.distance}>{distance} miles away</Text>
          )}
        </View>
        
        <Text style={styles.lastActive}>{lastActiveText}</Text>
        
        <Text style={styles.location}>
          {user.location.city}, {user.location.state}
        </Text>

        <Text style={styles.bio} numberOfLines={3}>
          {user.bio}
        </Text>

        {user.statusBadges.length > 0 && (
          <View style={styles.statusList}>
            {user.statusBadges.map((badge) => (
              <View key={badge.id} style={styles.statusTag}>
                <Text style={styles.statusTagText}>{badge.type}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  infoContainer: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  statusList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusTag: {
    backgroundColor: colors.primaryLight || colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
