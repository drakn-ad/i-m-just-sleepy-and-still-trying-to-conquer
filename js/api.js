<<<<<<< HEAD
/* Data access layer. The UI only calls these. Local edits made in admin.html (stored in this
   browser) override data/*.js. To go multi-device, replace the bodies with fetch() to
   Supabase / Firebase / REST / a headless CMS and keep the same return shapes. */
(function () {
  const P = window.PORTFOLIO, KEYS = { projects: 'pf_projects', profile: 'pf_profile' };
  const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (a, b) => { const o = { ...a }; for (const k in b) o[k] = isObj(b[k]) && isObj(a && a[k]) ? merge(a[k], b[k]) : b[k]; return o; };
  const mergeProfile = over => merge(P.profile, over || {});
  window.PortfolioAPI = {
    KEYS, mergeProfile,
    getProfile: async () => mergeProfile(read(KEYS.profile)),
    getProjects: async () => (read(KEYS.projects) || P.projects)
      .filter(p => p.visible !== false).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
=======
/* Data access layer. The UI only calls these. To migrate, replace the bodies with
   fetch() to Supabase / Firebase / REST / a headless CMS and keep the same return shapes. */
(function () {
  const P = window.PORTFOLIO;
  window.PortfolioAPI = {
    getProfile: async () => P.profile,
    getProjects: async () =>
      P.projects.filter(p => p.visible !== false).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
>>>>>>> b4aa3bee30eb2ce9c5c592f63a324e8ab8aa021c
  };
})();
