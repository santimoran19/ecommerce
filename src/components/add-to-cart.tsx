"use client";
import { useCart } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

type Props = { id: string; name: string; price: number; image?: string; disabled?: boolean };

export function AddToCart({ id, name, price, image, disabled }: Props) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (disabled) return;
    add({ id, name, price, image: image ?? "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={!disabled && !added ? "btn-primary" : ""}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 16px",
        borderRadius: "var(--radius-sm)",
        background: disabled ? "var(--border)" : added ? "#16a34a" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
        color: disabled ? "var(--text-muted)" : "white",
        fontSize: 13,
        fontWeight: 600,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        letterSpacing: "0.01em",
        boxShadow: disabled ? "none" : added ? "0 2px 8px rgba(22,163,74,0.35)" : "0 2px 8px rgba(99,102,241,0.3)",
        transform: added ? "scale(0.98)" : "scale(1)",
      }}
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {disabled ? "Sin stock" : added ? "¡Agregado!" : "Agregar al carrito"}
    </button>
  );
}
