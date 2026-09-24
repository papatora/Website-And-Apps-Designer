/**
 * Tailwind CSS v3 preset.
 *
 * tailwind.config.js:
 *   module.exports = {
 *     presets: [require("<kit>/adapters/tailwind/preset.cjs")],
 *     content: ["./src/**\/*.{html,js,jsx,ts,tsx}"],
 *   };
 *
 * Load tokens/base.css and one skin CSS file in your global stylesheet and put
 * data-skin="<id>" on <html>. The default palette is replaced, so only skin
 * colors are available.
 */
const v = (name) => `var(--${name})`;

module.exports = {
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fff",
      black: "#000",
      bg: v("bg"),
      surface: v("surface"),
      "surface-2": v("surface-2"),
      ink: v("ink"),
      "ink-muted": v("ink-muted"),
      line: v("line"),
      accent: v("accent"),
      "accent-ink": v("accent-ink"),
      link: "var(--link, var(--accent))",
      focus: v("focus"),
      success: v("success"),
      warning: v("warning"),
      danger: v("danger"),
    },
    extend: {
      fontFamily: {
        heading: v("font-display"),
        copy: v("font-body"),
        code: v("font-mono"),
      },
      borderRadius: { skin: v("radius"), "skin-lg": v("radius-lg") },
      boxShadow: { skin: v("shadow-1"), "skin-lg": v("shadow-2") },
      transitionTimingFunction: { out: v("ease-out"), "in-out": v("ease-in-out") },
      transitionDuration: { 1: v("dur-1"), 2: v("dur-2"), 3: v("dur-3") },
    },
  },
};
