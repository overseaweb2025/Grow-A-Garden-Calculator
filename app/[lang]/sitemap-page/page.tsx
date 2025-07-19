'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

type Language = 'zh' | 'en' | 'fr' | 'fil' | 'ru' | 'es' | 'vi' | 'hi';

const supportedLanguages: Language[] = ['zh', 'en', 'fr', 'fil', 'ru', 'es', 'vi', 'hi'];

export default function SitemapPage({ params }: { params: { lang: string } }) {
  const { t, setLanguage } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const lang = params.lang as Language;
  
  // 设置语言基于URL参数
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);
  
  const baseUrl = 'https://growagardenvalue.org';
  
  // 支持的语言
  const languages = [
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];
  
  // 页面路由（使用翻译）
  const pageRoutes = [
    { path: '', key: 'nav.home', icon: '🏠' },
    { path: '/values', key: 'nav.values', icon: '💎' },
    { path: '/trade-calculator', key: 'nav.tradeCalculator', icon: '🔄' },
    { path: '/gear', key: 'nav.gear', icon: '⚙️' },
    { path: '/blog', key: 'nav.blog', icon: '📝' },
    { path: '/write', key: 'nav.write', icon: '✍️' },
  ];
  
  // 根页面（无语言前缀）
  const rootPages = pageRoutes.map(route => ({
    url: route.path || '/',
    name: route.key === 'nav.home' ? 'Home' : 
          route.key === 'nav.values' ? 'Values' :
          route.key === 'nav.tradeCalculator' ? 'Trade Calculator' :
          route.key === 'nav.gear' ? 'Gear' :
          route.key === 'nav.blog' ? 'Blog' :
          route.key === 'nav.write' ? 'Write' : route.key,
    icon: route.icon,
    language: 'Default (English)',
  }));
  
  // 生成多语言页面
  const multiLanguagePages = languages.flatMap(language => 
    pageRoutes.map(route => ({
      url: `/${language.code}${route.path}`,
      name: t(route.key),
      icon: route.icon,
      language: language.name,
      languageCode: language.code,
      flag: language.flag,
    }))
  );
  
  // 过滤页面
  const filteredPages = selectedLanguage === 'all' 
    ? [...rootPages, ...multiLanguagePages]
    : selectedLanguage === 'root'
    ? rootPages
    : multiLanguagePages.filter(page => page.languageCode === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-6 py-12">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-700 mb-4">
            🗺️ {t('sitemap.title', '网站地图')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('sitemap.description', '探索我们网站的所有页面，支持8种语言版本')}
          </p>
        </div>

        {/* 语言过滤器 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">
              🌐 {t('sitemap.filterByLanguage', '按语言筛选')}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLanguage === 'all'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                🌍 {t('sitemap.allPages', '所有页面')}
              </button>
              <button
                onClick={() => setSelectedLanguage('root')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLanguage === 'root'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                🏠 {t('sitemap.defaultPages', '默认页面')}
              </button>
              {languages.map(language => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedLanguage === language.code
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                  }`}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 页面列表 */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-100 to-pink-50 px-6 py-4 border-b border-pink-200">
            <h2 className="text-xl font-semibold text-pink-700">
              📋 {t('sitemap.pageList', '页面列表')} ({filteredPages.length} {t('sitemap.pages', '个页面')})
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPages.map((page, index) => (
                <Link
                  key={`${page.url}-${index}`}
                  href={page.url}
                  className="group block p-4 rounded-xl border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-pink-50/30"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {page.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-700 transition-colors">
                        {page.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {baseUrl}{page.url}
                      </p>
                      {page.language && (
                        <div className="flex items-center gap-1 mt-2">
                          {(page as any).flag && (
                            <span className="text-sm">{(page as any).flag}</span>
                          )}
                          <span className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                            {page.language}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-pink-400 group-hover:text-pink-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 技术信息 */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            🔧 {t('sitemap.technicalInfo', '技术信息')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-600 mb-2">XML Sitemap</h4>
              <p className="text-sm text-gray-500">
                {t('sitemap.searchEngineAccess', '搜索引擎可以访问')}：{' '}
                <Link 
                  href="/sitemap.xml" 
                  className="text-pink-600 hover:text-pink-700 underline"
                  target="_blank"
                >
                  {baseUrl}/sitemap.xml
                </Link>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-600 mb-2">{t('sitemap.supportedLanguages', '支持的语言')}</h4>
              <p className="text-sm text-gray-500">
                {languages.length} {t('sitemap.languagesCount', '种语言')}，{t('sitemap.totalPages', '总共')} {rootPages.length + multiLanguagePages.length} {t('sitemap.pages', '个页面')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}