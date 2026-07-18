/**
 * Vesta — Curated recipe dataset (lightweight subset)
 * Ingredients reference product IDs from products.js
 */
const RECIPES_DB = [
  {
    id: "rec_sourdough_toast",
    name: "Herbed Lemon Garlic Sourdough Toast",
    readyMinutes: 20,
    servings: 2,
    difficulty: "easy",
    emoji: "🍳",
    mealType: "breakfast",
    tags: ["breakfast", "quick", "vegetarian"],
    description:
      "Crisp sourdough infused with garlic and olive oil, finished with fresh basil and lemon zest.",
    ingredients: [
      { productId: "prod_sourdough", amount: 2, unit: "slices", optional: false },
      { productId: "prod_garlic", amount: 2, unit: "cloves", optional: false },
      { productId: "prod_olive_oil", amount: 15, unit: "ml", optional: false },
      { productId: "prod_basil", amount: 10, unit: "g", optional: false },
      { productId: "prod_lemon", amount: 1, unit: "piece", optional: true },
    ],
    steps: [
      "Preheat your oven grill or toaster to medium-high heat.",
      "Slice the sourdough bread into 2 even, thick slices.",
      "Toast the slices for 3–4 minutes until golden brown and crisp on both sides.",
      "While warm, rub each slice firmly with a halved garlic clove — the heat opens the bread's pores and absorbs the garlic aroma deeply.",
      "Drizzle generously with extra virgin olive oil, letting it soak into the warm toast.",
      "Zest half a lemon over the toast for brightness, then squeeze a few drops of juice.",
      "Tear fresh basil leaves and scatter them evenly across both slices.",
      "Season with a pinch of flaky sea salt and cracked black pepper. Serve immediately.",
    ],
  },
  {
    id: "rec_tomato_salad",
    name: "Garden Tomato & Basil Salad",
    readyMinutes: 15,
    servings: 4,
    difficulty: "easy",
    emoji: "🥗",
    mealType: "lunch",
    tags: ["salad", "summer", "vegetarian"],
    description:
      "A cooling organic salad with vine tomatoes, torn basil, olive oil, and crumbled feta.",
    ingredients: [
      { productId: "prod_tomato", amount: 400, unit: "g", optional: false },
      { productId: "prod_basil", amount: 15, unit: "g", optional: false },
      { productId: "prod_olive_oil", amount: 30, unit: "ml", optional: false },
      { productId: "prod_feta", amount: 80, unit: "g", optional: true },
    ],
    steps: [
      "Wash and dry the vine tomatoes thoroughly.",
      "Slice tomatoes into varied thicknesses — some halved, some in rounds — for visual interest.",
      "Arrange on a large chilled serving plate.",
      "Pick fresh basil leaves and gently tear them (never cut, to prevent bruising) over the tomatoes.",
      "Drizzle with a generous amount of high-quality extra virgin olive oil.",
      "Season with flaky sea salt and freshly cracked black pepper.",
      "If using feta, crumble it in large pieces across the top.",
      "Allow the salad to rest for 5 minutes at room temperature before serving so the flavors meld.",
    ],
  },
  {
    id: "rec_avocado_toast",
    name: "Smashed Avocado Morning Toast",
    readyMinutes: 10,
    servings: 2,
    difficulty: "easy",
    emoji: "🥑",
    mealType: "breakfast",
    tags: ["breakfast", "healthy", "quick"],
    description: "Creamy avocado on toasted sourdough with Meyer lemon and soft eggs.",
    ingredients: [
      { productId: "prod_avocado", amount: 1, unit: "piece", optional: false },
      { productId: "prod_sourdough", amount: 2, unit: "slices", optional: false },
      { productId: "prod_lemon", amount: 1, unit: "piece", optional: true },
      { productId: "prod_eggs", amount: 2, unit: "pieces", optional: true },
    ],
    steps: [
      "If using eggs, bring a small saucepan of water to a gentle boil for poaching or soft-boiling.",
      "Toast sourdough slices in a toaster or grill pan until deeply golden and crisp.",
      "Halve the ripe avocado and remove the stone; scoop the flesh into a bowl.",
      "Add a squeeze of fresh lemon juice, a pinch of sea salt, and red chili flakes if desired.",
      "Smash with a fork to your preferred texture — chunky or smooth.",
      "Spread the avocado generously over each warm toast slice.",
      "If poaching eggs, slide them gently into barely simmering water for 3 minutes until whites are set.",
      "Top each toast with a poached or sliced soft-boiled egg. Finish with cracked pepper and a drizzle of olive oil.",
    ],
  },
  {
    id: "rec_chicken_bowl",
    name: "Mediterranean Chicken Bowl",
    readyMinutes: 35,
    servings: 3,
    difficulty: "medium",
    emoji: "🍗",
    mealType: "dinner",
    tags: ["dinner", "protein", "balanced"],
    description: "Lean chicken over basmati rice with roasted tomatoes and wilted spinach.",
    ingredients: [
      { productId: "prod_chicken", amount: 400, unit: "g", optional: false },
      { productId: "prod_rice", amount: 200, unit: "g", optional: false },
      { productId: "prod_tomato", amount: 200, unit: "g", optional: false },
      { productId: "prod_spinach", amount: 100, unit: "g", optional: false },
      { productId: "prod_olive_oil", amount: 20, unit: "ml", optional: false },
    ],
    steps: [
      "Rinse basmati rice under cold water until the water runs clear.",
      "Cook rice with 1.5x water, a pinch of salt, and a bay leaf until fluffy; fluff with a fork and set aside.",
      "Butterfly and season chicken breasts with salt, pepper, dried oregano, and a drizzle of olive oil.",
      "Heat a grill pan or skillet over medium-high heat and sear chicken 4–5 minutes each side until golden with an internal temp of 75°C.",
      "Rest chicken for 5 minutes before slicing on the diagonal.",
      "In the same pan, add tomato halves cut-side down and roast until softened and slightly charred.",
      "Add a handful of spinach to the warm pan, toss briefly until just wilted.",
      "Assemble bowls: rice base, sliced chicken, roasted tomatoes, and wilted spinach. Finish with a squeeze of lemon.",
    ],
  },
  {
    id: "rec_pasta_marinara",
    name: "Penne Marinara with Basil",
    readyMinutes: 25,
    servings: 4,
    difficulty: "easy",
    emoji: "🍝",
    mealType: "dinner",
    tags: ["dinner", "comfort", "vegetarian"],
    description: "Classic penne in slow-cooked marinara, finished with sweet basil.",
    ingredients: [
      { productId: "prod_pasta", amount: 400, unit: "g", optional: false },
      { productId: "prod_tomato_sauce", amount: 400, unit: "g", optional: false },
      { productId: "prod_basil", amount: 12, unit: "g", optional: false },
      { productId: "prod_garlic", amount: 3, unit: "cloves", optional: true },
    ],
    steps: [
      "Bring a large pot of water to a rolling boil; add 1 tbsp of salt.",
      "Add penne and cook according to package directions, typically 10–12 minutes for al dente. Reserve 1 cup of pasta water before draining.",
      "Meanwhile, warm a drizzle of olive oil in a wide saucepan over medium heat.",
      "Add minced garlic and fry gently for 60 seconds until fragrant but not colored.",
      "Pour in the marinara sauce and stir well. Simmer for 8–10 minutes until slightly thickened.",
      "Add drained pasta to the sauce. Toss vigorously, adding a splash of reserved pasta water to help the sauce coat every piece.",
      "Remove from heat and fold in freshly torn basil leaves.",
      "Serve immediately in warmed bowls, topped with grated Parmesan if desired.",
    ],
  },
  {
    id: "rec_oats_bowl",
    name: "Honey Berry Overnight Oats",
    readyMinutes: 5,
    servings: 2,
    difficulty: "easy",
    emoji: "🥣",
    mealType: "breakfast",
    tags: ["breakfast", "meal-prep", "vegetarian"],
    description: "Creamy overnight oats with wildflower honey and fresh blueberries.",
    ingredients: [
      { productId: "prod_oats", amount: 80, unit: "g", optional: false },
      { productId: "prod_honey", amount: 20, unit: "g", optional: false },
      { productId: "prod_blueberry", amount: 100, unit: "g", optional: false },
      { productId: "prod_almond_milk", amount: 250, unit: "ml", optional: false },
    ],
    steps: [
      "Measure out rolled oats into two mason jars or containers with lids.",
      "Pour almond milk over the oats, ensuring they are fully submerged (about 1.5x the volume of oats).",
      "Add a drizzle of wildflower honey and stir well to combine.",
      "Optionally add a pinch of cinnamon or vanilla extract for extra depth of flavor.",
      "Seal the jars and refrigerate for at least 6 hours, or ideally overnight.",
      "In the morning, give the oats a good stir — add a splash more milk if too thick.",
      "Wash and dry the blueberries and arrange them generously on top.",
      "Finish with a final drizzle of honey and serve cold directly from the jar.",
    ],
  },
  {
    id: "rec_lemon_potatoes",
    name: "Roasted Lemon Herb Potatoes",
    readyMinutes: 40,
    servings: 4,
    difficulty: "easy",
    emoji: "🥔",
    mealType: "dinner",
    tags: ["side", "comfort", "vegetarian"],
    description: "Golden roasted potatoes with garlic, lemon, and olive oil.",
    ingredients: [
      { productId: "prod_potato", amount: 600, unit: "g", optional: false },
      { productId: "prod_garlic", amount: 4, unit: "cloves", optional: false },
      { productId: "prod_lemon", amount: 1, unit: "piece", optional: false },
      { productId: "prod_olive_oil", amount: 30, unit: "ml", optional: false },
    ],
    steps: [
      "Preheat the oven to 210°C (fan 190°C).",
      "Scrub potatoes well; no need to peel. Cut into even 3cm wedges.",
      "Parboil the wedges in salted water for 8 minutes until just beginning to soften. Drain and allow to steam-dry completely.",
      "Transfer to a large baking tray. Drizzle with olive oil, ensuring every piece is well coated.",
      "Add crushed (not chopped) garlic cloves, lemon zest, a squeeze of lemon juice, and dried rosemary or thyme.",
      "Season generously with sea salt and black pepper. Toss everything together.",
      "Roast for 25–30 minutes, turning halfway, until deep golden and crispy on the outside.",
      "Remove from oven, squeeze over the remaining lemon juice, and garnish with fresh parsley before serving.",
    ],
  },
  {
    id: "rec_spinach_eggs",
    name: "Spinach & Feta Scramble",
    readyMinutes: 12,
    servings: 2,
    difficulty: "easy",
    emoji: "🍳",
    mealType: "breakfast",
    tags: ["breakfast", "protein", "quick"],
    description: "Fluffy eggs with wilted spinach and tangy feta.",
    ingredients: [
      { productId: "prod_eggs", amount: 4, unit: "pieces", optional: false },
      { productId: "prod_spinach", amount: 80, unit: "g", optional: false },
      { productId: "prod_feta", amount: 40, unit: "g", optional: true },
      { productId: "prod_butter", amount: 10, unit: "g", optional: true },
    ],
    steps: [
      "Crack the eggs into a bowl and whisk with a splash of water, salt, and pepper until fully combined and slightly frothy.",
      "Wash the spinach and shake off excess water. Pick or roughly chop the larger leaves.",
      "Heat a non-stick pan over medium heat and add the butter, swirling to coat as it melts.",
      "Add the spinach to the pan and toss until just wilted, about 1 minute. Season lightly with salt.",
      "Reduce heat to low and pour in the beaten eggs. Let sit undisturbed for 20 seconds until the edges start to set.",
      "Using a silicone spatula, gently push the eggs from the edges to the center in long, slow folds. Do not rush.",
      "Remove from heat while still slightly glossy — residual heat will finish cooking them.",
      "Crumble feta over the top and serve immediately on warm plates with toast on the side.",
    ],
  },
  {
    id: "rec_chickpea_rice",
    name: "Warm Chickpea & Rice Pilaf",
    readyMinutes: 30,
    servings: 4,
    difficulty: "easy",
    emoji: "🫕",
    mealType: "lunch",
    tags: ["lunch", "vegetarian", "pantry"],
    description: "A hearty pilaf using pantry chickpeas, rice, and aromatics.",
    ingredients: [
      { productId: "prod_rice", amount: 250, unit: "g", optional: false },
      { productId: "prod_chickpeas", amount: 400, unit: "g", optional: false },
      { productId: "prod_onion", amount: 1, unit: "piece", optional: false },
      { productId: "prod_olive_oil", amount: 20, unit: "ml", optional: false },
    ],
    steps: [
      "Rinse the basmati or long-grain rice in cold water 2–3 times until the water runs mostly clear.",
      "Drain the canned chickpeas and rinse under cold water; set aside.",
      "Dice the onion finely. Heat olive oil in a heavy-bottomed pot over medium heat.",
      "Fry the onion for 7–8 minutes, stirring occasionally, until soft, translucent, and just starting to turn golden at the edges.",
      "Add the rinsed rice and toast it in the onion oil for 1–2 minutes, stirring constantly, until slightly glossy.",
      "Pour in 500ml of warm water or vegetable stock and season with a generous pinch of salt and cumin.",
      "Bring to a boil, then immediately reduce heat to the lowest setting, cover tightly, and cook for 12–15 minutes without lifting the lid.",
      "Gently fold in the drained chickpeas, replace the lid, and let rest off heat for 5 minutes. Fluff with a fork and serve warm.",
    ],
  },
  {
    id: "rec_salmon_bowl",
    name: "Citrus Salmon & Greens Bowl",
    readyMinutes: 28,
    servings: 2,
    difficulty: "medium",
    emoji: "🐟",
    mealType: "dinner",
    tags: ["dinner", "protein", "healthy"],
    description: "Pan-seared salmon with lemon-dressed spinach and avocado.",
    ingredients: [
      { productId: "prod_salmon", amount: 300, unit: "g", optional: false },
      { productId: "prod_spinach", amount: 120, unit: "g", optional: false },
      { productId: "prod_avocado", amount: 1, unit: "piece", optional: true },
      { productId: "prod_lemon", amount: 1, unit: "piece", optional: false },
      { productId: "prod_olive_oil", amount: 15, unit: "ml", optional: false },
    ],
    steps: [
      "Pat the salmon fillets completely dry using paper towels — this is key to a golden crust.",
      "Season generously with sea salt, cracked pepper, and a pinch of smoked paprika on the flesh side.",
      "Heat a skillet over medium-high heat until very hot. Add olive oil and let it shimmer.",
      "Place salmon skin-side down in the pan without moving it. Press gently for 10 seconds to ensure full contact. Cook 4 minutes until the skin is deeply crisp.",
      "Flip carefully and cook flesh-side down for 2–3 minutes until just cooked through. The center should remain slightly translucent.",
      "Remove salmon from pan and rest on a warm plate. Squeeze fresh lemon juice over immediately.",
      "In a bowl, dress spinach with olive oil, a squeeze of lemon, salt, and pepper. Toss until lightly coated.",
      "Halve and slice the avocado. Assemble bowls with dressed spinach, sliced avocado, and the rested salmon on top. Finish with lemon zest.",
    ],
  },
];

// Procedural Expansion to 525+ items
(function expandRecipes() {
  const templates = [
    {
      nameTemplate: "North Indian [Ingredient] Masala",
      descriptionTemplate: "A rich and aromatic North Indian curry featuring tender [Ingredient] simmered in a spiced tomato-onion gravy.",
      tags: ["indian", "north-indian", "curry", "dinner", "comfort"],
      mealType: "dinner",
      cuisine: "North Indian",
      difficulty: "medium",
      emoji: "🍛",
      readyMinutes: 35,
      baseIngredients: ["prod_onion", "prod_tomato", "prod_ginger", "prod_garlic"],
      cat1: ["Proteins", "Produce", "Pantry", "Dairy"],
      steps: [
        "Heat oil in a heavy pan and add whole spices (bay leaf, cloves, cardamom) for 30 seconds.",
        "Add finely chopped onions and fry on medium heat for 10–12 minutes until deep golden brown.",
        "Stir in grated ginger and minced garlic, cooking for 2 more minutes until aromatic.",
        "Add tomato puree and cook until the mixture dries out and oil begins to separate on the sides.",
        "Add ground cumin, coriander, turmeric, and chili powder; stir and cook the masala for 2 minutes.",
        "Add the [Ingredient], stir well to coat in the masala, and cook on medium heat for 5 minutes.",
        "Pour in ½ cup of warm water or stock, cover, and simmer on low heat for 15–20 minutes until fully tender.",
        "Adjust salt and spices, garnish with fresh coriander leaves, and serve hot with naan or basmati rice.",
      ]
    },
    {
      nameTemplate: "South Indian [Ingredient] Sambar",
      descriptionTemplate: "A comforting South Indian lentil stew packed with [Ingredient] and flavored with tamarind and fresh sambar powder.",
      tags: ["indian", "south-indian", "healthy", "lunch", "soup"],
      mealType: "lunch",
      cuisine: "South Indian",
      difficulty: "medium",
      emoji: "🍲",
      readyMinutes: 30,
      baseIngredients: ["prod_tomato", "prod_onion"],
      cat1: ["Produce", "Pantry"],
      steps: [
        "Wash ½ cup of toor dal (split pigeon peas) and pressure cook with 2 cups water and a pinch of turmeric for 3–4 whistles until very soft.",
        "Soak a marble-sized ball of tamarind in ½ cup of warm water for 10 minutes; squeeze out the pulp and discard the fiber.",
        "In a pot, combine the tamarind water with the [Ingredient] (cut into bite-size pieces), chopped onion, tomato, and salt. Cook for 10–12 minutes.",
        "Whisk the pressure-cooked dal until smooth and pour it into the pot. Stir in 1.5 tsp sambar powder.",
        "Bring to a simmer and cook for 5–7 more minutes until the sambar thickens slightly and all vegetables are tender.",
        "Prepare the tadka: heat coconut oil in a small pan, add mustard seeds and let them splutter.",
        "Add dried red chilies, curry leaves, and a pinch of asafoetida. Pour the hot tadka over the sambar.",
        "Stir gently, adjust salt, and serve piping hot with steamed rice and a dollop of ghee.",
      ]
    },
    {
      nameTemplate: "Spiced [Ingredient] Biryani",
      descriptionTemplate: "An aromatic layered rice dish made with premium basmati rice, fragrant spices, and tender [Ingredient].",
      tags: ["indian", "dinner", "comfort", "celebration"],
      mealType: "dinner",
      cuisine: "Indian",
      difficulty: "hard",
      emoji: "🥘",
      readyMinutes: 50,
      baseIngredients: ["prod_rice", "prod_onion", "prod_garlic", "prod_ginger"],
      cat1: ["Proteins", "Produce", "Dairy"],
      steps: [
        "Wash and soak basmati rice for 30 minutes, then drain. Bring a large pot of water to boil with whole spices (star anise, cinnamon stick, bay leaf). Parboil rice until exactly 70% cooked.",
        "Marinate the [Ingredient] in yogurt, ginger-garlic paste, turmeric, red chili, garam masala, and lemon juice for at least 30 minutes.",
        "Slice onions thinly and deep-fry until deep golden brown and crispy. Drain on paper towels — these are your 'birista' (fried onions).",
        "Cook the marinated [Ingredient] in a heavy pan with oil until it changes color and is about 80% cooked. Set aside.",
        "In a large heavy-bottomed pot, layer half the parboiled rice, then all the cooked [Ingredient], and half the fried onions.",
        "Top with the remaining rice, the rest of the fried onions, and a few drops of saffron-infused milk.",
        "Seal the pot tightly with aluminum foil and then the lid. Cook on lowest heat for 20 minutes ('dum' method).",
        "Remove from heat and rest sealed for 5 minutes. Open carefully, gently fold the layers, and serve with raita.",
      ]
    },
    {
      nameTemplate: "Indian Breakfast [Ingredient] Poha",
      descriptionTemplate: "A light and healthy breakfast staple made of flattened rice, seasoned with mustard seeds, turmeric, and fresh [Ingredient].",
      tags: ["indian", "breakfast", "quick", "vegetarian"],
      mealType: "breakfast",
      cuisine: "Indian",
      difficulty: "easy",
      emoji: "🥣",
      readyMinutes: 15,
      baseIngredients: ["prod_onion", "prod_lemon"],
      cat1: ["Produce", "Snacks"],
      steps: [
        "Place thick poha (flattened rice) in a large bowl and rinse under cold running water for 1–2 minutes until softened but not mushy. Drain and set aside.",
        "Finely dice the onion. Chop the green chili. If using potatoes, peel and cube into tiny pieces.",
        "Heat oil in a wide pan over medium heat. Add mustard seeds and let them splutter for 30 seconds.",
        "Add the green chili and [Ingredient] and sauté for 2 minutes.",
        "Add the chopped onion and fry for 4–5 minutes until translucent and slightly golden.",
        "Reduce heat to low. Add turmeric, salt, and a pinch of sugar; stir to mix.",
        "Add the drained poha to the pan and toss gently using a spatula so the poha is evenly coated in the turmeric oil.",
        "Remove from heat, squeeze fresh lemon juice over the top, and garnish with freshly chopped coriander and sev if available.",
      ]
    },
    {
      nameTemplate: "Coastal [Ingredient] Curry",
      descriptionTemplate: "A creamy and flavorful coastal curry made with coconut milk, tangy tamarind, and tender [Ingredient].",
      tags: ["indian", "south-indian", "dinner", "creamy"],
      mealType: "dinner",
      cuisine: "South Indian",
      difficulty: "medium",
      emoji: "🍛",
      readyMinutes: 40,
      baseIngredients: ["prod_ginger", "prod_garlic", "prod_onion"],
      cat1: ["Proteins", "Produce"],
      steps: [
        "Prepare the spice paste: dry-roast 1 tsp coriander seeds, 2 dried red chilies, and 2 tbsp grated coconut. Blend with a little water into a smooth paste.",
        "Heat coconut oil in a clay pot or deep pan. Add sliced onions and fry until soft and golden.",
        "Add grated ginger and garlic; cook on medium heat for 2 minutes until raw smell is gone.",
        "Stir in the prepared spice paste along with turmeric and cook on low heat for 3 minutes.",
        "Pour in 300ml of thick coconut milk. Stir well and bring to a gentle simmer — do not boil vigorously or the coconut milk will split.",
        "Add the [Ingredient] to the simmering curry. Season with salt and a squeeze of tamarind juice.",
        "Cover and cook on low heat for 15–20 minutes until the [Ingredient] is tender and the curry is rich and fragrant.",
        "Garnish with fresh curry leaves sautéed in coconut oil. Serve with steamed rice or appam.",
      ]
    },
    {
      nameTemplate: "Crispy [Ingredient] Pakora",
      descriptionTemplate: "Golden, crispy fritters made with gram flour, spices, and fresh [Ingredient], perfect for a rainy afternoon tea.",
      tags: ["indian", "snacks", "quick", "comfort"],
      mealType: "lunch",
      cuisine: "Indian",
      difficulty: "easy",
      emoji: "🫓",
      readyMinutes: 20,
      baseIngredients: ["prod_onion"],
      cat1: ["Produce", "Dairy"],
      steps: [
        "Slice the [Ingredient] into even thin rounds (3–4mm) using a sharp knife or mandoline.",
        "In a mixing bowl, combine 1 cup of chickpea flour (besan), ½ tsp ajwain (carom seeds), ½ tsp cumin, red chili powder, and salt.",
        "Add cold water little by little, whisking to form a thick batter that coats the back of a spoon.",
        "Add the sliced [Ingredient] and chopped onion to the batter; mix until every piece is thoroughly coated.",
        "Pour oil in a deep pan to a depth of 3–4cm and heat to 175°C (a drop of batter should sizzle immediately).",
        "Carefully drop spoonfuls of battered [Ingredient] into the oil, frying in batches of 4–5 to avoid crowding.",
        "Fry for 3–4 minutes, turning occasionally, until the pakoras are a deep golden brown and completely crispy.",
        "Drain on paper towels and serve immediately with mint chutney and a cup of masala chai.",
      ]
    },
    {
      nameTemplate: "Sweet [Ingredient] Kheer",
      descriptionTemplate: "A classic Indian milk pudding flavored with cardamom, saffron, and slow-cooked [Ingredient].",
      tags: ["indian", "dessert", "sweet", "comfort"],
      mealType: "dinner",
      cuisine: "Indian",
      difficulty: "medium",
      emoji: "🥣",
      readyMinutes: 35,
      baseIngredients: ["prod_milk", "prod_honey"],
      cat1: ["Produce", "Pantry"],
      steps: [
        "Pour 1 liter of full-fat whole milk into a wide, heavy-bottomed pot and bring to a boil over medium-high heat.",
        "Reduce to a low simmer. Stir frequently with a flat spatula, scraping the bottom to prevent scorching.",
        "Add the [Ingredient] to the simmering milk. Stir and continue cooking.",
        "Keep the heat low and cook for 20–25 minutes, stirring every 2 minutes, until the milk reduces to about two-thirds of its original volume.",
        "Dissolve a few strands of saffron in 2 tbsp of warm milk; add to the pot along with ¼ tsp ground cardamom.",
        "Sweeten with honey (or sugar) to taste. Stir thoroughly and cook for 2 more minutes.",
        "Remove from heat and stir in ¼ cup of mixed dry fruits (cashews, raisins, pistachios).",
        "Serve warm or pour into bowls and refrigerate for 2+ hours for a chilled, thicker kheer. Garnish with rose petals.",
      ]
    },
    {
      nameTemplate: "Power-Green [Ingredient] Smoothie",
      descriptionTemplate: "A healthy and refreshing green smoothie packed with [Ingredient] and [Ingredient], blended until creamy.",
      tags: ["breakfast", "smoothie", "healthy", "quick", "fitness"],
      mealType: "breakfast",
      cuisine: "Healthy",
      difficulty: "easy",
      emoji: "🥤",
      readyMinutes: 5,
      baseIngredients: ["prod_almond_milk"],
      cat1: ["Produce"],
      cat2: ["Produce", "Dairy"],
      steps: [
        "Wash the [Ingredient] and [Ingredient] thoroughly under cold running water.",
        "Remove any tough stems or peels from the [Ingredient] and chop into rough chunks for easier blending.",
        "Chill your blender jar by rinsing it with cold water.",
        "Place the [Ingredient] and [Ingredient] into the blender.",
        "Add 250ml of chilled almond milk and a drizzle of honey if sweetness is desired.",
        "Optionally add a small piece of fresh ginger or a handful of ice cubes for a refreshing boost.",
        "Blend on high speed for 60 seconds until completely smooth, vibrant, and creamy.",
        "Pour into a chilled glass and serve immediately for maximum nutrients. Garnish with a sprig of mint.",
      ]
    },
    {
      nameTemplate: "Berry-Blast [Ingredient] Shake",
      descriptionTemplate: "A delicious and antioxidant-rich smoothie blending fresh [Ingredient] and creamy [Ingredient].",
      tags: ["breakfast", "smoothie", "quick", "sweet", "healthy"],
      mealType: "breakfast",
      cuisine: "Healthy",
      difficulty: "easy",
      emoji: "🥤",
      readyMinutes: 5,
      baseIngredients: ["prod_milk"],
      cat1: ["Produce"],
      cat2: ["Dairy", "Produce"],
      steps: [
        "Rinse the fresh [Ingredient] under cold water and remove any stems or pits.",
        "If using frozen [Ingredient], allow to thaw slightly for 5 minutes for easier blending.",
        "Place the [Ingredient] in the blender along with the [Ingredient].",
        "Pour in 200ml of whole milk (or more for a thinner consistency) and a teaspoon of honey.",
        "Optionally add a scoop of vanilla protein powder or yogurt for extra creaminess.",
        "Secure the blender lid tightly and blend on high for 45–60 seconds until completely smooth and frothy.",
        "Taste and adjust sweetness. Add a squeeze of lemon juice for a brighter flavor.",
        "Pour into a tall, chilled glass and serve immediately. Top with a few whole berries.",
      ]
    },
    {
      nameTemplate: "High-Protein [Ingredient] & [Ingredient] Salad",
      descriptionTemplate: "A nutrient-dense salad combining lean [Ingredient] and protein-rich [Ingredient] tossed in a light dressing.",
      tags: ["lunch", "protein", "healthy", "salad", "fitness"],
      mealType: "lunch",
      cuisine: "Healthy",
      difficulty: "easy",
      emoji: "🥗",
      readyMinutes: 15,
      baseIngredients: ["prod_lemon", "prod_olive_oil"],
      cat1: ["Proteins"],
      cat2: ["Produce", "Dairy"],
      steps: [
        "If the [Ingredient] needs cooking, season it with salt, pepper, and dried herbs, then grill or pan-fry over high heat for 4–5 minutes each side until cooked through. Let rest and slice.",
        "While the [Ingredient] cools, prepare the dressing: whisk together 2 tbsp olive oil, juice of ½ lemon, 1 tsp Dijon mustard, salt, and pepper.",
        "Prepare the [Ingredient]: rinse, drain if canned, or chop if fresh.",
        "In a large salad bowl, combine the [Ingredient] with any additional greens, cucumber, or cherry tomatoes you have on hand.",
        "Add the cooked and sliced [Ingredient] on top.",
        "Drizzle the lemon-olive oil dressing over the entire salad.",
        "Toss gently with salad tongs or two forks until everything is lightly coated.",
        "Taste and adjust seasoning. Serve immediately in chilled bowls for the best texture.",
      ]
    },
    {
      nameTemplate: "Quick [Ingredient] & [Ingredient] Stir-Fry",
      descriptionTemplate: "A rapid, colorful stir-fry featuring tender [Ingredient] and crisp [Ingredient] in a savory garlic glaze.",
      tags: ["dinner", "quick", "healthy", "stir-fry"],
      mealType: "dinner",
      cuisine: "Quick",
      difficulty: "easy",
      emoji: "🍳",
      readyMinutes: 15,
      baseIngredients: ["prod_garlic", "prod_ginger", "prod_olive_oil"],
      cat1: ["Proteins", "Produce"],
      cat2: ["Produce"],
      steps: [
        "Prepare the sauce: mix 2 tbsp soy sauce, 1 tsp sesame oil, 1 tsp cornstarch, and a pinch of sugar in a small bowl. Set aside.",
        "Slice the [Ingredient] into even, bite-size pieces. Cut the [Ingredient] into similar-sized pieces for uniform cooking.",
        "Mince 3 cloves of garlic and grate 1 tsp of fresh ginger.",
        "Heat a wok or large skillet over the highest heat setting until it just begins to smoke. Add 2 tbsp olive oil.",
        "Add the [Ingredient] first (if it takes longer to cook) and stir-fry for 2–3 minutes without stopping.",
        "Add the garlic and ginger, tossing constantly for 30 seconds until fragrant.",
        "Add the [Ingredient] and continue stir-frying for 3–4 minutes until everything is tender-crisp.",
        "Pour the sauce over the stir-fry, toss to coat, and cook for 1 final minute until the sauce thickens and glazes the ingredients. Serve immediately over steamed rice.",
      ]
    },
    {
      nameTemplate: "Gourmet [Ingredient] & [Ingredient] Toast",
      descriptionTemplate: "An elegant breakfast or snack featuring toasted artisan bread topped with creamy [Ingredient] and fresh [Ingredient].",
      tags: ["breakfast", "quick", "snacks", "gourmet"],
      mealType: "breakfast",
      cuisine: "Western",
      difficulty: "easy",
      emoji: "🍞",
      baseIngredients: ["prod_sourdough"],
      cat1: ["Produce", "Dairy"],
      cat2: ["Produce"],
      steps: [
        "Slice sourdough bread into thick, even slices about 1.5cm wide.",
        "Toast in a bread toaster, under the grill, or in a dry cast-iron pan until deeply golden and crisp on both sides.",
        "While warm, prepare the [Ingredient] topping: mash, spread, or slice depending on its texture.",
        "Spread or layer the [Ingredient] generously over the toast, covering all the way to the edges.",
        "Slice or arrange the [Ingredient] on top in an attractive pattern.",
        "Season with flaky sea salt, cracked black pepper, and a pinch of chili flakes if desired.",
        "Drizzle with a touch of high-quality olive oil or a squeeze of fresh lemon juice for brightness.",
        "Serve immediately while the toast is still warm and crisp, with a side of sliced fruit or a hot drink.",
      ]
    },
    {
      nameTemplate: "Decadent [Ingredient] & [Ingredient] Dessert",
      descriptionTemplate: "A rich and indulgent dessert pairing chocolate or sweet honey with [Ingredient] and [Ingredient].",
      tags: ["dessert", "sweet", "comfort", "indulgent"],
      mealType: "dinner",
      cuisine: "Dessert",
      difficulty: "easy",
      emoji: "🍰",
      baseIngredients: ["prod_honey"],
      cat1: ["Produce", "Bakery"],
      cat2: ["Dairy", "Snacks"],
      steps: [
        "Prepare your serving bowl or plate by chilling it in the refrigerator for 10 minutes.",
        "Slice or prepare the [Ingredient] into elegant, even pieces.",
        "Gently warm the honey or prepare the [Ingredient] sauce to a pourable consistency.",
        "Arrange the [Ingredient] pieces artfully in the chilled bowl.",
        "Add the [Ingredient] alongside or on top as a complementary element.",
        "Drizzle the warm honey in a steady stream across the dessert.",
        "Garnish with a small sprig of fresh mint and a light dusting of icing sugar or cocoa powder.",
        "Add a scoop of vanilla ice cream or whipped cream on the side and serve immediately.",
      ]
    }
  ];

  const products = window.PRODUCTS_DB || [];
  
  function getIngredientsByCategories(categoriesList) {
    if (!categoriesList || !categoriesList.length) return products;
    const filtered = products.filter(p => categoriesList.includes(p.category));
    return filtered.length ? filtered : products;
  }

  let count = RECIPES_DB.length;
  let loopSafety = 0;

  const nonVegKeywords = ["chicken", "salmon", "beef", "fish", "meat", "pork", "tuna", "shrimp", "turkey", "lamb", "bacon"];

  while (count < 525 && loopSafety < 1500) {
    loopSafety++;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Resolve ingredient pool based on template filters
    const pool1 = getIngredientsByCategories(template.cat1);
    const pool2 = getIngredientsByCategories(template.cat2 || template.cat1);

    let ing1 = pool1[Math.floor(Math.random() * pool1.length)];
    let ing2 = pool2[Math.floor(Math.random() * pool2.length)];
    
    let subSafety = 0;
    while ((ing2.id === ing1.id) && subSafety < 50) {
      subSafety++;
      ing2 = pool2[Math.floor(Math.random() * pool2.length)];
    }

    if (ing2.id === ing1.id) continue;

    // Build the recipe names and descriptions
    // Remove prefix from ingredient names if they have one, to make it sound natural
    const stripPrefix = (name) => {
      const prefixes = ["Organic", "Premium", "Fresh", "Pure", "Artisan", "Healthy Choice", "Gourmet", "Natural", "Local Farms", "Vesta Select"];
      let clean = name;
      prefixes.forEach(p => {
        if (clean.startsWith(p + " ")) {
          clean = clean.substring(p.length + 1);
        }
      });
      return clean;
    };

    const cleanIng1 = stripPrefix(ing1.name);
    const cleanIng2 = stripPrefix(ing2.name);

    const name = template.nameTemplate.replace("[Ingredient]", cleanIng1).replace("[Ingredient]", cleanIng2);
    const description = template.descriptionTemplate.replace("[Ingredient]", cleanIng1).replace("[Ingredient]", cleanIng2);
    
    if (RECIPES_DB.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      continue;
    }

    // Map base ingredients to database products
    const ingredients = (template.baseIngredients || []).map(id => {
      const p = products.find(prod => prod.id === id);
      return {
        productId: id,
        amount: p ? p.defaultQuantity / 4 : 20,
        unit: p ? p.defaultUnit : "g",
        optional: false
      };
    });

    ingredients.push({
      productId: ing1.id,
      amount: ing1.defaultQuantity || 200,
      unit: ing1.defaultUnit || "g",
      optional: false
    });

    ingredients.push({
      productId: ing2.id,
      amount: ing2.defaultQuantity || 150,
      unit: ing2.defaultUnit || "g",
      optional: false
    });

    // Smart tagging: check if vegetarian and/or high-protein
    const isVegetarian = !ingredients.some(ing => {
      const p = products.find(prod => prod.id === ing.productId);
      if (!p) return false;
      const nm = p.name.toLowerCase();
      return nonVegKeywords.some(kw => nm.includes(kw)) || (p.category === "Proteins" && !nm.includes("tofu"));
    });

    const isHighProtein = ingredients.some(ing => {
      const p = products.find(prod => prod.id === ing.productId);
      if (!p) return false;
      const nm = p.name.toLowerCase();
      return p.category === "Proteins" || p.category === "Dairy" || nm.includes("chickpeas") || nm.includes("nuts") || nm.includes("almond");
    });

    const tags = [...template.tags];
    if (isVegetarian) {
      tags.push("vegetarian");
    } else {
      tags.push("non-vegetarian");
    }
    if (isHighProtein) {
      tags.push("high-protein");
      tags.push("protein");
    }

    const readyMinutes = template.readyMinutes + Math.floor(Math.random() * 10) - 5;
    if (readyMinutes <= 20) {
      tags.push("quick");
    }

    const steps = template.steps.map(s => {
      return s.replace("[Ingredient]", cleanIng1).replace("[Ingredient]", cleanIng2);
    });

    RECIPES_DB.push({
      id: `rec_gen_${count}`,
      name: name,
      readyMinutes: Math.max(5, readyMinutes),
      servings: 2 + Math.floor(Math.random() * 3),
      difficulty: template.difficulty,
      emoji: template.emoji,
      mealType: template.mealType,
      cuisine: template.cuisine || "Fusion",
      tags: [...new Set(tags)], // de-duplicate tags
      description: description,
      ingredients: ingredients,
      steps: steps
    });
    
    count++;
  }
})();

window.RECIPES_DB = RECIPES_DB;

