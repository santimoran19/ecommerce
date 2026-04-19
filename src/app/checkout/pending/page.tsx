import Link from "next/link";

export default function PendingPage() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>⏳</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.03em" }}>Pago en proceso</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.7 }}>
        Tu pago está siendo procesado por Mercado Pago.
      </p>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.7, fontSize: 14 }}>
        Recibirás una notificación cuando se confirme. Esto puede tardar unos minutos.
      </p>
      <Link
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 99, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 600, fontSize: 15, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
