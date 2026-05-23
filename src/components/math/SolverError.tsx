import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { shake } from "@/lib/motion";

export function SolverError({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 0, scale: 1, x: shake.x }
      }
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3 rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm"
    >
      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
        transition={{ duration: 0.5, repeat: 2 }}
      >
        <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground/95">Could not solve</p>
        <p className="mt-0.5 text-muted-foreground leading-relaxed">{message}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {onRetry && (
            <motion.button
              type="button"
              onClick={onRetry}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </motion.button>
          )}
          {onDismiss && (
            <motion.button
              type="button"
              onClick={onDismiss}
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              Dismiss
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
