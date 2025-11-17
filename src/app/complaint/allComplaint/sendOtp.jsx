 'use client';

import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../../firebase/config'; // adjust path if needed
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const SendOtpPage = () => {
  const [phone, setPhone] = useState('');
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    const initializeRecaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha && !recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved:", response);
            },
          },
          auth
        );
  
        recaptchaVerifierRef.current.render().then((widgetId) => {
          console.log("reCAPTCHA widget ID:", widgetId);
        });
      } else if (!window.grecaptcha) {
        setTimeout(initializeRecaptcha, 500); // Retry until grecaptcha is loaded
      }
    };
  
    initializeRecaptcha();
  }, []);
  

  const handleSendOtp = async () => {
    if (!phone) {
      return alert('Please enter a phone number');
    }

    const appVerifier = recaptchaVerifierRef.current;
    if (!appVerifier) {
      alert('reCAPTCHA not ready yet. Please try again.');
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      console.log('OTP sent successfully:', confirmation);
      alert('OTP sent!');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Send OTP</h1>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        className="border border-gray-300 p-2 rounded w-64"
      />
      <button
        onClick={handleSendOtp}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send OTP
      </button>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default SendOtpPage;
