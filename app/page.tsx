'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

const LangHome = dynamic(() => import('./[lang]/page'), { ssr: false });

export default function HomeRootPage() {
  const { setLanguage } = useI18n();
  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);
  return <LangHome />;
}
