import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Sin archivo" }, { status: 400 });

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!allowed.includes(file.type))
    return NextResponse.json({ error: "Formato no permitido. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "La imagen no puede superar 5 MB." }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
