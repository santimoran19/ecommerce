import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { items } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });

  const total = items.reduce((a: number, x: any) => a + x.price * x.quantity, 0);

  const [order] = await db.insert(orders).values({
    userId: (session.user as any).id,
    total: String(total),
  }).returning();

  await db.insert(orderItems).values(
    items.map((x: any) => ({
      orderId: order.id,
      productId: x.id,
      quantity: x.quantity,
      price: String(x.price),
    }))
  );

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token || token.includes("tu-token")) {
    return NextResponse.json({
      error: "mp_not_configured",
      message: "Mercado Pago no está configurado. Agregá tu ACCESS_TOKEN real en el archivo .env",
      orderId: order.id,
    }, { status: 503 });
  }

  try {
    const mp = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(mp);

    const pref = await preference.create({
      body: {
        items: items.map((x: any) => ({
          id: x.id,
          title: x.name,
          unit_price: Math.round(x.price),
          quantity: x.quantity,
          currency_id: "ARS",
        })),
        external_reference: order.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
      },
    });

    return NextResponse.json({ initPoint: pref.init_point, orderId: order.id });
  } catch (err: any) {
    console.error("MP error:", err?.message ?? err);
    return NextResponse.json({
      error: "mp_error",
      message: "Error al crear preferencia de pago. Verificá tu ACCESS_TOKEN de Mercado Pago.",
      orderId: order.id,
    }, { status: 502 });
  }
}
