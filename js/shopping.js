/**
 * Vesta Smart Kitchen — Shopping Module (Phase 3)
 * Dynamic collaborative checklist with auto-complete, categories, low-stock restock, and pantry check-in.
 */

class VestaShoppingManager {
  constructor() {
    this.U = window.VestaUtils;
    this.list = [];
    this.viewMode = "flat"; // "flat" or "grouped"
    this.searchQuery = "";
    this.activeAutocompleteItem = null;

    this.container = document.getElementById("shopping-checklist");
    this.countLabel = document.getElementById("checked-count");
    this.input = document.getElementById("add-grocery-input");
    this.addBtn = document.getElementById("add-grocery-btn");
    this.suggestions = document.getElementById("shop-autocomplete-suggestions");

    this.btnFlat = document.getElementById("shop-view-flat-btn");
    this.btnGrouped = document.getElementById("shop-view-grouped-btn");
    this.btnAutorestock = document.getElementById("btn-shop-autorestock");
    this.btnCheckout = document.getElementById("btn-shop-checkout");
    this.btnClearChecked = document.getElementById("btn-shop-clear-checked");

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.render();
  }

  // ─── State Persistence ────────────────────────────────────────

  loadState() {
    try {
      const raw = localStorage.getItem("vesta_shopping");
      this.list = raw ? JSON.parse(raw) : this.getSeedShoppingList();
    } catch {
      this.list = this.getSeedShoppingList();
    }
    
    // Sync view mode preference
    this.viewMode = localStorage.getItem("vesta_shop_view_mode") || "flat";
    this.updateToggleButtons();
  }

  saveState() {
    localStorage.setItem("vesta_shopping", JSON.stringify(this.list));
    this.updateCheckedCount();
  }

  getSeedShoppingList() {
    return [
      {
        id: "shop_seed_1",
        name: "Greek Feta Cheese",
        category: "Dairy",
        quantity: 200,
        unit: "g",
        checked: true,
        dateAdded: new Date().toISOString().split("T")[0]
      },
      {
        id: "shop_seed_2",
        name: "Fresh Rosemary Sprigs",
        category: "Produce",
        quantity: 1,
        unit: "pack",
        checked: false,
        dateAdded: new Date().toISOString().split("T")[0]
      },
      {
        id: "shop_seed_3",
        name: "Whole Grain Wheat Flour",
        category: "Pantry",
        quantity: 1,
        unit: "kg",
        checked: false,
        dateAdded: new Date().toISOString().split("T")[0]
      },
      {
        id: "shop_seed_4",
        name: "Spanish Vine Tomatoes",
        category: "Produce",
        quantity: 500,
        unit: "g",
        checked: false,
        dateAdded: new Date().toISOString().split("T")[0]
      }
    ];
  }

  updateCheckedCount() {
    if (!this.countLabel) return;
    const total = this.list.length;
    const checked = this.list.filter((item) => item.checked).length;
    this.countLabel.textContent = `${checked} of ${total} checked`;
  }

  updateToggleButtons() {
    if (this.btnFlat && this.btnGrouped) {
      if (this.viewMode === "flat") {
        this.btnFlat.style.background = "var(--color-forest)";
        this.btnFlat.style.color = "white";
        this.btnGrouped.style.background = "";
        this.btnGrouped.style.color = "";
      } else {
        this.btnGrouped.style.background = "var(--color-forest)";
        this.btnGrouped.style.color = "white";
        this.btnFlat.style.background = "";
        this.btnFlat.style.color = "";
      }
    }
  }

  // ─── Actions ──────────────────────────────────────────────────

  addItem(name, category = "Other", quantity = 1, unit = "pcs") {
    // If item already exists in shopping list and is not checked, increase quantity
    const existing = this.list.find(
      (item) => item.name.toLowerCase().trim() === name.toLowerCase().trim() && !item.checked
    );
    if (existing) {
      existing.quantity = parseFloat(existing.quantity) + parseFloat(quantity);
    } else {
      this.list.push({
        id: this.U.generateId("shop"),
        name: name.trim(),
        category: category,
        quantity: parseFloat(quantity),
        unit: unit,
        checked: false,
        dateAdded: new Date().toISOString().split("T")[0],
      });
    }
    this.saveState();
    this.render();
  }

  toggleItem(id, checkedState) {
    const item = this.list.find((i) => i.id === id);
    if (item) {
      item.checked = checkedState;
      this.saveState();
      
      // Mirror checked class visual state on DOM immediately for snappy feels
      const row = document.querySelector(`.check-item[data-id="${id}"]`);
      if (row) {
        row.classList.toggle("checked", checkedState);
      }
    }
  }

  updateQty(id, delta) {
    const item = this.list.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(0.1, parseFloat(item.quantity) + delta);
      // Format to neat decimal if fraction
      if (!Number.isInteger(item.quantity)) {
        item.quantity = parseFloat(item.quantity.toFixed(1));
      }
      this.saveState();
      
      // Update DOM text dynamically
      const qtyLabel = document.querySelector(`.check-item[data-id="${id}"] .shop-qty-val`);
      if (qtyLabel) {
        qtyLabel.textContent = `${item.quantity} ${item.unit}`;
      }
    }
  }

  deleteItem(id) {
    this.list = this.list.filter((i) => i.id !== id);
    this.saveState();
    this.render();
  }

  clearChecked() {
    const originalCount = this.list.length;
    this.list = this.list.filter((i) => !i.checked);
    const deletedCount = originalCount - this.list.length;
    this.saveState();
    this.render();
    if (deletedCount > 0) {
      this.showToast(`Cleared ${deletedCount} checked item(s).`);
    }
  }

  exportPDF() {
    if (typeof html2pdf === "undefined") { this.showToast("PDF library not loaded."); return; }
    const htmlContent = this.buildPDFContent();
    html2pdf().set({ margin: 10, filename: `vesta-shopping-${new Date().toISOString().split("T")[0]}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4" } }).from(htmlContent).save().then(() => this.showToast("Shopping list exported.")).catch((e) => { console.error(e); this.showToast("Export failed."); });
  }

  buildPDFContent() {
    const rows = this.list.map((item) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.checked ? "☑" : "☐"}</td><td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td><td style="padding:8px;border-bottom:1px solid #eee;">${item.category}</td><td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity} ${item.unit}</td><td style="padding:8px;border-bottom:1px solid #eee;"></td></tr>`).join("");
    return `<div style="padding:20px;font-family:sans-serif;"><h1>Vesta Shopping List</h1><table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;margin-top:20px;"><thead><tr><th style="border-bottom:2px solid #ccc;padding:8px;">Status</th><th style="border-bottom:2px solid #ccc;padding:8px;">Item</th><th style="border-bottom:2px solid #ccc;padding:8px;">Category</th><th style="border-bottom:2px solid #ccc;padding:8px;">Qty</th><th style="border-bottom:2px solid #ccc;padding:8px;">Notes</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  // ─── Bridges & Integrations ────────────────────────────────────

  autoRestockLowStock() {
    const inventory = window.VestaInventoryInstance?.inventory || [];
    if (!inventory.length) {
      this.showToast("Your pantry is currently empty! Seed it first.");
      return;
    }

    let addedCount = 0;
    inventory.forEach((item) => {
      if (this.U.isLowStock(item, window.LOW_STOCK_RULES)) {
        // Look up corresponding product to get default weight
        const product = window.PRODUCTS_DB?.find((p) => p.id === item.productId);
        const qty = product?.defaultQuantity || 1;
        const unit = item.unit;
        
        // Check if this item is already on the shopping list
        const alreadyListed = this.list.some(
          (s) => s.name.toLowerCase().trim() === item.name.toLowerCase().trim() && !s.checked
        );

        if (!alreadyListed) {
          this.list.push({
            id: this.U.generateId("shop"),
            name: item.name,
            category: item.category,
            quantity: qty,
            unit: unit,
            checked: false,
            dateAdded: new Date().toISOString().split("T")[0],
          });
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      this.saveState();
      this.render();
      this.showToast(`Added ${addedCount} low-stock item(s) to shopping list.`);
    } else {
      this.showToast("No new low-stock items detected in your pantry!");
    }
  }

  checkoutToPantry() {
    const checkedItems = this.list.filter((i) => i.checked);
    if (!checkedItems.length) {
      this.showToast("Please check off the items you have bought first!");
      return;
    }

    if (!window.VestaInventoryInstance) {
      this.showToast("Pantry Inventory module is not loaded yet.");
      return;
    }

    checkedItems.forEach((shopItem) => {
      // Find matching product in products database to get complete details
      const product = window.PRODUCTS_DB?.find(
        (p) => p.name.toLowerCase().trim() === shopItem.name.toLowerCase().trim()
      );
      
      const category = product?.category || shopItem.category || "Other";
      const brand = product?.brand || "Fresh";
      const emoji = product?.emoji || this.U.getCategoryEmoji(category);
      const shelfLife = product?.shelfLifeDays || 7;
      const expiry = new Date(Date.now() + shelfLife * 86400000).toISOString().split("T")[0];

      // Add to inventory
      window.VestaInventoryInstance.addOrUpdateItem({
        productId: product?.id || null,
        name: shopItem.name,
        category: category,
        brand: brand,
        unit: shopItem.unit,
        emoji: emoji,
        image: product?.image || "",
        batches: [
          {
            id: this.U.generateId("batch"),
            quantity: shopItem.quantity,
            expiryDate: expiry,
            addedDate: new Date().toISOString().split("T")[0],
          },
        ],
      });
    });

    // Remove checked items from shopping list
    this.list = this.list.filter((i) => !i.checked);
    this.saveState();
    this.render();

    // Rerender inventory drawer to reflect restock instantly
    window.VestaInventoryInstance.render();

    this.showToast(`Restocked ${checkedItems.length} item(s) into your pantry! 🌿`);
  }

  // ─── Autocomplete Handlers ─────────────────────────────────────

  handleSearchInput(val) {
    this.searchQuery = val.trim();
    if (!this.searchQuery) {
      this.suggestions.classList.add("hidden");
      this.activeAutocompleteItem = null;
      return;
    }

    const matches = this.U.fuzzySearch(this.searchQuery, window.PRODUCTS_DB || [], ["name", "category"]);
    const listSlice = matches.slice(0, 5);

    if (!listSlice.length) {
      this.suggestions.classList.add("hidden");
      this.activeAutocompleteItem = null;
      return;
    }

    this.suggestions.innerHTML = "";
    listSlice.forEach((prod) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.style.padding = "8px 12px";
      div.style.cursor = "pointer";
      div.style.borderBottom = "1px solid var(--color-cream-light)";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "8px";
      div.style.fontSize = "0.8rem";
      div.style.transition = "background 0.2s ease";

      div.innerHTML = `
        <span style="font-size: 1.1rem;">${prod.emoji}</span>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 500; color: var(--color-forest);">${prod.name}</span>
          <span style="font-size: 0.65rem; color: #799482;">${prod.category} · default: ${prod.defaultQuantity}${prod.defaultUnit}</span>
        </div>`;

      div.addEventListener("click", () => {
        this.input.value = "";
        this.suggestions.classList.add("hidden");
        const customQty = document.getElementById("add-grocery-qty")?.value;
        const customUnit = document.getElementById("add-grocery-unit")?.value;
        const qty = customQty && customQty !== "1" ? parseFloat(customQty) : prod.defaultQuantity;
        const unit = customUnit && customUnit !== "pcs" ? customUnit : prod.defaultUnit;
        this.addItem(prod.name, prod.category, qty, unit);
        this.input.focus();
      });

      div.addEventListener("mouseenter", () => {
        div.style.background = "rgba(101, 140, 62, 0.08)";
      });
      div.addEventListener("mouseleave", () => {
        div.style.background = "";
      });

      this.suggestions.appendChild(div);
    });

    this.suggestions.classList.remove("hidden");
  }

  // ─── Events Binding ────────────────────────────────────────────

  bindEvents() {
    // Add custom buttons listeners
    this.addBtn?.addEventListener("click", () => {
      const val = this.input.value.trim();
      const qty = document.getElementById("add-grocery-qty")?.value || 1;
      const unit = document.getElementById("add-grocery-unit")?.value || "pcs";
      if (val) {
        this.addItem(val, "Other", qty, unit);
        this.input.value = "";
        this.suggestions.classList.add("hidden");
      }
    });

    this.input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = this.input.value.trim();
        const qty = document.getElementById("add-grocery-qty")?.value || 1;
        const unit = document.getElementById("add-grocery-unit")?.value || "pcs";
        if (val) {
          this.addItem(val, "Other", qty, unit);
          this.input.value = "";
          this.suggestions.classList.add("hidden");
        }
      }
    });

    this.input?.addEventListener(
      "input",
      this.U.debounce((e) => this.handleSearchInput(e.target.value), 200)
    );

    // Close autocomplete when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.input?.contains(e.target) && !this.suggestions?.contains(e.target)) {
        this.suggestions?.classList.add("hidden");
      }
    });

    // View toggles
    this.btnFlat?.addEventListener("click", () => {
      this.viewMode = "flat";
      localStorage.setItem("vesta_shop_view_mode", "flat");
      this.updateToggleButtons();
      this.render();
    });

    this.btnGrouped?.addEventListener("click", () => {
      this.viewMode = "grouped";
      localStorage.setItem("vesta_shop_view_mode", "grouped");
      this.updateToggleButtons();
      this.render();
    });

    // Toolbar buttons
    this.btnAutorestock?.addEventListener("click", () => this.autoRestockLowStock());
    this.btnCheckout?.addEventListener("click", () => this.checkoutToPantry());
    this.btnClearChecked?.addEventListener("click", () => this.clearChecked());
    document.getElementById("btn-shop-export-pdf")?.addEventListener("click", () => this.exportPDF());
  }

  // ─── Render View ───────────────────────────────────────────────

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.updateCheckedCount();

    if (!this.list.length) {
      this.container.innerHTML = `
        <div style="padding: 30px; text-align: center; color: #799482;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">🛒</span>
          <h4 style="font-family: var(--font-heading); color: var(--color-forest); margin-bottom: 5px;">Your grocery list is empty</h4>
          <p style="font-size: 0.8rem; line-height: 1.4;">Add items above, automatically load low-stock ingredients, or import missing recipe items!</p>
        </div>`;
      return;
    }

    if (this.viewMode === "flat") {
      this.list.forEach((item) => {
        this.container.appendChild(this.buildRow(item));
      });
    } else {
      // Group by Category
      const groups = {};
      this.list.forEach((item) => {
        const cat = item.category || "Other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });

      Object.keys(groups).sort().forEach((catName) => {
        const groupHeader = document.createElement("div");
        groupHeader.className = "shop-group-header";
        groupHeader.style.padding = "6px 12px";
        groupHeader.style.fontSize = "0.75rem";
        groupHeader.style.fontWeight = "bold";
        groupHeader.style.color = "var(--color-forest)";
        groupHeader.style.background = "var(--color-cream-light)";
        groupHeader.style.borderRadius = "8px";
        groupHeader.style.margin = "10px 0 6px 0";
        groupHeader.style.display = "flex";
        groupHeader.style.alignItems = "center";
        groupHeader.style.gap = "6px";
        
        const emoji = this.U.getCategoryEmoji(catName);
        groupHeader.innerHTML = `<span>${emoji}</span><span>${catName}</span>`;
        this.container.appendChild(groupHeader);

        groups[catName].forEach((item) => {
          this.container.appendChild(this.buildRow(item));
        });
      });
    }
  }

  buildRow(item) {
    const li = document.createElement("li");
    li.className = `check-item${item.checked ? " checked" : ""}`;
    li.setAttribute("data-id", item.id);
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.padding = "8px 12px";
    li.style.borderBottom = "1px solid var(--color-cream-light)";
    li.style.animation = "fadeIn 0.3s ease";

    const emoji = window.PRODUCTS_DB?.find((p) => p.name.toLowerCase().trim() === item.name.toLowerCase().trim())?.emoji || this.U.getCategoryEmoji(item.category);

    li.innerHTML = `
      <label class="checkbox-container" style="display: flex; align-items: center; gap: 8px; flex: 1; cursor: pointer;">
        <input type="checkbox" class="shop-checkbox" ${item.checked ? "checked" : ""}>
        <span class="checkmark"></span>
        <span style="font-size: 1.1rem; flex-shrink: 0; line-height: 1;">${emoji}</span>
        <span class="item-label" style="font-size: 0.85rem; color: var(--color-forest); font-weight: 500;">${item.name}</span>
      </label>
      
      <div class="shop-qty-wrapper" style="display: flex; align-items: center; gap: 6px; margin: 0 10px;">
        <button class="qty-btn btn-minus" style="width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--color-cream-dark); background: white; font-size: 0.8rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-forest);">-</button>
        <span class="shop-qty-val" style="font-size: 0.75rem; color: var(--color-forest); font-weight: 600; min-width: 45px; text-align: center;">${item.quantity} ${item.unit}</span>
        <button class="qty-btn btn-plus" style="width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--color-cream-dark); background: white; font-size: 0.8rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-forest);">+</button>
      </div>
      
      <button class="delete-shop-item" aria-label="Delete" style="background: none; border: none; font-size: 1.1rem; color: #c88; cursor: pointer; padding: 0 4px; display: flex; align-items: center;">&times;</button>`;

    // Checkbox toggling
    li.querySelector(".shop-checkbox")?.addEventListener("change", (e) => {
      this.toggleItem(item.id, e.target.checked);
    });

    // Quantity click handlers
    li.querySelector(".btn-minus")?.addEventListener("click", (e) => {
      e.stopPropagation();
      // Decrease by appropriate delta: if L/g/ml, decrease by 100 or 0.5; otherwise 1
      const delta = (item.unit === "g" || item.unit === "ml") ? -100 : (item.unit === "L" ? -0.25 : -1);
      this.updateQty(item.id, delta);
    });

    li.querySelector(".btn-plus")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const delta = (item.unit === "g" || item.unit === "ml") ? 100 : (item.unit === "L" ? 0.25 : 1);
      this.updateQty(item.id, delta);
    });

    // Delete button
    li.querySelector(".delete-shop-item")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteItem(item.id);
    });

    return li;
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

(function initVestaShopping() {
  if (window.VestaUtils && window.PRODUCTS_DB && document.getElementById("shopping-checklist")) {
    window.VestaShoppingInstance = new VestaShoppingManager();
  }
})();
