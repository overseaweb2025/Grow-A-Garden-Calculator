'use client';

import CuteGardenValues from "@/components/cute-garden-values"
import AnimatedPage from "@/components/animated-page"
import { useI18n } from "@/lib/i18n"

export default function ValuesPage() {
  const { t } = useI18n();
  
  return (
    <AnimatedPage>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
              {t('values.title')} 🌺
            </h1>
            <p className="text-lg text-pink-700 text-center mb-8">
              {t('values.description')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('values.commonCrops')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.basicCrops')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.basicCropsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.seasonalCrops')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.seasonalCropsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.premiumCrops')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.premiumCropsDesc')}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('values.rareMutations')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.colorVariants')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.colorVariantsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.shapeVariants')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.shapeVariantsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.limitedVariants')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.limitedVariantsDesc')}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('values.marketAnalysis')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.priceTrends')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.priceTrendsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('values.features.marketDemand')}</h3>
                <p className="text-pink-700 mb-4">{t('values.features.marketDemandDesc')}</p>
              </div>
            </div>
          </section>

          <CuteGardenValues />
        </div>
      </main>
    </AnimatedPage>
  )
}
