import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = {
  children: React.ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "glass" | "ghost";
};

export function ShimmerButton({
  children,
  className,
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
}: ShimmerButtonProps) {
  const reduce = useReducedMotion();

  const base = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "rounded-lg px-5 py-2.5 text-sm font-medium tracking-[-0.01em]",
    "transition-[box-shadow,background] duration-200",
    variant === "primary" && "text-primary-foreground",
    variant === "glass" &&
      "glass text-foreground hover:bg-white/[0.06] border-white/[0.1]",
    variant === "ghost" &&
      "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
    className,
  );

  const style =
    variant === "primary"
      ? {
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow-sm)",
        }
      : undefined;

  const inner = (
    <>
      {variant === "primary" && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.18) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={reduce ? undefined : { backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      )}
      <span className="relative z-[1]">{children}</span>
    </>
  );

  const motionProps = reduce
    ? {}
    : {
        whileHover: { scale: 1.02, y: -1 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring" as const, stiffness: 450, damping: 26 },
      };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link to={to} className={base} style={style}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...motionProps} className={base} style={style}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...motionProps} className={base} style={style}>
      {inner}
    </motion.button>
  );
}
