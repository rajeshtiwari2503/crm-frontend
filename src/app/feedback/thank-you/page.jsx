 'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Thankyou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="object-contain rounded-md"
            priority
          />
        </div>

        {/* Animated Check Icon */}
        <div className="flex justify-center items-center mt-8 mb-6">
          <CheckCircleIcon
            className="text-green-600"
            style={{ fontSize: 64, animation: 'pop 2s ease-in-out infinite' }}
          />
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your feedback has been received. We truly value your input!
        </p>

        {/* Link */}
        <Link
          href="/"
     className="rounded-lg p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to Home
        </Link>
      </div>

      {/* Inline CSS animation */}
      <style>{`
        @keyframes pop {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}
