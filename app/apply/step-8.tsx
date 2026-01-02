
import React from 'react';
import ActivityPhotoUpload from '@/components/ActivityPhotoUpload';

export default function Step8Screen() {
  return (
    <ActivityPhotoUpload
      stepNumber={8}
      totalSteps={10}
      photoNumber={3}
      storageKey="onboarding_activity3"
      nextRoute="/apply/step-9"
      progressPercent="80%"
    />
  );
}
