import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [product] = await db.insert(products).values({
    name: body.name,
    slug: body.slug,
    description: body.description,
    price: String(body.price),
    stock: Number(body.stock),
    categoryId: body.categoryId,
    images: body.images ?? [],
  }).returning();
  return NextResponse.json(product);
}
