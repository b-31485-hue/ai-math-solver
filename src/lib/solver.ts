// Lightweight, illustrative symbolic solver for polynomial-style expressions.
// Handles: a*x^n + ... with sin/cos/eˣ/ln x single-term recognition.
// This is a demo engine — not a full CAS — designed for clean step output.

export type Mode = "differentiate" | "integrate";

export interface Term {
  coef: number;
  power: number; // for x^n
  fn?: "sin" | "cos" | "exp" | "ln" | null;
}

export interface Step {
  rule: string;
  detail: string;
  latex: string;
}

export interface SolveResult {
  inputLatex: string;
  resultLatex: string;
  steps: Step[];
  detectedRules: string[];
}

function parsePolynomial(input: string): Term[] {
  const cleaned = input.replace(/\s+/g, "").replace(/-/g, "+-").replace(/^\+/, "");
  const tokens = cleaned.split("+").filter(Boolean);
  const terms: Term[] = [];

  for (const tok of tokens) {
    // sin(x)
    if (/^[-+]?\d*\.?\d*sin\(x\)$/i.test(tok)) {
      const c = tok.replace(/sin\(x\)/i, "");
      terms.push({ coef: parseCoef(c), power: 0, fn: "sin" });
      continue;
    }
    if (/^[-+]?\d*\.?\d*cos\(x\)$/i.test(tok)) {
      const c = tok.replace(/cos\(x\)/i, "");
      terms.push({ coef: parseCoef(c), power: 0, fn: "cos" });
      continue;
    }
    if (/^[-+]?\d*\.?\d*e\^x$/i.test(tok)) {
      const c = tok.replace(/e\^x/i, "");
      terms.push({ coef: parseCoef(c), power: 0, fn: "exp" });
      continue;
    }
    if (/^[-+]?\d*\.?\d*ln\(x\)$/i.test(tok)) {
      const c = tok.replace(/ln\(x\)/i, "");
      terms.push({ coef: parseCoef(c), power: 0, fn: "ln" });
      continue;
    }
    // x^n, ax^n, ax, a
    const m = tok.match(/^([-+]?\d*\.?\d*)(x(?:\^(-?\d+))?)?$/);
    if (m) {
      const coef = parseCoef(m[1]);
      const hasX = !!m[2];
      const power = hasX ? (m[3] ? parseInt(m[3], 10) : 1) : 0;
      terms.push({ coef, power });
    }
  }
  return terms;
}

function parseCoef(s: string): number {
  if (s === "" || s === "+") return 1;
  if (s === "-") return -1;
  const n = parseFloat(s);
  return isNaN(n) ? 1 : n;
}

function termToLatex(t: Term): string {
  const sign = t.coef < 0 ? "-" : "";
  const abs = Math.abs(t.coef);
  const coefStr = abs === 1 && (t.power !== 0 || t.fn) ? "" : `${abs}`;
  if (t.fn === "sin") return `${sign}${coefStr}\\sin x`;
  if (t.fn === "cos") return `${sign}${coefStr}\\cos x`;
  if (t.fn === "exp") return `${sign}${coefStr}e^{x}`;
  if (t.fn === "ln") return `${sign}${coefStr}\\ln x`;
  if (t.power === 0) return `${sign}${abs}`;
  if (t.power === 1) return `${sign}${coefStr}x`;
  return `${sign}${coefStr}x^{${t.power}}`;
}

function termsToLatex(terms: Term[]): string {
  if (!terms.length) return "0";
  return terms
    .map((t, i) => {
      const s = termToLatex(t);
      if (i === 0) return s;
      return s.startsWith("-") ? ` ${s}` : ` + ${s}`;
    })
    .join("");
}

function differentiateTerm(t: Term): { term: Term | null; rule: string; detail: string } {
  if (t.fn === "sin")
    return {
      term: { coef: t.coef, power: 0, fn: "cos" },
      rule: "Trig Rule",
      detail: `\\frac{d}{dx}[\\sin x] = \\cos x`,
    };
  if (t.fn === "cos")
    return {
      term: { coef: -t.coef, power: 0, fn: "sin" },
      rule: "Trig Rule",
      detail: `\\frac{d}{dx}[\\cos x] = -\\sin x`,
    };
  if (t.fn === "exp")
    return {
      term: { coef: t.coef, power: 0, fn: "exp" },
      rule: "Exponential Rule",
      detail: `\\frac{d}{dx}[e^{x}] = e^{x}`,
    };
  if (t.fn === "ln")
    return {
      term: { coef: t.coef, power: -1 },
      rule: "Logarithm Rule",
      detail: `\\frac{d}{dx}[\\ln x] = \\frac{1}{x}`,
    };
  if (t.power === 0) return { term: null, rule: "Constant Rule", detail: `\\frac{d}{dx}[c] = 0` };
  return {
    term: { coef: t.coef * t.power, power: t.power - 1 },
    rule: "Power Rule",
    detail: `\\frac{d}{dx}[x^{n}] = n \\cdot x^{n-1}`,
  };
}

function integrateTerm(t: Term): { term: Term | null; rule: string; detail: string } {
  if (t.fn === "sin")
    return {
      term: { coef: -t.coef, power: 0, fn: "cos" },
      rule: "Trig Rule",
      detail: `\\int \\sin x \\, dx = -\\cos x + C`,
    };
  if (t.fn === "cos")
    return {
      term: { coef: t.coef, power: 0, fn: "sin" },
      rule: "Trig Rule",
      detail: `\\int \\cos x \\, dx = \\sin x + C`,
    };
  if (t.fn === "exp")
    return {
      term: { coef: t.coef, power: 0, fn: "exp" },
      rule: "Exponential Rule",
      detail: `\\int e^{x} \\, dx = e^{x} + C`,
    };
  if (t.fn === "ln") return { term: null, rule: "Skipped", detail: `\\int \\ln x\\,dx` };
  if (t.power === -1)
    return {
      term: { coef: t.coef, power: 0, fn: "ln" },
      rule: "Logarithm Rule",
      detail: `\\int \\frac{1}{x} \\, dx = \\ln|x| + C`,
    };
  return {
    term: { coef: t.coef / (t.power + 1), power: t.power + 1 },
    rule: "Power Rule",
    detail: `\\int x^{n} \\, dx = \\frac{x^{n+1}}{n+1} + C`,
  };
}

export function solve(input: string, mode: Mode): SolveResult {
  const terms = parsePolynomial(input);
  const inputLatex = termsToLatex(terms);

  const steps: Step[] = [];
  const rules = new Set<string>();
  const resultTerms: Term[] = [];

  if (terms.length > 1) {
    rules.add(mode === "differentiate" ? "Sum Rule" : "Linearity of Integration");
    steps.push({
      rule: mode === "differentiate" ? "Sum Rule" : "Linearity",
      detail: `Apply ${mode === "differentiate" ? "derivative" : "integral"} term-by-term.`,
      latex:
        mode === "differentiate"
          ? `\\frac{d}{dx}\\left[\\sum f_i(x)\\right] = \\sum \\frac{d}{dx}[f_i(x)]`
          : `\\int \\sum f_i(x) \\, dx = \\sum \\int f_i(x) \\, dx`,
    });
  }

  for (const t of terms) {
    const { term, rule, detail } =
      mode === "differentiate" ? differentiateTerm(t) : integrateTerm(t);
    rules.add(rule);
    steps.push({
      rule,
      detail: `On ${termToLatex(t)}: ${rule.toLowerCase()}.`,
      latex: detail,
    });
    if (term && term.coef !== 0) resultTerms.push(term);
  }

  let resultLatex = termsToLatex(resultTerms);
  if (mode === "integrate") resultLatex += " + C";

  return { inputLatex, resultLatex, steps, detectedRules: Array.from(rules) };
}

// Evaluate simple polynomial term-list at x (for graphing)
export function evalTerms(terms: Term[], x: number): number {
  let y = 0;
  for (const t of terms) {
    if (t.fn === "sin") y += t.coef * Math.sin(x);
    else if (t.fn === "cos") y += t.coef * Math.cos(x);
    else if (t.fn === "exp") y += t.coef * Math.exp(x);
    else if (t.fn === "ln") y += x > 0 ? t.coef * Math.log(x) : NaN;
    else y += t.coef * Math.pow(x, t.power);
  }
  return y;
}

export function parse(input: string): Term[] {
  return parsePolynomial(input);
}
