"use client";

import { useEffect, useRef } from "react";

/** Faz o conteúdo aparecer suavemente quando entra na tela. */
export default function Reveal({
  children,
  className = "",
  atraso = 0,
}: {
  children: React.ReactNode;
  className?: string;
  atraso?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("visivel");
      return;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.classList.add("visivel");
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`revelar ${className}`} style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}>
      {children}
    </div>
  );
}
