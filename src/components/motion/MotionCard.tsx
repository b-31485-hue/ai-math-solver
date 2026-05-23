import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover, staggerItem } from "@/lib/motion";

type MotionCardProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: boolean;
  asStaggerItem?: boolean;
  delay?: number;
};

export function MotionCard({
  children,
  className,
  innerClassName,
  glow = false,
  asStaggerItem = false,
  delay = 0,
}: MotionCardProps) {
  const reduce = useReducedMotion();

  const inner = (
    <motion.div
      variants={reduce ? undefined : cardHover}
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      className={cn("relative surface-elevated transition-colors duration-300", innerClassName)}
    >
      {children}
    </motion.div>
  );

  if (asStaggerItem) {
    return (
      <motion.div variants={staggerItem} className={cn("relative group", className)}>
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative group", className)}
    >
      {glow && (
        <div
          aria-hidden
          className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
          style={{ background: "var(--gradient-glow)" }}
        />
      )}
      {inner}
    </motion.div>
  );
}
