'use client';

import React, { useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

const getPageMetadata = (pathname: string, language: string) => {
  const isHome = pathname === '/';
  const isValues = pathname === '/values';
  const isTradeCalculator = pathname === '/trade-calculator';
  const isGear = pathname === '/gear';
  const isWiki = pathname.startsWith('/wiki');
  const isBlog = pathname.startsWith('/blog');


  const metadataByLanguage: Record<string, Record<string, any>> = {
    es: {
      home: {
        title: 'Calculadora de Jardín - Cultivos y Mutaciones',
        description: 'Mejor Calculadora de Jardín para Grow A Garden. Gratis.',
        keywords: 'Calculadora Jardín,Cultivos,Grow A Garden,Gratis'
      },
      values: {
        title: 'Guía Valores - Precios Cultivos y Análisis Mercado',
        description: 'Consulta valores cultivos y análisis precios variantes.',
        keywords: 'Valores Cultivos,Análisis Mercado,Variantes Raras'
      },
      'trade-calculator': {
        title: 'Calculadora Intercambio - Verificador Precios Justos',
        description: 'Calcula precios justos intercambio cultivos rápido.',
        keywords: 'Calculadora Intercambio,Comercio Cultivos,Precios'
      },
      gear: {
        title: 'Info Equipos - Guía Equipamiento Grow A Garden',
        description: 'Explora todos equipos disponibles con información.',
        keywords: 'Info Equipos,Equipamiento,Herramientas Jardín'
      },
      wiki: {
        title: 'Wiki Jardín - Guías y Consejos',
        description: 'Aprende consejos jardinería y trucos de cultivo.',
        keywords: 'Wiki Jardín,Guías,Consejos,Cultivo'
      },
      blog: {
        title: 'Blog Jardín - Noticias y Actualizaciones',
        description: 'Últimas noticias y consejos de jardinería.',
        keywords: 'Blog Jardín,Noticias,Actualizaciones,Consejos'
      }
    },
    en: {
      home: {
        title: 'Garden Calculator - Crop Values & Mutation Tools',
        description: 'Best Garden Calculator for Grow A Garden. Free tools.',
        keywords: 'Garden Calculator,Crop Calculator,Grow A Garden,Free'
      },
      values: {
        title: 'Value Guide - Crop Prices & Market Analysis',
        description: 'Check crop values and rare variant price analysis.',
        keywords: 'Crop Values,Market Analysis,Rare Variants,Guide'
      },
      'trade-calculator': {
        title: 'Trade Calculator - Fair Deal Price Checker',
        description: 'Calculate fair crop trade prices quickly.',
        keywords: 'Trade Calculator,Crop Trade,Price Check,Fair'
      },
      gear: {
        title: 'Gear Info - Grow A Garden Equipment Guide',
        description: 'Browse all available gears with information.',
        keywords: 'Gear Info,Equipment,Garden Tools,Game Items'
      },
      wiki: {
        title: 'Garden Wiki - Guides and Tips',
        description: 'Learn gardening tips and crop growing guides.',
        keywords: 'Garden Wiki,Guides,Tips,Growing'
      },
      blog: {
        title: 'Garden Blog - News and Updates',
        description: 'Latest gardening news and helpful tips.',
        keywords: 'Garden Blog,News,Updates,Tips'
      }
    },
    zh: {
      home: {
        title: '花园计算器 - 作物价值与变异工具',
        description: '最好的花园计算器，用于种植花园。免费工具。',
        keywords: '花园计算器,作物计算器,种植花园,免费'
      },
      values: {
        title: '价值指南 - 作物价格与市场分析',
        description: '查看作物价值和稀有变种价格分析。',
        keywords: '作物价值,市场分析,稀有变种,指南'
      },
      'trade-calculator': {
        title: '交易计算器 - 公平价格检查器',
        description: '快速计算公平的作物交易价格。',
        keywords: '交易计算器,作物交易,价格检查,公平'
      },
      gear: {
        title: '装备信息 - 种植花园装备指南',
        description: '浏览所有可用装备和详细信息。',
        keywords: '装备信息,设备,花园工具,游戏物品'
      },
      wiki: {
        title: '花园百科 - 指南和技巧',
        description: '学习园艺技巧和作物种植指南。',
        keywords: '花园百科,指南,技巧,种植'
      },
      blog: {
        title: '花园博客 - 新闻和更新',
        description: '最新的园艺新闻和实用技巧。',
        keywords: '花园博客,新闻,更新,技巧'
      }
    },
    fr: {
      home: {
        title: 'Calculateur Jardin - Valeurs Cultures & Mutations',
        description: 'Meilleur Calculateur Jardin pour Grow A Garden. Gratuit.',
        keywords: 'Calculateur Jardin,Cultures,Grow A Garden,Gratuit'
      },
      values: {
        title: 'Guide Valeurs - Prix Cultures & Analyse Marché',
        description: 'Consultez valeurs cultures et analyse prix variantes.',
        keywords: 'Valeurs Cultures,Analyse Marché,Variantes Rares'
      },
      'trade-calculator': {
        title: 'Calculateur Échange - Vérificateur Prix Équitables',
        description: 'Calculez prix équitables échange cultures rapidement.',
        keywords: 'Calculateur Échange,Commerce Cultures,Prix'
      },
      gear: {
        title: 'Info Équipements - Guide Équipement Grow A Garden',
        description: 'Explorez tous équipements disponibles avec infos.',
        keywords: 'Info Équipements,Équipement,Outils Jardin'
      },
      wiki: {
        title: 'Wiki Jardin - Guides et Conseils',
        description: 'Apprenez conseils jardinage et guides culture.',
        keywords: 'Wiki Jardin,Guides,Conseils,Culture'
      },
      blog: {
        title: 'Blog Jardin - Actualités et Mises à Jour',
        description: 'Dernières actualités jardinage et conseils utiles.',
        keywords: 'Blog Jardin,Actualités,Mises à Jour,Conseils'
      }
    },
    fil: {
      home: {
        title: 'Garden Calculator - Crop Values & Mutation Tools',
        description: 'Pinakamahusay na Garden Calculator para sa Grow A Garden.',
        keywords: 'Garden Calculator,Crop Calculator,Grow A Garden,Free'
      },
      values: {
        title: 'Value Guide - Crop Prices & Market Analysis',
        description: 'Tingnan ang crop values at rare variant price analysis.',
        keywords: 'Crop Values,Market Analysis,Rare Variants,Guide'
      },
      'trade-calculator': {
        title: 'Trade Calculator - Fair Deal Price Checker',
        description: 'Kalkulahin ang fair crop trade prices nang mabilis.',
        keywords: 'Trade Calculator,Crop Trade,Price Check,Fair'
      },
      gear: {
        title: 'Gear Info - Grow A Garden Equipment Guide',
        description: 'I-browse ang lahat ng available gears na may info.',
        keywords: 'Gear Info,Equipment,Garden Tools,Game Items'
      },
      wiki: {
        title: 'Garden Wiki - Guides at Tips',
        description: 'Matuto ng gardening tips at crop growing guides.',
        keywords: 'Garden Wiki,Guides,Tips,Growing'
      },
      blog: {
        title: 'Garden Blog - News at Updates',
        description: 'Pinakabagong gardening news at helpful tips.',
        keywords: 'Garden Blog,News,Updates,Tips'
      }
    },
    ru: {
      home: {
        title: 'Калькулятор Сада - Ценности Культур и Мутации',
        description: 'Лучший Калькулятор Сада для Grow A Garden. Бесплатно.',
        keywords: 'Калькулятор Сада,Культуры,Grow A Garden,Бесплатно'
      },
      values: {
        title: 'Руководство Ценностей - Цены Культур и Анализ Рынка',
        description: 'Проверьте ценности культур и анализ цен вариантов.',
        keywords: 'Ценности Культур,Анализ Рынка,Редкие Варианты'
      },
      'trade-calculator': {
        title: 'Калькулятор Торговли - Проверка Справедливых Цен',
        description: 'Рассчитайте справедливые цены торговли культурами.',
        keywords: 'Калькулятор Торговли,Торговля Культурами,Цены'
      },
      gear: {
        title: 'Информация Снаряжения - Руководство Снаряжения',
        description: 'Просмотрите все доступное снаряжение с информацией.',
        keywords: 'Информация Снаряжения,Снаряжение,Садовые Инструменты'
      },
      wiki: {
        title: 'Вики Сада - Руководства и Советы',
        description: 'Изучите советы садоводства и руководства выращивания.',
        keywords: 'Вики Сада,Руководства,Советы,Выращивание'
      },
      blog: {
        title: 'Блог Сада - Новости и Обновления',
        description: 'Последние новости садоводства и полезные советы.',
        keywords: 'Блог Сада,Новости,Обновления,Советы'
      }
    },
    vi: {
      home: {
        title: 'Máy Tính Vườn - Giá Trị Cây Trồng & Công Cụ Đột Biến',
        description: 'Máy Tính Vườn tốt nhất cho Grow A Garden. Miễn phí.',
        keywords: 'Máy Tính Vườn,Cây Trồng,Grow A Garden,Miễn Phí'
      },
      values: {
        title: 'Hướng Dẫn Giá Trị - Giá Cây Trồng & Phân Tích Thị Trường',
        description: 'Kiểm tra giá trị cây trồng và phân tích giá biến thể.',
        keywords: 'Giá Trị Cây Trồng,Phân Tích Thị Trường,Biến Thể Hiếm'
      },
      'trade-calculator': {
        title: 'Máy Tính Giao Dịch - Kiểm Tra Giá Công Bằng',
        description: 'Tính giá giao dịch cây trồng công bằng nhanh chóng.',
        keywords: 'Máy Tính Giao Dịch,Giao Dịch Cây Trồng,Giá'
      },
      gear: {
        title: 'Thông Tin Thiết Bị - Hướng Dẫn Thiết Bị Vườn',
        description: 'Duyệt tất cả thiết bị có sẵn với thông tin.',
        keywords: 'Thông Tin Thiết Bị,Thiết Bị,Công Cụ Vườn'
      },
      wiki: {
        title: 'Wiki Vườn - Hướng Dẫn và Mẹo',
        description: 'Học mẹo làm vườn và hướng dẫn trồng cây.',
        keywords: 'Wiki Vườn,Hướng Dẫn,Mẹo,Trồng Cây'
      },
      blog: {
        title: 'Blog Vườn - Tin Tức và Cập Nhật',
        description: 'Tin tức làm vườn mới nhất và mẹo hữu ích.',
        keywords: 'Blog Vườn,Tin Tức,Cập Nhật,Mẹo'
      }
    },
    hi: {
      home: {
        title: 'गार्डन कैलकुलेटर - फसल मूल्य और म्यूटेशन टूल्स',
        description: 'Grow A Garden के लिए सबसे अच्छा गार्डन कैलकुलेटर।',
        keywords: 'गार्डन कैलकुलेटर,फसल कैलकुलेटर,Grow A Garden'
      },
      values: {
        title: 'मूल्य गाइड - फसल कीमतें और बाजार विश्लेषण',
        description: 'फसल मूल्यों और दुर्लभ वेरिएंट मूल्य विश्लेषण देखें।',
        keywords: 'फसल मूल्य,बाजार विश्लेषण,दुर्लभ वेरिएंट,गाइड'
      },
      'trade-calculator': {
        title: 'ट्रेड कैलकुलेटर - फेयर डील प्राइस चेकर',
        description: 'फसल व्यापार की उचित कीमतों की गणना करें।',
        keywords: 'ट्रेड कैलकुलेटर,फसल व्यापार,मूल्य जांच'
      },
      gear: {
        title: 'गियर जानकारी - Grow A Garden उपकरण गाइड',
        description: 'जानकारी के साथ सभी उपलब्ध गियर ब्राउज़ करें।',
        keywords: 'गियर जानकारी,उपकरण,गार्डन टूल्स,गेम आइटम'
      },
      wiki: {
        title: 'गार्डन विकी - गाइड और टिप्स',
        description: 'बागवानी टिप्स और फसल उगाने के गाइड सीखें।',
        keywords: 'गार्डन विकी,गाइड,टिप्स,उगाना'
      },
      blog: {
        title: 'गार्डन ब्लॉग - समाचार और अपडेट',
        description: 'नवीनतम बागवानी समाचार और उपयोगी टिप्स।',
        keywords: 'गार्डन ब्लॉग,समाचार,अपडेट,टिप्स'
      }
    }
  };

  const defaultLang = 'en';
  const langMeta = metadataByLanguage[language] || metadataByLanguage[defaultLang];
  
  if (isHome) return langMeta.home;
  if (isValues) return langMeta.values;
  if (isTradeCalculator) return langMeta['trade-calculator'];
  if (isGear) return langMeta.gear;
  if (isWiki) return langMeta.wiki;
  if (isBlog) return langMeta.blog;
  
  return langMeta.home; // 默认返回首页metadata
};

export default function LanguageHtmlWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { language } = useI18n();
  const pathname = usePathname();
  const htmlRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // 获取 HTML 元素并设置 lang 属性
    if (!htmlRef.current) {
      htmlRef.current = document.documentElement;
    }
    
    if (htmlRef.current) {
      htmlRef.current.lang = language;
    }

    const metadata = getPageMetadata(pathname, language);
    
    // 更新页面title
    document.title = metadata.title;
    
    // 更新或创建meta标签
    const updateOrCreateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 更新或创建property meta标签（用于og标签）
    const updateOrCreatePropertyMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 设置基本meta标签
    updateOrCreateMeta('description', metadata.description);
    updateOrCreateMeta('keywords', metadata.keywords);
    
    // 设置OpenGraph标签
    updateOrCreatePropertyMeta('og:title', metadata.title);
    updateOrCreatePropertyMeta('og:description', metadata.description);
    updateOrCreatePropertyMeta('og:url', `https://growagardenvalue.org${pathname}`);
    
    // 设置Twitter标签
    updateOrCreateMeta('twitter:title', metadata.title);
    updateOrCreateMeta('twitter:description', metadata.description);
    
    // 设置canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://growagardenvalue.org${pathname}`;
  }, [language, pathname]);
  
  return <>{children}</>;
} 