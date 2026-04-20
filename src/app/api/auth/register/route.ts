import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await db.insert(users).values({ name, email, password: hashed });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.insert(verificationTokens).values({ identifier: email, token, expires });

  // Build the verification URL using the actual request origin so it works
  // from any host (localhost, network IP, production domain).
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    `http://${req.headers.get("host")}`;
  const verifyUrl = `${origin}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  let emailSent = false;
  try {
    await sendVerificationEmail(email, name, verifyUrl);
    emailSent = true;
  } catch (err) {
    console.error("[register] email send failed:", err);
  }

  // If email failed to send, return the verification URL directly so the
  // user can still verify without getting stuck.
  return NextResponse.json({ ok: true, verifyUrl: emailSent ? undefined : verifyUrl });
}
