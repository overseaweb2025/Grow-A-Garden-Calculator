'use client';

import { useI18n } from "@/lib/i18n";
import AnimatedPage from "@/components/animated-page";
import GearCard from "@/components/gear-card";
import { gearData } from "@/lib/data/gear-data";
import { useState } from "react";

export default function GearPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [obtainableFilter, setObtainableFilter] = useState<string>("all");

  const filteredGear = gearData.filter(gear => {
    const matchesSearch = gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gear.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === "all" || gear.tier === selectedTier;
    const matchesObtainable = obtainableFilter === "all" || 
                             (obtainableFilter === "obtainable" && gear.obtainable) ||
                             (obtainableFilter === "unobtainable" && !gear.obtainable);
    
    return matchesSearch && matchesTier && matchesObtainable;
  });

  return (
    <AnimatedPage>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <section className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100">
              <h1 className="text-3xl font-bold text-pink-600 mb-6">{t('gearPage.title')}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder={t('gearPage.searchPlaceholder')}
                  className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 hover:from-pink-100 hover:to-pink-150 transition-all duration-200 cursor-pointer"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                >
                  <option value="all">{t('gearPage.allTiers')}</option>
                  <option value="common">{t('gearPage.tiers.common')}</option>
                  <option value="uncommon">{t('gearPage.tiers.uncommon')}</option>
                  <option value="rare">{t('gearPage.tiers.rare')}</option>
                  <option value="legendary">{t('gearPage.tiers.legendary')}</option>
                  <option value="mythical">{t('gearPage.tiers.mythical')}</option>
                  <option value="divine">{t('gearPage.tiers.divine')}</option>
                  <option value="-">{t('gearPage.tiers.special')}</option>
                </select>
                <select
                  className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 hover:from-pink-100 hover:to-pink-150 transition-all duration-200 cursor-pointer"
                  value={obtainableFilter}
                  onChange={(e) => setObtainableFilter(e.target.value)}
                >
                  <option value="all">{t('gearPage.allStatus')}</option>
                  <option value="obtainable">{t('gearPage.obtainable')}</option>
                  <option value="unobtainable">{t('gearPage.unobtainable')}</option>
                </select>
              </div>
            </div>
          </section>

          {/* Gear Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGear.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </section>
        </div>
      </main>
    </AnimatedPage>
  );
} 