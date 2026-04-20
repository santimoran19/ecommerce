"use client";
import { useCart } from "@/store/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Truck, FileText, CreditCard, Check, Home, Store } from "lucide-react";

const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

type ShippingData = {
  firstName: string; lastName: string; address: string;
  city: string; province: string; zip: string; phone: string;
};
type ShippingMethod = { method: "domicilio" | "retiro"; cost: number };
type BillingData = { type: "consumidor_final" | "factura_a"; name: string; doc: string; email: string };

const STEPS = [
  { label: "Dirección", icon: MapPin },
  { label: "Envío", icon: Truck },
  { label: "Facturación", icon: FileText },
  { label: "Pagar", icon: CreditCard },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)", background: "var(--bg-subtle)",
  color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block",
};

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, total } = useCart();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "", lastName: "", address: "", city: "", province: "", zip: "", phone: "",
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>({ method: "domicilio", cost: 0 });
  const [billing, setBilling] = useState<BillingData>({ type: "consumidor_final", name: "", doc: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [mpError, setMpError] = useState("");

  const subtotal = total();
  const shippingCost = shippingMethod.method === "retiro" ? 0 : subtotal >= 50000 ? 0 : 3000;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/checkout");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0) router.push("/cart");
  }, [status, items.length, router]);

  if (status === "loading" || items.length === 0) return null;

  function validateShipping() {
    return shipping.firstName && shipping.lastName && shipping.address &&
      shipping.city && shipping.province && shipping.zip && shipping.phone;
  }

  function validateBilling() {
    if (billing.type === "factura_a") return billing.name && billing.doc && billing.email;
    return true;
  }

  async function handlePay() {
    setLoading(true);
    setMpError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping: { ...shipping, method: shippingMethod.method, cost: shippingCost },
          billing,
        }),
      });
      if (res.status === 401) { router.push("/login?callbackUrl=/checkout"); return; }
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch {
        setMpError(`Error del servidor (${res.status}). Intentá de nuevo.`);
        return;
      }
      if (data.initPoint) { window.location.href = data.initPoint; return; }
      if (data.error) setMpError(data.message ?? "Error al procesar el pago.");
    } catch (err: any) {
      setMpError(`Error de red: ${err?.message ?? "intentá de nuevo"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push("/cart")}
          className="link-back"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)", padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer" }}
        >
          <ArrowLeft size={14} /> {step > 0 ? "Atrás" : "Volver al carrito"}
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em" }}>Finalizar compra</h1>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40, gap: 0 }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "var(--success)" : active ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--bg-card)",
                  border: done || active ? "none" : "2px solid var(--border)",
                  color: done || active ? "white" : "var(--text-muted)",
                  transition: "all 0.3s",
                  boxShadow: active ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
                }}>
                  {done ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "var(--primary)" : done ? "var(--success)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? "var(--success)" : "var(--border)", margin: "0 8px", marginBottom: 22, transition: "background 0.3s" }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(320px, 100%)", gap: 24, alignItems: "start" }} className="cart-grid">
        {/* Step content */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px", boxShadow: "var(--shadow-sm)" }}>

          {/* STEP 0 — Dirección */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={20} color="var(--primary)" /> Dirección de envío
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input style={inputStyle} value={shipping.firstName} onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} placeholder="Juan" />
                </div>
                <div>
                  <label style={labelStyle}>Apellido *</label>
                  <input style={inputStyle} value={shipping.lastName} onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} placeholder="García" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Calle y número *</label>
                  <input style={inputStyle} value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} placeholder="Av. Corrientes 1234, Piso 3 Dpto A" />
                </div>
                <div>
                  <label style={labelStyle}>Ciudad *</label>
                  <input style={inputStyle} value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} placeholder="Buenos Aires" />
                </div>
                <div>
                  <label style={labelStyle}>Provincia *</label>
                  <select style={inputStyle} value={shipping.province} onChange={e => setShipping(p => ({ ...p, province: e.target.value }))}>
                    <option value="">Seleccioná una provincia</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Código Postal *</label>
                  <input style={inputStyle} value={shipping.zip} onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} placeholder="1043" maxLength={8} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono *</label>
                  <input style={inputStyle} value={shipping.phone} onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} placeholder="+54 11 1234 5678" type="tel" />
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!validateShipping()}
                className={validateShipping() ? "btn-primary" : ""}
                style={{ marginTop: 28, padding: "13px 28px", borderRadius: "var(--radius-sm)", background: validateShipping() ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--border)", color: validateShipping() ? "white" : "var(--text-muted)", fontWeight: 700, fontSize: 15, border: "none", cursor: validateShipping() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8 }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1 — Método de envío */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                <Truck size={20} color="var(--primary)" /> Método de envío
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  {
                    value: "domicilio" as const,
                    label: "Envío a domicilio",
                    desc: subtotal >= 50000 ? "Gratis · Llega en 3 a 5 días hábiles" : "$ 3.000 · Llega en 3 a 5 días hábiles",
                    badge: subtotal >= 50000 ? "GRATIS" : null,
                    Icon: Home,
                  },
                  {
                    value: "retiro" as const,
                    label: "Retiro en local",
                    desc: "Gratis · Av. Corrientes 1234, CABA · Lunes a viernes 10–18 hs",
                    badge: "GRATIS",
                    Icon: Store,
                  },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setShippingMethod({ method: opt.value, cost: opt.value === "retiro" ? 0 : subtotal >= 50000 ? 0 : 3000 })}
                    style={{
                      display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                      borderRadius: "var(--radius)", border: `2px solid ${shippingMethod.method === opt.value ? "var(--primary)" : "var(--border)"}`,
                      background: shippingMethod.method === opt.value ? "var(--primary-bg)" : "var(--bg-card)",
                      cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: shippingMethod.method === opt.value ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <opt.Icon size={20} color={shippingMethod.method === opt.value ? "white" : "var(--text-muted)"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{opt.label}</span>
                        {opt.badge && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--success)", background: "#dcfce7", padding: "2px 8px", borderRadius: 99, letterSpacing: "0.05em" }}>{opt.badge}</span>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{opt.desc}</span>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${shippingMethod.method === opt.value ? "var(--primary)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {shippingMethod.method === opt.value && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ marginTop: 28, padding: "13px 28px", borderRadius: "var(--radius-sm)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 — Facturación */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={20} color="var(--primary)" /> Datos de facturación
              </h2>
              {/* Toggle */}
              <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
                {(["consumidor_final", "factura_a"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setBilling(p => ({ ...p, type: t }))}
                    style={{
                      flex: 1, padding: "10px 16px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                      background: billing.type === t ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--bg-card)",
                      color: billing.type === t ? "white" : "var(--text-muted)",
                      transition: "all 0.2s",
                    }}
                  >
                    {t === "consumidor_final" ? "Consumidor Final" : "Factura A (empresa)"}
                  </button>
                ))}
              </div>

              {billing.type === "consumidor_final" ? (
                <div>
                  <label style={labelStyle}>DNI (opcional)</label>
                  <input style={inputStyle} value={billing.doc} onChange={e => setBilling(p => ({ ...p, doc: e.target.value }))} placeholder="12.345.678" maxLength={10} />
                  <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    Se emitirá ticket de consumidor final. No necesitás completar más datos.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Razón Social *</label>
                    <input style={inputStyle} value={billing.name} onChange={e => setBilling(p => ({ ...p, name: e.target.value }))} placeholder="Empresa S.A." />
                  </div>
                  <div>
                    <label style={labelStyle}>CUIT *</label>
                    <input style={inputStyle} value={billing.doc} onChange={e => setBilling(p => ({ ...p, doc: e.target.value }))} placeholder="30-12345678-9" maxLength={13} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email de facturación *</label>
                    <input style={inputStyle} value={billing.email} onChange={e => setBilling(p => ({ ...p, email: e.target.value }))} placeholder="admin@empresa.com" type="email" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(3)}
                disabled={!validateBilling()}
                className={validateBilling() ? "btn-primary" : ""}
                style={{ marginTop: 28, padding: "13px 28px", borderRadius: "var(--radius-sm)", background: validateBilling() ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--border)", color: validateBilling() ? "white" : "var(--text-muted)", fontWeight: 700, fontSize: 15, border: "none", cursor: validateBilling() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8 }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 3 — Confirmación */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                <CreditCard size={20} color="var(--primary)" /> Confirmá tu pedido
              </h2>

              {/* Resumen dirección */}
              <div style={{ marginBottom: 16, padding: "14px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dirección de envío</span>
                  <button onClick={() => setStep(0)} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Editar</button>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.address}<br />
                  {shipping.city}, {shipping.province} ({shipping.zip})<br />
                  {shipping.phone}
                </p>
              </div>

              {/* Resumen envío */}
              <div style={{ marginBottom: 16, padding: "14px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Método de envío</span>
                  <button onClick={() => setStep(1)} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Editar</button>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)" }}>
                  {shippingMethod.method === "domicilio" ? "🏠 Envío a domicilio" : "🏪 Retiro en local"} —{" "}
                  <span style={{ color: shippingCost === 0 ? "var(--success)" : "var(--text)", fontWeight: 600 }}>
                    {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString("es-AR")}`}
                  </span>
                </p>
              </div>

              {/* Resumen facturación */}
              <div style={{ marginBottom: 24, padding: "14px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Facturación</span>
                  <button onClick={() => setStep(2)} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Editar</button>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)" }}>
                  {billing.type === "consumidor_final" ? "Consumidor Final" : `Factura A — ${billing.name} (CUIT: ${billing.doc})`}
                </p>
              </div>

              {mpError && (
                <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "#fef3c7", border: "1px solid #fde68a", fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>
                  ⚠️ {mpError}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className={loading ? "" : "btn-primary"}
                style={{
                  width: "100%", padding: "15px", borderRadius: "var(--radius-sm)",
                  background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
                  color: "white", fontWeight: 700, fontSize: 16, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? "Procesando..." : <><CreditCard size={18} /> Pagar con Mercado Pago</>}
              </button>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
                🔒 Pago 100% seguro procesado por Mercado Pago
              </p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px", boxShadow: "var(--shadow-sm)", position: "sticky", top: 88 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 16, letterSpacing: "-0.02em" }}>Tu pedido</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
            {items.map(i => (
              <div key={i.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg)", overflow: "hidden", flexShrink: 0 }}>
                  {i.image ? <img src={i.image} alt={i.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>📦</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>×{i.quantity}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", flexShrink: 0 }}>${(i.price * i.quantity).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
              <span>Subtotal</span><span>${subtotal.toLocaleString("es-AR")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
              <span>Envío</span>
              <span style={{ color: shippingCost === 0 ? "var(--success)" : "var(--text)", fontWeight: 600 }}>
                {shippingCost === 0 ? "Gratis 🎉" : `$${shippingCost.toLocaleString("es-AR")}`}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: "var(--text)", paddingTop: 12, borderTop: "1px solid var(--border)", marginTop: 4, letterSpacing: "-0.02em" }}>
              <span>Total</span>
              <span style={{ color: "var(--primary)" }}>${(subtotal + shippingCost).toLocaleString("es-AR")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
