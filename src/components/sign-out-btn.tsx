"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutBtn() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-danger"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        width: "100%", padding: "13px 16px", borderRadius: "var(--radius-sm)",
        background: "transparent", border: "1px solid #fecaca",
        color: "var(--danger)", fontSize: 14, fontWeight: 600, cursor: "pointer",
        marginTop: 16,
      }}
    >
      <LogOut size={16} /> Cerrar sesión
    </button>
  );
}
