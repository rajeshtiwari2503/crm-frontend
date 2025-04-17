 // SendOtp.js
import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const SendOtp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // For testing on localhost
    if (window.location.hostname === "localhost") {
      auth.settings.appVerificationDisabledForTesting = true;
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved');
          },
        },
        auth
      );
    }
  }, []);

  const handleSendOtp = async () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setOtpSent(true);
        alert('OTP sent!');
      })
      .catch((error) => {
        console.error('SMS not sent', error);
        alert('Error sending OTP: ' + error.message);
      });
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return alert("No OTP was sent.");

    confirmationResult
      .confirm(otp)
      .then((result) => {
        const user = result.user;
        alert('Phone number verified! ✅');
        console.log('User:', user);
      })
      .catch((error) => {
        console.error('Invalid OTP', error);
        alert('Invalid OTP ❌');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Phone Number Verification</h2>
      <div id="recaptcha-container"></div>

      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="+91xxxxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ padding: '8px', margin: '10px', width: '250px' }}
          />
          <br />
          <button onClick={handleSendOtp} style={{ padding: '10px 20px' }}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: '8px', margin: '10px', width: '150px' }}
          />
          <br />
          <button onClick={handleVerifyOtp} style={{ padding: '10px 20px' }}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default SendOtp;
