/* ALL personal content lives here. Set a field to null/[] to hide it in the UI. */
window.PORTFOLIO = window.PORTFOLIO || {};
window.PORTFOLIO.profile = {
  site: {
    title: "Mahmoud Hesham | Software Developer",
    description: "Mahmoud Hesham is a software developer building modern mobile applications and scalable software solutions.",
    url: null,                       // e.g. "https://yourdomain.com" (used for og:url)
    ogImage: "assets/profile.png",
    lang: "en"
  },
  name: "Mahmoud Hesham",
  initials: "MH",
  title: "Software Developer",
  tagline: "Building modern mobile applications and scalable software solutions.",
  heroDescription: "I design and ship mobile apps and the backend systems behind them, from API to interface.",
  image: "assets/profile.png",
  imageAlt: "Portrait of Mahmoud Hesham",

  /* CV: put the file in assets/cv/ and set url. null hides the button. */
  cv: { url: null, fileName: "Mahmoud-Hesham-CV.pdf", label: "Download CV" },

  about: {
    heading: "Software built to be used, and built to last.",
    paragraphs: [
      "I build mobile applications and the backend services that power them, with a focus on clean architecture, dependable APIs and interfaces that feel fast.",
      "Edit this text in data/profile.js to describe your experience, philosophy and technical focus."
    ],
    highlights: [
      { label: "Focus", value: "Mobile & Backend" },
      { label: "Approach", value: "Clean, maintainable code" }
    ]
  },

  contact: {
    headline: "Have a project in mind?",
    text: "Tell me what you are building and I will get back to you.",
    phone: "01126971714",
    phoneIntl: "+201126971714",
<<<<<<< HEAD
    email: "mahmodhesham351@gmail.com",                     // add later; the UI shows it automatically
=======
    email: null,                     // add later; the UI shows it automatically
>>>>>>> b4aa3bee30eb2ce9c5c592f63a324e8ab8aa021c
    location: null,
    formEndpoint: null               // e.g. Formspree/Supabase function URL. Falls back to mailto if email exists.
  },

  /* Any social left null is hidden everywhere (hero, contact, footer). */
  socials: {
    github: "https://github.com/EL3oMaNy",
<<<<<<< HEAD
    linkedin: "https://www.linkedin.com/in/ma7moud-hesham/",
=======
    linkedin: null,
>>>>>>> b4aa3bee30eb2ce9c5c592f63a324e8ab8aa021c
    codeforces: null,
    leetcode: null
  },
  otherLinks: [],                    // [{ label: "Behance", url: "https://..." }]

  /* Empty `items` hides that category; if all are empty the section is hidden. */
  skills: [
    { category: "Programming", items: [] },
    { category: "Backend", items: [] },
    { category: "Mobile Development", items: [] },
    { category: "Databases", items: [] },
    { category: "Tools", items: [] },
    { category: "Other Technologies", items: [] }
  ],

  services: [
    { title: "Mobile Application Development", text: "Native and cross-platform apps built for real users." },
    { title: "Backend Development", text: "Reliable server-side logic and scalable architecture." },
    { title: "REST API Development", text: "Well-documented APIs your apps can depend on." },
    { title: "Database Development", text: "Schema design and data layers that stay fast." },
    { title: "System Integration", text: "Connecting services, platforms and third-party tools." }
  ],

  /* Optional timelines: item = { title, org, period, description }. Empty = hidden. */
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
  freelance: [],
  openSource: [],

  sections: { about: true, skills: true, projects: true, journey: true, services: true, contact: true }
};
