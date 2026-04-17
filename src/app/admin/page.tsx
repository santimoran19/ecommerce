import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  PAID:      { label: "Pagado",     color: "#16a34a", bg: "#dcfce7" },
  SHIPPED:   { label: "Enviado",    color: "#2563eb", bg: "#dbeafe" },
  DELIVERED: { label: "Entregado",  color: "#7c3aed", bg: "#ede9fe" },
  CANCELLED: { label: "Cancelado",  color: "#dc2626", bg: "#fee2e2" },
};

export default async function AdminPage() {
  const [[{ totalProducts }], [{ totalOrders }], [{ totalUsers }], [{ revenue }]] = await Promise.all([
    db.select({ totalProducts: count() }).from(products),
    db.select({ totalOrders: count() }).from(orders),
    db.select({ totalUsers: count() }).from(users),
    db.select({ revenue: sql<string>`coalesce(sum(total), 0)` }).from(orders).where(eq(orders.status, "PAID")),
  ]);

  const recentOrders = await db.select().from(orders).orderBy(orders.createdAt).limit(8);

  const stats = [
    { label: "Productos", value: totalProducts, icon: <Package size={22} />, href: "/admin/products", color: "#6366f1", bg: "#eef2ff" },
    { label: "Órdenes totales", value: totalOrders, icon: <ShoppingCart size={22} />, href: "/admin/orders", color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Usuarios", value: totalUsers, icon: <Users size={22} />, href: "#", color: "#06b6d4", bg: "#ecfeff" },
    { label: "Ingresos (pagados)", value: `$${Number(revenue).toLocaleString("es-AR")}`, icon: <DollarSign size={22} />, href: "#", color: "#22c55e", bg: "#f0fdf4" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--primary-bg)", color: "var(--primary)", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, letterSpacing: "0.06em", marginBottom: 10 }}>
            <TrendingUp size={12} /> PANEL DE ADMINISTRACIÓN
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em" }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Resumen general de tu tienda</p>
        </div>
        <Link href="/admin/products" style={{
          display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: "var(--radius-full)",
          background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14,
          boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
        }}>
          <Package size={16} /> Nuevo producto
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="stat-card" style={{
            display: "flex", alignItems: "center", gap: 16, padding: "24px",
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", letterSpacing: "-0.02em" }}>Órdenes recientes</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Últimas {recentOrders.length} transacciones</p>
          </div>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            <ShoppingCart size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>Sin órdenes todavía</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "var(--bg-subtle)" }}>
                  {["ID", "Total", "Estado", "Fecha"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const s = statusConfig[o.status] ?? { label: o.status, color: "#94a3b8", bg: "#f1f5f9" };
                  return (
                    <tr key={o.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 24px", fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>#{o.id.slice(0, 8)}</td>
                      <td style={{ padding: "16px 24px", fontWeight: 700, fontSize: 15, color: "var(--text)", letterSpacing: "-0.02em" }}>${Number(o.total).toLocaleString("es-AR")}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-muted)" }}>{new Date(o.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
