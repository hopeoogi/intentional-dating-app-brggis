
import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { User } from '@/types/User';
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
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Organize photos: selfie, fullbody, then activity photos
  const selfiePhoto = user.photos.find((p) => p.type === 'selfie');
  const fullbodyPhoto = user.photos.find((p) => p.type === 'fullbody');
  const activityPhotos = user.photos.filter((p) => p.type === 'activity');

  // Build pages array
  const pages = [];
  if (selfiePhoto) pages.push({ photo: selfiePhoto, showBio: false });
  if (fullbodyPhoto) pages.push({ photo: fullbodyPhoto, showBio: true });
  activityPhotos.forEach((photo) => pages.push({ photo, showBio: false }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {pages.map((page, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: page.photo.url }} style={styles.image} />
            
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.85)']}
              style={styles.gradient}
              locations={[0, 0.5, 1]}
            />
            
            <View style={styles.infoContainer}>
              {index === 0 && (
                <>
                  <Text style={styles.name}>
                    {user.name} <Text style={styles.age}>{user.age}</Text>
                  </Text>
                  
                  <Text style={styles.location}>
                    {user.location.city}, {user.location.state}
                  </Text>

                  {user.statusBadges.length > 0 && (
                    <View style={styles.badgesContainer}>
                      {user.statusBadges.map((badge, badgeIndex) => (
                        <React.Fragment key={badgeIndex}>
                          <StatusBadge badge={badge} size="medium" />
                        </React.Fragment>
                      ))}
                    </View>
                  )}
                </>
              )}

              {page.showBio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioLabel}>About</Text>
                  <Text style={styles.bioText}>{user.bio}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Page indicators */}
      {pages.length > 1 && (
        <View style={styles.pageIndicatorContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.pageIndicator,
                currentPage === index && styles.pageIndicatorActive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Action buttons - moved higher to avoid tab bar overlap */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    width: width,
    height: height,
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
    bottom: 220,
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
  bioContainer: {
    marginTop: 8,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.95,
  },
  pageIndicatorContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  pageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  pageIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 140,
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
