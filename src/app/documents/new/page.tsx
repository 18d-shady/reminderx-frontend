'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import CreateDocumentForm from '@/components/CreateDocumentForm';

export default function CreateDocumentPage() {
  return (
    <ResponsiveModal title="Create New Reminder">
      <CreateDocumentForm />
    </ResponsiveModal>
  );
}
