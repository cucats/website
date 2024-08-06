
import { PrismaAdapter } from "@auth/prisma-adapter";
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import { PrismaClient } from "@prisma/client";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

const prisma = new PrismaClient();
const adapter = PrismaAdapter(prisma);


export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter,
    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: "https://accounts.google.com/o/oauth2/auth?response_type=code&hd=cam.ac.uk"
        })
    ],
    callbacks: {
        signIn: async ({ account, profile }) => {
            if (account?.provider === "google" && profile?.email_verified && profile?.email?.endsWith("@cam.ac.uk")) {
                return true;
            }
            return false;
        }
    },
    trustHost: true,
});