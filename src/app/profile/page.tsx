import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./profile-form";
import { Package, ShoppingBag, User } from "lucide-react";
import { SignOutBtn } from "@/components/sign-out-btn";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const [[{ totalOrders }], [{ totalSpent }]] = await Promise.all([
    db.select({ totalOrders: count() }).from(orders).where(eq(orders.userId, userId)),
    db.select({ totalSpent: sql<string>`coalesce(sum(total), 0)` }).from(orders).where(eq(orders.userId, userId)),
  ]);

  const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40, padding: "32px", borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, #1e1b4b, #4c1d95)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          {user.image ? (
            <img src={user.image} alt={user.name || ""} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "white", border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1, position: "relative" }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: "0 0 4px", letterSpacing: "-0.03em" }}>{user.name || "Usuario"}</h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: 0 }}>{user.email}</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "4px 0 0" }}>
              Miembro desde {new Date(user.createdAt).toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: <ShoppingBag size={22} color="var(--primary)" />, label: "Pedidos realizados", value: totalOrders },
            { icon: <Package size={22} color="#16a34a" />, label: "Total gastado", value: `$${Number(totalSpent).toLocaleString("es-AR")}` },
          ].map((s) => (
            <div key={s.label} style={{ padding: "24px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="profile-grid">

          {/* Edit profile */}
          <div style={{ padding: "28px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <User size={18} color="var(--primary)" />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: 0 }}>Mis datos</h2>
            </div>
            <ProfileForm initialName={user.name || ""} initialImage={user.image || ""} />
          </div>

          {/* Quick links */}
          <div style={{ padding: "28px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <ShoppingBag size={18} color="var(--primary)" />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: 0 }}>Mi actividad</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/profile/orders", label: "Mis pedidos", desc: `${totalOrders} pedido${totalOrders !== 1 ? "s" : ""} realizados`, icon: "📦" },
                { href: "/products", label: "Explorar catálogo", desc: "Descubrí nuevos productos", icon: "🛍️" },
                { href: "/cart", label: "Mi carrito", desc: "Ver productos guardados", icon: "🛒" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="link-quick" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none", background: "var(--bg)" }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <SignOutBtn />
      </div>
    </div>
  );
}
