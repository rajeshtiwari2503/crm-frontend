import React, { useState } from "react";
import { auth } from "../../firebase/config"; // ✅ Ensure you're importing correctly
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const SendOtp = () => {
  const [phone, setPhone] = useState("");

  const setupRecaptcha = () => {
    // ✅ Make sure auth is NOT undefined here
    if (!window.recaptchaVerifier && auth) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
        },
        auth // ✅ Must be a valid auth object
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    } else {
      console.warn("Auth is undefined or reCAPTCHA already set.");
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter a phone number");

    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      alert("reCAPTCHA verifier not initialized. Please try again.");
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      console.log("OTP sent", confirmation);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        className="border p-2"
      />
      <button onClick={handleSendOtp} className="bg-blue-500 text-white p-2 mt-2">
        Send OTP
      </button>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default SendOtp;
