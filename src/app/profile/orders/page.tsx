import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  PAID:      { label: "Pagado",     color: "#16a34a", bg: "#dcfce7" },
  SHIPPED:   { label: "Enviado",    color: "#2563eb", bg: "#dbeafe" },
  DELIVERED: { label: "Entregado",  color: "#7c3aed", bg: "#ede9fe" },
  CANCELLED: { label: "Cancelado",  color: "#dc2626", bg: "#fee2e2" },
};

export default async function ProfileOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select({ qty: orderItems.quantity, price: orderItems.price, name: products.name, slug: products.slug, images: products.images })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/profile" className="btn-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.03em" }}>Mis pedidos</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>{userOrders.length} pedido{userOrders.length !== 1 ? "s" : ""} realizados</p>
          </div>
        </div>

        {ordersWithItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px", display: "block" }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Todavía no hiciste ningún pedido</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Explorá el catálogo y encontrá lo que necesitás.</p>
            <Link href="/products" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14 }}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ordersWithItems.map((order) => {
              const st = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <div key={order.id} style={{ borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
                  {/* Order header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Package size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Pedido <strong style={{ color: "var(--text)" }}>#{order.id.slice(0, 8).toUpperCase()}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ padding: "16px 20px" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name || ""} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Cantidad: {item.qty} · ${Number(item.price).toLocaleString("es-AR")} c/u</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>
                      Total: ${Number(order.total).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
