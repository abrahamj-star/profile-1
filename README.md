# Abraham Jacob — Portfolio

Static personal portfolio built from a CV using plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure
```
index.html          page content
css/style.css       styles (light/dark themes, responsive, print)
js/main.js          theme toggle, mobile menu, scroll effects, publication filter
assets/images/      profile photo
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```

## Deploy
Push to GitHub and enable **Settings → Pages → Deploy from branch → main / root**. Netlify, Vercel and any static host also work.

## Editing
All text lives in `index.html`. Publications carry `data-t="published"` / `"presented"` for the filter buttons.
