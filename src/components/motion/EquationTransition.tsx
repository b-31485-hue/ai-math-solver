import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { equationVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function EquationTransition({
  equationKey,
  children,
  className,
}: {
  /** Change when the equation changes to trigger transition */
  equationKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={equationKey}
        variants={equationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn("will-change-[transform,opacity]", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
