
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface PhotoUploadProps {
  photoUrl?: string;
  onPhotoSelected: (url: string) => void;
  photoType: 'selfie' | 'fullbody' | 'activity';
}

export function PhotoUpload({ photoUrl, onPhotoSelected, photoType }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to upload pictures.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: photoType === 'fullbody' ? [3, 4] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your camera to take pictures.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: photoType === 'fullbody' ? [3, 4] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      // TODO: Backend Integration - Upload photo to backend storage
      // For now, use the local URI
      onPhotoSelected(uri);
      Alert.alert('Success', 'Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (uploading) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.uploadingText}>Uploading photo...</Text>
      </View>
    );
  }

  if (photoUrl) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUrl }} style={styles.previewImage} />
        <TouchableOpacity style={styles.changeButton} onPress={showOptions}>
          <Text style={styles.changeButtonText}>Change Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.uploadContainer} onPress={showOptions}>
      <IconSymbol
        ios_icon_name="camera.fill"
        android_material_icon_name="add-a-photo"
        size={48}
        color={colors.primary}
      />
      <Text style={styles.uploadText}>Tap to upload photo</Text>
      <Text style={styles.uploadSubtext}>Take a photo or choose from library</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  uploadingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  uploadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  changeButton: {
    marginTop: 16,
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
