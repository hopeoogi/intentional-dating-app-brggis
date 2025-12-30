
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.primary}
      iconColor={colors.textSecondary}
      backgroundColor={colors.card}
    >
      <NativeTabs.Trigger name="(home)">
        <Label>Matches</Label>
        <Icon sf="heart.fill" drawable="favorite" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="conversations">
        <Label>Chats</Label>
        <Icon sf="message.fill" drawable="chat" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" drawable="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
