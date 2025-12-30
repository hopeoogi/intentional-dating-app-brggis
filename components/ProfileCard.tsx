
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';
import { colors } from '@/styles/commonStyles';
import StatusBadge from './StatusBadge';
import { IconSymbol } from './IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ProfileCardProps {
  user: User;
  onPass?: () => void;
  onMessage?: () => void;
  showActions?: boolean;
}

export default function ProfileCard({ user, onPass, onMessage, showActions = true }: ProfileCardProps) {
  const mainPhoto = user.photos.find((p) => p.type === 'selfie') || user.photos[0];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: mainPhoto?.url }} style={styles.image} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.85)']}
          style={styles.gradient}
          locations={[0, 0.5, 1]}
        />
        
        {showActions && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.passButton}
              onPress={onPass}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={32}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={onMessage}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="message.fill"
                android_material_icon_name="message"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {user.name} <Text style={styles.age}>{user.age}</Text>
          </Text>
          
          <Text style={styles.location}>
            {user.location.city}, {user.location.state}
          </Text>

          {user.statusBadges.length > 0 && (
            <View style={styles.badgesContainer}>
              {user.statusBadges.map((badge, index) => (
                <React.Fragment key={index}>
                  <StatusBadge badge={badge} size="medium" />
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  card: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  age: {
    fontSize: 32,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.95,
    fontWeight: '400',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 80,
    zIndex: 3,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(100, 100, 100, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  messageButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(100, 100, 100, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
