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
