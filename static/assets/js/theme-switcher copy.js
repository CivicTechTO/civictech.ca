const themeSwitcher = {
  // Config
  _scheme: "auto",
  rootAttribute: "data-theme",
  localStorageKey: "picoPreferredColorScheme",

  // Init
  init() {
    this.applyInitialTheme();
    this.initSwitch();
  },

  // Get theme from localStorage or fallback to "auto"
  get savedScheme() {
    return window.localStorage.getItem(this.localStorageKey) || "auto";
  },

  // Detect system theme
  get preferredColorScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },

  // Apply theme when page loads
  applyInitialTheme() {
    let scheme = this.savedScheme;

    // If "auto", apply system preference
    if (scheme === "auto") {
      scheme = this.preferredColorScheme;
    }

    document.documentElement.setAttribute(this.rootAttribute, scheme);
    this._scheme = scheme;
  },

  // Initialize toggle button
  initSwitch() {
    const button = document.getElementById("themeToggle");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      this.toggleTheme();
    });
  },

  // Toggle between light and dark modes
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(
      this.rootAttribute
    );
    const newTheme = currentTheme === "light" ? "dark" : "light";

    this.scheme = newTheme;
  },

  // Set and save the scheme
  set scheme(scheme) {
    this._scheme = scheme;
    document.documentElement.setAttribute(this.rootAttribute, scheme);
    localStorage.setItem(this.localStorageKey, scheme);
  },
};

// Initialize
themeSwitcher.init();
