import fs from 'fs'
import path from 'path'
import { globby } from 'globby'
import prettier from 'prettier'

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc')
  
  // 从 pages 目录获取所有页面路由
  const pages = await globby([
    'app/**/*.tsx',
    '!app/**/*.test.tsx',
    '!app/**/_*.tsx',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
    '!app/**/not-found.tsx',
    '!app/api/**',
  ])

  const baseUrl = 'https://garden-calculator.com'

  // 转换文件路径为URL路径
  const urlPaths = pages
    .map((page: string) => {
      // 移除 'app' 前缀和文件扩展名
      const path = page
        .replace('app', '')
        .replace('/page.tsx', '')
        .replace('.tsx', '')
      
      // 如果是首页，返回根路径
      if (path === '') return '/'
      
      return path
    })
    .filter((path): path is string => Boolean(path))

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlPaths
        .map((path: string) => {
          return `
            <url>
              <loc>${baseUrl}${path}</loc>
              <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
              <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
              <priority>${path === '/' ? '1.0' : '0.8'}</priority>
            </url>
          `
        })
        .join('')}
    </urlset>
  `

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), formatted)
  console.log('Sitemap generated successfully!')
}

generate() 