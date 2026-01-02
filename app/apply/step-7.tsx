
import React from 'react';
import ActivityPhotoUpload from '@/components/ActivityPhotoUpload';

export default function Step7Screen() {
  return (
    <ActivityPhotoUpload
      stepNumber={7}
      totalSteps={10}
      photoNumber={2}
      storageKey="onboarding_activity2"
      nextRoute="/apply/step-8"
      progressPercent="70%"
    />
  );
}
