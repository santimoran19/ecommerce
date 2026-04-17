import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { AdminProductActions } from "./actions";

export default async function AdminProductsPage() {
  const [rows, cats] = await Promise.all([
    db.select({ product: products, category: categories })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id)),
    db.select().from(categories),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm hover:opacity-70 mb-1 block" style={{ color: "var(--text-muted)" }}>← Admin</Link>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>Productos</h1>
        </div>
        <AdminProductActions categories={cats} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Producto", "Categoría", "Precio", "Stock", "Acciones"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ product: p, category: c }) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background: "var(--bg)" }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : "📦"}
                      </div>
                      <span className="font-medium" style={{ color: "var(--text)" }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text-muted)" }}>{c?.name ?? "-"}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: "var(--primary)" }}>${Number(p.price).toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold" style={{ color: p.stock > 0 ? "#22c55e" : "#ef4444" }}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-4">
                    <AdminProductActions categories={cats} product={p} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center" style={{ color: "var(--text-muted)" }}>Sin productos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
