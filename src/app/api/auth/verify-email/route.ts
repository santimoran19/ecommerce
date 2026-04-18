import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }

  const [record] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, token)));

  if (!record) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }

  if (record.expires < new Date()) {
    await db
      .delete(verificationTokens)
      .where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, token)));
    return NextResponse.redirect(new URL("/verify-email?error=expired", req.url));
  }

  await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, email));
  await db
    .delete(verificationTokens)
    .where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, token)));

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
