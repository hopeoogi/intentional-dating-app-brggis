
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
  const [showBio, setShowBio] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const mainPhoto = user.photos[currentPhotoIndex] || user.photos[0];
  const lastActiveText = getLastActiveText(user.lastActive);

  const toggleMode = () => {
    setMode(mode === 'dating' ? 'social' : 'dating');
    setShowBio(false);
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
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: mainPhoto.url }} style={styles.image} />
          
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'dating' && styles.modeButtonActive]}
              onPress={toggleMode}
            >
              <Text style={[styles.modeButtonText, mode === 'dating' && styles.modeButtonTextActive]}>
                DATING MODE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'social' && styles.modeButtonActive]}
              onPress={toggleMode}
            >
              <Text style={[styles.modeButtonText, mode === 'social' && styles.modeButtonTextActive]}>
                SOCIAL MODE
              </Text>
            </TouchableOpacity>
          </View>

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
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name} {user.age}</Text>
            <Text style={styles.location}>
              {user.location.city}, {user.location.state}
            </Text>
          </View>

          {!showBio && user.statusBadges.length > 0 && (
            <View style={styles.badgesContainer}>
              {user.statusBadges.slice(0, 6).map((badge, index) => (
                <StatusBadge 
                  key={badge.id} 
                  badge={badge} 
                  size="medium" 
                  mode={mode}
                />
              ))}
            </View>
          )}

          {showBio && (
            <Text style={styles.bio} numberOfLines={4}>
              {user.bio}
            </Text>
          )}
        </View>
      </TouchableOpacity>

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
  modeToggle: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(106, 90, 205, 0.9)',
  },
  modeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  photoIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  nameRow: {
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bio: {
    fontSize: 15,
    color: '#FFFFFF',
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
