"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface Crop {
  name: string
  value: number
  weight: number
  image: string
  emoji: React.ComponentType<{ className?: string }>
  buyPrice?: number
  sellValue: number
  rarity: string
}

interface CropSelectorProps {
  crops: Crop[]
  onSelect: (crop: Crop) => void
  onClose: () => void
}

// 获取作物名称的翻译键
const getCropTranslationKey = (name: string) => {
  // 将作物名称转换为翻译键格式
  // 例如: "Blood Banana" -> "bloodBanana"
  const formatted = name
    .replace(/\s+/g, '') // 移除空格
    .replace(/^(.)/, (match) => match.toLowerCase()); // 首字母小写
  
  return `crops.names.${formatted}`;
}

// 格式化价格显示
const formatPrice = (price: number | undefined) => {
  if (!price) return '-';
  return price.toLocaleString();
}

// 更新图片处理，添加错误处理和加载状态
export default function CropSelector({ crops, onSelect, onClose }: CropSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { t, language } = useI18n();

  const filteredCrops = crops.filter((crop) => {
    const cropName = crop.name.toLowerCase();
    const translatedName = t(getCropTranslationKey(crop.name)).toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return cropName.includes(searchTermLower) || translatedName.includes(searchTermLower);
  })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm border border-pink-200 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-pink-200 flex justify-between items-center">
                      <div className="text-xl font-bold text-pink-800">{t('crops.select')} 🌸</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-pink-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-pink-400" />
            <Input
              placeholder={`🔍 ${t('crops.searchCrops')}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-pink-50/50 border-pink-200 text-pink-800"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.name}
                className="bg-pink-50/80 border border-pink-200 rounded-2xl p-3 cursor-pointer hover:bg-pink-100 transition-all hover:scale-[1.02] shadow-sm"
                onClick={() => onSelect(crop)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                    <img
                      src={crop.image || "/placeholder.svg"}
                      alt={t(getCropTranslationKey(crop.name))}
                      className="object-contain h-full w-full p-1"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://growagarden-calculator.com/cropimage/default-crop.png"
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-pink-800 mb-1 break-words">
                                              {t(getCropTranslationKey(crop.name))}
                      </div>
                    <div className="space-y-0.5 text-xs">
                      <p className="text-pink-600 flex justify-between">
                        <span>{t('values.buyValue')}:</span>
                        <span className="font-medium">{formatPrice(crop.buyPrice)}</span>
                      </p>
                      <p className="text-pink-600 flex justify-between">
                        <span>{t('values.sellValue')}:</span>
                        <span className="font-medium">{formatPrice(crop.sellValue)}</span>
                      </p>
                      <p className="text-pink-500 flex justify-between">
                        <span>{t('values.rarity')}:</span>
                        <span className="font-medium">{t(`values.rarityTypes.${crop.rarity.toLowerCase()}`)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCrops.length === 0 && (
              <div className="col-span-full text-center py-8 text-pink-600">
                <div className="text-4xl mb-2">🌸</div>
                <p className="font-medium">{t('tradeCalculator.noCropsFound')} "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
