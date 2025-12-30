
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { User, getLastActiveText } from '@/types/User';
import { colors } from '@/styles/commonStyles';
import StatusBadge from './StatusBadge';
import { IconSymbol } from './IconSymbol';

interface ProfileCardProps {
  user: User;
  onPress?: () => void;
  onMessagePress?: () => void;
  onPassPress?: () => void;
  showDistance?: boolean;
  distance?: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - 40, 400);

export default function ProfileCard({ 
  user, 
  onPress, 
  onMessagePress,
  onPassPress,
  showDistance, 
  distance 
}: ProfileCardProps) {
  const [mode, setMode] = useState<'dating' | 'social'>('dating');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const mainPhoto = user.photos[currentPhotoIndex] || user.photos[0];
  const lastActiveText = getLastActiveText(user.lastActive);

  const toggleMode = () => {
    setMode(mode === 'dating' ? 'social' : 'dating');
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={onPress}
          activeOpacity={0.95}
        >
          <Image source={{ uri: mainPhoto.url }} style={styles.image} />
          
          {/* Photo Navigation Areas */}
          {user.photos.length > 1 && (
            <React.Fragment>
              <TouchableOpacity
                style={styles.photoNavLeft}
                onPress={handlePrevPhoto}
                activeOpacity={0.7}
              />
              <TouchableOpacity
                style={styles.photoNavRight}
                onPress={handleNextPhoto}
                activeOpacity={0.7}
              />
            </React.Fragment>
          )}

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'dating' && styles.modeButtonActive]}
              onPress={toggleMode}
            >
              <Text style={[styles.modeButtonText, mode === 'dating' && styles.modeButtonTextActive]}>
                DATING
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'social' && styles.modeButtonActive]}
              onPress={toggleMode}
            >
              <Text style={[styles.modeButtonText, mode === 'social' && styles.modeButtonTextActive]}>
                SOCIAL
              </Text>
            </TouchableOpacity>
          </View>

          {/* Photo Indicators */}
          {user.photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {user.photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentPhotoIndex && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Last Active Badge */}
          <View style={styles.lastActiveBadge}>
            <Text style={styles.lastActiveText}>{lastActiveText}</Text>
          </View>

          {/* Distance Badge */}
          {showDistance && distance && (
            <View style={styles.distanceBadge}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="location_on"
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.distanceText}>{distance} miles away</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Info Container */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.location}>
              {user.location.city}, {user.location.state}
            </Text>
          </View>

          {/* Status Badges */}
          {user.statusBadges.length > 0 && (
            <View style={styles.badgesContainer}>
              {user.statusBadges.slice(0, 6).map((badge) => (
                <StatusBadge 
                  key={badge.id} 
                  badge={badge} 
                  size="medium" 
                  mode={mode}
                />
              ))}
            </View>
          )}

          {/* Bio Preview */}
          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.passButton} 
          onPress={onPassPress}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={32}
            color={colors.error}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.messageButton} 
          onPress={onMessagePress}
        >
          <IconSymbol
            ios_icon_name="message.fill"
            android_material_icon_name="chat"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    elevation: 8,
    width: '100%',
    marginBottom: 24,
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
  photoNavLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    zIndex: 10,
  },
  photoNavRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    zIndex: 10,
  },
  modeToggle: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(106, 90, 205, 0.95)',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  photoIndicators: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    zIndex: 15,
  },
  indicator: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    maxWidth: 40,
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
  },
  lastActiveBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
  },
  lastActiveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backdropFilter: 'blur(10px)',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: colors.card,
  },
  nameRow: {
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    width: '100%',
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  messageButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(106, 90, 205, 0.4)',
    elevation: 6,
  },
});
