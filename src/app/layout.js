import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LybleyCRM',
  description: 'LybleyCRM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></link>

      <body className={inter.className}>{children}</body>
    </html>
  )
}
