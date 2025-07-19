import { NextRequest, NextResponse } from 'next/server'

// 动态获取博客文章的函数
async function getBlogPostIds(): Promise<string[]> {
  try {
    // 在服务器环境中直接调用GitHub API
    const GITHUB_CONFIG = {
      token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
      owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || '',
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO || ''
    };

    if (!GITHUB_CONFIG.token || !GITHUB_CONFIG.owner || !GITHUB_CONFIG.repo) {
      console.warn('GitHub configuration missing for sitemap generation');
      return ['1', '2']; // 返回默认值
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues?labels=blog-post&state=open&sort=created&direction=desc`,
      {
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        // 添加缓存控制
        next: { revalidate: 3600 } // 1小时重新验证
      }
    );

    if (response.ok) {
      const issues = await response.json();
      return issues.map((issue: any) => issue.number.toString());
    }
  } catch (error) {
    console.warn('Failed to fetch blog posts for sitemap:', error);
  }
  
  // 如果API调用失败，返回默认的博客ID
  return ['1', '2'];
}

export async function GET(request: NextRequest) {
  const baseUrl = 'https://growagardenvalue.org'
  const currentDate = new Date().toISOString()
  
  // 支持的语言
  const languages = ['zh', 'en', 'fr', 'fil', 'ru', 'es', 'vi', 'hi']
  
  // 基础页面路径
  const pageRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },                    // 首页
    { path: '/values', priority: '0.9', changefreq: 'weekly' },            // 价值表
    { path: '/trade-calculator', priority: '0.9', changefreq: 'weekly' },  // 交易计算器
    { path: '/gear', priority: '0.8', changefreq: 'weekly' },              // 装备信息
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },              // 博客列表
    { path: '/write', priority: '0.7', changefreq: 'weekly' },             // 写作页面
    { path: '/sitemap-page', priority: '0.5', changefreq: 'monthly' },     // 站点地图
  ]

  // 获取博客文章ID
  const blogIds = await getBlogPostIds()

  // 构建XML sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // 添加根页面（无语言前缀，默认英文）
  const rootPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/values`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/trade-calculator`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/gear`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/write`, priority: '0.7', changefreq: 'weekly' },
    { url: `${baseUrl}/admin`, priority: '0.3', changefreq: 'monthly' },
    { url: `${baseUrl}/sitemap-page`, priority: '0.5', changefreq: 'monthly' },
  ]

  rootPages.forEach(page => {
    xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  // 添加多语言页面
  languages.forEach(lang => {
    pageRoutes.forEach(route => {
      xml += `  <url>
    <loc>${baseUrl}/${lang}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
    })
  })

  // 添加多语言博客详情页
  languages.forEach(lang => {
    blogIds.forEach(id => {
      xml += `  <url>
    <loc>${baseUrl}/${lang}/blog/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
    })
  })

  // 添加Wiki页面
  const wikiSlugs = ['rare-mutations-guide']
  wikiSlugs.forEach(slug => {
    xml += `  <url>
    <loc>${baseUrl}/wiki/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
    xml += `  <url>
    <loc>${baseUrl}/wiki-detail/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })

  // 添加静态博客页面
  const staticBlogSlugs = ['garden-calculator-guide', 'welcome-to-garden']
  staticBlogSlugs.forEach(slug => {
    xml += `  <url>
    <loc>${baseUrl}/blog-detail/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })

  // 添加多语言管理员页面
  languages.forEach(lang => {
    xml += `  <url>
    <loc>${baseUrl}/${lang}/admin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
`
  })

  xml += `</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400', // 缓存1小时，过期后1天内可以使用
    },
  })
}