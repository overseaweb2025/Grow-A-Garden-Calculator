'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './locales/en';
import zhTranslations from './locales/zh';
import filTranslations from './locales/fil';
import frTranslations from './locales/fr';
import ruTranslations from './locales/ru';
import esTranslations from './locales/es';
import viTranslations from './locales/vi';
import hiTranslations from './locales/hi';

// 定义支持的语言
export const supportedLanguages = ['en', 'zh', 'fil', 'fr', 'ru', 'es', 'vi', 'hi'] as const;
export type Language = (typeof supportedLanguages)[number];

// 定义i18n上下文类型
type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// 翻译资源
const translations = {
  en: enTranslations,
  zh: zhTranslations,
  fil: filTranslations,
  fr: frTranslations,
  ru: ruTranslations,
  es: esTranslations,
  vi: viTranslations,
  hi: hiTranslations,
};

// 创建i18n上下文
const I18nContext = createContext<I18nContextType | null>(null);

// 本地存储键名
const LANGUAGE_KEY = 'lang';

// i18n提供者组件
export function I18nProvider({ children }: { children: React.ReactNode }) {
  // 初始化语言为英语，稍后会从存储中加载
  const [language, setLanguageState] = useState<Language>('en');

  // 设置语言并保存到本地存储
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  };

  // 从本地存储加载语言
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (savedLang && supportedLanguages.includes(savedLang)) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  // 翻译函数
  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return getNestedValue(currentTranslations, key) || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用i18n的自定义钩子
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === null) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 获取嵌套对象值的辅助函数
function getNestedValue(obj: Record<string, any>, path: string | undefined): string {
  if (!obj || !path) {
    return '';
  }
  
  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return '';
    }
    result = result[key];
  }

  return typeof result === 'string' ? result : '';
} 