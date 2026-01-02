
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.65;

export default function HomeScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  // TODO: Backend Integration - Fetch daily matches from API
  const loadMatches = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockMatches = [
        {
          id: '1',
          name: 'Sarah',
          age: 28,
          bio: 'Product designer who loves hiking and good coffee',
          photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800'],
          badges: [{ status: 'Designer', tier: 'elite' }],
          location: 'San Francisco, CA',
        },
        {
          id: '2',
          name: 'Emily',
          age: 26,
          bio: 'Entrepreneur building the future of sustainable fashion',
          photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'],
          badges: [{ status: 'Founder', tier: 'star' }],
          location: 'New York, NY',
        },
      ];
      setMatches(mockMatches);
    } catch (error) {
      console.error('[Home] Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = () => {
    if (matches[currentIndex]) {
      router.push({
        pathname: '/start-conversation',
        params: { matchId: matches[currentIndex].id },
      });
    }
  };

  const handleNotNow = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('No More Matches', 'Check back tomorrow for new matches!');
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={commonStyles.centered}>
        <IconSymbol
          ios_icon_name="heart.slash"
          android_material_icon_name="favorite-border"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.emptyTitle]}>No Matches Today</Text>
        <Text style={[commonStyles.bodySecondary, styles.emptyText]}>
          Check back tomorrow for new matches
        </Text>
      </View>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <View style={commonStyles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today&apos;s Matches</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} of {matches.length}
        </Text>
      </View>

      {/* Match Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: currentMatch.photos[0] }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardName}>
                    {currentMatch.name}, {currentMatch.age}
                  </Text>
                  <Text style={styles.cardLocation}>{currentMatch.location}</Text>
                </View>
                {currentMatch.badges.map((badge: any, index: number) => (
                  <View key={index} style={[styles.badge, getBadgeStyle(badge.tier)]}>
                    <Text style={styles.badgeText}>{badge.status}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.cardBio}>{currentMatch.bio}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleNotNow}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
          <Text style={styles.secondaryButtonText}>Not Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartConversation}
        >
          <IconSymbol
            ios_icon_name="message.fill"
            android_material_icon_name="chat"
            size={24}
            color={colors.background}
          />
          <Text style={styles.primaryButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getBadgeStyle(tier: string) {
  switch (tier) {
    case 'basic':
      return { backgroundColor: colors.badgeBasic };
    case 'elite':
      return { backgroundColor: colors.badgeElite };
    case 'star':
      return { backgroundColor: colors.badgeStar };
    default:
      return { backgroundColor: colors.badgeBasic };
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.backgroundLight,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  cardInfo: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  cardBio: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
});
