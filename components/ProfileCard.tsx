
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';
import { colors, commonStyles } from '@/styles/commonStyles';
import StatusBadge from './StatusBadge';
import { IconSymbol } from './IconSymbol';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface ProfileCardProps {
  user: User;
  onPress?: () => void;
  showDistance?: boolean;
  distance?: number;
}

export default function ProfileCard({ user, onPress, showDistance, distance }: ProfileCardProps) {
  const mainPhoto = user.photos.find((p) => p.type === 'selfie') || user.photos[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: mainPhoto?.url }} style={styles.image} />
        
        {user.statusBadges.length > 0 && (
          <View style={styles.badgeContainer}>
            <StatusBadge badge={user.statusBadges[0]} size="small" />
          </View>
        )}

        <View style={styles.gradient} />
        
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            {user.verified && (
              <IconSymbol
                ios_icon_name="checkmark.seal.fill"
                android_material_icon_name="verified"
                size={20}
                color={colors.primary}
              />
            )}
          </View>
          
          <View style={styles.locationRow}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location_on"
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.location}>
              {user.location.city}, {user.location.state}
              {showDistance && distance && ` • ${distance} mi`}
            </Text>
          </View>

          {user.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {user.bio}
            </Text>
          )}

          {user.statusBadges.length > 1 && (
            <View style={styles.additionalBadges}>
              {user.statusBadges.slice(1, 3).map((badge, index) => (
                <React.Fragment key={index}>
                  <StatusBadge badge={badge} size="small" />
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
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
    zIndex: 2,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
    background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 8,
  },
  additionalBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
});
