"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/store/cart";

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  useEffect(() => { clear(); }, [clear]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <span style={{ fontSize: 48 }}>🎉</span>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.03em" }}>¡Pago exitoso!</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.7 }}>
        Tu pedido fue procesado correctamente.
      </p>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.7, fontSize: 14 }}>
        Recibirás un email con los detalles de tu compra y el seguimiento del envío.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/products"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 99, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 600, fontSize: 15, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 99, background: "var(--bg-card)", color: "var(--text)", fontWeight: 600, fontSize: 15, border: "1px solid var(--border)" }}
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
