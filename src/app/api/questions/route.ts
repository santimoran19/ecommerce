import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { productQuestions, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const rows = await db
    .select({ question: productQuestions, user: users })
    .from(productQuestions)
    .leftJoin(users, eq(productQuestions.userId, users.id))
    .where(eq(productQuestions.productId, productId))
    .orderBy(desc(productQuestions.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { productId, question } = await req.json();
  if (!productId || !question?.trim()) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const userId = (session.user as any).id;
  await db.insert(productQuestions).values({ productId, userId, question: question.trim() });

  return NextResponse.json({ ok: true });
}
