"use client";
import { useState, useMemo } from "react";
import { AdminProductActions } from "./actions";
import { Package, Search, X } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Product = { id: string; name: string; slug: string; description: string; price: string; stock: number; categoryId: string; images: string[] | null; featured: boolean; createdAt: Date };
type Row = { product: Product; category: Category | null };

const inputSt: React.CSSProperties = { padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" };

export function ProductsTable({ rows, cats }: { rows: Row[]; cats: Category[] }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const filtered = useMemo(() => rows.filter(({ product: p, category: c }) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && p.categoryId !== catFilter) return false;
    if (stockFilter === "in" && p.stock === 0) return false;
    if (stockFilter === "out" && p.stock > 0) return false;
    if (stockFilter === "low" && (p.stock === 0 || p.stock > 5)) return false;
    if (priceMin && Number(p.price) < Number(priceMin)) return false;
    if (priceMax && Number(p.price) > Number(priceMax)) return false;
    return true;
  }), [rows, search, catFilter, stockFilter, priceMin, priceMax]);

  const hasFilters = search || catFilter !== "all" || stockFilter !== "all" || priceMin || priceMax;

  function clearFilters() {
    setSearch(""); setCatFilter("all"); setStockFilter("all"); setPriceMin(""); setPriceMax("");
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, padding: "16px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." style={{ ...inputSt, paddingLeft: 32 }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inputSt, flex: "0 1 160px" }}>
          <option value="all">Todas las categorías</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={{ ...inputSt, flex: "0 1 150px" }}>
          <option value="all">Todo el stock</option>
          <option value="in">Con stock</option>
          <option value="low">Stock bajo (≤5)</option>
          <option value="out">Sin stock</option>
        </select>
        <div style={{ display: "flex", gap: 6, flex: "0 1 220px" }}>
          <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Precio min" style={{ ...inputSt, flex: 1 }} />
          <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Precio max" style={{ ...inputSt, flex: 1 }} />
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-clear" style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""} {hasFilters ? "encontrados" : "en total"}
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
              {filtered.map(({ product: p, category: c }) => (
                <tr key={p.id} className="table-row-hover" style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Package size={18} color="var(--text-muted)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{c?.name ?? "—"}</span>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
                    <Package size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>Sin resultados</p>
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
