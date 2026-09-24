/* Skin switcher for previewing templates in every skin.
   Load it in <head> AFTER skins/registry.js, and give the skin stylesheet
   id="skin-css". Priority: ?skin= → localStorage → <html data-skin>.
   Add data-no-switcher to <html> to hide the floating panel.
   Delete this script (and registry.js) when you ship — tools/new-project.mjs
   does that for you. */
(function () {
  const html = document.documentElement;
  const skins = window.DESIGN_SKINS || [];
  const ids = skins.map((s) => s.id);
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  const params = new URLSearchParams(location.search);
  const pick = (v) => (ids.includes(v) ? v : null);
  let skin = pick(params.get("skin")) || pick(store.get("wad:skin")) || html.dataset.skin || ids[0];
  let mode = params.get("mode") || store.get("wad:mode") || "auto";

  const skinLink = document.getElementById("skin-css");
  const base = skinLink ? skinLink.getAttribute("href").replace(/[^/]+\.css$/, "") : "";

  function fontLink() {
    let l = document.getElementById("skin-fonts");
    if (!l) {
      l = document.createElement("link");
      l.id = "skin-fonts";
      l.rel = "stylesheet";
      document.head.appendChild(l);
    }
    return l;
  }

  function apply() {
    html.dataset.skin = skin;
    if (mode === "auto") delete html.dataset.mode; else html.dataset.mode = mode;
    if (skinLink) skinLink.href = base + skin + ".css";
    const meta = skins.find((s) => s.id === skin);
    if (meta) fontLink().href = meta.fonts;
    store.set("wad:skin", skin);
    store.set("wad:mode", mode);
  }
  apply();

  if (html.hasAttribute("data-no-switcher")) return;

  document.addEventListener("DOMContentLoaded", () => {
    const panel = document.createElement("div");
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "Preview skin");
    panel.style.cssText = [
      "position:fixed", "right:12px", "bottom:12px", "z-index:9999",
      "display:flex", "gap:6px", "align-items:center", "padding:6px",
      "background:var(--surface)", "color:var(--ink)",
      "border:var(--border-w) solid var(--line)", "border-radius:var(--radius)",
      "box-shadow:var(--shadow-2)", "font:500 12px/1 var(--font-mono)",
    ].join(";");
    const sel = (label, opts, value, on) => {
      const s = document.createElement("select");
      s.setAttribute("aria-label", label);
      s.style.cssText = "font:inherit;padding:6px;background:var(--surface-2);color:var(--ink);border:0;border-radius:var(--radius)";
      opts.forEach(([v, t]) => s.add(new Option(t, v, false, v === value)));
      s.addEventListener("change", () => { on(s.value); apply(); });
      return s;
    };
    panel.append(
      sel("Skin", skins.map((s) => [s.id, s.label]), skin, (v) => (skin = v)),
      sel("Color mode", [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"]], mode, (v) => (mode = v)),
    );
    document.body.appendChild(panel);
  });
})();
