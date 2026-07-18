/**
 * Vesta — Default inventory seed data & low-stock rules
 */

const LOW_STOCK_RULES = {
  prod_milk: { threshold: 1000, unit: "ml", label: "Milk < 1L" },
  prod_eggs: { threshold: 4, unit: "pieces", label: "Eggs < 4" },
  prod_rice: { threshold: 500, unit: "g", label: "Rice < 500g" },
  "organic whole milk": { threshold: 1000, unit: "ml" },
  "pasture-raised brown eggs": { threshold: 4, unit: "pieces" },
  "premium basmati rice": { threshold: 500, unit: "g" },
};

const INITIAL_INVENTORY_SEED = [
  {
    id: "inv_basil",
    productId: "prod_basil",
    name: "Fresh Sweet Basil Sprigs",
    category: "Produce",
    brand: "Garden Fresh",
    unit: "g",
    favorite: true,
    emoji: "🌿",
    notes: "Use for pesto this week",
    lowStockManual: false,
    batches: [
      {
        id: "batch_basil_1",
        quantity: 45,
        expiryDate: new Date(Date.now() + 3 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
      },
    ],
    dateAdded: new Date().toISOString().split("T")[0],
  },
  {
    id: "inv_olive_oil",
    productId: "prod_olive_oil",
    name: "Extra Virgin Olive Oil",
    category: "Pantry",
    brand: "Filippo Berio",
    unit: "ml",
    favorite: true,
    emoji: "🫒",
    notes: "",
    lowStockManual: false,
    batches: [
      {
        id: "batch_oil_1",
        quantity: 360,
        expiryDate: new Date(Date.now() + 150 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date(Date.now() - 7 * 86400000)
          .toISOString()
          .split("T")[0],
      },
    ],
    dateAdded: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
  },
  {
    id: "inv_sourdough",
    productId: "prod_sourdough",
    name: "Country Sourdough Bread",
    category: "Bakery",
    brand: "Artisan Bakery",
    unit: "pieces",
    favorite: false,
    emoji: "🍞",
    notes: "",
    lowStockManual: false,
    batches: [
      {
        id: "batch_bread_1",
        quantity: 1,
        expiryDate: new Date(Date.now() + 1 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date(Date.now() - 3 * 86400000)
          .toISOString()
          .split("T")[0],
      },
    ],
    dateAdded: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
  },
  {
    id: "inv_lemons",
    productId: "prod_lemon",
    name: "Fresh Meyer Lemons",
    category: "Produce",
    brand: "Fresh Organic",
    unit: "pieces",
    favorite: false,
    emoji: "🍋",
    notes: "",
    lowStockManual: false,
    batches: [
      {
        id: "batch_lemon_1",
        quantity: 4,
        expiryDate: new Date(Date.now() + 10 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date(Date.now() - 4 * 86400000)
          .toISOString()
          .split("T")[0],
      },
    ],
    dateAdded: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
  },
  {
    id: "inv_avocado",
    productId: "prod_avocado",
    name: "Organic Hass Avocado",
    category: "Produce",
    brand: "Fresh Organic",
    unit: "pieces",
    favorite: false,
    emoji: "🥑",
    notes: "Check before using in salad",
    lowStockManual: false,
    batches: [
      {
        id: "batch_avo_1",
        quantity: 2,
        expiryDate: new Date(Date.now() - 2 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date(Date.now() - 7 * 86400000)
          .toISOString()
          .split("T")[0],
      },
    ],
    dateAdded: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
  },
  {
    id: "inv_milk",
    productId: "prod_milk",
    name: "Organic Whole Milk",
    category: "Dairy",
    brand: "Organic Valley",
    unit: "ml",
    favorite: false,
    emoji: "🥛",
    notes: "",
    lowStockManual: false,
    batches: [
      {
        id: "batch_milk_1",
        quantity: 600,
        expiryDate: new Date(Date.now() + 4 * 86400000)
          .toISOString()
          .split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
      },
    ],
    dateAdded: new Date().toISOString().split("T")[0],
  },
];

window.LOW_STOCK_RULES = LOW_STOCK_RULES;
window.INITIAL_INVENTORY_SEED = INITIAL_INVENTORY_SEED;
