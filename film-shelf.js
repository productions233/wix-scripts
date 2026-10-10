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
const FONT_TITLE = "Georgia, 'Times New Roman', serif";
const FONT_TEXT = "'Helvetica Neue', Arial, sans-serif";

// true  = les films viennent du tableau Wix (collection "Films") : modification facile
// false = les films viennent de la liste FILMS ci-dessous (dans ce fichier)
const USE_CMS = false;

// ============================================================
// 2) TES FILMS
// Pour chaque film, remplis ce que tu as. Tout est optionnel sauf "title".
//   couple  : "Prénom & Prénom"  -> devient le "titre du film" sur l'affiche
//   place   : lieu court, ex. "Dunkerque"
//   date    : ex. "07.12.2024"
//   poster  : lien de l'image d'affiche (idéalement format vertical 2:3)
//   youtube : identifiant YouTube (la partie après v=)  ex. "dQw4w9WgXcQ"
//   vimeo   : identifiant Vimeo, ex. "123456789"
//   video   : OU lien direct vers un fichier MP4
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
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Teaser & film de mariage à Avesnes-sur-Helpe & en Belgique",
    couple: "", place: "Avesnes-sur-Helpe", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage sur la Côte d'Opale",
    couple: "", place: "Côte d'Opale", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage dans les Weppes",
    couple: "", place: "Les Weppes", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Teaser & film de mariage dans le Nord",
    couple: "", place: "Nord", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage à Dunkerque",
    couple: "", place: "Dunkerque", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  // ---- Films 7 à 10 : à compléter (remplace le titre, ou supprime le bloc entier) ----
  {
    title: "Film de mariage n°7 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage n°8 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage n°9 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  },
  {
    title: "Film de mariage n°10 (à compléter)",
    couple: "", place: "", date: "",
    poster: "",
    youtube: "", vimeo: "", video: "",
    review: "", author: ""
  }
];

// ============================================================
// 3) CODE (tu n'as rien à modifier en dessous)
// ============================================================
const CSS = `
  :host { display:block; width:100%; height:100%; }
  * { box-sizing:border-box; }
  .wrap {
    width:100%; height:100%; overflow:hidden; background:${BG}; color:${TEXT};
    font-family:${FONT_TEXT}; display:flex; flex-direction:column; justify-content:center;
    padding:32px 0; position:relative;
  }
  .head { padding:0 clamp(20px,5vw,64px); margin-bottom:12px; }
  .head h2 {
    margin:0; font-family:${FONT_TITLE}; font-weight:400; letter-spacing:.02em;
    font-size:clamp(26px,3.4vw,44px); line-height:1.15;
  }
  .head p { margin:8px 0 0; color:${ACCENT}; font-size:clamp(13px,1.2vw,15px); letter-spacing:.12em; text-transform:uppercase; }

  .stage { position:relative; }
  .row {
    display:flex; gap:clamp(12px,1.6vw,22px); overflow-x:auto; overflow-y:hidden;
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
  .card .name { font-family:${FONT_TITLE}; font-size:clamp(18px,1.7vw,24px); line-height:1.15; }
  .card .meta { margin-top:4px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#cfcfcf; }
  .card .play {
    margin-top:10px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:${ACCENT};
    opacity:0; transform:translateY(6px); transition:opacity .3s, transform .3s;
  }
  .card:hover .play, .card:focus-visible .play { opacity:1; transform:none; }

  .arrow {
    position:absolute; top:0; bottom:0; width:clamp(40px,5vw,64px); border:0; cursor:pointer; z-index:4;
    color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .3s;
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
  .content { padding:clamp(18px,3vw,34px); }
  .content h3 { margin:0; font-family:${FONT_TITLE}; font-weight:400; font-size:clamp(24px,3vw,38px); line-height:1.15; }
  .content .sub { margin-top:6px; color:${ACCENT}; font-size:13px; letter-spacing:.1em; text-transform:uppercase; }
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
function normalizeFilm(raw) {
  const f = Object.assign({}, raw);
  f.poster = mediaImage(f.poster);
  const v = String(f.video || "").trim();
  if (!f.youtube && !f.vimeo && v) {
    const y = ytId(v), vi = vimeoId(v);
    if (y) { f.youtube = y; f.video = ""; }
    else if (vi) { f.vimeo = vi; f.video = ""; }
    else f.video = mediaVideo(v);
  }
  if (f.youtube) f.youtube = ytId(f.youtube) || f.youtube;
  if (f.vimeo) f.vimeo = vimeoId(f.vimeo) || f.vimeo;
  return f;
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
    this.updateArrows();
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.onKey);
    document.documentElement.style.overflow = this.prevOverflow || "";
  }

  build() {
    const style = document.createElement("style");
    style.textContent = CSS;

    const wrap = el("div", "wrap");
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
    window.addEventListener("resize", () => this.updateArrows());

    this.buildModal();

    this.root.appendChild(style);
    this.root.appendChild(wrap);
    this.root.appendChild(this.modal);

    this.updateArrows();
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
    info.appendChild(el("div", "name", name));
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
    this.content = el("div", "content");
    this.panel.appendChild(this.closeBtn);
    this.panel.appendChild(this.media);
    this.panel.appendChild(this.content);
    this.modal.appendChild(this.panel);

    // clic sur le fond = fermer
    this.modal.addEventListener("click", (e) => { if (e.target === this.modal) this.close(); });
    // empêche la page de défiler derrière la fenêtre
    const stop = (e) => { if (!e.composedPath().includes(this.panel)) e.preventDefault(); };
    this.modal.addEventListener("wheel", stop, { passive: false });
    this.modal.addEventListener("touchmove", stop, { passive: false });
  }

  buildMedia(f) {
    this.media.textContent = "";
    let node = null;
    if (f.youtube) {
      node = document.createElement("iframe");
      node.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(f.youtube) + "?autoplay=1&rel=0";
    } else if (f.vimeo) {
      node = document.createElement("iframe");
      node.src = "https://player.vimeo.com/video/" + encodeURIComponent(f.vimeo) + "?autoplay=1";
    } else if (f.video) {
      node = document.createElement("video");
      node.src = f.video;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
      if (f.poster) node.poster = f.poster;
    }
    if (node && node.tagName === "IFRAME") {
      node.allow = "autoplay; fullscreen; picture-in-picture";
      node.allowFullscreen = true;
      node.title = f.couple || f.title;
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

  open(f, trigger) {
    this.lastFocus = trigger;
    this.buildMedia(f);

    this.content.textContent = "";
    const headline = f.couple || f.title;
    this.content.appendChild(el("h3", "", headline));
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

    this.prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", this.onKey);
    this.closeBtn.focus({ preventScroll: true });
  }

  close() {
    this.modal.classList.remove("show");
    window.removeEventListener("keydown", this.onKey);
    document.documentElement.style.overflow = this.prevOverflow || "";
    setTimeout(() => {
      this.modal.classList.remove("open");
      this.media.textContent = ""; // coupe la vidéo
    }, 300);
    if (this.lastFocus) this.lastFocus.focus({ preventScroll: true });
  }

  onKey(e) {
    if (e.key === "Escape") this.close();
  }
}

if (!customElements.get("film-shelf")) {
  customElements.define("film-shelf", FilmShelf);
}
