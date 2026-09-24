// Juru demo: every note points at its source lines, and the meeting can be replayed.
(() => {
  const lines = [...document.querySelectorAll("#transcript .line")];
  const notes = [...document.querySelectorAll("#minutes .note")];
  const hint = document.getElementById("demo-hint");
  const replay = document.getElementById("replay");
  const defaultHint = hint.textContent;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clearSource() {
    lines.forEach((l) => l.removeAttribute("data-source"));
    notes.forEach((n) => n.setAttribute("aria-pressed", "false"));
    hint.textContent = defaultHint;
  }

  notes.forEach((note) => {
    note.addEventListener("click", () => {
      const wasOn = note.getAttribute("aria-pressed") === "true";
      clearSource();
      if (wasOn) return;
      const ids = note.dataset.src.split(" ");
      note.setAttribute("aria-pressed", "true");
      const sources = ids.map((id) => document.getElementById(id));
      sources.forEach((l) => l.setAttribute("data-source", ""));
      hint.textContent = "Sumber: " + sources.map((l) => `${l.querySelector(".ts").textContent}, ${l.querySelector(".spk").textContent}`).join(" dan ");
      sources[0].scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    });
  });

  function show(upTo) {
    lines.forEach((l, i) => (l.dataset.state = i < upTo ? "" : "hidden"));
    notes.forEach((n) => (n.dataset.state = Number(n.dataset.at) <= upTo ? "" : "hidden"));
  }

  replay.addEventListener("click", () => {
    clearSource();
    if (reduce) return show(lines.length);
    let i = 0;
    replay.disabled = true;
    replay.textContent = "Memutar…";
    show(0);
    const tick = setInterval(() => {
      i += 1;
      show(i);
      if (i >= lines.length) {
        clearInterval(tick);
        replay.disabled = false;
        replay.textContent = "Putar ulang rapat";
      }
    }, 900);
  });
})();
