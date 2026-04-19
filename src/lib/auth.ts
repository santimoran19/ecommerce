import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(creds) {
        const [user] = await db.select().from(users).where(eq(users.email, String(creds?.email)));
        if (!user?.password) return null;
        const ok = await bcrypt.compare(String(creds?.password), user.password);
        if (!ok) return null;
        if (!user.emailVerified) throw new Error("email_not_verified");
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id    = user.id;
        token.role  = (user as any).role;
        token.image = user.image;
      }
      if (trigger === "update") {
        const [dbUser] = await db.select().from(users).where(eq(users.id, token.id as string));
        if (dbUser) {
          token.image = dbUser.image;
          token.name  = dbUser.name;
        }
      }
      return token;
    },
    session({ session, token }) {
      (session.user as any).id   = token.id;
      (session.user as any).role = token.role;
      session.user.image = (token.image as string | null | undefined) ?? null;
      session.user.name  = token.name as string | null | undefined;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
