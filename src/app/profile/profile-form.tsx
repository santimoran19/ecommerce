"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, AlertCircle, Upload, User } from "lucide-react";

export default function ProfileForm({ initialName, initialImage }: { initialName: string; initialImage: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setImage(data.url);
    else setError(data.error ?? "Error al subir imagen");
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setSuccess(false); setError("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    setLoading(false);
    if (res.ok) { setSuccess(true); await update(); router.refresh(); }
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
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 10 }}>Foto de perfil</label>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {image
            ? <img src={image} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            : <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-subtle)", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><User size={24} color="var(--text-light)" /></div>
          }
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: uploading ? "var(--text-muted)" : "var(--text)", fontSize: 13, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", width: "fit-content" }}>
              <Upload size={14} /> {uploading ? "Subiendo..." : "Subir imagen"}
              <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading} onChange={handleFileUpload} />
            </label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="o pegar URL..."
              style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, outline: "none" }}
            />
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className={loading ? "" : "btn-primary"} style={{
        padding: "12px", borderRadius: "var(--radius-sm)", background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
        color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 2px 8px rgba(99,102,241,0.3)", marginTop: 4,
      }}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
