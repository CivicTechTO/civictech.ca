// for mobile navigation
// The menu is a native <dialog> opened with showModal(), so the browser moves
// focus into it, keeps Tab inside, closes it on Escape, and makes the page inert.

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const closeBtn = menu.querySelector(".close-menu");
  const desktop = window.matchMedia("(min-width: 768px)");

  function openMenu() {
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  // Fires however the menu closes: close button, Escape, backdrop, or resize
  menu.addEventListener("close", function () {
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    toggle.focus();
  });

  toggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", function () {
    menu.close();
  });

  // The dialog fills the screen; a click on it (not the drawer) is a backdrop click
  menu.addEventListener("click", function (event) {
    if (event.target === menu) menu.close();
  });

  // The menu is hidden at desktop widths, so close it rather than leave the page inert
  desktop.addEventListener("change", function (event) {
    if (event.matches && menu.open) menu.close();
  });
});
