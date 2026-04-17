import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mp } from "@/lib/mercadopago";
import { Payment } from "mercadopago";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.type !== "payment") return NextResponse.json({ ok: true });
  const payment = await new Payment(mp).get({ id: body.data.id });
  const orderId = payment.external_reference;
  if (!orderId) return NextResponse.json({ ok: true });
  await db.update(orders)
    .set({ status: payment.status === "approved" ? "PAID" : "PENDING", mpPaymentId: String(payment.id) })
    .where(eq(orders.id, orderId));
  return NextResponse.json({ ok: true });
}
