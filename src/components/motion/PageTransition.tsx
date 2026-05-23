import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { pageTransition, pageTransitionReduced } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        {...(reduce ? pageTransitionReduced : pageTransition)}
        className="will-change-[transform,opacity]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
