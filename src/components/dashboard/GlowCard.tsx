import { motion, useReducedMotion } from "framer-motion";
import { cardHover } from "@/lib/motion";

export function GlowCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative group">
      <motion.div
        variants={reduce ? undefined : cardHover}
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        className="relative surface-elevated overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />
        {children}
      </motion.div>
    </div>
  );
}
