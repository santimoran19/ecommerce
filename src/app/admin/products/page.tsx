import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AdminProductActions } from "./actions";
import { ProductsTable } from "./products-table";

export default async function AdminProductsPage() {
  const [rows, cats] = await Promise.all([
    db.select({ product: products, category: categories })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id)),
    db.select().from(categories),
  ]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.04em" }}>Productos</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{rows.length} producto{rows.length !== 1 ? "s" : ""} en el catálogo</p>
        </div>
        <AdminProductActions categories={cats} />
      </div>
      <ProductsTable rows={rows} cats={cats} />
    </div>
  );
}
