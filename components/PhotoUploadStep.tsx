
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
import { router, Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PhotoUploadStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  storageKey: string;
  nextRoute: string;
  photoType: 'selfie' | 'full_body' | 'activity';
}

export default function PhotoUploadStep({
  stepNumber,
  totalSteps,
  title,
  description,
  storageKey,
  nextRoute,
  photoType,
}: PhotoUploadStepProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!photo) {
      Alert.alert('Error', 'Please select a photo');
      return;
    }

    setLoading(true);
    try {
      // TODO: Backend Integration - Upload photo to API
      await AsyncStorage.setItem(storageKey, photo);
      router.push(nextRoute);
    } catch (error) {
      console.error('[PhotoUpload] Error:', error);
      Alert.alert('Error', 'Failed to save photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Stack.Screen options={{ headerTitle: title }} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>Step {stepNumber} of {totalSteps}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>

        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <IconSymbol
                ios_icon_name="camera.fill"
                android_material_icon_name="camera"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
            <IconSymbol
              ios_icon_name="camera"
              android_material_icon_name="camera"
              size={20}
              color={colors.text}
            />
            <Text style={styles.secondaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
            <IconSymbol
              ios_icon_name="photo"
              android_material_icon_name="image"
              size={20}
              color={colors.text}
            />
            <Text style={styles.secondaryButtonText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !photo && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!photo || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  progress: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  photoContainer: {
    flex: 1,
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
