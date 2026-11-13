/* Data access layer. The UI only calls these. To migrate, replace the bodies with
   fetch() to Supabase / Firebase / REST / a headless CMS and keep the same return shapes. */
(function () {
  const P = window.PORTFOLIO;
  window.PortfolioAPI = {
    getProfile: async () => P.profile,
    getProjects: async () =>
      P.projects.filter(p => p.visible !== false).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  };
})();
