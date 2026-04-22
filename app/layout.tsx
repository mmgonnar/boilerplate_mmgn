import { ThemeProvider } from '@/providers';

import './globals.css';

// export const metadata: Metadata = {
//   title: {
//     default: 'mmgn - boilerplate',
//     template: '%s | boilerplate',
//   },
//   description: 'Production-ready boilerplate para Next.js',
//   authors: [
//     { name: 'Mariela González (mmgonnar)', url: 'https://www.mmgonnar.com/' },
//   ],
//   creator: 'mmgonnar',
// };

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
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
