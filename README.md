# Min Fryser (Cloudflare Pages + KV)
Denne version er klar til **Cloudflare Pages** og bruger en **Pages Function** med **Workers KV** til delt sync uden login.
- Endpoint: `/api/sync`
- KV-binding: `FRYSER` (konfigureres i Cloudflare Pages → Settings → Functions → KV bindings)

## Deploy (Git → Pages)
1) Læg mappen i et GitHub-repo.
2) Cloudflare → **Pages → Create a project → Connect to Git**.
3) Build settings: **Framework: None**, **Build command:** _(blank)_, **Output:** `.`
4) Efter første build: **Settings → Functions → KV bindings → Add binding**
   - Variable name: `FRYSER`
   - Namespace: ny eller eksisterende KV
5) Trigger et nyt deploy (eller vent på automatisk).

## Test
- Åbn forsiden og tryk **Opret ny husstand**.
- Tjek funktion: `/api/sync?id=health` skal returnere JSON.

## Lokal udvikling (valgfrit)
- Installer Wrangler: `npm i -g wrangler`
- Sæt KV ids i `wrangler.toml` (se kommentarer).
- Kør: `wrangler pages dev .`
