'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from "@/lib/i18n/client";
import { Menu, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/nav-link";
import { motion } from "framer-motion";
import { useAuthStatus } from '@/hooks/use-auth';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'language'>('main');
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useI18n();
  const { isAuthenticated, isLoading } = useAuthStatus();

  // 检查是否为移动端
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 当路由改变时关闭抽屉并重置页面
  useEffect(() => {
    setIsOpen(false);
    setCurrentPage('main');
  }, [pathname]);

  // 语言路径切换函数
  const handleLanguageChange = (langCode: string) => {
    
    // 实现路径切换逻辑
    const switchLanguagePath = (newLang: string) => {
      // 获取当前路径，移除语言前缀（如果存在）
      let currentPath = pathname;
      
      // 检查当前路径是否以语言代码开头
      const langPrefixRegex = /^\/[a-z]{2,3}(\/|$)/;
      if (langPrefixRegex.test(currentPath)) {
        // 移除现有的语言前缀
        currentPath = currentPath.replace(/^\/[a-z]{2,3}/, '');
      }
      
      // 如果路径为空，设置为根路径
      if (!currentPath || currentPath === '') {
        currentPath = '/';
      }
      
      // 构建新的路径
      if (newLang === 'en') {
        // 英语时不加前缀
        return currentPath === '' ? '/' : currentPath;
      }
      const newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
      
      return newPath;
    };
    
    // 更新语言设置
    setLanguage(langCode as any);
    
    // 导航到新的语言路径
    const newPath = switchLanguagePath(langCode);
    router.push(newPath);
    
    // 关闭语言选择页面并返回主页面
    setCurrentPage('main');
    // 可选：关闭整个抽屉
    setIsOpen(false);
  };

  const navItems = [
    { href: "/", label: "nav.home", icon: "🏠" },
    { href: "/values", label: "nav.values", icon: "💎" },
    { href: "/trade-calculator", label: "nav.tradeCalculator", icon: "🔄" },
    { href: "/blog", label: "nav.blog", icon: "📝" },
    { href: "/write", label: "nav.write", icon: "✍️" },
    { href: "/gear", label: "nav.gear", icon: "⚙️" },
  ];

  // 确保只在客户端渲染时显示
  if (!mounted) {
    return null;
  }

  // 更精确的路径匹配逻辑
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };


  return (
    <>
      {isMobile ? (
        <>
          {/* 可拖拽的悬浮球 */}
          <motion.div
            drag
            dragConstraints={{
              left: 0,
              right: window.innerWidth - 48,
              top: 0,
              bottom: window.innerHeight - 48
            }}
            dragElastic={0}
            whileDrag={{ scale: 1.1, zIndex: 1000 }}
            initial={{ x: 20, y: 80 }}
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={() => {
              // 延迟重置拖拽状态，避免立即触发点击
              setTimeout(() => setIsDragging(false), 100);
            }}
            className="fixed z-50 w-12 h-12 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                // 如果刚刚拖拽过，则不触发点击
                if (isDragging) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setIsOpen(true);
              }}
              className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-pink-200 transition-all duration-200 flex items-center justify-center"
            >
              <motion.div
                animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-3 h-0.5 bg-pink-700 rounded-full mb-0.5" />
                <div className="w-3 h-0.5 bg-pink-700 rounded-full mb-0.5" />
                <div className="w-3 h-0.5 bg-pink-700 rounded-full" />
              </motion.div>
            </motion.button>
          </motion.div>
        </>
      ) : null}

      {/* 背景遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 侧边抽屉 */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 200 
        }}
        className="fixed top-0 left-0 bottom-0 w-auto min-w-[280px] max-w-[320px] bg-white z-50 shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {currentPage === 'main' ? (
            <>
              {/* 主页面头部 */}
              <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-pink-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🌱</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-pink-600 truncate">{t('common.siteTitleShort')}</div>
                    {!isLoading && isAuthenticated && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-1.5 w-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-xs text-pink-700 font-medium">Admin</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isLoading && isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        localStorage.removeItem('garden_auth_token');
                        localStorage.removeItem('garden_auth_expiry');
                        window.location.href = '/admin';
                      }}
                      className="text-red-600 hover:text-red-700 flex-shrink-0 transition-colors p-1 rounded-full hover:bg-red-100"
                      title="登出"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors p-1 rounded-full hover:bg-pink-100"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* 导航链接 */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.filter(item => item.href !== '/write' || (!isLoading && isAuthenticated)).map((item, index) => {
                    const isActive = isActiveLink(item.href);
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: isOpen ? 1 : 0, 
                          x: isOpen ? 0 : -20 
                        }}
                        transition={{ 
                          delay: isOpen ? index * 0.05 : 0,
                          duration: 0.2 
                        }}
                      >
                        <NavLink
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative w-full",
                            isActive
                              ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg"
                              : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl"
                          )}
                          forceRootPath={pathname === '/'}
                          onClick={() => setIsOpen(false)}
                        />
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* 语言切换器 */}
              <div className="p-3 border-t border-pink-100 bg-pink-50/50">
                <button
                  onClick={() => {
                    setCurrentPage('language');
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-200 group"
                >
                  <span className="text-base">🌐</span>
                  <span className="font-medium text-pink-700 text-sm">{t('common.language')}</span>
                  <div className="flex-1"></div>
                  <span className="text-xs text-pink-600">
                    {language === 'zh' && 'CN'}
                    {language === 'en' && 'EN'}
                    {language === 'fr' && 'FR'}
                    {language === 'fil' && 'FIL'}
                    {language === 'ru' && 'RU'}
                    {language === 'es' && 'ES'}
                    {language === 'vi' && 'VI'}
                    {language === 'hi' && 'HI'}
                  </span>
                  <span className="text-pink-500 group-hover:text-pink-600 transition-colors text-sm">›</span>
                </button>
              </div>

              {/* 底部信息 */}
              <div className="p-3 border-t border-pink-100">
                <div className="text-xs text-gray-500 text-center">
                  {t('common.copyright')}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 语言选择页面头部 */}
              <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-100 to-pink-50">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentPage('main');
                    }}
                    className="text-pink-700 hover:text-pink-600 p-2 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <span className="text-lg">🌐</span>
                  <div className="text-base font-bold text-pink-800">{t('common.language')}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors p-1 rounded-full hover:bg-pink-100"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* 语言选项列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {[
                    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'fr', name: 'Français', flag: '🇫🇷' },
                    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
                    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
                    { code: 'es', name: 'Español', flag: '🇪🇸' },
                    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
                    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
                  ].map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 transition-all duration-200",
                        language === lang.code
                          ? "bg-pink-100 text-pink-700 font-medium rounded-full"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl"
                      )}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                      }}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{lang.name}</div>
                        <div className="text-xs opacity-70">{lang.code.toUpperCase()}</div>
                      </div>
                      {language === lang.code && (
                        <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>


    </>
  );
} 