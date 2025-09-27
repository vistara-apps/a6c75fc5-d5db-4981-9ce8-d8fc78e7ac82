import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'CreatorVerse - Automate Video Creation, Monetize with NFTs',
  description: 'An NFT-enhanced automated video generation platform for content creators to easily produce and monetize their videos through customizable templates, a media library, and exclusive digital collectibles.',
  keywords: ['video creation', 'NFT', 'content creators', 'automation', 'Base', 'blockchain'],
  authors: [{ name: 'CreatorVerse Team' }],
  openGraph: {
    title: 'CreatorVerse - Automate Video Creation, Monetize with NFTs',
    description: 'Create, customize, and monetize videos with NFT integration on Base',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
