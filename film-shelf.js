// film-shelf.js
// Élément personnalisé Wix : rangée d'affiches façon Netflix.
// Au clic sur une affiche, une fenêtre s'ouvre avec la vidéo + l'avis des mariés.
// Tag name à utiliser dans Wix : film-shelf

// ============================================================
// 1) RÉGLAGES D'APPARENCE
// ============================================================
const SECTION_TITLE = "";      // titre au-dessus des affiches ("" = aucun)
const SECTION_SUBTITLE = "";   // sous-titre ("" = aucun)
const BG = "transparent";      // fond de la section ("transparent" = reprend le fond du site, ou une couleur ex. "#ffffff")
const TEXT = "#111111";        // couleur du texte de la section
const ACCENT = "#c9a96e";      // couleur d'accent (doré)
const FONT_TITLE = "'Cinzel', Georgia, 'Times New Roman', serif";   // titres, lieux, dates
const FONT_SCRIPT = "'Pinyon Script', 'Brush Script MT', cursive";    // prénoms des mariés
const FONT_TEXT = "'Helvetica Neue', Arial, sans-serif";

// true  = les films viennent du tableau Wix (collection "Films") : modification facile
// false = les films viennent de la liste FILMS ci-dessous (dans ce fichier)
const USE_CMS = false;

// true  = la rangée prend toute la largeur de l'écran, parfaitement centrée,
//         même si l'élément est mal placé ou plus large que l'écran dans Wix
// false = la rangée reste dans le cadre de l'élément Wix
const FULL_WIDTH = true;

// ============================================================
// 2) TES FILMS
// Pour chaque film, remplis ce que tu as. Tout est optionnel sauf "title".
//   couple  : "Prénom & Prénom"  -> devient le "titre du film" sur l'affiche
//   place   : lieu court, ex. "Dunkerque"
//   date    : ex. "07.12.2024"
//   poster  : lien de l'image d'affiche (idéalement format vertical 2:3)
//   videos  : la ou les vidéos du film. Chaque vidéo = un nom + un lien
//             (lien YouTube, lien Vimeo, ou lien direct MP4). Exemple :
//               videos: [
//                 { label: "Bande-annonce", url: "https://youtu.be/XXXXXXXXXXX" },
//                 { label: "Teaser",        url: "https://youtu.be/YYYYYYYYYYY" },
//                 { label: "Film",          url: "https://vimeo.com/123456789" }
//               ],
//             Avec plusieurs vidéos, des boutons de choix apparaissent sous le lecteur.
//             Une seule vidéo ? Tu peux écrire : videos: [ { label: "Film", url: "..." } ],
//   review  : l'avis des mariés (texte)
//   author  : qui a écrit l'avis, ex. "Manon & Mathias"
// ============================================================
const FILMS = [
  {
    title: "Bande annonce d'un mariage à Meurchin & Lambres-lez-Douai",
    couple: "Céleste & Quentin",
    place: "Meurchin",
    date: "05.09.2026",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Teaser & film de mariage à Avesnes-sur-Helpe & en Belgique",
    couple: "", place: "Avesnes-sur-Helpe", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage sur la Côte d'Opale",
    couple: "", place: "Côte d'Opale", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage dans les Weppes",
    couple: "", place: "Les Weppes", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Teaser & film de mariage dans le Nord",
    couple: "", place: "Nord", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage à Dunkerque",
    couple: "", place: "Dunkerque", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  // ---- Films 7 à 10 : à compléter (remplace le titre, ou supprime le bloc entier) ----
  {
    title: "Film de mariage n°7 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage n°8 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage n°9 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  },
  {
    title: "Film de mariage n°10 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    videos: [],
    review: "", author: ""
  }
];

// ============================================================
// 3) CODE (tu n'as rien à modifier en dessous)
// ============================================================
const CSS = `
  :host { display:block; width:100%; max-width:100vw; min-width:0; height:100%; }
  * { box-sizing:border-box; }
  .wrap {
    width:100%; max-width:100vw; min-width:0; height:100%; overflow:hidden; background:${BG}; color:${TEXT};
    font-family:${FONT_TEXT}; display:flex; flex-direction:column; justify-content:center;
    padding:32px 0; position:relative;
  }
  .head { padding:0 clamp(20px,5vw,64px); margin-bottom:12px; }
  .head h2 {
    margin:0; font-family:${FONT_TITLE}; font-weight:400; letter-spacing:.02em;
    font-size:clamp(26px,3.4vw,44px); line-height:1.15;
  }
  .head p { margin:8px 0 0; color:${ACCENT}; font-size:clamp(13px,1.2vw,15px); letter-spacing:.12em; text-transform:uppercase; }

  .stage { position:relative; width:100%; min-width:0; }
  .row {
    display:flex; gap:clamp(12px,1.6vw,22px); overflow-x:auto; overflow-y:hidden; width:100%; min-width:0;
    padding:28px clamp(20px,5vw,64px); scroll-snap-type:x proximity; scrollbar-width:none;
    -webkit-overflow-scrolling:touch; cursor:grab;
  }
  .row::-webkit-scrollbar { display:none; }
  .row.drag { cursor:grabbing; scroll-snap-type:none; }

  .card {
    flex:0 0 auto; width:clamp(190px,21vw,300px); aspect-ratio:2/3; position:relative;
    border:0; padding:0; border-radius:10px; overflow:hidden; cursor:pointer; background:#1a1a1a;
    scroll-snap-align:start; color:#fff; font:inherit; text-align:left;
    box-shadow:0 8px 24px rgba(0,0,0,.5);
    transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s;
    opacity:0; transform:translateY(24px);
  }
  .row.in .card { opacity:1; transform:none; transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s, opacity .7s; }
  .row.in .card:nth-child(2){transition-delay:.06s,0s,.06s} .row.in .card:nth-child(3){transition-delay:.12s,0s,.12s}
  .row.in .card:nth-child(4){transition-delay:.18s,0s,.18s} .row.in .card:nth-child(5){transition-delay:.24s,0s,.24s}
  .row.in .card:nth-child(6){transition-delay:.3s,0s,.3s} .row.in .card:nth-child(7){transition-delay:.36s,0s,.36s}
  .row.in .card:nth-child(8){transition-delay:.42s,0s,.42s} .row.in .card:nth-child(9){transition-delay:.48s,0s,.48s}
  .row.in .card:nth-child(10){transition-delay:.54s,0s,.54s}
  .row.in .card:hover, .row.in .card:focus-visible {
    transform:scale(1.07); z-index:3; box-shadow:0 18px 44px rgba(0,0,0,.75); transition-delay:0s;
  }
  .card:focus-visible { outline:2px solid ${ACCENT}; outline-offset:3px; }
  .card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; -webkit-user-drag:none; }
  .card .ph {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center;
    background:linear-gradient(160deg,#2a2418,#0e0e0e 70%); font-family:${FONT_TITLE}; font-size:22px; color:${ACCENT};
  }
  .card .shade {
    position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.25) 38%, rgba(0,0,0,0) 62%);
    transition:background .35s;
  }
  .card:hover .shade, .card:focus-visible .shade {
    background:linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.1) 100%);
  }
  .card .info { position:absolute; left:0; right:0; bottom:0; padding:16px; pointer-events:none; }
  .card .name { font-family:${FONT_TITLE}; font-size:clamp(15px,1.3vw,18px); line-height:1.3; letter-spacing:.04em; }
  .card .name.script { font-family:${FONT_SCRIPT}; font-size:clamp(28px,2.6vw,38px); line-height:1.1; letter-spacing:0; }
  .card .meta { margin-top:6px; font-family:${FONT_TITLE}; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#cfcfcf; }
  .card .play {
    margin-top:10px; font-family:${FONT_TITLE}; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:${ACCENT};
    opacity:0; transform:translateY(6px); transition:opacity .3s, transform .3s;
  }
  .card:hover .play, .card:focus-visible .play { opacity:1; transform:none; }

  .arrow {
    position:absolute; top:0; bottom:0; width:clamp(40px,5vw,64px); border:0; cursor:pointer; z-index:4;
    color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center;
    opacity:.75; transition:opacity .3s;
  }
  .arrow.l { left:0; background:linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,0)); }
  .arrow.r { right:0; background:linear-gradient(to left, rgba(0,0,0,.75), rgba(0,0,0,0)); }
  .stage:hover .arrow { opacity:1; }
  .arrow[hidden] { display:none; }
  @media (hover:none) { .arrow { display:none; } }
  @media (max-width:640px) { .card { width:62vw; } }

  .modal {
    position:fixed; inset:0; z-index:2147483600; display:none; align-items:center; justify-content:center;
    padding:clamp(10px,3vw,40px); background:rgba(0,0,0,.82); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    overscroll-behavior:contain; opacity:0; transition:opacity .3s;
  }
  .modal.open { display:flex; }
  .modal.show { opacity:1; }
  .panel {
    width:min(1000px,100%); max-height:100%; overflow:auto; background:#121212; color:#f2f2f2;
    border-radius:14px; box-shadow:0 30px 80px rgba(0,0,0,.8); position:relative;
    transform:translateY(18px) scale(.97); transition:transform .35s cubic-bezier(.2,.7,.2,1);
    font-family:${FONT_TEXT};
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
    color:#bdbdbd; font-family:${FONT_TITLE}; font-size:clamp(16px,2vw,22px);
    background-size:cover; background-position:center;
  }
  .media .soon span { background:rgba(0,0,0,.6); padding:10px 16px; border-radius:8px; }
  .tabs { display:none; flex-wrap:wrap; gap:8px; padding:16px clamp(18px,3vw,34px) 0; }
  .tab {
    border:1px solid rgba(255,255,255,.35); background:transparent; color:#e6e6e6; cursor:pointer;
    padding:9px 16px; border-radius:999px; font-family:${FONT_TITLE}; font-size:12px;
    letter-spacing:.14em; text-transform:uppercase; transition:background .25s, color .25s, border-color .25s;
  }
  .tab:hover { border-color:${ACCENT}; color:${ACCENT}; }
  .tab.on { background:${ACCENT}; border-color:${ACCENT}; color:#111; }
  .content { padding:clamp(18px,3vw,34px); }
  .content h3 { margin:0; font-family:${FONT_TITLE}; font-weight:400; font-size:clamp(20px,2.4vw,30px); line-height:1.25; letter-spacing:.04em; }
  .content h3.script { font-family:${FONT_SCRIPT}; font-size:clamp(40px,5vw,64px); line-height:1.05; letter-spacing:0; }
  .content .sub { margin-top:8px; font-family:${FONT_TITLE}; color:${ACCENT}; font-size:13px; letter-spacing:.14em; text-transform:uppercase; }
  .content blockquote {
    margin:22px 0 0; padding:0 0 0 18px; border-left:2px solid ${ACCENT};
    font-size:clamp(15px,1.4vw,17px); line-height:1.7; color:#dcdcdc; white-space:pre-line;
  }
  .content cite { display:block; margin-top:12px; font-style:normal; color:${ACCENT}; font-size:14px; }

  @media (prefers-reduced-motion:reduce) {
    .card, .modal, .panel, .play { transition:none !important; }
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
function hasSource(x) { return !!(x.youtube || x.vimeo || x.video); }

// Chaque film a une liste "videos" : [{ label, youtube|vimeo|video }, ...]
function normalizeFilm(raw) {
  const f = Object.assign({}, raw);
  f.poster = mediaImage(f.poster);
  const list = [];

  if (Array.isArray(f.videos)) {
    f.videos.forEach((x) => {
      const isStr = typeof x === "string";
      const src = toSource(isStr ? x : x && (x.url || x.video));
      if (hasSource(src)) list.push(Object.assign({ label: isStr ? "" : (x.label || "") }, src));
    });
  } else {
    // ancienne écriture : une seule vidéo (youtube / vimeo / video)
    let src;
    if (f.youtube) src = { youtube: ytId(f.youtube) || f.youtube, vimeo: "", video: "" };
    else if (f.vimeo) src = { youtube: "", vimeo: vimeoId(f.vimeo) || f.vimeo, video: "" };
    else src = toSource(f.video);
    if (hasSource(src)) list.push(Object.assign({ label: "" }, src));
  }

  if (list.length > 1) list.forEach((v, i) => { if (!v.label) v.label = "Vidéo " + (i + 1); });
  f.videos = list;
  return f;
}

// Charge Cinzel et Pinyon Script (Google Fonts) une seule fois pour la page
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

class FilmShelf extends HTMLElement {
  static get observedAttributes() {
    return ["films"];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.lastFocus = null;
    this.films = null;
    this.built = false;
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
    if (this.films) {
      this.renderCards();
    } else if (!USE_CMS) {
      this.films = FILMS.map(normalizeFilm);
      this.renderCards();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name !== "films" || !newVal) return;
    try {
      const arr = JSON.parse(newVal);
      if (Array.isArray(arr)) {
        this.films = arr.map(normalizeFilm);
        if (this.row) this.renderCards();
      }
    } catch (e) {
      console.error("film-shelf : liste de films illisible", e);
    }
  }

  renderCards() {
    this.row.textContent = "";
    (this.films || []).forEach((f) => this.row.appendChild(this.makeCard(f)));
    this.fit();
  }

  // Cale la rangée sur l'écran (centrage et largeur) quel que soit le placement dans Wix
  fit() {
    if (!this.wrap) return;
    const r = this.getBoundingClientRect();
    const screenW = document.documentElement.clientWidth || window.innerWidth;
    const st = this.wrap.style;
    if (FULL_WIDTH) {
      st.width = screenW + "px";
      st.maxWidth = "none";
      st.marginLeft = -r.left + "px";
    } else {
      st.width = "100%";
      st.marginLeft = "0";
      st.maxWidth = Math.max(200, screenW - Math.max(0, r.left)) + "px";
    }
    this.updateArrows();
  }

  build() {
    const style = document.createElement("style");
    style.textContent = CSS;

    const wrap = el("div", "wrap");
    this.wrap = wrap;
    if (SECTION_TITLE || SECTION_SUBTITLE) {
      const head = el("div", "head");
      if (SECTION_TITLE) head.appendChild(el("h2", "", SECTION_TITLE));
      if (SECTION_SUBTITLE) head.appendChild(el("p", "", SECTION_SUBTITLE));
      wrap.appendChild(head);
    }

    const stage = el("div", "stage");
    this.row = el("div", "row");
    this.row.setAttribute("role", "list");

    this.btnL = el("button", "arrow l", "‹");
    this.btnR = el("button", "arrow r", "›");
    this.btnL.type = this.btnR.type = "button";
    this.btnL.setAttribute("aria-label", "Précédent");
    this.btnR.setAttribute("aria-label", "Suivant");
    this.btnL.addEventListener("click", () => this.scrollBy(-1));
    this.btnR.addEventListener("click", () => this.scrollBy(1));

    stage.appendChild(this.row);
    stage.appendChild(this.btnL);
    stage.appendChild(this.btnR);
    wrap.appendChild(stage);

    this.setupDrag();
    this.row.addEventListener("scroll", () => this.updateArrows(), { passive: true });
    window.addEventListener("resize", () => this.fit());
    if ("ResizeObserver" in window) new ResizeObserver(() => this.fit()).observe(this);

    this.buildModal();

    this.root.appendChild(style);
    this.root.appendChild(wrap);
    this.root.appendChild(this.modal);

    this.fit();
    this.observeEntry();
  }

  makeCard(f) {
    const b = el("button", "card");
    b.type = "button";
    b.setAttribute("role", "listitem");
    const name = f.couple || f.title;
    b.setAttribute("aria-label", "Voir le film : " + name);

    if (f.poster) {
      const img = document.createElement("img");
      img.src = f.poster;
      img.alt = "Affiche du film " + name;
      img.loading = "lazy";
      img.draggable = false;
      b.appendChild(img);
    } else {
      b.appendChild(el("div", "ph", name));
    }
    b.appendChild(el("div", "shade"));

    const info = el("div", "info");
    info.appendChild(el("div", f.couple ? "name script" : "name", name));
    const meta = [f.place, f.date].filter(Boolean).join(" · ");
    if (meta) info.appendChild(el("div", "meta", meta));
    info.appendChild(el("div", "play", "▶ Voir le film"));
    b.appendChild(info);

    b.addEventListener("click", () => this.open(f, b));
    return b;
  }

  scrollBy(dir) {
    this.row.scrollBy({ left: dir * this.row.clientWidth * 0.8, behavior: "smooth" });
  }

  updateArrows() {
    const r = this.row;
    this.btnL.hidden = r.scrollLeft < 8;
    this.btnR.hidden = r.scrollLeft + r.clientWidth >= r.scrollWidth - 8;
  }

  setupDrag() {
    const r = this.row;
    let down = false, moved = false, startX = 0, startLeft = 0;
    r.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = r.scrollLeft;
    });
    r.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) { moved = true; r.classList.add("drag"); }
      if (moved) r.scrollLeft = startLeft - dx;
    });
    const end = () => { down = false; r.classList.remove("drag"); };
    r.addEventListener("pointerup", end);
    r.addEventListener("pointerleave", end);
    r.addEventListener("click", (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);
  }

  observeEntry() {
    if (!("IntersectionObserver" in window)) { this.row.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.row.classList.add("in");
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(this.row);
    setTimeout(() => this.row.classList.add("in"), 2500); // sécurité
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
    this.tabs = el("div", "tabs");
    this.content = el("div", "content");
    this.panel.appendChild(this.closeBtn);
    this.panel.appendChild(this.media);
    this.panel.appendChild(this.tabs);
    this.panel.appendChild(this.content);
    this.modal.appendChild(this.panel);

    // clic sur le fond = fermer
    this.modal.addEventListener("click", (e) => { if (e.target === this.modal) this.close(); });
    // empêche la page de défiler derrière la fenêtre
    const stop = (e) => { if (!e.composedPath().includes(this.panel)) e.preventDefault(); };
    this.modal.addEventListener("wheel", stop, { passive: false });
    this.modal.addEventListener("touchmove", stop, { passive: false });
  }

  buildMedia(src, f) {
    this.media.textContent = "";
    let node = null;
    if (src && src.youtube) {
      node = document.createElement("iframe");
      node.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(src.youtube) + "?autoplay=1&rel=0";
    } else if (src && src.vimeo) {
      node = document.createElement("iframe");
      node.src = "https://player.vimeo.com/video/" + encodeURIComponent(src.vimeo) + "?autoplay=1";
    } else if (src && src.video) {
      node = document.createElement("video");
      node.src = src.video;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
      if (f.poster) node.poster = f.poster;
    }
    if (node && node.tagName === "IFRAME") {
      node.allow = "autoplay; fullscreen; picture-in-picture";
      node.allowFullscreen = true;
      node.title = (src.label ? src.label + " - " : "") + (f.couple || f.title);
    }
    if (node) {
      this.media.appendChild(node);
    } else {
      const s = el("div", "soon");
      if (f.poster) s.style.backgroundImage = "url('" + f.poster.replace(/'/g, "%27") + "')";
      s.appendChild(el("span", "", "Le film arrive bientôt"));
      this.media.appendChild(s);
    }
  }

  // Boutons de choix (Bande-annonce / Teaser / Film...) quand il y a plusieurs vidéos
  buildTabs(f) {
    this.tabs.textContent = "";
    const list = f.videos || [];
    if (list.length < 2) { this.tabs.style.display = "none"; return; }
    this.tabs.style.display = "flex";
    list.forEach((v, i) => {
      const b = el("button", "tab" + (i === 0 ? " on" : ""), v.label);
      b.type = "button";
      b.addEventListener("click", () => {
        this.tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("on"));
        b.classList.add("on");
        this.buildMedia(v, f);
      });
      this.tabs.appendChild(b);
    });
  }

  open(f, trigger) {
    this.lastFocus = trigger;
    const first = (f.videos && f.videos[0]) || null;
    this.buildMedia(first, f);
    this.buildTabs(f);

    this.content.textContent = "";
    const headline = f.couple || f.title;
    this.content.appendChild(el("h3", f.couple ? "script" : "", headline));
    const sub = [f.couple ? f.title : "", f.place, f.date].filter(Boolean).join(" · ");
    if (sub) this.content.appendChild(el("div", "sub", sub));
    if (f.review) {
      const q = el("blockquote", "", f.review);
      if (f.author) q.appendChild(el("cite", "", "— " + f.author));
      this.content.appendChild(q);
    }

    this.modal.setAttribute("aria-label", headline);
    this.modal.classList.add("open");
    requestAnimationFrame(() => this.modal.classList.add("show"));
    this.panel.scrollTop = 0;

    // On mémorise l'endroit où se trouve le visiteur pour y revenir à la fermeture
    this.savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
    window.addEventListener("keydown", this.onKey);
    this.closeBtn.focus({ preventScroll: true });
  }

  close() {
    this.modal.classList.remove("show");
    window.removeEventListener("keydown", this.onKey);
    this.restoreScroll();
    setTimeout(() => {
      this.modal.classList.remove("open");
      this.media.textContent = ""; // coupe la vidéo
    }, 300);
    if (this.lastFocus) this.lastFocus.focus({ preventScroll: true });
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

if (!customElements.get("film-shelf")) {
  customElements.define("film-shelf", FilmShelf);
}
