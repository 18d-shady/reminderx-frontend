'use client';

interface LoaderProps {
  isOpen: boolean;
}

const Loader = ({ isOpen }: LoaderProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs flex flex-col items-center justify-center p-8">
        <svg
          className="animate-pulse w-10 h-10 text-gray-600 mb-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
          />
          <path
            d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            fill="currentColor"
          />
        </svg>
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loader; 