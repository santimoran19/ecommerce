import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AdminProductActions } from "./actions";
import { Package } from "lucide-react";

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

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)" }}>
                {["Producto", "Categoría", "Precio", "Stock", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ product: p, category: c }) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)", transition: "background 0.1s" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Package size={18} color="var(--text-muted)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      {c?.name ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>${Number(p.price).toLocaleString("es-AR")}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, ...(p.stock > 10 ? { color: "#16a34a" } : p.stock > 0 ? { color: "#d97706" } : { color: "#dc2626" }) }}>
                      {p.stock > 0 ? p.stock : "Sin stock"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <AdminProductActions categories={cats} product={p} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
                    <Package size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>Sin productos todavía</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
