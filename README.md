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
| `AUTH_KEYCLOAK_ID` | Client ID of the Keycloak confidential client |
| `AUTH_KEYCLOAK_SECRET` | Client secret of the Keycloak confidential client |
| `AUTH_KEYCLOAK_ISSUER` | Keycloak realm issuer URL (defaults to `https://kc.cucats.org/realms/master`) |
| `AUTH_TRUST_HOST` | `true` outside Vercel (`docker-compose` sets this) |
| `RESEND_API_KEY` | API key for transactional email |
| `EMAIL_FROM` | `From:` header used for order emails |
| `BANK_SORT_CODE`, `BANK_ACCOUNT_NUMBER`, `BANK_ACCOUNT_NAME` | Society bank details displayed on order confirmation pages |
| `ORIGIN` | Public origin URL (used by SvelteKit and Auth.js callbacks) |

The Keycloak client must be configured with redirect URI `${ORIGIN}/auth/callback/keycloak`. Cambridge-only sign-up is enforced by the realm's Microsoft IdP federation (Cambridge tenant); admin access is gated by the `admin` or `committee` realm role being present in the user's `realm_access.roles` claim.

## Migrations

SQL files live in `migrations/` and are applied in name order by `scripts/migrate.ts`. The Docker entrypoint runs migrations before starting the server. To run them locally against a running Postgres:

```bash
DATABASE_URL=postgres://cucats:cucats@localhost:5432/cucats bun run migrate
```
