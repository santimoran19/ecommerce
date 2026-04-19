import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { name, email, password, role } = await req.json();
  if (!email || !password || password.length < 6) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  if (!["USER", "ADMIN"].includes(role ?? "USER")) return NextResponse.json({ error: "Rol inválido" }, { status: 400 });

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.insert(users).values({
      name: name || null,
      email,
      password: hashed,
      role: role ?? "USER",
      emailVerified: new Date(),
    });
  } catch {
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
