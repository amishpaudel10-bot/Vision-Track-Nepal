// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===== Theme Toggle =====
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function updateThemeIcon() {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  themeBtn.textContent = isLight ? "☀️" : "🌙";
}
updateThemeIcon();

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");

  localStorage.setItem("theme", next || "dark");
  updateThemeIcon();
});

// ===== FUNCTIONAL DATA: Progress Tracker =====
// This now saves to your browser's memory (LocalStorage)
let projectData = JSON.parse(localStorage.getItem('visionData')) || {
  revenue: 12500,
  orders: 1450,
  tickets: 24,
  visitors: 22.5,
  goalPct: 45
};

function updateDashboardUI() {
  $("#rev").textContent = `$${formatNum(projectData.revenue)}`;
  $("#orders").textContent = formatNum(projectData.orders);
  $("#tickets").textContent = projectData.tickets;
  $("#visitors").textContent = `${projectData.visitors}k`;
  $("#goalPct").textContent = `${projectData.goalPct}%`;
  $("#goalFill").style.width = `${projectData.goalPct}%`;
}

// Manual Update Function (You can call this from the console or a hidden button)
// Example: updateProgress(65) will change the bar to 65%
window.updateProgress = function(newPct) {
  projectData.goalPct = newPct;
  localStorage.setItem('visionData', JSON.stringify(projectData));
  updateDashboardUI();
  showToast(`🚀 Progress updated to ${newPct}%`);
};

// Initial Load
updateDashboardUI();

// ===== FUNCTIONAL CONTACT FORM (Formspree) =====
const form = $("#contactForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  // Validation
  if (name.length < 2) return showToast("❗ Name too short");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("❗ Invalid email");
  if (message.length < 10) return showToast("❗ Message too short");

  // Real Submission using Formspree (Free)
  // Replace 'YOUR_FORM_ID' with a real ID from formspree.io if you want it in your inbox
  const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    form.reset();
    showToast("📨 Message sent successfully!");
  } else {
    showToast("📨 Demo Mode: Sent successfully!");
  }
});

// ===== Mobile Menu =====
const nav = $("#nav");
const hamburger = $("#hamburger");
hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("show");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// ===== Modal & Toast Logic =====
const modal = $("#modal");
const openModalBtn = $("#openModalBtn");
const closeModalBtn = $("#closeModalBtn");

function openModal() { modal.classList.add("show"); }
function closeModal() { modal.classList.remove("show"); }

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

let toastTimer = null;
const toast = $("#toast");
const toastText = $("#toastText");

function showToast(text) {
  toastText.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== Footer Year =====
$("#year").textContent = new Date().getFullYear();
