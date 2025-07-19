"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Heart } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/i18n"

// Crop data
const cropsData = [
  { name: "Carrot", rarity: "Common", sellValue: 22, buyValue: 10, demand: 1, limited: false, emoji: "🥕" },
  { name: "Strawberry", rarity: "Common", sellValue: 19, buyValue: 50, demand: 1, limited: false, emoji: "🍓" },
  { name: "Blueberry", rarity: "Uncommon", sellValue: 21, buyValue: 400, demand: 2, limited: false, emoji: "🫐" },
  { name: "Orange Tulip", rarity: "Uncommon", sellValue: 792, buyValue: 600, demand: 2, limited: false, emoji: "🌷" },
  { name: "Tomato", rarity: "Rare", sellValue: 35, buyValue: 800, demand: 2, limited: false, emoji: "🍅" },
  { name: "Corn", rarity: "Rare", sellValue: 44, buyValue: 1300, demand: 2, limited: false, emoji: "🌽" },
  { name: "Daffodil", rarity: "Rare", sellValue: 988, buyValue: 1000, demand: 2, limited: false, emoji: "🌼" },
  { name: "Watermelon", rarity: "Legendary", sellValue: 2905, buyValue: 2500, demand: 4, limited: false, emoji: "🍉" },
  { name: "Pumpkin", rarity: "Legendary", sellValue: 3854, buyValue: 3000, demand: 4, limited: false, emoji: "🎃" },
  { name: "Apple", rarity: "Legendary", sellValue: 266, buyValue: 3250, demand: 5, limited: false, emoji: "🍎" },
  { name: "Bamboo", rarity: "Legendary", sellValue: 3944, buyValue: 4000, demand: 5, limited: false, emoji: "🎋" },
  { name: "Coconut", rarity: "Mythical", sellValue: 2670, buyValue: 6000, demand: 6, limited: false, emoji: "🥥" },
  { name: "Cactus", rarity: "Mythical", sellValue: 3224, buyValue: 1500, demand: 6, limited: false, emoji: "🌵" },
  {
    name: "Dragon Fruit",
    rarity: "Mythical",
    sellValue: 4566,
    buyValue: 50000,
    demand: 7,
    limited: false,
    emoji: "🐲",
  },
  { name: "Mango", rarity: "Mythical", sellValue: 6308, buyValue: 100000, demand: 8, limited: false, emoji: "🥭" },
  { name: "Grape", rarity: "Divine", sellValue: 7554, buyValue: 850000, demand: 7, limited: false, emoji: "🍇" },
  { name: "Mushroom", rarity: "Divine", sellValue: 142443, buyValue: 130000, demand: 7, limited: false, emoji: "🍄" },
  { name: "Pepper", rarity: "Divine", sellValue: 7577, buyValue: 1000000, demand: 8, limited: false, emoji: "🌶️" },
  { name: "Cacao", rarity: "Divine", sellValue: 10456, buyValue: 2500000, demand: 10, limited: false, emoji: "🍫" },
  { name: "Lemon", rarity: "Limited", sellValue: 554, buyValue: null, demand: 4, limited: true, emoji: "🍋" },
  { name: "Pineapple", rarity: "Mythical", sellValue: 2350, buyValue: null, demand: 4, limited: true, emoji: "🍍" },
  { name: "Peach", rarity: "Mythical", sellValue: 283, buyValue: null, demand: 3, limited: true, emoji: "🍑" },
  { name: "Pear", rarity: "Rare", sellValue: 553, buyValue: null, demand: 3, limited: true, emoji: "🍐" },
  { name: "Papaya", rarity: "Legendary", sellValue: 1288, buyValue: null, demand: 3, limited: true, emoji: "🧡" },
  { name: "Banana", rarity: "Mythical", sellValue: 1634, buyValue: null, demand: 4, limited: true, emoji: "🍌" },
  { name: "Passionfruit", rarity: "Mythical", sellValue: 3299, buyValue: null, demand: 5, limited: true, emoji: "💜" },
  { name: "Soul Fruit", rarity: "Divine", sellValue: 3328, buyValue: null, demand: 6, limited: true, emoji: "👻" },
  { name: "Cursed Fruit", rarity: "Divine", sellValue: 15944, buyValue: null, demand: 6, limited: true, emoji: "😈" },
  {
    name: "Chocolate Carrot",
    rarity: "Common",
    sellValue: 17258,
    buyValue: 10000,
    demand: 2,
    limited: true,
    emoji: "🍫",
  },
  {
    name: "Red Lollipop",
    rarity: "Uncommon",
    sellValue: 81297,
    buyValue: 45000,
    demand: 4,
    limited: true,
    emoji: "🍭",
  },
  {
    name: "Candy Sunflower",
    rarity: "Rare",
    sellValue: 164440,
    buyValue: 75000,
    demand: 6,
    limited: true,
    emoji: "🌻",
  },
  { name: "Easter Egg", rarity: "Legendary", sellValue: 4844, buyValue: 500000, demand: 7, limited: true, emoji: "🥚" },
  {
    name: "Candy Blossom",
    rarity: "Divine",
    sellValue: 99436,
    buyValue: 10000000,
    demand: 10,
    limited: true,
    emoji: "🌸",
  },
  { name: "Cherry Blossom", rarity: "Divine", sellValue: 566, buyValue: 21, demand: 10, limited: true, emoji: "🌸" },
  { name: "Nightshade", rarity: "Uncommon", sellValue: 2300, buyValue: null, demand: 3, limited: false, emoji: "🖤" },
  { name: "Beanstalk", rarity: "Divine", sellValue: 18788, buyValue: null, demand: 8, limited: false, emoji: "🌱" },
  { name: "Blood Banana", rarity: "Divine", sellValue: 6100, buyValue: null, demand: 7, limited: true, emoji: "🩸" },
  { name: "Celestiberry", rarity: "Divine", sellValue: 9100, buyValue: null, demand: 9, limited: false, emoji: "✨" },
  { name: "Cranberry", rarity: "Uncommon", sellValue: 2054, buyValue: null, demand: 2, limited: false, emoji: "🔴" },
  { name: "Moon Mango", rarity: "Divine", sellValue: 24340, buyValue: null, demand: 9, limited: false, emoji: "🌙" },
  { name: "Moon Melon", rarity: "Divine", sellValue: 17750, buyValue: null, demand: 8, limited: false, emoji: "🌙" },
]

const rarityColors = {
  Common: "bg-gray-100 text-gray-700 border-gray-200",
  Uncommon: "bg-green-100 text-green-700 border-green-200",
  Rare: "bg-blue-100 text-blue-700 border-blue-200",
  Legendary: "bg-purple-100 text-purple-700 border-purple-200",
  Mythical: "bg-pink-100 text-pink-700 border-pink-200",
  Divine: "bg-rose-100 text-rose-700 border-rose-200",
  Limited: "bg-yellow-100 text-yellow-700 border-yellow-200",
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

export default function CuteGardenValues() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRarity, setSelectedRarity] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const { t } = useI18n()

  const rarities = ["All", "Common", "Uncommon", "Rare", "Legendary", "Mythical", "Divine"]
  const types = ["All", "Regular", "Limited"]
  const sortOptions = [
    { value: "name", label: t('values.sortOptions.name') },
    { value: "sell-high", label: t('values.sortOptions.sellHigh') },
    { value: "sell-low", label: t('values.sortOptions.sellLow') },
    { value: "buy-high", label: t('values.sortOptions.buyHigh') },
    { value: "buy-low", label: t('values.sortOptions.buyLow') },
    { value: "demand", label: t('values.sortOptions.demand') },
  ]

  const filteredAndSortedCrops = useMemo(() => {
    const filtered = cropsData.filter((crop) => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t(getCropTranslationKey(crop.name)).toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRarity = selectedRarity === "All" || crop.rarity === selectedRarity
      const matchesType =
        selectedType === "All" ||
        (selectedType === "Limited" && crop.limited) ||
        (selectedType === "Regular" && !crop.limited)

      return matchesSearch && matchesRarity && matchesType
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "sell-high":
          return b.sellValue - a.sellValue
        case "sell-low":
          return a.sellValue - b.sellValue
        case "buy-high":
          const aBuy = a.buyValue || 0
          const bBuy = b.buyValue || 0
          return bBuy - aBuy
        case "buy-low":
          const aBuyLow = a.buyValue || Number.POSITIVE_INFINITY
          const bBuyLow = b.buyValue || Number.POSITIVE_INFINITY
          return aBuyLow - bBuyLow
        case "demand":
          return b.demand - a.demand
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchTerm, selectedRarity, selectedType, sortBy, t])

  const formatNumber = (num: number | null) => {
    if (num === null) return "N/A"
    return num.toLocaleString()
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedRarity("All")
    setSelectedType("All")
    setSortBy("name")
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
              <Input
                placeholder={`🔍 ${t('values.searchCrops')}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/50"
              />
            </div>

            {/* Filter Tags */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pink-700 mb-2 block">
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  {t('values.rarity')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {rarities.map((rarity) => (
                    <Button
                      key={rarity}
                      variant={selectedRarity === rarity ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRarity(rarity)}
                      className={`rounded-full transition-all ${
                        selectedRarity === rarity
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "border-pink-200 text-pink-600 hover:bg-pink-50"
                      }`}
                    >
                      {rarity === "All" ? t('values.rarityTypes.all') : 
                       rarity === "Common" ? t('values.rarityTypes.common') :
                       rarity === "Uncommon" ? t('values.rarityTypes.uncommon') :
                       rarity === "Rare" ? t('values.rarityTypes.rare') :
                       rarity === "Legendary" ? t('values.rarityTypes.legendary') :
                       rarity === "Mythical" ? t('values.rarityTypes.mythical') :
                       t('values.rarityTypes.divine')}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-pink-700 mb-2 block">
                  <Heart className="inline h-4 w-4 mr-1" />
                  {t('values.type')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className={`rounded-full transition-all ${
                        selectedType === type
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "border-pink-200 text-pink-600 hover:bg-pink-50"
                      }`}
                    >
                      {type === "All" ? t('values.cropTypes.all') :
                       type === "Regular" ? t('values.cropTypes.regular') :
                       t('values.cropTypes.limited')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="min-w-[200px]">
                  <label className="text-sm font-medium text-pink-700 mb-2 block">{t('values.sortBy')}</label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="bg-white/70 border-pink-200 text-pink-700 font-medium">
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-medium">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full"
                  >
                    {t('values.reset')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Count */}
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 text-lg rounded-full shadow-lg">
          {t('values.showing')} {filteredAndSortedCrops.length} {t('values.cuteCrops')}
        </Badge>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedCrops.map((crop) => (
          <Card
            key={crop.name}
            className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="relative">
                {/* Rarity Badge */}
                <Badge
                  className={`absolute -top-2 -right-2 ${
                    crop.limited
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                      : rarityColors[crop.rarity as keyof typeof rarityColors]
                  } rounded-full px-3 py-1 text-xs font-medium shadow-md whitespace-nowrap`}
                >
                  {crop.limited ? `${t('values.cropTypes.limited')} ✨` : 
                   crop.rarity === "Common" ? t('values.rarityTypes.common') :
                   crop.rarity === "Uncommon" ? t('values.rarityTypes.uncommon') :
                   crop.rarity === "Rare" ? t('values.rarityTypes.rare') :
                   crop.rarity === "Legendary" ? t('values.rarityTypes.legendary') :
                   crop.rarity === "Mythical" ? t('values.rarityTypes.mythical') :
                   t('values.rarityTypes.divine')}
                </Badge>

                {/* Crop Image */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                    {crop.emoji}
                  </div>
                </div>

                {/* Crop Info */}
                <div className="text-center space-y-3">
                  <div className="font-bold text-lg text-pink-800 min-h-[2rem] flex items-center justify-center">
                                          {t(getCropTranslationKey(crop.name))}
                    </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-pink-50 rounded-lg p-2">
                      <span className="text-sm font-medium text-pink-600">{t('values.sellValue')}</span>
                      <span className="font-bold text-pink-800">{formatNumber(crop.sellValue)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-rose-50 rounded-lg p-2">
                      <span className="text-sm font-medium text-rose-600">{t('values.buyValue')}</span>
                      <span className="font-bold text-rose-800">{formatNumber(crop.buyValue)}</span>
                    </div>

                    {/* Demand Bar */}
                    <div className="bg-pink-50 rounded-lg p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-pink-600">{t('values.demand')}</span>
                        <span className="text-xs font-bold text-pink-800">{crop.demand}/10</span>
                      </div>
                      <div className="w-full bg-pink-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(crop.demand / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedCrops.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌸</div>
                        <div className="text-xl font-bold text-pink-600 mb-2">{t('values.noCropsFound')}</div>
          <p className="text-pink-500">{t('values.tryAdjusting')}</p>
        </div>
      )}
    </div>
  )
}
