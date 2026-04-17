import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

export default async function Home() {
  const [rows, cats] = await Promise.all([
    db.select({ product: products, category: categories })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt))
      .limit(8),
    db.select().from(categories),
  ]);

  const features = [
    { icon: <Truck size={22} />, title: "Envío gratis", desc: "En compras +$50.000" },
    { icon: <CreditCard size={22} />, title: "12 cuotas sin interés", desc: "Con todas las tarjetas" },
    { icon: <ShieldCheck size={22} />, title: "Compra segura", desc: "Datos protegidos" },
    { icon: <Headphones size={22} />, title: "Soporte 24/7", desc: "Siempre disponibles" },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)", minHeight: 520, display: "flex", alignItems: "center" }}>
        {/* Blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>NUEVOS PRODUCTOS DISPONIBLES</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
              Tecnología al{" "}
              <span style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                mejor precio
              </span>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 36, lineHeight: 1.6, maxWidth: 480 }}>
              Los mejores productos de tecnología con envío a todo el país y hasta 12 cuotas sin interés.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 99, background: "white", color: "#4f46e5", fontWeight: 700, fontSize: 15, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", letterSpacing: "-0.01em", transition: "transform 0.15s" }}>
                Ver catálogo →
              </Link>
              <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 99, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontWeight: 600, fontSize: 15, backdropFilter: "blur(10px)", letterSpacing: "-0.01em" }}>
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {features.map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 24px", borderRight: "1px solid var(--border)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-bg)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>{f.title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* ── CATEGORIES ─────────────────────────── */}
        {cats.length > 0 && (
          <section style={{ paddingTop: 48, paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>Categorías</h2>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {cats.map((c) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} style={{
                  padding: "10px 22px",
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--primary)",
                  background: "var(--primary-bg)",
                  border: "1px solid transparent",
                  transition: "all 0.15s",
                  letterSpacing: "0.01em",
                }}>
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── PRODUCTS ───────────────────────────── */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>Productos destacados</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{rows.length} productos disponibles</p>
            </div>
            <Link href="/products" style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)", display: "flex", alignItems: "center", gap: 4 }}>
              Ver todos →
            </Link>
          </div>

          {rows.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
              <p style={{ fontSize: 18, fontWeight: 600 }}>No hay productos todavía</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {rows.map(({ product: p, category: c }) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={p.price} image={p.images?.[0]} category={c?.name} stock={p.stock} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── BANNER ─────────────────────────────── */}
      <section style={{ margin: "0 24px 64px", borderRadius: 24, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", padding: "60px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
        <div style={{ position: "absolute", top: -60, right: 100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>MERCADO PAGO</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
            Pagá en hasta 12 cuotas<br />sin interés
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 400 }}>
            Todas las tarjetas de crédito. Débito, efectivo y transferencia también aceptados.
          </p>
        </div>
        <Link href="/products" style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 99, background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 15, boxShadow: "0 4px 20px rgba(99,102,241,0.4)", whiteSpace: "nowrap", flexShrink: 0 }}>
          Comprar ahora →
        </Link>
      </section>
    </>
  );
}
