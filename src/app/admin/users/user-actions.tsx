"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        padding: "4px 12px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        border: "1px solid transparent",
        ...(isAdmin
          ? { color: "#7c3aed", background: "#ede9fe" }
          : { color: "#6b7280", background: "#f3f4f6" }),
      }}
    >
      {isAdmin ? "Admin" : "Usuario"}
    </button>
  );
}
