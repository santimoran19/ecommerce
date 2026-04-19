import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { productQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { answer } = await req.json();
  if (!answer?.trim()) return NextResponse.json({ error: "La respuesta no puede estar vacía" }, { status: 400 });

  const adminId = (session!.user as any).id;
  await db.update(productQuestions)
    .set({ answer: answer.trim(), answeredBy: adminId, answeredAt: new Date() })
    .where(eq(productQuestions.id, id));

  return NextResponse.json({ ok: true });
}
