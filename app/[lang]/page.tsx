'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import GardenCalculator from "@/components/garden-calculator"
import AnimatedPage from "@/components/animated-page"
import { useI18n, Language, supportedLanguages } from "@/lib/i18n"

export default function Home() {
  const { t, setLanguage } = useI18n();
  const params = useParams();
  const lang = params.lang as Language;

  // 设置语言基于URL参数
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  return (
    <AnimatedPage>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
              {t('home.welcome')}
              <span className="inline-block">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 8C21.8 8 20 9.8 20 12C20 14.2 21.8 16 24 16C26.2 16 28 14.2 28 12C28 9.8 26.2 8 24 8Z" fill="url(#paint0_linear)"/>
                  <path d="M32 16C29.8 16 28 17.8 28 20C28 22.2 29.8 24 32 24C34.2 24 36 22.2 36 20C36 17.8 34.2 16 32 16Z" fill="url(#paint1_linear)"/>
                  <path d="M16 16C13.8 16 12 17.8 12 20C12 22.2 13.8 24 16 24C18.2 24 20 22.2 20 20C20 17.8 18.2 16 16 16Z" fill="url(#paint2_linear)"/>
                  <path d="M24 24C21.8 24 20 25.8 20 28C20 30.2 21.8 32 24 32C26.2 32 28 30.2 28 28C28 25.8 26.2 24 24 24Z" fill="url(#paint3_linear)"/>
                  <path d="M24 16C22.9 16 22 16.9 22 18C22 19.1 22.9 20 24 20C25.1 20 26 19.1 26 18C26 16.9 25.1 16 24 16Z" fill="#FFC0CB"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="20" y1="12" x2="28" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#EC4899"/>
                      <stop offset="1" stopColor="#F43F5E"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="28" y1="20" x2="36" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#EC4899"/>
                      <stop offset="1" stopColor="#F43F5E"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="12" y1="20" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#EC4899"/>
                      <stop offset="1" stopColor="#F43F5E"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear" x1="20" y1="28" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#EC4899"/>
                      <stop offset="1" stopColor="#F43F5E"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="text-lg text-pink-700 font-medium flex items-center justify-center gap-2">
              {t('home.description')}
              <span className="inline-block animate-bounce">✨</span>
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
              🌺 {t('crops.title')}
            </h2>
            <GardenCalculator />
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
              ✨ {t('home.whyChooseUs')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-500 mb-3">{t('home.features.preciseCalculation')}</h3>
                <p className="text-pink-700">{t('home.features.preciseDescription')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-500 mb-3">{t('home.features.mutationPrediction')}</h3>
                <p className="text-pink-700">{t('home.features.mutationDescription')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-500 mb-3">{t('home.features.tradeAssistant')}</h3>
                <p className="text-pink-700">{t('home.features.tradeDescription')}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AnimatedPage>
  )
}