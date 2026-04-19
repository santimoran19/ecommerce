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

  await sendVerificationEmail(email, name, token);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ecommercepro-moran.vercel.app";
  const devUrl = (!process.env.SMTP_USER || !process.env.SMTP_PASS)
    ? `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
    : undefined;

  return NextResponse.json({ ok: true, devUrl });
}
