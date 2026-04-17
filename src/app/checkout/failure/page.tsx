import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">❌</div>
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--text)" }}>Pago fallido</h1>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          Hubo un problema con tu pago. No se realizó ningún cobro.
        </p>
        <Link href="/cart" className="inline-block px-8 py-3 rounded-xl font-semibold text-white" style={{ background: "var(--primary)" }}>
          Volver al carrito
        </Link>
      </div>
    </div>
  );
}
