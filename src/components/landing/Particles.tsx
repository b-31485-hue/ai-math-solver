import { useMemo } from "react";

export function Particles({ count = 36 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 1 + ((i * 7) % 4);
        const colors = ["oklch(0.72 0.22 240)", "oklch(0.7 0.27 295)", "oklch(0.85 0.16 200)"];
        return {
          left: `${(i * 53) % 100}%`,
          top: `${(i * 37) % 100}%`,
          size,
          color: colors[i % 3],
          delay: `${(i * 0.4) % 8}s`,
          duration: `${6 + ((i * 1.3) % 8)}s`,
          drift: `${(i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 6)}px`,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 6}px ${p.color}`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ["--drift" as string]: p.drift,
          }}
        />
      ))}
    </div>
  );
}
