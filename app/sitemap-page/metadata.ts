import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '网站地图 - Grow A Garden Calculator',
  description: '查看 Grow A Garden Calculator 网站的所有页面，支持8种语言版本：中文、英文、法文、菲律宾语、俄语、西班牙语、越南语、印地语。',
  keywords: '网站地图,sitemap,导航,页面索引,多语言,Grow A Garden,花园计算器',
  
  alternates: {
    canonical: 'https://growagardenvalue.org/sitemap-page',
  },
  
  openGraph: {
    title: '网站地图 - Grow A Garden Calculator',
    description: '查看所有可用页面和多语言版本',
    url: 'https://growagardenvalue.org/sitemap-page',
    siteName: 'Grow A Garden Calculator',
    type: 'website',
  },
  
  twitter: {
    card: 'summary',
    title: '网站地图 - Grow A Garden Calculator',
    description: '查看所有可用页面和多语言版本',
  },
  
  robots: {
    index: true,
    follow: true,
  },
}