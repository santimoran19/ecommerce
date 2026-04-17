"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingCart, Store, Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((a, x) => a + x.quantity, 0);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
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

  return (
    <nav className="sticky top-0 z-50" style={navStyle}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--primary)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={18} color="white" />
          </div>
          EcommercePro
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: isActive(l.href) ? 600 : 500,
              color: isActive(l.href) ? "var(--primary)" : "var(--text-muted)",
              background: isActive(l.href) ? "var(--primary-bg)" : "transparent",
              transition: "all 0.15s",
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/admin" title="Admin" style={{ padding: 8, borderRadius: "var(--radius-sm)", color: "var(--text-muted)", display: "flex" }} className="hidden md:flex">
            <Shield size={19} />
          </Link>

          <Link href="/cart" style={{ position: "relative", padding: 8, borderRadius: "var(--radius-sm)", color: "var(--text)", display: "flex", background: count > 0 ? "var(--primary-bg)" : "transparent", transition: "all 0.15s" }}>
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

          <Link href="/login" className="hidden md:flex" style={{
            padding: "9px 20px",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
            transition: "all 0.2s",
            letterSpacing: "0.01em",
          }}>
            Ingresar
          </Link>

          <button onClick={() => setOpen(!open)} className="md:hidden" style={{ padding: 8, color: "var(--text)", background: "none", border: "none", cursor: "pointer" }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-card)", padding: "16px 24px 20px" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: 15, fontWeight: 500, color: isActive(l.href) ? "var(--primary)" : "var(--text)", borderBottom: "1px solid var(--border)" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Link href="/login" onClick={() => setOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 600, fontSize: 14, textAlign: "center" }}>
              Ingresar
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)} style={{ padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 14 }}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
