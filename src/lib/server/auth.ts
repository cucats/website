import Keycloak from "@auth/core/providers/keycloak";
import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import { env } from "$env/dynamic/private";
import { sql } from "$lib/server/db";

type KeycloakProfile = {
  sub?: string;
  email?: string;
  preferred_username?: string;
  name?: string;
};

function rolesFromAccessToken(accessToken: string | undefined): string[] {
  if (!accessToken) return [];
  const parts = accessToken.split(".");
  if (parts.length < 2) return [];
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { realm_access?: { roles?: string[] } };
    return payload.realm_access?.roles ?? [];
  } catch {
    return [];
  }
}

const config: SvelteKitAuthConfig = {
  providers: [
    Keycloak({
      clientId: env.AUTH_KEYCLOAK_ID,
      clientSecret: env.AUTH_KEYCLOAK_SECRET,
      issuer: env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      const p = profile as KeycloakProfile | undefined;
      if (!p?.sub) return false;
      const email = (p.email ?? p.preferred_username ?? "").toLowerCase();
      if (!email) return false;

      try {
        await sql`
          insert into users (entra_oid, email, name)
          values (${p.sub}, ${email}, ${p.name ?? null})
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
    async jwt({ token, profile, account }) {
      if (profile && account) {
        const p = profile as KeycloakProfile;
        if (!p.sub) return null;
        const roles = rolesFromAccessToken(account.access_token as string | undefined);
        const rows = await sql<{ id: string }[]>`
          select id from users where entra_oid = ${p.sub}
        `;
        if (rows.length === 0) return null;
        token.userId = rows[0].id;
        token.isAdmin = roles.includes("admin") || roles.includes("committee");
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
