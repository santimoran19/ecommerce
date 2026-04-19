import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { reviews, users, orders, orderItems } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";

async function userHasPurchased(userId: string, productId: string): Promise<boolean> {
  const validStatuses = ["PAID", "SHIPPED", "DELIVERED"] as const;
  const userOrders = await db.select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), inArray(orders.status, [...validStatuses])));
  if (!userOrders.length) return false;
  const orderIds = userOrders.map(o => o.id);
  const item = await db.select({ id: orderItems.id })
    .from(orderItems)
    .where(and(eq(orderItems.productId, productId), inArray(orderItems.orderId, orderIds)))
    .limit(1);
  return item.length > 0;
}

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const session = await auth();
  const userId = session?.user ? (session.user as any).id : null;

  const rows = await db
    .select({ review: reviews, user: users })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  const canReview = userId ? await userHasPurchased(userId, productId) : false;

  return NextResponse.json({ reviews: rows, canReview });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  const purchased = await userHasPurchased(userId, productId);
  if (!purchased) return NextResponse.json({ error: "Solo podés reseñar productos que compraste" }, { status: 403 });

  const existing = await db.select().from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.userId, userId)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(reviews)
      .set({ rating, comment: comment || null })
      .where(eq(reviews.id, existing[0].id));
  } else {
    await db.insert(reviews).values({ productId, userId, rating, comment: comment || null });
  }

  return NextResponse.json({ ok: true });
}
