/* ==========================================================================
   VESTA BRAND INTERACTION & CORE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. FLOATING NAVBAR SCROLL EFFECT
  // ==========================================
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. MOBILE MENU DRAWER TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. CURSOR-TRACKING SPOTLIGHT HIGHLIGHTS
  // ==========================================
  const cards = document.querySelectorAll('.nav-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within card
      const y = e.clientY - rect.top;  // y coordinate within card
      
      // Update background gradient radial center dynamically
      const glowBg = card.querySelector('.card-bg-gradient');
      if (glowBg) {
        glowBg.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(233, 242, 167, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const glowBg = card.querySelector('.card-bg-gradient');
      if (glowBg) {
        glowBg.style.background = `radial-gradient(circle at 80% 20%, rgba(233, 242, 167, 0) 0%, rgba(255, 255, 255, 0) 100%)`;
        glowBg.style.opacity = '0.15';
      }
    });
  });

  // ==========================================
  // 4. SHOWCASE DRAWER SYSTEM (MINI-SHOWCASE)
  // ==========================================
  const drawerOverlay = document.getElementById('drawer-overlay');
  const showcaseDrawer = document.getElementById('showcase-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const moduleShowcases = document.querySelectorAll('.module-showcase');

  function openDrawer(moduleName) {
    // Hide all showcases first
    moduleShowcases.forEach(showcase => {
      showcase.classList.add('hidden');
    });

    // Find and reveal matching module showcase
    const activeShowcase = document.querySelector(`.module-showcase[id-module="${moduleName}"]`);
    if (activeShowcase) {
      activeShowcase.classList.remove('hidden');
      
      // Dynamic module render trigger
      if (moduleName === 'inventory' && window.VestaInventoryInstance) {
        window.VestaInventoryInstance.render();
      }
      if (moduleName === 'recipes' && window.VestaRecipeInstance) {
        window.VestaRecipeInstance.loadState();
        window.VestaRecipeInstance.applyPendingContext();
        window.VestaRecipeInstance.render();
      }
      if (moduleName === 'shopping' && window.VestaShoppingInstance) {
        window.VestaShoppingInstance.loadState();
        window.VestaShoppingInstance.render();
      }
      if (moduleName === 'planner' && window.VestaPlannerInstance) {
        window.VestaPlannerInstance.loadState();
        window.VestaPlannerInstance.updateRecommendation();
        window.VestaPlannerInstance.render();
      }
      if (moduleName === 'tracker' && window.VestaTrackerInstance) {
        window.VestaTrackerInstance.loadState();
        window.VestaTrackerInstance.render();
      }
      
      // Open drawer & backdrop overlay
      drawerOverlay.classList.add('active');
      showcaseDrawer.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('active');
    showcaseDrawer.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  }

  // Bind Card Click Events
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const module = card.getAttribute('data-module');
      if (module) openDrawer(module);
    });
  });

  // Bind Header Link Click Events to Open Drawers directly
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const module = link.getAttribute('data-module');
      if (module) {
        e.preventDefault();
        openDrawer(module);
      }
    });
  });

  // Close Events
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ==========================================
  // 5. CROSS-MODULE PANTRY SHORTCUT
  // ==========================================
  const pantryShortcutBtn = document.getElementById('action-pantry-recipe');
  if (pantryShortcutBtn) {
    pantryShortcutBtn.addEventListener('click', () => {
      // Transition drawer directly from Inventory to Recipes module
      const currentInventory = document.querySelector('.module-showcase[id-module="inventory"]');
      const currentRecipes = document.querySelector('.module-showcase[id-module="recipes"]');
      
      if (currentInventory && currentRecipes) {
        currentInventory.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          currentInventory.classList.add('hidden');
          currentRecipes.classList.remove('hidden');
          currentRecipes.style.animation = 'fadeIn 0.5s ease';
        }, 280);
      }
    });
  }

  // ==========================================
  // 6. NEWSLETTER FORM STATE
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  const successMessage = document.getElementById('success-message');

  if (newsletterForm && successMessage) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Smooth fade out input/button
      newsletterForm.style.transition = 'opacity 0.4s ease';
      newsletterForm.style.opacity = '0';
      
      setTimeout(() => {
        newsletterForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }, 400);
    });
  }
});
