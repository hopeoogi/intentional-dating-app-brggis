
import React from 'react';
import ActivityPhotoUpload from '@/components/ActivityPhotoUpload';

export default function Step6Screen() {
  return (
    <ActivityPhotoUpload
      stepNumber={6}
      totalSteps={10}
      photoNumber={1}
      storageKey="onboarding_activity1"
      nextRoute="/apply/step-7"
      progressPercent="60%"
    />
  );
}
