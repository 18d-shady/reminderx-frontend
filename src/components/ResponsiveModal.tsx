// components/ResponsiveModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ResponsiveModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const ResponsiveModal = ({ title, children, onClose }: ResponsiveModalProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  if (!isDesktop) {
    // Full-screen mobile layout
    return (
      <div className="min-h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{title}</h1>
          <button onClick={handleClose} className="text-gray-500">✕</button>
        </div>
        {children}
      </div>
    );
  }

  // Desktop modal style
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-60 w-full max-w-2xl bg-white shadow-lg p-4 rounded-lg overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );

};

export default ResponsiveModal;
