import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Sigma } from "lucide-react";
import { APP_ROUTES } from "@/config/navigation";
import { springNav } from "@/lib/motion";
import { ShimmerButton } from "@/components/motion/ShimmerButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 pt-4 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-[var(--content-wide)]">
        <motion.nav
          className={cn(
            "flex items-center justify-between gap-4",
            "rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5",
            "glass-strong",
          )}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow-sm)",
              }}
            >
              <Sigma className="h-4 w-4 text-primary-foreground" strokeWidth={2.25} />
            </motion.div>
            <span className="font-semibold text-[15px] tracking-[-0.02em] truncate">
              Calculus<span className="gradient-text">.ai</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-0.5">
            {APP_ROUTES.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={cn(
                      "relative block px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/90",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                        transition={springNav}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/dashboard"
              className="lg:hidden text-[13px] font-medium text-muted-foreground hover:text-foreground px-2"
            >
              App
            </Link>
            <ShimmerButton to="/dashboard" className="!px-4 !py-2 !text-[13px] !rounded-lg">
              Get started
            </ShimmerButton>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}
