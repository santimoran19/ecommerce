"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, ImagePlus, Minus, Upload } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Product = { id: string; name: string; slug: string; description: string; price: string; stock: number; categoryId: string; images: string[] | null };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
      <div style={{ width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg-card)", zIndex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", margin: 0 }}>{title}</h2>
          <button onClick={onClose} className="btn-icon" style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", borderRadius: "var(--radius-sm)" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--radius-sm)",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: 14,
  outline: "none",
};

function ProductForm({ product, categories, onClose }: { product?: Product; categories: Category[]; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    images: product?.images ?? [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  async function handleFileUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [i]: true }));
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(prev => ({ ...prev, [i]: false }));
    if (data.url) setImage(i, data.url);
    else setError(data.error ?? "Error al subir imagen");
    e.target.value = "";
  }

  function autoSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function setImage(i: number, val: string) {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm({ ...form, images: imgs });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const cleanImages = form.images.filter(Boolean);
    const method = product ? "PUT" : "POST";
    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, images: cleanImages }) });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <div style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>NOMBRE *</label>
          <input required value={form.name} onChange={e => { setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) }); }} placeholder="iPhone 16 Pro Max" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>SLUG (URL)</label>
          <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="iphone-16-pro-max" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>CATEGORÍA *</label>
          <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>PRECIO (ARS) *</label>
          <input type="number" min="0" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="299999" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>STOCK *</label>
          <input type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} placeholder="10" style={inputStyle} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>DESCRIPCIÓN</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción del producto..." style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em" }}>IMÁGENES</label>
            <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ""] })} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>
              <ImagePlus size={14} /> Agregar imagen
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {img
                  ? <img src={img} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div style={{ width: 44, height: 44, borderRadius: 6, border: "1px dashed var(--border)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><ImagePlus size={16} color="var(--text-light)" /></div>
                }
                <label style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: uploading[i] ? "var(--text-muted)" : "var(--text)", fontSize: 12, fontWeight: 600, cursor: uploading[i] ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  <Upload size={13} /> {uploading[i] ? "Subiendo..." : "Subir archivo"}
                  <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading[i]} onChange={e => handleFileUpload(i, e)} />
                </label>
                <input value={img} onChange={e => setImage(i, e.target.value)} placeholder="o pegar URL..." style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} style={{ padding: 6, background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", color: "#dc2626", flexShrink: 0 }}>
                    <Minus size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading} className={loading ? "" : "btn-primary"} style={{ flex: 2, padding: "12px", borderRadius: "var(--radius-sm)", background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 2px 8px rgba(99,102,241,0.3)" }}>
          {loading ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

export function AdminProductActions({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);

  async function handleDelete() {
    if (!product || !confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!product) {
    return (
      <>
        <button onClick={() => setModal("create")} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}>
          <Plus size={16} /> Nuevo producto
        </button>
        {modal === "create" && (
          <Modal title="Nuevo producto" onClose={() => setModal(null)}>
            <ProductForm categories={categories} onClose={() => setModal(null)} />
          </Modal>
        )}
      </>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button onClick={() => setModal("edit")} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-subtle)", color: "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
        <Pencil size={13} /> Editar
      </button>
      <button onClick={handleDelete} className="btn-danger" style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
        <Trash2 size={13} /> Eliminar
      </button>
      {modal === "edit" && (
        <Modal title="Editar producto" onClose={() => setModal(null)}>
          <ProductForm product={product} categories={categories} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
