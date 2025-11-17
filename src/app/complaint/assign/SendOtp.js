import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase/config"; // Import Firebase Auth

const OtpSender = () => {
  const [phone, setPhone] = useState("9565892772");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      // Setup reCAPTCHA (Invisible)
      // window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      //   size: "invisible",
      // });

      const phoneNumber = `+91${phone}`; // Add country code
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Try again!");
    }
  };

  const verifyOtp = async () => {
    if (!otp || !confirmationResult) return setMessage("Enter OTP!");

    try {
      await confirmationResult.confirm(otp);
      setMessage("OTP verified successfully!");
    } catch (error) {
      setMessage("Invalid OTP. Try again!");
    }
  };

  return (
    <div className="p-4">
      <div id="recaptcha-container"></div> {/* Required for reCAPTCHA */}
      
      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="border p-2" />
      <button onClick={sendOtp} className="bg-blue-500 text-white px-4 py-2 ml-2">Send OTP</button>

      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="border p-2 mt-2" />
      <button onClick={verifyOtp} className="bg-green-500 text-white px-4 py-2 ml-2">Verify OTP</button>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default OtpSender;
