
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { usePendingUsers, PendingUser } from '@/hooks/usePendingUsers';
import { router } from 'expo-router';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');

export default function PendingUsersScreen() {
  // TODO: Backend Integration - usePendingUsers hook will call backend API endpoints
  const { pendingUsers, loading, error, approveUser, rejectUser, updatePhotoApproval, updateBadgeStatus } = usePendingUsers();
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedPhotoId, setExpandedPhotoId] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    Alert.alert(
      'Approve User',
      'Are you sure you want to approve this user? They will be added to the community.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setActionLoading(true);
            // TODO: Backend Integration - Call POST /api/admin/users/{userId}/approve
            const result = await approveUser(userId);
            setActionLoading(false);

            if (result.success) {
              Alert.alert('Success', 'User approved successfully!');
              setSelectedUser(null);
            } else {
              Alert.alert('Error', result.error || 'Failed to approve user');
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    // TODO: Backend Integration - Call POST /api/admin/users/{userId}/reject with reason
    const result = await rejectUser(selectedUser.id, rejectionReason);
    setActionLoading(false);

    if (result.success) {
      Alert.alert('Success', 'User rejected successfully');
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
    } else {
      Alert.alert('Error', result.error || 'Failed to reject user');
    }
  };

  const handlePhotoApproval = async (photoId: string, approved: boolean) => {
    setActionLoading(true);
    // TODO: Backend Integration - Call PUT /api/admin/photos/{photoId} with approval status
    const result = await updatePhotoApproval(
      photoId,
      approved,
      approved ? undefined : 'Photo does not meet quality standards'
    );
    setActionLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to update photo');
    }
  };

  const handleBadgeApproval = async (badgeId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    // TODO: Backend Integration - Call PUT /api/admin/badges/{badgeId} with status
    const result = await updateBadgeStatus(
      badgeId,
      status,
      status === 'rejected' ? 'Verification proof does not meet requirements' : undefined
    );
    setActionLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to update badge');
    }
  };

  const renderPhotoReview = (photo: any) => {
    const isExpanded = expandedPhotoId === photo.id;
    const photoTypeLabel = photo.photo_type === 'selfie' ? 'Selfie' : photo.photo_type === 'fullbody' ? 'Full Body' : 'Activity';

    return (
      <View key={photo.id} style={styles.photoReviewCard}>
        <View style={styles.photoReviewHeader}>
          <Text style={styles.photoTypeLabel}>{photoTypeLabel}</Text>
          {photo.approved === null && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending Review</Text>
            </View>
          )}
          {photo.approved === true && (
            <View style={[styles.pendingBadge, { backgroundColor: '#34C75920' }]}>
              <Text style={[styles.pendingBadgeText, { color: '#34C759' }]}>Approved</Text>
            </View>
          )}
          {photo.approved === false && (
            <View style={[styles.pendingBadge, { backgroundColor: '#FF3B3020' }]}>
              <Text style={[styles.pendingBadgeText, { color: '#FF3B30' }]}>Rejected</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setExpandedPhotoId(isExpanded ? null : photo.id)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: photo.url }}
            style={[
              styles.photoPreview,
              isExpanded && styles.photoPreviewExpanded,
            ]}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {photo.approved === null && (
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={[styles.photoActionButton, styles.approveButton]}
              onPress={() => handlePhotoApproval(photo.id, true)}
              disabled={actionLoading}
            >
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.photoActionText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoActionButton, styles.rejectButton]}
              onPress={() => handlePhotoApproval(photo.id, false)}
              disabled={actionLoading}
            >
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.photoActionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderBadgeReview = (badge: any) => {
    const tierColors = {
      basic: '#007AFF',
      elite: '#AF52DE',
      star: '#FFD700',
    };

    return (
      <View key={badge.id} style={styles.badgeReviewCard}>
        <View style={styles.badgeReviewHeader}>
          <View style={styles.badgeInfo}>
            <View style={[styles.badgeTierIndicator, { backgroundColor: tierColors[badge.tier] + '20' }]}>
              <Text style={[styles.badgeTierText, { color: tierColors[badge.tier] }]}>
                {badge.tier.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.badgeTypeText}>{badge.badge_type}</Text>
          </View>

          {badge.status === 'pending' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          )}
          {badge.status === 'approved' && (
            <View style={[styles.pendingBadge, { backgroundColor: '#34C75920' }]}>
              <Text style={[styles.pendingBadgeText, { color: '#34C759' }]}>Approved</Text>
            </View>
          )}
          {badge.status === 'rejected' && (
            <View style={[styles.pendingBadge, { backgroundColor: '#FF3B3020' }]}>
              <Text style={[styles.pendingBadgeText, { color: '#FF3B30' }]}>Rejected</Text>
            </View>
          )}
        </View>

        {badge.proof_image_url && (
          <Image
            source={{ uri: badge.proof_image_url }}
            style={styles.badgeProofImage}
            resizeMode="cover"
          />
        )}

        {badge.status === 'pending' && (
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={[styles.photoActionButton, styles.approveButton]}
              onPress={() => handleBadgeApproval(badge.id, 'approved')}
              disabled={actionLoading}
            >
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.photoActionText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoActionButton, styles.rejectButton]}
              onPress={() => handleBadgeApproval(badge.id, 'rejected')}
              disabled={actionLoading}
            >
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.photoActionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderUserCard = (user: PendingUser) => {
    const selfiePhoto = user.pending_user_photos.find(p => p.photo_type === 'selfie');
    const daysWaiting = Math.floor(
      (new Date().getTime() - new Date(user.submitted_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity
        key={user.id}
        style={styles.userCard}
        onPress={() => setSelectedUser(user)}
        activeOpacity={0.7}
      >
        <View style={styles.userCardHeader}>
          {selfiePhoto ? (
            <Image source={{ uri: selfiePhoto.url }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={32}
                color={colors.textSecondary}
              />
            </View>
          )}

          <View style={styles.userCardInfo}>
            <Text style={styles.userName}>{user.name}, {user.age}</Text>
            <Text style={styles.userLocation}>{user.city}, {user.state}</Text>
            <Text style={styles.userSubmitted}>
              Submitted {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} ago
            </Text>
          </View>

          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron_right"
            size={24}
            color={colors.textSecondary}
          />
        </View>

        <View style={styles.userCardStats}>
          <View style={styles.statItem}>
            <IconSymbol
              ios_icon_name="photo.fill"
              android_material_icon_name="photo"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.statText}>{user.pending_user_photos.length} photos</Text>
          </View>

          <View style={styles.statItem}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.statText}>{user.pending_status_badges.length} badges</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading pending users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <IconSymbol
          ios_icon_name="exclamationmark.triangle.fill"
          android_material_icon_name="error"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
          <Text style={styles.title}>Pending Approvals</Text>
          <View style={styles.backButton} />
        </View>

        {pendingUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
            <Text style={styles.emptyStateText}>
              There are no pending user applications to review at this time.
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.statsBar}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{pendingUsers.length}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            {pendingUsers.map(renderUserCard)}
          </View>
        )}
      </ScrollView>

      {/* User Detail Modal */}
      <Modal
        visible={selectedUser !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <View style={commonStyles.container}>
            <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
                  <IconSymbol
                    ios_icon_name="xmark"
                    android_material_icon_name="close"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Review Application</Text>
                <View style={styles.backButton} />
              </View>

              {/* User Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Applicant Information</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{selectedUser.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Age:</Text>
                    <Text style={styles.infoValue}>{selectedUser.age}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoValue}>{selectedUser.city}, {selectedUser.state}</Text>
                  </View>
                  {selectedUser.bio && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Bio:</Text>
                      <Text style={styles.infoValue}>{selectedUser.bio}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Submitted:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(selectedUser.submitted_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Photos Review */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Photos ({selectedUser.pending_user_photos.length})</Text>
                {selectedUser.pending_user_photos.map(renderPhotoReview)}
              </View>

              {/* Status Badges Review */}
              {selectedUser.pending_status_badges.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Status Badges ({selectedUser.pending_status_badges.length})
                  </Text>
                  {selectedUser.pending_status_badges.map(renderBadgeReview)}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectActionButton]}
                  onPress={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <IconSymbol
                        ios_icon_name="xmark.circle.fill"
                        android_material_icon_name="cancel"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.approveActionButton]}
                  onPress={() => handleApprove(selectedUser.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check_circle"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.rejectModalOverlay}>
          <View style={styles.rejectModalContent}>
            <Text style={styles.rejectModalTitle}>Reject Application</Text>
            <Text style={styles.rejectModalDescription}>
              Please provide a reason for rejecting this application. This will help the applicant understand what needs improvement.
            </Text>

            <TextInput
              style={styles.rejectInput}
              placeholder="Enter rejection reason..."
              placeholderTextColor={colors.textSecondary}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.rejectModalButtons}>
              <TouchableOpacity
                style={[styles.rejectModalButton, styles.rejectModalCancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.rejectModalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.rejectModalButton, styles.rejectModalConfirmButton]}
                onPress={handleReject}
                disabled={!rejectionReason.trim() || actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.rejectModalConfirmText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCardInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userSubmitted: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userCardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  photoReviewCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  photoReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  pendingBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  photoPreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  photoPreviewExpanded: {
    height: 500,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  photoActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badgeReviewCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  badgeReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeTierIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTierText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  badgeProofImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  approveActionButton: {
    backgroundColor: '#34C759',
  },
  rejectActionButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rejectModalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  rejectModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  rejectModalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  rejectInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    marginBottom: 20,
  },
  rejectModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectModalCancelButton: {
    backgroundColor: colors.card,
  },
  rejectModalConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  rejectModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rejectModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
