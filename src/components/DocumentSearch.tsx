'use client';

import { useIsMobile } from '@/lib/useIsMobile';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchParticulars } from '@/lib/user';

export function DocumentSearch() {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMobileInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showMobileInput]);

  const handleSearch = async (term: string) => {
    try {
      const data = await searchParticulars(term);
      setResults(data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching search results:', err);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() !== '') {
      await handleSearch(val);
    } else {
      setResults([]);
    }
  };

  const renderResults = () => (
    results.length > 0 && (
      <ul className="absolute bg-white border rounded w-full mt-1 z-10 shadow">
        {results.map((doc) => (
          <li key={doc.id} className="hover:bg-gray-100 text-sm">
            <Link href={`/documents/${doc.id}`} className="block px-4 py-2 cursor-pointer">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    )
  );

  // ✅ Mobile View
  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMobileInput(!showMobileInput)}
          className="p-2 rounded-full border-2 bdd-main"
        >
          <svg className="h-5 w-5 fff-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {showMobileInput && (
          <div className="absolute -mx-24 mt-2 w-48 bg-white border rounded shadow z-20">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border-b outline-none text-sm"
            />
            <div className="relative">
              {renderResults()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ Large Screen View
  return (
    <div className="relative max-w-md">
      <div className="relative">
        {/* SVG icon inside input */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-full border border-gray-400 text-sm"
        />
        {renderResults()}
      </div>
    </div>
  );
}
