'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import EditDocumentForm from '@/components/EditDocumentForm';

export default function EditDocumentPage() {
  return (
    <ResponsiveModal title="Edit Reminder">
      <EditDocumentForm />
    </ResponsiveModal>
  );
}
