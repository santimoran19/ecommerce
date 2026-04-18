import { db } from "@/db";
import { products, orders, users, orderItems } from "@/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";
import Link from "next/link";
import { Package, ShoppingCart, Users as UsersIcon, DollarSign, TrendingUp, ArrowRight, Clock } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  PAID:      { label: "Pagado",     color: "#16a34a", bg: "#dcfce7" },
  SHIPPED:   { label: "Enviado",    color: "#2563eb", bg: "#dbeafe" },
  DELIVERED: { label: "Entregado",  color: "#7c3aed", bg: "#ede9fe" },
  CANCELLED: { label: "Cancelado",  color: "#dc2626", bg: "#fee2e2" },
};

export default async function AdminPage() {
  const [[{ totalProducts }], [{ totalOrders }], [{ totalUsers }], [{ revenue }], [{ pending }]] = await Promise.all([
    db.select({ totalProducts: count() }).from(products),
    db.select({ totalOrders: count() }).from(orders),
    db.select({ totalUsers: count() }).from(users),
    db.select({ revenue: sql<string>`coalesce(sum(total), 0)` }).from(orders).where(eq(orders.status, "PAID")),
    db.select({ pending: count() }).from(orders).where(eq(orders.status, "PENDING")),
  ]);

  const recentOrders = await db
    .select({ order: orders, user: users })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(6);

  const stats = [
    { label: "Productos",        value: totalProducts,                                 icon: Package,     color: "#6366f1", bg: "#eef2ff",  href: "/admin/products" },
    { label: "Órdenes totales",  value: totalOrders,                                   icon: ShoppingCart, color: "#8b5cf6", bg: "#f5f3ff", href: "/admin/orders" },
    { label: "Usuarios",         value: totalUsers,                                    icon: UsersIcon,    color: "#06b6d4", bg: "#ecfeff",  href: "/admin/users" },
    { label: "Ingresos pagados", value: `$${Number(revenue).toLocaleString("es-AR")}`, icon: DollarSign,  color: "#22c55e", bg: "#f0fdf4",  href: "/admin/orders" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--primary-bg)", color: "var(--primary)", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, letterSpacing: "0.06em", marginBottom: 10 }}>
            <TrendingUp size={11} /> PANEL DE ADMINISTRACIÓN
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", margin: 0 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Resumen general de tu tienda</p>
        </div>
        {pending > 0 && (
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: "var(--radius)", background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", fontSize: 13, fontWeight: 700 }}>
            <Clock size={15} /> {pending} orden{pending !== 1 ? "es" : ""} pendiente{pending !== 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 36 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", transition: "transform 0.15s, box-shadow 0.15s", textDecoration: "none" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} />
              </div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, margin: "4px 0 0" }}>{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 36 }}>
        {[
          { href: "/admin/products", label: "Nuevo producto", emoji: "➕" },
          { href: "/admin/orders", label: "Ver órdenes", emoji: "📦" },
          { href: "/admin/users", label: "Ver usuarios", emoji: "👥" },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontWeight: 600, transition: "all 0.15s" }}>
            <span>{a.emoji}</span> {a.label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", margin: 0 }}>Órdenes recientes</h2>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
            Ver todas <ArrowRight size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            <ShoppingCart size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <p style={{ fontSize: 14, fontWeight: 600 }}>Sin órdenes todavía</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "var(--bg-subtle)" }}>
                  {["ID", "Cliente", "Total", "Estado", "Fecha"].map(h => (
                    <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(({ order: o, user: u }) => {
                  const st = statusConfig[o.status] ?? { label: o.status, color: "#94a3b8", bg: "#f1f5f9" };
                  return (
                    <tr key={o.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td style={{ padding: "14px 20px", color: "var(--text)", fontWeight: 500 }}>{u?.name ?? u?.email ?? "—"}</td>
                      <td style={{ padding: "14px 20px", fontWeight: 800, color: "var(--text)" }}>${Number(o.total).toLocaleString("es-AR")}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</td>
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
