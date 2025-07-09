// Header Toggle Code
const body = document.body;
const headerElem = document.querySelector("header");
const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggleBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  headerElem.classList.toggle("bg-transparent");
  headerElem.classList.toggle("bg-black");
  body.classList.toggle('overflow-hidden');
});

// Floating menu code
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");
  const menu = document.getElementById("menu");
  const menuBox = document.getElementById("menuBox");

  if (!toggleButton || !menu || !menuBox) {
    console.error("toggleButton, menu, or menuBox not found");
    return;
  }

  toggleButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const isHidden = menu.classList.contains("hidden");

    if (isHidden) {
      menu.classList.remove("hidden");
      toggleButton.setAttribute("aria-expanded", "true");
      toggleButton.classList.add("rotate-45"); // Use Tailwind class for rotation
    } else {
      menu.classList.add("hidden");
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.classList.remove("rotate-45");
    }
  });

  // Click outside to close
  document.addEventListener("click", function (event) {
    if (!menu.classList.contains("hidden")) {
      if (!menu.contains(event.target) && event.target !== toggleButton) {
        menu.classList.add("hidden");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.classList.remove("rotate-45");
      }
    }
  });

  // Prevent clicks inside menu and box from closing
  menu.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  menuBox.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});
