"use client";
import { useState, useMemo } from "react";
import { OrderStatusSelect, DeleteOrderButton } from "./order-actions";
import { Package, Search, X } from "lucide-react";

const STATUSES = [
  { value: "PENDING",   label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  { value: "PAID",      label: "Pagado",     color: "#16a34a", bg: "#dcfce7" },
  { value: "SHIPPED",   label: "Enviado",    color: "#2563eb", bg: "#dbeafe" },
  { value: "DELIVERED", label: "Entregado",  color: "#7c3aed", bg: "#ede9fe" },
  { value: "CANCELLED", label: "Cancelado",  color: "#dc2626", bg: "#fee2e2" },
];

type Item = { qty: number; price: string; name: string | null; slug: string | null; images: string[] | null };
type Order = { id: string; userId: string; status: string; total: string; mpPaymentId: string | null; createdAt: Date };
type User = { id: string; name: string | null; email: string; role: string } | null;
type Row = { order: Order; user: User; items: Item[] };

const inputSt: React.CSSProperties = { padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" };

export function OrdersTable({ rows }: { rows: Row[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [catSearch, setCatSearch] = useState("");

  const filtered = useMemo(() => rows.filter(({ order: o, user: u, items }) => {
    if (search) {
      const q = search.toLowerCase();
      const matchUser = (u?.name ?? u?.email ?? "").toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      if (!matchUser && !matchId) return false;
    }
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (priceMin && Number(o.total) < Number(priceMin)) return false;
    if (priceMax && Number(o.total) > Number(priceMax)) return false;
    if (dateFrom && new Date(o.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(o.createdAt) > new Date(dateTo + "T23:59:59")) return false;
    if (catSearch) {
      const q = catSearch.toLowerCase();
      if (!items.some(i => (i.name ?? "").toLowerCase().includes(q))) return false;
    }
    return true;
  }), [rows, search, statusFilter, priceMin, priceMax, dateFrom, dateTo, catSearch]);

  const hasFilters = search || statusFilter !== "all" || priceMin || priceMax || dateFrom || dateTo || catSearch;

  function clearFilters() {
    setSearch(""); setStatusFilter("all"); setPriceMin(""); setPriceMax("");
    setDateFrom(""); setDateTo(""); setCatSearch("");
  }

  return (
    <div>
      {/* Filters — single scrollable row */}
      <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: "max-content" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cliente o ID..." style={{ ...inputSt, width: 170, paddingLeft: 32 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputSt, width: 155 }}>
            <option value="all">Todos los estados</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="Producto..." style={{ ...inputSt, width: 150 }} />
          <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Total min" style={{ ...inputSt, width: 110 }} />
          <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Total max" style={{ ...inputSt, width: 110 }} />
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inputSt, width: 140 }} />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inputSt, width: 140 }} />
          {hasFilters && (
            <button onClick={clearFilters} className="btn-clear" style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              <X size={13} /> Limpiar
            </button>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length} orden{filtered.length !== 1 ? "es" : ""} {hasFilters ? "encontradas" : "en total"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "80px 24px", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <Package size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>Sin resultados</p>
          </div>
        ) : (
          filtered.map(({ order: o, user: u, items }) => (
            <div key={o.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {/* Order header */}
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{u?.name ?? u?.email ?? "Usuario eliminado"}</span>
                    {u?.email && u?.name && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({u.email})</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    {new Date(o.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>${Number(o.total).toLocaleString("es-AR")}</span>
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  <DeleteOrderButton orderId={o.id} />
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  {items.length} producto{items.length !== 1 ? "s" : ""}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name ?? ""} style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 52, height: 52, borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Package size={22} color="var(--text-muted)" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name ?? "Producto eliminado"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          Cantidad: <strong>{item.qty}</strong> · Unitario: <strong>${Number(item.price).toLocaleString("es-AR")}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--primary)" }}>${(Number(item.price) * item.qty).toLocaleString("es-AR")}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>subtotal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
