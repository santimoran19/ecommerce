import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { UserRoleToggle } from "./user-actions";
import { Users, ShieldCheck, Mail, Calendar } from "lucide-react";

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(users.createdAt);

  const usersWithStats = await Promise.all(
    allUsers.map(async (u) => {
      const [[{ totalOrders }], [{ totalSpent }]] = await Promise.all([
        db.select({ totalOrders: count() }).from(orders).where(eq(orders.userId, u.id)),
        db.select({ totalSpent: sql<string>`coalesce(sum(total), 0)` }).from(orders).where(eq(orders.userId, u.id)),
      ]);
      return { ...u, totalOrders, totalSpent };
    })
  );

  const admins = usersWithStats.filter(u => u.role === "ADMIN").length;
  const verified = usersWithStats.filter(u => u.emailVerified).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.04em" }}>Usuarios</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{allUsers.length} usuarios registrados</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total usuarios", value: allUsers.length, color: "#6366f1", bg: "#eef2ff", icon: <Users size={18} /> },
          { label: "Administradores", value: admins, color: "#8b5cf6", bg: "#f5f3ff", icon: <ShieldCheck size={18} /> },
          { label: "Emails verificados", value: verified, color: "#22c55e", bg: "#f0fdf4", icon: <Mail size={18} /> },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)" }}>
                {["Usuario", "Email", "Rol", "Pedidos", "Total gastado", "Verificado", "Registrado"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersWithStats.map((u) => {
                const initials = (u.name || u.email || "U").slice(0, 2).toUpperCase();
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {u.image ? (
                          <img src={u.image} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>
                            {initials}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>{u.name ?? "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <UserRoleToggle userId={u.id} currentRole={u.role} />
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{u.totalOrders}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--primary)" }}>${Number(u.totalSpent).toLocaleString("es-AR")}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, ...(u.emailVerified ? { color: "#16a34a", background: "#dcfce7" } : { color: "#d97706", background: "#fef3c7" }) }}>
                        {u.emailVerified ? "✓ Sí" : "⏳ No"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={12} />
                        {new Date(u.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {usersWithStats.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Sin usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
