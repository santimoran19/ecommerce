import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, image } = await req.json();
  const userId = (session.user as any).id;

  await db.update(users).set({ name: name || null, image: image || null }).where(eq(users.id, userId));
  return NextResponse.json({ ok: true });
}
