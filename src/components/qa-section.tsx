"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Search, ChevronDown, Send, Shield } from "lucide-react";
import Link from "next/link";

type QRow = {
  question: { id: string; question: string; answer: string | null; answeredAt: string | null; createdAt: string };
  user: { name: string | null; email: string; image: string | null } | null;
};

const VISIBLE = 3;

const inputSt: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: "var(--radius-sm)",
  background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none",
};

export function QASection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  const [items, setItems] = useState<QRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [answerMap, setAnswerMap] = useState<Record<string, string>>({});
  const [answeringId, setAnsweringId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/questions?productId=${productId}`);
    setItems(await res.json());
    setLoading(false);
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(r =>
      r.question.question.toLowerCase().includes(q) ||
      (r.question.answer ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true); setError("");
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, question }),
    });
    setSubmitting(false);
    if (res.ok) { setQuestion(""); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Error"); }
  }

  async function handleAnswer(questionId: string) {
    const answer = answerMap[questionId];
    if (!answer?.trim()) return;
    setAnsweringId(questionId);
    await fetch(`/api/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    setAnsweringId(null);
    setAnswerMap(m => { const n = { ...m }; delete n[questionId]; return n; });
    await load();
  }

  return (
    <section style={{ marginTop: 56, paddingTop: 48, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <MessageCircle size={22} color="var(--primary)" />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em", margin: 0 }}>
          Preguntas ({items.length})
        </h2>
      </div>

      {/* Ask form */}
      {user ? (
        <form onSubmit={handleAsk} style={{ marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="¿Tenés alguna duda sobre este producto?"
              rows={2}
              style={{ ...inputSt, resize: "vertical", minHeight: 56 }}
            />
            {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{error}</p>}
          </div>
          <button type="submit" disabled={submitting || !question.trim()} className={submitting ? "" : "btn-primary"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: "var(--radius-sm)", background: submitting ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: submitting || !question.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>
            <Send size={15} /> {submitting ? "Enviando..." : "Preguntar"}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: 28, padding: "16px 20px", borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <MessageCircle size={18} color="var(--text-muted)" />
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Iniciá sesión</Link> para hacer una pregunta
          </span>
        </div>
      )}

      {/* Search */}
      {items.length > 0 && (
        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setShowAll(true); }}
            placeholder="Buscar preguntas o palabras clave..."
            style={{ ...inputSt, paddingLeft: 36 }}
          />
        </div>
      )}

      {/* Questions list */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Cargando preguntas...</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "32px", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {search ? "No se encontraron preguntas con ese término." : "Todavía no hay preguntas. ¡Sé el primero en preguntar!"}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visible.map(({ question: q, user: u }) => {
              const initials = (u?.name || u?.email || "?").slice(0, 2).toUpperCase();
              const pendingAnswer = answerMap[q.id] ?? "";
              return (
                <div key={q.id} style={{ borderRadius: "var(--radius)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
                  {/* Question */}
                  <div style={{ padding: "16px 20px", display: "flex", gap: 12 }}>
                    {u?.image ? (
                      <img src={u.image} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>
                        {initials}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{u?.name || u?.email || "Usuario"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {new Date(q.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>{q.question}</p>
                    </div>
                  </div>

                  {/* Answer */}
                  {q.answer ? (
                    <div style={{ padding: "14px 20px", background: "var(--primary-bg)", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Shield size={13} color="white" />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", display: "block", marginBottom: 3 }}>RESPUESTA DEL VENDEDOR</span>
                        <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>{q.answer}</p>
                      </div>
                    </div>
                  ) : isAdmin ? (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                      <textarea
                        value={pendingAnswer}
                        onChange={e => setAnswerMap(m => ({ ...m, [q.id]: e.target.value }))}
                        placeholder="Escribir respuesta..."
                        rows={2}
                        style={{ ...inputSt, flex: 1, resize: "vertical" }}
                      />
                      <button
                        onClick={() => handleAnswer(q.id)}
                        disabled={answeringId === q.id || !pendingAnswer.trim()}
                        className={answeringId === q.id ? "" : "btn-primary"}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: "var(--radius-sm)", background: answeringId === q.id ? "var(--border)" : "linear-gradient(135deg, var(--primary), #8b5cf6)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", flexShrink: 0, alignSelf: "flex-end" }}
                      >
                        <Send size={13} /> Responder
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Sin respuesta aún</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showAll && filtered.length > VISIBLE && (
            <button
              onClick={() => setShowAll(true)}
              className="btn-ghost"
              style={{ display: "flex", alignItems: "center", gap: 6, margin: "16px auto 0", padding: "10px 24px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              <ChevronDown size={16} /> Ver {filtered.length - VISIBLE} pregunta{filtered.length - VISIBLE !== 1 ? "s" : ""} más
            </button>
          )}
        </>
      )}
    </section>
  );
}
