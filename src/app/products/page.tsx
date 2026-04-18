import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { desc, eq, ilike, gte, lte, and } from "drizzle-orm";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

type Props = { searchParams: Promise<{ q?: string; category?: string; min?: string; max?: string; sort?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category, min, max, sort } = await searchParams;

  const cats = await db.select().from(categories);
  const selectedCat = cats.find((c) => c.slug === category);

  const filters: any[] = [];
  if (q) filters.push(ilike(products.name, `%${q}%`));
  if (min) filters.push(gte(products.price, min));
  if (max) filters.push(lte(products.price, max));
  if (selectedCat) filters.push(eq(products.categoryId, selectedCat.id));

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(sort === "price" ? products.price : sort === "price-desc" ? desc(products.price as any) : desc(products.createdAt));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 4 }}>Catálogo</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
          {rows.length} producto{rows.length !== 1 ? "s" : ""} disponible{rows.length !== 1 ? "s" : ""}
          {category && ` en "${selectedCat?.name ?? category}"`}
          {q && ` para "${q}"`}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }} className="catalog-grid">
        {/* Sidebar */}
        <aside>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px", boxShadow: "var(--shadow-sm)", position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <SlidersHorizontal size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em" }}>Filtros</h2>
            </div>

            <form method="GET" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Search */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Buscar</label>
                <input name="q" defaultValue={q} placeholder="Nombre del producto..." style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }} />
              </div>

              {/* Categories */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Categoría</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Link href={`/products${q ? `?q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className="btn-filter-link"
                    style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: !category ? 700 : 500, color: !category ? "var(--primary)" : "var(--text-muted)", background: !category ? "var(--primary-bg)" : "transparent" }}>
                    Todas
                  </Link>
                  {cats.map((c) => (
                    <Link key={c.id} href={`/products?category=${c.slug}${q ? `&q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`}
                      className="btn-filter-link"
                      style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: category === c.slug ? 700 : 500, color: category === c.slug ? "var(--primary)" : "var(--text-muted)", background: category === c.slug ? "var(--primary-bg)" : "transparent" }}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Precio</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input name="min" type="number" defaultValue={min} placeholder="Mín" style={{ width: "50%", padding: "10px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }} />
                  <input name="max" type="number" defaultValue={max} placeholder="Máx" style={{ width: "50%", padding: "10px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }} />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Ordenar por</label>
                <select name="sort" defaultValue={sort} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }}>
                  <option value="">Más recientes</option>
                  <option value="price">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "12px", borderRadius: "var(--radius-sm)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}>
                Aplicar filtros
              </button>
              {(q || category || min || max || sort) && (
                <Link href="/products" className="link-text" style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                  Limpiar filtros
                </Link>
              )}
            </form>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {rows.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: 56, marginBottom: 16 }}>🔍</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Sin resultados</p>
              <p style={{ fontSize: 14, marginBottom: 24 }}>Probá con otros filtros o términos de búsqueda</p>
              <Link href="/products" className="btn-ghost" style={{ display: "inline-block", padding: "12px 24px", borderRadius: "var(--radius-sm)", background: "var(--primary-bg)", color: "var(--primary)", fontWeight: 600, fontSize: 14, border: "1px solid var(--primary)" }}>
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
              {rows.map(({ product: p, category: c }) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={p.price} image={p.images?.[0]} category={c?.name} stock={p.stock} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
