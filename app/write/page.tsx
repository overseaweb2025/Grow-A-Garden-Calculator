'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function WritePage() {
  const router = useRouter();
  const { language } = useI18n();

  useEffect(() => {
    // 重定向到多语言版本
    router.replace(`/${language}/write`);
  }, [language, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse">
        <div className="text-lg text-gray-600">Redirecting...</div>
      </div>
    </div>
  );
}