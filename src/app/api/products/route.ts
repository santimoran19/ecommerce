import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, ilike, gte, lte, and, asc, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const q = s.get("q");
  const cat = s.get("category");
  const min = s.get("min") ? Number(s.get("min")) : undefined;
  const max = s.get("max") ? Number(s.get("max")) : undefined;
  const sort = s.get("sort") ?? "createdAt";

  const filters = [];
  if (q) filters.push(ilike(products.name, `%${q}%`));
  if (min !== undefined) filters.push(gte(products.price, String(min)));
  if (max !== undefined) filters.push(lte(products.price, String(max)));

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      cat
        ? and(...filters, eq(categories.slug, cat))
        : filters.length ? and(...filters) : undefined
    )
    .orderBy(
      sort === "price" ? asc(products.price) :
      sort === "price-desc" ? desc(products.price) :
      desc(products.createdAt)
    );

  return NextResponse.json(rows.map((r) => ({ ...r.product, category: r.category })));
}
