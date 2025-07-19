import { MetadataRoute } from 'next'

// 动态获取博客文章的函数
async function getBlogPostIds(): Promise<string[]> {
  try {
    // 在服务器环境中直接调用API函数
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://growagardenvalue.org' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/github`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const posts = await response.json();
      return posts.map((post: any) => post.issueNumber.toString());
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic blog posts for sitemap:', error);
  }
  
  // 如果API调用失败，返回默认的博客ID
  return ['1', '2'];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://growagardenvalue.org'
  const currentDate = new Date()
  
  // 支持的语言
  const languages = ['zh', 'en', 'fr', 'fil', 'ru', 'es', 'vi', 'hi']
  
  // 根页面（无语言前缀，默认英文）
  const rootPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/values`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trade-calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gear`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/write`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
  
  // 基础页面路径（用于生成多语言版本）
  const pageRoutes = [
    { path: '', priority: 1, changeFreq: 'daily' as const },                    // 首页
    { path: '/values', priority: 0.9, changeFreq: 'weekly' as const },         // 价值表
    { path: '/trade-calculator', priority: 0.9, changeFreq: 'weekly' as const }, // 交易计算器
    { path: '/gear', priority: 0.8, changeFreq: 'weekly' as const },           // 装备信息
    { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },           // 博客列表
    { path: '/write', priority: 0.7, changeFreq: 'weekly' as const },          // 写作页面
    { path: '/sitemap-page', priority: 0.5, changeFreq: 'monthly' as const },  // 站点地图
  ]
  
  // 生成所有语言版本的页面
  const multiLanguagePages: MetadataRoute.Sitemap = []
  
  languages.forEach(lang => {
    pageRoutes.forEach(route => {
      multiLanguagePages.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: currentDate,
        changeFrequency: route.changeFreq,
        priority: route.priority,
      })
    })
  })
  
  // 动态获取博客文章ID
  const blogIds = await getBlogPostIds();
  
  // 博客详情页面的多语言版本
  const blogDetailPages: MetadataRoute.Sitemap = []
  
  languages.forEach(lang => {
    blogIds.forEach(id => {
      blogDetailPages.push({
        url: `${baseUrl}/${lang}/blog/${id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })
  
  // Wiki 页面
  const wikiSlugs = [
    'rare-mutations-guide',
    // 可以添加更多 wiki 页面
  ]
  
  const wikiPages: MetadataRoute.Sitemap = []
  
  wikiSlugs.forEach(slug => {
    // Wiki 主页面
    wikiPages.push({
      url: `${baseUrl}/wiki/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
    
    // Wiki 详情页面
    wikiPages.push({
      url: `${baseUrl}/wiki-detail/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })
  
  // 静态博客详情页面（兼容性）
  const staticBlogSlugs = [
    'garden-calculator-guide',
    'welcome-to-garden',
  ]
  
  const staticBlogPages: MetadataRoute.Sitemap = staticBlogSlugs.map(slug => ({
    url: `${baseUrl}/blog-detail/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  // 特殊页面
  const specialPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/404`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.1,
    }
  ]
  
  // 语言专用的admin页面（如果存在）
  const adminPages: MetadataRoute.Sitemap = languages.map(lang => ({
    url: `${baseUrl}/${lang}/admin`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.3,
  }))
  
  // 合并所有页面
  const allPages = [
    ...rootPages,          // 根页面（默认英文） - 8个
    ...multiLanguagePages, // 多语言页面 - 8语言×7页面 = 56个  
    ...blogDetailPages,    // 博客详情页的多语言版本 - 8语言×N文章
    ...wikiPages,          // Wiki页面 - 2个（每个slug 2个页面）
    ...staticBlogPages,    // 静态博客页面 - 2个
    ...adminPages,         // 管理员页面的多语言版本 - 8个
    ...specialPages,       // 特殊页面 - 1个
  ]
  
  // 确保URL唯一性（去重）
  const uniqueUrls = new Set<string>()
  const uniquePages = allPages.filter(page => {
    if (uniqueUrls.has(page.url)) {
      return false
    }
    uniqueUrls.add(page.url)
    return true
  })
  
  console.log(`Sitemap generated with ${uniquePages.length} unique pages`)
  console.log(`Blog posts found: ${blogIds.length}`)
  
  return uniquePages
}