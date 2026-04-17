import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b", PAID: "#22c55e", SHIPPED: "#3b82f6",
  DELIVERED: "#8b5cf6", CANCELLED: "#ef4444",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pendiente", PAID: "Pagado", SHIPPED: "Enviado",
  DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

export default async function AdminOrdersPage() {
  const rows = await db
    .select({ order: orders, user: users })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(orders.createdAt);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm hover:opacity-70 mb-1 block" style={{ color: "var(--text-muted)" }}>← Admin</Link>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>Órdenes</h1>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Cliente", "Total", "Estado", "Fecha"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ order: o, user: u }) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{o.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4" style={{ color: "var(--text)" }}>{u?.name ?? u?.email ?? "-"}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: "var(--primary)" }}>${Number(o.total).toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: statusColors[o.status] }}>
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text-muted)" }}>{new Date(o.createdAt).toLocaleDateString("es-AR")}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center" style={{ color: "var(--text-muted)" }}>Sin órdenes todavía</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
