
import { colors, commonStyles } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { api } from '@/lib/api-client';

const CURRENT_USER_ID = 'current-user-id';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  endButton: {
    borderColor: colors.error,
  },
  endButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  notNowButton: {
    borderColor: colors.border,
  },
  notNowButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  respondButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  respondButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default function ConversationsScreen() {
  const { conversations, loading, refreshConversations } = useConversations();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Conversations] Screen mounted, loading conversations');
    refreshConversations();
  }, []);

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
      `Are you sure you want to end this conversation with ${otherUserName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Conversation',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(matchId);
            // TODO: Backend Integration - Call the end conversation API endpoint
            const { error } = await api.matches.endConversation(matchId);
            setActionLoading(null);
            
            if (error) {
              Alert.alert('Error', error);
            } else {
              Alert.alert('Success', 'Conversation ended');
              refreshConversations();
            }
          },
        },
      ]
    );
  };

  const handleNotNow = async (matchId: string) => {
    setActionLoading(matchId);
    // TODO: Backend Integration - Call the not now API endpoint
    const { error } = await api.matches.notNow(matchId);
    setActionLoading(null);
    
    if (error) {
      Alert.alert('Error', error);
    } else {
      refreshConversations();
    }
  };

  const handleRespond = (matchId: string) => {
    router.push(`/chat?matchId=${matchId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol 
            ios_icon_name="message.fill" 
            android_material_icon_name="message"
            size={64} 
            color={colors.textSecondary} 
          />
          <Text style={styles.emptyText}>
            No active conversations yet.{'\n'}
            Start a conversation from your daily matches!
          </Text>
        </View>
      ) : (
        <ScrollView>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationCard}
              onPress={() => handleRespond(conversation.id)}
              disabled={actionLoading === conversation.id}
            >
              <Image
                source={{ uri: conversation.otherUser.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.name}>{conversation.otherUser.name}</Text>
                    {conversation.pendingResponse && (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingText}>Your Turn</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.time}>
                    {formatTime(conversation.lastMessageDate)}
                  </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.endButton]}
                    onPress={() => handleEndConversation(conversation.id, conversation.otherUser.name)}
                    disabled={actionLoading === conversation.id}
                  >
                    <Text style={styles.endButtonText}>End</Text>
                  </TouchableOpacity>
                  {conversation.pendingResponse && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.notNowButton]}
                        onPress={() => handleNotNow(conversation.id)}
                        disabled={actionLoading === conversation.id}
                      >
                        <Text style={styles.notNowButtonText}>Not Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.respondButton]}
                        onPress={() => handleRespond(conversation.id)}
                        disabled={actionLoading === conversation.id}
                      >
                        <Text style={styles.respondButtonText}>Respond</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
