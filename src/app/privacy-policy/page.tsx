'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import PrivacyPolicy from '@/components/PrivacyPolicy';

export default function PrivacyPolicyPage() {
  return (
    <ResponsiveModal title="Privacy Policy">
      <PrivacyPolicy />
    </ResponsiveModal>
  );
}
