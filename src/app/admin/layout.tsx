import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Store, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingCart },
  { href: "/admin/users", label: "Usuarios", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "var(--bg-card)", borderRight: "1px solid var(--border)", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }} className="hidden md:flex">
        <div style={{ padding: "8px 12px 20px", marginBottom: 8, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={14} color="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Panel Admin</span>
          </div>
        </div>

        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: 14, fontWeight: 500, transition: "all 0.15s" }}
            className="admin-nav-link"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <Link href="/" className="admin-nav-link" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>
            <ArrowLeft size={14} /> Volver a la tienda
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
