/**
 * Vesta Smart Kitchen — Recipes Module (Phase 2)
 * Pantry-aware discovery, matching, favorites & shopping bridge
 */

class VestaRecipeManager {
  constructor() {
    this.U = window.VestaUtils;
    this.favorites = [];
    this.recentlyViewed = [];
    this.currentFilter = "all";
    this.currentSort = "match_score";
    this.searchQuery = "";
    this.highlightProductId = null;

    this.container = document.getElementById("recipe-cards-container");
    this.searchInput = document.getElementById("recipe-search-input");
    this.sortSelect = document.getElementById("recipe-sort-select");
    this.matchBanner = document.getElementById("recipe-match-banner");
    this.detailModal = document.getElementById("modal-recipe-detail");
    this.overlay = document.getElementById("modal-overlay");

    this.debouncedSearch = this.U.debounce((val) => {
      this.searchQuery = val;
      this.render();
    }, 250);

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.applyPendingContext();
    this.render();
  }

  // ─── State ───────────────────────────────────────────────────

  loadState() {
    this.favorites = this.loadJSON("vesta_recipe_favorites", []);
    this.recentlyViewed = this.loadJSON("vesta_recipe_recent", []);
    this.currentFilter = localStorage.getItem("vesta_recipe_filter") || "all";
    this.currentSort = localStorage.getItem("vesta_recipe_sort") || "match_score";

    document.querySelectorAll(".recipe-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === this.currentFilter);
    });
    if (this.sortSelect) this.sortSelect.value = this.currentSort;
  }

  loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  saveFavorites() {
    localStorage.setItem("vesta_recipe_favorites", JSON.stringify(this.favorites));
  }

  saveRecent() {
    localStorage.setItem("vesta_recipe_recent", JSON.stringify(this.recentlyViewed.slice(0, 10)));
  }

  savePrefs() {
    localStorage.setItem("vesta_recipe_filter", this.currentFilter);
    localStorage.setItem("vesta_recipe_sort", this.currentSort);
  }

  applyPendingContext() {
    const productId = sessionStorage.getItem("vesta_recipe_highlight_product");
    if (productId) {
      this.highlightProductId = productId;
      sessionStorage.removeItem("vesta_recipe_highlight_product");
      const prod = window.PRODUCTS_DB?.find((p) => p.id === productId);
      if (prod && this.matchBanner) {
        this.matchBanner.classList.remove("hidden");
        this.matchBanner.querySelector(".banner-text").textContent =
          `Showing recipes that use ${prod.name} from your pantry.`;
      }
    }
  }

  getPantryProductIds() {
    try {
      const stored = localStorage.getItem("vesta_inventory");
      if (!stored) return new Set();
      const inventory = JSON.parse(stored);
      const ids = new Set();
      inventory.forEach((item) => {
        if (item.productId) ids.add(item.productId);
      });
      return ids;
    } catch {
      return new Set();
    }
  }

  getExpiringProductIds() {
    try {
      const stored = localStorage.getItem("vesta_inventory");
      if (!stored) return new Set();
      const inventory = JSON.parse(stored);
      const ids = new Set();
      inventory.forEach((item) => {
        if (!item.productId || !item.batches?.length) return;
        const hasExpiring = item.batches.some((b) => {
          const s = this.U.getExpiryStatus(b.expiryDate);
          return s === "expiring" || s === "expired";
        });
        if (hasExpiring) ids.add(item.productId);
      });
      return ids;
    } catch {
      return new Set();
    }
  }

  getProduct(productId) {
    return window.PRODUCTS_DB?.find((p) => p.id === productId) || null;
  }

  normalizeIngredients(recipe) {
    return (recipe.ingredients || []).map((ing) =>
      typeof ing === "string" ? { productId: ing, optional: false } : ing
    );
  }

  analyzeRecipe(recipe) {
    const pantry = this.getPantryProductIds();
    const expiring = this.getExpiringProductIds();
    const ingredients = this.normalizeIngredients(recipe);

    const required = ingredients.filter((i) => !i.optional);
    const matched = [];
    const missing = [];
    const expiringUsed = [];

    ingredients.forEach((ing) => {
      const prod = this.getProduct(ing.productId);
      if (!prod) return;
      const has = pantry.has(ing.productId);
      const entry = { ...ing, product: prod, inPantry: has };
      if (has) {
        matched.push(entry);
        if (expiring.has(ing.productId)) expiringUsed.push(entry);
      } else if (!ing.optional) {
        missing.push(entry);
      }
    });

    const requiredCount = required.length || ingredients.filter((i) => !i.optional).length || ingredients.length;
    const matchedRequired = required.filter((i) => pantry.has(i.productId)).length;
    const matchPercent = requiredCount
      ? Math.round((matchedRequired / requiredCount) * 100)
      : Math.round((matched.length / Math.max(ingredients.length, 1)) * 100);

    const canCookNow = missing.length === 0;
    const usesExpiring = expiringUsed.length > 0;
    const highlightsIngredient = this.highlightProductId
      ? ingredients.some((i) => i.productId === this.highlightProductId)
      : false;

    return {
      matched,
      missing,
      expiringUsed,
      matchPercent,
      canCookNow,
      usesExpiring,
      highlightsIngredient,
      ingredientTotal: ingredients.length,
    };
  }

  estimateCalories(recipe) {
    let total = 0;
    this.normalizeIngredients(recipe).forEach((ing) => {
      const n = window.getNutrition?.(ing.productId);
      const prod = this.getProduct(ing.productId);
      if (n && prod) total += (n.calories * (ing.amount || 100)) / 100;
    });
    return total > 0 ? Math.round(total / (recipe.servings || 2)) : null;
  }

  // ─── Filters & sort ──────────────────────────────────────────

  applyFilters(recipes) {
    let list = [...recipes];

    if (this.searchQuery.trim()) {
      list = this.U.fuzzySearch(this.searchQuery, list, [
        "name",
        "description",
        "tags",
        "mealType",
        "cuisine",
        (recipe) => {
          const ingredients = this.normalizeIngredients(recipe);
          return ingredients.map(ing => {
            const prod = this.getProduct(ing.productId);
            return prod ? prod.name : "";
          }).join(" ");
        }
      ]);
    }

    if (this.highlightProductId) {
      list = list.filter((r) => this.analyzeRecipe(r).highlightsIngredient);
    }

    switch (this.currentFilter) {
      case "can_cook":
        list = list.filter((r) => this.analyzeRecipe(r).canCookNow);
        break;
      case "use_expiring":
        list = list.filter((r) => this.analyzeRecipe(r).usesExpiring);
        break;
      case "breakfast":
        list = list.filter((r) => r.mealType === "breakfast" || r.tags?.includes("breakfast"));
        break;
      case "dinner":
        list = list.filter((r) => r.mealType === "dinner" || r.tags?.includes("dinner"));
        break;
      case "quick":
        list = list.filter((r) => (r.readyMinutes || 99) <= 20);
        break;
      case "favorites":
        list = list.filter((r) => this.favorites.includes(r.id));
        break;
      default:
        break;
    }

    list.sort((a, b) => {
      const aa = this.analyzeRecipe(a);
      const bb = this.analyzeRecipe(b);
      if (this.favorites.includes(a.id) && !this.favorites.includes(b.id)) return -1;
      if (!this.favorites.includes(a.id) && this.favorites.includes(b.id)) return 1;

      switch (this.currentSort) {
        case "time":
          return (a.readyMinutes || 0) - (b.readyMinutes || 0);
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "recent": {
          const ai = this.recentlyViewed.indexOf(a.id);
          const bi = this.recentlyViewed.indexOf(b.id);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        }
        case "match_score":
        default:
          return bb.matchPercent - aa.matchPercent || (a.readyMinutes || 0) - (b.readyMinutes || 0);
      }
    });

    return list;
  }

  // ─── Events ──────────────────────────────────────────────────

  bindEvents() {
    this.searchInput?.addEventListener("input", (e) => this.debouncedSearch(e.target.value));

    document.querySelectorAll(".recipe-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".recipe-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.savePrefs();
        this.render();
      });
    });

    this.sortSelect?.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.savePrefs();
      this.render();
    });

    document.getElementById("recipe-clear-context")?.addEventListener("click", () => {
      this.highlightProductId = null;
      this.matchBanner?.classList.add("hidden");
      this.render();
    });

    document.getElementById("modal-recipe-close")?.addEventListener("click", () => this.closeDetail());
    document.getElementById("btn-recipe-close")?.addEventListener("click", () => this.closeDetail());
    document.getElementById("btn-recipe-add-shopping")?.addEventListener("click", () => this.addMissingToShopping());
    document.getElementById("btn-recipe-toggle-fav")?.addEventListener("click", () => this.toggleFavoriteActive());

    this.overlay?.addEventListener("click", () => {
      if (this.detailModal?.classList.contains("active")) this.closeDetail();
    });
  }

  toggleFavorite(recipeId) {
    if (this.favorites.includes(recipeId)) {
      this.favorites = this.favorites.filter((id) => id !== recipeId);
    } else {
      this.favorites = [recipeId, ...this.favorites];
    }
    this.saveFavorites();
    this.render();
  }

  toggleFavoriteActive() {
    if (!this.activeRecipeId) return;
    this.toggleFavorite(this.activeRecipeId);
    this.openDetail(this.activeRecipeId);
  }

  markViewed(recipeId) {
    this.recentlyViewed = [recipeId, ...this.recentlyViewed.filter((id) => id !== recipeId)].slice(0, 10);
    this.saveRecent();
  }

  addMissingToShopping() {
    if (!this.activeRecipeId) return;
    const recipe = window.RECIPES_DB.find((r) => r.id === this.activeRecipeId);
    if (!recipe) return;
    const analysis = this.analyzeRecipe(recipe);
    if (!analysis.missing.length) {
      this.showToast("You already have all required ingredients!");
      return;
    }

    const list = this.loadJSON("vesta_shopping", []);
    analysis.missing.forEach((ing) => {
      list.push({
        id: this.U.generateId("shop"),
        name: ing.product.name,
        category: ing.product.category,
        quantity: ing.amount || 1,
        unit: ing.unit || ing.product.defaultUnit,
        checked: false,
        dateAdded: new Date().toISOString().split("T")[0],
      });
    });
    localStorage.setItem("vesta_shopping", JSON.stringify(list));
    this.showToast(`Added ${analysis.missing.length} item(s) to Shopping List.`);
  }

  // ─── Detail modal ────────────────────────────────────────────

  openDetail(recipeId) {
    const recipe = window.RECIPES_DB.find((r) => r.id === recipeId);
    if (!recipe) return;

    this.activeRecipeId = recipeId;
    this.markViewed(recipeId);
    const analysis = this.analyzeRecipe(recipe);
    const cals = this.estimateCalories(recipe);

    // Populate header fields
    document.getElementById("recipe-detail-title").textContent = recipe.name;
    document.getElementById("recipe-detail-emoji").textContent = recipe.emoji || "🍳";
    document.getElementById("recipe-detail-description").textContent = recipe.description;

    // Populate meta badges — include inline SVG icon text from HTML
    const timeEl = document.getElementById("recipe-detail-time");
    if (timeEl) {
      const svgStr = timeEl.querySelector("svg")?.outerHTML || "";
      timeEl.innerHTML = svgStr + ` ${recipe.readyMinutes} min`;
    }
    const srvEl = document.getElementById("recipe-detail-servings");
    if (srvEl) {
      const svgStr = srvEl.querySelector("svg")?.outerHTML || "";
      srvEl.innerHTML = svgStr + ` ${recipe.servings || 2} servings`;
    }
    document.getElementById("recipe-detail-difficulty").textContent = recipe.difficulty || "easy";
    document.getElementById("recipe-detail-calories").textContent = cals ? `~${cals} kcal` : "—";
    document.getElementById("recipe-detail-match").textContent = `${analysis.matchPercent}% match`;

    const favBtn = document.getElementById("btn-recipe-toggle-fav");
    if (favBtn) {
      favBtn.textContent = this.favorites.includes(recipeId) ? "⭐ Saved" : "☆ Save Recipe";
      favBtn.classList.toggle("active", this.favorites.includes(recipeId));
    }

    const shopBtn = document.getElementById("btn-recipe-add-shopping");
    if (shopBtn) {
      shopBtn.disabled = analysis.missing.length === 0;
      shopBtn.textContent = analysis.missing.length
        ? `Add ${analysis.missing.length} Missing to Shopping`
        : "All Ingredients in Pantry ✓";
    }

    const ingList = document.getElementById("recipe-detail-ingredients");
    ingList.innerHTML = "";
    this.normalizeIngredients(recipe).forEach((ing) => {
      const prod = this.getProduct(ing.productId);
      if (!prod) return;
      const inPantry = analysis.matched.some((m) => m.productId === ing.productId);
      const expiring = analysis.expiringUsed.some((m) => m.productId === ing.productId);
      const li = document.createElement("li");
      li.className = `recipe-ingredient-row ${inPantry ? "in-pantry" : "missing"}${expiring ? " expiring" : ""}`;
      li.innerHTML = `
        <span class="ing-emoji">${prod.emoji}</span>
        <span class="ing-name">${prod.name}${ing.amount ? ` <em>(${ing.amount} ${ing.unit || ""})</em>` : ""}</span>
        <span class="ing-status">${inPantry ? (expiring ? "⚡ Expiring" : "✓ In pantry") : "+ Need to buy"}</span>`;
      ingList.appendChild(li);
    });

    const stepsList = document.getElementById("recipe-detail-steps");
    stepsList.innerHTML = "";
    (recipe.steps || []).forEach((step, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="step-num">${i + 1}</span><span class="step-text">${step}</span>`;
      stepsList.appendChild(li);
    });

    // Lock body scroll
    document.body.style.overflow = "hidden";

    this.overlay?.classList.add("active");
    this.detailModal?.classList.add("active");
  }

  closeDetail() {
    this.detailModal?.classList.remove("active");
    if (
      !document.getElementById("modal-edit-item")?.classList.contains("active") &&
      !document.getElementById("modal-view-item")?.classList.contains("active")
    ) {
      this.overlay?.classList.remove("active");
    }
    // Restore body scroll
    document.body.style.overflow = "";
    this.activeRecipeId = null;
  }

  // ─── Render ──────────────────────────────────────────────────

  render() {
    if (!this.container) return;
    const recipes = this.applyFilters(window.RECIPES_DB || []);
    this.container.innerHTML = "";

    if (!recipes.length) {
      this.container.innerHTML = `
        <div class="recipe-empty-state">
          <span class="empty-icon">🍳</span>
          <h4>No recipes match your filters.</h4>
          <p>Try "All Recipes" or add more items to your pantry.</p>
        </div>`;
      return;
    }

    recipes.forEach((recipe) => {
      this.container.appendChild(this.buildCard(recipe));
    });
  }

  buildCard(recipe) {
    const analysis = this.analyzeRecipe(recipe);
    const isFav = this.favorites.includes(recipe.id);
    const card = document.createElement("div");
    card.className = `recipe-mini-card${analysis.canCookNow ? " can-cook" : ""}${analysis.usesExpiring ? " uses-expiring" : ""}`;

    const pills = this.normalizeIngredients(recipe).slice(0, 4).map((ing) => {
      const prod = this.getProduct(ing.productId);
      if (!prod) return "";
      const has = analysis.matched.some((m) => m.productId === ing.productId);
      return has
        ? `<span class="match-pill">${prod.emoji} ${prod.name.split(" ").slice(-2).join(" ")}</span>`
        : `<span class="match-pill-missing">+ ${prod.name.split(" ").slice(-2).join(" ")}</span>`;
    }).join("");

    card.innerHTML = `
      <div class="recipe-visual">${recipe.emoji || "🍳"}</div>
      <div class="recipe-details">
        <div class="recipe-card-top">
          <span class="recipe-tag">Ready in ${recipe.readyMinutes}m · ${analysis.matchPercent}% match</span>
          <button class="recipe-fav-btn ${isFav ? "active" : ""}" aria-label="Favorite">${isFav ? "⭐" : "☆"}</button>
        </div>
        <h4>${recipe.name}</h4>
        <p>${recipe.description}</p>
        <div class="recipe-ingredients-matched">${pills}</div>
        ${analysis.canCookNow ? '<span class="cook-now-badge">Ready to cook</span>' : ""}
        ${analysis.usesExpiring ? '<span class="expiring-use-badge">Uses expiring items</span>' : ""}
      </div>`;

    card.querySelector(".recipe-fav-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite(recipe.id);
    });
    card.addEventListener("click", () => this.openDetail(recipe.id));
    return card;
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

  /** Called from inventory bridge */
  openForProduct(productId) {
    sessionStorage.setItem("vesta_recipe_highlight_product", productId);
    this.highlightProductId = productId;
    const prod = this.getProduct(productId);
    if (prod && this.matchBanner) {
      this.matchBanner.classList.remove("hidden");
      this.matchBanner.querySelector(".banner-text").textContent =
        `Showing recipes that use ${prod.name} from your pantry.`;
    }
    this.render();
  }
}

(function initVestaRecipes() {
  if (window.VestaUtils && window.RECIPES_DB && document.getElementById("recipe-cards-container")) {
    window.VestaRecipeInstance = new VestaRecipeManager();
  }
})();

/** Open recipes drawer filtered by pantry product */
window.openRecipesForProduct = function (productId) {
  sessionStorage.setItem("vesta_recipe_highlight_product", productId);
  document.querySelector('.nav-card.card-recipes')?.click();
  setTimeout(() => window.VestaRecipeInstance?.openForProduct(productId), 350);
};
