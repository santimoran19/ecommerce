import { db } from "@/db";
import { orders, users, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { OrderStatusSelect, DeleteOrderButton } from "./order-actions";
import { Package } from "lucide-react";

export default async function AdminOrdersPage() {
  const rows = await db
    .select({ order: orders, user: users })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    rows.map(async ({ order, user }) => {
      const items = await db
        .select({
          qty: orderItems.quantity,
          price: orderItems.price,
          name: products.name,
          slug: products.slug,
          images: products.images,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));
      return { order, user, items };
    })
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.04em" }}>Órdenes</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{rows.length} orden{rows.length !== 1 ? "es" : ""} en total</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {ordersWithItems.length === 0 ? (
          <div style={{ padding: "80px 24px", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <Package size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>Sin órdenes todavía</p>
          </div>
        ) : (
          ordersWithItems.map(({ order: o, user: u, items }) => (
            <div key={o.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {/* Order header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", rowGap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{u?.name ?? u?.email ?? "Usuario eliminado"}</span>
                    {u?.email && (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({u.email})</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    {new Date(o.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>
                    ${Number(o.total).toLocaleString("es-AR")}
                  </span>
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  <DeleteOrderButton orderId={o.id} />
                </div>
              </div>

              {/* Order items */}
              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  {items.length} producto{items.length !== 1 ? "s" : ""} ordenado{items.length !== 1 ? "s" : ""}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name ?? ""} style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 52, height: 52, borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Package size={22} color="var(--text-muted)" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name ?? "Producto eliminado"}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          Cantidad: <strong>{item.qty}</strong> · Precio unitario: <strong>${Number(item.price).toLocaleString("es-AR")}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--primary)" }}>
                          ${(Number(item.price) * item.qty).toLocaleString("es-AR")}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>subtotal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
