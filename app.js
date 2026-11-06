/* Al Massieh — proposal 2. Content comes from data/site.json. */
(async function () {
  const ROOT = '';
  const params = new URLSearchParams(location.search);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGsap && !reduceMotion;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- copy specific to this design ---------- */
  const V2 = {
    ar: {
      'v2.menu': 'القائمة',
      'v2.word': 'الماسية',
      'v2.hero1': 'نصقل العقار',
      'v2.hero2': 'كما يُصقل الماس',
      'v2.heroText': 'مشاريع سكنية وتجارية في عمّان، تُصمَّم بدقة الجوهري وتُبنى لتدوم.',
      'v2.scroll': 'مرّر للاستكشاف',
      'v2.statement': 'لا نبني جدراناً فحسب. نصقل كل مشروع كما يُصقل الماس: دقة في التصميم، ونقاء في التفاصيل، وجودة في التنفيذ، لنمنحك قيمة تبقى لأجيال.',
      'v2.featured': 'مشروع مختار',
      'v2.collection': 'المجموعة',
      'v2.explore': 'استكشف',
      'v2.marquee': 'فخامة|دقة|نقاء|ثقة|قيمة تدوم',
      'v2.pillarsTitle': 'أربعة أوجه للجودة',
      'v2.contact1': 'لنصنع',
      'v2.contact2': 'شيئاً استثنائياً',
      'v2.view': 'عرض',
      'v2.drag': 'اسحب',
      'v2.dragHint': 'اسحب لاستعراض الصور',
      'v2.next': 'المشروع التالي',
      'v2.visit': 'احجز زيارة خاصة',
    },
    en: {
      'v2.menu': 'Menu',
      'v2.word': 'ALMASSIEH',
      'v2.hero1': 'Real estate,',
      'v2.hero2': 'cut like a diamond',
      'v2.heroText': 'Residential and commercial projects in Amman, designed with a jeweller’s precision and built to last.',
      'v2.scroll': 'Scroll to explore',
      'v2.statement': 'We don’t just build walls. We cut every project the way a diamond is cut: precise in design, pure in detail, flawless in execution, so its value lasts for generations.',
      'v2.featured': 'Featured project',
      'v2.collection': 'The Collection',
      'v2.explore': 'Explore',
      'v2.marquee': 'Luxury|Precision|Purity|Trust|Lasting value',
      'v2.pillarsTitle': 'Four facets of quality',
      'v2.contact1': 'Let’s create',
      'v2.contact2': 'something rare',
      'v2.view': 'View',
      'v2.drag': 'Drag',
      'v2.dragHint': 'Drag to browse the images',
      'v2.next': 'Next project',
      'v2.visit': 'Book a private visit',
    },
  };

  let lang = params.get('lang');
  try { lang = lang || localStorage.getItem('lang'); } catch (e) { /* storage unavailable */ }
  if (!I18N[lang]) lang = 'ar';
  const t = (k) => V2[lang][k] || I18N[lang][k] || k;
  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const L = (o) => esc(o ? o[lang] : '');
  const src = (p) => ROOT + p;
  const pad = (n) => String(n).padStart(2, '0');

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));

  document.querySelectorAll('.lang-toggle').forEach((b) =>
    b.addEventListener('click', () => {
      const next = lang === 'ar' ? 'en' : 'ar';
      try { localStorage.setItem('lang', next); } catch (e) { /* ignore */ }
      const u = new URL(location.href);
      u.searchParams.delete('lang');
      location.href = u.toString();
    })
  );

  /* ---------- data ---------- */
  let CONFIG = { social: {} };
  let PROJECTS = [];
  try {
    const data = await (await fetch(ROOT + 'data/site.json', { cache: 'no-store' })).json();
    CONFIG = data.settings || CONFIG;
    PROJECTS = (data.projects || []).filter((p) => p.visible !== false && p.images && p.images.length);
  } catch (e) {
    console.error('Could not load site data', e);
  }
  const waLink = (text) =>
    CONFIG.whatsapp ? `https://wa.me/${String(CONFIG.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : '';

  /* ---------- shared pieces ---------- */
  function renderShared() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const rows = [];
    if (CONFIG.phone) rows.push(['contact.phone', `<a href="tel:${esc(CONFIG.phone.replace(/\s/g, ''))}" dir="ltr">${esc(CONFIG.phone)}</a>`]);
    if (CONFIG.email) rows.push(['contact.email', `<a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>`]);
    if (L(CONFIG.address)) rows.push(['contact.address', L(CONFIG.address)]);
    const info = document.getElementById('contact-info');
    if (info) info.innerHTML = rows.map(([k, v]) => `<div class="ci-row"><span>${t(k)}</span><strong>${v}</strong></div>`).join('');
    const foot = document.getElementById('om-foot');
    if (foot) foot.innerHTML = rows.map(([, v]) => `<span>${v}</span>`).join('');

    const icons = {
      facebook: '<path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>',
      linkedin: '<path d="M4 9h4v12H4zM6 3a2 2 0 110 4 2 2 0 010-4zM10 9h4v1.7c.6-1 1.9-2 3.8-2 4 0 4.2 2.6 4.2 6V21h-4v-5.6c0-1.4 0-3.1-2-3.1s-2.2 1.5-2.2 3V21h-4z"/>',
    };
    const social = document.getElementById('social');
    if (social) {
      social.innerHTML = Object.entries(CONFIG.social || {})
        .filter(([k, u]) => icons[k] && /^https?:\/\//.test(u || ''))
        .map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24" fill="currentColor">${icons[k]}</svg></a>`)
        .join('');
    }

    const fab = document.querySelector('.wa-fab');
    const link = waLink(t('form.msg.intro'));
    if (fab && link) { fab.href = link; fab.hidden = false; }

    // Overlay menu: hovering a link swaps the faceted image.
    const covers = PROJECTS.map((p) => src(p.images[0].src));
    const omImg = document.getElementById('om-img');
    if (omImg && covers.length) {
      omImg.style.backgroundImage = `url('${covers[0]}')`;
      document.querySelectorAll('.om-links a').forEach((a, i) => {
        a.style.setProperty('--i', i);
        a.addEventListener('mouseenter', () => {
          omImg.style.backgroundImage = `url('${covers[(+a.dataset.img) % covers.length]}')`;
        });
      });
    }
  }

  /* ---------- menu ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.querySelector('.overlay-menu').setAttribute('aria-hidden', String(!open));
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.om-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const label = cursor.querySelector('.cursor-label');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-cursor]');
      cursor.classList.toggle('big', !!el);
      label.textContent = el ? el.dataset.cursor : '';
    });
  }

  /* ---------- the diamond ---------- */
  function Gem(canvas, { size = 1, speed = 1 } = {}) {
    const ctx = canvas.getContext('2d');
    const V = [];
    const E = [];
    const add = (x, y, z) => V.push([x, y, z]) - 1;
    const ring = (n, r, y, off = 0) => Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + off;
      return add(Math.cos(a) * r, y, Math.sin(a) * r);
    });
    const table = ring(8, 0.52, -0.46);
    const star = ring(8, 0.8, -0.3, Math.PI / 8);
    const girdle = ring(16, 1, -0.1);
    const pav = ring(8, 0.42, 0.52);
    const culet = add(0, 1.08, 0);
    const link = (a, b) => E.push([a, b]);
    for (let i = 0; i < 8; i++) {
      link(table[i], table[(i + 1) % 8]);
      link(table[i], star[i]);
      link(table[(i + 1) % 8], star[i]);
      link(star[i], girdle[2 * i + 1]);
      link(star[i], girdle[(2 * i + 2) % 16]);
      link(table[i], girdle[2 * i]);
      link(girdle[2 * i], pav[i]);
      link(pav[i], culet);
      link(girdle[2 * i + 1], pav[i]);
      link(girdle[(2 * i + 2) % 16], pav[i]);
    }
    for (let i = 0; i < 16; i++) link(girdle[i], girdle[(i + 1) % 16]);

    let w = 0, h = 0, dpr = 1;
    let rot = 0, tilt = 0.32, tTilt = 0.32, tYaw = 0, yaw = 0, boost = 0;
    const sparks = [];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
    };
    resize();
    new ResizeObserver(resize).observe(canvas);
    addEventListener('mousemove', (e) => {
      tTilt = 0.32 + (e.clientY / innerHeight - 0.5) * 0.5;
      tYaw = (e.clientX / innerWidth - 0.5) * 0.8;
    });
    addEventListener('scroll', () => { boost = Math.min(boost + 0.02, 0.12); }, { passive: true });

    function project([x, y, z]) {
      const cy = Math.cos(rot + yaw), sy = Math.sin(rot + yaw);
      let X = x * cy - z * sy, Z = x * sy + z * cy;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const Y = y * ct - Z * st;
      Z = y * st + Z * ct;
      const s = (Math.min(w, h) * 0.36 * size) / (1 + Z * 0.28);
      return [w / 2 + X * s, h / 2 + Y * s, Z];
    }

    function frame() {
      rot += 0.0035 * speed + boost;
      boost *= 0.92;
      tilt += (tTilt - tilt) * 0.04;
      yaw += (tYaw - yaw) * 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.45);
      glow.addColorStop(0, 'rgba(0,167,178,0.16)');
      glow.addColorStop(1, 'rgba(0,167,178,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const P = V.map(project);
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(0,200,210,0.9)';
      for (const [a, b] of E) {
        const pa = P[a], pb = P[b];
        const depth = (pa[2] + pb[2]) / 2; // -1 front .. 1 back
        const front = Math.max(0, Math.min(1, 0.5 - depth * 0.6));
        ctx.globalAlpha = 0.18 + front * 0.82;
        ctx.lineWidth = 0.6 + front * 0.9;
        ctx.shadowBlur = 4 + front * 10;
        ctx.strokeStyle = front > 0.6 ? '#d9fbfd' : '#2bc2cc';
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Glints on front-facing vertices.
      if (Math.random() < 0.06) sparks.push({ v: (Math.random() * V.length) | 0, life: 1 });
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const p = P[s.v];
        s.life -= 0.025;
        if (s.life <= 0 || p[2] > 0.2) { sparks.splice(i, 1); continue; }
        const r = 10 * Math.sin(s.life * Math.PI);
        ctx.globalAlpha = s.life;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]);
        ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- preloader ---------- */
  function runLoader() {
    return new Promise((resolve) => {
      const loader = document.querySelector('.loader');
      let seen = false;
      try { seen = sessionStorage.getItem('v2-seen') === '1'; sessionStorage.setItem('v2-seen', '1'); } catch (e) { /* ignore */ }
      let finished = false;
      // instant: used when animation frames are paused (e.g. page opened in a background tab).
      const finish = (instant) => {
        if (finished) return;
        finished = true;
        document.body.classList.remove('is-loading');
        loader.classList.add('done');
        if (animate && !instant) {
          gsap.timeline({ onComplete: () => loader.remove() })
            .to('.loader-curtain', { scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
            .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' });
          setTimeout(resolve, 900);
        } else {
          loader.remove();
          resolve();
        }
      };
      if (!animate) return finish(true);
      setTimeout(() => finish(true), seen ? 2500 : 4500);
      const num = document.getElementById('loader-num');
      const counter = { v: 0 };
      gsap.to(counter, {
        v: 100, duration: seen ? 0.5 : 2, ease: 'power2.inOut',
        onUpdate: () => (num.textContent = Math.round(counter.v)),
        onComplete: () => finish(false),
      });
    });
  }

  /* ---------- home page ---------- */
  function renderHome() {
    const select = document.getElementById('f-project');
    if (!select) return false;
    select.innerHTML = `<option value="">${t('form.project.any')}</option>` +
      PROJECTS.map((p) => `<option value="${esc(p.id)}">${L(p.name)}</option>`).join('');

    document.getElementById('statement-text').innerHTML = t('v2.statement')
      .split(' ')
      .map((w) => `<span class="w">${esc(w)}</span>`)
      .join(' ');

    const featured = PROJECTS[0];
    if (featured) {
      document.getElementById('reveal-img').src = src(featured.images[0].src);
      document.getElementById('reveal-name').innerHTML = L(featured.name);
    } else {
      document.querySelector('.reveal').remove();
    }

    document.getElementById('h-track').innerHTML = PROJECTS.map((p, i) => `
      <a class="panel" href="project.html?p=${encodeURIComponent(p.id)}" data-cursor="${t('v2.explore')}">
        <div class="panel-media"><img src="${src(p.images[0].src)}" alt="${L(p.name)}" loading="${i < 2 ? 'eager' : 'lazy'}"></div>
        <div class="panel-meta">
          <span class="panel-n">${pad(i + 1)}</span>
          <div><h3>${L(p.name)}</h3><p>${L(p.type)}${L(p.units) ? ' · ' + L(p.units) : ''}${L(p.location) ? ' · ' + L(p.location) : ''}</p></div>
          <span class="panel-go"><span>←</span></span>
        </div>
      </a>`).join('');

    const words = t('v2.marquee').split('|').map((w) => `<span>${esc(w)}</span>`).join('');
    document.getElementById('marquee').innerHTML = words + words + words + words;

    document.querySelectorAll('.facet').forEach((f) =>
      f.addEventListener('mousemove', (e) => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--mx', `${e.clientX - r.left}px`);
        f.style.setProperty('--my', `${e.clientY - r.top}px`);
      })
    );

    document.getElementById('contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const proj = PROJECTS.find((p) => p.id === fd.get('project'));
      const text = [
        t('form.msg.intro') + (proj ? ` — ${proj.name[lang]}` : ''),
        `${t('form.name')}: ${fd.get('name')}`,
        `${t('form.phone')}: ${fd.get('phone')}`,
        fd.get('message') ? `${t('form.message')}: ${fd.get('message')}` : '',
      ].filter(Boolean).join('\n');
      const note = document.getElementById('form-note');
      if (CONFIG.whatsapp) window.open(waLink(text), '_blank', 'noopener');
      else if (CONFIG.email) location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(t('form.msg.intro'))}&body=${encodeURIComponent(text)}`;
      else { note.textContent = t('form.pending'); note.hidden = false; }
    });

    Gem(document.getElementById('gem'), { size: 1 });
    return true;
  }

  function animateHome() {
    if (!animate) {
      document.querySelector('.h-wrap').style.overflowX = 'auto';
      return;
    }
    const rtl = lang === 'ar';

    gsap.from('.hero-title .line > *', { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.12 });
    gsap.from('.gem', { scale: 0.6, opacity: 0, duration: 1.8, ease: 'power3.out' });
    gsap.from('.hero-word', { opacity: 0, letterSpacing: '0.2em', duration: 2, ease: 'power3.out' });
    gsap.from(['.hero-side > *', '.hero-copy .eyebrow', '.scroll-hint', '.hdr'], { opacity: 0, y: 20, duration: 1, delay: 0.5, stagger: 0.1 });

    // Scroll effects target wrappers so they don't fight the intro tweens above.
    gsap.to('.gem-wrap', { scale: 1.6, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy, .hero-side', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true } });

    gsap.to('.statement-text .w', {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 60%', scrub: true },
    });

    if (document.querySelector('.reveal')) {
      gsap.timeline({ scrollTrigger: { trigger: '.reveal', start: 'top top', end: 'bottom bottom', scrub: true } })
        .to('.reveal-frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
        .to('.reveal-frame img', { scale: 1, ease: 'none' }, 0)
        .from('.reveal-caption', { y: 80, opacity: 0, ease: 'none' }, 0.5);
    }

    gsap.from('.collection-head .display', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.collection', start: 'top 75%' } });

    ScrollTrigger.matchMedia({
      '(min-width: 901px)': () => {
        const track = document.getElementById('h-track');
        const distance = () => Math.max(0, track.scrollWidth - innerWidth);
        const tween = gsap.to(track, {
          x: () => (rtl ? 1 : -1) * distance(), ease: 'none',
          scrollTrigger: { trigger: '.collection', start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        track.querySelectorAll('.panel-media img').forEach((img) =>
          gsap.fromTo(img, { xPercent: rtl ? 8 : -8 }, {
            xPercent: rtl ? -8 : 8, ease: 'none',
            scrollTrigger: { trigger: img.closest('.panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          })
        );
      },
      '(max-width: 900px)': () => {
        gsap.utils.toArray('.panel').forEach((p) =>
          gsap.from(p, { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%' } })
        );
      },
    });

    gsap.from('.facet', { y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.facets', start: 'top 80%' } });
    gsap.from('.pillars-head .display', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', stagger: 0.2, scrollTrigger: { trigger: '.pillars-head', start: 'top 80%' } });
    gsap.from('.contact-big > *, .contact-form > *', { y: 40, opacity: 0, duration: 1, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
    gsap.from('.ftr-word', { yPercent: 50, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.ftr', start: 'top 95%' } });

    // Anchor links scroll smoothly even across the pinned section.
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + scrollY;
        scrollTo({ top, behavior: 'smooth' });
      })
    );
  }

  /* ---------- project page ---------- */
  let lbItems = [];
  let lbIndex = 0;
  function renderProject() {
    const root = document.getElementById('project-page');
    if (!root) return false;
    const idx = Math.max(0, PROJECTS.findIndex((x) => x.id === params.get('p')));
    const p = PROJECTS[idx];
    if (!p) { root.innerHTML = ''; return true; }
    const next = PROJECTS[(idx + 1) % PROJECTS.length];
    document.title = `${p.name[lang]} | ${t('meta.title')}`;
    const enquiry = waLink(`${t('form.msg.intro')} — ${p.name[lang]}`) || 'index.html#contact';
    const ext = CONFIG.whatsapp ? 'target="_blank" rel="noopener"' : '';
    const facts = [
      ['project.type', L(p.type)],
      ['project.units', L(p.units)],
      ['project.location', L(p.location)],
    ].filter(([, v]) => v);
    const features = (p.features && p.features[lang]) || [];
    const strip = (list, label) => list.map((im, i) => `
      <button class="strip-item" data-src="${src(im.src)}" data-cursor="${t('v2.view')}">
        <img src="${src(im.sm || im.src)}" alt="${esc(label)} ${i + 1}" loading="lazy" draggable="false"><span class="n">${pad(i + 1)}</span>
      </button>`).join('');

    root.innerHTML = `
      <section class="p-hero">
        <div class="p-hero-img"><img src="${src(p.images[0].src)}" alt=""></div>
        <div class="p-hero-copy">
          <a class="p-back" href="index.html#collection">← ${t('project.back')}</a>
          <p class="eyebrow light">${L(p.type)}</p>
          <h1><span>${L(p.name)}</span></h1>
          <div class="p-facts">${facts.map(([k, v]) => `<div><span>${t(k)}</span><strong>${v}</strong></div>`).join('')}</div>
        </div>
      </section>

      <section class="p-story">
        <div class="p-story-side"><p class="eyebrow">${t('project.about')}</p></div>
        <div>
          <p class="p-lead">${L(p.description) || L(p.summary)}</p>
          ${features.length ? `<ul class="p-features">${features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        </div>
      </section>

      <section class="strip-section">
        <div class="strip-head"><p class="eyebrow">${t('project.gallery')}</p><span class="strip-hint">${t('v2.dragHint')}</span></div>
        <div class="strip" data-cursor="${t('v2.drag')}">${strip(p.images, p.name[lang])}</div>
      </section>

      ${p.plans && p.plans.length ? `
      <section class="strip-section">
        <div class="strip-head"><p class="eyebrow">${t('project.plans')}</p></div>
        <div class="strip">${strip(p.plans, t('project.plans'))}</div>
      </section>` : ''}

      ${p.map ? `
      <section class="p-map">
        <p class="eyebrow">${t('project.map')}</p>
        <iframe src="https://www.google.com/maps?q=${encodeURIComponent(p.map)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${t('project.map')}"></iframe>
      </section>` : ''}

      <section class="p-cta">
        <canvas id="cta-gem" aria-hidden="true"></canvas>
        <p class="eyebrow">${t('project.cta.title')}</p>
        <h2 class="display">${t('v2.visit')}</h2>
        <p>${t('project.cta.text')}</p>
        <a class="btn-gem" href="${enquiry}" ${ext} data-cursor="→"><span>${t('project.cta.btn')}</span></a>
      </section>

      ${next && next !== p ? `
      <a class="p-next" href="project.html?p=${encodeURIComponent(next.id)}" data-cursor="${t('v2.explore')}">
        <img src="${src(next.images[0].src)}" alt="" loading="lazy">
        <div class="p-next-copy"><p class="eyebrow light">${t('v2.next')}</p><h2>${L(next.name)}</h2></div>
      </a>` : ''}`;

    Gem(document.getElementById('cta-gem'), { size: 0.9, speed: 0.6 });

    // Drag-to-scroll strips; a click without dragging opens the lightbox.
    root.querySelectorAll('.strip').forEach((el) => {
      let down = false, moved = false, startX = 0, startScroll = 0;
      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        down = true; moved = false; startX = e.clientX; startScroll = el.scrollLeft;
      });
      addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) { moved = true; el.classList.add('dragging'); }
        el.scrollLeft = startScroll - dx;
      });
      addEventListener('pointerup', () => { down = false; el.classList.remove('dragging'); });
      el.querySelectorAll('.strip-item').forEach((b) =>
        b.addEventListener('click', () => {
          if (moved) return;
          lbItems = [...el.querySelectorAll('.strip-item')].map((x) => x.dataset.src);
          lbIndex = lbItems.indexOf(b.dataset.src);
          showLb();
        })
      );
    });
    return true;
  }

  const lb = document.getElementById('lightbox');
  function showLb() {
    lb.querySelector('img').src = lbItems[lbIndex];
    document.getElementById('lb-count').textContent = `${pad(lbIndex + 1)} / ${pad(lbItems.length)}`;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  if (lb) {
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
    const step = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; showLb(); };
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function animateProject() {
    if (!animate) return;
    gsap.from('.p-hero-copy h1 span', { yPercent: 110, duration: 1.4, ease: 'power4.out' });
    gsap.from('.p-hero-copy .eyebrow, .p-back, .p-facts > div', { y: 30, opacity: 0, duration: 1, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
    gsap.to('.p-hero-img img', { scale: 1, duration: 2.4, ease: 'power3.out' });
    gsap.to('.p-hero-img', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.p-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.p-lead', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.p-story', start: 'top 75%' } });
    gsap.from('.p-features li', { x: lang === 'ar' ? -40 : 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.p-features', start: 'top 85%' } });
    gsap.utils.toArray('.strip').forEach((s) =>
      gsap.from(s.children, { x: lang === 'ar' ? -120 : 120, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%' } })
    );
    gsap.from('.p-cta .display', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.p-cta', start: 'top 75%' } });
  }

  /* ---------- start ---------- */
  renderShared();
  const isHome = renderHome();
  const isProject = renderProject();
  await runLoader();
  if (isHome) animateHome();
  if (isProject) animateProject();
  if (hasGsap) ScrollTrigger.refresh();
})();
