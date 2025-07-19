"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export interface NavLinkProps {
  href: string
  icon?: string | React.ReactNode
  label: string
  className?: string
  onClick?: () => void
  variant?: 'default' | 'footer'
  forceRootPath?: boolean // 新增参数，强制根路径
}

export function NavLink({ href, icon, label, className, onClick, variant = 'default', forceRootPath = false }: NavLinkProps) {
  const pathname = usePathname()
  const { t, language } = useI18n()
  
  // 判断当前是否为根目录形式（无多语言前缀）
  const isRootPath = !/^\/[a-z]{2,3}(\/|$)/.test(pathname);

  // 构建链接
  const multilingualHref = isRootPath ? href : (href === '/' ? `/${language}` : `/${language}${href}`)
  
  // 更精确的路径匹配逻辑 - 考虑多语言路径
  const isActive = (() => {
    if (href === '/') {
      return pathname === `/${language}` || pathname === '/';
    }
    const expectedPath = isRootPath ? href : `/${language}${href}`;
    return pathname === expectedPath || pathname.startsWith(expectedPath + '/');
  })()

  // Footer变体的样式
  if (variant === 'footer') {
    return (
      <Link
        href={multilingualHref}
        onClick={onClick}
        className={cn(
          "group relative transition-all duration-300 text-center",
          isActive
            ? "text-pink-600"
            : "text-pink-500 hover:text-pink-600",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {typeof icon === 'string' ? (
            <span className={cn(
              "text-lg sm:text-xl mb-1 transition-transform duration-300",
              isActive ? "scale-110" : "group-hover:scale-110"
            )}>{icon}</span>
          ) : (
            icon && <span className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 mb-1 transition-transform duration-300",
              isActive ? "scale-110" : "group-hover:scale-110"
            )}>{icon}</span>
          )}
          <span className={cn(
            "text-xs sm:text-sm font-medium leading-tight",
            "max-w-full overflow-hidden text-ellipsis line-clamp-2",
            "hyphens-auto break-words text-center",
            "min-w-0 flex-shrink",
            isActive ? "font-semibold" : ""
          )}>{t(label)}</span>
        </div>
      </Link>
    )
  }

  // 默认样式
  return (
    <Link
      href={multilingualHref}
      onClick={onClick}
      className={cn(
        "group relative transition-all duration-300 whitespace-nowrap rounded-full",
        isActive
          ? "text-white bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg font-medium"
          : "text-gray-600 hover:text-pink-600 hover:bg-pink-50",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        {typeof icon === 'string' ? (
          <span className={cn(
            "text-base flex-shrink-0 transition-transform duration-300",
            isActive ? "scale-105" : "group-hover:scale-105"
          )}>{icon}</span>
        ) : (
          icon && <span className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-300",
            isActive ? "scale-105" : "group-hover:scale-105"
          )}>{icon}</span>
        )}
        <span>{t(label)}</span>
      </span>
    </Link>
  )
}
