'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import DocumentDetails from '@/components/DocumentDetails';

export default function ViewDocumentPage() {
  return (
    <ResponsiveModal title="Document Details">
      <DocumentDetails />
    </ResponsiveModal>
  );
}
