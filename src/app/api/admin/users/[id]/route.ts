import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { role } = await req.json();
  if (!["USER", "ADMIN"].includes(role)) return NextResponse.json({ error: "Rol inválido" }, { status: 400 });

  await db.update(users).set({ role }).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const selfId = (session!.user as any).id;
  if (id === selfId) return NextResponse.json({ error: "No podés eliminar tu propia cuenta" }, { status: 400 });

  try {
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar el usuario. Puede tener datos relacionados." }, { status: 500 });
  }
}
