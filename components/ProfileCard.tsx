
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { User } from '@/types/User';

const { width, height } = Dimensions.get('window');

interface ProfileCardProps {
  user: User;
  onPass: () => void;
  onMessage: () => void;
  showActions?: boolean;
}

export default function ProfileCard({ user, onPass, onMessage, showActions = true }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const photos = user.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  const handleNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
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
      {/* Photo */}
      <Image
        source={{ uri: currentPhoto?.url || 'https://via.placeholder.com/400x600' }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Photo navigation areas */}
      <View style={styles.photoNavigation}>
        <TouchableOpacity
          style={styles.photoNavLeft}
          onPress={handlePrevPhoto}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.photoNavRight}
          onPress={handleNextPhoto}
          activeOpacity={1}
        />
      </View>

      {/* Photo indicators */}
      <View style={styles.photoIndicators}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentPhotoIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* User info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfo(!showInfo)}
          >
            <IconSymbol
              ios_icon_name={showInfo ? 'chevron.down' : 'info.circle'}
              android_material_icon_name={showInfo ? 'expand_more' : 'info'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.locationRow}>
          <IconSymbol
            ios_icon_name="location.fill"
            android_material_icon_name="location_on"
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.location}>
            {user.location.city}, {user.location.state}
          </Text>
        </View>

        {showInfo && (
          <ScrollView style={styles.bioContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.bio}>{user.bio}</Text>
          </ScrollView>
        )}
      </View>

      {/* Action buttons */}
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.passButton} onPress={onPass}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <IconSymbol
              ios_icon_name="message.fill"
              android_material_icon_name="message"
              size={28}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photo: {
    width: width,
    height: height,
    position: 'absolute',
  },
  photoNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  photoNavLeft: {
    flex: 1,
  },
  photoNavRight: {
    flex: 1,
  },
  photoIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
  },
  indicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bioContainer: {
    maxHeight: 150,
    marginTop: 8,
  },
  bio: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    opacity: 0.9,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 32,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
