// offer-cards.js
// Élément personnalisé Wix : les six formules sous forme de cartes.
//  - survol (ordinateur) : un extrait vidéo muet démarre sur la carte
//  - clic : une fenêtre s'ouvre avec l'exemple vidéo, la description et un bouton "Demander un devis"
// Tag name à utiliser dans Wix : offer-cards
//
// SEO : le nom de chaque formule est un vrai titre (h3) et l'accroche un vrai paragraphe.
// Garde aussi le titre "Imaginez votre film :" (H2) en texte Wix normal juste au-dessus de cet élément.

// ============================================================
// 1) RÉGLAGES
// ============================================================
const BG = "transparent";      // fond ("transparent" = reprend le fond du site)
const ACCENT = "#D5AF37";      // doré
const FONT_TITLE = "'Cinzel', Georgia, 'Times New Roman', serif";
const FONT_TEXT = "'Helvetica Neue', Arial, sans-serif";
const CTA_LABEL = "Demander un devis";
// Le bouton envoie un signal "devis" à ta page Wix (le code Velo fait défiler vers #section8).
// Solution de secours si ce code n'est pas en place : défiler jusqu'au titre de ton formulaire :
const CONTACT_HEADING = "Donnons vie à votre film";
// (facultatif) lien complet vers ton formulaire, utilisé si le titre n'est pas trouvé :
const CONTACT_URL = "";

// ============================================================
// 2) LES SIX FORMULES (affichées par défaut, et dans l'éditeur Wix)
//    Sur le site, elles sont remplacées par celles de ton tableau Wix (collection des offres)
//    si le code de la page les envoie : tu modifies alors tout depuis Wix, sans toucher à ce fichier.
//   name    : nom de la formule (titre h3)
//   pitch   : phrase courte affichée sur la carte
//   text    : description complète, affichée dans la fenêtre
//   image   : image de la carte (lien image ou lien Wix) — idéalement format paysage
//   preview : petit extrait vidéo MUET qui se lance au survol (lien MP4 ou lien Wix vidéo)
//   example : vidéo d'exemple dans la fenêtre (lien YouTube, Vimeo, MP4 ou Wix vidéo)
// ============================================================
const OFFERS = [
  {
    name: "La demande en mariage",
    pitch: "La capture discrète et soignée de votre demande, préparée en amont.",
    text: "La capture discrète et soignée de votre demande, préparée en amont.\nUn souvenir authentique de cet instant unique, à revoir toute votre vie.",
    image: "", preview: "", example: ""
  },
  {
    name: "La Bande Annonce",
    pitch: "Un film court réalisé avant le mariage, dans un lieu choisi ensemble.",
    text: "Un film court réalisé avant le mariage, dans un lieu choisi ensemble.\nUne manière élégante et originale d’annoncer votre union à vos proches.",
    image: "", preview: "", example: ""
  },
  {
    name: "Le Film Principal",
    pitch: "Le film complet de votre mariage, raconté avec émotion et fluidité.",
    text: "Le film complet de votre mariage, raconté avec émotion et fluidité.\nIl rassemble les temps forts, les détails, les regards et les émotions pour créer un souvenir vivant et intemporel.",
    image: "", preview: "", example: ""
  },
  {
    name: "Le Teaser",
    pitch: "Un court extrait livré pendant la soirée ou dans les 48 à 72 heures.",
    text: "Un court extrait livré pendant la soirée ou dans les 48 à 72 heures.\nParfait pour revivre immédiatement l’émotion, la partager avec ceux qui n’étaient pas présents et attendre le film principal.",
    image: "", preview: "", example: ""
  },
  {
    name: "L'After Day",
    pitch: "Une séance réalisée après le mariage, dans un lieu choisi ensemble.",
    text: "Une séance réalisée après le mariage, dans un lieu choisi ensemble.\nUn moment plus calme, qui permet de créer des images naturelles et élégantes, sans la pression du jour J.",
    image: "", preview: "", example: ""
  },
  {
    name: "Le Film d'or",
    pitch: "Un film dédié aux messages de vos proches.",
    text: "Un film dédié aux messages de vos proches.\nJe recueille leurs mots et leurs souvenirs pour créer une capsule pleine d’émotion, pouvant aussi enrichir votre film principal.",
    image: "", preview: "", example: ""
  }
];

// ============================================================
// 3) CODE (tu n'as rien à modifier en dessous)
// ============================================================
const CSS = `
  :host { display:block; width:100%; max-width:100vw; min-width:0; height:100%; }
  * { box-sizing:border-box; }
  .wrap {
    width:100%; min-width:0; height:100%; overflow:hidden; background:${BG};
    font-family:${FONT_TEXT}; padding:28px 0; display:flex; align-items:flex-start; justify-content:center;
  }
  .grid {
    width:100%; max-width:1240px; padding:0 clamp(16px,4vw,48px);
    display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:clamp(14px,2vw,28px);
  }
  @media (max-width:900px) { .grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media (max-width:560px) { .grid { grid-template-columns:minmax(0,1fr); } }

  .card {
    position:relative; aspect-ratio:4/3; border-radius:12px; overflow:hidden; background:#151515;
    color:#fff; cursor:pointer; text-align:left; box-shadow:0 8px 24px rgba(0,0,0,.35);
    transition:transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s, opacity .7s;
    opacity:0; transform:translateY(24px); outline:none;
  }
  .grid.in .card { opacity:1; transform:none; }
  .grid.in .card:nth-child(2){transition-delay:.07s} .grid.in .card:nth-child(3){transition-delay:.14s}
  .grid.in .card:nth-child(4){transition-delay:.21s} .grid.in .card:nth-child(5){transition-delay:.28s}
  .grid.in .card:nth-child(6){transition-delay:.35s}
  .grid.in .card:hover, .grid.in .card:focus-visible {
    transform:translateY(-5px) scale(1.02); box-shadow:0 20px 44px rgba(0,0,0,.5); transition-delay:0s;
  }
  .card:focus-visible { outline:2px solid ${ACCENT}; outline-offset:3px; }
  .card .bg, .card .pv { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
  .card .ph {
    position:absolute; inset:0; background:linear-gradient(150deg,#2a2418,#0e0e0e 75%);
  }
  .card .pv { opacity:0; transition:opacity .5s; pointer-events:none; }
  .card.playing .pv { opacity:1; }
  .card .shade {
    position:absolute; inset:0; pointer-events:none; transition:background .4s;
    background:linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,0) 72%);
  }
  .card:hover .shade, .card:focus-visible .shade {
    background:linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.5) 55%, rgba(0,0,0,.05) 100%);
  }
  .card .info { position:absolute; left:0; right:0; bottom:0; padding:clamp(14px,1.6vw,22px); pointer-events:none; }
  .card h3 {
    margin:0; font-family:${FONT_TITLE}; font-weight:400; letter-spacing:.06em;
    font-size:clamp(17px,1.65vw,23px); line-height:1.2; text-transform:none;
  }
  .card p { margin:8px 0 0; font-size:clamp(12.5px,1.05vw,14.5px); line-height:1.5; color:#e2e2e2; }
  .card .more {
    margin-top:12px; font-family:${FONT_TITLE}; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:${ACCENT};
    opacity:0; transform:translateY(6px); transition:opacity .3s, transform .3s;
  }
  .card:hover .more, .card:focus-visible .more { opacity:1; transform:none; }
  @media (hover:none) { .card .more { opacity:1; transform:none; } }

  .modal {
    position:fixed; inset:0; z-index:2147483600; display:none; align-items:center; justify-content:center;
    padding:clamp(10px,3vw,40px); background:rgba(0,0,0,.82); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    overscroll-behavior:contain; opacity:0; transition:opacity .3s;
  }
  .modal.open { display:flex; }
  .modal.show { opacity:1; }
  .panel {
    width:min(980px,100%); max-height:100%; overflow:auto; background:#121212; color:#f2f2f2;
    border-radius:14px; box-shadow:0 30px 80px rgba(0,0,0,.8); position:relative; font-family:${FONT_TEXT};
    transform:translateY(18px) scale(.97); transition:transform .35s cubic-bezier(.2,.7,.2,1);
  }
  .modal.show .panel { transform:none; }
  .close {
    position:absolute; top:10px; right:10px; z-index:5; width:42px; height:42px; border-radius:50%;
    border:1px solid rgba(255,255,255,.4); background:rgba(0,0,0,.6); color:#fff; font-size:22px;
    cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0;
  }
  .close:hover { background:rgba(0,0,0,.85); }
  .media { position:relative; width:100%; aspect-ratio:16/9; background:#000; }
  .media iframe, .media video { position:absolute; inset:0; width:100%; height:100%; border:0; background:#000; }
  .media .soon {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px;
    color:#bdbdbd; font-family:${FONT_TITLE}; font-size:clamp(15px,1.8vw,20px); background-size:cover; background-position:center;
  }
  .media .soon span { background:rgba(0,0,0,.6); padding:10px 16px; border-radius:8px; }
  .content { padding:clamp(18px,3vw,34px); }
  .content h3 { margin:0; font-family:${FONT_TITLE}; font-weight:400; letter-spacing:.05em; font-size:clamp(22px,2.6vw,32px); line-height:1.2; }
  .content .txt { margin:16px 0 0; font-size:clamp(15px,1.4vw,17px); line-height:1.7; color:#dcdcdc; white-space:pre-line; }
  .cta {
    margin-top:24px; cursor:pointer; border:1px solid ${ACCENT}; background:${ACCENT}; color:#111;
    font-family:${FONT_TITLE}; font-size:13px; letter-spacing:.16em; text-transform:uppercase;
    padding:14px 26px; border-radius:999px; transition:background .25s, color .25s;
  }
  .cta:hover { background:transparent; color:${ACCENT}; }

  @media (prefers-reduced-motion:reduce) {
    .card, .modal, .panel, .more, .pv { transition:none !important; }
    .card { opacity:1; transform:none; }
  }
`;

// ---- Outils : acceptent les liens Wix, YouTube, Vimeo ou MP4 tels quels ----
function ytId(s) {
  s = String(s || "").trim();
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(s) ? s : "";
}
function vimeoId(s) {
  s = String(s || "").trim();
  const m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return m[1];
  return /^\d+$/.test(s) ? s : "";
}
function mediaImage(s) {
  s = String(s || "").trim();
  if (s.indexOf("wix:image://v1/") === 0) return "https://static.wixstatic.com/media/" + s.split("/")[3];
  return s;
}
function mediaVideo(s) {
  s = String(s || "").trim();
  if (s.indexOf("wix:video://v1/") === 0) return "https://video.wixstatic.com/video/" + s.split("/")[3] + "/720p/mp4/file.mp4";
  return s;
}
function toSource(url) {
  const v = String(url || "").trim();
  const out = { youtube: "", vimeo: "", video: "" };
  if (!v) return out;
  const y = ytId(v), vi = vimeoId(v);
  if (y) out.youtube = y;
  else if (vi) out.vimeo = vi;
  else out.video = mediaVideo(v);
  return out;
}

// Accepte une ligne du tableau Wix (title / name, pitch, text, image, preview, example, ordre)
function normalizeOffer(raw) {
  const o = Object.assign({}, raw);
  o.name = String(o.name || o.title || "").trim();
  o.pitch = String(o.pitch || "").trim();
  o.text = String(o.text || o.pitch || "").trim();
  o.image = o.image || "";
  o.preview = o.preview || "";
  o.example = o.example || "";
  return o;
}
function sortByOrdre(list) {
  const num = (x) => { const n = parseFloat(x && x.ordre); return isNaN(n) ? Infinity : n; };
  return list.map((x, i) => ({ x, i })).sort((a, b) => (num(a.x) - num(b.x)) || (a.i - b.i)).map((o) => o.x);
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

class OfferCards extends HTMLElement {
  static get observedAttributes() {
    return ["offers"];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.offers = OFFERS.map(normalizeOffer);
    this.built = false;
    this.lastFocus = null;
    this.savedY = 0;
    this.onKey = this.onKey.bind(this);
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

  disconnectedCallback() {
    window.removeEventListener("keydown", this.onKey);
  }

  // Les offres envoyées par la page (tableau Wix) remplacent celles du fichier
  attributeChangedCallback(name, oldVal, newVal) {
    if (name !== "offers" || !newVal) return;
    try {
      const arr = JSON.parse(newVal);
      if (!Array.isArray(arr)) return;
      const list = sortByOrdre(arr).map(normalizeOffer).filter((o) => o.name);
      if (list.length) {
        this.offers = list;
        if (this.grid) this.renderCards();
      }
    } catch (e) {
      console.error("offer-cards : liste des offres illisible", e);
    }
  }

  renderCards() {
    this.grid.textContent = "";
    this.offers.forEach((o) => this.grid.appendChild(this.makeCard(o)));
    this.fit();
  }

  build() {
    const style = document.createElement("style");
    style.textContent = CSS;

    this.wrap = el("div", "wrap");
    this.grid = el("div", "grid");
    this.offers.forEach((o) => this.grid.appendChild(this.makeCard(o)));
    this.wrap.appendChild(this.grid);

    this.buildModal();
    this.root.appendChild(style);
    this.root.appendChild(this.wrap);
    this.root.appendChild(this.modal);

    window.addEventListener("resize", () => this.fit());
    if ("ResizeObserver" in window) new ResizeObserver(() => this.fit()).observe(this);
    this.fit();
    this.observeEntry();
    // les polices arrivent après : on recalcule la hauteur conseillée
    setTimeout(() => this.fit(), 1200);
    setTimeout(() => this.fit(), 3000);
  }

  // Cale la zone sur la largeur de l'écran (centrée, même si l'élément est décalé dans Wix)
  // et indique la hauteur conseillée pour l'élément dans Wix
  fit() {
    if (!this.wrap) return;
    const r = this.getBoundingClientRect();
    const screenW = document.documentElement.clientWidth || window.innerWidth;
    this.wrap.style.width = screenW + "px";
    this.wrap.style.marginLeft = -r.left + "px";
    const need = this.grid.offsetHeight + 56;
    if (need > 60) this.setAttribute("data-hauteur-conseillee", String(Math.round(need)));
  }

  observeEntry() {
    if (!("IntersectionObserver" in window)) { this.grid.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.grid.classList.add("in");
        io.disconnect();
      }
    }, { threshold: 0.12 });
    io.observe(this.grid);
    setTimeout(() => this.grid.classList.add("in"), 2500); // sécurité
  }

  makeCard(o) {
    const c = el("div", "card");
    c.setAttribute("role", "button");
    c.tabIndex = 0;
    c.setAttribute("aria-label", o.name + " : voir les détails");

    const img = mediaImage(o.image);
    if (img) {
      const i = document.createElement("img");
      i.className = "bg";
      i.src = img;
      i.alt = o.name;
      i.loading = "lazy";
      i.draggable = false;
      c.appendChild(i);
    } else {
      c.appendChild(el("div", "ph"));
    }

    // aperçu vidéo au survol (chargé seulement à la première fois)
    const pvUrl = mediaVideo(o.preview);
    let pv = null;
    if (pvUrl) {
      c.addEventListener("pointerenter", (e) => {
        if (e.pointerType !== "mouse") return;
        if (!pv) {
          pv = document.createElement("video");
          pv.className = "pv";
          pv.muted = true;
          pv.loop = true;
          pv.playsInline = true;
          pv.setAttribute("muted", "");
          pv.setAttribute("playsinline", "");
          pv.preload = "auto";
          pv.src = pvUrl;
          c.insertBefore(pv, c.querySelector(".shade"));
        }
        const pl = pv.play();
        if (pl && pl.catch) pl.catch(() => {});
        c.classList.add("playing");
      });
      c.addEventListener("pointerleave", () => {
        c.classList.remove("playing");
        if (pv) { pv.pause(); pv.currentTime = 0; }
      });
    }

    c.appendChild(el("div", "shade"));
    const info = el("div", "info");
    info.appendChild(el("h3", "", o.name));
    if (o.pitch) info.appendChild(el("p", "", o.pitch));
    info.appendChild(el("div", "more", "▶ Découvrir"));
    c.appendChild(info);

    c.addEventListener("click", () => this.open(o, c));
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.open(o, c); }
    });
    return c;
  }

  buildModal() {
    this.modal = el("div", "modal");
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.panel = el("div", "panel");
    this.closeBtn = el("button", "close", "✕");
    this.closeBtn.type = "button";
    this.closeBtn.setAttribute("aria-label", "Fermer");
    this.closeBtn.addEventListener("click", () => this.close());
    this.media = el("div", "media");
    this.content = el("div", "content");
    this.panel.appendChild(this.closeBtn);
    this.panel.appendChild(this.media);
    this.panel.appendChild(this.content);
    this.modal.appendChild(this.panel);

    this.modal.addEventListener("click", (e) => { if (e.target === this.modal) this.close(); });
    const stop = (e) => { if (!e.composedPath().includes(this.panel)) e.preventDefault(); };
    this.modal.addEventListener("wheel", stop, { passive: false });
    this.modal.addEventListener("touchmove", stop, { passive: false });
  }

  buildMedia(o) {
    this.media.textContent = "";
    const src = toSource(o.example);
    let node = null;
    if (src.youtube) {
      node = document.createElement("iframe");
      node.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(src.youtube) + "?autoplay=1&rel=0";
    } else if (src.vimeo) {
      node = document.createElement("iframe");
      node.src = "https://player.vimeo.com/video/" + encodeURIComponent(src.vimeo) + "?autoplay=1";
    } else if (src.video) {
      node = document.createElement("video");
      node.src = src.video;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
      const img = mediaImage(o.image);
      if (img) node.poster = img;
    }
    if (node && node.tagName === "IFRAME") {
      node.allow = "autoplay; fullscreen; picture-in-picture";
      node.allowFullscreen = true;
      node.title = o.name;
    }
    if (node) {
      this.media.appendChild(node);
    } else {
      const s = el("div", "soon");
      const img = mediaImage(o.image);
      if (img) s.style.backgroundImage = "url('" + img.replace(/'/g, "%27") + "')";
      s.appendChild(el("span", "", "Exemple vidéo bientôt disponible"));
      this.media.appendChild(s);
    }
  }

  open(o, trigger) {
    this.lastFocus = trigger;
    this.buildMedia(o);

    this.content.textContent = "";
    this.content.appendChild(el("h3", "", o.name));
    if (o.text) this.content.appendChild(el("p", "txt", o.text));
    const cta = el("button", "cta", CTA_LABEL);
    cta.type = "button";
    cta.addEventListener("click", () => this.close(true));
    this.content.appendChild(cta);

    this.modal.setAttribute("aria-label", o.name);
    this.modal.classList.add("open");
    requestAnimationFrame(() => this.modal.classList.add("show"));
    this.panel.scrollTop = 0;

    // on mémorise l'endroit où se trouve le visiteur pour y revenir à la fermeture
    this.savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
    window.addEventListener("keydown", this.onKey);
    this.closeBtn.focus({ preventScroll: true });
  }

  close(goToContact) {
    this.modal.classList.remove("show");
    window.removeEventListener("keydown", this.onKey);
    setTimeout(() => {
      this.modal.classList.remove("open");
      this.media.textContent = ""; // coupe la vidéo
      if (goToContact === true) this.scrollToContact();
    }, 300);
    if (goToContact === true) return;
    this.restoreScroll();
    if (this.lastFocus) this.lastFocus.focus({ preventScroll: true });
  }

  // Bouton "Demander un devis" : prévient la page Wix (code Velo : $w("#section8").scrollTo()).
  // Si la page n'a pas bougé 0,7 s plus tard, on cherche le titre du formulaire à la place.
  scrollToContact() {
    const y0 = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.dispatchEvent(new CustomEvent("devis", { bubbles: true, composed: true }));
    setTimeout(() => {
      const y1 = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (Math.abs(y1 - y0) < 20) this.scrollFallback();
    }, 700);
  }

  // Solution de secours : défile jusqu'au titre du formulaire de contact
  scrollFallback() {
    const target = Array.prototype.find.call(
      document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
      (h) => h.textContent.toLowerCase().indexOf(CONTACT_HEADING.toLowerCase()) !== -1
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (CONTACT_URL) {
      window.location.href = CONTACT_URL;
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }
  }

  restoreScroll() {
    const y = this.savedY || 0;
    const go = () => {
      try { window.scrollTo({ top: y, left: 0, behavior: "instant" }); }
      catch (err) { window.scrollTo(0, y); }
    };
    go();
    requestAnimationFrame(go);
    setTimeout(go, 120);
  }

  onKey(e) {
    if (e.key === "Escape") this.close();
  }
}

if (!customElements.get("offer-cards")) {
  customElements.define("offer-cards", OfferCards);
}
