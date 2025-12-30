
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockUsers } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileDetailScreen() {
  const user = mockUsers[0];
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [mode, setMode] = useState<'dating' | 'social'>('dating');
  const [showBio, setShowBio] = useState(false);

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

  const toggleMode = () => {
    setMode(mode === 'dating' ? 'social' : 'dating');
    setShowBio(false);
  };

  const toggleContent = () => {
    setShowBio(!showBio);
  };

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: user.photos[currentPhotoIndex]?.url }}
            style={styles.photo}
          />
          
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

          <View style={styles.photoNavigation}>
            <TouchableOpacity
              style={[styles.navButton, currentPhotoIndex === 0 && styles.navButtonDisabled]}
              onPress={handlePrevPhoto}
              disabled={currentPhotoIndex === 0}
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="chevron_left"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.photoIndicators}>
              {user.photos.map((_, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.indicator,
                      index === currentPhotoIndex && styles.indicatorActive,
                    ]}
                  />
                </React.Fragment>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentPhotoIndex === user.photos.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={handleNextPhoto}
              disabled={currentPhotoIndex === user.photos.length - 1}
            >
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoOverlay}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name} {user.age}</Text>
            </View>
            <Text style={styles.location}>
              {user.location.city}, {user.location.state}
            </Text>

            <TouchableOpacity onPress={toggleContent} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {showBio ? 'Show Badges' : 'Show Bio'}
              </Text>
            </TouchableOpacity>

            {!showBio && user.statusBadges.length > 0 && (
              <View style={styles.badgesContainer}>
                {user.statusBadges.map((badge, index) => (
                  <React.Fragment key={index}>
                    <StatusBadge badge={badge} size="medium" mode={mode} />
                  </React.Fragment>
                ))}
              </View>
            )}

            {showBio && (
              <Text style={styles.bioText}>{user.bio}</Text>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioFullText}>{user.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Badges</Text>
            <View style={styles.badgesGrid}>
              {user.statusBadges.map((badge, index) => (
                <React.Fragment key={index}>
                  <StatusBadge badge={badge} size="large" mode={mode} />
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.preferencesCard}>
              <View style={styles.preferenceItem}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.preferenceText}>
                  Ages {user.preferences.minAge}-{user.preferences.maxAge}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <IconSymbol
                  ios_icon_name="location"
                  android_material_icon_name="location_on"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.preferenceText}>
                  Within {user.preferences.maxDistance} miles
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoContainer: {
    width: width,
    height: width * 1.3,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modeToggle: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
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
  photoNavigation: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  photoIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bioText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bioFullText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  preferencesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
  },
});
