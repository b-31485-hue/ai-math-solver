import { BlockMath, InlineMath } from "react-katex";
import { cn } from "@/lib/utils";

export type MathLatexSize = "sm" | "base" | "lg" | "xl";

const sizeClasses: Record<MathLatexSize, string> = {
  sm: "math-latex--sm",
  base: "math-latex--base",
  lg: "math-latex--lg",
  xl: "math-latex--xl",
};

function MathError({ tex, message }: { tex: string; message?: string }) {
  return (
    <span className="math-latex-error" title={message}>
      <code className="font-mono text-xs text-muted-foreground">{tex}</code>
    </span>
  );
}

export function MathLatex({
  tex,
  displayMode = false,
  className,
  size = "base",
  glow = false,
}: {
  tex: string;
  displayMode?: boolean;
  className?: string;
  size?: MathLatexSize;
  glow?: boolean;
}) {
  const math = tex.trim();
  if (!math) return null;

  const rootClass = cn(
    "math-latex",
    sizeClasses[size],
    displayMode && "math-latex--display",
    glow && "math-latex--glow",
    className,
  );

  const renderError = (err: { message?: string }) => (
    <MathError tex={math} message={err?.message} />
  );

  if (displayMode) {
    return (
      <div className={rootClass}>
        <BlockMath math={math} renderError={renderError} />
      </div>
    );
  }

  return (
    <span className={rootClass}>
      <InlineMath math={math} renderError={renderError} />
    </span>
  );
}
