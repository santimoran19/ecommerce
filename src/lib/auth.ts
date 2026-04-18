import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(creds) {
        const [user] = await db.select().from(users).where(eq(users.email, String(creds?.email)));
        if (!user?.password) return null;
        const ok = await bcrypt.compare(String(creds?.password), user.password);
        if (!ok) return null;
        if (!user.emailVerified) throw new Error("email_not_verified");
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as any).id   = token.id;
      (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
