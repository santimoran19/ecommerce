"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Error al registrar"); return; }
    if (data.devUrl) { router.push(data.devUrl); return; }
    router.push("/verify-email");
  }

  const perks = [
    "Historial de compras y seguimiento",
    "Descuentos exclusivos para miembros",
    "Checkout más rápido con datos guardados",
    "Notificaciones de ofertas y stock",
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }} className="hidden lg:flex">
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={28} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>EcommercePro</span>
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 14 }}>
            Tu cuenta,<br />tus beneficios
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Registrate gratis y accedé a una experiencia de compra personalizada.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {perks.map((perk) => (
              <div key={perk} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={12} color="#818cf8" />
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: "100%", maxWidth: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: "var(--bg)" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 6 }}>Crear cuenta gratis</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Completá tus datos para empezar</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "var(--danger)", fontSize: 14 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Nombre completo</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre y apellido"
                  style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 15, outline: "none" }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com"
                  style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 15, outline: "none" }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres"
                  style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 15, outline: "none" }} />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Usá al menos 6 caracteres con letras y números.</p>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: "14px", borderRadius: "var(--radius-sm)", marginTop: 4,
              background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
              color: "white", fontWeight: 700, fontSize: 15, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
            }}>
              {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
            </button>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
              Al registrarte aceptás nuestros{" "}
              <span style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>Términos y condiciones</span>
              {" "}y la{" "}
              <span style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>Política de privacidad</span>.
            </p>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
