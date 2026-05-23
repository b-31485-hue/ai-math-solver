import type { Mode } from "@/lib/solver";

/** Convert UI math (3x^3, sin(x), e^x) to SymPy / sympify syntax. */
export function toSympyExpr(raw: string): string {
  let s = raw.trim().replace(/\s+/g, "");
  if (!s) throw new Error("Enter an expression to solve.");

  s = s.replace(/e\^x/gi, "exp(x)");
  s = s.replace(/\bln\(/gi, "log(");
  s = s.replace(/\^/g, "**");
  s = s.replace(/(\d)([a-zA-Z(])/g, "$1*$2");
  s = s.replace(/\)([a-zA-Z(])/g, ")*$1");
  return s;
}

/** Rough SymPy string → LaTeX for KaTeX display. */
export function sympyToLatex(expr: string): string {
  let t = expr.trim();

  t = t.replace(/exp\(([^)]+)\)/g, "e^{$1}");
  t = t.replace(/\*\*\(([^)]+)\)/g, "^{$1}");
  t = t.replace(/\*\*(-?\d+(?:\.\d+)?)/g, "^{$1}");
  t = t.replace(/\blog\(/g, "\\ln(");
  t = t.replace(/\bsin\(/g, "\\sin(");
  t = t.replace(/\bcos\(/g, "\\cos(");
  t = t.replace(/\btan\(/g, "\\tan(");
  t = t.replace(/\*/g, " \\cdot ");

  return t;
}

/** SymPy output → parser input for local graph sampling. */
export function sympyToParserInput(expr: string): string {
  let t = expr.trim().replace(/\s+/g, "");
  t = t.replace(/exp\(([^)]+)\)/g, "e^$1");
  t = t.replace(/\blog\(/g, "ln(");
  t = t.replace(/\*\*\(([^)]+)\)/g, "^($1)");
  t = t.replace(/\*\*(-?\d+(?:\.\d+)?)/g, "^$1");
  t = t.replace(/(\d)\*/g, "$1");
  t = t.replace(/\*x/g, "x");
  t = t.replace(/\*\(/g, "(");
  t = t.replace(/\)\*/g, ")");
  return t;
}

export function inferDetectedRules(expr: string, mode: Mode): string[] {
  const rules = new Set<string>();
  const s = expr.toLowerCase();

  if (/[+-]/.test(expr.replace(/^-/, ""))) {
    rules.add(mode === "differentiate" ? "Sum Rule" : "Linearity of Integration");
  }
  if (/\bsin\b|\bcos\b/.test(s)) rules.add("Trig Rule");
  if (/e\^x|exp\(/.test(s)) rules.add("Exponential Rule");
  if (/\bln\b|\blog\b/.test(s)) rules.add("Logarithm Rule");
  if (/x\^|\*\*x|\bx\b/.test(s)) rules.add("Power Rule");
  rules.add("SymPy CAS");

  return Array.from(rules);
}
