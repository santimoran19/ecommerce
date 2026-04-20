"use client";
import { useState, Suspense, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Store, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const verified = params.get("verified");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  useEffect(() => { if (status === "authenticated") router.replace("/"); }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) {
      if (res.error.includes("email_not_verified")) {
        setError("Debés verificar tu email antes de ingresar. Revisá tu casilla.");
      } else {
        setError("Email o contraseña incorrectos");
      }
      return;
    }
    router.push("/"); router.refresh();
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 6 }}>Bienvenido de nuevo</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Ingresá con tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {verified && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: "var(--radius-sm)", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 14 }}>
            <CheckCircle size={16} /> Email verificado correctamente. ¡Ya podés ingresar!
          </div>
        )}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "var(--danger)", fontSize: 14 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Email</label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com"
              style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 15, outline: "none" }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Contraseña</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
              style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 15, outline: "none" }} />
          </div>
        </div>
        <button type="submit" disabled={loading} className={loading ? "" : "btn-primary"} style={{
          padding: "14px", borderRadius: "var(--radius-sm)", background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
          color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 16px rgba(99,102,241,0.35)", marginTop: 4,
        }}>
          {loading ? "Ingresando..." : "Ingresar →"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "var(--text-muted)" }}>
        ¿No tenés cuenta?{" "}
        <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Registrate gratis</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }} className="auth-left">
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <Store size={36} color="white" />
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 12 }}>EcommercePro</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.6, maxWidth: 300 }}>La mejor tienda de tecnología con los precios más competitivos.</p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
            {["🚀 Más de 1.000 productos", "💳 12 cuotas sin interés", "🚚 Envío gratis +$50.000"].map(f => (
              <div key={f} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right" style={{ width: "100%", maxWidth: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: "var(--bg)" }}>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
