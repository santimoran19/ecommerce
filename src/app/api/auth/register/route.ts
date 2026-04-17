import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  await db.insert(users).values({ name, email, password: hashed });
  return NextResponse.json({ ok: true });
}
