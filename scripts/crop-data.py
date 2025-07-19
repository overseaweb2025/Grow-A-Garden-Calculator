# Extract and format crop data from the provided file
crops_data = [
    {"name": "Carrot", "rarity": "Common", "sellValue": 22, "buyValue": 10, "demand": 1, "limited": False, "emoji": "🥕"},
    {"name": "Strawberry", "rarity": "Common", "sellValue": 19, "buyValue": 50, "demand": 1, "limited": False, "emoji": "🍓"},
    {"name": "Blueberry", "rarity": "Uncommon", "sellValue": 21, "buyValue": 400, "demand": 2, "limited": False, "emoji": "🫐"},
    {"name": "Orange Tulip", "rarity": "Uncommon", "sellValue": 792, "buyValue": 600, "demand": 2, "limited": False, "emoji": "🌷"},
    {"name": "Tomato", "rarity": "Rare", "sellValue": 35, "buyValue": 800, "demand": 2, "limited": False, "emoji": "🍅"},
    {"name": "Corn", "rarity": "Rare", "sellValue": 44, "buyValue": 1300, "demand": 2, "limited": False, "emoji": "🌽"},
    {"name": "Daffodil", "rarity": "Rare", "sellValue": 988, "buyValue": 1000, "demand": 2, "limited": False, "emoji": "🌼"},
    {"name": "Watermelon", "rarity": "Legendary", "sellValue": 2905, "buyValue": 2500, "demand": 4, "limited": False, "emoji": "🍉"},
    {"name": "Pumpkin", "rarity": "Legendary", "sellValue": 3854, "buyValue": 3000, "demand": 4, "limited": False, "emoji": "🎃"},
    {"name": "Apple", "rarity": "Legendary", "sellValue": 266, "buyValue": 3250, "demand": 5, "limited": False, "emoji": "🍎"},
    {"name": "Bamboo", "rarity": "Legendary", "sellValue": 3944, "buyValue": 4000, "demand": 5, "limited": False, "emoji": "🎋"},
    {"name": "Coconut", "rarity": "Mythical", "sellValue": 2670, "buyValue": 6000, "demand": 6, "limited": False, "emoji": "🥥"},
    {"name": "Cactus", "rarity": "Mythical", "sellValue": 3224, "buyValue": 1500, "demand": 6, "limited": False, "emoji": "🌵"},
    {"name": "Dragon Fruit", "rarity": "Mythical", "sellValue": 4566, "buyValue": 50000, "demand": 7, "limited": False, "emoji": "🐲"},
    {"name": "Mango", "rarity": "Mythical", "sellValue": 6308, "buyValue": 100000, "demand": 8, "limited": False, "emoji": "🥭"},
    {"name": "Grape", "rarity": "Divine", "sellValue": 7554, "buyValue": 850000, "demand": 7, "limited": False, "emoji": "🍇"},
    {"name": "Mushroom", "rarity": "Divine", "sellValue": 142443, "buyValue": 130000, "demand": 7, "limited": False, "emoji": "🍄"},
    {"name": "Pepper", "rarity": "Divine", "sellValue": 7577, "buyValue": 1000000, "demand": 8, "limited": False, "emoji": "🌶️"},
    {"name": "Cacao", "rarity": "Divine", "sellValue": 10456, "buyValue": 2500000, "demand": 10, "limited": False, "emoji": "🍫"},
    {"name": "Lemon", "rarity": "Limited", "sellValue": 554, "buyValue": None, "demand": 4, "limited": True, "emoji": "🍋"},
    {"name": "Pineapple", "rarity": "Mythical", "sellValue": 2350, "buyValue": None, "demand": 4, "limited": True, "emoji": "🍍"},
    {"name": "Peach", "rarity": "Mythical", "sellValue": 283, "buyValue": None, "demand": 3, "limited": True, "emoji": "🍑"},
    {"name": "Pear", "rarity": "Rare", "sellValue": 553, "buyValue": None, "demand": 3, "limited": True, "emoji": "🍐"},
    {"name": "Papaya", "rarity": "Legendary", "sellValue": 1288, "buyValue": None, "demand": 3, "limited": True, "emoji": "🧡"},
    {"name": "Banana", "rarity": "Mythical", "sellValue": 1634, "buyValue": None, "demand": 4, "limited": True, "emoji": "🍌"},
    {"name": "Passionfruit", "rarity": "Mythical", "sellValue": 3299, "buyValue": None, "demand": 5, "limited": True, "emoji": "💜"},
    {"name": "Soul Fruit", "rarity": "Divine", "sellValue": 3328, "buyValue": None, "demand": 6, "limited": True, "emoji": "👻"},
    {"name": "Cursed Fruit", "rarity": "Divine", "sellValue": 15944, "buyValue": None, "demand": 6, "limited": True, "emoji": "😈"},
    {"name": "Chocolate Carrot", "rarity": "Common", "sellValue": 17258, "buyValue": 10000, "demand": 2, "limited": True, "emoji": "🍫"},
    {"name": "Red Lollipop", "rarity": "Uncommon", "sellValue": 81297, "buyValue": 45000, "demand": 4, "limited": True, "emoji": "🍭"},
    {"name": "Candy Sunflower", "rarity": "Rare", "sellValue": 164440, "buyValue": 75000, "demand": 6, "limited": True, "emoji": "🌻"},
    {"name": "Easter Egg", "rarity": "Legendary", "sellValue": 4844, "buyValue": 500000, "demand": 7, "limited": True, "emoji": "🥚"},
    {"name": "Candy Blossom", "rarity": "Divine", "sellValue": 99436, "buyValue": 10000000, "demand": 10, "limited": True, "emoji": "🌸"},
    {"name": "Cherry Blossom", "rarity": "Divine", "sellValue": 566, "buyValue": 21, "demand": 10, "limited": True, "emoji": "🌸"},
    {"name": "Nightshade", "rarity": "Uncommon", "sellValue": 2300, "buyValue": None, "demand": 3, "limited": False, "emoji": "🖤"},
    {"name": "Beanstalk", "rarity": "Divine", "sellValue": 18788, "buyValue": None, "demand": 8, "limited": False, "emoji": "🌱"},
    {"name": "Blood Banana", "rarity": "Divine", "sellValue": 6100, "buyValue": None, "demand": 7, "limited": True, "emoji": "🩸"},
    {"name": "Celestiberry", "rarity": "Divine", "sellValue": 9100, "buyValue": None, "demand": 9, "limited": False, "emoji": "✨"},
    {"name": "Cranberry", "rarity": "Uncommon", "sellValue": 2054, "buyValue": None, "demand": 2, "limited": False, "emoji": "🔴"},
    {"name": "Moon Mango", "rarity": "Divine", "sellValue": 24340, "buyValue": None, "demand": 9, "limited": False, "emoji": "🌙"},
    {"name": "Moon Melon", "rarity": "Divine", "sellValue": 17750, "buyValue": None, "demand": 8, "limited": False, "emoji": "🌙"}
]

print("Crop data extracted successfully!")
print(f"Total crops: {len(crops_data)}")

# Group by rarity
rarity_counts = {}
for crop in crops_data:
    rarity = crop["rarity"]
    rarity_counts[rarity] = rarity_counts.get(rarity, 0) + 1

print("\nCrops by rarity:")
for rarity, count in rarity_counts.items():
    print(f"  {rarity}: {count}")
