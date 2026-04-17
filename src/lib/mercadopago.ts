import { MercadoPagoConfig, Preference } from "mercadopago";
export const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
export const preference = new Preference(mp);
