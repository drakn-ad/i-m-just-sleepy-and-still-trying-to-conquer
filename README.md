# Mahmoud Hesham — Portfolio

Static, build-free site (HTML + CSS + vanilla JS). Run locally: `npx serve .` or open `index.html`.

## Update content (no UI code changes)

| What | Where |
|---|---|
| Name, title, about, skills, services, experience, education, socials, contact, section on/off | `data/profile.js` |
| Projects (add / edit / delete / hide via `visible` / `featured` / `order`) | `data/projects.js` |
| CV | Drop the file in `assets/cv/`, set `cv.url` in `data/profile.js` (`null` hides the button) |
| Profile image | Replace `assets/profile.png` or change `image` |

Any social/email left `null` is hidden everywhere. Empty skill lists, timelines and sections disappear automatically.

Contact form: set `contact.formEndpoint` (Formspree, Supabase function, etc.); otherwise it uses `mailto:` when an email exists.

## Move to a database / CMS later

Only `js/api.js` reads data (`getProfile`, `getProjects`). Replace those two functions with `fetch()` calls (Supabase, Firebase, REST, headless CMS) returning the same shapes. Nothing else changes.

## Structure

`data/` content · `js/api.js` data layer · `js/main.js` renderer + animations · `styles/` · `assets/`

## Admin panel (`admin.html`)

Open `admin.html` to add/edit/delete/hide/feature/reorder projects with image upload, and edit profile text, contact, socials and skills.

Changes are saved in the browser (`localStorage`). Click **Export files** and replace `data/projects.js` + `data/profile.js` to publish them.

For changes that sync across devices without exporting, replace the functions in `js/api.js` with a backend (e.g. Supabase).
