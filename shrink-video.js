// shrink-video.js
// Élément personnalisé Wix : la vidéo démarre en plein écran, rétrécit pendant
// que la page est bloquée, puis la page se met à défiler normalement.

// ====== À MODIFIER ======
const VIDEO_URL = "https://video.wixstatic.com/video/c2054d_f287c70e838842178e66c4b2183b10fb/1080p/mp4/file.mp4"; // si ça ne marche pas, remplace 1080p par 720p
const POSTER_URL = "https://static.wixstatic.com/media/c2054d_f287c70e838842178e66c4b2183b10fbf001.jpg"; // image affichée avant le chargement de la vidéo
const FINAL_SCALE = 0.6;      // taille finale de la vidéo : 0.6 = 60 % de l'écran (centrée)
const SCROLL_DISTANCE = 700;  // plus grand = réduction plus lente (en pixels de molette)
const FINAL_RADIUS = 16;      // coins arrondis à la taille finale (0 = coins carrés)
const SMOOTHING = 0.14;       // fluidité (0.05 = très doux, 0.3 = très réactif)
// ========================

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
    this.appendChild(this.frame);
    this.updateSrc();

    // Dans l'éditeur Wix, on n'active pas le blocage du scroll
    this.inEditor = (document.referrer || "").indexOf("editor.wix.com") !== -1;

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

  render() {
    if (!this.frame) return;
    const p = this.current;
    const f = this.frame;

    const r = this.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Taille finale : FINAL_SCALE de l'écran, centrée au milieu de l'écran
    const fw = vw * FINAL_SCALE;
    const fh = vh * FINAL_SCALE;
    const fl = (vw - fw) / 2;
    const ft = (vh - fh) / 2;

    // Une fois réduite, la vidéo fait partie de la page (elle défile avec elle)
    if (p >= 1) {
      const hostTop = r.top + window.scrollY; // position de l'élément sur la page
      f.style.cssText =
        "position:absolute;overflow:hidden;background:#000;" +
        "left:" + (fl - r.left) + "px;" +
        "top:" + (ft - hostTop) + "px;" +
        "width:" + fw + "px;height:" + fh + "px;" +
        "border-radius:" + FINAL_RADIUS + "px;";
      return;
    }

    // Pendant la réduction : la vidéo est fixée à l'écran et rejoint sa taille finale
    f.style.cssText =
      "position:fixed;z-index:2147483000;overflow:hidden;background:#000;" +
      "left:" + lerp(0, fl, p) + "px;" +
      "top:" + lerp(0, ft, p) + "px;" +
      "width:" + lerp(vw, fw, p) + "px;" +
      "height:" + lerp(vh, fh, p) + "px;" +
      "border-radius:" + lerp(0, FINAL_RADIUS, p) + "px;";
  }
}

if (!customElements.get("shrink-video")) {
  customElements.define("shrink-video", ShrinkVideo);
}
