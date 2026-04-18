"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ProfileForm({ initialName, initialImage }: { initialName: string; initialImage: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setSuccess(false); setError("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    setLoading(false);
    if (res.ok) { setSuccess(true); router.refresh(); }
    else setError("Error al guardar los cambios");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 13 }}>
          <CheckCircle size={15} /> Cambios guardados correctamente
        </div>
      )}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "var(--danger)", fontSize: 13 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
          style={{ width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }}
        />
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>URL de foto de perfil</label>
        <input
          type="url"
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="https://..."
          style={{ width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none" }}
        />
      </div>
      <button type="submit" disabled={loading} style={{
        padding: "12px", borderRadius: "var(--radius-sm)", background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
        color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 2px 8px rgba(99,102,241,0.3)", marginTop: 4,
      }}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
