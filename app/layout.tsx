import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './redux/store/ReduxProvider';
import { ThemeProvider } from './components/ThemeProvider';

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Artfolio',
  description: '',
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
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
