/**
 * Crochet Studio - Artisanal Pricing & Project Hub
 * Modern, responsive pricing engine & Android PWA install handler.
 */

// State
let currentCurrency = '₹';
let deferredInstallPrompt = null;

// DOM Elements
const currencySelect = document.getElementById('currencySelect');
const currSymElements = document.querySelectorAll('.curr-sym');

// Inputs
const projectNameInput = document.getElementById('projectName');
const yarnUsedInput = document.getElementById('yarnUsed');
const totalYarnWeightInput = document.getElementById('totalYarnWeight');
const yarnPriceInput = document.getElementById('yarnPrice');
const otherMaterialsInput = document.getElementById('otherMaterialsCost');
const makingHoursInput = document.getElementById('makingHours');
const makingMinutesInput = document.getElementById('makingMinutes');
const labourRateInput = document.getElementById('labourRate');
const packagingCostInput = document.getElementById('packagingCost');
const overheadCostsInput = document.getElementById('overheadCosts');
const profitPercentInput = document.getElementById('profitPercent');
const profitPercentDisplay = document.getElementById('profitPercentDisplay');

// Output Displays
const sellingPriceDisplay = document.getElementById('sellingPriceDisplay');
const wholesalePriceDisplay = document.getElementById('wholesalePriceDisplay');
const breakEvenPriceDisplay = document.getElementById('breakEvenPriceDisplay');
const takeHomeDisplay = document.getElementById('takeHomeDisplay');
const breakdownTotalDisplay = document.getElementById('breakdownTotalDisplay');

// Live Badges
const yarnRatioText = document.getElementById('yarnRatioText');
const liveYarnCost = document.getElementById('liveYarnCost');
const formattedTimeText = document.getElementById('formattedTimeText');
const liveLabourCost = document.getElementById('liveLabourCost');

// Breakdown Elements
const bdYarn = document.getElementById('bdYarn');
const bdOther = document.getElementById('bdOther');
const bdLabour = document.getElementById('bdLabour');
const bdPack = document.getElementById('bdPack');
const bdOver = document.getElementById('bdOver');
const bdProfit = document.getElementById('bdProfit');
const bdTimeSummary = document.getElementById('bdTimeSummary');

const pctYarn = document.getElementById('pctYarn');
const pctOther = document.getElementById('pctOther');
const pctLabour = document.getElementById('pctLabour');
const pctPack = document.getElementById('pctPack');
const pctOver = document.getElementById('pctOver');
const pctProfit = document.getElementById('pctProfit');

const barYarn = document.getElementById('barYarn');
const barOther = document.getElementById('barOther');
const barLabour = document.getElementById('barLabour');
const barPack = document.getElementById('barPack');
const barOver = document.getElementById('barOver');
const barProfit = document.getElementById('barProfit');

// Actions & Modals
const copyQuoteBtn = document.getElementById('copyQuoteBtn');
const copyToast = document.getElementById('copyToast');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const savedListContainer = document.getElementById('savedListContainer');
const savedCount = document.getElementById('savedCount');
const clearSavedBtn = document.getElementById('clearSavedBtn');

const androidModal = document.getElementById('androidModal');
const closeAndroidModal = document.getElementById('closeAndroidModal');
const btnDismissAndroidModal = document.getElementById('btnDismissAndroidModal');
const btnExecuteAndroidInstall = document.getElementById('btnExecuteAndroidInstall');
const androidInstallNavBtn = document.getElementById('androidInstallNavBtn');
const androidPromoInstallBtn = document.getElementById('androidPromoInstallBtn');
const footerInstallApp = document.getElementById('footerInstallApp');
const androidManualInstructions = document.getElementById('androidManualInstructions');

const hookGuideModal = document.getElementById('hookGuideModal');
const openHookGuideBtn = document.getElementById('openHookGuideBtn');
const closeHookGuideModal = document.getElementById('closeHookGuideModal');
const footerHookGuide = document.getElementById('footerHookGuide');

// Presets Data
const PRESETS = {
  amigurumi: {
    name: 'Cosy Amigurumi Bunny',
    yarnUsed: 75,
    totalYarnWeight: 100,
    yarnPrice: 260,
    other: 45,
    hours: 2,
    minutes: 30,
    rate: 120,
    packaging: 30,
    overhead: 25,
    profit: 25
  },
  cardigan: {
    name: 'Granny Square Cardigan',
    yarnUsed: 650,
    totalYarnWeight: 100,
    yarnPrice: 280,
    other: 110,
    hours: 15,
    minutes: 30,
    rate: 150,
    packaging: 65,
    overhead: 80,
    profit: 30
  },
  blanket: {
    name: 'Velvet Baby Blanket',
    yarnUsed: 420,
    totalYarnWeight: 100,
    yarnPrice: 320,
    other: 35,
    hours: 8,
    minutes: 0,
    rate: 140,
    packaging: 50,
    overhead: 45,
    profit: 25
  },
  hat: {
    name: 'Pastel Bucket Hat',
    yarnUsed: 95,
    totalYarnWeight: 100,
    yarnPrice: 240,
    other: 20,
    hours: 2,
    minutes: 0,
    rate: 120,
    packaging: 25,
    overhead: 20,
    profit: 30
  },
  coasters: {
    name: 'Boho Mug Rugs (Set of 4)',
    yarnUsed: 60,
    totalYarnWeight: 100,
    yarnPrice: 190,
    other: 15,
    hours: 1,
    minutes: 15,
    rate: 110,
    packaging: 20,
    overhead: 15,
    profit: 25
  },
  custom: {
    name: 'My Custom Crochet Project',
    yarnUsed: 100,
    totalYarnWeight: 100,
    yarnPrice: 250,
    other: 30,
    hours: 3,
    minutes: 0,
    rate: 120,
    packaging: 25,
    overhead: 20,
    profit: 25
  }
};

/**
 * Main Calculation Engine
 */
function calculate() {
  // Read inputs safely
  const yarnUsed = Math.max(0, parseFloat(yarnUsedInput.value) || 0);
  const totalYarnWeight = Math.max(1, parseFloat(totalYarnWeightInput.value) || 100);
  const yarnPrice = Math.max(0, parseFloat(yarnPriceInput.value) || 0);
  const otherCost = Math.max(0, parseFloat(otherMaterialsInput.value) || 0);

  const hours = Math.max(0, parseInt(makingHoursInput.value) || 0);
  const minutes = Math.max(0, Math.min(59, parseInt(makingMinutesInput.value) || 0));
  const rate = Math.max(0, parseFloat(labourRateInput.value) || 0);

  const packCost = Math.max(0, parseFloat(packagingCostInput.value) || 0);
  const overheadCost = Math.max(0, parseFloat(overheadCostsInput.value) || 0);
  const profitPct = Math.max(0, parseFloat(profitPercentInput.value) || 0);

  profitPercentDisplay.textContent = profitPct;

  // 1. Exact Yarn Calculation
  const yarnRatio = (yarnUsed / totalYarnWeight);
  const exactYarnCost = yarnRatio * yarnPrice;
  yarnRatioText.textContent = `${(yarnRatio * 100).toFixed(0)}%`;
  liveYarnCost.textContent = exactYarnCost.toFixed(2);

  // 2. Exact Making Time & Labour
  const decimalHours = hours + (minutes / 60);
  const totalLabourCost = decimalHours * rate;
  formattedTimeText.textContent = `${hours}h ${minutes}m`;
  liveLabourCost.textContent = totalLabourCost.toFixed(2);
  bdTimeSummary.textContent = `${hours}h ${minutes}m`;

  // 3. Totals & Break-Even
  const materialsSubtotal = exactYarnCost + otherCost;
  const breakEvenCost = materialsSubtotal + totalLabourCost + packCost + overheadCost;

  // 4. Profit & Retail Selling Price
  const profitAmount = breakEvenCost * (profitPct / 100);
  const retailPrice = breakEvenCost + profitAmount;

  // 5. Wholesale Price (Standard artisan formula: Materials x 2 + Overheads + Packaging + Labour)
  const wholesalePrice = (materialsSubtotal * 1.5) + packCost + overheadCost + totalLabourCost;

  // 6. Maker Take-Home
  const takeHome = totalLabourCost + profitAmount;

  // Update Main Price Displays
  sellingPriceDisplay.textContent = retailPrice.toFixed(2);
  wholesalePriceDisplay.textContent = wholesalePrice.toFixed(2);
  breakEvenPriceDisplay.textContent = breakEvenCost.toFixed(2);
  takeHomeDisplay.textContent = takeHome.toFixed(2);
  breakdownTotalDisplay.textContent = retailPrice.toFixed(2);

  // Update Breakdown List
  bdYarn.textContent = exactYarnCost.toFixed(2);
  bdOther.textContent = otherCost.toFixed(2);
  bdLabour.textContent = totalLabourCost.toFixed(2);
  bdPack.textContent = packCost.toFixed(2);
  bdOver.textContent = overheadCost.toFixed(2);
  bdProfit.textContent = profitAmount.toFixed(2);

  // Calculate percentages for progress bar (against retail price)
  const denom = retailPrice > 0 ? retailPrice : 1;
  const pYarn = ((exactYarnCost / denom) * 100);
  const pOther = ((otherCost / denom) * 100);
  const pLabour = ((totalLabourCost / denom) * 100);
  const pPack = ((packCost / denom) * 100);
  const pOver = ((overheadCost / denom) * 100);
  const pProfit = ((profitAmount / denom) * 100);

  pctYarn.textContent = `${pYarn.toFixed(0)}%`;
  pctOther.textContent = `${pOther.toFixed(0)}%`;
  pctLabour.textContent = `${pLabour.toFixed(0)}%`;
  pctPack.textContent = `${pPack.toFixed(0)}%`;
  pctOver.textContent = `${pOver.toFixed(0)}%`;
  pctProfit.textContent = `${pProfit.toFixed(0)}%`;

  barYarn.style.width = `${pYarn}%`;
  barOther.style.width = `${pOther}%`;
  barLabour.style.width = `${pLabour}%`;
  barPack.style.width = `${pPack}%`;
  barOver.style.width = `${pOver}%`;
  barProfit.style.width = `${pProfit}%`;
}

/**
 * Currency Switcher
 */
function updateCurrency(newCurr) {
  currentCurrency = newCurr;
  currSymElements.forEach((el) => {
    el.textContent = newCurr;
  });
  calculate();
}

/**
 * Load Preset
 */
function loadPreset(key) {
  const p = PRESETS[key];
  if (!p) return;

  projectNameInput.value = p.name;
  yarnUsedInput.value = p.yarnUsed;
  totalYarnWeightInput.value = p.totalYarnWeight;
  yarnPriceInput.value = p.yarnPrice;
  otherMaterialsInput.value = p.other;
  makingHoursInput.value = p.hours;
  makingMinutesInput.value = p.minutes;
  labourRateInput.value = p.rate;
  packagingCostInput.value = p.packaging;
  overheadCostsInput.value = p.overhead;
  profitPercentInput.value = p.profit;

  calculate();
}

/**
 * Copy Client Quote
 */
function copyQuote() {
  const name = projectNameInput.value.trim() || 'Custom Crochet Creation';
  const hours = makingHoursInput.value;
  const mins = makingMinutesInput.value;
  const price = sellingPriceDisplay.textContent;
  const yarnUsed = yarnUsedInput.value;

  const quoteText = 
`🧶 Custom Handmade Crochet Quote
━━━━━━━━━━━━━━━━━━━━━━
Item: ${name}
✨ 100% Handcrafted with premium yarn (${yarnUsed}g)
⏱️ Crafting Dedication: ${hours}h ${mins}m of skilled hand-stitching
📦 Includes protective gift packaging & care guide

🏷️ Investment: ${currentCurrency}${price}
━━━━━━━━━━━━━━━━━━━━━━
Thank you for valuing slow, artisan craftsmanship! 💕
Let me know if you would love to reserve this custom slot!`;

  navigator.clipboard.writeText(quoteText).then(() => {
    copyToast.style.display = 'block';
    setTimeout(() => {
      copyToast.style.display = 'none';
    }, 4000);
  }).catch(() => {
    alert('Quote copied! (Or please allow clipboard permission)');
  });
}

/**
 * Local Storage Saved Projects
 */
const STORAGE_KEY = 'crochet_studio_saved_projects';

function getSavedProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCurrentProject() {
  const name = projectNameInput.value.trim() || 'Untitled Crochet Piece';
  const price = sellingPriceDisplay.textContent;
  const projects = getSavedProjects();

  const newProject = {
    id: Date.now(),
    name,
    currency: currentCurrency,
    price,
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    data: {
      yarnUsed: yarnUsedInput.value,
      totalYarnWeight: totalYarnWeightInput.value,
      yarnPrice: yarnPriceInput.value,
      other: otherMaterialsInput.value,
      hours: makingHoursInput.value,
      minutes: makingMinutesInput.value,
      rate: labourRateInput.value,
      packaging: packagingCostInput.value,
      overhead: overheadCostsInput.value,
      profit: profitPercentInput.value
    }
  };

  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  renderSavedProjects();

  copyToast.textContent = `💾 "${name}" saved to your Library!`;
  copyToast.style.display = 'block';
  setTimeout(() => {
    copyToast.style.display = 'none';
    copyToast.textContent = '✅ Quote copied to clipboard ready for WhatsApp/Instagram!';
  }, 3000);
}

function renderSavedProjects() {
  const projects = getSavedProjects();
  savedCount.textContent = projects.length;

  if (projects.length === 0) {
    savedListContainer.innerHTML = '<p class="empty-saved-msg">No saved projects yet. Hit "Save to My Library" to keep your pricing on hand!</p>';
    return;
  }

  savedListContainer.innerHTML = projects.map((p) => `
    <div class="saved-item">
      <div>
        <span class="saved-item-title">${escapeHtml(p.name)}</span>
        <span class="saved-item-meta">${p.date} &bull; ${p.currency}${p.price}</span>
      </div>
      <div class="saved-item-actions">
        <button class="btn-mini-load" onclick="restoreProject(${p.id})">Load</button>
        <button class="btn-mini-del" onclick="deleteProject(${p.id})" title="Delete">&times;</button>
      </div>
    </div>
  `).join('');
}

window.restoreProject = function(id) {
  const projects = getSavedProjects();
  const found = projects.find(p => p.id === id);
  if (!found) return;

  projectNameInput.value = found.name;
  if (found.currency) {
    currencySelect.value = found.currency;
    updateCurrency(found.currency);
  }

  const d = found.data;
  yarnUsedInput.value = d.yarnUsed;
  totalYarnWeightInput.value = d.totalYarnWeight;
  yarnPriceInput.value = d.yarnPrice;
  otherMaterialsInput.value = d.other;
  makingHoursInput.value = d.hours;
  makingMinutesInput.value = d.minutes;
  labourRateInput.value = d.rate;
  packagingCostInput.value = d.packaging;
  overheadCostsInput.value = d.overhead;
  profitPercentInput.value = d.profit;

  calculate();
  window.scrollTo({ top: 200, behavior: 'smooth' });
};

window.deleteProject = function(id) {
  let projects = getSavedProjects();
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  renderSavedProjects();
};

function clearAllSaved() {
  if (confirm('Are you sure you want to clear all saved projects?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderSavedProjects();
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * Android App Detection & Install Modal Handler
 */
function setupAndroidInstallHandlers() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Listen to PWA install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('beforeinstallprompt captured!');
  });

  // Auto Pop-up on Android (or mobile device) if not already dismissed in session
  const dismissed = sessionStorage.getItem('crochet_android_modal_dismissed');
  if (isAndroid && !dismissed) {
    setTimeout(() => {
      openAndroidModal();
    }, 1800);
  }

  function openAndroidModal() {
    androidModal.classList.add('active');
    if (!deferredInstallPrompt) {
      androidManualInstructions.style.display = 'block';
    } else {
      androidManualInstructions.style.display = 'none';
    }
  }

  function closeAndroidModalSheet() {
    androidModal.classList.remove('active');
    sessionStorage.setItem('crochet_android_modal_dismissed', 'true');
  }

  // Event Listeners for Android Modal
  closeAndroidModal.addEventListener('click', closeAndroidModalSheet);
  btnDismissAndroidModal.addEventListener('click', closeAndroidModalSheet);
  
  androidInstallNavBtn.addEventListener('click', () => {
    androidModal.classList.add('active');
  });

  androidPromoInstallBtn.addEventListener('click', () => {
    androidModal.classList.add('active');
  });

  footerInstallApp.addEventListener('click', () => {
    androidModal.classList.add('active');
  });

  // Trigger Install Execution
  btnExecuteAndroidInstall.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      console.log('User choice:', choiceResult.outcome);
      deferredInstallPrompt = null;
      closeAndroidModalSheet();
    } else {
      // Fallback instruction for Android browsers
      androidManualInstructions.style.display = 'block';
      alert('📱 To install on Android:\n1. Tap the browser menu (⋮ 3 dots top right)\n2. Tap "Add to Home screen" or "Install App"');
    }
  });

  // Close modal when tapping backdrop
  androidModal.addEventListener('click', (e) => {
    if (e.target === androidModal) {
      closeAndroidModalSheet();
    }
  });
}

/**
 * Hook Size Reference Modal Handlers
 */
function setupHookGuideModal() {
  function open() {
    hookGuideModal.classList.add('active');
  }
  function close() {
    hookGuideModal.classList.remove('active');
  }

  openHookGuideBtn.addEventListener('click', open);
  closeHookGuideModal.addEventListener('click', close);
  footerHookGuide.addEventListener('click', open);

  hookGuideModal.addEventListener('click', (e) => {
    if (e.target === hookGuideModal) close();
  });
}

/**
 * Quick Helpers & Steppers
 */
function setupInteractions() {
  // Real-time calculation on any numeric change
  const numericInputs = [
    yarnUsedInput, totalYarnWeightInput, yarnPriceInput,
    otherMaterialsInput, makingHoursInput, makingMinutesInput,
    labourRateInput, packagingCostInput, overheadCostsInput, profitPercentInput
  ];

  numericInputs.forEach(input => {
    input.addEventListener('input', calculate);
  });

  // Currency select
  currencySelect.addEventListener('change', (e) => {
    updateCurrency(e.target.value);
  });

  // Presets chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadPreset(chip.dataset.preset);
    });
  });

  // Quick Notions
  document.querySelectorAll('.notion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const addVal = parseFloat(pill.dataset.add) || 0;
      const current = parseFloat(otherMaterialsInput.value) || 0;
      otherMaterialsInput.value = current + addVal;
      calculate();
    });
  });

  // Time Quick Pills
  document.querySelectorAll('.time-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const addMins = parseInt(pill.dataset.addMins) || 0;
      let hours = parseInt(makingHoursInput.value) || 0;
      let mins = parseInt(makingMinutesInput.value) || 0;

      mins += addMins;
      while (mins >= 60) {
        hours += 1;
        mins -= 60;
      }

      makingHoursInput.value = hours;
      makingMinutesInput.value = mins;
      calculate();
    });
  });

  // Stepper plus/minus buttons
  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const step = parseInt(btn.dataset.step) || 1;
      const input = document.getElementById(targetId);
      if (!input) return;

      let val = parseInt(input.value) || 0;
      if (btn.classList.contains('plus')) {
        val += step;
      } else {
        val = Math.max(0, val - step);
      }

      if (targetId === 'makingMinutes' && val >= 60) {
        const extraHours = Math.floor(val / 60);
        val = val % 60;
        makingHoursInput.value = (parseInt(makingHoursInput.value) || 0) + extraHours;
      }

      input.value = val;
      calculate();
    });
  });

  // Action Buttons
  copyQuoteBtn.addEventListener('click', copyQuote);
  saveProjectBtn.addEventListener('click', saveCurrentProject);
  clearSavedBtn.addEventListener('click', clearAllSaved);
}

/**
 * Service Worker Registration for PWA / Android
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Crochet Studio SW registered:', reg.scope))
        .catch(err => console.warn('SW registration skipped:', err));
    });
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  setupInteractions();
  setupAndroidInstallHandlers();
  setupHookGuideModal();
  renderSavedProjects();
  registerServiceWorker();
  calculate();
});
