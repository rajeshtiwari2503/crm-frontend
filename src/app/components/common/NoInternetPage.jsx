'use client';

import { useEffect, useState } from 'react';
import { ReactLoader } from './Loading';

 

export default function InternetStatusPopup() {
  const [isOffline, setIsOffline] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);

    const handleOnline = () => {
      // Show loader before reload
      setIsReloading(true);

      // Wait 1.5 seconds for user to see loader, then reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // If not offline, don’t show popup
  if (!isOffline) return null;

  return (
   <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-6 py-12">
  <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 flex flex-col items-center animate-fadeIn">
    {isReloading ? (
      <>
        <p className="text-gray-800 font-semibold text-xl mb-8 text-center">
          Connection restored, reloading...
        </p>
        <div className="flex items-center justify-center h-40 w-40">
          <ReactLoader />
        </div>
      </>
    ) : (
      <>
        {/* Wi-Fi Off Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-red-600 mb-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.517 15.234a5 5 0 017.065 0m-10.607-3.826a9 9 0 0114.144 0M2.18 8.908a13 13 0 0119.638 0M12 20v.01"
          />
        </svg>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
          No Internet Connection
        </h2>

        <p className="text-gray-600 mb-10 text-center leading-relaxed">
          Your device is offline. Please check your internet or Wi-Fi connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300"
        >
          Retry
        </button>
      </>
    )}
  </div>
</div>

  );
}
