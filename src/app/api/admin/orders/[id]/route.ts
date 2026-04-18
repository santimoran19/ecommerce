import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) return NextResponse.json({ error: "Estado inválido" }, { status: 400 });

  await db.update(orders).set({ status }).where(eq(orders.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  await db.delete(orders).where(eq(orders.id, id));
  return NextResponse.json({ ok: true });
}
