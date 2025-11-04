# Min Fryser (Cloudflare Pages + KV) — mobilvenlig
Denne udgave er optimeret til mobil (responsiv "table→cards"), større touch-områder, og bruger dit logo.

## Deploy
1) Læg mappen i et GitHub-repo.
2) Cloudflare Pages → Create a project → Connect to Git.
3) Build preset: None • Build command: _(blank)_ • Output dir: `.`
4) Settings → Functions → KV bindings → Add binding (`FRYSER` → din KV-namespace).
5) Udrul igen. Test: `/api/sync?id=health` skal returnere JSON.

## PWA
- Manifest og service worker inkluderet (cache bump: `fryser-sync-cf-v2`).
- Ikonerne kommer fra `icon-192.png` og `icon-512.png` (genereret ud fra `logo.png`).

## Mobilvisning
På små skærme skjules tabelhovedet og hver række vises som et "kort" med labels via `data-label`.
