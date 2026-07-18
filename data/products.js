/**
 * Vesta — Curated product catalog (BigBasket subset)
 */
const PRODUCTS_DB = [
  {
    "id": "prod_avocado",
    "name": "Organic Hass Avocado",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "pieces",
    "defaultQuantity": 3,
    "shelfLifeDays": 5,
    "emoji": "🥑",
    "description": "Rich, creamy, heart-healthy avocados. Perfect for breakfast toast or fresh guacamole.",
    "caloriesPer100": 160,
    "image": ""
  },
  {
    "id": "prod_tomato",
    "name": "Spanish Vine Tomatoes",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "g",
    "defaultQuantity": 500,
    "shelfLifeDays": 7,
    "emoji": "🍅",
    "description": "Sweet, juicy vine-ripened tomatoes, rich in Lycopene and vitamin C.",
    "caloriesPer100": 18,
    "image": ""
  },
  {
    "id": "prod_spinach",
    "name": "Baby Spinach Leaves",
    "category": "Produce",
    "brand": "Green Harvest",
    "defaultUnit": "g",
    "defaultQuantity": 200,
    "shelfLifeDays": 4,
    "emoji": "🥬",
    "description": "Tender, pre-washed baby spinach leaves. Excellent source of iron, calcium, and vitamins.",
    "caloriesPer100": 23,
    "image": ""
  },
  {
    "id": "prod_lemon",
    "name": "Fresh Meyer Lemons",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "pieces",
    "defaultQuantity": 5,
    "shelfLifeDays": 14,
    "emoji": "🍋",
    "description": "Highly aromatic, slightly sweet lemons, perfect for dressings, cooking, and detox water.",
    "caloriesPer100": 29,
    "image": ""
  },
  {
    "id": "prod_garlic",
    "name": "Organic Garlic Bulbs",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "pieces",
    "defaultQuantity": 3,
    "shelfLifeDays": 30,
    "emoji": "🧄",
    "description": "Pungent and flavorful garlic cloves, perfect for sautéing and building base immune strength.",
    "caloriesPer100": 149,
    "image": ""
  },
  {
    "id": "prod_ginger",
    "name": "Fresh Young Ginger Roots",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "g",
    "defaultQuantity": 150,
    "shelfLifeDays": 21,
    "emoji": "🫚",
    "description": "Zesty, warming young ginger roots, ideal for teas, marinades, and immune boosting.",
    "caloriesPer100": 80,
    "image": ""
  },
  {
    "id": "prod_onion",
    "name": "Red Onions",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "g",
    "defaultQuantity": 1000,
    "shelfLifeDays": 25,
    "emoji": "🧅",
    "description": "Crispy and sharp red onions, highly versatile staple for cooking bases and salads.",
    "caloriesPer100": 40,
    "image": ""
  },
  {
    "id": "prod_potato",
    "name": "Russet Baking Potatoes",
    "category": "Produce",
    "brand": "Fresh Organic",
    "defaultUnit": "g",
    "defaultQuantity": 1500,
    "shelfLifeDays": 30,
    "emoji": "🥔",
    "description": "Starchy baking potatoes, perfect for mashing, roasting, or baking.",
    "caloriesPer100": 77,
    "image": ""
  },
  {
    "id": "prod_blueberry",
    "name": "Fresh Organic Blueberries",
    "category": "Produce",
    "brand": "Driscoll's",
    "defaultUnit": "g",
    "defaultQuantity": 125,
    "shelfLifeDays": 6,
    "emoji": "🫐",
    "description": "Sweet and plump organic blueberries. High in antioxidants and vitamins.",
    "caloriesPer100": 57,
    "image": ""
  },
  {
    "id": "prod_basil",
    "name": "Fresh Sweet Basil Sprigs",
    "category": "Produce",
    "brand": "Garden Fresh",
    "defaultUnit": "g",
    "defaultQuantity": 50,
    "shelfLifeDays": 5,
    "emoji": "🌿",
    "description": "Sweet green basil leaves. Intensely aromatic, perfect for pesto or garnishing tomato dishes.",
    "caloriesPer100": 22,
    "image": ""
  },
  {
    "id": "prod_milk",
    "name": "Organic Whole Milk",
    "category": "Dairy",
    "brand": "Organic Valley",
    "defaultUnit": "ml",
    "defaultQuantity": 1000,
    "shelfLifeDays": 7,
    "emoji": "🥛",
    "description": "Creamy, pasteurized organic whole milk. Rich in calcium and Vitamin D.",
    "caloriesPer100": 61,
    "image": ""
  },
  {
    "id": "prod_yogurt",
    "name": "Greek Plain Yogurt",
    "category": "Dairy",
    "brand": "Chobani",
    "defaultUnit": "g",
    "defaultQuantity": 500,
    "shelfLifeDays": 10,
    "emoji": "🥣",
    "description": "Thick, strained plain Greek yogurt, high in protein and gut-friendly probiotics.",
    "caloriesPer100": 59,
    "image": ""
  },
  {
    "id": "prod_butter",
    "name": "Salted Sweet Cream Butter",
    "category": "Dairy",
    "brand": "Kerrygold",
    "defaultUnit": "g",
    "defaultQuantity": 250,
    "shelfLifeDays": 45,
    "emoji": "🧈",
    "description": "Rich Irish butter made from the milk of grass-fed cows. Adds exceptional depth.",
    "caloriesPer100": 717,
    "image": ""
  },
  {
    "id": "prod_eggs",
    "name": "Pasture-Raised Brown Eggs",
    "category": "Dairy",
    "brand": "Vital Farms",
    "defaultUnit": "pieces",
    "defaultQuantity": 12,
    "shelfLifeDays": 21,
    "emoji": "🥚",
    "description": "Pasture-raised, Grade A large brown eggs. High in protein, lutein, and Omega-3.",
    "caloriesPer100": 143,
    "image": ""
  },
  {
    "id": "prod_feta",
    "name": "Greek Feta Cheese Block",
    "category": "Dairy",
    "brand": "Dodoni",
    "defaultUnit": "g",
    "defaultQuantity": 200,
    "shelfLifeDays": 15,
    "emoji": "🧀",
    "description": "Traditional tangy Greek feta cheese block in brine. Perfect for salads and bakes.",
    "caloriesPer100": 264,
    "image": ""
  },
  {
    "id": "prod_cheddar",
    "name": "Sharp Cheddar Cheese Block",
    "category": "Dairy",
    "brand": "Cabot",
    "defaultUnit": "g",
    "defaultQuantity": 220,
    "shelfLifeDays": 30,
    "emoji": "🧀",
    "description": "Naturally aged sharp white cheddar cheese, offering a bold and creamy bite.",
    "caloriesPer100": 402,
    "image": ""
  },
  {
    "id": "prod_sourdough",
    "name": "Country Sourdough Bread",
    "category": "Bakery",
    "brand": "Artisan Bakery",
    "defaultUnit": "pieces",
    "defaultQuantity": 1,
    "shelfLifeDays": 4,
    "emoji": "🍞",
    "description": "Slow-fermented artisan sourdough loaf with a crispy crust and an airy, tangy crumb.",
    "caloriesPer100": 245,
    "image": ""
  },
  {
    "id": "prod_tortillas",
    "name": "Whole Wheat Flour Tortillas",
    "category": "Bakery",
    "brand": "Mission",
    "defaultUnit": "pieces",
    "defaultQuantity": 8,
    "shelfLifeDays": 12,
    "emoji": "🫓",
    "description": "Soft whole wheat tortillas, high in fiber and perfect for wraps or quesadillas.",
    "caloriesPer100": 290,
    "image": ""
  },
  {
    "id": "prod_croissants",
    "name": "All-Butter French Croissants",
    "category": "Bakery",
    "brand": "Artisan Bakery",
    "defaultUnit": "pieces",
    "defaultQuantity": 4,
    "shelfLifeDays": 3,
    "emoji": "🥐",
    "description": "Flaky, golden-brown croissants layered with pure cream butter.",
    "caloriesPer100": 406,
    "image": ""
  },
  {
    "id": "prod_rice",
    "name": "Premium Basmati Rice",
    "category": "Pantry",
    "brand": "India Gate",
    "defaultUnit": "g",
    "defaultQuantity": 1000,
    "shelfLifeDays": 365,
    "emoji": "🌾",
    "description": "Extra-long, highly aromatic basmati rice grains. Ideal for pilafs and side dishes.",
    "caloriesPer100": 365,
    "image": ""
  },
  {
    "id": "prod_olive_oil",
    "name": "Extra Virgin Olive Oil",
    "category": "Pantry",
    "brand": "Filippo Berio",
    "defaultUnit": "ml",
    "defaultQuantity": 500,
    "shelfLifeDays": 180,
    "emoji": "🫒",
    "description": "First cold-pressed premium extra virgin olive oil. Rich in antioxidants and healthy monounsaturated fats.",
    "caloriesPer100": 884,
    "image": ""
  },
  {
    "id": "prod_pasta",
    "name": "Organic Penne Rigate",
    "category": "Pantry",
    "brand": "Barilla",
    "defaultUnit": "g",
    "defaultQuantity": 500,
    "shelfLifeDays": 240,
    "emoji": "🍝",
    "description": "Organic semolina durum wheat penne pasta. Holds sauces perfectly.",
    "caloriesPer100": 350,
    "image": ""
  },
  {
    "id": "prod_flour",
    "name": "Whole Wheat Atta Flour",
    "category": "Pantry",
    "brand": "Aashirvaad",
    "defaultUnit": "g",
    "defaultQuantity": 2000,
    "shelfLifeDays": 90,
    "emoji": "🌾",
    "description": "100% stone-ground whole wheat flour. Ideal for making soft rotis and flatbreads.",
    "caloriesPer100": 340,
    "image": ""
  },
  {
    "id": "prod_honey",
    "name": "Raw Wildflower Honey",
    "category": "Pantry",
    "brand": "Nate's",
    "defaultUnit": "g",
    "defaultQuantity": 340,
    "shelfLifeDays": 365,
    "emoji": "🍯",
    "description": "100% pure, unfiltered raw wildflower honey. A natural, soothing sweetener.",
    "caloriesPer100": 304,
    "image": ""
  },
  {
    "id": "prod_oats",
    "name": "Rolled Oats Organic",
    "category": "Pantry",
    "brand": "Bob's Red Mill",
    "defaultUnit": "g",
    "defaultQuantity": 800,
    "shelfLifeDays": 120,
    "emoji": "🥣",
    "description": "Whole grain rolled oats. Rich in beta-glucan soluble fiber, perfect for breakfast bowls.",
    "caloriesPer100": 389,
    "image": ""
  },
  {
    "id": "prod_tomato_sauce",
    "name": "Marinara Tomato Sauce",
    "category": "Pantry",
    "brand": "Rao's Homemade",
    "defaultUnit": "g",
    "defaultQuantity": 680,
    "shelfLifeDays": 60,
    "emoji": "🥫",
    "description": "Premium marinara sauce cooked slowly with sweet Italian tomatoes, garlic, and basil.",
    "caloriesPer100": 60,
    "image": ""
  },
  {
    "id": "prod_chickpeas",
    "name": "Organic Canned Chickpeas",
    "category": "Pantry",
    "brand": "Eden Foods",
    "defaultUnit": "g",
    "defaultQuantity": 400,
    "shelfLifeDays": 180,
    "emoji": "🥫",
    "description": "Organic garbanzo beans in a tin. High in protein, zinc, and dietary fiber.",
    "caloriesPer100": 164,
    "image": ""
  },
  {
    "id": "prod_quinoa",
    "name": "Organic White Quinoa",
    "category": "Pantry",
    "brand": "Organic Foods",
    "defaultUnit": "g",
    "defaultQuantity": 500,
    "shelfLifeDays": 180,
    "emoji": "🥣",
    "description": "A gluten-free ancient grain that represents a complete source of plant protein.",
    "caloriesPer100": 368,
    "image": ""
  },
  {
    "id": "prod_green_tea",
    "name": "Organic Sencha Green Tea Bags",
    "category": "Beverages",
    "brand": "Yogi",
    "defaultUnit": "packs",
    "defaultQuantity": 1,
    "shelfLifeDays": 120,
    "emoji": "🍵",
    "description": "Organic Japanese Sencha green tea bags. High in catechins and gentle caffeine.",
    "caloriesPer100": 1,
    "image": ""
  },
  {
    "id": "prod_coffee",
    "name": "Premium Arabica Coffee Beans",
    "category": "Beverages",
    "brand": "Blue Bottle",
    "defaultUnit": "g",
    "defaultQuantity": 340,
    "shelfLifeDays": 45,
    "emoji": "🫘",
    "description": "Whole arabica coffee beans, medium roasted. Rich notes of chocolate and citrus.",
    "caloriesPer100": 2,
    "image": ""
  },
  {
    "id": "prod_almond_milk",
    "name": "Unsweetened Almond Milk",
    "category": "Beverages",
    "brand": "Califia Farms",
    "defaultUnit": "ml",
    "defaultQuantity": 946,
    "shelfLifeDays": 10,
    "emoji": "🥛",
    "description": "Creamy unsweetened almond milk. Low-calorie dairy alternative rich in calcium.",
    "caloriesPer100": 15,
    "image": ""
  },
  {
    "id": "prod_orange_juice",
    "name": "100% Pure Squeezed Orange Juice",
    "category": "Beverages",
    "brand": "Tropicana",
    "defaultUnit": "ml",
    "defaultQuantity": 1000,
    "shelfLifeDays": 8,
    "emoji": "🍊",
    "description": "100% pure squeezed orange juice with pulp. Fresh flavor packed with Vitamin C.",
    "caloriesPer100": 45,
    "image": ""
  },
  {
    "id": "prod_chicken",
    "name": "Organic Chicken Breast",
    "category": "Proteins",
    "brand": "Bell & Evans",
    "defaultUnit": "g",
    "defaultQuantity": 500,
    "shelfLifeDays": 3,
    "emoji": "🍗",
    "description": "Boneless, skinless organic chicken breast. Extremely lean and rich in protein.",
    "caloriesPer100": 165,
    "image": ""
  },
  {
    "id": "prod_salmon",
    "name": "Wild-Caught Atlantic Salmon Fillet",
    "category": "Proteins",
    "brand": "Ocean Harvest",
    "defaultUnit": "g",
    "defaultQuantity": 400,
    "shelfLifeDays": 2,
    "emoji": "🐟",
    "description": "Fresh wild-caught salmon fillet. High in heart-healthy Omega-3 fatty acids.",
    "caloriesPer100": 208,
    "image": ""
  },
  {
    "id": "prod_tofu",
    "name": "Organic Extra Firm Tofu",
    "category": "Proteins",
    "brand": "House Foods",
    "defaultUnit": "g",
    "defaultQuantity": 400,
    "shelfLifeDays": 14,
    "emoji": "🧊",
    "description": "Extra firm organic tofu. Ideal plant-based protein source for frying or baking.",
    "caloriesPer100": 76,
    "image": ""
  }
];

// Procedural Expansion to 500+ items
(function expandProducts() {
  const categories = {
    "Produce": [
      { name: "Avocado", emoji: "🥑", unit: "pieces", qty: 3, life: 5, cals: 160, desc: "Rich, creamy, perfect for toast." },
      { name: "Tomato", emoji: "🍅", unit: "g", qty: 500, life: 7, cals: 18, desc: "Sweet, juicy vine-ripened tomatoes." },
      { name: "Spinach", emoji: "🥬", unit: "g", qty: 200, life: 4, cals: 23, desc: "Tender, pre-washed spinach leaves." },
      { name: "Lemon", emoji: "🍋", unit: "pieces", qty: 5, life: 14, cals: 29, desc: "Highly aromatic, perfect for tea." },
      { name: "Garlic", emoji: "🧄", unit: "g", qty: 100, life: 30, cals: 149, desc: "Pungent organic garlic cloves." },
      { name: "Ginger", emoji: "🫚", unit: "g", qty: 150, life: 21, cals: 80, desc: "Zesty fresh organic ginger root." },
      { name: "Apple", emoji: "🍎", unit: "pieces", qty: 6, life: 20, cals: 52, desc: "Crisp, sweet orchard apples." },
      { name: "Banana", emoji: "🍌", unit: "pieces", qty: 6, life: 5, cals: 89, desc: "Sweet, ripe bananas rich in potassium." },
      { name: "Blueberry", emoji: "🫐", unit: "g", qty: 150, life: 6, cals: 57, desc: "Sweet, antioxidant-rich fresh blueberries." },
      { name: "Strawberry", emoji: "🍓", unit: "g", qty: 250, life: 5, cals: 32, desc: "Juicy sweet organic red strawberries." },
      { name: "Cucumber", emoji: "🥒", unit: "pieces", qty: 2, life: 7, cals: 15, desc: "Cool and refreshing cucumbers." },
      { name: "Carrot", emoji: "🥕", unit: "g", qty: 500, life: 14, cals: 41, desc: "Sweet and crunchy fresh carrots." },
      { name: "Broccoli", emoji: "🥦", unit: "g", qty: 300, life: 7, cals: 34, desc: "Vitamin-rich fresh broccoli florets." },
      { name: "Onion", emoji: "🧅", unit: "g", qty: 1000, life: 30, cals: 40, desc: "Pungent red and yellow cooking onions." },
      { name: "Potato", emoji: "🥔", unit: "g", qty: 1500, life: 30, cals: 77, desc: "Starchy russet cooking potatoes." },
      { name: "Pepper", emoji: "🫑", unit: "pieces", qty: 3, life: 8, cals: 20, desc: "Sweet bell peppers in multiple colors." }
    ],
    "Dairy": [
      { name: "Milk", emoji: "🥛", unit: "ml", qty: 1000, life: 7, cals: 61, desc: "Fresh pasture-raised whole milk." },
      { name: "Cheese", emoji: "🧀", unit: "g", qty: 250, life: 25, cals: 402, desc: "Sharp, rich dairy cheddar cheese." },
      { name: "Yogurt", emoji: "🥛", unit: "g", qty: 500, life: 10, cals: 59, desc: "Creamy, probiotic-rich plain yogurt." },
      { name: "Butter", emoji: "🧈", unit: "g", qty: 250, life: 45, cals: 717, desc: "Rich pasture-raised salted butter." },
      { name: "Cream", emoji: "🥛", unit: "ml", qty: 250, life: 8, cals: 340, desc: "Thick whipping dairy cream." }
    ],
    "Bakery": [
      { name: "Sourdough", emoji: "🍞", unit: "pieces", qty: 1, life: 4, cals: 289, desc: "Crisp country sourdough loaf." },
      { name: "Wheat Bread", emoji: "🍞", unit: "pieces", qty: 1, life: 5, cals: 265, desc: "Soft whole grain wheat bread." },
      { name: "Croissant", emoji: "🥐", unit: "pieces", qty: 4, life: 3, cals: 406, desc: "Buttery, flaky french croissants." },
      { name: "Baguette", emoji: "🥖", unit: "pieces", qty: 1, life: 2, cals: 274, desc: "Traditional crusty French baguette." }
    ],
    "Pantry": [
      { name: "Rice", emoji: "🌾", unit: "g", qty: 1000, life: 180, cals: 365, desc: "Premium aromatic basmati rice." },
      { name: "Olive Oil", emoji: "🫒", unit: "ml", qty: 500, life: 360, cals: 884, desc: "Cold-pressed extra virgin olive oil." },
      { name: "Penne", emoji: "🍝", unit: "g", qty: 500, life: 180, cals: 350, desc: "Durum wheat semolina penne pasta." },
      { name: "Flour", emoji: "🌾", unit: "g", qty: 1000, life: 120, cals: 364, desc: "Fine organic all-purpose flour." },
      { name: "Honey", emoji: "🍯", unit: "g", qty: 350, life: 720, cals: 304, desc: "Pure golden raw organic honey." },
      { name: "Oats", emoji: "🥣", unit: "g", qty: 800, life: 180, cals: 389, desc: "Heart-healthy rolled organic oats." }
    ],
    "Beverages": [
      { name: "Green Tea", emoji: "🍵", unit: "pieces", qty: 25, life: 360, cals: 2, desc: "Organic antioxidant green tea bags." },
      { name: "Coffee", emoji: "☕", unit: "g", qty: 250, life: 90, cals: 5, desc: "Aromatic medium-roasted coffee beans." },
      { name: "Almond Milk", emoji: "🥛", unit: "ml", qty: 1000, life: 14, cals: 15, desc: "Smooth plant-based almond milk." },
      { name: "Orange Juice", emoji: "🥤", unit: "ml", qty: 1000, life: 7, cals: 45, desc: "Freshly squeezed sweet orange juice." }
    ],
    "Proteins": [
      { name: "Chicken", emoji: "🍗", unit: "g", qty: 500, life: 3, cals: 165, desc: "Lean boneless skinless chicken breast." },
      { name: "Salmon", emoji: "🐟", unit: "g", qty: 400, life: 2, cals: 208, desc: "Fresh rich Omega-3 Atlantic salmon." },
      { name: "Tofu", emoji: "🧊", unit: "g", qty: 400, life: 14, cals: 76, desc: "Plant-based extra-firm organic tofu." },
      { name: "Beef", emoji: "🥩", unit: "g", qty: 500, life: 3, cals: 250, desc: "Grass-fed lean ground beef." },
      { name: "Eggs", emoji: "🥚", unit: "pieces", qty: 12, life: 21, cals: 143, desc: "Pasture-raised grade A large brown eggs." }
    ],
    "Frozen": [
      { name: "Frozen Peas", emoji: "🫛", unit: "g", qty: 500, life: 180, cals: 81, desc: "Sweet garden peas frozen at peak freshness." },
      { name: "Frozen Berries", emoji: "🫐", unit: "g", qty: 400, life: 120, cals: 50, desc: "Mixed frozen organic berries." },
      { name: "Ice Cream", emoji: "🍦", unit: "ml", qty: 500, life: 60, cals: 207, desc: "Creamy gourmet vanilla bean ice cream." }
    ],
    "Snacks": [
      { name: "Potato Chips", emoji: "🥔", unit: "g", qty: 150, life: 60, cals: 536, desc: "Crisp kettle-cooked sea salt chips." },
      { name: "Almonds", emoji: "🫘", unit: "g", qty: 250, life: 90, cals: 579, desc: "Crunchy premium roasted salted almonds." },
      { name: "Chocolate Bar", emoji: "🍫", unit: "g", qty: 80, life: 180, cals: 546, desc: "Rich 70% dark Belgian chocolate." }
    ],
    "Spices": [
      { name: "Black Pepper", emoji: "🧂", unit: "g", qty: 50, life: 360, cals: 250, desc: "Freshly ground organic black pepper." },
      { name: "Cinnamon", emoji: "🪵", unit: "g", qty: 40, life: 360, cals: 247, desc: "Sweet aromatic ground Ceylon cinnamon." },
      { name: "Salt", emoji: "🧂", unit: "g", qty: 500, life: 720, cals: 0, desc: "Fine sea salt rich in minerals." }
    ]
  };

  const prefixes = ["Organic", "Premium", "Fresh", "Pure", "Artisan", "Healthy Choice", "Gourmet", "Natural", "Local Farms", "Vesta Select"];
  const brands = ["Organic Valley", "Earth Harvest", "Green Meadow", "Ocean Pride", "Vesta Pure", "Sunny Orchard", "Golden Gate", "Alpine Fresh", "Bella Italia", "Royal Choice"];

  let count = PRODUCTS_DB.length;
  const categoriesList = Object.keys(categories);

  // Keep generating products until we have at least 510 unique products
  let loopSafety = 0;
  while (count < 510 && loopSafety < 1000) {
    loopSafety++;
    const cat = categoriesList[count % categoriesList.length];
    const baseList = categories[cat];
    const base = baseList[Math.floor(Math.random() * baseList.length)];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const name = `${prefix} ${base.name}`;
    
    // Check if name is already in the database
    if (PRODUCTS_DB.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      continue;
    }

    const id = `prod_gen_${count}`;
    
    PRODUCTS_DB.push({
      id: id,
      name: name,
      category: cat,
      brand: brand,
      defaultUnit: base.unit,
      defaultQuantity: base.qty,
      shelfLifeDays: base.life + Math.floor(Math.random() * 5) - 2, // slightly vary shelf life
      emoji: base.emoji,
      description: `${prefix} selection of ${base.name.toLowerCase()}. ${base.desc}`,
      caloriesPer100: base.cals,
      image: ""
    });
    
    count++;
  }
})();

window.PRODUCTS_DB = PRODUCTS_DB;
