import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from './components/UserContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SERVSY',
  description: 'SERVSY',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        {/* ✅ Google reCAPTCHA Script */}
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="beforeInteractive"
          async
          defer
        />
      </head>
      <body className={inter.className}>
        <UserProvider> {/* Wrap children inside UserProvider */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

