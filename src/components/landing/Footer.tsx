import { motion } from "framer-motion";
import { Sigma } from "lucide-react";
import { Reveal } from "@/components/motion";

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-white/[0.06]">
      <div className="divider-fade absolute inset-x-0 top-0" />
      <Reveal className="container-saas py-14 sm:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow-sm)",
                }}
              >
                <Sigma className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.25} />
              </div>
              <span className="font-semibold text-[15px] tracking-[-0.02em]">
                Calculus<span className="gradient-text">.ai</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Differentiation & integration, reimagined for the AI era.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {["Privacy", "Terms", "Contact", "Docs"].map((label) => (
              <motion.a
                key={label}
                href="#"
                className="hover:text-foreground transition-colors"
                whileHover={{ y: -1 }}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} Calculus.ai. All rights reserved.
        </p>
      </Reveal>
    </footer>
  );
}
