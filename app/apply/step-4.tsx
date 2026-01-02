
import React from 'react';
import PhotoUploadStep from '@/components/PhotoUploadStep';

export default function Step4Screen() {
  return (
    <PhotoUploadStep
      stepNumber={4}
      totalSteps={5}
      title="Activity Photo"
      description="Upload a photo of you doing an activity you love. Only you should be in the photo."
      storageKey="application_activity1"
      nextRoute="/apply/step-5"
      photoType="activity"
    />
  );
}
