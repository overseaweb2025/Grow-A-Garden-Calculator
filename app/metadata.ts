import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL('https://growagardenvalue.org'),
  title: {
    template: '%s | Garden Calculator',
    default: 'Garden Calculator - Crop Values & Mutation Tools',
  },
  description: 'Best Garden Calculator for Grow A Garden. Free crop tools.',
  keywords: 'Garden Calculator,Crop Calculator,Grow A Garden,Free',
  authors: [{ name: 'Garden Calculator Team' }],
  openGraph: {
    title: 'Garden Calculator - Crop Values & Mutation Tools',
    description: 'Best Garden Calculator for Grow A Garden. Free crop tools.',
    type: 'website',
    url: 'https://growagardenvalue.org',
    images: [
      {
        url: 'https://growagardenvalue.org/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Garden Calculator OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garden Calculator - Crop Values & Mutation Tools',
    description: 'Best Garden Calculator for Grow A Garden. Free crop tools.',
    images: ['https://growagardenvalue.org/og-image.svg'],
  },
  alternates: {
    canonical: 'https://growagardenvalue.org/',
  },
  icons: {
    icon: '/logo/logo.jpg',
    apple: '/logo/logo.jpg',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.dev'
} 