"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import Link from "next/link";

type Review = {
  review: { id: string; rating: number; comment: string | null; createdAt: string; userId: string };
  user: { name: string | null; email: string; image: string | null } | null;
};

function StarRow({ value, onChange, size = 22 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{ background: "none", border: "none", padding: 2, cursor: onChange ? "pointer" : "default", lineHeight: 0 }}
        >
          <Star
            size={size}
            fill={(hovered || value) >= n ? "#f59e0b" : "none"}
            color={(hovered || value) >= n ? "#f59e0b" : "var(--border)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.review.rating, 0) / reviews.length;
}

export function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setCanReview(data.canReview ?? false);
    setLoading(false);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  const myReview = user ? reviews.find(r => r.review.userId === (user as any).id) : null;

  useEffect(() => {
    if (myReview) { setRating(myReview.review.rating); setComment(myReview.review.comment ?? ""); }
  }, [myReview?.review.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Seleccioná una puntuación"); return; }
    setSubmitting(true); setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    setSubmitting(false);
    if (res.ok) { await load(); }
    else { const d = await res.json(); setError(d.error ?? "Error al guardar"); }
  }

  const avg = avgRating(reviews);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", borderRadius: "var(--radius-sm)",
    background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none",
  };

  return (
    <section style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em", margin: 0 }}>
          Reseñas
        </h2>
        {reviews.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StarRow value={Math.round(avg)} size={18} />
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text)" }}>{avg.toFixed(1)}</span>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>({reviews.length} reseña{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: user ? "1fr 1fr" : "1fr", gap: 40, alignItems: "start" }} className="reviews-grid">

        {/* Form */}
        {user && canReview ? (
          <div style={{ padding: "28px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 20px" }}>
              {myReview ? "Editar tu reseña" : "Escribir una reseña"}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "10px 13px", borderRadius: "var(--radius-sm)", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>
                  {error}
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>PUNTUACIÓN *</label>
                <StarRow value={rating} onChange={setRating} size={28} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>COMENTARIO (opcional)</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Contá tu experiencia con el producto..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <button type="submit" disabled={submitting} className={submitting ? "" : "btn-primary"} style={{
                padding: "11px", borderRadius: "var(--radius-sm)",
                background: submitting ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)",
                color: "white", fontWeight: 700, fontSize: 14, border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
              }}>
                {submitting ? "Guardando..." : myReview ? "Actualizar reseña" : "Publicar reseña"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: "28px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}>
            <Star size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
            {!user ? (
              <>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Iniciá sesión para dejar tu reseña</p>
                <Link href="/login" className="btn-primary" style={{ display: "inline-block", marginTop: 8, padding: "10px 24px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14 }}>
                  Iniciar sesión
                </Link>
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Solo podés reseñar productos que compraste</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Comprá este producto para poder dejar una reseña.</p>
              </>
            )}
          </div>
        )}

        {/* Review list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Cargando reseñas...</p>
          ) : reviews.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Todavía no hay reseñas. ¡Sé el primero!</p>
            </div>
          ) : (
            reviews.map(({ review: r, user: u }) => {
              const initials = (u?.name || u?.email || "?").slice(0, 2).toUpperCase();
              return (
                <div key={r.id} style={{ padding: "18px 20px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    {u?.image ? (
                      <img src={u.image} alt={u.name || ""} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>
                        {initials}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{u?.name || u?.email || "Usuario"}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(r.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <StarRow value={r.rating} size={15} />
                  </div>
                  {r.comment && <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{r.comment}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
