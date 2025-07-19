'use client';

import { Inter } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n"
import { useI18n } from '@/lib/i18n';
import LanguageHtmlWrapper from '@/components/language-html-wrapper';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from "lucide-react"
import { NavLink } from '@/components/nav-link';
import { MobileNav } from '@/components/ui/mobile-nav'
import FloatingAssistant from '@/components/floating-assistant'
import { usePathname, useRouter } from 'next/navigation'
import Script from 'next/script';
import { useAuthStatus } from '@/hooks/use-auth';

const inter = Inter({ subsets: ["latin"] })

function Header({ toggleDrawer, isDrawerOpen }: { toggleDrawer: () => void; isDrawerOpen: boolean }) {
  const { t, language, setLanguage } = useI18n();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLanguageSwitcherOpen, setIsLanguageSwitcherOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 滚动监听 - 控制导航栏显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 如果滚动距离小于50px，始终显示导航栏
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else {
        // 向下滚动隐藏，向上滚动显示
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsNavVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 防止侧边栏打开时背景滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // ESC键关闭侧边栏、语言切换器和更多菜单
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isLanguageSwitcherOpen) {
          setIsLanguageSwitcherOpen(false);
        } else if (isMoreMenuOpen) {
          setIsMoreMenuOpen(false);
        } else if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMenuOpen, isLanguageSwitcherOpen, isMoreMenuOpen]);

  const toggleLanguageSwitcher = () => {
    setIsLanguageSwitcherOpen(!isLanguageSwitcherOpen);
  };

  const languageOptions = [
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === language) || languageOptions[0];

  const handleLanguageChange = (langCode: string) => {
    const switchLanguagePath = (newLang: string) => {
      let currentPath = pathname;
      const langPrefixRegex = /^\/[a-z]{2,3}(\/|$)/;
      if (langPrefixRegex.test(currentPath)) {
        currentPath = currentPath.replace(/^\/[a-z]{2,3}/, '');
      }
      if (!currentPath || currentPath === '') {
        currentPath = '/';
      }
      if (newLang === 'en') {
        // 英语时不加前缀
        return currentPath === '' ? '/' : currentPath;
      }
      return `/${newLang}${currentPath === '/' ? '' : currentPath}`;
    };
    setLanguage(langCode as any);
    const newPath = switchLanguagePath(langCode);
    router.push(newPath);
    setIsLanguageSwitcherOpen(false);
  };

  return (
    <header>
      {/* 桌面端导航栏 */}
      <nav className={`hidden md:block fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isNavVisible ? 'translate-y-2 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-pink-200 via-pink-150 to-pink-200 shadow-lg rounded-full border border-pink-300/50 backdrop-blur-sm px-6 py-2 w-auto min-w-fit max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-6 whitespace-nowrap min-w-0">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🌱</span>
              </div>
              <div className="text-base font-bold text-pink-700 hidden lg:block">
                {t('common.siteTitleFull')}
              </div>
              <div className="text-sm font-bold text-pink-700 lg:hidden">
                {t('common.siteTitleShort')}
              </div>
            </div>

            {/* 桌面端导航链接 */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink min-w-0">
              <NavLink 
                href="/" 
                icon="🏠"
                label="nav.home"
                className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0"
              />
              <NavLink 
                href="/values"
                icon="💎"
                label="nav.values"
                className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0"
              />
              <NavLink 
                href="/trade-calculator"
                icon="🔄"
                label="nav.tradeCalculator"
                className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0 hidden 2xl:flex"
              />
              <NavLink 
                href="/blog"
                icon="📝"
                label="nav.blog"
                className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0"
              />
              <NavLink 
                href="/gear"
                icon="⚙️"
                label="nav.gear"
                className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0 hidden 2xl:flex"
              />
              {!isLoading && isAuthenticated && (
                <NavLink 
                  href="/write"
                  icon="✍️"
                  label="nav.write"
                  className="font-medium px-2 xl:px-3 py-1.5 flex items-center gap-1.5 text-xs xl:text-sm flex-shrink-0"
                />
              )}

              {/* 登录状态显示 */}
              {!isLoading && isAuthenticated && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full border border-pink-200 backdrop-blur-sm flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-medium text-pink-800">Admin</div>
                  </div>
                  <button 
                    onClick={() => {
                      // 使用导入的logout函数
                      localStorage.removeItem('garden_auth_token');
                      localStorage.removeItem('garden_auth_expiry');
                      window.location.href = '/admin';
                    }}
                    className="text-pink-700 hover:text-red-600 text-xs p-1 hover:bg-pink-100 rounded-full transition-colors"
                    title="登出"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* 语言切换器 */}
              <div className="relative language-switcher-container flex-shrink-0">
                <button 
                  className="text-pink-700 hover:text-pink-600 font-medium px-2 xl:px-3 py-1.5 rounded-full hover:bg-pink-100 transition-all flex items-center gap-1.5 text-xs xl:text-sm whitespace-nowrap"
                  onClick={() => {
                    if (isMobile) {
                      toggleLanguageSwitcher();
                    } else {
                      setIsLanguageSwitcherOpen(!isLanguageSwitcherOpen);
                    }
                  }}
                >
                  <span className="text-sm">{currentLanguage.flag}</span>
                  <span className="hidden md:inline lg:inline xl:inline 2xl:inline">
                    <span className="2xl:hidden">
                      {currentLanguage.name.length > 8 ? currentLanguage.name.slice(0, 6) + '...' : currentLanguage.name}
                    </span>
                    <span className="hidden 2xl:inline">
                      {currentLanguage.name}
                    </span>
                  </span>
                  <span className="md:hidden">
                    {currentLanguage.code.toUpperCase()}
                  </span>
                </button>
                {/* PC端下拉菜单 */}
                {isLanguageSwitcherOpen && !isMobile && (
                  <>
                    {/* 透明遮罩层用于点击外部关闭 */}
                    <div 
                      className="fixed inset-0 z-[9998]"
                      onClick={() => setIsLanguageSwitcherOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-auto min-w-[12rem] bg-white/95 backdrop-blur-sm border border-pink-200 rounded-xl shadow-lg p-2 z-[9999]">
                      <div className="flex flex-col space-y-1">
                        {languageOptions.map((lang) => (
                          <button 
                            key={lang.code}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 whitespace-nowrap ${
                              language === lang.code 
                                ? 'bg-pink-100 text-pink-700' 
                                : 'hover:bg-pink-50 text-pink-800 hover:text-pink-700'
                            }`}
                            onClick={() => handleLanguageChange(lang.code)}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 更多菜单按钮 (仅在隐藏项目时显示) */}
              <div className="relative 2xl:hidden more-menu-container">
                <button 
                  className="text-pink-700 hover:text-pink-600 font-medium px-2 py-1.5 rounded-full hover:bg-pink-100 transition-all flex items-center gap-1.5 text-xs"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                >
                  <span>⋯</span>
                </button>
                {/* 更多菜单下拉 */}
                {isMoreMenuOpen && (
                  <>
                    {/* 透明遮罩层用于点击外部关闭 */}
                    <div 
                      className="fixed inset-0 z-[9998]"
                      onClick={() => setIsMoreMenuOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-auto min-w-[10rem] bg-white/95 backdrop-blur-sm border border-pink-200 rounded-xl shadow-lg p-2 z-[9999]">
                      <div className="space-y-1">
                        <div className="2xl:hidden">
                          <NavLink 
                            href="/trade-calculator"
                            icon="🔄"
                            label="nav.tradeCalculator"
                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 whitespace-nowrap"
                            onClick={() => setIsMoreMenuOpen(false)}
                          />
                        </div>
                        <div className="2xl:hidden">
                          <NavLink 
                            href="/gear"
                            icon="⚙️"
                            label="nav.gear"
                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 whitespace-nowrap"
                            onClick={() => setIsMoreMenuOpen(false)}
                          />
                        </div>
                        {!isLoading && isAuthenticated && (
                          <div>
                            <NavLink 
                              href="/write"
                              icon="✍️"
                              label="nav.write"
                              className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 whitespace-nowrap"
                              onClick={() => setIsMoreMenuOpen(false)}
                            />
                          </div>
                        )}

                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>



            {/* 移动端侧边栏遮罩层 */}
      <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* 移动端侧边栏 */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-pink-50 via-white to-pink-100 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-pink-200`}>
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">🌱</span>
            </div>
            <div>
              <div className="text-lg font-bold text-pink-700">
                {t('common.title')}
              </div>
              <p className="text-sm text-pink-600">{t('common.subtitle')}</p>
              {!isLoading && isAuthenticated && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-pink-700 font-medium">已登录</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && isAuthenticated && (
              <button
                onClick={() => {
                  localStorage.removeItem('garden_auth_token');
                  localStorage.removeItem('garden_auth_expiry');
                  window.location.href = '/admin';
                }}
                className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                title="登出"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-pink-200 transition-colors"
            >
              <X className="w-5 h-5 text-pink-700" />
            </button>
          </div>
        </div>

        {/* 侧边栏导航链接 */}
        <div className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pb-20">
          <NavLink 
            href="/" 
            icon="🏠"
            label="nav.home"
            className="flex items-center gap-3 font-medium py-3 px-6"
            onClick={() => setIsMenuOpen(false)}
          />
          <NavLink 
            href="/values"
            icon="💎"
            label="nav.values"
            className="flex items-center gap-3 font-medium py-3 px-6"
            onClick={() => setIsMenuOpen(false)}
          />
          <NavLink 
            href="/trade-calculator"
            icon="🔄"
            label="nav.tradeCalculator"
            className="flex items-center gap-3 font-medium py-3 px-6"
            onClick={() => setIsMenuOpen(false)}
          />
          <NavLink 
            href="/blog"
            icon="📝"
            label="nav.blog"
            className="flex items-center gap-3 font-medium py-3 px-6"
            onClick={() => setIsMenuOpen(false)}
          />
          <NavLink 
            href="/gear"
            icon="⚙️"
            label="nav.gear"
            className="flex items-center gap-3 font-medium py-3 px-6"
            onClick={() => setIsMenuOpen(false)}
          />
          {!isLoading && isAuthenticated && (
            <NavLink 
              href="/write"
              icon="✍️"
              label="nav.write"
              className="flex items-center gap-3 font-medium py-3 px-6"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          
          {/* 语言切换器 */}
          <div className="language-switcher-container">
            <button 
              className="flex items-center gap-3 text-pink-700 hover:text-pink-600 hover:bg-pink-200 font-medium py-3 px-6 rounded-full transition-all w-full text-left"
              onClick={() => {
                // 移动端侧边栏中的语言选择器应该打开模态框
                setIsLanguageSwitcherOpen(!isLanguageSwitcherOpen);
              }}
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
              <span className="ml-auto text-pink-500 text-sm">
                {isLanguageSwitcherOpen ? '✕' : '⚙️'}
              </span>
            </button>
          </div>
        </div>

        {/* 侧边栏底部装饰 */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center text-pink-600 text-sm">
            <p className="mb-2">{t('common.sidebarSlogan')}</p>
            <p className="text-xs opacity-70">{t('common.copyright')}</p>
          </div>
        </div>
      </div>

      {/* 移动端语言选择模态框 */}
      {isLanguageSwitcherOpen && (isMobile || isMenuOpen) && (
        <>
          {/* 模态框遮罩 */}
          <div 
            className="fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300"
            onClick={() => setIsLanguageSwitcherOpen(false)}
          />
          
          {/* 语言选择卡片 */}
          <div className="language-switcher-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-80 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-200 overflow-hidden animate-in zoom-in-90 duration-300">
            {/* 模态框头部 */}
            <div className="bg-gradient-to-r from-pink-100 to-pink-50 px-6 py-4 border-b border-pink-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  <div className="text-lg font-bold text-pink-800">{t('common.languageSelector.title') || '选择语言'}</div>
                </div>
                <button
                  onClick={() => setIsLanguageSwitcherOpen(false)}
                  className="w-8 h-8 rounded-full bg-pink-200 hover:bg-pink-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-pink-700" />
                </button>
              </div>
            </div>
            
            {/* 语言选项网格 */}
            <div className="p-6 max-h-80 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {languageOptions.map((lang) => (
                  <button 
                    key={lang.code}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                      language === lang.code 
                        ? 'bg-gradient-to-r from-pink-200 to-pink-100 border-2 border-pink-300 shadow-md' 
                        : 'hover:bg-pink-50 border-2 border-transparent hover:border-pink-200'
                    }`}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      // 关闭侧边栏
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-pink-800">{lang.name}</div>
                      <div className="text-sm text-pink-600">{lang.code.toUpperCase()}</div>
                    </div>
                    {language === lang.code && (
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 移动端导航组件 */}
      <MobileNav />

    </header>
  );
}

function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 mb-8">
      <div className="container mx-auto px-6">
        {/* 主要内容区域 */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-8 relative overflow-hidden">
          {/* 简洁的背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-50 to-transparent rounded-full opacity-60"></div>
          
          <div className="relative z-10">
            {/* 顶部品牌区域 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Grow A Garden Calculator
                </h3>
              </div>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {t('common.footerDescription')}
              </p>
            </div>

            {/* 导航链接 */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              <NavLink 
                href="/" 
                icon="🏠"
                label="nav.home"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
              <NavLink 
                href="/values"
                icon="💎"
                label="nav.values"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
              <NavLink 
                href="/trade-calculator"
                icon="🔄"
                label="nav.tradeCalculator"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
              <NavLink 
                href="/blog"
                icon="📝"
                label="nav.blog"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
              <NavLink 
                href="/gear"
                icon="⚙️"
                label="nav.gear"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
              <NavLink 
                href="/write"
                icon="✍️"
                label="nav.write"
                variant="footer"
                className="flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-all duration-200 group"
              />
            </div>

            {/* 分隔线 */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent mb-6"></div>

            {/* 底部信息 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="text-pink-500">💖</span>
                  <span>{t('common.copyright')}</span>
                </span>
                <NavLink 
                  href="/sitemap-page"
                  icon="🗺️"
                  label="common.sitemap"
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                />
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="text-pink-500">🌸</span>
                  <span>Made with love</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-pink-500">✨</span>
                  <span>v2025</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

 return (
  <html lang="en">
    <head>
      {/* GTM脚本 - 使用Next.js Script组件优化加载 */}
      <Script
        id="gtm-script"
        strategy="afterInteractive" // 确保在客户端交互后加载，不阻塞首屏
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NPWJG9C5');
          `
        }}
      />
      
      {/* 其他元标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <link rel="icon" href="/logo/logo.jpg" />
    </head>
    <body className={inter.className}>
      {/* GTM noscript标签 - 用于不支持JavaScript的环境 */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-5R5VCHD5"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      <I18nProvider>
        <LanguageHtmlWrapper>
          <Header toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
          <div className="md:pt-14">
            {children}
          </div>
          <Footer />
          <FloatingAssistant />
        </LanguageHtmlWrapper>
      </I18nProvider>
    </body>
  </html>
);
}