// shrink-video.js
// Élément personnalisé Wix : la vidéo démarre en plein écran, rétrécit pendant
// que la page est bloquée, puis la page se met à défiler normalement.

// ====== À MODIFIER ======
const VIDEO_URL = "https://video.wixstatic.com/video/c2054d_f287c70e838842178e66c4b2183b10fb/720p/mp4/file.mp4"; // si ça ne marche pas, essaie 480p ou remets 1080p
const POSTER_URL = "https://static.wixstatic.com/media/c2054d_f287c70e838842178e66c4b2183b10fbf001.jpg"; // image affichée avant le chargement de la vidéo
const FINAL_SCALE = 0.6;      // taille finale de la vidéo : 0.6 = 60 % de l'écran (centrée)
const SCROLL_DISTANCE = 700;  // plus grand = réduction plus lente (en pixels de molette)
const FINAL_RADIUS = 16;      // coins arrondis à la taille finale (0 = coins carrés)
const SMOOTHING = 0.14;       // fluidité (0.05 = très doux, 0.3 = très réactif)

// --- Textes sous la vidéo (apparaissent à la fin de la réduction) ---
const TAGLINE_TEXT = "À l’écoute de vos désirs, pour immortaliser vos souvenirs";
const TAGLINE_COLOR = "#D5AF37";
const SIGNATURE_TEXT = "Productions 233";   // petit, aligné à droite sous la phrase (comme une citation)
const SIGNATURE_COLOR = "#000000";
const FONT_TITLE = "'Cinzel', Georgia, 'Times New Roman', serif";
const FONT_SCRIPT = "'Pinyon Script', 'Brush Script MT', cursive";
const ASPECT = 16 / 9;         // format de la vidéo (16/9 = vidéo classique)
const TEXT_APPEAR_FROM = 0.85; // les textes apparaissent quand la réduction est à 85 % (0.5 = plus tôt, 0.95 = tout à la fin)
const TEXT_GAP = 18;           // espace (px) entre la vidéo et la phrase
const TOP_PAD = 10;            // espace minimum (px) au-dessus de la vidéo, dans l'élément
const TEXT_BOTTOM_PAD = 6;     // petite marge (px) sous la signature (pour ne pas couper les lettres)
const SAFE_BOTTOM = 16;        // marge (px) gardée en bas de l'écran : la vidéo et le texte ne passent jamais dessous
// ========================

// Charge Cinzel et Pinyon Script (Google Fonts) une seule fois pour la page
function ensureFonts() {
  if (document.getElementById("film-shelf-fonts")) return;
  const l = document.createElement("link");
  l.id = "film-shelf-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Pinyon+Script&display=swap";
  document.head.appendChild(l);
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

class ShrinkVideo extends HTMLElement {
  static get observedAttributes() {
    return ["video-url"];
  }

  constructor() {
    super();
    this.target = 0;      // progression demandée (0 = plein écran, 1 = taille finale)
    this.current = 0;     // progression affichée (lissée)
    this.running = false;
    this.touchY = null;
    this.lastScroll = 0;
    this.inEditor = false;

    this.onWheel = this.onWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onKey = this.onKey.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.position = "relative";
    this.style.width = "100%";
    this.style.height = "100%";

    this.frame = document.createElement("div");
    this.video = document.createElement("video");
    this.video.muted = true;
    this.video.loop = true;
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.setAttribute("muted", "");
    this.video.setAttribute("playsinline", "");
    this.video.preload = "auto";
    if (POSTER_URL) this.video.poster = POSTER_URL;
    this.video.style.cssText =
      "width:100%;height:100%;object-fit:cover;display:block;";
    this.frame.appendChild(this.video);

    // Bouton son (les navigateurs interdisent le son automatique : il faut un clic)
    this.btn = document.createElement("button");
    this.btn.type = "button";
    this.btn.style.cssText =
      "position:absolute;right:16px;bottom:16px;z-index:5;width:44px;height:44px;" +
      "border-radius:50%;border:1px solid rgba(255,255,255,0.5);" +
      "background:rgba(0,0,0,0.5);color:#fff;font-size:20px;line-height:1;" +
      "cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;";
    this.updateBtn();
    this.btn.addEventListener("click", () => {
      this.video.muted = !this.video.muted;
      if (!this.video.muted) {
        this.video.volume = 1;
        const pl = this.video.play();
        if (pl && pl.catch) pl.catch(() => {});
      }
      this.updateBtn();
    });
    this.frame.appendChild(this.btn);

    this.appendChild(this.frame);

    // Textes sous la vidéo : la phrase, puis la signature alignée à droite
    ensureFonts();
    this.txtWrap = document.createElement("div");
    this.cite = document.createElement("div");
    this.cite.style.cssText =
      "display:flex;flex-direction:column;align-items:flex-end;width:max-content;max-width:90vw;" +
      "padding-bottom:" + TEXT_BOTTOM_PAD + "px;box-sizing:content-box;";
    const t1 = document.createElement("span");
    t1.textContent = TAGLINE_TEXT;
    t1.style.cssText =
      "font-family:" + FONT_SCRIPT + ";color:" + TAGLINE_COLOR + ";text-align:center;" +
      "font-size:clamp(24px,3.2vw,46px);line-height:1.2;";
    const t2 = document.createElement("span");
    t2.textContent = SIGNATURE_TEXT;
    t2.style.cssText =
      "font-family:" + FONT_TITLE + ";color:" + SIGNATURE_COLOR + ";text-align:right;" +
      "font-size:clamp(11px,1.05vw,15px);letter-spacing:.22em;line-height:1.2;margin-top:4px;";
    this.cite.appendChild(t1);
    this.cite.appendChild(t2);
    this.txtWrap.appendChild(this.cite);
    this.appendChild(this.txtWrap);

    // les polices arrivent après : on recalcule la hauteur du texte quand elles sont prêtes
    const fl = document.getElementById("film-shelf-fonts");
    if (fl) fl.addEventListener("load", () => setTimeout(() => this.render(), 60));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.render());
    setTimeout(() => this.render(), 1200);
    setTimeout(() => this.render(), 3000);
    this.updateSrc();

    // Dans l'éditeur Wix, on n'active pas le blocage du scroll
    // (seulement si la page est dans un cadre ET vient de l'éditeur Wix)
    this.inEditor =
      window.self !== window.top &&
      (document.referrer || "").indexOf("editor.wix.com") !== -1;

    // Si la page est déjà scrollée (rechargement), on affiche directement la taille finale
    if (this.inEditor || window.scrollY > 5) {
      this.target = 1;
      this.current = 1;
    }

    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("touchstart", this.onTouchStart, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: false });
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize);

    requestAnimationFrame(() => this.render());
  }

  disconnectedCallback() {
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
  }

  attributeChangedCallback() {
    if (this.video) this.updateSrc();
  }

  updateBtn() {
    const muted = this.video.muted;
    this.btn.textContent = muted ? "🔇" : "🔊";
    this.btn.setAttribute("aria-label", muted ? "Activer le son" : "Couper le son");
  }

  updateSrc() {
    const url = this.getAttribute("video-url") || VIDEO_URL;
    if (url && this.video.getAttribute("src") !== url) {
      this.video.src = url;
      const p = this.video.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  // Fait avancer ou reculer l'animation. Renvoie true si le scroll doit être bloqué.
  push(delta) {
    if (this.inEditor) return false;
    if (window.scrollY > 1) return false;

    if (delta > 0 && this.target < 1) {
      this.setTarget(this.target + delta / SCROLL_DISTANCE);
      return true;
    }
    if (delta < 0 && this.target > 0) {
      // petite pause pour éviter de relancer l'effet par erreur quand on remonte vite
      if (this.target >= 1 && Date.now() - this.lastScroll < 250) return false;
      this.setTarget(this.target + delta / SCROLL_DISTANCE);
      return true;
    }
    return false;
  }

  onWheel(e) {
    if (e.ctrlKey) return;
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    if (this.push(d)) e.preventDefault();
  }

  onTouchStart(e) {
    this.touchY = e.touches[0].clientY;
  }

  onTouchMove(e) {
    if (this.touchY === null) return;
    const y = e.touches[0].clientY;
    const d = (this.touchY - y) * 1.3;
    this.touchY = y;
    if (this.push(d) && e.cancelable) e.preventDefault();
  }

  onKey(e) {
    const tag = (e.target && e.target.tagName) || "";
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    let d = 0;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") d = 200;
    else if (e.key === "ArrowUp" || e.key === "PageUp") d = -200;
    if (d && this.push(d)) e.preventDefault();
  }

  onScroll() {
    this.lastScroll = Date.now();
    // Sécurité : tant que l'animation n'est pas finie, on garde la page en haut
    if (!this.inEditor && this.target < 1 && window.scrollY > 1) {
      window.scrollTo(0, 0);
    }
  }

  onResize() {
    this.render();
  }

  setTarget(v) {
    this.target = clamp(v, 0, 1);
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(() => this.tick());
    }
  }

  tick() {
    this.current += (this.target - this.current) * SMOOTHING;
    if (Math.abs(this.target - this.current) < 0.001) this.current = this.target;
    this.render();
    if (this.current !== this.target) {
      requestAnimationFrame(() => this.tick());
    } else {
      this.running = false;
    }
  }

  // Place le bloc de texte sous la vidéo et le fait apparaître à la fin de la réduction
  renderTexts(p, textTop, vw, r, absolute) {
    if (!this.txtWrap) return;
    const a = clamp((p - TEXT_APPEAR_FROM) / (1 - TEXT_APPEAR_FROM), 0, 1);
    const e = a * a * (3 - 2 * a);
    const pos = absolute
      ? "position:absolute;left:" + -r.left + "px;top:" + textTop + "px;"
      : "position:fixed;z-index:2147482999;left:0;top:" + (r.top + textTop) + "px;";
    this.txtWrap.style.cssText =
      pos + "width:" + vw + "px;display:flex;justify-content:center;box-sizing:border-box;" +
      "padding:0 5vw;pointer-events:none;opacity:" + e + ";" +
      "visibility:" + (e > 0 ? "visible" : "hidden") + ";" +
      "transform:translateY(" + (1 - e) * 14 + "px);";
  }

  render() {
    if (!this.frame) return;
    const p = this.current;
    const f = this.frame;

    const r = this.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Hauteur du bloc de texte (phrase + signature), mesurée pour de vrai
    const tb = this.cite ? this.cite.offsetHeight : 0;
    const H = r.height;

    // Bas du bloc (vidéo + texte), dans l'élément : le bas de l'élément, mais jamais
    // plus bas que le bas de l'écran (sinon la vidéo sortirait de l'écran pendant la réduction)
    const hostTop = r.top + window.scrollY;                  // position de l'élément sur la page
    const visibleH = Math.max(260, vh - hostTop - SAFE_BOTTOM);
    const blockBottom = Math.min(H, visibleH);

    // Taille finale : la vidéo tient au-dessus du texte
    //  - largeur max : FINAL_SCALE de l'écran ; hauteur : ce qu'il reste au-dessus du texte
    const roomH = Math.max(120, blockBottom - tb - TEXT_GAP - TOP_PAD);
    const fh = Math.min((vw * FINAL_SCALE) / ASPECT, roomH);
    const fw = fh * ASPECT;
    const fl = (vw - fw) / 2;                    // centrée sur l'écran
    const relTop = blockBottom - tb - TEXT_GAP - fh;   // position de la vidéo dans l'élément
    const textTop = blockBottom - tb;                  // le texte colle sous la vidéo

    // Une fois réduite, la vidéo fait partie de la page (elle défile avec elle)
    if (p >= 1) {
      f.style.cssText =
        "position:absolute;overflow:hidden;background:#000;" +
        "left:" + (fl - r.left) + "px;" +
        "top:" + relTop + "px;" +
        "width:" + fw + "px;height:" + fh + "px;" +
        "border-radius:" + FINAL_RADIUS + "px;";
      this.renderTexts(p, textTop, vw, r, true);
      return;
    }

    // Pendant la réduction : la vidéo est fixée à l'écran et rejoint sa taille finale
    f.style.cssText =
      "position:fixed;z-index:2147483000;overflow:hidden;background:#000;" +
      "left:" + lerp(0, fl, p) + "px;" +
      "top:" + lerp(0, r.top + relTop, p) + "px;" +
      "width:" + lerp(vw, fw, p) + "px;" +
      "height:" + lerp(vh, fh, p) + "px;" +
      "border-radius:" + lerp(0, FINAL_RADIUS, p) + "px;";
    this.renderTexts(p, textTop, vw, r, false);
  }
}

if (!customElements.get("shrink-video")) {
  customElements.define("shrink-video", ShrinkVideo);
}
