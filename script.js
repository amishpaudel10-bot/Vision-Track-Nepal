// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 1. FUNCTIONAL DATABASE (Local Storage) =====
// This acts as a mini-database so your changes don't disappear on refresh
const DEFAULT_DATA = {
  revenue: 12850,
  orders: 1540,
  tickets: 12,
  visitors: 24.2,
  goalPct: 42 // Current Fast Track Progress %
};

let appData = JSON.parse(localStorage.getItem('visionTrackData')) || DEFAULT_DATA;

function saveData() {
  localStorage.setItem('visionTrackData', JSON.stringify(appData));
  updateUI();
}

// ===== 2. DYNAMIC UI UPDATES =====
function updateUI() {
  if($("#rev")) $("#rev").textContent = `$${appData.revenue.toLocaleString()}`;
  if($("#orders")) $("#orders").textContent = appData.orders.toLocaleString();
  if($("#tickets")) $("#tickets").textContent = appData.tickets;
  if($("#visitors")) $("#visitors").textContent = `${appData.visitors}k`;
  
  // Update Progress Bar
  if($("#goalPct")) $("#goalPct").textContent = `${appData.goalPct}%`;
  if($("#goalFill")) $("#goalFill").style.width = `${appData.goalPct}%`;
}

// FUNCTIONAL: You can call this to update the project live
// Usage: window.setProjectProgress(50)
window.setProjectProgress = (val) => {
  appData.goalPct = val;
  saveData();
  showToast(`✅ Progress updated to ${val}%`);
};

// ===== 3. FUNCTIONAL CONTACT FORM =====
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
      name: $("#name").value,
      email: $("#email").value,
      message: $("#message").value
    };

    // Validation
    if (formData.name.length < 2) return showToast("❗ Name is too short");
    if (!formData.email.includes("@")) return showToast("❗ Email is invalid");

    // FUNCTIONAL: Sends data to a real endpoint (Formspree)
    // Replace 'YOUR_ID' with a free ID from formspree.io to get emails
    const response = await fetch("https://formspree.io/f/YOUR_ID", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      showToast("📨 Message Sent Successfully!");
      form.reset();
    } else {
      // Fallback for demo if no ID is provided
      showToast("🚀 Demo: Data captured successfully!");
      console.log("Form Data:", formData);
      form.reset();
    }
  });
}

// ===== 4. THEME & NAVIGATION =====
const themeBtn = $("#themeBtn");
const updateTheme = (isLight) => {
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
};

// Load saved theme
updateTheme(localStorage.getItem("theme") === "light");

themeBtn.addEventListener("click", () => {
  const isCurrentlyLight = document.documentElement.getAttribute("data-theme") === "light";
  updateTheme(!isCurrentlyLight);
});

// Mobile Menu
const nav = $("#nav");
const hamburger = $("#hamburger");
hamburger.addEventListener("click", () => {
  nav.classList.toggle("show");
});

// ===== 5. TOAST & MODAL =====
function showToast(msg) {
  const toast = $("#toast");
  $("#toastText").textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

const modal = $("#modal");
$("#openModalBtn").onclick = () => modal.classList.add("show");
$("#closeModalBtn").onclick = () => modal.classList.remove("show");
$("#modalOverlay").onclick = () => modal.classList.remove("show");

// Initialize on Load
updateUI();
$("#year").textContent = new Date().getFullYear();
                       
