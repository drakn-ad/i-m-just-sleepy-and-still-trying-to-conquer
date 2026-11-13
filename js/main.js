/* Renders the portfolio from data (via PortfolioAPI). No content lives in this file. */
(async function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [p, projects] = await Promise.all([PortfolioAPI.getProfile(), PortfolioAPI.getProjects()]);
  const c = p.contact, S = p.sections;

  /* ---------- SEO ---------- */
  document.title = p.site.title; document.documentElement.lang = p.site.lang || 'en';
  const meta = (sel, v) => { const m = $(sel); if (m && v) m.setAttribute('content', v); };
  meta('meta[name=description]', p.site.description); meta('meta[property="og:title"]', p.site.title);
  meta('meta[property="og:description"]', p.site.description); meta('meta[property="og:image"]', p.site.ogImage);
  if (p.site.url) { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); m.content = p.site.url; document.head.append(m); }

  /* ---------- helpers ---------- */
  const labels = { github: 'GitHub', linkedin: 'LinkedIn', codeforces: 'Codeforces', leetcode: 'LeetCode' };
  const links = [
    ...Object.entries(p.socials || {}).filter(([, u]) => u).map(([k, u]) => ({ label: labels[k] || k, url: u })),
    ...(p.otherLinks || []).filter(l => l && l.url)
  ];
  const ext = 'target="_blank" rel="noopener noreferrer"';
  const socialHTML = () => links.map(l => `<a class="chip" href="${esc(l.url)}" ${ext}>${esc(l.label)}</a>`).join('');
  const cvBtn = p.cv && p.cv.url ? `<a class="btn" href="${esc(p.cv.url)}" download="${esc(p.cv.fileName || '')}">${esc(p.cv.label || 'Download CV')}</a>` : '';
  const first = p.name.split(' ')[0], rest = p.name.split(' ').slice(1).join(' ');

  /* ---------- sections ---------- */
  const secs = [];
  const add = (id, label, html) => secs.push({ id, label, html });

  // Hero
  add('home', 'Home', `
  <section id="home" aria-labelledby="h1">
    <div class="hero-tx">
      <div class="status" style="--i:0">Available for new projects</div>
      <h1 id="h1" style="--i:1"><span>${esc(first)}</span><span>${esc(rest)}</span></h1>
      <div class="role" style="--i:2">${esc(p.title)}</div>
      <p class="lead" style="--i:3">${esc(p.tagline)} ${esc(p.heroDescription || '')}</p>
      <div class="cta" style="--i:4"><a class="btn pri" href="#contact">Start a project</a>${projects.length ? '<a class="btn" href="#projects">View projects</a>' : ''}${cvBtn}</div>
      <div class="chips" style="--i:5">${c.phone ? `<a class="chip" href="tel:${esc(c.phoneIntl || c.phone)}">${esc(c.phone)}</a>` : ''}${c.email ? `<a class="chip" href="mailto:${esc(c.email)}">Email</a>` : ''}${socialHTML()}</div>
    </div>
    <div class="stage" id="stage" aria-hidden="true">
      <div class="fl a" data-k="-26" style="--d:0s"><em>GET</em> /api/projects <em>200</em></div>
      <div class="fl b" data-k="30" style="--d:-2s">Backend → API → Mobile</div>
      <div class="fl c" data-k="-18" style="--d:-4s">{ "status": "ok" }</div>
      <div class="phone" id="phone"><div class="face"><div class="screen">
        <div class="sc-h">${esc(p.initials)} Studio</div><div class="sc-s">Today</div>
        <div class="sc-c" style="--i:0"><i></i><div style="flex:1"><b></b><u></u></div></div>
        <div class="sc-c" style="--i:1"><i></i><div style="flex:1"><b></b><u></u></div></div>
        <div class="sc-c" style="--i:2"><i></i><div style="flex:1"><b></b><u></u></div></div>
        <div class="sc-bar"><i></i><i></i><i></i><i></i></div>
      </div></div></div>
    </div>
  </section>`);

  // About
  if (S.about !== false && p.about) add('about', 'About', `
  <section id="about" aria-labelledby="about-h"><div class="about rv">
    ${p.image ? `<img class="avatar" src="${esc(p.image)}" alt="${esc(p.imageAlt || p.name)}" loading="lazy" width="180" height="180">` : ''}
    <div><h2 id="about-h">${esc(p.about.heading)}</h2>${(p.about.paragraphs || []).map(t => `<p>${esc(t)}</p>`).join('')}
    <div class="hl">${(p.about.highlights || []).map(h => `<div><b>${esc(h.value)}</b><span>${esc(h.label)}</span></div>`).join('')}</div></div>
  </div></section>`);

  // Skills
  const skills = (p.skills || []).filter(g => g.items && g.items.length);
  if (S.skills !== false && skills.length) add('skills', 'Skills', `
  <section id="skills" aria-labelledby="skills-h"><h2 id="skills-h" class="rv">Tools I build with</h2>
  <div class="grid">${skills.map((g, i) => `<div class="card rv" style="--i:${i}"><h3>${esc(g.category)}</h3><div class="chips">${g.items.map(t => `<span class="chip">${esc(typeof t === 'string' ? t : t.name)}</span>`).join('')}</div></div>`).join('')}</div></section>`);

  // Projects
  const card = (x, i) => {
    const tech = (x.technologies || []).map(t => `<span class="chip">${esc(t)}</span>`).join('');
    const btns = [x.github && `<a class="btn" href="${esc(x.github)}" ${ext} aria-label="${esc(x.name)} on GitHub">GitHub</a>`,
      x.liveDemo && `<a class="btn pri" href="${esc(x.liveDemo)}" ${ext}>Live demo</a>`,
      x.caseStudy && `<a class="btn" href="${esc(x.caseStudy)}" ${ext}>Case study</a>`,
      x.video && `<a class="btn" href="${esc(x.video)}" ${ext}>Watch demo</a>`].filter(Boolean).join('');
    return `<article class="pj ${x.featured ? 'big' : ''} rv" style="--i:${i}">
      <div class="pv">${x.image ? `<img src="${esc(x.image)}" alt="${esc(x.name)} preview" loading="lazy">` : `<div class="mini" aria-hidden="true"><b>${esc(x.name.slice(0, 11))}</b><i></i><i></i><i></i></div>`}</div>
      <div class="pb"><span class="cat">${esc(x.category || '')}</span><h3>${esc(x.name)}</h3>
      <p>${esc(x.shortDescription || (x.github ? 'Source code is available on GitHub.' : 'Details coming soon.'))}</p>
      ${tech ? `<div class="chips">${tech}</div>` : ''}${btns ? `<div class="cta">${btns}</div>` : ''}</div></article>`;
  };
  if (S.projects !== false && projects.length) add('projects', 'Projects', `
  <section id="projects" aria-labelledby="pj-h"><h2 id="pj-h" class="rv">Selected work</h2>
  <p class="hint">Scroll sideways to browse</p>
  <div class="track" tabindex="0" role="region" aria-label="Projects">${[...projects].sort((a, b) => (b.featured | 0) - (a.featured | 0)).map(card).join('')}</div></section>`);

  // Experience / education (optional groups)
  const groups = [['experience', 'Experience'], ['freelance', 'Freelance work'], ['education', 'Education'], ['certifications', 'Certifications'], ['achievements', 'Achievements'], ['openSource', 'Open source']]
    .filter(([k]) => (p[k] || []).length);
  if (S.journey !== false && groups.length) add('journey', 'Experience', `
  <section id="journey" aria-labelledby="j-h"><h2 id="j-h" class="rv">Background</h2><div class="tl">${groups.map(([k, t]) => `<div class="rv"><h3>${t}</h3>${p[k].map(it => `<div class="it"><b>${esc(it.title)}</b><span>${esc([it.org, it.period].filter(Boolean).join(', '))}</span>${it.description ? `<p>${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`).join('')}</div></section>`);

  // Services
  if (S.services !== false && (p.services || []).length) add('services', 'Services', `
  <section id="services" aria-labelledby="s-h"><h2 id="s-h" class="rv">What I can build for you</h2>
  <div class="grid">${p.services.map((s, i) => `<div class="card rv" style="--i:${i}"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></section>`);

  // Contact
  if (S.contact !== false) add('contact', 'Contact', `
  <section id="contact" aria-labelledby="c-h"><div class="ct">
    <div class="rv"><h2 id="c-h">${esc(c.headline)}</h2><p class="mu">${esc(c.text)}</p>
      <div class="info">${c.phone ? `<a href="tel:${esc(c.phoneIntl || c.phone)}"><small>Phone</small>${esc(c.phone)}</a>` : ''}${c.email ? `<a href="mailto:${esc(c.email)}"><small>Email</small>${esc(c.email)}</a>` : ''}${c.location ? `<div><small class="mu">Location</small>${esc(c.location)}</div>` : ''}</div>
      <div class="chips">${socialHTML()}</div></div>
    <form id="form" class="rv" style="--i:2" novalidate>
      <div class="row"><label>Name<input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
      <label>Subject<input name="subject" required></label>
      <label>Message<textarea name="message" required></textarea></label>
      <button class="btn pri" type="submit">Send message</button><div id="fmsg" role="status" aria-live="polite"></div>
    </form></div></section>`);

  $('#main').innerHTML = secs.map(s => s.html).join('');
  $('#logo').innerHTML = `${esc(p.initials[0])}<b>${esc(p.initials.slice(1))}</b>`;
  $('#links').innerHTML = secs.filter(s => s.id !== 'home').map(s => `<a href="#${s.id}">${s.label}</a>`).join('');
  $('#footer').innerHTML = `<span>© ${new Date().getFullYear()} ${esc(p.name)}</span><div class="chips">${socialHTML()}</div>`;

  /* ---------- form ---------- */
  const form = $('#form');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault(); const out = $('#fmsg'), d = Object.fromEntries(new FormData(form));
    if (!form.checkValidity()) { out.textContent = 'Please fill in every field with a valid email.'; return; }
    if (c.formEndpoint) {
      try { const r = await fetch(c.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) }); if (!r.ok) throw 0; form.reset(); out.textContent = 'Message sent. Thank you.'; }
      catch { out.textContent = `Could not send the message. Call ${c.phone} instead.`; }
    } else if (c.email) {
      location.href = `mailto:${c.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.message + '\n\n' + d.name + ' (' + d.email + ')')}`;
    } else out.textContent = `Online messaging is not set up yet. Please call ${c.phone}.`;
  });

  /* ---------- nav ---------- */
  const nav = $('#nav'), menu = $('#links'), burger = $('#burger');
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.onclick = () => setMenu(!menu.classList.contains('open'));
  menu.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 30), { passive: true });
  const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && menu.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id))), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section').forEach(s => spy.observe(s));

  /* ---------- reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(el => reduce ? el.classList.add('in') : rv.observe(el));

  /* ---------- cursor glow ---------- */
  const glow = $('#glow');
  if (!reduce) addEventListener('pointermove', e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });

  /* ---------- 3D phone (CSS transforms only, paused off-screen) ---------- */
  const stage = $('#stage'), ph = $('#phone'), fl = [...document.querySelectorAll('.fl')];
  if (!reduce && stage) {
    let mx = 0, my = 0, tx = 0, ty = 0, vis = false, run = false;
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    stage.addEventListener('pointerleave', () => { mx = my = 0; });
    const loop = t => {
      if (!vis) { run = false; return; }
      tx += (mx - tx) * .07; ty += (my - ty) * .07;
      ph.style.setProperty('--ry', (-14 + Math.sin(t / 2600) * 16 + tx * 34) + 'deg');
      ph.style.setProperty('--rx', (-ty * 22) + 'deg');
      ph.style.setProperty('--fy', Math.sin(t / 1200) * 8 + 'px');
      fl.forEach(f => f.style.transform = `translate(${tx * f.dataset.k}px,${ty * f.dataset.k}px)`);
      requestAnimationFrame(loop);
    };
    new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !run) { run = true; requestAnimationFrame(loop); } }).observe(stage);
  }

  const done = () => setTimeout(() => $('#loader').classList.add('done'), 350);
  document.readyState === 'complete' ? done() : addEventListener('load', done);
})();
