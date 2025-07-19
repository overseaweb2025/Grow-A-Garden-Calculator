'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// 动态导入 MdCatalog 组件以避免服务端渲染问题
const MdCatalog = dynamic(
  () => import('md-editor-rt').then((mod) => mod.MdCatalog), 
  { ssr: false }
);

// 导入预览样式
import 'md-editor-rt/lib/preview.css';

interface FloatingAssistantProps {
  editorId?: string;
  scrollElement?: HTMLElement | string;
}

export default function FloatingAssistant({ 
  editorId = 'blog-detail-preview',
  scrollElement = 'html'
}: FloatingAssistantProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const assistantRef = useRef<HTMLDivElement>(null);

  // 确保在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 检查是否应该显示助手（在 blog-detail 页面显示）
  useEffect(() => {
    const shouldShow = pathname.includes('/blog-detail/');
    setIsVisible(shouldShow);
  }, [pathname]);

  // 生成小星星特效
  useEffect(() => {
    if (isHovered) {
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 60 - 30,
        y: Math.random() * 60 - 30,
        delay: Math.random() * 0.5
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [isHovered]);

  // ESC键关闭抽屉
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isDrawerOpen]);

  // 防止抽屉打开时背景滚动
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isVisible || !isClient) return null;

  return (
    <>
      {/* 浮动助手 - 小清新设计 */}
      <div
        ref={assistantRef}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] cursor-pointer select-none group"
        onClick={() => setIsDrawerOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 主要按钮 */}
        <div 
          className={`relative bg-gradient-to-br from-pink-100 via-white to-pink-50 rounded-2xl p-4 shadow-lg border-2 border-pink-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${
            isHovered ? 'shadow-pink-200/50' : ''
          }`}
          style={{
            animation: 'gentle-float 4s ease-in-out infinite'
          }}
        >
          {/* 图标 */}
          <div className="relative">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            
            {/* 小装饰点 */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full animate-pulse" />
          </div>

          {/* 星星特效 */}
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
              style={{
                left: `50%`,
                top: `50%`,
                transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* 提示气泡 */}
        {isHovered && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-pink-200 whitespace-nowrap text-sm font-medium text-pink-700 animate-in slide-in-from-right-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-pink-500">📋</span>
              {t('floatingAssistant.open')}
            </div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        )}

        {/* 装饰性背景光晕 */}
        <div className={`absolute inset-0 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-2xl blur-xl transition-opacity duration-300 -z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* 抽屉遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* 右侧抽屉 - 小清新设计 */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-pink-50 to-purple-50 shadow-2xl z-[95] transform transition-transform duration-300 ease-in-out border-l border-pink-100 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 抽屉头部 */}
        <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-pink-700 flex items-center gap-2">
                {t('floatingAssistant.title')}
                <span className="text-pink-400">✨</span>
              </div>
              <p className="text-sm text-pink-600">{t('floatingAssistant.outline')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl hover:bg-pink-100 transition-all duration-200 group hover:scale-105"
            aria-label={t('floatingAssistant.close')}
          >
            <svg className="w-5 h-5 text-pink-600 group-hover:text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 抽屉内容 - 大纲 */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="prose prose-pink prose-sm max-w-none">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-pink-700 mb-3 flex items-center gap-2">
                <span className="text-pink-400">📖</span>
                {t('floatingAssistant.clickToScroll')}
              </h3>
            </div>
            <MdCatalog
              editorId={editorId}
              scrollElement={scrollElement}
              theme="light"
              offsetTop={80}
              className="md-catalog-fresh"
            />
          </div>
        </div>

        {/* 装饰性底部 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-pink-50/50 to-transparent pointer-events-none" />
      </div>

      {/* 自定义样式 */}
      <style jsx global>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(0.5deg); }
          50% { transform: translateY(-1px) rotate(0deg); }
          75% { transform: translateY(-2px) rotate(-0.5deg); }
        }
        
        .md-catalog-fresh {
          font-family: inherit;
        }
        
        .md-catalog-fresh .md-catalog-link {
          color: #be185d !important;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: block;
          margin: 6px 0;
          border-left: 4px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .md-catalog-fresh .md-catalog-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(147, 51, 234, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }
        
        .md-catalog-fresh .md-catalog-link:hover::before {
          opacity: 1;
        }
        
        .md-catalog-fresh .md-catalog-link:hover {
          color: #be185d !important;
          border-left-color: #ec4899;
          transform: translateX(6px);
          background: rgba(252, 231, 243, 0.8);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
        }
        
        .md-catalog-fresh .md-catalog-link.active {
          background: linear-gradient(135deg, rgba(251, 207, 232, 0.8), rgba(196, 181, 253, 0.6)) !important;
          border-left-color: #be185d;
          font-weight: 600;
          color: #be185d !important;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
        }
        
        .md-catalog-fresh .md-catalog-wrapper {
          padding: 0;
        }
        
        .md-catalog-fresh .md-catalog-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .md-catalog-fresh .md-catalog-list li {
          margin: 0;
        }
      `}</style>
    </>
  );
} 