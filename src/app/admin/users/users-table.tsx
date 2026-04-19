"use client";
import { useState, useMemo } from "react";
import { UserRoleToggle, DeleteUserButton } from "./user-actions";
import { Search, X, Calendar } from "lucide-react";

type UserRow = { id: string; name: string | null; email: string; role: string; emailVerified: Date | null; image: string | null; createdAt: Date; totalOrders: number; totalSpent: string };

const inputSt: React.CSSProperties = { padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" };

export function UsersTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => users.filter(u => {
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (verifiedFilter === "yes" && !u.emailVerified) return false;
    if (verifiedFilter === "no" && u.emailVerified) return false;
    if (dateFrom && new Date(u.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(u.createdAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  }), [users, search, roleFilter, verifiedFilter, dateFrom, dateTo]);

  const hasFilters = search || roleFilter !== "all" || verifiedFilter !== "all" || dateFrom || dateTo;

  function clearFilters() {
    setSearch(""); setRoleFilter("all"); setVerifiedFilter("all"); setDateFrom(""); setDateTo("");
  }

  return (
    <div>
      {/* Filters */}
      <div className="admin-filters" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, padding: "16px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre o email..." style={{ ...inputSt, paddingLeft: 32 }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputSt, flex: "0 1 150px" }}>
          <option value="all">Todos los roles</option>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value)} style={{ ...inputSt, flex: "0 1 170px" }}>
          <option value="all">Verificación: todos</option>
          <option value="yes">Email verificado</option>
          <option value="no">Sin verificar</option>
        </select>
        <div style={{ display: "flex", gap: 6, flex: "0 1 250px" }}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inputSt, flex: 1 }} title="Desde" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inputSt, flex: 1 }} title="Hasta" />
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-clear" style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length} usuario{filtered.length !== 1 ? "s" : ""} {hasFilters ? "encontrados" : "en total"}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)" }}>
                {["Usuario", "Email", "Rol", "Pedidos", "Total gastado", "Verificado", "Registrado", ""].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const initials = (u.name || u.email || "U").slice(0, 2).toUpperCase();
                return (
                  <tr key={u.id} className="table-row-hover" style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {u.image ? (
                          <img src={u.image} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>
                            {initials}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>{u.name ?? "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: "14px 20px" }}><UserRoleToggle userId={u.id} currentRole={u.role} /></td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{u.totalOrders}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--primary)" }}>${Number(u.totalSpent).toLocaleString("es-AR")}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, ...(u.emailVerified ? { color: "#16a34a", background: "#dcfce7" } : { color: "#d97706", background: "#fef3c7" }) }}>
                        {u.emailVerified ? "✓ Sí" : "⏳ No"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={12} />
                        {new Date(u.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <DeleteUserButton userId={u.id} userName={u.name ?? u.email} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
