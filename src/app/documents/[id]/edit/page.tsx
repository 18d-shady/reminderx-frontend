'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import EditDocumentForm from '@/components/EditDocumentForm';

export default function CreateDocumentPage() {
  return (
    <ResponsiveModal title="Edit Document">
      <EditDocumentForm />
    </ResponsiveModal>
  );
}
