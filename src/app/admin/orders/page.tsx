import { db } from "@/db";
import { orders, users, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const rows = await db
    .select({ order: orders, user: users })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    rows.map(async ({ order, user }) => {
      const items = await db
        .select({ qty: orderItems.quantity, price: orderItems.price, name: products.name, slug: products.slug, images: products.images })
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
      <OrdersTable rows={ordersWithItems} />
    </div>
  );
}
