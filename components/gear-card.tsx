'use client';

import { Gear } from "@/lib/data/gear-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

interface GearCardProps {
  gear: Gear;
}

const tierColors = {
  'common': 'bg-gray-200 text-gray-700',
  'uncommon': 'bg-green-200 text-green-700',
  'rare': 'bg-blue-200 text-blue-700',
  'legendary': 'bg-purple-200 text-purple-700',
  'mythical': 'bg-yellow-200 text-yellow-700',
  'divine': 'bg-pink-200 text-pink-700',
  '-': 'bg-gray-100 text-gray-600'
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  maxWidth?: string;
}

function Tooltip({ content, children, maxWidth = "280px" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const { t } = useI18n();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && isVisible) {
      // 检查内容是否真的被截断
      const element = contentRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2; // 2行的最大高度
      
      // 临时移除line-clamp来测量真实高度
      element.style.webkitLineClamp = 'unset';
      element.style.display = '-webkit-box';
      
      const actualHeight = element.scrollHeight;
      
      // 恢复line-clamp
      if (!isExpanded) {
        element.style.webkitLineClamp = '2';
      }
      
      // 只有当实际高度超过2行时才需要展开功能
      setNeedsExpansion(actualHeight > maxHeight);
    }
  }, [content, isVisible, isExpanded]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
    if (!isVisible) {
      setIsExpanded(false);
    }
  };

  const toggleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      
      {isVisible && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsVisible(false)}
          />
          <div 
            className="absolute z-50 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-xl p-4 transform transition-all duration-200 ease-out opacity-100 scale-100"
            style={{ 
              width: maxWidth,
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "12px"
            }}
          >
            <div 
              ref={contentRef}
              className={cn(
                "text-sm leading-5 -webkit-box -webkit-box-orient-vertical overflow-hidden",
                !isExpanded && "line-clamp-2"
              )}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {content}
            </div>
            
            {needsExpansion && (
              <button
                onClick={toggleExpansion}
                className="text-blue-500 hover:text-blue-600 text-xs mt-3 font-medium transition-colors duration-200 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {t('common.collapse')}
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {t('common.expand')}
                  </>
                )}
              </button>
            )}
            
            {/* 白色背景的箭头 */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 shadow-lg"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function GearCard({ gear }: GearCardProps) {
  const { t } = useI18n();
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 h-[380px] flex flex-col">
      {/* 图片区域 - 固定高度80px */}
      <div className="h-20 mb-3 flex justify-center items-center">
        <div className="relative w-20 h-20">
          <Image
            src={gear.imageUrl}
            alt={`grow a garden ${gear.name}`}
            fill
            className="object-contain"
            sizes="80px"
            priority={false}
          />
        </div>
      </div>
      
      {/* 标题区域 - 固定高度48px */}
      <Tooltip content={t(`gear.names.${gear.id}`)} maxWidth="280px">
        <div className="h-12 mb-2 flex items-center justify-center">
          <div className="text-base font-semibold text-pink-600 text-center line-clamp-2 leading-6">
                          {t(`gear.names.${gear.id}`)}
            </div>
        </div>
      </Tooltip>
      
      {/* 品质标签 - 固定高度32px */}
      <div className={cn(
        "h-8 mb-3 text-sm font-medium px-2 py-1 rounded-full text-center flex items-center justify-center",
        tierColors[gear.tier]
      )}>
        {gear.tier === '-' ? t('gearPage.tiers.special') : t(`gearPage.tiers.${gear.tier}`)}
      </div>
      
      {/* 描述区域 - 固定高度40px (2行文字) */}
      <Tooltip content={t(`gear.descriptions.${gear.id}`)} maxWidth="280px">
        <div className="h-[40px] mb-3 text-sm text-gray-600 overflow-hidden">
          <p className="line-clamp-2 leading-5">{t(`gear.descriptions.${gear.id}`)}</p>
        </div>
      </Tooltip>
      
      {/* 价格区域 - 固定高度76px (最多3行价格) */}
      <div className="h-[76px] mb-3 flex flex-col justify-start">
        {Object.keys(gear.price).length > 0 ? (
          <div className="space-y-1 text-sm">
            {gear.price.sheckle && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('gearPage.price.sheckle')}:</span>
                <span className="font-medium text-pink-600">{gear.price.sheckle.toLocaleString()}</span>
              </div>
            )}
            {gear.price.robux && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('gearPage.price.robux')}:</span>
                <span className="font-medium text-pink-600">{gear.price.robux}</span>
              </div>
            )}
            {gear.price.lunarPoint && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('gearPage.price.lunarPoint')}:</span>
                <span className="font-medium text-pink-600">{gear.price.lunarPoint}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400 text-center">
            {t('gearPage.noPrice')}
          </div>
        )}
      </div>
      
      {/* 获得状态标签 - 固定在底部，固定高度32px */}
      <div className={cn(
        "h-8 text-sm font-medium px-2 py-1 rounded-full text-center flex items-center justify-center",
        gear.obtainable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}>
        {gear.obtainable ? t('gearPage.obtainable') : t('gearPage.unobtainable')}
      </div>
    </div>
  );
} 