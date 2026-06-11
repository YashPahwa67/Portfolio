# Yash Pahwa — Portfolio

An award-style developer portfolio: a cursor-reactive 3D hero (a Ready-Player-Me
avatar that head-tracks the mouse, with a shader-orb fallback), ambient particles
behind every section, scroll-driven motion, and a **live GitHub feed** — built to
look great *and* read cleanly when someone opens dev tools.

**Stack:** React 18 · Vite · TypeScript (strict) · react-three-fiber · drei ·
@react-three/postprocessing · Framer Motion · Tailwind CSS.

---

## Highlights for reviewers

- **Typed end to end** — `strict` TS, no `any`, discriminated-union fetch state, a
  typed `SiteContent` schema the data file is validated against.
- **3D is isolated** — every WebGL concern lives under `src/components/three/`. The
  canvas is `aria-hidden`, kept out of the tab order, and never traps focus.
- **Accessible + reduced-motion first** — semantic landmarks, skip link, visible
  focus rings, scroll-spy nav. `prefers-reduced-motion` swaps the entire 3D layer
  for a calm static page.
- **Performance-minded** — Three.js is lazy-loaded and code-split; the hero render
  loop pauses when scrolled off-screen; DPR auto-scales down on weak GPUs; mobile
  drops postprocessing, particle count and sphere detail.
- **Custom GLSL** — the hero orb is a hand-written vertex/fragment shader (simplex
  noise displacement + fresnel rim), commented with the math.
- **Resilient data** — the GitHub client handles rate limits, 404s and network
  errors, and caches in `sessionStorage`.

---

## Architecture & file tree

```
.
├── index.html               # SEO + Open Graph + JSON-LD Person schema
├── public/                  # resume.pdf, profile.jpg, og-image, favicon (see README-assets.md)
├── src/
│   ├── main.tsx             # React root
│   ├── App.tsx              # Page composition, skip link, reduced-motion gate
│   ├── index.css            # Tailwind layers + global/base styles
│   │
│   ├── data/
│   │   └── content.ts       # ⭐ SINGLE SOURCE OF TRUTH — all personal content
│   ├── types/
│   │   └── index.ts         # Domain + GitHub API types
│   │
│   ├── lib/
│   │   ├── github.ts        # GitHub REST client (cache, rate-limit, errors)
│   │   └── utils.ts         # cn() class combiner
│   │
│   ├── hooks/
│   │   ├── useGitHubRepos.ts        # repos fetch → discriminated-union state
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useActiveSection.ts      # scroll-spy for the navbar
│   │   ├── useInView.ts             # pause the hero canvas off-screen
│   │   └── usePointer.ts            # one shared window pointer for all 3D
│   │
│   ├── components/
│   │   ├── three/                   # ── all WebGL lives here ──
│   │   │   ├── Scene.tsx            # hero <Canvas>: avatar/orb + particles + bloom
│   │   │   ├── Avatar.tsx           # loads .glb, head/eye cursor tracking
│   │   │   ├── HeroSphere.tsx       # shader orb (fallback centrepiece)
│   │   │   ├── ParticleField.tsx    # additive particle halo
│   │   │   ├── AmbientCanvas.tsx    # fixed full-page particle backdrop
│   │   │   └── shaders/
│   │   │       ├── sphere.vert.ts   # simplex-noise displacement (commented)
│   │   │       └── sphere.frag.ts   # fresnel rim + colour ramp
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # scroll-spy nav + accessible mobile menu
│   │   │   ├── Footer.tsx
│   │   │   └── Section.tsx          # semantic section + animated heading
│   │   ├── sections/
│   │   │   ├── Hero.tsx  About.tsx  Skills.tsx
│   │   │   ├── Projects.tsx         # curated grid + live GitHub feed
│   │   │   ├── Experience.tsx       # timeline
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── Button.tsx  Reveal.tsx  Icons.tsx
│   │       ├── ProjectCard.tsx      # cursor-tilt card
│   │       └── RepoCard.tsx         # live repo card
└── vite.config.ts           # alias + manualChunks (three split for caching)
```

### How your résumé / GitHub mapped into the site

| Source | Where it lives |
| --- | --- |
| Name, title, tagline, location, socials | `content.profile` → Hero, Navbar, Contact, Footer |
| Bio (résumé summary + projects narrative) | `content.about.paragraphs` → About |
| GPA / accuracy / project stats | `content.about.highlights` → About stat grid |
| Skills (Languages / CS / AI & Tools) regrouped by layer | `content.skills` → Skills |
| Résumé projects matched to **real repos** | `content.projects` → Projects grid |
| Es Magico internship | `content.experience` → Experience timeline |
| Thapar BE + Diploma | `content.education` → About |
| All public repos (live) | GitHub API → "Latest from GitHub" strip |

**Project → repo mapping:** Internship Platform → `internship-platform`
(+ live demo), Typeify → `Typeify`, PCOS Detection → `pcod-management`, Leaf
Disease → `Leaf_Disease_Detection`, SelfTuned Chatbot → `SelfTuned-Chatbot`.

> ⚠️ Your repos have no descriptions/topics set on GitHub, so the curated grid
> uses hand-written copy from your résumé. The `SelfTuned-Chatbot` copy was
> inferred from the repo name (it's not on your résumé) — **review the wording**
> in `content.ts`. Adding descriptions to your repos will also enrich the live feed.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc -b) then production build to /dist
npm run preview    # serve the production build locally
npm run lint       # eslint
```

### Edit your content

Everything personal is in **`src/data/content.ts`** — one file. Colours/spacing
tokens are in `tailwind.config.ts`.

Before deploying, add the files in `public/` (see `public/README-assets.md`):
- **`resume.pdf`** (required — the download buttons link to it)
- `profile.jpg` (optional photo; gradient monogram shows otherwise)
- `og-image.png` (recommended social card)

---

## Add your 3D avatar (the hero "you")

The hero shows a glowing shader orb by default. To make it **you** (head-tracking
the cursor, like the reference reel):

1. Go to **[readyplayer.me](https://readyplayer.me)** and create an avatar from a
   selfie. Choose a **half-body** avatar (cleaner framing, no T-posed arms).
2. Copy its **`.glb` URL** (looks like `https://models.readyplayer.me/<id>.glb`).
3. Paste it into `src/data/content.ts`:
   ```ts
   avatar: {
     url: 'https://models.readyplayer.me/<id>.glb',
     scale: 3.1,           // tweak to taste
     position: [0, -3.2, 0] // raise/lower to frame the face
   }
   ```
4. Run `npm run dev` and nudge `scale` / `position` until the bust is framed.

No URL? The orb stays — the site is fully functional either way. Send me your
`.glb` URL and I'll dial in the exact `scale`/`position` for your avatar.

> Want a full-body avatar with an idle animation instead? That's a small
> extension — load a Mixamo idle clip in `Avatar.tsx` via `useAnimations`.

### Optional: GitHub token

Unauthenticated GitHub requests are limited to 60/hour per IP — plenty for a
portfolio. If you hammer it during local testing, copy `.env.example` to
`.env.local` and add a token (no scopes needed for public data). **Never commit it.**

---

## Deploy

### Vercel (recommended)
1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Framework preset: **Vite**
   (auto-detected). Build: `npm run build`, output: `dist`.
3. Deploy. Add your custom domain, then update the absolute URLs in `index.html`
   (`og:url`, `canonical`, image URLs) to match.

### Netlify
1. Push to GitHub, then "Add new site → Import an existing project".
2. Build command `npm run build`, publish directory `dist`. Deploy.

Both auto-build on every push. No server needed — it's a static SPA.

---

Built with care by Yash Pahwa.
