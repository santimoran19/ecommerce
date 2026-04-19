"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Productos",  icon: Package },
  { href: "/admin/orders",   label: "Órdenes",    icon: ShoppingCart },
  { href: "/admin/users",    label: "Usuarios",   icon: Users },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
    padding: "6px 4px", fontSize: 10, fontWeight: active ? 700 : 500,
    color: active ? "var(--primary)" : "var(--text-muted)",
    borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
    background: active ? "var(--primary-bg)" : "transparent",
    transition: "all 0.15s",
    minWidth: 0,
  });

  return (
    <div className="admin-mobile-nav">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link key={href} href={href} style={linkStyle(active)}>
            <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
      <Link href="/" style={linkStyle(false)}>
        <ArrowLeft size={16} strokeWidth={1.8} />
        Tienda
      </Link>
    </div>
  );
}
