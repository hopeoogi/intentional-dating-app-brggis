
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { currentUser } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = currentUser;

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleAddStatusBadge = () => {
    Alert.alert('Add Status Badge', 'Apply for a new status badge to showcase your achievements and identity.');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings coming soon!');
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={handleSettings}>
            <IconSymbol
              ios_icon_name="gearshape.fill"
              android_material_icon_name="settings"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: user.photos[0]?.url }}
              style={styles.profilePhoto}
            />
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <IconSymbol
                  ios_icon_name="checkmark.seal.fill"
                  android_material_icon_name="verified"
                  size={32}
                  color={colors.primary}
                />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.location}>
            {user.location.city}, {user.location.state}
          </Text>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.editButton]}
            onPress={handleEditProfile}
          >
            <Text style={commonStyles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <View style={styles.card}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Status Badges</Text>
            <TouchableOpacity onPress={handleAddStatusBadge}>
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add_circle"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.badgesContainer}>
            {user.statusBadges.map((badge, index) => (
              <React.Fragment key={index}>
                <StatusBadge badge={badge} size="medium" />
              </React.Fragment>
            ))}
          </View>

          <View style={styles.badgeInfo}>
            <Text style={styles.badgeInfoText}>
              Status badges verify your identity and achievements. You can have up to 9 badges across three tiers: Basic (Blue), Elite (Purple), and Star (Gold).
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photosGrid}>
            {user.photos.map((photo, index) => (
              <React.Fragment key={index}>
                <View style={styles.photoItem}>
                  <Image source={{ uri: photo.url }} style={styles.gridPhoto} />
                  <View style={styles.photoTypeLabel}>
                    <Text style={styles.photoTypeText}>
                      {photo.type === 'selfie' ? 'Selfie' : photo.type === 'fullbody' ? 'Full Body' : 'Activity'}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Age Range</Text>
              <Text style={styles.preferenceValue}>
                {user.preferences.minAge} - {user.preferences.maxAge}
              </Text>
            </View>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Max Distance</Text>
              <Text style={styles.preferenceValue}>
                {user.preferences.maxDistance} miles
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Community</Text>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="shield"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.menuItemText}>Safety Center</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="flag.fill"
              android_material_icon_name="flag"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.menuItemText}>Report an Issue</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu_book"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.menuItemText}>Community Guidelines</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  bioText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badgeInfo: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 12,
  },
  badgeInfoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoTypeLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  photoTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontSize: 16,
    color: colors.text,
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});
