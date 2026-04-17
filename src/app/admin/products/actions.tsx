"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Product = { id: string; name: string; slug: string; description: string; price: string; stock: number; categoryId: string };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>{title}</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onClose }: { product?: Product; categories: Category[]; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = product ? "PUT" : "POST";
    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    onClose();
    router.refresh();
  }

  const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {[
        { label: "Nombre", key: "name", type: "text" },
        { label: "Slug (URL)", key: "slug", type: "text" },
        { label: "Precio (ARS)", key: "price", type: "number" },
        { label: "Stock", key: "stock", type: "number" },
      ].map(({ label, key, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</label>
          <input type={type} required value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
            className="px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Descripción</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Categoría</label>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
          {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

export function AdminProductActions({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);

  async function handleDelete() {
    if (!product || !confirm(`¿Eliminar "${product.name}"?`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!product) {
    return (
      <>
        <button onClick={() => setModal("create")} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
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
    <div className="flex items-center gap-2">
      <button onClick={() => setModal("edit")} className="p-2 rounded-lg transition-opacity hover:opacity-70" style={{ color: "var(--primary)" }}>
        <Pencil size={16} />
      </button>
      <button onClick={handleDelete} className="p-2 rounded-lg transition-opacity hover:opacity-70" style={{ color: "#ef4444" }}>
        <Trash2 size={16} />
      </button>
      {modal === "edit" && (
        <Modal title="Editar producto" onClose={() => setModal(null)}>
          <ProductForm product={product} categories={categories} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
