"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface DocumentItemProps {
  id: number;
  name: string;
  expiry_date: Date;
  status: string;
  picture: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ id, name, expiry_date, status, picture }) => {
  const [showActions, setShowActions] = useState(false);

  const statusColor = status === "up to date" ? "bg-green-200" : "bg-red-200";

  return (
    <div className="w-full bg-white text-gray-700 border border-gray-300 rounded-md p-3">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row">
          <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center">
            {picture ? (
              <>
                {picture.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <img
                    src={picture}
                    alt={name}
                    className="w-full max-w-sm h-auto object-contain"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                ) : (
                <a
                    href={picture}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 underline text-vvs"
                >
                    View
                </a>
                )}
              </>
            ) : (
              <div className="w-full h-full bgg-main opacity-75 p-2 rounded-md">
                <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between ml-3">
            <h3 className="text-xs font-semibold">{name}</h3>
            <p className={`text-vvs text-gray-600 ${statusColor} px-3 py-1 rounded-full`}>
              Expires: {expiry_date.toDateString()}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            className="w-8 h-8 rounded-full bgg-main opacity-75 p-2"
            onClick={() => setShowActions(!showActions)}
          >
            <svg className="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 shadow-lg rounded z-10">
              <Link href={`/documents/${id}`} className="block px-4 py-2 text-sm hover:bg-gray-100">View</Link>
              <Link href={`/documents/${id}/edit`} className="block px-4 py-2 text-sm hover:bg-gray-100">Edit</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
