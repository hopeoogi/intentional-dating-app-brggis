
import React from 'react';
import PhotoUploadStep from '@/components/PhotoUploadStep';

export default function Step3Screen() {
  return (
    <PhotoUploadStep
      stepNumber={3}
      totalSteps={5}
      title="Full Body Photo"
      description="Upload a full body photo without baggy clothes or jackets. Show your authentic self."
      storageKey="application_fullbody"
      nextRoute="/apply/step-4"
      photoType="full_body"
    />
  );
}
