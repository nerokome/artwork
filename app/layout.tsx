import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './redux/store/ReduxProvider';
import { ThemeProvider } from './components/ThemeProvider';
import NetworkStatus from './components/NetworkStatus';

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Artfolio',
  description: 'A home for artists to share their work and build a portfolio.',
  icons: {
    icon: [
      { url: '/artfolio-icon.svg', type: 'image/svg+xml' },
      { url: '/artfolio-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Artfolio',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem('artfolio-theme'); document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark'; } catch { document.documentElement.dataset.theme = 'dark'; }`,
          }}
        />
      </head>
      <body className={`${lato.variable} antialiased`}>
        <ThemeProvider>
          <ReduxProvider>
            <NetworkStatus />
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
