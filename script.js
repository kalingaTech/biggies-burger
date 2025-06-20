// Header Toggle Code
const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggleBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Floating button code
const toggleButton = document.getElementById("toggleButton");
const menu = document.getElementById("menu");

let isOpen = false;

toggleButton.addEventListener("click", () => {
  isOpen = !isOpen;
  if (isOpen) {
    menu.classList.remove("opacity-0", "scale-0");
    menu.classList.add("opacity-100", "scale-100");
  } else {
    menu.classList.remove("opacity-100", "scale-100");
    menu.classList.add("opacity-0", "scale-0");
  }
});
