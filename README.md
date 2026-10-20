# maximilianpurcea.com: portfolio site

A plain HTML/CSS/JS site with no build step. You can open `index.html` in any browser to preview it.

```
site/
├── index.html                 Home: hero, about, projects, rowing, resume, contact
├── projects/                  One page per project
│   ├── rim-aerodynamics.html
│   ├── concrete-canoe.html    (both seasons)
│   ├── drawings-and-hangers.html
│   ├── bike-travel-case.html 
│   └── brokepart.html        
├── css/style.css              All styling; colors are at the top in :root
├── js/main.js                 Mobile menu, scroll reveal, dark-mode toggle
├── img/                       Optimized photos (JPG, max ~2000px wide)
├── assets/Maximilian_Purcea_Resume.pdf
└── CNAME                      Tells GitHub Pages to use maximilianpurcea.com
```

---

## 1. Put it online at maximilianpurcea.com (about 20 minutes)

### A. Buy the domain
Buy **maximilianpurcea.com** from any registrar (Cloudflare, Porkbun, Namecheap, Squarespace Domains). It usually costs about $10–12 a year.

### B. Host it free on GitHub Pages
1. Create a free account at github.com.
2. Click **New repository**. Name it anything, e.g. `portfolio`, and make it **Public**.
3. On the repo page, click **Add file → Upload files**. Drag in everything **inside** this `site` folder (`index.html`, `css`, `js`, `img`, `projects`, `assets`, `CNAME`, `.nojekyll`), then click **Commit**.
4. Go to **Settings → Pages**. Set Source to **Deploy from a branch**, Branch to `main`, and folder to `/ (root)`, then **Save**.
5. In the same Pages screen, enter `maximilianpurcea.com` under **Custom domain** and **Save**.

### C. Point the domain at GitHub
In your registrar's DNS settings, add these records:

| Type  | Name / Host | Value                    |
|-------|-------------|--------------------------|
| A     | @           | 185.199.108.153          |
| A     | @           | 185.199.109.153          |
| A     | @           | 185.199.110.153          |
| A     | @           | 185.199.111.153          |
| CNAME | www         | `<your-github-username>.github.io` |

DNS can take anywhere from a few minutes to a few hours. Once it works, go back to **Settings → Pages** and tick **Enforce HTTPS**.

> **Alternative: Netlify.** Drag the whole `site` folder onto app.netlify.com/drop, then add the domain under *Domain settings*. Netlify shows you the exact DNS records to add.

---

## 2. Things to fill in (search the files for `EDIT ME`)

| Where | What |
|---|---|
| `index.html` → Rowing table | Add regattas, boats, placings, and the **year/event/place** for the Head of the Charles medal. Delete the italic placeholder rows. |
| `index.html` → erg boxes | 2k / 6k times and seat, or delete the `<div class="erg">` block. |
| `projects/concrete-canoe.html` | Swap the Fusion screenshot in "2026–27" for an ANSYS Fluent plot when you have one. |
| `projects/bike-travel-case.html`, `brokepart.html` | Update the status and next steps as you go. Add CAD renders and screenshots. |
| `index.html` → contact text | Change "Summer 2027" if you're targeting a different term. |

### Adding a photo
1. Export it as a JPG about 1600–2000px wide. Keep it under ~400 KB.
2. Put it in `img/`.
3. Reference it like this: `<img src="img/your-photo.jpg" alt="Describe what is in the photo">`. Inside `projects/`, use `../img/...` instead.

### Updating the resume
Replace `assets/Maximilian_Purcea_Resume.pdf` with the new PDF and **keep the same filename**. Every download link updates automatically.

### Moving a project from "In progress" to finished
In `index.html`, move its `<a class="card">…</a>` block from the *In progress* grid to the top grid, and delete the `<span class="status">` badge.

### Changing colors
Edit `--accent` in `css/style.css` (currently Cornell carnelian `#b31b1b`).

---

## 3. Confidentiality notes
- The Princeton Carbon Works pages describe **method and trends only**. They include no drag values, candidate geometries, rider data, or supplier details. Ask PCW before adding numbers.
- No Trek / Lidl-Trek imagery or rider data is used.
- Canoe photos come from the Cornell Concrete Canoe team Drive. Nothing in that Drive was changed.
