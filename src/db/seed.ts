import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, categories, products } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
const db = drizzle(pool);

const CATS = [
  { name: "Smartphones",  slug: "smartphones" },
  { name: "Computación",  slug: "computacion" },
  { name: "Gaming",       slug: "gaming" },
  { name: "Audio",        slug: "audio" },
  { name: "Electrónica",  slug: "electronica" },
  { name: "Accesorios",   slug: "accesorios" },
];

const IMG = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&auto=format&q=80`;

// Picsum con seed fijo = imagen consistente y siempre disponible
const PIC = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

async function main() {
  await db.insert(users).values({
    email: "admin@demo.com", name: "Admin",
    role: "ADMIN", password: await bcrypt.hash("admin123", 10),
  }).onConflictDoNothing();

  await db.insert(categories).values(CATS).onConflictDoNothing();
  const existing = await db.select().from(categories);
  const catMap = Object.fromEntries(existing.map(c => [c.slug, c.id]));

  const PRODUCTS = [
    // ── Smartphones ──────────────────────────────────────────
    {
      name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max",
      description: "El iPhone más potente con chip A17 Pro, cámara de 48 MP y pantalla ProMotion de 120Hz. Titanio grado 5.",
      price: "1850000", stock: 8, featured: true, categoryId: catMap["smartphones"],
      images: [IMG("1592750475338-74b7b21085ab"), IMG("1510557880182-3d4d3cba35a5")],
    },
    {
      name: "Samsung Galaxy S24 Ultra", slug: "samsung-s24-ultra",
      description: "Pantalla Dynamic AMOLED 2X de 6.8\", S Pen integrado, cámara de 200 MP y batería de 5000 mAh.",
      price: "1650000", stock: 12, featured: true, categoryId: catMap["smartphones"],
      images: [IMG("1511707171634-5f897ff02aa9"), IMG("1592890288564-76294ab70297")],
    },
    {
      name: "Motorola Edge 50 Pro", slug: "motorola-edge-50-pro",
      description: "Pantalla pOLED de 144Hz, carga inalámbrica 50W, cámara principal de 50 MP con OIS.",
      price: "680000", stock: 20, categoryId: catMap["smartphones"],
      images: [IMG("1580910051074-3eb694886505"), IMG("1592750475338-74b7b21085ab")],
    },
    {
      name: "Xiaomi 14", slug: "xiaomi-14",
      description: "Chip Snapdragon 8 Gen 3, sistema de cámaras Leica, pantalla AMOLED de 6.36\" a 120Hz.",
      price: "920000", stock: 15, categoryId: catMap["smartphones"],
      images: [IMG("1610945264561-4d6d74b28b97"), IMG("1511707171634-5f897ff02aa9")],
    },
    {
      name: "Google Pixel 8", slug: "google-pixel-8",
      description: "IA avanzada con Google Tensor G3, cámara de 50 MP, 7 años de actualizaciones garantizadas.",
      price: "1100000", stock: 6, categoryId: catMap["smartphones"],
      images: [IMG("1556656793-608bf1519bfc"), IMG("1592750475338-74b7b21085ab")],
    },

    // ── Computación ───────────────────────────────────────────
    {
      name: "MacBook Pro M3 14\"", slug: "macbook-pro-m3-14",
      description: "Chip Apple M3 Pro, 18 GB RAM unificada, SSD de 512 GB, pantalla Liquid Retina XDR con ProMotion.",
      price: "3200000", stock: 4, featured: true, categoryId: catMap["computacion"],
      images: [IMG("1517336714731-489689fd1ca8"), IMG("1496181133206-80ce9b88a853")],
    },
    {
      name: "Dell XPS 15 OLED", slug: "dell-xps-15-oled",
      description: "Intel Core i7-13700H, 32 GB DDR5, SSD 1 TB, pantalla OLED 3.5K táctil de 15.6\".",
      price: "2400000", stock: 5, categoryId: catMap["computacion"],
      images: [IMG("1484788984921-03950022c9ef"), IMG("1517336714731-489689fd1ca8")],
    },
    {
      name: "Lenovo ThinkPad X1 Carbon", slug: "thinkpad-x1-carbon",
      description: "Ultrabook empresarial con Core i7, 16 GB RAM, SSD 512 GB, 14\" IPS. Solo 1.12 kg.",
      price: "1850000", stock: 7, categoryId: catMap["computacion"],
      images: [IMG("1496181133206-80ce9b88a853"), IMG("1484788984921-03950022c9ef")],
    },
    {
      name: "iPad Pro M4 11\"", slug: "ipad-pro-m4-11",
      description: "Pantalla Ultra Retina XDR OLED, chip M4, 256 GB, conectividad WiFi 6E y Thunderbolt 4.",
      price: "1600000", stock: 9, categoryId: catMap["computacion"],
      images: [IMG("1544244015-0df4b3ffc6b0"), IMG("1589739902098-a8dbc17ef0fc")],
    },
    {
      name: "Monitor LG UltraWide 34\"", slug: "monitor-lg-ultrawide-34",
      description: "Panel IPS Nano de 3440×1440, 144Hz, HDR600, AMD FreeSync Premium Pro, curvado.",
      price: "720000", stock: 11, categoryId: catMap["computacion"],
      images: [IMG("1527443224154-c4a3942d3acf"), IMG("1593640408182-31c228f5e8be")],
    },

    // ── Gaming ────────────────────────────────────────────────
    {
      name: "PlayStation 5 Slim", slug: "ps5-slim",
      description: "Consola de última generación con SSD ultrarrápido, ray tracing, 4K a 120fps y DualSense.",
      price: "850000", stock: 6, featured: true, categoryId: catMap["gaming"],
      images: [IMG("1606144042614-b2417a99cabd"), IMG("1607853202419-6531e36bd80d")],
    },
    {
      name: "Xbox Series X", slug: "xbox-series-x",
      description: "12 teraflops de GPU, SSD NVMe de 1 TB, 4K a 120fps, retrocompatibilidad completa.",
      price: "780000", stock: 8, categoryId: catMap["gaming"],
      images: [IMG("1621259182978-f5e45f1c58db"), IMG("1605901309584-818e25960a8f")],
    },
    {
      name: "Nintendo Switch OLED", slug: "nintendo-switch-oled",
      description: "Pantalla OLED de 7\", soporte mejorado, 64 GB de almacenamiento, audio mejorado.",
      price: "480000", stock: 15, categoryId: catMap["gaming"],
      images: [IMG("1578303512597-81e6cc155b3e"), IMG("1593305841991-05c297ba4575")],
    },
    {
      name: "Silla Gamer RGB Pro", slug: "silla-gamer-rgb",
      description: "Respaldo reclinable 180°, soporte lumbar ajustable, reposabrazos 4D, espuma viscoelástica.",
      price: "180000", stock: 20, categoryId: catMap["gaming"],
      images: [PIC("gaming-chair-1"), PIC("gaming-chair-2")],
    },
    {
      name: "Teclado Mecánico HyperX Alloy", slug: "teclado-hyperx-alloy",
      description: "Switches Red lineales, iluminación RGB por tecla, frame de acero, anti-ghosting completo.",
      price: "95000", stock: 25, categoryId: catMap["gaming"],
      images: [IMG("1587829741301-dc798b83add3"), IMG("1595044426077-d36d9236d54a")],
    },
    {
      name: "Mouse Logitech G Pro X", slug: "mouse-logitech-gpro",
      description: "Sensor HERO 25K, 25.600 DPI, 7 botones programables, diseño simétrico para ambas manos.",
      price: "72000", stock: 30, categoryId: catMap["gaming"],
      images: [IMG("1527814050087-3793815479db"), IMG("1615663245857-ac4048f8d2b6")],
    },

    // ── Audio ─────────────────────────────────────────────────
    {
      name: "AirPods Pro 2", slug: "airpods-pro-2",
      description: "Cancelación activa de ruido adaptativa, audio espacial personalizado, resistencia IP54.",
      price: "420000", stock: 18, featured: true, categoryId: catMap["audio"],
      images: [IMG("1600294037681-c80ded778dbb"), IMG("1606220945770-b5b6af067c88")],
    },
    {
      name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5",
      description: "Mejor cancelación de ruido del mercado, 30 hs de batería, LDAC hi-res, llamadas perfectas.",
      price: "380000", stock: 14, categoryId: catMap["audio"],
      images: [IMG("1505740420928-5e560c06d30e"), IMG("1484704849700-f032a568e944")],
    },
    {
      name: "JBL Flip 6", slug: "jbl-flip-6",
      description: "Sonido estéreo potente, IP67 resistente al agua, 12 hs de batería, PartyBoost.",
      price: "95000", stock: 35, categoryId: catMap["audio"],
      images: [IMG("1608043152269-423dbba4e7e1"), IMG("1545454675-3b6f536f1e24")],
    },
    {
      name: "Sennheiser Momentum 4", slug: "sennheiser-momentum-4",
      description: "60 hs de batería, cancelación adaptativa, aptX Adaptive, sonido Hi-Fi audiófilo.",
      price: "290000", stock: 8, categoryId: catMap["audio"],
      images: [IMG("1583394293861-f87a0b640ac9"), IMG("1505740420928-5e560c06d30e")],
    },

    // ── Electrónica ───────────────────────────────────────────
    {
      name: "Apple Watch Series 9", slug: "apple-watch-series-9",
      description: "Chip S9 SiP, pantalla Retina siempre activa, doble tap, ECG, SpO2, GPS + Cellular.",
      price: "750000", stock: 10, categoryId: catMap["electronica"],
      images: [IMG("1523275335684-37898b6baf30"), IMG("1434493789847-2f02dc6ca35d")],
    },
    {
      name: "GoPro HERO 12 Black", slug: "gopro-hero-12",
      description: "Video 5.3K60, HDR, estabilización HyperSmooth 6.0, sumergible 10 m sin carcasa.",
      price: "520000", stock: 12, categoryId: catMap["electronica"],
      images: [IMG("1502920917128-1aa500764b47"), IMG("1473968512647-3e447244af8f")],
    },
    {
      name: "DJI Mini 4 Pro", slug: "dji-mini-4-pro",
      description: "Drone compacto con video 4K/60fps, obstáculos omnidireccionales, 34 min de vuelo.",
      price: "1200000", stock: 5, categoryId: catMap["electronica"],
      images: [IMG("1507582762487-b27bc3c0a70c"), IMG("1473968512647-3e447244af8f")],
    },
    {
      name: "Kindle Paperwhite", slug: "kindle-paperwhite",
      description: "Pantalla 6.8\" sin reflejos, retroiluminada, 16 GB, IPX8, batería para semanas.",
      price: "150000", stock: 22, categoryId: catMap["electronica"],
      images: [IMG("1512499617640-c74ae3a79d37"), IMG("1530538987-6e6b2440a9e0")],
    },

    // ── Accesorios ────────────────────────────────────────────
    {
      name: "MagSafe Charger 15W", slug: "magsafe-charger-15w",
      description: "Carga inalámbrica magnética 15W para iPhone 12 y superiores, compatible con Qi.",
      price: "45000", stock: 40, categoryId: catMap["accesorios"],
      images: [IMG("1609091839311-d5365f9ff1c5"), IMG("1585771724684-38798054ea0a")],
    },
    {
      name: "Hub USB-C 10 en 1", slug: "hub-usbc-10en1",
      description: "HDMI 4K, 3×USB-A 3.0, 2×USB-C, SD/microSD, RJ45 Gigabit, audio 3.5mm.",
      price: "38000", stock: 50, categoryId: catMap["accesorios"],
      images: [IMG("1558618666-fcd25c85cd64"), IMG("1625772299848-391b6a87d7b3")],
    },
    {
      name: "Mochila Laptop 15.6\"", slug: "mochila-laptop-156",
      description: "Impermeable, puerto USB de carga, compartimento anti-robo, espuma EVA de protección.",
      price: "42000", stock: 35, categoryId: catMap["accesorios"],
      images: [IMG("1553062407-98eeb64c6a62"), IMG("1491637639811-60e2756cc1c7")],
    },
    {
      name: "Soporte Monitor Doble", slug: "soporte-monitor-doble",
      description: "Brazos articulados para dos monitores hasta 27\", VESA 75/100, gestión de cables.",
      price: "68000", stock: 18, categoryId: catMap["accesorios"],
      images: [IMG("1593642632559-0c6d3fc62b89"), IMG("1527443224154-c4a3942d3acf")],
    },
    {
      name: "Webcam Logitech C920 HD", slug: "webcam-logitech-c920",
      description: "Video Full HD 1080p/30fps, lente Carl Zeiss, corrección de luz automática, micrófono estéreo.",
      price: "55000", stock: 28, categoryId: catMap["accesorios"],
      images: [IMG("1610465299996-89f7e205ae68"), IMG("1593640408182-31c228f5e8be")],
    },
  ];

  // Upsert: update images for existing products, insert new ones
  for (const p of PRODUCTS) {
    const [existing] = await db.select({ id: products.id }).from(products)
      .where(eq(products.slug, p.slug));
    if (existing) {
      await db.update(products).set({ images: p.images as string[] })
        .where(eq(products.id, existing.id));
    } else {
      await db.insert(products).values(p as any).onConflictDoNothing();
    }
  }

  console.log(`✅ Seed completo: ${CATS.length} categorías, ${PRODUCTS.length} productos con fotos`);
  await pool.end();
}

main().catch(console.error);
