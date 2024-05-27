'use client'
import { SessionProvider } from 'next-auth/react';
import '../settings/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      
        <SessionProvider>{children}</SessionProvider>
      
    </section>
  );
}
