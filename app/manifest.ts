import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Artfolio',
    short_name: 'Artfolio',
    description: 'A home for artists to share their work and build a portfolio.',
    start_url: '/',
    display: 'standalone',
    background_color: '#11131a',
    theme_color: '#11131a',
    icons: [
      {
        src: '/artfolio-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/artfolio-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/artfolio-icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
