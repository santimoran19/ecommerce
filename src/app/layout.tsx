import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
import { Store } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "EcommercePro — Tecnología al mejor precio", description: "Tienda online profesional con Mercado Pago" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Providers>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <BottomNav />
          <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
              <div className="footer-col">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Store size={16} color="white" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>EcommercePro</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>La mejor tienda online de tecnología. Envíos a todo el país.</p>
              </div>
              <div className="footer-col">
                <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>Tienda</p>
                {[["Inicio", "/"], ["Catálogo", "/products"], ["Carrito", "/cart"]].map(([l, h]) => (
                  <Link key={h} href={h} className="footer-link" style={{ display: "block", fontSize: 14, marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
              <div className="footer-col">
                <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>Cuenta</p>
                {[["Iniciar sesión", "/login"], ["Registrarse", "/register"], ["Admin", "/admin"]].map(([l, h]) => (
                  <Link key={h} href={h} className="footer-link" style={{ display: "block", fontSize: 14, marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
              <div className="footer-col">
                <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pagos aceptados</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>💳 Visa · Mastercard · Amex<br />🏦 Transferencia · Efectivo<br />📱 Mercado Pago</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", textAlign: "center", fontSize: 12, color: "var(--text-light)" }}>
              © 2026 - Santiago Morán - Todos los derechos reservados.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
