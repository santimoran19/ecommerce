import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCart } from "@/components/add-to-cart";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Truck, CreditCard, Shield } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [row] = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));

  if (!row) notFound();
  const { product: p, category: c } = row;

  const perks = [
    { icon: <Truck size={16} />, text: "Envío gratis en compras +$50.000" },
    { icon: <CreditCard size={16} />, text: "12 cuotas sin interés con Mercado Pago" },
    { icon: <Shield size={16} />, text: "Compra 100% segura y protegida" },
    { icon: <CheckCircle size={16} />, text: "Garantía oficial del fabricante" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)", marginBottom: 32, padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <ArrowLeft size={14} /> Volver al catálogo
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="product-detail-grid">
        {/* Image */}
        <div style={{ position: "sticky", top: 88 }}>
          <div style={{ aspectRatio: "1/1", borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            {p.images?.[0]
              ? <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 100, opacity: 0.4 }}>📦</span>
            }
          </div>
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {c && (
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", background: "var(--primary-bg)", padding: "5px 14px", borderRadius: 99, width: "fit-content", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {c.name}
            </span>
          )}

          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>{p.name}</h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <p style={{ fontSize: 40, fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.05em" }}>
              ${Number(p.price).toLocaleString("es-AR")}
            </p>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>ARS</span>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stock > 0 ? "var(--success)" : "var(--danger)", boxShadow: p.stock > 0 ? "0 0 8px rgba(34,197,94,0.6)" : "0 0 8px rgba(239,68,68,0.6)", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: p.stock > 0 ? "var(--success)" : "var(--danger)" }}>
              {p.stock > 0 ? `${p.stock} unidades disponibles` : "Sin stock"}
            </span>
            {p.stock > 0 && p.stock <= 5 && (
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "2px 10px", borderRadius: 99 }}>¡Últimos!</span>
            )}
          </div>

          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7 }}>{p.description}</p>

          <AddToCart id={p.id} name={p.name} price={Number(p.price)} image={p.images?.[0]} disabled={p.stock === 0} />

          <div style={{ borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < perks.length - 1 ? "1px solid var(--border)" : "none", fontSize: 13, color: "var(--text-muted)" }}>
                <span style={{ color: "var(--primary)", flexShrink: 0 }}>{perk.icon}</span>
                {perk.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
