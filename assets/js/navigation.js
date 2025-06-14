// for mobile navigation

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const backdrop = document.getElementById("menu-backdrop");
  const closeBtn = document.querySelector(".close-menu");

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });

  backdrop.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
});
