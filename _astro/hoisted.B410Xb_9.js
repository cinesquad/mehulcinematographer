document.documentElement.setAttribute("data-theme","dark");const n=document.getElementById("isoBtn"),u={64:"0.008",400:"0.045",800:"0.065",1600:"0.095",3200:"0.14"};function v(e){n&&(n.textContent=e);const s=u[e]||"0.008";document.documentElement.style.setProperty("--grain-opacity",s)}const p=localStorage.getItem("iso-level")||"64";v(p);n&&n.addEventListener("click",()=>{const e=Object.keys(u),r=(e.indexOf(n.textContent||"64")+1)%e.length,t=e[r];localStorage.setItem("iso-level",t),v(t)});const k=document.getElementById("mainNav");window.addEventListener("scroll",()=>k.classList.toggle("scrolled",window.scrollY>50),{passive:!0});const c=document.getElementById("burger"),a=document.getElementById("navDrawer");c.addEventListener("click",()=>{const e=a.classList.toggle("open");c.classList.toggle("open",e),document.body.style.overflow=e?"hidden":""});document.querySelectorAll(".drawer-link").forEach(e=>{e.addEventListener("click",()=>{a.classList.remove("open"),c.classList.remove("open"),document.body.style.overflow=""})});document.addEventListener("keydown",e=>{e.key==="Escape"&&(a.classList.remove("open"),c.classList.remove("open"),document.body.style.overflow="")});const y=document.querySelectorAll(".nav-links a, .drawer-link"),m=window.location.pathname;function d(){y.forEach(e=>e.classList.remove("active"))}if(m.includes("/portfolio")||m.includes("/video/"))d(),document.querySelectorAll('.nav-links a[href="/portfolio"], .drawer-link[href="/portfolio"]').forEach(e=>{e.classList.add("active")});else{const e=[{id:"about",linkHref:"/#about"},{id:"feedback-metrics",linkHref:"/#about"},{id:"contact",linkHref:"/#contact"}],s={root:null,rootMargin:"-30% 0px -60% 0px",threshold:0},r=new IntersectionObserver(t=>{t.forEach(o=>{if(o.isIntersecting){const f=o.target.id,i=e.find(l=>l.id===f);i&&(d(),document.querySelectorAll(`.nav-links a[href="${i.linkHref}"], .drawer-link[href="${i.linkHref}"]`).forEach(l=>{l.classList.add("active")}))}})},s);e.forEach(t=>{const o=document.getElementById(t.id);o&&r.observe(o)}),window.addEventListener("scroll",()=>{window.scrollY<200&&d()},{passive:!0})}

// Dynamic smooth scroll injection using Lenis
(function() {
  // Inject Lenis CSS
  const style = document.createElement("style");
  style.textContent = `
    html.lenis, html.lenis body {
      height: auto !important;
    }
    .lenis.lenis-smooth {
      scroll-behavior: auto !important;
    }
    .lenis.lenis-smooth [data-lenis-prevent] {
      overscroll-behavior: contain;
    }
    .lenis.lenis-stopped {
      overflow: hidden;
    }
    .lenis.lenis-scrolling iframe {
      pointer-events: none;
    }
    /* Override and disable CSS scroll snapping so Lenis controls smooth momentum scrolling */
    html {
      scroll-snap-type: none !important;
    }
    section.hero,
    section#clients,
    section#contact,
    section#about {
      scroll-snap-align: none !important;
      scroll-snap-stop: normal !important;
    }
  `;
  document.head.appendChild(style);

  // Load Lenis library
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Connect to requestAnimationFrame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for hash links on the same page
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const url = new URL(this.href);
        const currentUrl = new URL(window.location.href);
        
        if (url.pathname === currentUrl.pathname || 
            (url.pathname === '/' && currentUrl.pathname === '/index.html') || 
            (url.pathname === '/index.html' && currentUrl.pathname === '/')) {
          const hash = url.hash;
          const target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            // Close mobile drawer if it's open
            const drawer = document.getElementById("navDrawer");
            const burger = document.getElementById("burger");
            if (drawer && drawer.classList.contains("open")) {
              drawer.classList.remove("open");
              burger.classList.remove("open");
              document.body.style.overflow = "";
            }
            // Scroll to target with offset to account for sticky navbar (approx 80px)
            lenis.scrollTo(target, { offset: -80 });
          }
        }
      });
    });
  };
  document.head.appendChild(script);
})();

// Dynamic Services dropdown and Social Links injection for pages missing them
(function() {
  const navRight = document.querySelector("#mainNav .nav-right");
  if (!navRight) return;

  const navLinks = navRight.querySelector(".nav-links");

  // 1. Inject Services dropdown if missing
  if (navLinks && !navLinks.querySelector(".nav-dropdown")) {
    let prefix = "./";
    const path = window.location.pathname;
    const normalizedPath = path.replace(/^\//, "").replace(/\/$/, "");
    const segments = normalizedPath ? normalizedPath.split("/") : [];
    let depth = segments.length;
    if (segments.length > 0 && segments[segments.length - 1] === "index.html") {
      depth--;
    }
    if (depth === 1) {
      prefix = "../";
    } else if (depth >= 2) {
      prefix = "../../";
    }

    const li = document.createElement("li");
    li.className = "nav-dropdown";
    li.innerHTML = `
      <a href="${prefix}index.html#services" aria-haspopup="true">Services ▾</a>
      <ul class="nav-dropdown-menu">
        <li><a href="${prefix}music-videos/index.html">Music Videos</a></li>
        <li><a href="${prefix}advertising-films/index.html">Advertising Films</a></li>
        <li><a href="${prefix}industrial-corporate-films/index.html">Corporate Films</a></li>
      </ul>
    `;

    const workLi = navLinks.querySelector("li");
    if (workLi) {
      workLi.after(li);
    } else {
      navLinks.appendChild(li);
    }
  }

  // 2. Nav-socials are rendered server-side/build-time from site-config
})();

// Automatically set alt tags for YouTube thumbnails to improve accessibility (a11y)
(function() {
  document.querySelectorAll('img[src*="img.youtube.com"]').forEach(img => {
    if (!img.getAttribute('alt')) {
      const container = img.closest('.vid-card, .rec-card, .service-vid-card');
      const titleEl = container ? container.querySelector('.vid-name, .rec-name, .video-title') : null;
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      img.setAttribute('alt', titleText ? `Cinematography video thumbnail for ${titleText}` : "Cinematography work video thumbnail");
    }
  });
})();


// ──────────────────────────────────────────────────────────────
// Real film grain — per-frame regenerated noise on a full-screen canvas.
// Unlike the old CSS trick (one static SVG tile wiggling in place),
// this redraws a fresh random particle field every frame — the way
// actual film grain behaves.  Intensity + speck contrast both scale
// with the ISO button via --grain-opacity.
// ──────────────────────────────────────────────────────────────
(function () {
  var host = document.querySelector(".film-grain");
  if (!host) return;

  // --- canvas setup ---
  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Working resolution: viewport × DPR, capped so 4K stays affordable.
  var MAX_PX = 2600000; // ~2.6 Mpx
  var w = 0, h = 0;
  var off = document.createElement("canvas");
  var octx = off.getContext("2d");
  var imgData, px;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = Math.round(window.innerWidth * dpr);
    var ch = Math.round(window.innerHeight * dpr);
    if (cw * ch > MAX_PX) {
      var s = Math.sqrt(MAX_PX / (cw * ch));
      cw = Math.round(cw * s);
      ch = Math.round(ch * s);
    }
    w = cw;
    h = ch;
    canvas.width = w;
    canvas.height = h;
    off.width = w;
    off.height = h;
    imgData = octx.createImageData(w, h);
    px = imgData.data;
  }
  resize();
  window.addEventListener("resize", resize);

  // --- opacity (follows the ISO button) ---
  var rootStyle = getComputedStyle(document.documentElement);
  function grainOpacity() {
    var v = parseFloat(rootStyle.getPropertyValue("--grain-opacity"));
    return isNaN(v) ? 0.065 : v;
  }

  // --- noise render ---
  function renderNoise(opacity) {
    // amplitude grows with ISO so higher settings show harsher, more visible grain
    var amp = 24 + opacity * 280;
    var n = px.length;
    for (var i = 0; i < n; i += 4) {
      var g = 128 + (Math.random() * 2 - 1) * amp;
      px[i] = px[i + 1] = px[i + 2] = g;
      px[i + 3] = 255;
    }
    octx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0, w, h);
  }

  // --- reduced-motion: single static frame, no loop ---
  if (reducedMotion) {
    renderNoise(grainOpacity());
    return;
  }

  // --- animation loop: regenerate every other frame (~30 fps film cadence) ---
  var frame = 0;
  var cachedOpacity = grainOpacity();
  function tick() {
    if (frame % 2 === 0) {
      if (frame % 32 === 0) cachedOpacity = grainOpacity(); // re-read ISO occasionally
      renderNoise(cachedOpacity);
    }
    frame++;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


