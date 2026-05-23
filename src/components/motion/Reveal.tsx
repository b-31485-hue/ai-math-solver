import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "fadeUp" | "scaleIn" | "fade";

const variants = {
  fadeUp,
  scaleIn,
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
} as const;

export function Reveal({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  once = true,
  as = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  delay?: number;
  once?: boolean;
  as?: keyof typeof motion;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
