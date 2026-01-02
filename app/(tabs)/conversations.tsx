
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConversationsScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  // TODO: Backend Integration - Fetch conversations from API
  const loadConversations = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockConversations = [
        {
          id: '1',
          user: {
            id: '1',
            name: 'Sarah',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          },
          lastMessage: {
            content: 'That sounds amazing! I&apos;d love to hear more about it.',
            sentAt: new Date().toISOString(),
            read: true,
          },
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('[Conversations] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push({ pathname: '/chat', params: { matchId: item.id } })}
    >
      <Image source={{ uri: item.user.photo }} style={styles.avatar} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.user.name}</Text>
          <Text style={styles.conversationTime}>
            {formatTime(item.lastMessage.sentAt)}
          </Text>
        </View>
        <Text
          style={[
            styles.conversationMessage,
            item.unreadCount > 0 && styles.conversationMessageUnread,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage.content}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.empty}>
          <IconSymbol
            ios_icon_name="message"
            android_material_icon_name="chat-bubble-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[commonStyles.subtitle, styles.emptyTitle]}>No Conversations Yet</Text>
          <Text style={[commonStyles.bodySecondary, styles.emptyText]}>
            Start a conversation with your matches
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  conversationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  conversationMessageUnread: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
});
