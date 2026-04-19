"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Grid2x2, User, Shield, LogIn } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const items = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/products", label: "Catálogo", icon: Grid2x2 },
    ...(user
      ? [{ href: "/profile", label: "Mi perfil", icon: User }]
      : [{ href: "/login", label: "Ingresar", icon: LogIn }]
    ),
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              color: active ? "var(--primary)" : "var(--text-muted)",
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              letterSpacing: "0.02em",
              padding: "8px 4px",
              position: "relative",
              transition: "color 0.15s",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          >
            {active && (
              <span style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 32,
                height: 3,
                borderRadius: "0 0 4px 4px",
                background: "var(--primary)",
              }} />
            )}
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
