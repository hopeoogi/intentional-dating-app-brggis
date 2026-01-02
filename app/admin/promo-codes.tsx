
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { api } from '@/lib/api-client';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_months';
  discount_value: number;
  applicable_tiers: string[];
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  active: boolean;
  created_at: string;
}

export default function PromoCodesScreen() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount' | 'free_months',
    discount_value: '',
    applicable_tiers: ['basic', 'elite', 'star'],
    max_uses: '',
    valid_until: '',
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      // TODO: Backend Integration - Fetch promo codes from backend API
      const response = await api.get('/admin/promo-codes');
      setPromoCodes(response.data || []);
    } catch (err) {
      console.error('Error loading promo codes:', err);
      Alert.alert('Error', 'Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async () => {
    if (!formData.code || !formData.discount_value) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // TODO: Backend Integration - Create promo code via backend API
      await api.post('/admin/promo-codes', {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        applicable_tiers: formData.applicable_tiers,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_until: formData.valid_until || null,
        active: true,
      });

      Alert.alert('Success', 'Promo code created successfully');
      setShowCreateForm(false);
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        applicable_tiers: ['basic', 'elite', 'star'],
        max_uses: '',
        valid_until: '',
      });
      loadPromoCodes();
    } catch (err: any) {
      console.error('Error creating promo code:', err);
      Alert.alert('Error', err.message || 'Failed to create promo code');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      // TODO: Backend Integration - Toggle promo code status via backend API
      await api.patch(`/admin/promo-codes/${id}`, {
        active: !currentActive,
      });
      loadPromoCodes();
    } catch (err) {
      console.error('Error toggling promo code:', err);
      Alert.alert('Error', 'Failed to update promo code');
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    Alert.alert(
      'Delete Promo Code',
      `Are you sure you want to delete "${code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Backend Integration - Delete promo code via backend API
              await api.delete(`/admin/promo-codes/${id}`);
              loadPromoCodes();
            } catch (err) {
              console.error('Error deleting promo code:', err);
              Alert.alert('Error', 'Failed to delete promo code');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Promo Codes</Text>
          <TouchableOpacity
            onPress={() => setShowCreateForm(!showCreateForm)}
            style={styles.addButton}
          >
            <IconSymbol
              ios_icon_name={showCreateForm ? 'xmark' : 'plus'}
              android_material_icon_name={showCreateForm ? 'close' : 'add'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {showCreateForm && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>Create New Promo Code</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Code (e.g., SUMMER2024)"
              placeholderTextColor={colors.textSecondary}
              value={formData.code}
              onChangeText={(text) => setFormData({ ...formData, code: text })}
              autoCapitalize="characters"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Discount Type</Text>
                <View style={styles.segmentedControl}>
                  {['percentage', 'fixed_amount', 'free_months'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segment,
                        formData.discount_type === type && styles.segmentActive,
                      ]}
                      onPress={() => setFormData({ ...formData, discount_type: type as any })}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          formData.discount_type === type && styles.segmentTextActive,
                        ]}
                      >
                        {type === 'percentage' ? '%' : type === 'fixed_amount' ? '$' : 'Months'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.label}>Value</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Value"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.discount_value}
                  onChangeText={(text) => setFormData({ ...formData, discount_value: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Max Uses (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Unlimited"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.max_uses}
                  onChangeText={(text) => setFormData({ ...formData, max_uses: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.label}>Valid Until (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.valid_until}
                  onChangeText={(text) => setFormData({ ...formData, valid_until: text })}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreatePromo}>
              <Text style={styles.createButtonText}>Create Promo Code</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.promoList}>
          {promoCodes.map((promo) => (
            <View key={promo.id} style={styles.promoCard}>
              <View style={styles.promoHeader}>
                <View>
                  <Text style={styles.promoCode}>{promo.code}</Text>
                  <Text style={styles.promoDescription}>{promo.description}</Text>
                </View>
                <View style={[styles.statusBadge, promo.active ? styles.activeBadge : styles.inactiveBadge]}>
                  <Text style={styles.statusText}>{promo.active ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>

              <View style={styles.promoDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Discount:</Text>
                  <Text style={styles.detailValue}>
                    {promo.discount_type === 'percentage' && `${promo.discount_value}%`}
                    {promo.discount_type === 'fixed_amount' && `$${promo.discount_value}`}
                    {promo.discount_type === 'free_months' && `${promo.discount_value} months free`}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Uses:</Text>
                  <Text style={styles.detailValue}>
                    {promo.current_uses} / {promo.max_uses || '∞'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tiers:</Text>
                  <Text style={styles.detailValue}>{promo.applicable_tiers.join(', ')}</Text>
                </View>
                {promo.valid_until && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Expires:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(promo.valid_until).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.promoActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleActive(promo.id, promo.active)}
                >
                  <IconSymbol
                    ios_icon_name={promo.active ? 'pause.circle' : 'play.circle'}
                    android_material_icon_name={promo.active ? 'pause_circle' : 'play_circle'}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.actionText}>{promo.active ? 'Deactivate' : 'Activate'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeletePromo(promo.id, promo.code)}
                >
                  <IconSymbol
                    ios_icon_name="trash"
                    android_material_icon_name="delete"
                    size={20}
                    color={colors.error}
                  />
                  <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {promoCodes.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="ticket"
              android_material_icon_name="local_offer"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No Promo Codes</Text>
            <Text style={styles.emptyText}>Create your first promo code to get started</Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
  },
  createForm: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  promoList: {
    gap: 12,
  },
  promoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promoCode: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  promoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  inactiveBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  promoDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  promoActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
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
  },
});
