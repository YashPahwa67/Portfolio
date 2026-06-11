# Drop-in assets

These files are served from the site root (`/`). Add the ones marked **required**
before deploying:

| File | Status | Notes |
| --- | --- | --- |
| `avatar.jpg` | **included** | Your portrait. Powers the hero "living portrait" AND the About photo. Optimized to ~106 KB. Replace this file to swap the photo (keep the name, or update `profile.avatar.image` in `content.ts`). |
| `resume.pdf` | **required** | Your résumé. Linked from the navbar, hero and contact "Download résumé" buttons (`/resume.pdf`). |
| `og-image.png` | recommended | 1200×630 social-share image. `index.html` points to `/og-image.png`. An `og-image.svg` mockup is included as a design reference — export it to PNG. |
| `favicon.svg` | included | Tab icon. |

Quick way to make the PNG OG image: open `og-image.svg` in a browser, screenshot
at 1200×630, or run it through any SVG→PNG converter.
