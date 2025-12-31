
import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router/unstable-native-tabs';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="message.fill"
              android_material_icon_name="chat"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
