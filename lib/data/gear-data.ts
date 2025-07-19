export type GearTier = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical' | 'divine' | '-';

export interface GearPrice {
  sheckle?: number;
  robux?: number;
  lunarPoint?: string;
}

export interface Gear {
  id: string;
  name: string;
  tier: GearTier;
  description: string;
  price: GearPrice;
  obtainable: boolean;
  imageUrl: string;
}

export const gearData: Gear[] = [
  {
    id: 'watering-can',
    name: 'Watering Can',
    tier: 'common',
    description: 'Functions to accelerate the growth cycle of crops.',
    price: {
      sheckle: 50000,
      robux: 39
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Watering-Can.webp'
  },
  {
    id: 'trowel',
    name: 'Trowel',
    tier: 'uncommon',
    description: 'Enables the user to relocate crops to new positions within the garden.',
    price: {
      sheckle: 100000,
      robux: 49
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Trowel.webp'
  },
  {
    id: 'recall-wrench',
    name: 'Recall Wrench',
    tier: 'uncommon',
    description: 'Provides immediate transportation for the player directly to the Gear Shop location.',
    price: {
      sheckle: 150000,
      robux: 59
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Recall-Wrench.webp'
  },
  {
    id: 'basic-sprinkler',
    name: 'Basic Sprinkler',
    tier: 'rare',
    description: 'Within its effective range, this sprinkler enhances crop growth velocity and augments the total harvest output.',
    price: {
      sheckle: 25000,
      robux: 79
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Basic-Sprinkler.webp'
  },
  {
    id: 'advanced-sprinkler',
    name: 'Advanced Sprinkler',
    tier: 'legendary',
    description: 'This device increases the rate of crop development and the likelihood of mutations for plants within its operational radius.',
    price: {
      sheckle: 50000,
      robux: 99
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Advanced-Sprinkler.webp'
  },
  {
    id: 'star-caller',
    name: 'Star Caller',
    tier: 'legendary',
    description: 'Serves to draw shooting stars, causing them to land in its immediate proximity.',
    price: {
      sheckle: 12000000,
      robux: 219
    },
    obtainable: false,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Star-Caller.webp'
  },
  {
    id: 'night-staff',
    name: 'Night Staff',
    tier: 'legendary',
    description: "Guarantees the application of the 'Moonlit' mutation to a selection of six arbitrary crops.",
    price: {
      robux: 40,
      lunarPoint: '-40 x1110 x1250 x1360 x3'
    },
    obtainable: false,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Night-Staff.webp'
  },
  {
    id: 'godly-sprinkler',
    name: 'Godly Sprinkler',
    tier: 'mythical',
    description: 'Dramatically enhances crop growth rate, mutation probability, and harvest quantity for all crops within its area of influence.',
    price: {
      sheckle: 120000,
      robux: 149
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Godly-Sprinkler.webp'
  },
  {
    id: 'lightning-rod',
    name: 'Lightning Rod',
    tier: 'mythical',
    description: 'Functions to divert lightning strikes, directing them to a designated point in the garden.',
    price: {
      sheckle: 1000000,
      robux: 179
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Lightning-Rod.webp'
  },
  {
    id: 'chocolate-sprinkler',
    name: 'Chocolate Sprinkler',
    tier: 'mythical',
    description: 'Within its radius of effect, this sprinkler applies a chocolate coating to crops that can be harvested multiple times.',
    price: {
      sheckle: 500000,
      robux: 199
    },
    obtainable: false,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Chocolate-Sprinkler.webp'
  },
  {
    id: 'nectar-staff',
    name: 'Nectar Staff',
    tier: 'mythical',
    description: 'This tool augments the rate of bee-driven pollination for all crops planted in the garden.',
    price: {
      robux: 219
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Nectar-Staff.webp'
  },
  {
    id: 'pollen-radar',
    name: 'Pollen Radar',
    tier: 'mythical',
    description: 'Identifies and automatically gathers pollinated crops from the surrounding area.',
    price: {
      robux: 249
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Pollen-Radar.webp'
  },
  {
    id: 'master-sprinkler',
    name: 'Master Sprinkler',
    tier: 'divine',
    description: 'Considerably improves the speed of crop growth, the chance for mutations, and the total yield of the harvest within its effective radius.',
    price: {
      sheckle: 10000000,
      robux: 199
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Master-Sprinkler.webp'
  },
  {
    id: 'cleaning-spray',
    name: 'Cleaning Spray',
    tier: 'divine',
    description: 'Removes all mutations from the selected crop.',
    price: {
      sheckle: 15000000,
      robux: 139
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Cleaning-Spray.webp'
  },
  {
    id: 'favorite-tool',
    name: 'Favorite Tool',
    tier: 'divine',
    description: 'Secures designated crops, thereby preventing the player from harvesting them unintentionally.',
    price: {
      sheckle: 20000000,
      robux: 119
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Favorite-Tool.webp'
  },
  {
    id: 'harvest-tool',
    name: 'Harvest Tool',
    tier: 'divine',
    description: 'Permits the instantaneous collection of the entire fruit yield from a specifically chosen plant.',
    price: {
      sheckle: 30000000,
      robux: 149
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Harvest-Tool.webp'
  },
  {
    id: 'friendship-pot',
    name: 'Friendship Pot',
    tier: 'divine',
    description: 'A cosmetic pot item intended to be shared with a fellow player.',
    price: {
      sheckle: 15000000,
      robux: 39
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Friendship-Pot.webp'
  },
  {
    id: 'honey-sprinkler',
    name: 'Honey Sprinkler',
    tier: 'divine',
    description: "Induces the 'Honey Glazed' mutation on crops situated within its field of effect.",
    price: {
      robux: 199
    },
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Honey-Sprinkler.webp'
  },
  {
    id: 'berry-blusher-sprinkler',
    name: 'Berry Blusher Sprinkler',
    tier: '-',
    description: 'Provides a substantial augmentation to the size bonus for berry varieties like Grapes and Blueberries, leading to a significant increase in their monetary value.',
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Berry-Blusher-Sprinker.webp'
  },
  {
    id: 'flower-froster-sprinkler',
    name: 'Flower Froster Sprinkler',
    tier: '-',
    description: "Increases the maturation rate and bestows 'Frozen' or 'Chilled' mutations upon flower-category plants, thereby enhancing their overall value.",
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Flower-Froster-Sprinkler.webp'
  },
  {
    id: 'spice-spritzer-sprinkler',
    name: 'Spice Spritzer Sprinkler',
    tier: '-',
    description: 'Significantly raises the likelihood of variant strains developing in Cacao, Pepper, and Papaya crops, which optimizes their financial return.',
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Spice-Spritzer-Sprinkler.webp'
  },
  {
    id: 'stalk-sprout-sprinkler',
    name: 'Stalk Sprout Sprinkler',
    tier: '-',
    description: "Considerably enlarges Mushrooms, Bamboo, and Beanstalks and concurrently applies the 'Wet' mutation, boosting their commercial worth.",
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Stalk-Sprout-Sprinkler.webp'
  },
  {
    id: 'sweet-soaker-sprinkler',
    name: 'Sweet Soaker Sprinkler',
    tier: '-',
    description: 'Augments the physical size of melon-category plants, including Watermelons and Pumpkins, which results in an improved harvest yield and higher sale price.',
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Sweet-Soaker-Sprinkler.webp'
  },
  {
    id: 'tropical-mist-sprinkler',
    name: 'Tropical Mist Sprinkler',
    tier: '-',
    description: 'Improves the growth velocity and confers a size bonus to tropical-type crops, maximizing both cultivation efficiency and market value.',
    price: {},
    obtainable: true,
    imageUrl: 'https://grow-a-garden-calculator.com/img/gear/Tropical-Mist-Sprinkler.webp'
  }
];

export const tierColors = {
  common: 'bg-green-100 text-green-700',
  uncommon: 'bg-blue-100 text-blue-700',
  rare: 'bg-purple-100 text-purple-700',
  legendary: 'bg-yellow-100 text-yellow-700',
  mythical: 'bg-red-100 text-red-700',
  divine: 'bg-pink-100 text-pink-700',
  '-': 'bg-gray-100 text-gray-700'
}; 