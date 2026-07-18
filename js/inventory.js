/**
 * Vesta Smart Kitchen — Inventory System (Phase 1)
 * Data-driven pantry with search, filters, batches, persistence & PDF export
 */

class VestaInventoryManager {
  constructor() {
    const U = window.VestaUtils;

    this.U = U;
    this.inventory = [];
    this.recentSearches = [];
    this.recentlyUsed = [];
    this.currentFilter = "all";
    this.currentSort = "recently_added";
    this.isGridView = true;
    this.activeMenuItemId = null;
    this.suggestionIndex = -1;
    this.currentSuggestions = [];

    this.container = document.getElementById("pantry-items-container");
    this.expiredContainer = document.getElementById("pantry-expired-container");
    this.searchInput = document.getElementById("pantry-search-input");
    this.suggestionsDropdown = document.getElementById("search-suggestions");
    this.sortSelect = document.getElementById("pantry-sort-select");
    this.alertsPanel = document.getElementById("pantry-alerts-panel");
    this.alertMessage = document.getElementById("waste-alert-message");
    this.overlay = document.getElementById("modal-overlay");
    this.editModal = document.getElementById("modal-edit-item");
    this.viewModal = document.getElementById("modal-view-item");
    this.inventoryForm = document.getElementById("inventory-form");
    this.batchesEditor = document.getElementById("batches-editor");

    this.debouncedSearch = U.debounce((val) => this.renderSuggestions(val), 250);

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.render();
  }

  // ─── Persistence ───────────────────────────────────────────────

  loadState() {
    const stored = localStorage.getItem("vesta_inventory");
    if (stored) {
      try {
        this.inventory = this.normalizeItems(JSON.parse(stored));
      } catch {
        this.inventory = this.normalizeItems(window.INITIAL_INVENTORY_SEED || []);
      }
    } else {
      this.inventory = this.normalizeItems(window.INITIAL_INVENTORY_SEED || []);
      this.saveState();
    }

    this.recentSearches = this.loadJSON("vesta_recent_searches", []);
    this.recentlyUsed = this.loadJSON("vesta_recent_products", []);
    this.currentFilter = localStorage.getItem("vesta_inventory_filter") || "all";
    this.currentSort = localStorage.getItem("vesta_inventory_sort") || "recently_added";
    this.isGridView = localStorage.getItem("vesta_inventory_view") !== "list";

    const activeTab = document.querySelector(`.tab-btn[data-cat="${this.currentFilter}"]`);
    if (activeTab) {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      activeTab.classList.add("active");
    }
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

  normalizeItems(items) {
    return items.map((item) => ({
      ...item,
      favorite: item.favorite ?? item.isPinned ?? false,
      notes: item.notes || "",
      lowStockManual: item.lowStockManual || false,
      batches: (item.batches || []).map((b, i) => ({
        id: b.id || `batch_${item.id}_${i}`,
        quantity: parseFloat(b.quantity) || 0,
        expiryDate: b.expiryDate,
        addedDate: b.addedDate || item.dateAdded,
      })),
    }));
  }

  saveState() {
    localStorage.setItem("vesta_inventory", JSON.stringify(this.inventory));
  }

  savePrefs() {
    localStorage.setItem("vesta_inventory_filter", this.currentFilter);
    localStorage.setItem("vesta_inventory_sort", this.currentSort);
    localStorage.setItem("vesta_inventory_view", this.isGridView ? "grid" : "list");
  }

  saveRecentSearches() {
    localStorage.setItem("vesta_recent_searches", JSON.stringify(this.recentSearches.slice(0, 8)));
  }

  saveRecentProducts() {
    localStorage.setItem("vesta_recent_products", JSON.stringify(this.recentlyUsed));
  }

  // ─── CRUD ────────────────────────────────────────────────────

  addOrUpdateItem(itemData) {
    const existingIndex = this.inventory.findIndex((i) => i.id === itemData.id);

    const payload = {
      id: itemData.id || this.U.generateId(),
      productId: itemData.productId || null,
      name: itemData.name,
      category: itemData.category,
      brand: itemData.brand || "Fresh",
      unit: itemData.unit,
      favorite: itemData.favorite || false,
      emoji: itemData.emoji || this.U.getCategoryEmoji(itemData.category),
      notes: itemData.notes || "",
      lowStockManual: itemData.lowStockManual || false,
      image: itemData.image || "",
      batches: itemData.batches,
      dateAdded: itemData.dateAdded || new Date().toISOString().split("T")[0],
    };

    if (existingIndex > -1) {
      payload.dateAdded = this.inventory[existingIndex].dateAdded;
      payload.favorite = this.inventory[existingIndex].favorite;
      this.inventory[existingIndex] = payload;
    } else {
      this.inventory.push(payload);
    }

    if (itemData.productId) this.markProductAsUsed(itemData.productId);
    this.saveState();
    this.render();
  }

  deleteItem(itemId) {
    this.inventory = this.inventory.filter((i) => i.id !== itemId);
    this.saveState();
    this.render();
  }

  toggleFavorite(itemId) {
    const item = this.inventory.find((i) => i.id === itemId);
    if (!item) return;
    item.favorite = !item.favorite;
    this.saveState();
    this.render();
    this.showToast(item.favorite ? `Added ${item.name} to favorites.` : `Removed ${item.name} from favorites.`);
  }

  toggleLowStock(itemId) {
    const item = this.inventory.find((i) => i.id === itemId);
    if (!item) return;
    item.lowStockManual = !item.lowStockManual;
    this.saveState();
    this.render();
  }

  consumePortion(itemId, amount = null) {
    const item = this.inventory.find((i) => i.id === itemId);
    if (!item?.batches?.length) return;

    const totalQty = this.U.getTotalQuantity(item.batches);
    let deductAmount = amount;

    if (deductAmount === null) {
      if (item.unit === "pieces" || item.unit === "packs") deductAmount = 1;
      else deductAmount = Math.max(10, Math.round((totalQty * 0.25) / 10) * 10);
    }

    if (deductAmount >= totalQty) {
      this.showToast(`Consumed remaining ${this.U.formatQuantity(totalQty, item.unit)} of ${item.name}.`);
      this.deleteItem(itemId);
      return;
    }

    item.batches.sort((a, b) => this.U.parseDate(a.expiryDate) - this.U.parseDate(b.expiryDate));
    let remaining = deductAmount;

    for (let i = 0; i < item.batches.length && remaining > 0; i++) {
      const batch = item.batches[i];
      const batchQty = parseFloat(batch.quantity);
      if (batchQty > remaining) {
        batch.quantity = parseFloat((batchQty - remaining).toFixed(2));
        remaining = 0;
      } else {
        remaining -= batchQty;
        item.batches.splice(i, 1);
        i--;
      }
    }

    this.showToast(`Consumed ${this.U.formatQuantity(deductAmount, item.unit)} of ${item.name}.`);
    this.saveState();
    this.render();
  }

  markProductAsUsed(productId) {
    this.recentlyUsed = [productId, ...this.recentlyUsed.filter((id) => id !== productId)].slice(0, 8);
    this.saveRecentProducts();
  }

  trackSearch(term) {
    const t = term.trim();
    if (!t) return;
    this.recentSearches = [t, ...this.recentSearches.filter((s) => s !== t)].slice(0, 8);
    this.saveRecentSearches();
  }

  getProductMeta(item) {
    return window.PRODUCTS_DB?.find((p) => p.id === item.productId) || null;
  }

  getItemImage(item) {
    const prod = this.getProductMeta(item);
    return item.image || prod?.image || "";
  }

  // ─── Filtering & sorting ─────────────────────────────────────

  applyFilters(items) {
    const rules = window.LOW_STOCK_RULES || {};
    let list = [...items];

    switch (this.currentFilter) {
      case "all":
        break;
      case "low_stock":
        list = list.filter((i) => this.U.isLowStock(i, rules));
        break;
      case "favorites":
        list = list.filter((i) => i.favorite);
        break;
      case "expiring_soon":
        list = list.filter((i) => {
          const earliest = this.U.getEarliestExpiry(i.batches);
          return earliest && this.U.getExpiryStatus(earliest.expiryDate) === "expiring";
        });
        break;
      case "expired":
        list = list.filter((i) => this.U.isItemExpired(i));
        break;
      case "recently_added":
        list = this.U.sortInventory(list, "recently_added");
        break;
      case "alphabetical":
        list = this.U.sortInventory(list, "alphabetical");
        break;
      default:
        list = list.filter(
          (i) => i.category.toLowerCase() === this.currentFilter.toLowerCase()
        );
    }

    if (!["recently_added", "alphabetical"].includes(this.currentFilter)) {
      list = this.U.sortInventory(list, this.currentSort);
    }

    return list;
  }

  partitionExpired(items) {
    const active = [];
    const expired = [];

    items.forEach((item) => {
      if (this.U.isItemExpired(item)) expired.push(item);
      else active.push(item);
    });

    return { active, expired };
  }

  // ─── Events ──────────────────────────────────────────────────

  bindEvents() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener("input", (e) => {
      this.suggestionIndex = -1;
      this.debouncedSearch(e.target.value);
    });

    this.searchInput.addEventListener("focus", () => {
      this.renderSuggestions(this.searchInput.value);
    });

    this.searchInput.addEventListener("keydown", (e) => this.handleSearchKeydown(e));

    document.addEventListener("click", (e) => {
      if (
        !this.searchInput.contains(e.target) &&
        !this.suggestionsDropdown.contains(e.target)
      ) {
        this.suggestionsDropdown.classList.add("hidden");
      }
      const menu = document.getElementById("pantry-context-menu");
      if (menu && !menu.contains(e.target) && !e.target.closest(".card-options-btn")) {
        menu.classList.add("hidden");
      }
    });

    document.querySelectorAll(".category-tabs-wrapper .tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.cat;
        this.savePrefs();
        this.render();
      });
    });

    this.sortSelect?.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.savePrefs();
      this.render();
    });


    document.getElementById("menu-action-edit")?.addEventListener("click", () => {
      this.openEditModal(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-consume")?.addEventListener("click", () => {
      this.consumePortion(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-delete")?.addEventListener("click", () => {
      if (confirm("Remove this item from your pantry?")) this.deleteItem(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-view")?.addEventListener("click", () => {
      this.openViewModal(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-favorite")?.addEventListener("click", () => {
      this.toggleFavorite(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-shopping")?.addEventListener("click", () => {
      const item = this.inventory.find((i) => i.id === this.activeMenuItemId);
      if (item) this.addToShoppingListBridge(item);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("menu-action-recipe")?.addEventListener("click", () => {
      const item = this.inventory.find((i) => i.id === this.activeMenuItemId);
      if (item) {
        document.getElementById("pantry-context-menu").classList.add("hidden");
        if (item.productId && window.openRecipesForProduct) {
          window.openRecipesForProduct(item.productId);
        } else {
          this.showToast(`Recipe ideas for ${item.name} — opening Recipes.`);
          document.querySelector(".nav-card.card-recipes")?.click();
        }
      }
    });

    document.getElementById("menu-action-lowstock")?.addEventListener("click", () => {
      this.toggleLowStock(this.activeMenuItemId);
      document.getElementById("pantry-context-menu").classList.add("hidden");
    });

    document.getElementById("btn-clear-all")?.addEventListener("click", () => {
      if (confirm("Clear entire pantry inventory? This cannot be undone.")) {
        this.inventory = [];
        this.saveState();
        this.render();
        this.showToast("Pantry cleared.");
      }
    });

    document.getElementById("btn-export-pdf")?.addEventListener("click", () => this.exportPDF());
    document.getElementById("btn-custom-add")?.addEventListener("click", () => this.openEditModal());
    document.getElementById("btn-add-batch")?.addEventListener("click", () => this.addBatchRow());
    document.getElementById("modal-edit-close")?.addEventListener("click", () => this.closeModals());
    document.getElementById("btn-modal-cancel")?.addEventListener("click", () => this.closeModals());
    document.getElementById("modal-view-close")?.addEventListener("click", () => this.closeModals());
    document.getElementById("btn-view-close-ok")?.addEventListener("click", () => this.closeModals());
    this.overlay?.addEventListener("click", () => this.closeModals());
    this.inventoryForm?.addEventListener("submit", (e) => this.handleFormSubmit(e));
  }

  handleSearchKeydown(e) {
    const items = this.suggestionsDropdown.querySelectorAll(".suggestion-item");
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.suggestionIndex = Math.min(this.suggestionIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle("active", i === this.suggestionIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.suggestionIndex = Math.max(this.suggestionIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle("active", i === this.suggestionIndex));
    } else if (e.key === "Enter" && this.suggestionIndex >= 0) {
      e.preventDefault();
      items[this.suggestionIndex].click();
    } else if (e.key === "Escape") {
      this.suggestionsDropdown.classList.add("hidden");
    }
  }

  renderSuggestions(query = "") {
    const val = query.trim();
    this.suggestionsDropdown.innerHTML = "";
    let matches = !val
      ? (this.recentlyUsed.map((id) => window.PRODUCTS_DB.find((p) => p.id === id)).filter(Boolean).slice(0, 6)
          .concat(window.PRODUCTS_DB.slice(0, 6)).filter((p, i, a) => a.findIndex(x => x.id === p.id) === i).slice(0, 6))
      : this.U.fuzzySearch(val, window.PRODUCTS_DB, ["name", "category", "brand"]).slice(0, 8);

    if (!matches.length && val) {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML = `<div class="suggestion-meta"><span class="suggestion-image-fallback">📦</span><div class="suggestion-details"><span class="suggestion-name">Add "${val}" as custom</span></div></div>`;
      div.onclick = () => { this.suggestionsDropdown.classList.add("hidden"); this.openEditModal(null, val); this.searchInput.value = ""; };
      this.suggestionsDropdown.appendChild(div);
    } else {
      matches.forEach((prod) => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        const img = prod.image ? `<img class="suggestion-thumb" src="${prod.image}" alt="" onerror="this.style.display='none'">` : "";
        div.innerHTML = `<div class="suggestion-meta">${img}<span class="suggestion-image-fallback">${prod.emoji}</span><div class="suggestion-details"><span class="suggestion-name">${prod.name}</span><span class="suggestion-brand">${prod.brand}</span></div></div><span class="suggestion-category">${prod.category}</span>`;
        div.onclick = () => { this.trackSearch(prod.name); this.suggestionsDropdown.classList.add("hidden"); this.addFromSuggestions(prod); this.searchInput.value = ""; };
        this.suggestionsDropdown.appendChild(div);
      });
    }
    this.suggestionsDropdown.classList.remove("hidden");
  }

  addFromSuggestions(product) {
    const expiry = new Date(Date.now() + product.shelfLifeDays * 86400000).toISOString().split("T")[0];
    this.addOrUpdateItem({ productId: product.id, name: product.name, category: product.category, brand: product.brand, unit: product.defaultUnit, emoji: product.emoji, image: product.image || "", batches: [{ id: this.U.generateId("batch"), quantity: product.defaultQuantity, expiryDate: expiry, addedDate: new Date().toISOString().split("T")[0] }] });
    this.showToast(`Added ${product.name}.`);
  }

  addToShoppingListBridge(inventoryItem) {
    const list = this.loadJSON("vesta_shopping", []);
    list.push({ id: this.U.generateId("shop"), name: `${inventoryItem.name}`, category: inventoryItem.category, quantity: this.U.getTotalQuantity(inventoryItem.batches), unit: inventoryItem.unit, checked: false });
    localStorage.setItem("vesta_shopping", JSON.stringify(list));
    this.showToast(`Added ${inventoryItem.name} to Shopping List.`);
  }

  openEditModal(itemId = null, customName = "") {
    this.closeModals();
    const defaultExpiry = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    const setCheck = (id, v) => { const el = document.getElementById(id); if (el) el.checked = v; };

    if (itemId) {
      const item = this.inventory.find((i) => i.id === itemId);
      if (!item) return;
      document.getElementById("modal-title").textContent = "Edit Storage Details";
      set("edit-item-id", item.id); set("edit-product-id", item.productId || ""); set("edit-item-name", item.name);
      set("edit-item-category", item.category); set("edit-item-emoji", item.emoji); set("edit-item-brand", item.brand);
      set("edit-item-unit", item.unit); set("edit-item-notes", item.notes || ""); setCheck("edit-item-lowstock", item.lowStockManual);
      this.renderBatchEditor(item.batches);
    } else {
      document.getElementById("modal-title").textContent = "Add Pantry Item";
      set("edit-item-id", ""); set("edit-product-id", ""); set("edit-item-name", customName);
      set("edit-item-category", "Produce"); set("edit-item-emoji", "🥑"); set("edit-item-brand", "Fresh");
      set("edit-item-unit", "pieces"); set("edit-item-notes", ""); setCheck("edit-item-lowstock", false);
      this.renderBatchEditor([{ quantity: 1, expiryDate: defaultExpiry }]);
    }
    this.overlay.classList.add("active");
    this.editModal.classList.add("active");
  }

  renderBatchEditor(batches) {
    if (!this.batchesEditor) return;
    this.batchesEditor.innerHTML = batches.map((b) => `<div class="batch-edit-row"><input type="number" class="batch-qty-input" value="${b.quantity}" min="0.01" step="any" required><input type="date" class="batch-expiry-input" value="${b.expiryDate}" required><button type="button" class="btn-remove-batch">&times;</button></div>`).join("");
    this.batchesEditor.querySelectorAll(".btn-remove-batch").forEach((btn) => btn.addEventListener("click", () => { if (this.batchesEditor.querySelectorAll(".batch-edit-row").length > 1) btn.closest(".batch-edit-row").remove(); }));
  }

  addBatchRow() {
    const defaultExpiry = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
    const row = document.createElement("div");
    row.className = "batch-edit-row";
    row.innerHTML = `<input type="number" class="batch-qty-input" value="1" min="0.01" step="any" required><input type="date" class="batch-expiry-input" value="${defaultExpiry}" required><button type="button" class="btn-remove-batch">&times;</button>`;
    row.querySelector(".btn-remove-batch").addEventListener("click", () => { if (this.batchesEditor.querySelectorAll(".batch-edit-row").length > 1) row.remove(); });
    this.batchesEditor.appendChild(row);
  }

  collectBatchesFromForm() {
    return [...this.batchesEditor.querySelectorAll(".batch-edit-row")].map((row) => ({ id: this.U.generateId("batch"), quantity: parseFloat(row.querySelector(".batch-qty-input").value), expiryDate: row.querySelector(".batch-expiry-input").value, addedDate: new Date().toISOString().split("T")[0] }));
  }

  openViewModal(itemId) {
    this.closeModals();
    const item = this.inventory.find((i) => i.id === itemId);
    if (!item) return;
    const masterProd = this.getProductMeta(item);
    document.getElementById("view-item-emoji").textContent = item.emoji;
    document.getElementById("view-item-name").textContent = item.name;
    document.getElementById("view-item-category").textContent = item.category;
    document.getElementById("view-item-brand").textContent = item.brand;
    document.getElementById("view-item-description-text").textContent = item.notes || masterProd?.description || "";
    document.getElementById("view-item-calories").textContent = masterProd ? `~${masterProd.caloriesPer100} kcal / 100g` : "~50 kcal / unit";
    const batchesList = document.getElementById("view-item-batches");
    batchesList.innerHTML = "";
    let total = 0, status = "fresh";
    [...item.batches].sort((a,b) => this.U.parseDate(a.expiryDate)-this.U.parseDate(b.expiryDate)).forEach((batch) => {
      total += parseFloat(batch.quantity);
      const es = this.U.getExpiryStatus(batch.expiryDate);
      if (es === "expired") status = "expired"; else if (es === "expiring" && status !== "expired") status = "expiring";
      const li = document.createElement("li"); li.className = "batch-item-row";
      li.innerHTML = `<span class="batch-qty">${this.U.formatQuantity(batch.quantity, item.unit)}</span><span class="batch-expiry">${this.U.formatDate(batch.expiryDate)} — ${this.U.formatExpiryLabel(batch.expiryDate)}</span>`;
      batchesList.appendChild(li);
    });
    document.getElementById("view-item-stock").textContent = this.U.formatQuantity(total, item.unit);
    const statusEl = document.getElementById("view-item-status");
    statusEl.textContent = status === "expired" ? "Expired" : status === "expiring" ? "Nearing Expiry" : "Good / Fresh";
    statusEl.className = `status-pill status-${status === "expired" ? "danger" : status === "expiring" ? "warning" : "fresh"}`;
    this.overlay.classList.add("active"); this.viewModal.classList.add("active");
  }

  closeModals() { this.overlay?.classList.remove("active"); this.editModal?.classList.remove("active"); this.viewModal?.classList.remove("active"); }

  handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("edit-item-name").value.trim();
    const batches = this.collectBatchesFromForm();
    if (!name || !batches.length) return;
    this.addOrUpdateItem({ id: document.getElementById("edit-item-id").value || undefined, productId: document.getElementById("edit-product-id").value || null, name, category: document.getElementById("edit-item-category").value, emoji: document.getElementById("edit-item-emoji").value, brand: document.getElementById("edit-item-brand").value, unit: document.getElementById("edit-item-unit").value, notes: document.getElementById("edit-item-notes").value, lowStockManual: document.getElementById("edit-item-lowstock").checked, batches });
    this.closeModals(); this.showToast(`Saved ${name}.`);
  }

  exportPDF() {
    if (typeof html2pdf === "undefined") { this.showToast("PDF library not loaded."); return; }
    const htmlContent = this.buildPDFContent();
    html2pdf().set({ margin: 10, filename: `vesta-pantry-${new Date().toISOString().split("T")[0]}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4" } }).from(htmlContent).save().then(() => this.showToast("PDF exported.")).catch((e) => { console.error(e); this.showToast("Export failed."); });
  }

  buildPDFContent() {
    const rules = window.LOW_STOCK_RULES || {};
    const rows = this.inventory.map((item) => `<tr><td>${item.name}</td><td>${item.category}</td><td>${this.U.formatQuantity(this.U.getTotalQuantity(item.batches), item.unit)}</td><td>${this.U.getEarliestExpiry(item.batches) ? this.U.formatDate(this.U.getEarliestExpiry(item.batches).expiryDate) : "—"}</td><td>${this.U.isLowStock(item, rules) ? "Yes" : "No"}</td></tr>`).join("");
    return `<div style="padding:20px;font-family:sans-serif;"><h1>Vesta Pantry</h1><table style="width:100%;border-collapse:collapse;font-size:11px;"><thead><tr><th style="border:1px solid #ccc;padding:6px;">Item</th><th style="border:1px solid #ccc;padding:6px;">Category</th><th style="border:1px solid #ccc;padding:6px;">Stock</th><th style="border:1px solid #ccc;padding:6px;">Expiry</th><th style="border:1px solid #ccc;padding:6px;">Low</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  updateAlerts() {
    const names = this.inventory.filter((i) => this.U.isItemExpired(i)).map((i) => i.name);
    if (names.length) { this.alertsPanel?.classList.remove("hidden"); this.alertMessage.innerHTML = `Expired: <strong>${[...new Set(names)].join(", ")}</strong>`; }
    else this.alertsPanel?.classList.add("hidden");
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";
    if (this.expiredContainer) this.expiredContainer.innerHTML = "";
    const filtered = this.applyFilters(this.inventory);
    const showExpiredSection = !["expired", "expiring_soon"].includes(this.currentFilter);
    const { active, expired } = showExpiredSection ? this.partitionExpired(filtered) : { active: filtered, expired: [] };
    this.updateAlerts();
    if (!active.length && !expired.length) {
      this.container.innerHTML = `<div class="empty-pantry-graphic"><span class="empty-icon">🌾</span><h4>Your pantry is perfectly serene.</h4><p>Search above to add items.</p></div>`;
      document.getElementById("pantry-expired-section")?.classList.add("hidden");
      return;
    }
    active.forEach((item) => this.container.appendChild(this.buildCard(item)));
    const sec = document.getElementById("pantry-expired-section");
    if (expired.length && this.expiredContainer) { sec?.classList.remove("hidden"); expired.forEach((item) => this.expiredContainer.appendChild(this.buildCard(item, true))); }
    else sec?.classList.add("hidden");
  }

  buildCard(item, forceExpired = false) {
    const rules = window.LOW_STOCK_RULES || {};
    const totalQty = this.U.getTotalQuantity(item.batches);
    const earliest = this.U.getEarliestExpiry(item.batches);
    const expStatus = earliest ? this.U.getExpiryStatus(earliest.expiryDate) : "fresh";
    const isExpired = forceExpired || expStatus === "expired";
    const isLow = this.U.isLowStock(item, rules);
    const prod = this.getProductMeta(item);
    const progressPercent = Math.min(100, Math.max(10, Math.round((totalQty / (prod?.defaultQuantity || 10)) * 100)));
    const progressClass = progressPercent <= 20 ? "danger-fill" : progressPercent <= 50 ? "warning-fill" : "fresh-fill";
    const expiryClass = isExpired ? "status-danger" : expStatus === "expiring" ? "status-warning" : "status-fresh";
    const imageUrl = this.getItemImage(item);
    const card = document.createElement("div");
    card.className = `pantry-item-card${isExpired ? " expired" : ""}${isLow ? " low-stock" : ""}`;
    card.innerHTML = `<div class="card-header-row"><div class="card-meta-info"><div class="card-image-box">${imageUrl ? `<img class="card-product-image" src="${imageUrl}" alt="" onerror="this.remove()">` : ""}<span class="card-image-fallback">${item.emoji}</span></div><div class="card-title-details"><span class="card-item-title">${item.name}</span><span class="card-item-brand">${item.brand}</span><span class="category-tag">${item.category}</span></div></div><div class="card-actions"><button class="card-fav-btn ${item.favorite ? "active" : ""}">${item.favorite ? "⭐" : "☆"}</button><button class="card-options-btn">⋮</button></div></div><div class="card-body-section"><div class="card-qty-block"><div class="card-qty-row"><span>Stock: <span class="qty-val-label">${this.U.formatQuantity(totalQty, item.unit)}</span></span>${isLow ? ' <span class="low-stock-badge">Low</span>' : ""}</div><div class="card-qty-bar"><div class="qty-bar-fill ${progressClass}" style="width:${progressPercent}%"></div></div></div><div class="card-expiry-row"><span class="expiry-badge-pill ${expiryClass}">⏱️ ${earliest ? this.U.formatExpiryLabel(earliest.expiryDate) : "—"}</span>${item.batches.length > 1 ? `<span class="batch-count-pill">${item.batches.length} batches</span>` : ""}</div></div>`;
    card.querySelector(".card-fav-btn").addEventListener("click", (e) => { e.stopPropagation(); this.toggleFavorite(item.id); });
    card.querySelector(".card-options-btn").addEventListener("click", (e) => { e.stopPropagation(); this.openContextMenu(e, item.id); });
    card.addEventListener("click", () => this.openViewModal(item.id));
    return card;
  }

  openContextMenu(e, itemId) {
    this.activeMenuItemId = itemId;
    const item = this.inventory.find((i) => i.id === itemId);
    const fav = document.getElementById("menu-action-favorite");
    const low = document.getElementById("menu-action-lowstock");
    if (fav && item) fav.textContent = item.favorite ? "☆ Unfavorite" : "⭐ Favorite";
    if (low && item) low.textContent = item.lowStockManual ? "✓ Unmark Low Stock" : "📉 Mark Low Stock";
    const menu = document.getElementById("pantry-context-menu");
    menu.classList.remove("hidden");
    const menuHeight = menu.offsetHeight || 250;
    if (e.clientY + menuHeight > window.innerHeight) {
      menu.style.top = `${e.pageY - menuHeight - 5}px`;
    } else {
      menu.style.top = `${e.pageY + 5}px`;
    }
    menu.style.left = `${Math.max(10, e.pageX - 180)}px`;
  }

  showToast(message) {
    document.querySelector(".vesta-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "vesta-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => { toast.classList.remove("visible"); setTimeout(() => toast.remove(), 400); }, 3000);
  }
}

(function initVestaInventory() {
  if (window.VestaUtils && window.PRODUCTS_DB && document.getElementById("pantry-items-container")) {
    window.VestaInventoryInstance = new VestaInventoryManager();
  }
})();