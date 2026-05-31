# burnmap.dev

Marketing / waitlist site for Burnmap.

Static — no build step. Just three files (the logo is embedded inside
`index.html`, so there is no image folder to upload):

- `index.html` — the page (logo baked in)
- `burnmap-light.css` — styles (light theme + dark-mode tokens)
- `burnmap-light.js` — ticker, waitlist form, theme toggle, tweaks

## Deploy (GitHub Pages)

1. Push these files to a public repo.
2. **Settings → Pages → Deploy from a branch → `main` / `root`.**
3. The `CNAME` file points the site at `burnmap.dev`; add the DNS records
   below at your registrar, then tick **Enforce HTTPS**.

### DNS for burnmap.dev
- `A` @ → `185.199.108.153`
- `A` @ → `185.199.109.153`
- `A` @ → `185.199.110.153`
- `A` @ → `185.199.111.153`
- `CNAME` www → `<your-username>.github.io`

## Note
The waitlist form is a front-end mock (fake submit). Wire it to a real
backend / email provider before launch.
