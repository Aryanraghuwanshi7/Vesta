/**
 * Vesta Smart Kitchen — Health Tracker Module (Phase 5)
 * Hydration persistence, dynamic Calories/Macros, eaten food logger, pantry inventory auto-depletion, weight tracking, and recipes bridge.
 */

class VestaTrackerManager {
  constructor() {
    this.U = window.VestaUtils;
    
    // State
    this.hydration = 0.0; 
    this.hydrationGoal = 3.0;
    this.hydrationStreak = 0;
    this.lastHydrationDate = "";
    
    this.weightCurrent = 0;
    this.weightTarget = 0;
    this.weightHistory = [];

    this.consumed = []; 
    this.searchQuery = "";

    // Daily Nutrient Goals
    this.GOAL_CALORIES = 2000; 
    this.GOAL_PROTEIN = 150; // g
    this.GOAL_CARBS = 250; // g
    this.GOAL_FAT = 65; // g
    this.GOAL_FIBER = 30; // g

    this.initDOM();
    this.init();
  }

  initDOM() {
    // Hydration
    this.waterVal = document.getElementById("water-val");
    this.waterCircle = document.getElementById("water-progress-circle");
    this.waterBtn = document.getElementById("drink-water-btn");
    this.waterGoalDisplay = document.getElementById("water-goal-display");
    this.waterStreakDisplay = document.getElementById("water-streak");
    this.btnEditWaterGoal = document.getElementById("btn-edit-water-goal");

    // Calories & Macros
    this.calConsumed = document.getElementById("calories-consumed");
    this.calGoal = document.getElementById("calories-goal");
    this.calBar = document.getElementById("calories-bar-fill");
    
    this.macroProtein = document.getElementById("macro-protein");
    this.macroCarbs = document.getElementById("macro-carbs");
    this.macroFat = document.getElementById("macro-fat");
    this.macroFiber = document.getElementById("macro-fiber");
    
    this.macroBarProtein = document.getElementById("macro-bar-protein");
    this.macroBarCarbs = document.getElementById("macro-bar-carbs");
    this.macroBarFat = document.getElementById("macro-bar-fat");
    this.macroBarFiber = document.getElementById("macro-bar-fiber");

    // Weight
    this.weightCurrDisplay = document.getElementById("weight-current");
    this.weightTargDisplay = document.getElementById("weight-target");
    this.btnUpdateWeight = document.getElementById("btn-update-weight");
    this.chartSvg = document.getElementById("health-chart-svg");

    // Insights
    this.insightsContent = document.getElementById("health-insights-content");

    // Logger
    this.foodInput = document.getElementById("tracker-food-input");
    this.foodQty = document.getElementById("tracker-food-qty");
    this.foodUnit = document.getElementById("tracker-food-unit");
    this.logBtn = document.getElementById("btn-tracker-log-food");
    this.suggestions = document.getElementById("tracker-autocomplete-suggestions");
    this.loggedList = document.getElementById("tracker-logged-list");
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.render();
  }

  // ─── State Persistence ────────────────────────────────────────

  loadState() {
    const rawState = localStorage.getItem("vesta_tracker_state");
    if (rawState) {
      const state = JSON.parse(rawState);
      this.hydration = state.hydration || 0;
      this.hydrationGoal = state.hydrationGoal || 3.0;
      this.hydrationStreak = state.hydrationStreak || 0;
      this.lastHydrationDate = state.lastHydrationDate || "";
      this.weightCurrent = state.weightCurrent || 0;
      this.weightTarget = state.weightTarget || 0;
      this.weightHistory = state.weightHistory || [];
      this.consumed = state.consumed || [];
    } else {
      // Seed data
      this.hydrationGoal = 3.0;
      this.weightCurrent = 70;
      this.weightTarget = 65;
      this.weightHistory = [
        { date: "2023-01-01", weight: 75 },
        { date: "2023-02-01", weight: 73 },
        { date: "2023-03-01", weight: 71 },
        { date: new Date().toISOString().split("T")[0], weight: 70 }
      ];
      this.consumed = this.getSeedConsumed();
    }
    this.checkHydrationStreak();
  }

  saveState() {
    const state = {
      hydration: this.hydration,
      hydrationGoal: this.hydrationGoal,
      hydrationStreak: this.hydrationStreak,
      lastHydrationDate: this.lastHydrationDate,
      weightCurrent: this.weightCurrent,
      weightTarget: this.weightTarget,
      weightHistory: this.weightHistory,
      consumed: this.consumed
    };
    localStorage.setItem("vesta_tracker_state", JSON.stringify(state));
  }

  getSeedConsumed() {
    return [
      {
        id: "consumed_seed_1",
        name: "Smashed Avocado Morning Toast",
        emoji: "🥑",
        qty: 1,
        unit: "serving",
        calories: 420,
        type: "recipe",
        nutrients: { protein: 12, carbs: 45, fat: 22, fiber: 10 },
        date: new Date().toISOString().split("T")[0]
      }
    ];
  }

  checkHydrationStreak() {
    const today = new Date().toISOString().split("T")[0];
    if (this.lastHydrationDate !== today) {
       // Check if it was yesterday
       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       if (this.lastHydrationDate === yesterday.toISOString().split("T")[0]) {
          // If yesterday was met, keep streak. Otherwise reset.
          // For simplicity, we just reset today's hydration value
       } else {
          // Reset streak if more than 1 day passed without meeting goal (implemented simply here)
          if (this.lastHydrationDate !== "") {
            // this.hydrationStreak = 0; // strict reset
          }
       }
       this.hydration = 0; // reset daily hydration
       this.lastHydrationDate = today;
       this.saveState();
    }
  }

  // ─── Actions ──────────────────────────────────────────────────

  addWater(amount) {
    this.hydration += amount;
    
    if (this.hydration >= this.hydrationGoal) {
       const today = new Date().toISOString().split("T")[0];
       // Check if already counted streak for today
       // In a real app we'd track last streak date. Here we just simple increment if we hit it first time today.
       if (!this.streakCountedToday) {
         this.hydrationStreak++;
         this.streakCountedToday = true;
       }
    }
    
    this.saveState();
    this.renderHydration();
    this.showToast(`Logged +${amount * 1000}ml Water. 💧`);
  }

  updateWaterGoal() {
    const goal = prompt("Enter daily hydration goal in Liters:", this.hydrationGoal);
    if (goal && !isNaN(goal) && goal > 0) {
      this.hydrationGoal = parseFloat(goal);
      this.saveState();
      this.renderHydration();
      this.showToast(`Hydration goal updated to ${this.hydrationGoal}L.`);
    }
  }

  updateWeight() {
    const w = prompt("Enter current weight in kg:", this.weightCurrent);
    if (w && !isNaN(w) && w > 0) {
      this.weightCurrent = parseFloat(w);
      const today = new Date().toISOString().split("T")[0];
      const existing = this.weightHistory.find(h => h.date === today);
      if (existing) {
        existing.weight = this.weightCurrent;
      } else {
        this.weightHistory.push({ date: today, weight: this.weightCurrent });
      }
      this.saveState();
      this.renderWeight();
      this.renderChart();
      this.renderInsights();
      this.showToast(`Weight updated to ${this.weightCurrent}kg.`);
    }
  }

  logFood(name, emoji, qty, unit, calories = 80, type = "food", nutrients = null) {
    const item = {
      id: this.U.generateId("cons"),
      name: name,
      emoji: emoji,
      qty: parseFloat(qty),
      unit: unit,
      calories: Math.round(calories),
      type: type,
      nutrients: nutrients || this.estimateNutrients(name, qty, unit),
      date: new Date().toISOString().split("T")[0]
    };

    this.consumed.push(item);
    this.saveState();
    this.render();

    this.showToast(`Logged consumed: ${qty} ${unit} of ${name}.`);
  }

  deleteLoggedItem(id) {
    this.consumed = this.consumed.filter((c) => c.id !== id);
    this.saveState();
    this.render();
    this.showToast("Removed logged consumption entry.");
  }

  // ─── Nutrient Calculations ─────────────────────────────────────

  estimateNutrients(name, qty, unit) {
    // Basic estimation
    const factor = (unit === "pieces" || unit === "serving") ? parseFloat(qty) : parseFloat(qty) / 100;
    
    // Default fallback
    let p = 2, c = 10, f = 1, fib = 1, cals = 80;

    // Check if recipe
    const recipe = window.RECIPES_DB?.find((r) => r.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (recipe) {
      p = 25; c = 40; f = 15; fib = 8; cals = 400; // rough meal estimate
      return { protein: p*factor, carbs: c*factor, fat: f*factor, fiber: fib*factor, calories: cals*factor };
    }

    // Check if product
    const product = window.PRODUCTS_DB?.find((p) => p.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (product) {
       cals = product.caloriesPer100 || 80;
       if (product.category === "Proteins" || product.category === "Dairy") { p = 20; c = 2; f = 10; fib = 0; }
       else if (product.category === "Produce") { p = 1; c = 10; f = 0; fib = 3; }
       else if (product.category === "Bakery" || product.category === "Pantry") { p = 5; c = 30; f = 2; fib = 2; }
    }

    return { protein: p*factor, carbs: c*factor, fat: f*factor, fiber: fib*factor, calories: cals*factor };
  }

  // ─── Pantry Inventory Depletion Bridge ──────────────────────────

  depletePantryForRecipe(recipe) {
    if (!window.VestaInventoryInstance) return;
    let depletedItems = 0;
    recipe.ingredients?.forEach((ing) => {
      const pantryItem = window.VestaInventoryInstance.inventory.find((i) => i.productId === ing.productId);
      if (pantryItem && pantryItem.batches?.length) {
        let needed = ing.amount || 1;
        pantryItem.batches.sort((a, b) => this.U.parseDate(a.expiryDate) - this.U.parseDate(b.expiryDate));
        for (let i = 0; i < pantryItem.batches.length && needed > 0; i++) {
          const b = pantryItem.batches[i];
          if (b.quantity >= needed) {
            b.quantity = parseFloat((b.quantity - needed).toFixed(1));
            needed = 0;
          } else {
            needed -= b.quantity;
            b.quantity = 0;
          }
        }
        pantryItem.batches = pantryItem.batches.filter((b) => b.quantity > 0);
        depletedItems++;
      }
    });
    if (depletedItems > 0) {
      window.VestaInventoryInstance.saveState();
      window.VestaInventoryInstance.render();
      window.VestaRecipeInstance?.render();
    }
  }

  depletePantryForSingleProduct(product, qty) {
    if (!window.VestaInventoryInstance) return;
    const pantryItem = window.VestaInventoryInstance.inventory.find((i) => i.productId === product.id || i.name.toLowerCase().trim() === product.name.toLowerCase().trim());
    if (pantryItem && pantryItem.batches?.length) {
      let needed = parseFloat(qty);
      pantryItem.batches.sort((a, b) => this.U.parseDate(a.expiryDate) - this.U.parseDate(b.expiryDate));
      for (let i = 0; i < pantryItem.batches.length && needed > 0; i++) {
        const b = pantryItem.batches[i];
        if (b.quantity >= needed) {
          b.quantity = parseFloat((b.quantity - needed).toFixed(1));
          needed = 0;
        } else {
          needed -= b.quantity;
          b.quantity = 0;
        }
      }
      pantryItem.batches = pantryItem.batches.filter((b) => b.quantity > 0);
      window.VestaInventoryInstance.saveState();
      window.VestaInventoryInstance.render();
      window.VestaRecipeInstance?.render();
    }
  }

  consumeRecipeBridge(recipeId) {
    const recipe = window.RECIPES_DB?.find((r) => r.id === recipeId);
    if (!recipe) return;
    let calPerServing = 400; 
    const nuts = this.estimateNutrients(recipe.name, 1, "serving");
    this.logFood(recipe.name, recipe.emoji || "🍳", 1, "serving", nuts.calories || calPerServing, "recipe", nuts);
    this.depletePantryForRecipe(recipe);
    this.render();
    this.showToast(`Enjoy your ${recipe.name}! Ingredients depleted from Pantry. 🍽️`);
  }

  // ─── Search Autocomplete Handlers ──────────────────────────────

  handleSearchInput(val) {
    this.searchQuery = val.trim();
    if (!this.searchQuery) {
      this.suggestions.classList.add("hidden");
      return;
    }
    const products = window.PRODUCTS_DB || [];
    const recipes = window.RECIPES_DB || [];
    
    // Search across Name, Brand, Category, and Nutrition dataset
    const prodMatches = this.U.fuzzySearch(this.searchQuery, products, [
      "name",
      "brand",
      "category",
      "description",
      (prod) => {
        const nut = window.NUTRITION_DB?.[prod.id];
        if (nut) {
          return `calories:${nut.calories} protein:${nut.protein} fat:${nut.fat} carbs:${nut.carbs} fiber:${nut.fiber} ${nut.calories}kcal`;
        }
        return "";
      }
    ]).slice(0, 8);

    const recMatches = this.U.fuzzySearch(this.searchQuery, recipes, [
      "name",
      "mealType",
      "cuisine",
      "description"
    ]).slice(0, 6);

    if (!prodMatches.length && !recMatches.length) {
      this.suggestions.classList.add("hidden");
      return;
    }
    this.suggestions.innerHTML = "";

    recMatches.forEach((rec) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.style.padding = "8px 12px";
      div.style.cursor = "pointer";
      div.style.borderBottom = "1px solid var(--color-cream-light)";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "8px";
      div.style.fontSize = "0.8rem";
      div.innerHTML = `<span style="font-size: 1.1rem;">${rec.emoji || "🍳"}</span><div style="display: flex; flex-direction: column;"><span style="font-weight: 600; color: var(--color-forest);">${rec.name}</span><span style="font-size: 0.65rem; color: var(--color-sage);">Curated Recipe</span></div>`;
      div.addEventListener("click", () => {
        this.foodInput.value = rec.name;
        this.foodQty.value = "1";
        this.foodUnit.value = "serving";
        this.suggestions.classList.add("hidden");
      });
      div.addEventListener("mouseenter", () => div.style.background = "rgba(101, 140, 62, 0.08)");
      div.addEventListener("mouseleave", () => div.style.background = "");
      this.suggestions.appendChild(div);
    });

    prodMatches.forEach((prod) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.style.padding = "8px 12px";
      div.style.cursor = "pointer";
      div.style.borderBottom = "1px solid var(--color-cream-light)";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "8px";
      div.style.fontSize = "0.8rem";
      div.innerHTML = `<span style="font-size: 1.1rem;">${prod.emoji}</span><div style="display: flex; flex-direction: column;"><span style="font-weight: 500; color: var(--color-forest);">${prod.name}</span><span style="font-size: 0.65rem; color: #799482;">Pantry Product</span></div>`;
      div.addEventListener("click", () => {
        this.foodInput.value = prod.name;
        this.foodQty.value = prod.defaultQuantity;
        this.foodUnit.value = prod.defaultUnit;
        this.suggestions.classList.add("hidden");
      });
      div.addEventListener("mouseenter", () => div.style.background = "rgba(101, 140, 62, 0.08)");
      div.addEventListener("mouseleave", () => div.style.background = "");
      this.suggestions.appendChild(div);
    });
    this.suggestions.classList.remove("hidden");
  }

  // ─── Events Binding ────────────────────────────────────────────

  bindEvents() {
    this.waterBtn?.addEventListener("click", () => this.addWater(0.25));
    this.btnEditWaterGoal?.addEventListener("click", () => this.updateWaterGoal());
    this.btnUpdateWeight?.addEventListener("click", () => this.updateWeight());

    this.logBtn?.addEventListener("click", () => {
      const name = this.foodInput.value.trim();
      const qty = parseFloat(this.foodQty.value);
      const unit = this.foodUnit.value;
      if (!name || isNaN(qty) || qty <= 0) {
        this.showToast("Please enter valid food details!");
        return;
      }
      const recipe = window.RECIPES_DB?.find((r) => r.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (recipe) {
        this.consumeRecipeBridge(recipe.id);
      } else {
        const product = window.PRODUCTS_DB?.find((p) => p.name.toLowerCase().trim() === name.toLowerCase().trim());
        const emoji = product?.emoji || "🍽️";
        let cals = 65;
        if (product) {
          const nutRef = window.NUTRITION_DB?.[product.id];
          if (nutRef) cals = nutRef.calories * ((unit === "pieces" || unit === "serving") ? 1 : qty / 100);
        }
        const nuts = this.estimateNutrients(name, qty, unit);
        this.logFood(name, emoji, qty, unit, nuts.calories || cals, "food", nuts);
        if (product) this.depletePantryForSingleProduct(product, qty);
      }
      this.foodInput.value = "";
      this.suggestions.classList.add("hidden");
    });

    this.foodInput?.addEventListener("input", this.U.debounce((e) => this.handleSearchInput(e.target.value), 200));
    document.addEventListener("click", (e) => {
      if (!this.foodInput?.contains(e.target) && !this.suggestions?.contains(e.target)) {
        this.suggestions?.classList.add("hidden");
      }
    });

    document.getElementById("btn-recipe-consume")?.addEventListener("click", () => {
      if (window.VestaRecipeInstance && window.VestaRecipeInstance.activeRecipeId) {
        this.consumeRecipeBridge(window.VestaRecipeInstance.activeRecipeId);
        window.VestaRecipeInstance.closeDetail();
      }
    });
  }

  // ─── Render View ───────────────────────────────────────────────

  render() {
    this.renderHydration();
    this.renderNutrition();
    this.renderWeight();
    this.renderChart();
    this.renderInsights();
    this.renderLoggedList();
  }

  renderHydration() {
    if (!this.waterVal || !this.waterCircle) return;
    this.waterGoalDisplay.textContent = this.hydrationGoal.toFixed(1);
    this.waterVal.textContent = this.hydration.toFixed(1);
    this.waterStreakDisplay.textContent = `${this.hydrationStreak} days`;
    
    const percentage = Math.min(100, (this.hydration / this.hydrationGoal) * 100);
    this.waterCircle.style.strokeDasharray = `${percentage}, 100`;

    if (this.hydration >= this.hydrationGoal && this.waterBtn) {
      this.waterCircle.style.stroke = "var(--color-sage)";
      this.waterVal.style.color = "var(--color-sage)";
    } else {
      this.waterCircle.style.stroke = "#3498db";
      this.waterVal.style.color = "";
    }
  }

  renderNutrition() {
    if (!this.calConsumed) return;
    const today = new Date().toISOString().split("T")[0];
    const todayConsumed = this.consumed.filter((c) => c.date === today);

    let totalCals = 0;
    let totalP = 0, totalC = 0, totalF = 0, totalFib = 0;

    todayConsumed.forEach((item) => {
      totalCals += item.calories || 0;
      if (item.nutrients) {
        totalP += item.nutrients.protein || 0;
        totalC += item.nutrients.carbs || 0;
        totalF += item.nutrients.fat || 0;
        totalFib += item.nutrients.fiber || 0;
      }
    });

    this.calConsumed.textContent = Math.round(totalCals);
    this.calGoal.textContent = this.GOAL_CALORIES;
    const calPct = Math.min(100, (totalCals / this.GOAL_CALORIES) * 100);
    this.calBar.style.width = `${calPct}%`;
    if (calPct > 100) this.calBar.style.background = "#e76f51";
    else this.calBar.style.background = "var(--color-forest)";

    this.macroProtein.textContent = `${Math.round(totalP)}g`;
    this.macroCarbs.textContent = `${Math.round(totalC)}g`;
    this.macroFat.textContent = `${Math.round(totalF)}g`;
    this.macroFiber.textContent = `${Math.round(totalFib)}g`;

    this.macroBarProtein.style.width = `${Math.min(100, (totalP/this.GOAL_PROTEIN)*100)}%`;
    this.macroBarCarbs.style.width = `${Math.min(100, (totalC/this.GOAL_CARBS)*100)}%`;
    this.macroBarFat.style.width = `${Math.min(100, (totalF/this.GOAL_FAT)*100)}%`;
    this.macroBarFiber.style.width = `${Math.min(100, (totalFib/this.GOAL_FIBER)*100)}%`;
  }

  renderWeight() {
    if (!this.weightCurrDisplay) return;
    this.weightCurrDisplay.textContent = this.weightCurrent ? `${this.weightCurrent} kg` : "--";
    this.weightTargDisplay.textContent = this.weightTarget ? `${this.weightTarget} kg` : "--";
  }

  renderChart() {
    if (!this.chartSvg) return;
    const svg = this.chartSvg;
    svg.innerHTML = "";

    if (this.weightHistory.length < 2) {
      svg.innerHTML = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#999">Not enough data for chart.</text>`;
      return;
    }

    // A hack to make it render nicely across browsers without external libs
    const w = svg.clientWidth || 300;
    const h = svg.clientHeight || 120;
    const padding = 20;

    const weights = this.weightHistory.map(d => d.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;

    const rangeW = maxW - minW;
    const stepX = (w - padding * 2) / (this.weightHistory.length - 1);

    let dString = "";
    const points = [];

    this.weightHistory.forEach((pt, i) => {
      const cx = padding + i * stepX;
      const cy = h - padding - ((pt.weight - minW) / rangeW) * (h - padding * 2);
      points.push({cx, cy, weight: pt.weight});
      if (i === 0) dString += `M ${cx} ${cy} `;
      else dString += `L ${cx} ${cy} `;
    });

    // Draw Line
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", dString);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--color-forest)");
    path.setAttribute("stroke-width", "3");
    svg.appendChild(path);

    // Draw Points
    points.forEach(pt => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pt.cx);
      circle.setAttribute("cy", pt.cy);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "white");
      circle.setAttribute("stroke", "var(--color-sage)");
      circle.setAttribute("stroke-width", "2");
      svg.appendChild(circle);
      
      // Simple tooltip label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", pt.cx);
      text.setAttribute("y", pt.cy - 10);
      text.setAttribute("font-size", "10");
      text.setAttribute("fill", "#666");
      text.setAttribute("text-anchor", "middle");
      text.textContent = pt.weight;
      svg.appendChild(text);
    });
  }

  renderInsights() {
    if (!this.insightsContent) return;
    
    let html = "";
    
    // Weight insight
    if (this.weightCurrent > 0 && this.weightTarget > 0) {
      if (this.weightCurrent <= this.weightTarget) {
         html += "<p>🌟 You've reached your weight goal! Maintain your healthy habits.</p>";
      } else {
         const diff = (this.weightCurrent - this.weightTarget).toFixed(1);
         html += `<p>💪 You are <strong>${diff} kg</strong> away from your target. Consistency is key.</p>`;
      }
    }

    // Nutrition insight
    const today = new Date().toISOString().split("T")[0];
    const todayConsumed = this.consumed.filter((c) => c.date === today);
    let totalP = 0;
    todayConsumed.forEach(i => totalP += (i.nutrients?.protein || 0));

    if (totalP < this.GOAL_PROTEIN * 0.5 && todayConsumed.length > 2) {
       html += "<p>⚠️ Your protein intake is low today. Consider adding chicken, tofu, or greek yogurt to your next meal.</p>";
    } else if (totalP >= this.GOAL_PROTEIN) {
       html += "<p>🎯 Great job hitting your protein goal! This helps build muscle and keeps you full.</p>";
    }

    if (this.hydrationStreak > 3) {
       html += `<p>💧 You're on a <strong>${this.hydrationStreak}-day</strong> hydration streak! Keep drinking water!</p>`;
    }

    if (html === "") {
      html = "Log more meals and update your weight to receive personalized AI health insights.";
    }

    this.insightsContent.innerHTML = html;
  }

  renderLoggedList() {
    if (!this.loggedList) return;
    this.loggedList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];
    const todayConsumed = this.consumed.filter((c) => c.date === today);

    if (!todayConsumed.length) {
      this.loggedList.innerHTML = `<li style="padding: 15px; text-align: center; color: #999; font-size: 0.75rem; font-style: italic;">No foods logged eaten today.</li>`;
      return;
    }

    todayConsumed.reverse().forEach((item) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.justifyContent = "space-between";
      li.style.padding = "6px 12px";
      li.style.borderRadius = "8px";
      li.style.background = "var(--color-cream-light)";
      li.style.fontSize = "0.75rem";

      li.innerHTML = `
        <span style="font-size: 1.1rem; line-height: 1; flex-shrink: 0; margin-right: 6px;">${item.emoji}</span>
        <div style="display: flex; flex-direction: column; flex: 1;">
          <span style="font-weight: 600; color: var(--color-forest);">${item.name}</span>
          <span style="font-size: 0.6rem; color: #799482;">Qty: ${item.qty} ${item.unit} · ~${item.calories} kcal</span>
        </div>
        <button class="delete-logged-item" data-id="${item.id}" style="background: none; border: none; font-size: 1.1rem; color: #c88; cursor: pointer; padding: 0 4px;">&times;</button>`;

      li.querySelector(".delete-logged-item")?.addEventListener("click", (e) => {
        this.deleteLoggedItem(item.id);
      });

      this.loggedList.appendChild(li);
    });
  }

  showToast(message) {
    document.querySelector(".vesta-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "vesta-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

(function initVestaTracker() {
  if (window.VestaUtils && document.getElementById("water-val")) {
    window.VestaTrackerInstance = new VestaTrackerManager();
  }
})();
