
import React from 'react';
import PhotoUploadStep from '@/components/PhotoUploadStep';

export default function Step2Screen() {
  return (
    <PhotoUploadStep
      stepNumber={2}
      totalSteps={5}
      title="Selfie Photo"
      description="Upload a clear selfie without sunglasses. This helps us verify your identity."
      storageKey="application_selfie"
      nextRoute="/apply/step-3"
      photoType="selfie"
    />
  );
}
