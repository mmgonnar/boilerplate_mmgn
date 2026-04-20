import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'mmgn - boilerplate',
    template: '%s | Project',
  },
  description: 'mmgn boilerplate',
  authors: [
    { name: 'Mariela González (mmgonnar)', url: 'https://www.mmgonnar.com/' },
  ],
  creator: 'mmgonnar',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
