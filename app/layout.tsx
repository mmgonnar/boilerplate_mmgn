import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/providers';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'mmgn - boilerplate',
    template: '%s | boilerplate',
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
