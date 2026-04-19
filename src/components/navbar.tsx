"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingCart, Store, Shield, User, Package, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((a, x) => a + x.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Catálogo" },
  ];

  const navStyle: React.CSSProperties = {
    background: scrolled ? "var(--bg-card)" : "transparent",
    borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    transition: "all 0.3s ease",
    boxShadow: scrolled ? "var(--shadow-sm)" : "none",
  };

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <nav style={{ ...navStyle, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--primary)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={18} color="white" />
          </div>
          EcommercePro
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="nav-desktop">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: isActive(l.href) ? 600 : 500,
              color: isActive(l.href) ? "var(--primary)" : "var(--text-muted)",
              background: isActive(l.href) ? "var(--primary-bg)" : "transparent",
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAdmin && (
            <Link href="/admin" title="Panel Admin" className="btn-admin nav-desktop" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: "var(--radius-sm)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontSize: 13, fontWeight: 700 }}>
              <Shield size={15} /> Admin
            </Link>
          )}

          <Link href="/cart" className="btn-icon" style={{ position: "relative", padding: 8, borderRadius: "var(--radius-sm)", color: "var(--text)", display: "flex", background: count > 0 ? "var(--primary-bg)" : "transparent" }}>
            <ShoppingCart size={20} color={count > 0 ? "var(--primary)" : undefined} />
            {count > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2,
                background: "var(--primary)", color: "white",
                fontSize: 10, fontWeight: 700,
                width: 18, height: 18, borderRadius: 99,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--bg-card)",
              }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {/* User area */}
          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }} className="nav-desktop">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", transition: "all 0.15s" }}
              >
                {(user as any).image ? (
                  <img src={(user as any).image} alt={user.name || ""} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white", flexShrink: 0 }}>
                    {initials}
                  </div>
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name?.split(" ")[0] || "Usuario"}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: 220, borderRadius: "var(--radius)", background: "var(--bg-card)",
                  border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
                  overflow: "hidden", zIndex: 100,
                }}>
                  {/* User info */}
                  <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{user.name || "Usuario"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                    {isAdmin && (
                      <span style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 99, background: "var(--primary-bg)", color: "var(--primary)", fontSize: 11, fontWeight: 700 }}>Admin</span>
                    )}
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    {[
                      { href: "/profile", label: "Mi perfil", icon: <User size={15} /> },
                      { href: "/profile/orders", label: "Mis pedidos", icon: <Package size={15} /> },
                    ].map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: 14, fontWeight: 500, transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ color: "var(--text-muted)" }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    {isAdmin && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: 14, fontWeight: 500, transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ color: "var(--text-muted)" }}><Shield size={15} /></span>
                        Panel Admin
                      </Link>
                    )}
                  </div>

                  <div style={{ padding: "6px", borderTop: "1px solid var(--border)" }}>
                    <button onClick={() => { setDropdownOpen(false); useCart.getState().clear(); signOut({ callbackUrl: "/" }); }}
                      className="btn-danger"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: 14, fontWeight: 500, width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary nav-desktop" style={{
              padding: "9px 20px",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
              letterSpacing: "0.01em",
            }}>
              Ingresar
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
