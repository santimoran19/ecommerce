"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : [];
  const [current, setCurrent] = useState(0);

  if (imgs.length === 0) {
    return (
      <div style={{ aspectRatio: "1/1", borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)" }}>
        <span style={{ fontSize: 100, opacity: 0.4 }}>📦</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent((c) => (c + 1) % imgs.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main image */}
      <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
        <img
          src={imgs[current]}
          alt={`${name} ${current + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.2s" }}
        />

        {imgs.length > 1 && (
          <>
            <button onClick={prev} className="carousel-arrow" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="carousel-arrow" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 99, background: i === current ? "white" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`carousel-thumb${i === current ? " active" : ""}`}
              style={{
                width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                border: `2px solid ${i === current ? "var(--primary)" : "var(--border)"}`,
                background: "var(--bg-card)", padding: 0, opacity: i === current ? 1 : 0.6,
              }}
            >
              <img src={src} alt={`${name} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
