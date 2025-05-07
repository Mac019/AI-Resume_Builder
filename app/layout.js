// app/layout.js
'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
