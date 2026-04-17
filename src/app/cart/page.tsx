"use client";
import { useCart } from "@/store/cart";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mpError, setMpError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setMpError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (data.initPoint) { clear(); window.location.href = data.initPoint; return; }
      if (data.error) setMpError(data.message ?? "Error al procesar el pago.");
    } catch {
      setMpError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <ShoppingBag size={44} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.03em" }}>Tu carrito está vacío</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Explorá nuestro catálogo y encontrá los mejores productos de tecnología.
        </p>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 99, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 600, fontSize: 15, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
          Ver productos →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
        <Link href="/products" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)", padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <ArrowLeft size={15} /> Seguir comprando
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
          Carrito <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 20 }}>({items.length} {items.length === 1 ? "producto" : "productos"})</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(340px, 100%)", gap: 24, alignItems: "start" }} className="cart-grid">
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 16, padding: "20px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 88, height: 88, borderRadius: 12, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 32 }}>📦</span>}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", lineHeight: 1.3 }}>{item.name}</p>
                <p style={{ fontWeight: 800, fontSize: 18, color: "var(--primary)", letterSpacing: "-0.02em" }}>${item.price.toLocaleString("es-AR")}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg)" }}>
                    <button onClick={() => setQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.quantity}</span>
                    <button onClick={() => setQty(item.id, item.quantity + 1)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                <button onClick={() => remove(item.id)} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", color: "var(--danger)" }}>
                  <Trash2 size={15} />
                </button>
                <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", letterSpacing: "-0.02em" }}>${(item.price * item.quantity).toLocaleString("es-AR")}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", padding: "28px", boxShadow: "var(--shadow-md)", position: "sticky", top: 88 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.02em" }}>Resumen del pedido</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            {items.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
                <span style={{ flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name} ×{i.quantity}</span>
                <span style={{ fontWeight: 600, flexShrink: 0 }}>${(i.price * i.quantity).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
            <span>Envío</span><span style={{ color: "var(--success)", fontWeight: 600 }}>Gratis 🎉</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900, color: "var(--text)", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", letterSpacing: "-0.03em" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>${total().toLocaleString("es-AR")}</span>
          </div>
          <button onClick={handleCheckout} disabled={loading} style={{
            width: "100%", marginTop: 20, padding: "15px", borderRadius: "var(--radius-sm)",
            background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
            color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)", letterSpacing: "-0.01em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? "Procesando..." : <><Lock size={15} /> Pagar con Mercado Pago</>}
          </button>
          {mpError && (
            <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "#fef3c7", border: "1px solid #fde68a", fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>
              ⚠️ {mpError}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
            {["visa", "mastercard", "amex"].map(b => (
              <span key={b} style={{ fontSize: 11, color: "var(--text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
