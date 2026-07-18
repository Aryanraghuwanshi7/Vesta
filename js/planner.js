/**
 * Vesta Smart Kitchen — Weekly Planner Module (Phase 4)
 * 7-day calendar planner with B/L/D meal selector, floating recipe picker, and smart pantry-aware recommendations.
 */

class VestaPlannerManager {
  constructor() {
    this.U = window.VestaUtils;
    this.planner = {};
    
    // Active click tracking for the floating recipe picker
    this.activeDay = null;
    this.activeMeal = null;

    this.container = document.getElementById("planner-calendar-days");
    this.picker = document.getElementById("planner-recipe-picker");
    this.pickerClose = document.getElementById("planner-recipe-picker-close");
    this.pickerSearch = document.getElementById("planner-recipe-search");
    this.pickerList = document.getElementById("planner-recipe-list");

    this.recomDesc = document.getElementById("planner-recom-desc");
    this.recomBtn = document.getElementById("schedule-recom-btn");

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.updateRecommendation();
    this.render();
  }

  // ─── State Persistence ────────────────────────────────────────

  loadState() {
    try {
      const raw = localStorage.getItem("vesta_planner");
      this.planner = raw ? JSON.parse(raw) : this.getSeedPlanner();
    } catch {
      this.planner = this.getSeedPlanner();
    }
  }

  saveState() {
    localStorage.setItem("vesta_planner", JSON.stringify(this.planner));
  }

  getSeedPlanner() {
    return {
      Mon: { B: "rec_smoothie_bowl", L: null, D: "rec_tomato_salad" },
      Tue: { B: null, L: null, D: "rec_sourdough_toast" },
      Wed: { B: null, L: null, D: "rec_avocado_toast" },
      Thu: { B: null, L: null, D: null },
      Fri: { B: null, L: null, D: null },
      Sat: { B: null, L: null, D: null },
      Sun: { B: null, L: null, D: null }
    };
  }

  // ─── Actions ──────────────────────────────────────────────────

  assignRecipe(day, meal, recipeId) {
    if (this.planner[day]) {
      this.planner[day][meal] = recipeId;
      this.saveState();
      this.render();
      this.updateRecommendation();
      this.closePicker();
      
      const recipe = window.RECIPES_DB?.find((r) => r.id === recipeId);
      if (recipe) {
        this.showToast(`Planned ${recipe.name} for ${this.getFullDayName(day)} ${this.getFullMealName(meal)}!`);
      }
    }
  }

  removeRecipe(day, meal) {
    if (this.planner[day] && this.planner[day][meal]) {
      const oldRecipeId = this.planner[day][meal];
      this.planner[day][meal] = null;
      this.saveState();
      this.render();
      this.updateRecommendation();
      
      const recipe = window.RECIPES_DB?.find((r) => r.id === oldRecipeId);
      if (recipe) {
        this.showToast(`Removed ${recipe.name} from ${this.getFullDayName(day)}.`);
      }
    }
  }

  // ─── Floating Picker logic ─────────────────────────────────────

  openPicker(element, day, meal) {
    this.activeDay = day;
    this.activeMeal = meal;

    if (!this.picker) return;

    // Center absolute coordinates near clicked element
    const rect = element.getBoundingClientRect();
    
    // Position checks to prevent offscreen placement
    let top = window.scrollY + rect.bottom + 8;
    let left = window.scrollX + rect.left;

    if (left + 280 > window.innerWidth) {
      left = window.innerWidth - 300;
    }
    if (top + 260 > window.innerHeight + window.scrollY) {
      top = window.scrollY + rect.top - 270;
    }

    this.picker.style.top = `${Math.max(10, top)}px`;
    this.picker.style.left = `${Math.max(10, left)}px`;
    this.picker.classList.remove("hidden");
    
    if (this.pickerSearch) {
      this.pickerSearch.value = "";
      this.pickerSearch.focus();
    }
    
    this.renderPickerList("");
  }

  closePicker() {
    this.picker?.classList.add("hidden");
    this.activeDay = null;
    this.activeMeal = null;
  }

  renderPickerList(query = "") {
    if (!this.pickerList) return;
    this.pickerList.innerHTML = "";

    const recipes = window.RECIPES_DB || [];
    const filtered = query
      ? this.U.fuzzySearch(query, recipes, ["name", "description"])
      : recipes;

    if (!filtered.length) {
      this.pickerList.innerHTML = `<div style="font-size: 0.7rem; color: #999; text-align: center; padding: 10px;">No recipes match search</div>`;
      return;
    }

    filtered.forEach((recipe) => {
      const button = document.createElement("button");
      button.className = "suggestion-item";
      button.style.width = "100%";
      button.style.padding = "6px 8px";
      button.style.border = "none";
      button.style.background = "none";
      button.style.borderRadius = "6px";
      button.style.cursor = "pointer";
      button.style.textAlign = "left";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.gap = "8px";
      button.style.fontSize = "0.75rem";
      button.style.transition = "background 0.2s ease";

      // Simple pantry score calculation to display as badge
      let matchPercent = 0;
      if (window.VestaRecipeInstance) {
        matchPercent = window.VestaRecipeInstance.analyzeRecipe(recipe).matchPercent;
      }

      button.innerHTML = `
        <span style="font-size: 1rem;">${recipe.emoji || "🍳"}</span>
        <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
          <span style="font-weight: 500; color: var(--color-forest); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${recipe.name}</span>
          <span style="font-size: 0.6rem; color: #799482;">${recipe.readyMinutes} min · ${matchPercent}% pantry</span>
        </div>`;

      button.addEventListener("click", () => {
        this.assignRecipe(this.activeDay, this.activeMeal, recipe.id);
      });

      button.addEventListener("mouseenter", () => {
        button.style.background = "rgba(101, 140, 62, 0.08)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.background = "";
      });

      this.pickerList.appendChild(button);
    });
  }

  // ─── Recommendation Engine ─────────────────────────────────────

  updateRecommendation() {
    if (!this.recomDesc || !this.recomBtn) return;

    // Scan for expiring items in pantry to find a compatible recipe
    let expiringProduct = null;
    if (window.VestaRecipeInstance) {
      const expiringIds = window.VestaRecipeInstance.getExpiringProductIds();
      if (expiringIds.size > 0) {
        const firstId = Array.from(expiringIds)[0];
        expiringProduct = window.PRODUCTS_DB?.find((p) => p.id === firstId);
      }
    }

    let recommendedRecipe = null;
    if (expiringProduct) {
      // Find a recipe utilizing this expiring item
      recommendedRecipe = window.RECIPES_DB?.find((r) =>
        r.ingredients?.some((ing) => ing.productId === expiringProduct.id)
      );
    }

    // Fallback: Pick a recipe with the best pantry match
    if (!recommendedRecipe && window.RECIPES_DB?.length) {
      let bestScore = -1;
      window.RECIPES_DB.forEach((r) => {
        const score = window.VestaRecipeInstance ? window.VestaRecipeInstance.analyzeRecipe(r).matchPercent : 0;
        if (score > bestScore) {
          bestScore = score;
          recommendedRecipe = r;
        }
      });
    }

    // Default Fallback
    if (!recommendedRecipe) {
      recommendedRecipe = window.RECIPES_DB?.[0];
    }

    if (!recommendedRecipe) return;

    // Find the next empty Dinner slot in planner to schedule for
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let targetDay = "Thu"; // Default target
    for (let i = 0; i < days.length; i++) {
      if (this.planner[days[i]] && this.planner[days[i]]["D"] === null) {
        targetDay = days[i];
        break;
      }
    }

    this.recomDesc.innerHTML = expiringProduct
      ? `Due to expiring <strong>${expiringProduct.name}</strong>, we recommend the nutritious <strong>${recommendedRecipe.name}</strong> for ${this.getFullDayName(targetDay)} Dinner to minimize waste.`
      : `Based on your current pantry assets, we recommend scheduling <strong>${recommendedRecipe.name}</strong> for ${this.getFullDayName(targetDay)} Dinner!`;

    // Bind schedule button click
    this.recomBtn.textContent = `Schedule Dinner (${targetDay})`;
    this.recomBtn.disabled = false;
    this.recomBtn.style.opacity = "";
    
    // Clear old listeners by cloning
    const newBtn = this.recomBtn.cloneNode(true);
    this.recomBtn.parentNode.replaceChild(newBtn, this.recomBtn);
    this.recomBtn = newBtn;

    this.recomBtn.addEventListener("click", () => {
      this.assignRecipe(targetDay, "D", recommendedRecipe.id);
      this.recomBtn.textContent = "Scheduled! 🗓️";
      this.recomBtn.disabled = true;
      this.recomBtn.style.opacity = "0.7";
    });
  }

  // ─── Render View ───────────────────────────────────────────────

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayStr = new Date().toLocaleDateString("en-US", { weekday: "short" });

    days.forEach((day) => {
      const activeClass = todayStr === day ? " active" : "";
      const dayData = this.planner[day] || { B: null, L: null, D: null };

      const dayCard = document.createElement("div");
      dayCard.className = `cal-day${activeClass}`;
      dayCard.style.display = "grid";
      dayCard.style.gridTemplateColumns = "80px 1fr";
      dayCard.style.alignItems = "center";
      dayCard.style.padding = "12px 16px";
      dayCard.style.borderRadius = "16px";
      dayCard.style.background = activeClass ? "rgba(101, 140, 62, 0.05)" : "var(--color-cream-light)";
      dayCard.style.border = activeClass ? "1px solid rgba(101, 140, 62, 0.2)" : "1px solid transparent";

      const dayLabel = document.createElement("span");
      dayLabel.className = "day-num";
      dayLabel.style.fontWeight = "700";
      dayLabel.style.fontSize = "0.95rem";
      dayLabel.style.color = "var(--color-forest)";
      dayLabel.textContent = day;

      const previewDiv = document.createElement("div");
      previewDiv.className = "cal-meal-preview";
      previewDiv.style.display = "flex";
      previewDiv.style.flexWrap = "wrap";
      previewDiv.style.gap = "8px";
      previewDiv.style.width = "100%";

      // Meal Slots: Breakfast, Lunch, Dinner
      ["B", "L", "D"].forEach((mealType) => {
        const recipeId = dayData[mealType];
        const recipe = recipeId ? window.RECIPES_DB?.find((r) => r.id === recipeId) : null;
        
        const slot = document.createElement("div");
        
        if (recipe) {
          slot.className = "planner-meal-slot planned";
          slot.style.display = "flex";
          slot.style.alignItems = "center";
          slot.style.gap = "6px";
          slot.style.padding = "4px 8px";
          slot.style.borderRadius = "8px";
          slot.style.background = "rgba(233, 242, 167, 0.4)";
          slot.style.border = "1px solid rgba(101, 140, 62, 0.2)";
          slot.style.cursor = "pointer";
          slot.style.minWidth = "80px";
          slot.style.fontSize = "0.75rem";
          slot.style.transition = "transform 0.2s ease, border-color 0.2s ease";

          slot.innerHTML = `
            <span class="meal-tag ${mealType} active-meal">${mealType}</span>
            <span class="slot-text" style="color: var(--color-forest); font-weight: 500;">${recipe.emoji || "🍳"} ${recipe.name.split(" ").slice(-2).join(" ")}</span>
            <span class="remove-meal" style="color: rgba(220, 53, 69, 0.6); font-weight: bold; margin-left: 8px; cursor: pointer; font-size: 0.9rem; transition: color 0.2s;">&times;</span>`;

          // Hover effects
          slot.addEventListener("mouseenter", () => {
            slot.style.transform = "scale(1.02)";
            slot.style.borderColor = "var(--color-sage)";
          });
          slot.addEventListener("mouseleave", () => {
            slot.style.transform = "";
            slot.style.borderColor = "rgba(101, 140, 62, 0.2)";
          });

          // Click on slot opens Recipe Detail modal
          slot.addEventListener("click", () => {
            window.VestaRecipeInstance?.openDetail(recipeId);
          });

          // Click on remove unassigns meal
          slot.querySelector(".remove-meal")?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeRecipe(day, mealType);
          });

        } else {
          slot.className = "planner-meal-slot";
          slot.style.display = "flex";
          slot.style.alignItems = "center";
          slot.style.gap = "6px";
          slot.style.padding = "4px 8px";
          slot.style.borderRadius = "8px";
          slot.style.background = "rgba(255, 255, 255, 0.6)";
          slot.style.border = "1px dashed var(--color-cream-dark)";
          slot.style.cursor = "pointer";
          slot.style.minWidth = "80px";
          slot.style.fontSize = "0.75rem";
          slot.style.transition = "background 0.2s ease, border-style 0.2s ease";

          slot.innerHTML = `
            <span class="meal-tag ${mealType}">${mealType}</span>
            <span class="slot-text" style="color: #799482; font-style: italic;">Plan...</span>`;

          slot.addEventListener("mouseenter", () => {
            slot.style.background = "rgba(255, 255, 255, 0.9)";
            slot.style.borderStyle = "solid";
          });
          slot.addEventListener("mouseleave", () => {
            slot.style.background = "rgba(255, 255, 255, 0.6)";
            slot.style.borderStyle = "dashed";
          });

          // Click on empty slot opens Recipe floating picker
          slot.addEventListener("click", (e) => {
            e.stopPropagation();
            this.openPicker(slot, day, mealType);
          });
        }

        previewDiv.appendChild(slot);
      });

      dayCard.appendChild(dayLabel);
      dayCard.appendChild(previewDiv);
      this.container.appendChild(dayCard);
    });
  }

  // ─── Events Binding ────────────────────────────────────────────

  bindEvents() {
    this.pickerClose?.addEventListener("click", () => this.closePicker());

    this.pickerSearch?.addEventListener("input", (e) => {
      this.renderPickerList(e.target.value);
    });

    // Close picker when clicking anywhere else
    document.addEventListener("click", (e) => {
      if (this.picker && !this.picker.contains(e.target) && !e.target.closest(".planner-meal-slot")) {
        this.closePicker();
      }
    });

    // Close picker on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closePicker();
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────

  getFullDayName(day) {
    const map = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday"
    };
    return map[day] || day;
  }

  getFullMealName(meal) {
    const map = { B: "Breakfast", L: "Lunch", D: "Dinner" };
    return map[meal] || meal;
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

(function initVestaPlanner() {
  if (window.VestaUtils && window.RECIPES_DB && document.getElementById("planner-calendar-days")) {
    window.VestaPlannerInstance = new VestaPlannerManager();
  }
})();
