"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus, Minus, Search } from "lucide-react"
import { useI18n } from "@/lib/i18n"

// Define crop type with all necessary properties
interface Crop {
  name: string
  buyPrice: number
  sellValue: number
  emoji: string
  rarity: string
}

// Define trade item type
interface TradeItem {
  crop: Crop
  quantity: number
  id: number
}

// Sample crops data with buy/sell prices
const sampleCrops: Crop[] = [
  { name: "Apple", buyPrice: 3250, sellValue: 266, emoji: "🍎", rarity: "Legendary" },
  { name: "Bamboo", buyPrice: 4000, sellValue: 3944, emoji: "🎋", rarity: "Legendary" },
  { name: "Banana", buyPrice: 0, sellValue: 1634, emoji: "🍌", rarity: "Mythical" },
  { name: "Beanstalk", buyPrice: 0, sellValue: 18788, emoji: "🌱", rarity: "Divine" },
  { name: "Blueberry", buyPrice: 400, sellValue: 21, emoji: "🫐", rarity: "Uncommon" },
  { name: "Blood Banana", buyPrice: 0, sellValue: 6100, emoji: "🩸", rarity: "Divine" },
  { name: "Cacao", buyPrice: 2500000, sellValue: 10456, emoji: "🍫", rarity: "Divine" },
  { name: "Cactus", buyPrice: 1500, sellValue: 3224, emoji: "🌵", rarity: "Mythical" },
  { name: "Candy Blossom", buyPrice: 10000000, sellValue: 99436, emoji: "🌸", rarity: "Divine" },
  { name: "Candy Sunflower", buyPrice: 75000, sellValue: 164440, emoji: "🌻", rarity: "Rare" },
  { name: "Carrot", buyPrice: 10, sellValue: 22, emoji: "🥕", rarity: "Common" },
  { name: "Celestiberry", buyPrice: 0, sellValue: 9100, emoji: "✨", rarity: "Divine" },
  { name: "Cherry Blossom", buyPrice: 21, sellValue: 566, emoji: "🌸", rarity: "Divine" },
  { name: "Chocolate Carrot", buyPrice: 10000, sellValue: 17258, emoji: "🍫", rarity: "Common" },
  { name: "Coconut", buyPrice: 6000, sellValue: 2670, emoji: "🥥", rarity: "Mythical" },
  { name: "Corn", buyPrice: 1300, sellValue: 44, emoji: "🌽", rarity: "Rare" },
  { name: "Cranberry", buyPrice: 0, sellValue: 2054, emoji: "🔴", rarity: "Uncommon" },
  { name: "Cursed Fruit", buyPrice: 0, sellValue: 15944, emoji: "😈", rarity: "Divine" },
  { name: "Daffodil", buyPrice: 1000, sellValue: 988, emoji: "🌼", rarity: "Rare" },
  { name: "Dragon Fruit", buyPrice: 50000, sellValue: 4566, emoji: "🐲", rarity: "Mythical" },
  { name: "Easter Egg", buyPrice: 500000, sellValue: 4844, emoji: "🥚", rarity: "Legendary" },
  { name: "Grape", buyPrice: 850000, sellValue: 7554, emoji: "🍇", rarity: "Divine" },
  { name: "Lemon", buyPrice: 0, sellValue: 554, emoji: "🍋", rarity: "Limited" },
  { name: "Mango", buyPrice: 100000, sellValue: 6308, emoji: "🥭", rarity: "Mythical" },
  { name: "Moon Mango", buyPrice: 0, sellValue: 24340, emoji: "🌙", rarity: "Divine" },
  { name: "Moon Melon", buyPrice: 0, sellValue: 17750, emoji: "🌙", rarity: "Divine" },
  { name: "Mushroom", buyPrice: 130000, sellValue: 142443, emoji: "🍄", rarity: "Divine" },
  { name: "Nightshade", buyPrice: 0, sellValue: 2300, emoji: "🖤", rarity: "Uncommon" },
  { name: "Orange Tulip", buyPrice: 600, sellValue: 792, emoji: "🌷", rarity: "Uncommon" },
  { name: "Papaya", buyPrice: 0, sellValue: 1288, emoji: "🧡", rarity: "Legendary" },
  { name: "Passionfruit", buyPrice: 0, sellValue: 3299, emoji: "💜", rarity: "Mythical" },
  { name: "Peach", buyPrice: 0, sellValue: 283, emoji: "🍑", rarity: "Mythical" },
  { name: "Pear", buyPrice: 0, sellValue: 553, emoji: "🍐", rarity: "Rare" },
  { name: "Pepper", buyPrice: 1000000, sellValue: 7577, emoji: "🌶️", rarity: "Divine" },
  { name: "Pineapple", buyPrice: 0, sellValue: 2350, emoji: "🍍", rarity: "Mythical" },
  { name: "Pumpkin", buyPrice: 3000, sellValue: 3854, emoji: "🎃", rarity: "Legendary" },
  { name: "Red Lollipop", buyPrice: 45000, sellValue: 81297, emoji: "🍭", rarity: "Uncommon" },
  { name: "Soul Fruit", buyPrice: 0, sellValue: 3328, emoji: "👻", rarity: "Divine" },
  { name: "Strawberry", buyPrice: 50, sellValue: 19, emoji: "🍓", rarity: "Common" },
  { name: "Tomato", buyPrice: 800, sellValue: 35, emoji: "🍅", rarity: "Rare" },
  { name: "Watermelon", buyPrice: 2500, sellValue: 2905, emoji: "🍉", rarity: "Legendary" },
]

// Rarity colors for badges
const rarityColors: Record<string, string> = {
  Common: "bg-gray-100 text-gray-800 border-gray-200",
  Uncommon: "bg-green-100 text-green-800 border-green-200",
  Rare: "bg-blue-100 text-blue-800 border-blue-200",
  Legendary: "bg-purple-100 text-purple-800 border-purple-200",
  Mythical: "bg-pink-100 text-pink-800 border-pink-200",
  Divine: "bg-rose-100 text-rose-800 border-rose-200",
  Limited: "bg-yellow-100 text-yellow-800 border-yellow-200",
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

export default function TradeCalculator() {
  // State for trade items
  const [yourItems, setYourItems] = useState<TradeItem[]>([])
  const [theirItems, setTheirItems] = useState<TradeItem[]>([])

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSide, setCurrentSide] = useState<"your" | "their">("your")
  const [currentSlot, setCurrentSlot] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  // Trade analysis state
  const [buyPriceAnalysis, setBuyPriceAnalysis] = useState({
    status: "Fair Trade",
    percentage: 0,
    color: "#F1C40F",
    className: "fair",
  })
  const [sellValueAnalysis, setSellValueAnalysis] = useState({
    status: "Fair Trade",
    percentage: 0,
    color: "#F1C40F",
    className: "fair",
  })

  // Calculate totals
  const calculateTotals = (items: TradeItem[]) => {
    return items.reduce(
      (acc, item) => {
        acc.buyPrice += item.crop.buyPrice * item.quantity
        acc.sellValue += item.crop.sellValue * item.quantity
        return acc
      },
      { buyPrice: 0, sellValue: 0 },
    )
  }

  const yourTotals = calculateTotals(yourItems)
  const theirTotals = calculateTotals(theirItems)

  // Update trade analysis
  useEffect(() => {
    updateTradeAnalysis()
  }, [yourItems, theirItems])

  const updateTradeAnalysis = () => {
    // Buy price analysis
    updateSingleAnalysis(yourTotals.buyPrice, theirTotals.buyPrice, setBuyPriceAnalysis)

    // Sell value analysis
    updateSingleAnalysis(yourTotals.sellValue, theirTotals.sellValue, setSellValueAnalysis)
  }

  const updateSingleAnalysis = (
    yourValue: number,
    theirValue: number,
    setAnalysis: React.Dispatch<
      React.SetStateAction<{ status: string; percentage: number; color: string; className: string }>
    >,
  ) => {
    if (yourValue === 0 && theirValue === 0) {
      setAnalysis({
        status: "Fair Trade (0.0%)",
        percentage: 0,
        color: "#F1C40F",
        className: "fair",
      })
      return
    }

    const difference = theirValue - yourValue
    const percentage = theirValue > 0 ? (difference / theirValue) * 100 : 0

    if (Math.abs(percentage) <= 5) {
      setAnalysis({
        status: `Fair Trade (${Math.abs(percentage).toFixed(1)}%)`,
        percentage: percentage,
        color: "#F1C40F",
        className: "fair",
      })
    } else if (percentage > 5) {
      setAnalysis({
        status: `You Profit (+${percentage.toFixed(1)}%)`,
        percentage: percentage,
        color: "#2ECC71",
        className: "profit",
      })
    } else {
      setAnalysis({
        status: `You Lose (${percentage.toFixed(1)}%)`,
        percentage: percentage,
        color: "#E74C3C",
        className: "loss",
      })
    }
  }

  // Open modal to add item
  const openAddItemModal = (side: "your" | "their", slot: number) => {
    setCurrentSide(side)
    setCurrentSlot(slot)
    setIsModalOpen(true)
    setSearchTerm("")
  }

  // Add item to trade
  const addItemToTrade = (crop: Crop) => {
    const newItem: TradeItem = {
      crop,
      quantity: 1,
      id: Date.now(),
    }

    if (currentSide === "your") {
      const newItems = [...yourItems]
      newItems[currentSlot] = newItem
      setYourItems(newItems)
    } else {
      const newItems = [...theirItems]
      newItems[currentSlot] = newItem
      setTheirItems(newItems)
    }

    setIsModalOpen(false)
  }

  // Remove item from trade
  const removeItem = (side: "your" | "their", index: number) => {
    if (side === "your") {
      const newItems = [...yourItems]
      newItems.splice(index, 1)
      setYourItems(newItems)
    } else {
      const newItems = [...theirItems]
      newItems.splice(index, 1)
      setTheirItems(newItems)
    }
  }

  // Change item quantity
  const changeQuantity = (side: "your" | "their", index: number, change: number) => {
    if (side === "your") {
      const newItems = [...yourItems]
      if (newItems[index]) {
        newItems[index].quantity = Math.max(1, newItems[index].quantity + change)
        setYourItems(newItems)
      }
    } else {
      const newItems = [...theirItems]
      if (newItems[index]) {
        newItems[index].quantity = Math.max(1, newItems[index].quantity + change)
        setTheirItems(newItems)
      }
    }
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Filter crops based on search
  const filteredCrops = sampleCrops.filter((crop) => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Render crop item in modal
  const renderCropItem = (crop: Crop) => (
    <div
      key={crop.name}
      className="flex items-center justify-between p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer"
      onClick={() => {
        addItemToTrade(crop)
        setIsModalOpen(false)
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-lg">
          {crop.emoji}
        </div>
        <div>
          <p className="font-medium text-pink-800">{t(getCropTranslationKey(crop.name))}</p>
          <div className="flex gap-2 text-xs">
            <span className="text-pink-600">
              {t('tradeCalculator.buy')}: {crop.buyPrice ? crop.buyPrice.toLocaleString() : "-"}
            </span>
            <span className="text-pink-600">
              {t('tradeCalculator.sell')}: {crop.sellValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <Badge className={`${rarityColors[crop.rarity] || ""} whitespace-nowrap`}>
        {crop.rarity === "Common" ? t('values.rarityTypes.common') :
         crop.rarity === "Uncommon" ? t('values.rarityTypes.uncommon') :
         crop.rarity === "Rare" ? t('values.rarityTypes.rare') :
         crop.rarity === "Legendary" ? t('values.rarityTypes.legendary') :
         crop.rarity === "Mythical" ? t('values.rarityTypes.mythical') :
         crop.rarity === "Divine" ? t('values.rarityTypes.divine') :
         crop.rarity === "Limited" ? t('values.cropTypes.limited') : crop.rarity}
      </Badge>
    </div>
  )

  // Render trade side
  const renderTradeSide = (
    side: "your" | "their",
    items: TradeItem[],
    totals: { buyPrice: number; sellValue: number },
  ) => {
    return (
      <div className="flex-1">
        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 rounded-2xl shadow-lg mb-4">
          <CardContent className="p-6">
            <div className="text-xl font-bold text-center mb-6 text-pink-700 flex items-center justify-center gap-2">
              {side === "your" ? (
                <>
                  {t('tradeCalculator.yourItems')} <span className="text-2xl">🌸</span>
                </>
              ) : (
                <>
                  {t('tradeCalculator.theirItems')} <span className="text-2xl">🌺</span>
                </>
              )}
            </div>

            {/* Items Grid - 2x2 Layout */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, index) => {
                const item = items[index]
                const isDisabled = index > 0 && !items[index - 1]

                return (
                  <div
                    key={index}
                    className={`bg-pink-50/80 rounded-xl p-4 border border-pink-100 shadow-sm transition-all hover:shadow-md min-h-[160px] flex flex-col justify-center ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-pink-50"
                    }`}
                    onClick={() => !isDisabled && (item ? removeItem(side, index) : openAddItemModal(side, index))}
                  >
                    {item ? (
                      <div className="flex flex-col items-center text-center relative">
                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(side, index)
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-100 hover:bg-rose-200 rounded-full flex items-center justify-center text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={12} />
                        </button>

                        {/* Crop info */}
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm mb-3">
                          {item.crop.emoji}
                        </div>

                        <p className="font-semibold text-pink-800 text-sm mb-2 line-clamp-1 min-h-[1.5rem]">
                          {t(getCropTranslationKey(item.crop.name))}
                        </p>
                        <Badge className={`${rarityColors[item.crop.rarity]} text-xs mb-3 whitespace-nowrap`}>
                          {item.crop.rarity === "Common" ? t('values.rarityTypes.common') :
                           item.crop.rarity === "Uncommon" ? t('values.rarityTypes.uncommon') :
                           item.crop.rarity === "Rare" ? t('values.rarityTypes.rare') :
                           item.crop.rarity === "Legendary" ? t('values.rarityTypes.legendary') :
                           item.crop.rarity === "Mythical" ? t('values.rarityTypes.mythical') :
                           item.crop.rarity === "Divine" ? t('values.rarityTypes.divine') :
                           item.crop.rarity === "Limited" ? t('values.cropTypes.limited') : item.crop.rarity}
                        </Badge>

                        {/* Quantity controls */}
                        <div
                          className="flex items-center bg-white rounded-full shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              changeQuantity(side, index, -1)
                            }}
                            className="w-7 h-7 flex items-center justify-center text-pink-600 hover:bg-pink-50 rounded-l-full transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-pink-800 font-semibold">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              changeQuantity(side, index, 1)
                            }}
                            className="w-7 h-7 flex items-center justify-center text-pink-600 hover:bg-pink-50 rounded-r-full transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      !isDisabled && (
                        <div className="flex flex-col items-center justify-center text-pink-500 h-full">
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                            <Plus size={24} />
                          </div>
                          <span className="font-medium text-sm">{t('tradeCalculator.addItem')}</span>
                        </div>
                      )
                    )}
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pink-200">
              <div className="bg-gradient-to-r from-pink-100 to-pink-50 p-4 rounded-xl text-center">
                <p className="text-sm text-pink-600 mb-1 font-medium">{t('tradeCalculator.buyPrice')}</p>
                <p className="font-bold text-pink-800 text-xl">{formatNumber(totals.buyPrice)}</p>
              </div>
              <div className="bg-gradient-to-r from-rose-100 to-rose-50 p-4 rounded-xl text-center">
                <p className="text-sm text-rose-600 mb-1 font-medium">{t('tradeCalculator.sellValue')}</p>
                <p className="font-bold text-rose-800 text-xl">{formatNumber(totals.sellValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { t } = useI18n()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderTradeSide("your", yourItems, yourTotals)}
        {renderTradeSide("their", theirItems, theirTotals)}
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-pink-200 rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-pink-800">{t('tradeCalculator.buyPriceAnalysis')}</div>
              <span
                className={`font-medium ${
                  buyPriceAnalysis.className === "profit"
                    ? "text-green-600"
                    : buyPriceAnalysis.className === "loss"
                      ? "text-red-600"
                      : "text-amber-600"
                }`}
              >
                {buyPriceAnalysis.status}
              </span>
            </div>
            <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(90, Math.max(10, 50 + buyPriceAnalysis.percentage / 2))}%`,
                  backgroundColor: buyPriceAnalysis.color,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-pink-800">{t('tradeCalculator.sellValueAnalysis')}</div>
              <span
                className={`font-medium ${
                  sellValueAnalysis.className === "profit"
                    ? "text-green-600"
                    : sellValueAnalysis.className === "loss"
                      ? "text-red-600"
                      : "text-amber-600"
                }`}
              >
                {sellValueAnalysis.status}
              </span>
            </div>
            <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(90, Math.max(10, 50 + sellValueAnalysis.percentage / 2))}%`,
                  backgroundColor: sellValueAnalysis.color,
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm border border-pink-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-pink-200 flex justify-between items-center">
              <div className="text-2xl font-bold text-pink-800">{t('tradeCalculator.selectCrop')} 🌸</div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center text-pink-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 border-b border-pink-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                <Input
                  placeholder={t('tradeCalculator.searchCrops')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400 bg-pink-50/50"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredCrops.map((crop) => (
                  <div
                    key={crop.name}
                    className="flex items-center justify-between p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer"
                    onClick={() => {
                      addItemToTrade(crop)
                      setIsModalOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-pink-100 text-lg">
                        {crop.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-pink-800 truncate">{t(getCropTranslationKey(crop.name))}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-pink-600">
                            {t('tradeCalculator.buy')}: {crop.buyPrice ? crop.buyPrice.toLocaleString() : "-"}
                          </span>
                          <span className="text-pink-600">
                            {t('tradeCalculator.sell')}: {crop.sellValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${rarityColors[crop.rarity] || ""} whitespace-nowrap flex-shrink-0 ml-2`}>
                      {crop.rarity === "Common" ? t('values.rarityTypes.common') :
                       crop.rarity === "Uncommon" ? t('values.rarityTypes.uncommon') :
                       crop.rarity === "Rare" ? t('values.rarityTypes.rare') :
                       crop.rarity === "Legendary" ? t('values.rarityTypes.legendary') :
                       crop.rarity === "Mythical" ? t('values.rarityTypes.mythical') :
                       crop.rarity === "Divine" ? t('values.rarityTypes.divine') :
                       crop.rarity === "Limited" ? t('values.cropTypes.limited') : crop.rarity}
                    </Badge>
                  </div>
                ))}

                {filteredCrops.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <div className="text-5xl mb-3">🌸</div>
                    <p className="text-pink-600 font-medium">{t('tradeCalculator.noCropsFound')} "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
