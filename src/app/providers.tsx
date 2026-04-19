"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";

function CartGuard() {
  const { data: session, status } = useSession();
  const clear = useCart((s) => s.clear);
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) {
      wasLoggedIn.current = true;
    } else if (wasLoggedIn.current) {
      clear();
      wasLoggedIn.current = false;
    }
  }, [session, status, clear]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartGuard />
      {children}
    </SessionProvider>
  );
}
