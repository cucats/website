import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import { env } from "$env/dynamic/private";
import { sql } from "$lib/server/db";

const CAMBRIDGE_TENANT_ID = "49a50445-bdfa-4b79-ade3-547b4f3986e9";
const CAMBRIDGE_ISSUER = `https://login.microsoftonline.com/${CAMBRIDGE_TENANT_ID}/v2.0/`;
const CAMBRIDGE_IDP = `https://sts.windows.net/${CAMBRIDGE_TENANT_ID}/`;

type CambridgeProfile = {
  tid?: string;
  oid?: string;
  sub?: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  idp?: string;
};

const config: SvelteKitAuthConfig = {
  providers: [
    MicrosoftEntraID({
      clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: CAMBRIDGE_ISSUER,
    }),
  ],
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      const p = profile as CambridgeProfile | undefined;
      if (!p?.oid) return false;
      if (p.tid !== CAMBRIDGE_TENANT_ID) return false;
      if (p.idp && p.idp !== CAMBRIDGE_IDP) return false;
      const upn = (p.preferred_username ?? p.email ?? "").toLowerCase();
      if (!upn.endsWith("@cam.ac.uk")) return false;

      try {
        await sql`
          insert into users (entra_oid, email, name)
          values (${p.oid}, ${upn}, ${p.name ?? null})
          on conflict (entra_oid) do update
          set email = excluded.email,
              name  = excluded.name
        `;
      } catch (err) {
        console.error("auth signIn upsert failed", err);
        return false;
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const oid = (profile as CambridgeProfile).oid;
        if (!oid) return null;
        const rows = await sql<{ id: string; is_admin: boolean }[]>`
          select id, is_admin from users where entra_oid = ${oid}
        `;
        if (rows.length === 0) return null;
        token.userId = rows[0].id;
        token.isAdmin = rows[0].is_admin;
      } else if (token.userId) {
        const rows = await sql<{ is_admin: boolean }[]>`
          select is_admin from users where id = ${token.userId as string}
        `;
        if (rows.length === 0) return null;
        token.isAdmin = rows[0].is_admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      }
      return session;
    },
  },
};

export const { handle: authHandle, signIn, signOut } = SvelteKitAuth(config);
