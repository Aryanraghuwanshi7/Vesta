/**
 * Vesta — Nutrition reference data (expanded to 500+ items)
 */
const NUTRITION_DB = {
  prod_avocado: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, vitaminC: 10 },
  prod_tomato: { calories: 18, protein: 1, carbs: 4, fat: 0, fiber: 1, vitaminC: 14 },
  prod_spinach: { calories: 23, protein: 3, carbs: 4, fat: 0, fiber: 2, iron: 15 },
  prod_milk: { calories: 61, protein: 3, carbs: 5, fat: 3, calcium: 12, vitaminD: 15 },
  prod_eggs: { calories: 143, protein: 13, carbs: 1, fat: 10, choline: 25 },
  prod_rice: { calories: 365, protein: 7, carbs: 80, fat: 1, fiber: 1 },
  prod_olive_oil: { calories: 884, protein: 0, carbs: 0, fat: 100, vitaminE: 14 },
  prod_chicken: { calories: 165, protein: 31, carbs: 0, fat: 4, iron: 5 },
  prod_salmon: { calories: 208, protein: 20, carbs: 0, fat: 13, omega3: 22 },
  prod_oats: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11 },
  prod_blueberry: { calories: 57, protein: 1, carbs: 14, fat: 0, fiber: 2, antioxidants: 90 },
  prod_basil: { calories: 22, protein: 3, carbs: 2, fat: 1, vitaminK: 85 },
};

// Dynamically generate nutrition entries for all 500+ products in the catalog
(function expandNutrition() {
  const products = window.PRODUCTS_DB || [];
  
  products.forEach(p => {
    // If already in static list, skip
    if (NUTRITION_DB[p.id]) return;
    
    const name = p.name.toLowerCase();
    const cat = p.category;
    
    let calories = p.caloriesPer100 || 50;
    let protein = 1;
    let carbs = 10;
    let fat = 0;
    let fiber = 1;
    let micro = {};

    if (cat === "Produce") {
      // Fruits
      if (name.includes("apple") || name.includes("banana") || name.includes("berry") || 
          name.includes("fruit") || name.includes("orange") || name.includes("lemon") || 
          name.includes("grape") || name.includes("mango") || name.includes("pineapple") ||
          name.includes("strawberry") || name.includes("blueberry")) {
        calories = p.caloriesPer100 || 60;
        protein = 1;
        carbs = 14;
        fat = 0;
        fiber = 3;
        micro = { vitaminC: 15 };
      } else {
        // Vegetables
        if (name.includes("potato") || name.includes("sweet potato") || name.includes("yam")) {
          calories = p.caloriesPer100 || 80;
          protein = 2;
          carbs = 18;
          fat = 0;
          fiber = 2;
          micro = { potassium: 12 };
        } else if (name.includes("garlic") || name.includes("ginger")) {
          calories = p.caloriesPer100 || 120;
          protein = 4;
          carbs = 25;
          fat = 0;
          fiber = 2;
          micro = { antioxidants: 30 };
        } else {
          // Leafy greens / cucumbers / peppers
          calories = p.caloriesPer100 || 25;
          protein = 2;
          carbs = 4;
          fat = 0;
          fiber = 2;
          micro = { vitaminA: 20 };
        }
      }
    } else if (cat === "Dairy") {
      if (name.includes("butter") || name.includes("ghee")) {
        calories = p.caloriesPer100 || 717;
        protein = 0;
        carbs = 0;
        fat = 81;
        fiber = 0;
      } else if (name.includes("cheese") || name.includes("paneer") || name.includes("feta") || name.includes("cheddar")) {
        calories = p.caloriesPer100 || 350;
        protein = 22;
        carbs = 2;
        fat = 28;
        fiber = 0;
        micro = { calcium: 20 };
      } else {
        // Milk, yogurt, cream
        calories = p.caloriesPer100 || 65;
        protein = 3;
        carbs = 5;
        fat = 4;
        fiber = 0;
        micro = { calcium: 10 };
      }
    } else if (cat === "Bakery") {
      calories = p.caloriesPer100 || 270;
      protein = 8;
      carbs = 50;
      fat = 3;
      fiber = 4;
    } else if (cat === "Pantry") {
      if (name.includes("oil")) {
        calories = p.caloriesPer100 || 884;
        protein = 0;
        carbs = 0;
        fat = 100;
        fiber = 0;
      } else if (name.includes("honey") || name.includes("sugar") || name.includes("sweetener")) {
        calories = p.caloriesPer100 || 300;
        protein = 0;
        carbs = 82;
        fat = 0;
        fiber = 0;
      } else if (name.includes("chickpeas") || name.includes("beans") || name.includes("lentil") || name.includes("dal")) {
        calories = p.caloriesPer100 || 140;
        protein = 9;
        carbs = 22;
        fat = 1.5;
        fiber = 7;
        micro = { iron: 10 };
      } else {
        // Grains, flours, oats, pasta, rice
        calories = p.caloriesPer100 || 360;
        protein = 10;
        carbs = 72;
        fat = 2;
        fiber = 6;
      }
    } else if (cat === "Beverages") {
      if (name.includes("coffee") || name.includes("tea")) {
        calories = p.caloriesPer100 || 2;
        protein = 0;
        carbs = 0;
        fat = 0;
        fiber = 0;
      } else {
        // Juices, milks
        calories = p.caloriesPer100 || 40;
        protein = 1;
        carbs = 9;
        fat = 0.5;
        fiber = 1;
      }
    } else if (cat === "Proteins") {
      if (name.includes("chicken") || name.includes("turkey")) {
        calories = p.caloriesPer100 || 165;
        protein = 31;
        fat = 4;
        carbs = 0;
        fiber = 0;
        micro = { iron: 6 };
      } else if (name.includes("beef") || name.includes("lamb") || name.includes("pork") || name.includes("steak")) {
        calories = p.caloriesPer100 || 240;
        protein = 26;
        fat = 15;
        carbs = 0;
        fiber = 0;
        micro = { iron: 15 };
      } else if (name.includes("salmon") || name.includes("tuna") || name.includes("fish") || name.includes("shrimp")) {
        calories = p.caloriesPer100 || 190;
        protein = 22;
        fat = 11;
        carbs = 0;
        fiber = 0;
        micro = { omega3: 20 };
      } else if (name.includes("tofu") || name.includes("tempeh")) {
        calories = p.caloriesPer100 || 90;
        protein = 10;
        fat = 5;
        carbs = 2;
        fiber = 1;
        micro = { calcium: 15 };
      } else {
        calories = p.caloriesPer100 || 140;
        protein = 13;
        fat = 9;
        carbs = 1;
        fiber = 0;
      }
    } else if (cat === "Snacks") {
      if (name.includes("almond") || name.includes("cashew") || name.includes("nut") || name.includes("peanut")) {
        calories = p.caloriesPer100 || 600;
        protein = 18;
        carbs = 20;
        fat = 52;
        fiber = 8;
        micro = { magnesium: 20 };
      } else if (name.includes("chocolate")) {
        calories = p.caloriesPer100 || 540;
        protein = 5;
        carbs = 58;
        fat = 32;
        fiber = 6;
      } else {
        calories = p.caloriesPer100 || 480;
        protein = 6;
        carbs = 60;
        fat = 24;
        fiber = 3;
      }
    } else if (cat === "Spices") {
      if (name.includes("salt")) {
        calories = 0;
        protein = 0;
        carbs = 0;
        fat = 0;
        fiber = 0;
      } else {
        calories = p.caloriesPer100 || 250;
        protein = 4;
        carbs = 40;
        fat = 2;
        fiber = 10;
      }
    }

    NUTRITION_DB[p.id] = {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      fiber: Math.round(fiber),
      ...micro
    };
  });
})();

function getNutrition(productId) {
  return NUTRITION_DB[productId] || null;
}

function getCaloriesLabel(productId, fallback = 50) {
  const n = getNutrition(productId);
  return n ? `~${n.calories} kcal / 100g` : `~${fallback} kcal / unit`;
}

window.NUTRITION_DB = NUTRITION_DB;
window.getNutrition = getNutrition;
window.getCaloriesLabel = getCaloriesLabel;
