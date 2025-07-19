"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Apple, 
  Banana, 
  Flower as Bamboo,
  Flower as Beanstalk,
  Cherry as BloodBanana,
  Cherry as Blueberry,
  Coffee as Cacao,
  Palmtree as Cactus,
  Candy as CandyBlossom,
  Candy as CandySunflower,
  Carrot,
  Star as Celestiberry,
  Cherry as CherryBlossom,
  Cookie as ChocolateCarrot,
  CircleDot as Coconut,
  Wheat as Corn,
  Cherry as Cranberry,
  Skull as CursedFruit,
  Flower as Daffodil,
  Flame as DragonFruit,
  CircleDot as Durian,
  Egg as EasterEgg,
  CircleDot as Eggplant,
  Flower as Foxglove,
  CircleDot as Glowshroom,
  Grape,
  Home as Hive,
  Citrus as Lemon,
  Flower as Lilac,
  Flower as Lotus,
  CircleDot as Mango,
  Leaf as Mint,
  Moon as MoonBlossom,
  Moon as MoonMango,
  Moon as MoonMelon,
  Flower as Moonflower,
  Star as Moonglow,
  CircleDot as Mushroom,
  Cherry as Nectarine,
  Flower as Nightshade,
  Flower as OrangeTulip,
  CircleDot as Papaya,
  CircleDot as Passionfruit,
  Cherry as Peach,
  CircleDot as Pear,
  CircleDot as Pepper,
  CircleDot as Pineapple,
  Flower as PinkLily,
  CircleDot as Pumpkin,
  Flower as PurpleDahlia,
  Cherry as Raspberry,
  Candy as RedLollipop,
  Flower as Rose,
  Star as SoulFruit,
  Star as Starfruit,
  Cherry as Strawberry,
  Sun as Sunflower,
  CircleDot as Tomato,
  Flower as VenusFlyTrap,
  CircleDot as Watermelon
} from "lucide-react"
import CropSelector from "./crop-selector"
import { useI18n } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"

// Define crop type with weight
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

// Define environmental mutation type
interface EnvironmentalMutation {
  id: string
  label: string
  value?: number
  multiplier?: number
}

// 更新作物数据，使用真实的图片URL
const sampleCrops: Crop[] = [
  { name: "Apple", value: 266, weight: 2.85, image: "https://growagarden-calculator.com/cropimage/apple.webp", emoji: Apple, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Bamboo", value: 3944, weight: 3.8, image: "https://growagarden-calculator.com/cropimage/bamboo.webp", emoji: Bamboo, buyPrice: 200, sellValue: 400, rarity: "Common" },
  { name: "Banana", value: 1634, weight: 1.425, image: "https://growagarden-calculator.com/cropimage/banana.webp", emoji: Banana, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Beanstalk",
    value: 18788,
    weight: 9.5,
    image: "https://growagarden-calculator.com/cropimage/beanstalk.webp",
    emoji: Beanstalk,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Blood Banana",
    value: 6100,
    weight: 1.42,
    image: "https://growagarden-calculator.com/cropimage/blood-banana.webp",
    emoji: BloodBanana,
    buyPrice: 200,
    sellValue: 400,
    rarity: "Uncommon"
  },
  { name: "Blueberry", value: 21, weight: 0.17, image: "https://growagarden-calculator.com/cropimage/blueberry.webp", emoji: Blueberry, buyPrice: 50, sellValue: 100, rarity: "Common" },
  { name: "Cacao", value: 10456, weight: 7.6, image: "https://growagarden-calculator.com/cropimage/cacao.webp", emoji: Cacao, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Cactus", value: 3224, weight: 6.65, image: "https://growagarden-calculator.com/cropimage/cactus.webp", emoji: Cactus, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Candy Blossom",
    value: 99436,
    weight: 2.85,
    image: "https://growagarden-calculator.com/cropimage/candy-blossom.webp",
    emoji: CandyBlossom,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Candy Sunflower",
    value: 164440,
    weight: 1.428,
    image: "https://growagarden-calculator.com/cropimage/candy-sunflower.webp",
    emoji: CandySunflower,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Carrot", value: 22, weight: 0.24, image: "https://growagarden-calculator.com/cropimage/carrot.webp", emoji: Carrot, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Celestiberry",
    value: 9100,
    weight: 1.9,
    image: "https://growagarden-calculator.com/cropimage/celestiberry.webp",
    emoji: Celestiberry,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Cherry Blossom",
    value: 566,
    weight: 0.95,
    image: "https://growagarden-calculator.com/cropimage/cherry-blossom.webp",
    emoji: CherryBlossom,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Chocolate Carrot",
    value: 17258,
    weight: 0.2616,
    image: "https://growagarden-calculator.com/cropimage/chocolate-carrot.webp",
    emoji: ChocolateCarrot,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Coconut", value: 2670, weight: 13.31, image: "https://growagarden-calculator.com/cropimage/coconut.webp", emoji: Coconut, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Corn", value: 44, weight: 1.9, image: "https://growagarden-calculator.com/cropimage/corn.webp", emoji: Corn, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Cranberry",
    value: 2054,
    weight: 0.95,
    image: "https://growagarden-calculator.com/cropimage/cranberry.webp",
    emoji: Cranberry,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Cursed Fruit",
    value: 15944,
    weight: 0.95,
    image: "https://growagarden-calculator.com/cropimage/cursed-fruit.webp",
    emoji: CursedFruit,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Uncommon"
  },
  { name: "Daffodil", value: 988, weight: 0.16, image: "https://growagarden-calculator.com/cropimage/daffodil.webp", emoji: Daffodil, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Dragon Fruit",
    value: 4566,
    weight: 11.38,
    image: "https://growagarden-calculator.com/cropimage/dragon-fruit.webp",
    emoji: DragonFruit,
    buyPrice: 200,
    sellValue: 400,
    rarity: "Rare"
  },
  { name: "Durian", value: 4911, weight: 7.6, image: "https://growagarden-calculator.com/cropimage/durian.webp", emoji: Durian, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Easter Egg",
    value: 4844,
    weight: 2.85,
    image: "https://growagarden-calculator.com/cropimage/easter-egg.webp",
    emoji: EasterEgg,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Eggplant", value: 7089, weight: 4.75, image: "https://growagarden-calculator.com/cropimage/eggplant.webp", emoji: Eggplant, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Foxglove",
    value: 1900,
    weight: 1.9,
    image: "https://growagarden-calculator.com/cropimage/default-crop.png",
    emoji: Foxglove,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  {
    name: "Glowshroom",
    value: 282,
    weight: 0.7,
    image: "https://growagarden-calculator.com/cropimage/glowshroom.webp",
    emoji: Glowshroom,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  { name: "Grape", value: 7554, weight: 2.85, image: "https://growagarden-calculator.com/cropimage/grape.webp", emoji: Grape, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Hive", value: 7600, weight: 7.6, image: "https://growagarden-calculator.com/cropimage/default-crop.png", emoji: Hive, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Lemon", value: 554, weight: 0.95, image: "https://growagarden-calculator.com/cropimage/lemon.webp", emoji: Lemon, buyPrice: 50, sellValue: 100, rarity: "Common" },
  { name: "Lilac", value: 2846, weight: 2.846, image: "https://growagarden-calculator.com/cropimage/lilac.webp", emoji: Lilac, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Lotus", value: 24598, weight: 18.99, image: "https://growagarden-calculator.com/cropimage/lotus.webp", emoji: Lotus, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Mango", value: 6308, weight: 14.28, image: "https://growagarden-calculator.com/cropimage/mango.webp", emoji: Mango, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Mint", value: 6800, weight: 0.95, image: "https://growagarden-calculator.com/cropimage/mint.webp", emoji: Mint, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Moon Blossom",
    value: 53512,
    weight: 2.85,
    image: "https://growagarden-calculator.com/cropimage/moon-blossom.webp",
    emoji: MoonBlossom,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Moon Mango",
    value: 24340,
    weight: 14.25,
    image: "https://growagarden-calculator.com/cropimage/moon-mango.webp",
    emoji: MoonMango,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Moon Melon",
    value: 17750,
    weight: 7.6,
    image: "https://growagarden-calculator.com/cropimage/moon-melon.webp",
    emoji: MoonMelon,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  {
    name: "Moonflower",
    value: 8900,
    weight: 1.9,
    image: "https://growagarden-calculator.com/cropimage/moonflower.webp",
    emoji: Moonflower,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Moonglow", value: 20300, weight: 6.65, image: "https://growagarden-calculator.com/cropimage/moonglow.webp", emoji: Moonglow, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Mushroom",
    value: 142443,
    weight: 25.9,
    image: "https://growagarden-calculator.com/cropimage/mushroom.webp",
    emoji: Mushroom,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  {
    name: "Nectarine",
    value: 2807,
    weight: 2.807,
    image: "https://growagarden-calculator.com/cropimage/nectarine.webp",
    emoji: Nectarine,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Nightshade",
    value: 2300,
    weight: 0.48,
    image: "https://growagarden-calculator.com/cropimage/nightshade.webp",
    emoji: Nightshade,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  {
    name: "Orange Tulip",
    value: 792,
    weight: 0.0499,
    image: "https://growagarden-calculator.com/cropimage/orange-tulip.webp",
    emoji: OrangeTulip,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  { name: "Papaya", value: 1288, weight: 2.86, image: "https://growagarden-calculator.com/cropimage/papaya.webp", emoji: Papaya, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Passionfruit",
    value: 3299,
    weight: 2.867,
    image: "https://growagarden-calculator.com/cropimage/passionfruit.webp",
    emoji: Passionfruit,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Peach", value: 283, weight: 1.9, image: "https://growagarden-calculator.com/cropimage/peach.webp", emoji: Peach, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Pear", value: 553, weight: 2.85, image: "https://growagarden-calculator.com/cropimage/pear.webp", emoji: Pear, buyPrice: 100, sellValue: 200, rarity: "Common" },
  { name: "Pepper", value: 7577, weight: 4.75, image: "https://growagarden-calculator.com/cropimage/pepper.webp", emoji: Pepper, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Pineapple",
    value: 2350,
    weight: 2.85,
    image: "https://growagarden-calculator.com/cropimage/pineapple.webp",
    emoji: Pineapple,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Pink Lily",
    value: 5699,
    weight: 5.699,
    image: "https://growagarden-calculator.com/cropimage/pink-lily.webp",
    emoji: PinkLily,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Pumpkin", value: 3854, weight: 6.9, image: "https://growagarden-calculator.com/cropimage/pumpkin.webp", emoji: Pumpkin, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Purple Dahlia",
    value: 11400,
    weight: 11.4,
    image: "https://growagarden-calculator.com/cropimage/purple-dahlia.webp",
    emoji: PurpleDahlia,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Raspberry", value: 98, weight: 0.71, image: "https://growagarden-calculator.com/cropimage/raspberry.webp", emoji: Raspberry, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Red Lollipop",
    value: 81297,
    weight: 3.7988,
    image: "https://growagarden-calculator.com/cropimage/red-lollipop.webp",
    emoji: RedLollipop,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Rose", value: 950, weight: 0.95, image: "https://growagarden-calculator.com/cropimage/rose.webp", emoji: Rose, buyPrice: 100, sellValue: 200, rarity: "Common" },
  {
    name: "Soul Fruit",
    value: 3328,
    weight: 23.75,
    image: "https://growagarden-calculator.com/cropimage/soul-fruit.webp",
    emoji: SoulFruit,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Starfruit",
    value: 14100,
    weight: 2.85,
    image: "https://growagarden-calculator.com/cropimage/starfruit.webp",
    emoji: Starfruit,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Strawberry",
    value: 19,
    weight: 0.29,
    image: "https://growagarden-calculator.com/cropimage/strawberry.webp",
    emoji: Strawberry,
    buyPrice: 50,
    sellValue: 100,
    rarity: "Common"
  },
  {
    name: "Sunflower",
    value: 14230,
    weight: 14.23,
    image: "https://growagarden-calculator.com/cropimage/sunflower.webp",
    emoji: Sunflower,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  { name: "Tomato", value: 35, weight: 0.44, image: "https://growagarden-calculator.com/cropimage/tomato.webp", emoji: Tomato, buyPrice: 50, sellValue: 100, rarity: "Common" },
  {
    name: "Venus Fly Trap",
    value: 18854,
    weight: 0.95,
    image: "https://growagarden-calculator.com/cropimage/venus-fly-trap.webp",
    emoji: VenusFlyTrap,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
  {
    name: "Watermelon",
    value: 2905,
    weight: 7.3,
    image: "https://growagarden-calculator.com/cropimage/watermelon.webp",
    emoji: Watermelon,
    buyPrice: 100,
    sellValue: 200,
    rarity: "Common"
  },
]

// Define environmental mutations
const environmentalMutations: EnvironmentalMutation[] = [
  { id: "chocolate", label: "Chocolate", value: 10 },
  { id: "moonlit", label: "Moonlit", value: 15 },
  { id: "pollinated", label: "Pollinated", multiplier: 3 },
  { id: "bloodlit", label: "Bloodlit", value: 20 },
  { id: "honey", label: "Honey Glazed", value: 25 },
  { id: "plasma", label: "Plasma", value: 30 },
  { id: "zombified", label: "Zombified", value: 35 },
  { id: "shocked", label: "Shocked", value: 40 },
  { id: "celestial", label: "Celestial", value: 45 },
  { id: "disco", label: "Disco", value: 50 },
  { id: "void", label: "VoidTouched", value: 55 },
]

// 获取作物名称的翻译键
const getCropTranslationKey = (name: string) => {
  // 将作物名称转换为翻译键格式
  // 例如: "Blood Banana" -> "bloodBanana"
  const formatted = name
    .replace(/\s+/g, '') // 移除空格
    .replace(/^(.)/, (match) => match.toLowerCase()); // 首字母小写
  
  return `crops.names.${formatted}`;
}

export default function GardenCalculator() {
  // State for selected crop and values
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [baseValue, setBaseValue] = useState<number>(0)
  const [weight, setWeight] = useState<number | null>(null)
  const [finalValue, setFinalValue] = useState<number>(0)
  
  // State for mutations
  const [growthMutation, setGrowthMutation] = useState<"default" | "golden" | "rainbow">("default")
  const [temperatureMutation, setTemperatureMutation] = useState<"none" | "wet" | "chilled" | "frozen">("none")
  const [environmentalMutationsSelected, setEnvironmentalMutationsSelected] = useState<string[]>([])
  
  // State for modal
  const [showCropModal, setShowCropModal] = useState(false)
  const { t } = useI18n()

  // Advanced weight calculation function
  const calculateWeightValue = (crop: Crop, weightValue: number): number => {
    // If weight is the same as default, just return base value
    if (weightValue === crop.weight) return crop.value
    
    // Different crops have different weight scaling formulas
    // This is a simplified example
    const ratio = weightValue / crop.weight
    
    // Apply different scaling based on crop type
    // For demonstration, using a simple formula
    return crop.value * Math.pow(ratio, 0.85)
  }

  // Calculate the final value
  const calculateValue = () => {
    let calculatedValue = baseValue
    
    // Apply weight calculation if crop is selected and weight differs from default
    if (selectedCrop && weight && weight > 0 && weight !== selectedCrop.weight) {
      calculatedValue = calculateWeightValue(selectedCrop, weight)
    }
    
    // Growth multiplier
    let growthMultiplier = 1
    if (growthMutation === "golden") growthMultiplier = 20
    if (growthMutation === "rainbow") growthMultiplier = 50
    
    // Temperature bonus
    let temperatureBonus = 0
    if (temperatureMutation === "wet") temperatureBonus = 1
    if (temperatureMutation === "chilled") temperatureBonus = 1
    if (temperatureMutation === "frozen") temperatureBonus = 9
    
    // Environmental stacks
    let environmentalStacks = 0
    let hasPollinatedMultiplier = false
    
    environmentalMutationsSelected.forEach((mutation) => {
      const mutationData = environmentalMutations.find((m) => m.id === mutation)
      if (mutationData) {
        if (mutationData.multiplier) {
          hasPollinatedMultiplier = true
        } else if (mutationData.value) {
          environmentalStacks += mutationData.value
        }
      }
    })
    
    // Apply multipliers and bonuses
    calculatedValue = calculatedValue * growthMultiplier
    calculatedValue = calculatedValue * (1 + temperatureBonus / 100)
    calculatedValue = calculatedValue * (1 + environmentalStacks / 100)
    
    // Apply pollinated multiplier (×3)
    if (hasPollinatedMultiplier) {
      calculatedValue = calculatedValue * 3
    }
    
    setFinalValue(Math.ceil(calculatedValue))
  }

  // Handle crop selection
  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop)
    setBaseValue(crop.value)
    setWeight(crop.weight)
    setShowCropModal(false)
  }

  // Toggle environmental mutation
  const toggleEnvironmentalMutation = (id: string) => {
    setEnvironmentalMutationsSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Get breakdown information
  const getBreakdown = () => {
    const growthLabel = growthMutation === "default" ? t('home.default') : growthMutation === "golden" ? t('home.golden') : t('home.rainbow')
    const temperatureLabel =
      temperatureMutation === "none"
        ? t('home.none')
        : temperatureMutation === "wet"
          ? t('home.wet')
          : temperatureMutation === "chilled"
            ? t('home.chilled')
            : t('home.frozen')
    const weightLabel =
      selectedCrop && weight && weight > 0 && weight !== selectedCrop.weight
        ? `${t('home.weightAdjustment')}: ${weight.toFixed(3)} kg`
        : `${t('home.weightAdjustment')}: ${t('home.none')}`

    const growthMultiplier = growthMutation === "default" ? 1 : growthMutation === "golden" ? 20 : 50
    const temperatureBonus =
      temperatureMutation === "none" ? 0 : temperatureMutation === "wet" || temperatureMutation === "chilled" ? 1 : 9
    const environmentalBonus = environmentalMutationsSelected.reduce((acc, mutation) => {
      const mutationData = environmentalMutations.find((m) => m.id === mutation)
      return acc + (mutationData && mutationData.value && !mutationData.multiplier ? mutationData.value : 0)
    }, 0)

    return {
      baseValue,
      growthMultiplier,
      growthLabel,
      temperatureBonus,
      temperatureLabel,
      environmentalBonus,
      weightLabel,
      finalValue,
    }
  }

  const breakdown = getBreakdown()

  return (
    <div className="space-y-6">
      {/* Crop Selection Section */}
      <Card className="bg-white/90 backdrop-blur-sm border-pink-200 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-pink-600">🌱</span> {t('home.cropSelection')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowCropModal(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex-1 rounded-full"
            >
              {selectedCrop ? t(getCropTranslationKey(selectedCrop.name)) : t('home.selectCrop')}
            </Button>

            <div className="flex-1">
              <Label htmlFor="baseValue">{t('home.baseValue')}:</Label>
              <Input
                id="baseValue"
                type="number"
                value={baseValue || ""}
                onChange={(e) => setBaseValue(Number(e.target.value))}
                placeholder={t('home.enterBaseValue')}
                className="bg-pink-50/50 border-pink-200 text-pink-800"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="weight">{t('home.weight')}:</Label>
            <Input
              id="weight"
              type="number"
              value={weight || ""}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
              placeholder={t('home.enterWeight')}
              className="bg-pink-50/50 border-pink-200 text-pink-800"
              step="0.001"
            />
            {selectedCrop && <p className="text-sm text-pink-600 mt-1">{t('crops.defaultWeight')}: {selectedCrop.weight} kg</p>}
          </div>
        </CardContent>
      </Card>

      {/* Mutations Section */}
      <Card className="bg-white/90 backdrop-blur-sm border-pink-200 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>✨</span> {t('home.mutations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Growth Mutations */}
          <div>
            <div className="text-lg font-medium mb-3">{t('home.growthTitle')}</div>
            <RadioGroup
              value={growthMutation}
              onValueChange={(value: "default" | "golden" | "rainbow") => setGrowthMutation(value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              <Label
                htmlFor="default"
                className={`flex items-center justify-between p-3 rounded-md border ${growthMutation === "default" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="default" id="default" />
                  <span>{t('home.default')}</span>
                </div>
                <span className="text-sm text-pink-600">1×</span>
              </Label>

              <Label
                htmlFor="golden"
                className={`flex items-center justify-between p-3 rounded-md border ${growthMutation === "golden" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="golden" id="golden" />
                  <span>{t('home.golden')}</span>
                </div>
                <span className="text-sm text-pink-600">20×</span>
              </Label>

              <Label
                htmlFor="rainbow"
                className={`flex items-center justify-between p-3 rounded-md border ${growthMutation === "rainbow" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="rainbow" id="rainbow" />
                  <span>{t('home.rainbow')}</span>
                </div>
                <span className="text-sm text-pink-600">50×</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Temperature Mutations */}
          <div>
            <div className="text-lg font-medium mb-3">{t('home.temperatureTitle')}</div>
            <RadioGroup
              value={temperatureMutation}
              onValueChange={(value: "none" | "wet" | "chilled" | "frozen") => setTemperatureMutation(value)}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2"
            >
              <Label
                htmlFor="temp-none"
                className={`flex items-center justify-between p-3 rounded-md border ${temperatureMutation === "none" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="none" id="temp-none" />
                  <span>{t('home.none')}</span>
                </div>
                <span className="text-sm text-pink-600">+0</span>
              </Label>

              <Label
                htmlFor="wet"
                className={`flex items-center justify-between p-3 rounded-md border ${temperatureMutation === "wet" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="wet" id="wet" />
                  <span>{t('home.wet')}</span>
                </div>
                <span className="text-sm text-pink-600">+1</span>
              </Label>

              <Label
                htmlFor="chilled"
                className={`flex items-center justify-between p-3 rounded-md border ${temperatureMutation === "chilled" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="chilled" id="chilled" />
                  <span>{t('home.chilled')}</span>
                </div>
                <span className="text-sm text-pink-600">+1</span>
              </Label>

              <Label
                htmlFor="frozen"
                className={`flex items-center justify-between p-3 rounded-md border ${temperatureMutation === "frozen" ? "border-pink-400 bg-pink-100" : "border-pink-200"}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="frozen" id="frozen" />
                  <span>{t('home.frozen')}</span>
                </div>
                <span className="text-sm text-pink-600">+9</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Environmental Mutations */}
          <div>
            <div className="text-lg font-medium mb-3">{t('home.environmentalTitle')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {environmentalMutations.map((mutation) => (
                <Label
                  key={mutation.id}
                  htmlFor={`env-${mutation.id}`}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    environmentalMutationsSelected.includes(mutation.id) ? "border-pink-400 bg-pink-100" : "border-pink-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`env-${mutation.id}`}
                      checked={environmentalMutationsSelected.includes(mutation.id)}
                      onCheckedChange={() => toggleEnvironmentalMutation(mutation.id)}
                    />
                    <span>{t(`mutations.environmental.${mutation.id}`)}</span>
                  </div>
                </Label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-to-br from-pink-500 to-rose-500 border-pink-400 rounded-2xl shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-medium text-white mb-2">{t('home.calculatedValue')}</div>
            <div className="text-4xl sm:text-6xl font-bold text-white mb-4">{finalValue.toLocaleString()}</div>

            <div className="bg-white/20 p-3 sm:p-4 rounded-md flex items-start gap-2 mb-4 sm:mb-6">
              <AlertTriangle className="text-yellow-300 h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
              <p className="text-white text-xs sm:text-sm text-left">
                {t('home.advancedCalculations')}
              </p>
            </div>

            <Card className="bg-white/10 border-none">
              <CardContent className="p-3 sm:p-4 text-left">
                <div className="font-medium text-white mb-2">{t('home.calculationBreakdown')}</div>
                <ul className="space-y-1 text-xs sm:text-sm text-white/90">
                  <li>{t('home.baseValue')}: {breakdown.baseValue.toLocaleString()}</li>
                  <li>{t('home.growthMultiplier')}: ×{breakdown.growthMultiplier} ({breakdown.growthLabel})</li>
                  <li>{t('home.temperatureBonus')}: +{breakdown.temperatureBonus} ({breakdown.temperatureLabel})</li>
                  <li>{t('home.environmentalStacks')}: +{breakdown.environmentalBonus}</li>
                  <li>{breakdown.weightLabel}</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-white/20 text-xs sm:text-sm text-white/90">
                  <p>{t('home.finalValue')} {breakdown.finalValue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Crop Selection Modal */}
      {showCropModal && (
        <CropSelector crops={sampleCrops} onSelect={handleCropSelect} onClose={() => setShowCropModal(false)} />
      )}
    </div>
  )
}
