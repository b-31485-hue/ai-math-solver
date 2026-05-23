import { motion, useReducedMotion } from "framer-motion";
import type { Mode } from "@/lib/solver";
import { springNav } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="inline-flex rounded-lg border border-white/[0.08] bg-black/30 p-1">
      {(["differentiate", "integrate"] as Mode[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            disabled={disabled}
            onClick={() => onChange(m)}
            className={cn(
              "relative rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && !reduce && (
              <motion.span
                layoutId="solver-mode-pill"
                className="absolute inset-0 rounded-md"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow-sm)",
                }}
                transition={springNav}
              />
            )}
            {active && reduce && (
              <span
                className="absolute inset-0 rounded-md"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow-sm)",
                }}
              />
            )}
            <span className="relative z-[1] font-mono text-[11px]">
              {m === "differentiate" ? "d/dx" : "∫ dx"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
