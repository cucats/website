<div align="center">

# CUCaTS Website

[![CI](https://img.shields.io/github/actions/workflow/status/cucats/website/ci.yml?style=for-the-badge&logo=github&label=CI%2FCD)](https://github.com/cucats/website/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)](https://svelte.dev/)

</div>

## Development server:

```bash
bun run dev
```

## Production

```bash
bun run build
```

## Extra

Expects `DATA_PATH` env var for committee information.

## Environment variables

The shop / auth integration adds the following:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (set automatically by `docker-compose`) |
| `AUTH_SECRET` | 32-byte random string (`openssl rand -hex 32`) |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | Application (client) ID of the Entra app registration |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Client secret of the Entra app registration |
| `AUTH_TRUST_HOST` | `true` outside Vercel (`docker-compose` sets this) |
| `RESEND_API_KEY` | API key for transactional email |
| `EMAIL_FROM` | `From:` header used for order emails |
| `BANK_SORT_CODE`, `BANK_ACCOUNT_NUMBER`, `BANK_ACCOUNT_NAME` | Society bank details displayed on order confirmation pages |
| `ORIGIN` | Public origin URL (used by SvelteKit and Auth.js callbacks) |

The Entra app registration must be configured with redirect URI `${ORIGIN}/auth/callback/microsoft-entra-id` and use the Cambridge tenant `49a50445-bdfa-4b79-ade3-547b4f3986e9` as its authority. Sign-ins are restricted to `@cam.ac.uk` accounts in code.

## Migrations

SQL files live in `migrations/` and are applied in name order by `scripts/migrate.ts`. The Docker entrypoint runs migrations before starting the server. To run them locally against a running Postgres:

```bash
DATABASE_URL=postgres://cucats:cucats@localhost:5432/cucats bun run migrate
```
