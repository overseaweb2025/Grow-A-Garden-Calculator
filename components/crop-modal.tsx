"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Crop {
  name: string
  buyPrice: number
  sellValue: number
  image?: string
  emoji: string
  rarity: string
}

interface CropModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCrop: (crop: Crop) => void
  crops: Crop[]
}

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

export default function CropModal({ isOpen, onClose, onSelectCrop, crops }: CropModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCrops, setFilteredCrops] = useState(crops)

  // Filter crops when search term changes
  useEffect(() => {
    const filtered = crops.filter((crop) => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCrops(filtered)
  }, [searchTerm, crops])

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-pink-200 rounded-3xl shadow-lg max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-pink-800">Select a Crop</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-pink-200 focus:border-pink-400 bg-pink-50/50"
          />
        </div>

        <div className="overflow-y-auto max-h-[60vh] pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCrops.map((crop) => (
              <button
                key={crop.name}
                onClick={() => onSelectCrop(crop)}
                className="bg-white hover:bg-pink-50 border border-pink-100 rounded-xl p-3 text-center transition-colors flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl mb-2">
                  {crop.emoji}
                </div>
                <p className="font-medium text-sm text-pink-800 mb-1 line-clamp-1">{crop.name}</p>
                <Badge className={`${rarityColors[crop.rarity]} text-xs mb-2`}>{crop.rarity}</Badge>
                <div className="text-xs text-pink-600 space-y-1">
                  <p>Buy: {formatNumber(crop.buyPrice)}</p>
                  <p>Sell: {formatNumber(crop.sellValue)}</p>
                </div>
              </button>
            ))}

            {filteredCrops.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <div className="text-5xl mb-3">🌸</div>
                <p className="text-pink-600 font-medium">No crops found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
