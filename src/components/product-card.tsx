import Link from "next/link";
import { AddToCart } from "./add-to-cart";

type Props = {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  image?: string;
  category?: string;
  stock?: number;
};

export function ProductCard({ id, name, slug, price, image, category, stock = 1 }: Props) {
  return (
    <div className="card-hover" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "var(--shadow-sm)",
    }}
    >
      {/* Image */}
      <Link href={`/products/${slug}`} style={{ display: "block", position: "relative" }}>
        <div style={{ aspectRatio: "1/1", background: "linear-gradient(135deg, var(--bg-subtle), var(--bg))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {image
            ? <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
            : <span style={{ fontSize: 64, opacity: 0.5 }}>📦</span>
          }
        </div>
        {stock === 0 && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "var(--danger)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>
            Sin stock
          </div>
        )}
        {stock > 0 && stock <= 5 && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "#f59e0b", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>
            ¡Últimos!
          </div>
        )}
      </Link>

      {/* Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {category && (
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", background: "var(--primary-bg)", padding: "3px 10px", borderRadius: 99, width: "fit-content", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {category}
          </span>
        )}
        <Link href={`/products/${slug}`}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
            {name}
          </h3>
        </Link>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
            ${Number(price).toLocaleString("es-AR")}
          </p>
          <AddToCart id={id} name={name} price={Number(price)} image={image} disabled={stock === 0} />
        </div>
      </div>
    </div>
  );
}
