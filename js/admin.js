/* Local admin: edits projects/profile, stores them in localStorage, exports data/*.js files. */
(function () {
  const $ = s => document.querySelector(s), K = PortfolioAPI.KEYS;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
  let projects = read(K.projects, JSON.parse(JSON.stringify(window.PORTFOLIO.projects)));
  let over = read(K.profile, {});
  const save = () => { try { localStorage.setItem(K.projects, JSON.stringify(projects)); localStorage.setItem(K.profile, JSON.stringify(over)); } catch { alert('Browser storage is full. Remove a few images or export and reset.'); } };

  /* image -> resized webp data URL */
  const toData = (f, max = 1000) => new Promise(res => {
    const r = new FileReader();
    r.onload = () => { const i = new Image(); i.onload = () => { const s = Math.min(1, max / i.width), c = document.createElement('canvas'); c.width = i.width * s; c.height = i.height * s; c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL('image/webp', .82)); }; i.src = r.result; };
    r.readAsDataURL(f);
  });
  const download = (name, text) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/javascript' })); a.download = name; a.click(); URL.revokeObjectURL(a.href); };

  /* tabs */
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
    document.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === b));
    $('#tab-projects').hidden = b.dataset.t !== 'projects'; $('#tab-profile').hidden = b.dataset.t !== 'profile';
  });

  /* project list */
  const render = () => {
    projects.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    $('#list').innerHTML = projects.length ? projects.map((p, i) => `
      <div class="item ${p.visible === false ? 'off' : ''}">
        ${p.image ? `<img src="${esc(p.image)}" alt="">` : '<div class="ph"></div>'}
        <div><h3>${esc(p.name)}${p.featured ? ' ★' : ''}</h3><small>${esc(p.category || '')} ${p.visible === false ? '(hidden)' : ''}</small></div>
        <div class="acts" data-id="${esc(p.id)}">
          <button class="btn" data-a="up" ${i ? '' : 'disabled'} aria-label="Move up">↑</button><button class="btn" data-a="down" ${i < projects.length - 1 ? '' : 'disabled'} aria-label="Move down">↓</button>
          <button class="btn" data-a="edit">Edit</button><button class="btn" data-a="vis">${p.visible === false ? 'Show' : 'Hide'}</button>
          <button class="btn" data-a="feat">${p.featured ? 'Unfeature' : 'Feature'}</button><button class="btn" data-a="del">Delete</button>
        </div></div>`).join('') : '<p class="mu" style="margin-top:1rem">No projects yet. Click “New project”.</p>';
  };
  const reindex = () => projects.forEach((p, i) => p.order = i + 1);
  $('#list').onclick = e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const id = b.parentElement.dataset.id, i = projects.findIndex(p => p.id === id), p = projects[i];
    switch (b.dataset.a) {
      case 'up': if (i > 0) { [projects[i - 1], projects[i]] = [projects[i], projects[i - 1]]; reindex(); } break;
      case 'down': if (i < projects.length - 1) { [projects[i + 1], projects[i]] = [projects[i], projects[i + 1]]; reindex(); } break;
      case 'vis': p.visible = p.visible === false; break;
      case 'feat': p.featured = !p.featured; break;
      case 'del': if (confirm(`Delete "${p.name}"?`)) { projects.splice(i, 1); reindex(); } break;
      case 'edit': return openEditor(p);
    }
    save(); render();
  };

  /* editor */
  const dlg = $('#dlg'), f = $('#pj'); let cur = null;
  const paintImgs = () => {
    $('#imgprev').hidden = !cur.image; if (cur.image) $('#imgprev').src = cur.image;
    $('#thumbs').innerHTML = (cur.screenshots || []).map((s, i) => `<img src="${esc(s)}" data-i="${i}" alt="Screenshot ${i + 1}, click to remove" tabindex="0">`).join('');
  };
  const openEditor = p => {
    cur = p ? { ...p, screenshots: [...(p.screenshots || [])] } : { id: null, image: null, screenshots: [], visible: true, featured: false };
    $('#dt').textContent = p ? 'Edit project' : 'New project';
    for (const k of ['name', 'category', 'date', 'shortDescription', 'fullDescription', 'github', 'liveDemo', 'caseStudy', 'video']) f.elements[k].value = cur[k] || '';
    f.elements.technologies.value = (cur.technologies || []).join(', ');
    f.elements.featured.checked = !!cur.featured; f.elements.visible.checked = cur.visible !== false;
    $('#img').value = ''; $('#shots').value = ''; paintImgs(); dlg.showModal();
  };
  $('#add').onclick = () => openEditor(null);
  $('#cancel').onclick = () => dlg.close();
  $('#img').onchange = async e => { if (e.target.files[0]) { cur.image = await toData(e.target.files[0]); paintImgs(); } };
  $('#shots').onchange = async e => { for (const file of e.target.files) cur.screenshots.push(await toData(file, 1200)); paintImgs(); };
  $('#thumbs').onclick = e => { const i = e.target.dataset.i; if (i !== undefined) { cur.screenshots.splice(+i, 1); paintImgs(); } };
  f.onsubmit = () => {
    const v = n => f.elements[n].value.trim() || null;
    const p = { ...cur, name: v('name'), category: v('category'), date: v('date'), shortDescription: f.elements.shortDescription.value.trim(), fullDescription: f.elements.fullDescription.value.trim(),
      technologies: f.elements.technologies.value.split(',').map(s => s.trim()).filter(Boolean),
      github: v('github'), liveDemo: v('liveDemo'), caseStudy: v('caseStudy'), video: v('video'),
      featured: f.elements.featured.checked, visible: f.elements.visible.checked };
    if (p.id) projects[projects.findIndex(x => x.id === p.id)] = p;
    else { p.id = (p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project') + '-' + Date.now().toString(36); p.order = projects.length + 1; projects.push(p); }
    save(); render();
  };

  /* profile */
  const FIELDS = [
    ['Basics', [['name', 'Name'], ['title', 'Job title'], ['tagline', 'Tagline'], ['heroDescription', 'Hero description']]],
    ['About', [['about.heading', 'About heading'], ['about.paragraphs', 'About text (separate paragraphs with a blank line)', 'lines']]],
    ['Contact', [['contact.phone', 'Phone'], ['contact.email', 'Email'], ['contact.location', 'Location'], ['contact.formEndpoint', 'Contact form endpoint URL']]],
    ['Social links (empty = hidden)', [['socials.github', 'GitHub'], ['socials.linkedin', 'LinkedIn'], ['socials.codeforces', 'Codeforces'], ['socials.leetcode', 'LeetCode']]],
    ['Skills (comma separated, empty = hidden)', ['Programming', 'Backend', 'Mobile Development', 'Databases', 'Tools', 'Other Technologies'].map(c => ['skill:' + c, c, 'skill'])]
  ];
  const merged = () => PortfolioAPI.mergeProfile(over);
  const getP = (o, path) => path.split('.').reduce((a, k) => a && a[k], o);
  const setP = (o, path, val) => { const ks = path.split('.'); ks.slice(0, -1).reduce((a, k) => a[k] = a[k] || {}, o)[ks.at(-1)] = val; };
  const fieldVal = (path, type) => {
    const m = merged();
    if (type === 'lines') return (getP(m, path) || []).join('\n\n');
    if (type === 'skill') return ((m.skills.find(s => s.category === path.slice(6)) || {}).items || []).join(', ');
    return getP(m, path) || '';
  };
  $('#pf').innerHTML = FIELDS.map(([t, fs]) => `<div class="grp"><h3>${t}</h3>${fs.map(([p, l, ty]) => `<label>${l}${ty === 'lines' ? `<textarea data-p="${p}" data-ty="lines">${esc(fieldVal(p, ty))}</textarea>` : `<input data-p="${p}" data-ty="${ty || ''}" value="${esc(fieldVal(p, ty))}">`}</label>`).join('')}</div>`).join('');
  $('#pf').oninput = e => {
    const el = e.target, p = el.dataset.p, ty = el.dataset.ty, v = el.value.trim();
    if (ty === 'lines') setP(over, p, v.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean));
    else if (ty === 'skill') {
      const skills = JSON.parse(JSON.stringify(merged().skills)), cat = p.slice(6), g = skills.find(s => s.category === cat);
      const items = v.split(',').map(s => s.trim()).filter(Boolean); if (g) g.items = items; else skills.push({ category: cat, items });
      over.skills = skills;
    } else {
      setP(over, p, v || null);
      if (p === 'contact.phone') setP(over, 'contact.phoneIntl', '');
    }
    save();
  };
  $('#reset').onclick = () => { if (confirm('Remove all changes made in this browser and go back to data/*.js?')) { localStorage.removeItem(K.projects); localStorage.removeItem(K.profile); location.reload(); } };

  /* export */
  $('#exp').onclick = () => {
    reindex();
    download('projects.js', `/* Exported from admin.html */\nwindow.PORTFOLIO = window.PORTFOLIO || {};\nwindow.PORTFOLIO.projects = ${JSON.stringify(projects, null, 2)};\n`);
    setTimeout(() => download('profile.js', `/* Exported from admin.html */\nwindow.PORTFOLIO = window.PORTFOLIO || {};\nwindow.PORTFOLIO.profile = ${JSON.stringify(merged(), null, 2)};\n`), 400);
  };
  render();
})();
