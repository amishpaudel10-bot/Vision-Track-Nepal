// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===== Theme Toggle (saved) =====
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

  const themeValue = document.documentElement.getAttribute("data-theme") || "dark";
  localStorage.setItem("theme", themeValue);
  updateThemeIcon();
});

// ===== Mobile Menu =====
const nav = $("#nav");
const hamburger = $("#hamburger");

hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("show");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking a nav link (mobile)
$$(".nav a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("show");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// ===== Modal =====
const modal = $("#modal");
const openModalBtn = $("#openModalBtn");
const closeModalBtn = $("#closeModalBtn");
const modalOverlay = $("#modalOverlay");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// ===== Toast =====
const toast = $("#toast");
const toastText = $("#toastText");
const toastBtn = $("#toastBtn");
const toastClose = $("#toastClose");

let toastTimer = null;
function showToast(text = "Done!") {
  toastText.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
toastBtn.addEventListener("click", () => showToast("🔥 Toast working!"));
toastClose.addEventListener("click", () => toast.classList.remove("show"));

// ===== Plans =====
$$(".selectPlan").forEach((btn) => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan || "Plan";
    closeModal();
    showToast(✅ Selected: ${plan});
  });
});

// ===== Contact form validation (demo only) =====
const form = $("#contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  if (name.length < 2) return showToast("❗ Please enter your name (min 2 chars)");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("❗ Enter a valid email");
  if (message.length < 10) return showToast("❗ Message should be at least 10 characters");

  form.reset();
  showToast("📨 Message submitted (demo)!");
});

// ===== Small live-ish dashboard animation =====
function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}
function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function tickDemoStats() {
  // Revenue
  const rev = Math.round(randomBetween(12000, 13900));
  setText("#rev", $${formatNum(rev)});
  setText("#revDelta", +${randomBetween(2.1, 9.9)}%);
// Orders
  const orders = Math.round(randomBetween(1200, 1800));
  setText("#orders", formatNum(orders));
  setText("#ordersDelta", +${randomBetween(1.0, 6.4)}%);

  // Tickets
  const tickets = Math.round(randomBetween(10, 45));
  setText("#tickets", ${tickets});
  setText("#ticketsDelta", -${randomBetween(0.5, 4.0)}%);

  // Visitors
  const visitors = randomBetween(18.0, 35.0).toFixed(1);
  setText("#visitors", ${visitors}k);
  setText("#visitorsDelta", +${randomBetween(3.0, 15.0)}%);

  // Goal
  const goal = Math.round(randomBetween(45, 92));
  setText("#goalPct", ${goal}%);
  const fill = $("#goalFill");
  if (fill) fill.style.width = ${goal}%;
}
setInterval(tickDemoStats, 2500);

// ===== Footer year =====
$("#year").textContent = new Date().getFullYear();
