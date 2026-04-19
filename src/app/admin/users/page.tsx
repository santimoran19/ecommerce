import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { UsersTable } from "./users-table";
import { CreateUserButton } from "./user-actions";
import { Users, ShieldCheck, Mail } from "lucide-react";

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.04em" }}>Usuarios</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{allUsers.length} usuarios registrados</p>
        </div>
        <CreateUserButton />
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

      <UsersTable users={usersWithStats} />
    </div>
  );
}
