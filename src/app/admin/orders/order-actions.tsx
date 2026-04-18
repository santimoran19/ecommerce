"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";

const STATUSES = [
  { value: "PENDING",   label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  { value: "PAID",      label: "Pagado",     color: "#16a34a", bg: "#dcfce7" },
  { value: "SHIPPED",   label: "Enviado",    color: "#2563eb", bg: "#dbeafe" },
  { value: "DELIVERED", label: "Entregado",  color: "#7c3aed", bg: "#ede9fe" },
  { value: "CANCELLED", label: "Cancelado",  color: "#dc2626", bg: "#fee2e2" },
];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const current = STATUSES.find(s => s.value === currentStatus) ?? STATUSES[0];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        style={{
          padding: "6px 32px 6px 12px",
          borderRadius: 99,
          fontSize: 12,
          fontWeight: 700,
          color: current.color,
          background: current.bg,
          border: `1.5px solid ${current.color}40`,
          cursor: "pointer",
          outline: "none",
          appearance: "none",
          WebkitAppearance: "none",
        }}
      >
        {STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: current.color, pointerEvents: "none" }} />
    </div>
  );
}

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="btn-danger" style={{ padding: "6px 8px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
      <Trash2 size={13} /> Eliminar
    </button>
  );
}
