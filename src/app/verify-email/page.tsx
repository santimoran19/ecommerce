"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const error = params.get("error");

  if (error === "expired") {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertCircle size={32} color="var(--danger)" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>Link expirado</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
          El link de verificación expiró. Registrate nuevamente para recibir uno nuevo.
        </p>
        <Link href="/register" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 15 }}>
          Volver a registrarme
        </Link>
      </div>
    );
  }

  if (error === "invalid") {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertCircle size={32} color="var(--danger)" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>Link inválido</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
          El link de verificación no es válido. Revisá tu email o registrate nuevamente.
        </p>
        <Link href="/register" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 15 }}>
          Volver a registrarme
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <Mail size={36} color="var(--primary)" />
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12 }}>Verificá tu email</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
        Te enviamos un email con un link de confirmación.
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Hacé click en ese link para activar tu cuenta y poder ingresar.
      </p>
      <div style={{ padding: "16px 20px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        ¿No lo encontrás? Revisá la carpeta de spam.
      </div>
      <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
        Volver al inicio de sesión
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "48px 40px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
        <Suspense>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
