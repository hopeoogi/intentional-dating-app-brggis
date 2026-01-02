
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';

export default function Step5Screen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!photoUri) {
      Alert.alert('Required', 'Please upload a full body photo to continue');
      return;
    }

    setUploading(true);

    try {
      const fileName = `fullbody_${Date.now()}.jpg`;
      const response = await fetch(photoUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      await AsyncStorage.setItem('onboarding_fullbody', publicUrl);
      router.push('/apply/step-6');
    } catch (error: any) {
      console.error('[Step5] Upload error:', error);
      Alert.alert('Upload Failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.stepNumber}>Step 5 of 10</Text>
          <Text style={styles.title}>Full body photo</Text>
          <Text style={styles.subtitle}>No baggy clothes or jackets</Text>
        </View>

        <View style={styles.photoContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={80}
                color="#666666"
              />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}
        </View>

        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          <View style={styles.requirementItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirementText}>Full body visible</Text>
          </View>
          <View style={styles.requirementItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirementText}>No baggy clothes or oversized jackets</Text>
          </View>
          <View style={styles.requirementItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirementText}>Only you in the photo</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
            <IconSymbol
              ios_icon_name="camera"
              android_material_icon_name="camera_alt"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <IconSymbol
              ios_icon_name="photo"
              android_material_icon_name="photo_library"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.uploadButtonText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !photoUri && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!photoUri || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>Continue</Text>
              <IconSymbol
                ios_icon_name="arrow.right"
                android_material_icon_name="arrow_forward"
                size={20}
                color="#000000"
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  header: {
    marginBottom: 32,
  },
  stepNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 12,
  },
  requirements: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  requirementText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
