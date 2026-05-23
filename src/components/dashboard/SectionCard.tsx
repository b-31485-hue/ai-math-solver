import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function SectionCard({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-32px" }}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
      className="surface rounded-2xl p-5 sm:p-6 transition-colors hover:border-white/[0.12]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
            <Icon className="h-3.5 w-3.5 text-foreground/80" strokeWidth={2} />
          </div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] truncate">{title}</h3>
        </div>
        {eyebrow && (
          <span className="eyebrow shrink-0 !text-[10px] !tracking-[0.1em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      {children}
    </motion.section>
  );
}
