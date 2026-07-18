/**
 * Vesta Smart Kitchen — Shared Utilities
 * Fuzzy search, debounce, expiry, sorting, formatting, dates
 */
const VestaUtils = (() => {
  const EXPIRING_SOON_DAYS = 3;

  function debounce(fn, wait = 300) {
    let timer;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function normalize(str) {
    return (str || "").toLowerCase().trim();
  }

  /** Simple fuzzy score — higher is better */
  function fuzzyScore(query, text) {
    const q = normalize(query);
    const t = normalize(text);
    if (!q) return 1;
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 60;

    let qi = 0;
    let score = 0;
    for (let i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        score += 10;
        qi++;
      }
    }
    return qi === q.length ? score : 0;
  }

  function fuzzySearch(query, items, keys = ["name", "category", "brand"]) {
    const q = normalize(query);
    if (!q) return items.slice();

    return items
      .map((item) => {
        let best = 0;
        keys.forEach((key) => {
          const val = typeof key === "function" ? key(item) : item[key];
          best = Math.max(best, fuzzyScore(q, String(val || "")));
        });
        return { item, score: best };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }

  function parseDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T12:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function daysUntilExpiry(expiryDate) {
    const exp = parseDate(expiryDate);
    if (!exp) return 999;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  }

  function getExpiryStatus(expiryDate) {
    const days = daysUntilExpiry(expiryDate);
    if (days < 0) return "expired";
    if (days <= EXPIRING_SOON_DAYS) return "expiring";
    return "fresh";
  }

  function getEarliestExpiry(batches) {
    if (!batches || !batches.length) return null;
    return [...batches].sort(
      (a, b) => parseDate(a.expiryDate) - parseDate(b.expiryDate)
    )[0];
  }

  function getTotalQuantity(batches) {
    return (batches || []).reduce(
      (sum, b) => sum + parseFloat(b.quantity || 0),
      0
    );
  }

  function formatQuantity(qty, unit) {
    const n = parseFloat(qty);
    const val = Number.isInteger(n) ? n : n.toFixed(1);
    return `${val} ${unit || ""}`.trim();
  }

  function formatDate(dateStr) {
    const d = parseDate(dateStr);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatExpiryLabel(expiryDate) {
    const days = daysUntilExpiry(expiryDate);
    if (days < 0) return `Expired ${Math.abs(days)}d ago`;
    if (days === 0) return "Expires today";
    if (days <= EXPIRING_SOON_DAYS) return `Expires in ${days}d`;
    return `${days}d left`;
  }

  function generateId(prefix = "inv") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function isItemExpired(item) {
    return (item.batches || []).some(
      (b) => getExpiryStatus(b.expiryDate) === "expired"
    );
  }

  function isItemExpiringSoon(item) {
    return (item.batches || []).some((b) => {
      const s = getExpiryStatus(b.expiryDate);
      return s === "expiring" || s === "expired";
    });
  }

  function isLowStock(item, rules = {}) {
    if (item.lowStockManual) return true;
    const total = getTotalQuantity(item.batches);
    const rule =
      rules[item.productId] ||
      rules[normalize(item.name)] ||
      rules[normalize(item.name).split(" ").pop()];

    if (rule) {
      const threshold =
        item.unit === "L" && rule.unit === "ml"
          ? rule.threshold / 1000
          : rule.threshold;
      const unit = rule.unit || item.unit;
      if (item.unit === unit || (item.unit === "L" && unit === "ml")) {
        return total < threshold;
      }
    }

    const product = window.PRODUCTS_DB?.find((p) => p.id === item.productId);
    const defaultQty = product?.defaultQuantity || 10;
    const ratio = total / defaultQty;
    return ratio <= 0.2 && total > 0;
  }

  function sortInventory(items, sortKey) {
    const list = [...items];
    list.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;

      switch (sortKey) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "expiring_soon": {
          const aExp = getEarliestExpiry(a.batches)?.expiryDate || "9999";
          const bExp = getEarliestExpiry(b.batches)?.expiryDate || "9999";
          return parseDate(aExp) - parseDate(bExp);
        }
        case "low_stock":
          return (
            getTotalQuantity(a.batches) - getTotalQuantity(b.batches)
          );
        case "recently_added":
        default:
          return (
            parseDate(b.dateAdded || "1970-01-01") -
            parseDate(a.dateAdded || "1970-01-01")
          );
      }
    });
    return list;
  }

  function getCategoryEmoji(category) {
    const map = {
      Produce: "🥑",
      Dairy: "🥛",
      Bakery: "🍞",
      Pantry: "🌾",
      Beverages: "🍵",
      Proteins: "🍗",
      Other: "📦",
    };
    return map[category] || "📦";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    EXPIRING_SOON_DAYS,
    debounce,
    fuzzySearch,
    fuzzyScore,
    daysUntilExpiry,
    getExpiryStatus,
    getEarliestExpiry,
    getTotalQuantity,
    formatQuantity,
    formatDate,
    formatExpiryLabel,
    generateId,
    isItemExpired,
    isItemExpiringSoon,
    isLowStock,
    sortInventory,
    getCategoryEmoji,
    escapeHtml,
    parseDate,
  };
})();

window.VestaUtils = VestaUtils;
