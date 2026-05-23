import { useMemo } from "react";
import { MathLatex } from "@/components/math/MathLatex";

const EQUATIONS = [
  "\\int x^2\\,dx = \\tfrac{x^3}{3} + C",
  "\\frac{d}{dx}[\\sin x] = \\cos x",
  "\\int e^{x}\\,dx = e^{x} + C",
  "\\frac{d}{dx}[\\ln x] = \\tfrac{1}{x}",
  "\\int \\tfrac{1}{x}\\,dx = \\ln|x| + C",
  "\\frac{d}{dx}[x^{n}] = n x^{n-1}",
  "\\int \\cos x\\,dx = \\sin x + C",
  "\\lim_{h\\to 0}\\tfrac{f(x+h)-f(x)}{h}",
  "\\frac{d}{dx}[e^{x}] = e^{x}",
  "\\int_{0}^{\\pi}\\sin x\\,dx = 2",
  "\\nabla\\cdot \\vec{F}",
  "\\frac{d^{2}y}{dx^{2}} + \\omega^{2}y = 0",
];

export function FloatingEquations({ count = 12 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        tex: EQUATIONS[i % EQUATIONS.length],
        left: `${(i * 41 + 5) % 92}%`,
        delay: `${(i * 1.7) % 20}s`,
        duration: `${18 + (i % 6) * 2}s`,
        scale: 0.7 + (i % 5) * 0.12,
        tone: i % 2 === 0 ? "text-neon-blue" : "text-neon-purple",
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
      {items.map((eq, i) => (
        <span
          key={i}
          className={`absolute animate-equation-drift ${eq.tone}`}
          style={{
            left: eq.left,
            animationDelay: eq.delay,
            animationDuration: eq.duration,
            transform: `scale(${eq.scale})`,
            transformOrigin: "left top",
            opacity: 0.55,
          }}
        >
          <MathLatex tex={eq.tex} />
        </span>
      ))}
    </div>
  );
}
