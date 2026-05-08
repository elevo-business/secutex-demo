# secutex-demo (angebots-demo)

Next.js-Demo der Angebotsautomatisierung für Polyurea/Polyurethan. Läuft als
einzelne Coolify-App unter `secutex.elevo.solutions`. Tennis-isoliert (eigene
Coolify-App, eigene Subdomain, eigener Env-Scope).

## Stack

- Next.js 15 App Router · React 19 · Tailwind 3
- Node 20 (Dockerfile) · `output: standalone`
- Provider-Chain: **Groq → Gemini → Canned** (Pitch-Stabilität via `DEMO_MODE_FORCE`)
- Härtung: Origin-Whitelist · Rate-Limit (RPM/IP) · `MAX_INPUT_CHARS` · `LLM_TIMEOUT_MS`

## Routen

| Route | Method | Zweck |
|---|---|---|
| `/api/health` | GET | `200 {status:"ok"}` — Coolify-Healthcheck |
| `/api/extract` | POST | Quote-JSON (Schema in `app/lib/llm/schema.js`) |
| `/` | GET | Demo-UI mit INBOX-Mails + Live/Demo-Badge |

## Lokal entwickeln

```bash
npm ci
cp .env.example .env.local      # Keys NIEMALS committen
npm run dev                      # http://localhost:3000
```

## Lokal Build verifizieren (entspricht Coolify-Run)

```bash
npm run build
DEMO_MODE_FORCE=true ALLOWED_ORIGINS=http://localhost:3000 \
  PORT=3010 HOSTNAME=127.0.0.1 node .next/standalone/server.js
curl -sS http://127.0.0.1:3010/api/health
```

## Deployment

Coolify-App `secutex-demo`, Build-Pack **Dockerfile** (nicht Nixpacks),
Port 3000, Healthcheck `/api/health`. Env-Vars siehe `.env.example`.

Domain: `secutex.elevo.solutions`. Tennis-Domains (`tc-langbroich.de`,
`cms-auth.elevo.solutions`) **nicht berühren** — separate Apps, separate IPs.
