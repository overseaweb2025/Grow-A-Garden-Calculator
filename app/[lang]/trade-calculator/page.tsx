'use client';

import TradeCalculator from "@/components/trade-calculator"
import AnimatedPage from "@/components/animated-page"
import { useI18n } from "@/lib/i18n"

export default function TradeCalculatorPage() {
  const { t } = useI18n();
  
  return (
    <AnimatedPage>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
              {t('tradeCalculator.title')}
            </h1>
            <p className="text-lg text-pink-700 text-center mb-8">
              {t('tradeCalculator.description')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('tradeCalculator.basicTools')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.singleItem')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.singleItemDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.batchPricing')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.batchPricingDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.valueCompare')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.valueCompareDesc')}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('tradeCalculator.advancedAnalysis')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.rarityAnalysis')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.rarityAnalysisDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.marketTrends')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.marketTrendsDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.setOptimizer')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.setOptimizerDesc')}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              {t('tradeCalculator.tradingTips')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.bestTiming')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.bestTimingDesc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-600 mb-3">{t('tradeCalculator.features.valueForecast')}</h3>
                <p className="text-pink-700 mb-4">{t('tradeCalculator.features.valueForecastDesc')}</p>
              </div>
            </div>
          </section>

          <TradeCalculator />
        </div>
      </main>
    </AnimatedPage>
  )
}
