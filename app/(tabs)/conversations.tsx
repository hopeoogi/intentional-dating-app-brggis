
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { useConversations } from '@/hooks/useConversations';
import { supabase } from '@/app/integrations/supabase/client';

// For now, we'll use a placeholder user ID
// In a real app, this would come from authentication
const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

export default function ConversationsScreen() {
  const { conversations, loading, error, refreshConversations } = useConversations(CURRENT_USER_ID);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const handleEndConversation = async (matchId: string, otherUserName: string) => {
    Alert.alert(
      'End Conversation',
      `Are you sure you want to end this conversation with ${otherUserName}? They will be notified that you no longer wish to continue.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Conversation',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(matchId);
              const { error } = await supabase
                .from('matches')
                .update({
                  conversation_ended: true,
                  ended_by: CURRENT_USER_ID,
                  ended_at: new Date().toISOString(),
                  ended_reason: 'user_initiated'
                })
                .eq('id', matchId);

              if (error) throw error;

              Alert.alert('Conversation Ended', 'This conversation has been ended respectfully.');
              refreshConversations();
            } catch (err) {
              console.error('Error ending conversation:', err);
              Alert.alert('Error', 'Failed to end conversation. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleNotNow = async (matchId: string) => {
    try {
      setActionLoading(matchId);
      
      // Update the match to increment not_now_count and extend deadline
      const newDeadline = new Date();
      newDeadline.setHours(newDeadline.getHours() + 24);
      
      const { error } = await supabase
        .from('matches')
        .update({
          not_now_count: supabase.rpc('increment', { x: 1 }),
          response_deadline: newDeadline.toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;

      Alert.alert(
        'Conversation Pinned',
        'This conversation will stay pinned. You can browse but cannot start new conversations until you respond or end this one.'
      );
      refreshConversations();
    } catch (err) {
      console.error('Error updating conversation:', err);
      Alert.alert('Error', 'Failed to update conversation. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRespond = (matchId: string) => {
    router.push(`/chat?matchId=${matchId}`);
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading conversations</Text>
        <Text style={styles.errorDetailText}>{error}</Text>
      </View>
    );
  }

  const pendingConversations = conversations.filter(c => c.mustRespond);
  const activeConversations = conversations.filter(c => !c.mustRespond);

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Conversations</Text>
          <Text style={styles.subtitle}>
            {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {pendingConversations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                ios_icon_name="exclamationmark.circle.fill"
                android_material_icon_name="priority_high"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.sectionTitle}>Needs Your Response</Text>
            </View>
            
            {pendingConversations.map((conversation, index) => {
              const otherUser = conversation.match.matchedUser;
              const mainPhoto = otherUser.photos.find((p) => p.type === 'selfie') || otherUser.photos[0];
              const lastMessage = conversation.lastMessage;
              const isLoading = actionLoading === conversation.match.id;

              return (
                <React.Fragment key={index}>
                  <View style={[styles.conversationCard, styles.pendingCard]}>
                    <Image
                      source={{ uri: mainPhoto?.url }}
                      style={styles.avatar}
                    />
                    
                    <View style={styles.conversationContent}>
                      <View style={styles.conversationHeader}>
                        <Text style={styles.userName}>{otherUser.name}</Text>
                        {lastMessage && (
                          <Text style={styles.timestamp}>
                            {formatTime(lastMessage.timestamp)}
                          </Text>
                        )}
                      </View>
                      
                      {lastMessage && (
                        <Text style={styles.lastMessage} numberOfLines={1}>
                          {lastMessage.content}
                        </Text>
                      )}

                      {conversation.respondBy && (
                        <Text style={styles.deadlineText}>
                          Respond by {new Date(conversation.respondBy).toLocaleDateString()}
                        </Text>
                      )}

                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.replyButton]}
                          onPress={() => handleRespond(conversation.match.id)}
                          disabled={isLoading}
                        >
                          <IconSymbol
                            ios_icon_name="arrow.turn.up.right"
                            android_material_icon_name="reply"
                            size={16}
                            color="#FFFFFF"
                          />
                          <Text style={styles.actionButtonText}>Reply</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.notNowButton]}
                          onPress={() => handleNotNow(conversation.match.id)}
                          disabled={isLoading}
                        >
                          <IconSymbol
                            ios_icon_name="clock"
                            android_material_icon_name="schedule"
                            size={16}
                            color={colors.text}
                          />
                          <Text style={[styles.actionButtonText, styles.notNowText]}>Not Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.endButton]}
                          onPress={() => handleEndConversation(conversation.match.id, otherUser.name)}
                          disabled={isLoading}
                        >
                          <IconSymbol
                            ios_icon_name="xmark.circle"
                            android_material_icon_name="cancel"
                            size={16}
                            color={colors.error}
                          />
                          <Text style={[styles.actionButtonText, styles.endText]}>End</Text>
                        </TouchableOpacity>
                      </View>

                      {isLoading && (
                        <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
                      )}
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {activeConversations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Conversations</Text>
            
            {activeConversations.map((conversation, index) => {
              const otherUser = conversation.match.matchedUser;
              const mainPhoto = otherUser.photos.find((p) => p.type === 'selfie') || otherUser.photos[0];
              const lastMessage = conversation.lastMessage;

              return (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.conversationCard}
                    onPress={() => handleRespond(conversation.match.id)}
                  >
                    <Image
                      source={{ uri: mainPhoto?.url }}
                      style={styles.avatar}
                    />
                    
                    <View style={styles.conversationContent}>
                      <View style={styles.conversationHeader}>
                        <Text style={styles.userName}>{otherUser.name}</Text>
                        {lastMessage && (
                          <Text style={styles.timestamp}>
                            {formatTime(lastMessage.timestamp)}
                          </Text>
                        )}
                      </View>
                      
                      {lastMessage && (
                        <Text style={styles.lastMessage} numberOfLines={1}>
                          {lastMessage.content}
                        </Text>
                      )}
                    </View>

                    <IconSymbol
                      ios_icon_name="chevron.right"
                      android_material_icon_name="chevron_right"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {conversations.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="message"
              android_material_icon_name="chat_bubble_outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No Conversations Yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation with your matches to begin connecting
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>New Conversation Flow:{'\n'}</Text>
            - Reply to continue the conversation{'\n'}
            - Use &quot;Not Now&quot; to browse (conversation stays pinned){'\n'}
            - Use &quot;End Conversation&quot; to close respectfully{'\n\n'}
            You must clear pending conversations within 24 hours to start new ones.
          </Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  pendingCard: {
    borderWidth: 2,
    borderColor: colors.warning,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  deadlineText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  replyButton: {
    backgroundColor: colors.primary,
  },
  notNowButton: {
    backgroundColor: colors.border,
  },
  endButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notNowText: {
    color: colors.text,
  },
  endText: {
    color: colors.error,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
  },
  boldText: {
    fontWeight: '600',
    color: colors.text,
  },
});
