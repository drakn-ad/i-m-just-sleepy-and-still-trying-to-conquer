/* Data access layer. The UI only calls these.
   Local edits made in admin.html (stored in this browser) override data/*.js.
   To go multi-device, replace the bodies with fetch() to
   Supabase / Firebase / REST / a headless CMS and keep the same return shapes.
*/

(function () {
  const P = window.PORTFOLIO;

  const KEYS = {
    projects: 'pf_projects',
    profile: 'pf_profile'
  };

  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  };

  const isObj = (value) =>
    value && typeof value === 'object' && !Array.isArray(value);

  const merge = (a, b) => {
    const obj = { ...(a || {}) };

    for (const key in b) {
      obj[key] =
        isObj(b[key]) && isObj(a && a[key])
          ? merge(a[key], b[key])
          : b[key];
    }

    return obj;
  };

  const mergeProfile = (override) =>
    merge(P.profile, override || {});

  window.PortfolioAPI = {
    KEYS,
    mergeProfile,

    getProfile: async () =>
      mergeProfile(read(KEYS.profile)),

    getProjects: async () =>
      (read(KEYS.projects) || P.projects || [])
        .filter((p) => p.visible !== false)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  };
})();