"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";

/* ── Role toggle ─────────────────────────────────── */
export function UserRoleToggle({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isAdmin = currentRole === "ADMIN";

  async function toggle() {
    if (!confirm(isAdmin ? "¿Quitar rol de admin a este usuario?" : "¿Darle rol de admin a este usuario?")) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: isAdmin ? "USER" : "ADMIN" }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="btn-ghost"
      style={{
        padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
        cursor: "pointer", border: "1px solid transparent",
        ...(isAdmin ? { color: "#7c3aed", background: "#ede9fe" } : { color: "#6b7280", background: "#f3f4f6" }),
      }}
    >
      {isAdmin ? "Admin" : "Usuario"}
    </button>
  );
}

/* ── Delete user ─────────────────────────────────── */
export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); alert(d.error ?? "Error"); return; }
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn-danger"
      title="Eliminar usuario"
      style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
    >
      <Trash2 size={12} /> {loading ? "..." : "Eliminar"}
    </button>
  );
}

/* ── Create user modal ───────────────────────────── */
const inputSt: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: "var(--radius-sm)",
  background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none",
};

export function CreateUserButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    setOpen(false);
    setForm({ name: "", email: "", password: "", role: "USER" });
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary"
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
      >
        <Plus size={16} /> Nuevo usuario
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
          <div style={{ width: "100%", maxWidth: 460, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", margin: 0 }}>Nuevo usuario</h2>
              <button onClick={() => setOpen(false)} className="btn-icon" style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", borderRadius: "var(--radius-sm)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "10px 13px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>{error}</div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>NOMBRE</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Juan García" style={inputSt} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>EMAIL *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="juan@ejemplo.com" style={inputSt} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>CONTRASEÑA *</label>
                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" style={inputSt} minLength={6} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>ROL *</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputSt}>
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost" style={{ flex: 1, padding: "11px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className={loading ? "" : "btn-primary"} style={{ flex: 2, padding: "11px", borderRadius: "var(--radius-sm)", background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
