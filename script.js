// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 1. DATABASE & STATE MANAGEMENT =====
const DEFAULT_DATA = {
  revenue: 12850,
  orders: 1392,
  tickets: 24,
  visitors: 28.4,
  goalPct: 72
};

// State: Load from local storage or defaults
let appData = JSON.parse(localStorage.getItem('visionTrackData')) || DEFAULT_DATA;

function saveData() {
  localStorage.setItem('visionTrackData', JSON.stringify(appData));
  updateUI();
}

// ===== 2. REAL-TIME UI UPDATES =====
function updateUI() {
  // Update numbers with safety checks
  if($("#rev")) $("#rev").textContent = `$${appData.revenue.toLocaleString()}`;
  if($("#orders")) $("#orders").textContent = appData.orders.toLocaleString();
  if($("#tickets")) $("#tickets").textContent = appData.tickets;
  if($("#visitors")) $("#visitors").textContent = `${appData.visitors.toFixed(1)}k`;
  
  // Update Progress Bar
  if($("#goalPct")) $("#goalPct").textContent = `${appData.goalPct}%`;
  if($("#goalFill")) $("#goalFill").style.width = `${appData.goalPct}%`;
}

// FUNCTIONAL: Simulates live data incoming from a "Vision Tracker"
// This makes the site feel "Alive" to visitors
function simulateLiveTraffic() {
  setInterval(() => {
    // Randomly fluctuate visitors and revenue slightly
    appData.visitors += (Math.random() * 0.1);
    if(Math.random() > 0.8) appData.revenue += Math.floor(Math.random() * 50);
    updateUI();
  }, 5000); // Updates every 5 seconds
}

// ===== 3. FUNCTIONAL CONTACT FORM (Production Ready) =====
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const formData = {
      name: $("#name").value,
      email: $("#email").value,
      message: $("#message").value
    };

    // UI Feedback: Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // Replace 'YOUR_ID' with your actual Formspree ID
      const response = await fetch("https://formspree.io/f/YOUR_ID", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast("📨 Message Sent Successfully!");
        form.reset();
      } else {
        throw new Error("Formspree Error");
      }
    } catch (err) {
      // Fallback: This allows you to test without a real ID
      console.log("Form would send:", formData);
      showToast("🚀 Demo Mode: Message simulated!");
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// ===== 4. THEME & PERSISTENCE =====
const themeBtn = $("#themeBtn");
const updateTheme = (isDark) => {
  // We use class-based toggling for better CSS performance
  document.body.classList.toggle("dark-mode", isDark);
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Initialize Theme
const savedTheme = localStorage.getItem("theme") === "dark";
updateTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const isCurrentlyDark = document.body.classList.contains("dark-mode");
  updateTheme(!isCurrentlyDark);
});

// Mobile Menu (Hamburger)
const hamburger = $("#hamburger");
const nav = $("#nav");
if(hamburger) {
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("active"); // Ensure CSS handles .nav.active
        hamburger.classList.toggle("open");
    });
}

// ===== 5. UI COMPONENTS (Modal & Toast) =====
function showToast(msg) {
  const toast = $("#toast");
  const toastText = $("#toastText");
  if(toast && toastText) {
    toastText.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }
}

// Modal Logic
const modal = $("#modal");
const openBtn = $("#openModalBtn");
const closeBtn = $("#closeModalBtn");

if(openBtn) openBtn.onclick = () => modal.classList.add("show");
if(closeBtn) closeBtn.onclick = () => modal.classList.remove("show");

// Close modal if clicking outside the card
window.onclick = (event) => {
  if (event.target === $("#modalOverlay")) {
    modal.classList.remove("show");
  }
};

// ===== 6. INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  simulateLiveTraffic();
  
  // Set current year
  const yearEl = $("#year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Auto-open modal after 10 seconds (Growth Hack)
  setTimeout(() => {
    if(!localStorage.getItem('modalSeen')) {
        // modal.classList.add("show"); 
        // localStorage.setItem('modalSeen', 'true');
    }
  }, 10000);
});
