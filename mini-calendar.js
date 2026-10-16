// mini-calendar.js
// Élément personnalisé Wix : mini calendrier avec uniquement les numéros des jours.
// Les dates indisponibles reçoivent un cœur rouge.
// Les dates indisponibles se gèrent dans un tableau Wix (voir les explications).
// Tag name à utiliser dans Wix : mini-calendar

(function () {
"use strict";
// Tout le code est isolé ici pour ne jamais entrer en conflit avec les autres éléments de la page

// ============================================================
// RÉGLAGES
// ============================================================
const TEXT_COLOR = "#000000";      // numéros des jours
const MUTED_COLOR = "#000000";     // noms des jours (L M M J V S D) et légende
const PAST_OPACITY = 1;            // jours passés : 1 = aussi noirs que les autres, 0.5 = atténués
const ACCENT = "#D5AF37";          // doré : titre du mois et flèches
const HEART_COLOR = "#D61F36";     // rouge du cœur
const BG = "transparent";          // fond ("transparent" = reprend le fond du site)
const FONT_TITLE = "'Cinzel', Georgia, 'Times New Roman', serif";
const SHOW_WEEKDAYS = false;       // true = affiche L M M J V S D au-dessus des jours
const SHOW_LEGEND = true;          // petite ligne sous le calendrier
const LEGEND_TEXT = "Date indisponible";
const MAX_MONTHS_AHEAD = 24;       // jusqu'à combien de mois dans le futur on peut naviguer
const TIMEZONE = "Europe/Paris";   // fuseau utilisé pour savoir quel jour on est

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const CSS = `
  :host { display:block; width:100%; height:100%; }
  * { box-sizing:border-box; }
  .wrap {
    width:100%; height:100%; background:${BG}; color:${TEXT_COLOR}; font-family:${FONT_TITLE};
    container-type:inline-size; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
  }
  .cal { width:100%; max-width:520px; }
  .head { display:flex; align-items:center; justify-content:space-between; padding:0 2px 10px; }
  .title { font-size:16px; font-size:max(15px,4.6cqw); letter-spacing:.14em; text-transform:uppercase; color:${ACCENT}; text-align:center; flex:1; }
  .nav {
    border:0; background:transparent; color:${ACCENT}; cursor:pointer; font-size:28px; line-height:1; padding:4px 10px;
    font-family:Arial,sans-serif; transition:opacity .2s, transform .2s;
  }
  .nav:hover:not(:disabled) { transform:scale(1.2); }
  .nav:disabled { opacity:.25; cursor:default; }
  .nav:focus-visible, .day:focus-visible { outline:2px solid ${ACCENT}; outline-offset:2px; }
  .grid { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:4px; }
  .wd { text-align:center; font-size:11px; letter-spacing:.1em; color:${MUTED_COLOR}; padding-bottom:4px; }
  .day {
    position:relative; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;
    font-size:14px; font-size:max(12px,4cqw); border-radius:50%; user-select:none;
  }
  .day.empty { visibility:hidden; }
  .day.past { opacity:${PAST_OPACITY}; }
  .day.today { box-shadow:inset 0 0 0 1.5px ${ACCENT}; }
  .day svg { position:absolute; inset:3%; width:94%; height:94%; }
  .day.off { color:#fff; font-weight:600; }
  .day.off span { position:relative; z-index:1; text-shadow:0 1px 2px rgba(0,0,0,.35); margin-top:-4%; }
  .day.off.past { opacity:${PAST_OPACITY}; }
  .legend {
    margin-top:12px; display:flex; align-items:center; justify-content:center; gap:8px;
    font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:${MUTED_COLOR};
  }
  .legend svg { width:14px; height:14px; }
`;

const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="' + HEART_COLOR + '" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

// ---- Dates : acceptent AAAA-MM-JJ, JJ/MM/AAAA, JJ.MM.AAAA, JJ-MM-AAAA ou une date Wix ----
const pad = (n) => (n < 10 ? "0" : "") + n;
const key = (y, m, d) => y + "-" + pad(m) + "-" + pad(d); // m = 1..12

const parisFmt = (() => {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" });
  } catch (e) { return null; }
})();

function todayKey() {
  const now = new Date();
  if (parisFmt) return parisFmt.format(now); // AAAA-MM-JJ
  return key(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function parseDay(v) {
  if (v === null || v === undefined || v === "") return "";
  if (v instanceof Date) v = v.toISOString();
  if (typeof v === "object") v = v.$date || v.date || "";
  let s = String(v).trim();
  if (!s) return "";
  let m;
  // JJ/MM/AAAA ou JJ.MM.AAAA ou JJ-MM-AAAA
  if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/))) return key(+m[3], +m[2], +m[1]);
  // AAAA-MM-JJ tout seul (sans heure)
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return key(+m[1], +m[2], +m[3]);
  // date avec heure (format Wix) : on prend le jour correspondant en France
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  if (parisFmt) return parisFmt.format(d);
  return key(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function addDays(k, n) {
  const [y, m, d] = k.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return key(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

// Une ligne du tableau : soit une date, soit { date, fin } pour bloquer une période
function expand(entry, set) {
  let start, end;
  if (entry && typeof entry === "object" && !(entry instanceof Date) && !entry.$date) {
    start = parseDay(entry.date || entry.debut || entry.start);
    end = parseDay(entry.fin || entry.end);
  } else {
    start = parseDay(entry);
  }
  if (!start) return;
  if (!end || end < start) end = start;
  let k = start, guard = 0;
  while (k <= end && guard < 400) { set.add(k); k = addDays(k, 1); guard++; }
}

// Charge Cinzel (Google Fonts) une seule fois pour la page
function ensureFonts() {
  if (document.getElementById("film-shelf-fonts")) return;
  const l = document.createElement("link");
  l.id = "film-shelf-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Pinyon+Script&display=swap";
  document.head.appendChild(l);
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

class MiniCalendar extends HTMLElement {
  static get observedAttributes() {
    return ["dates"];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.blocked = new Set();
    this.built = false;
    const t = todayKey().split("-").map(Number);
    this.minY = t[0]; this.minM = t[1];   // premier mois affiché = mois en cours
    this.year = t[0]; this.month = t[1];  // mois affiché (1..12)
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.width = "100%";
    this.style.height = "100%";
    ensureFonts();
    if (!this.built) {
      this.built = true;
      this.build();
    }
  }

  // Les dates envoyées par la page (tableau Wix)
  attributeChangedCallback(name, oldVal, newVal) {
    if (name !== "dates") return;
    const set = new Set();
    try {
      const arr = JSON.parse(newVal || "[]");
      if (Array.isArray(arr)) arr.forEach((e) => expand(e, set));
    } catch (e) {
      console.error("mini-calendar : liste des dates illisible", e);
      return;
    }
    this.blocked = set;
    if (this.grid) this.render();
  }

  build() {
    const style = document.createElement("style");
    style.textContent = CSS;
    const wrap = el("div", "wrap");
    const cal = el("div", "cal");

    const head = el("div", "head");
    this.prev = el("button", "nav", "‹");
    this.next = el("button", "nav", "›");
    this.prev.type = this.next.type = "button";
    this.prev.setAttribute("aria-label", "Mois précédent");
    this.next.setAttribute("aria-label", "Mois suivant");
    this.titleEl = el("div", "title");
    this.titleEl.setAttribute("aria-live", "polite");
    head.appendChild(this.prev);
    head.appendChild(this.titleEl);
    head.appendChild(this.next);

    this.grid = el("div", "grid");
    cal.appendChild(head);
    cal.appendChild(this.grid);

    if (SHOW_LEGEND && LEGEND_TEXT) {
      const lg = el("div", "legend");
      lg.innerHTML = HEART;
      lg.appendChild(el("span", "", LEGEND_TEXT));
      cal.appendChild(lg);
    }

    wrap.appendChild(cal);
    this.root.appendChild(style);
    this.root.appendChild(wrap);

    this.prev.addEventListener("click", () => this.go(-1));
    this.next.addEventListener("click", () => this.go(1));
    this.render();
  }

  monthsFromNow() {
    return (this.year - this.minY) * 12 + (this.month - this.minM);
  }

  go(delta) {
    const target = this.monthsFromNow() + delta;
    if (target < 0 || target > MAX_MONTHS_AHEAD) return;
    let m = this.month + delta, y = this.year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    this.year = y; this.month = m;
    this.render();
  }

  render() {
    const y = this.year, m = this.month;
    this.titleEl.textContent = MONTHS[m - 1] + " " + y;
    const n = this.monthsFromNow();
    this.prev.disabled = n <= 0;
    this.next.disabled = n >= MAX_MONTHS_AHEAD;

    const today = todayKey();
    const g = this.grid;
    g.textContent = "";

    if (SHOW_WEEKDAYS) WEEKDAYS.forEach((w) => g.appendChild(el("div", "wd", w)));

    const first = new Date(Date.UTC(y, m - 1, 1));
    const offset = (first.getUTCDay() + 6) % 7;            // la semaine commence le lundi
    const count = new Date(Date.UTC(y, m, 0)).getUTCDate();  // nombre de jours du mois

    for (let i = 0; i < offset; i++) g.appendChild(el("div", "day empty"));

    for (let d = 1; d <= count; d++) {
      const k = key(y, m, d);
      const off = this.blocked.has(k);
      const cls = "day" + (off ? " off" : "") + (k < today ? " past" : "") + (k === today ? " today" : "");
      const cell = el("div", cls);
      if (off) cell.innerHTML = HEART;
      cell.appendChild(el("span", "", String(d)));
      cell.setAttribute("aria-label", d + " " + MONTHS[m - 1].toLowerCase() + " " + y + (off ? ", indisponible" : ""));
      g.appendChild(cell);
    }

    // hauteur conseillée pour l'élément dans Wix
    const total = this.root.querySelector(".cal").offsetHeight;
    if (total > 40) this.setAttribute("data-hauteur-conseillee", String(Math.round(total + 8)));
  }
}

if (!customElements.get("mini-calendar")) {
  customElements.define("mini-calendar", MiniCalendar);
}

})();
