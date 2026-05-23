import type { Mode } from "@/lib/solver";

export interface TutorReply {
  text: string;
  latex?: string;
  rule?: string;
  tips?: string[];
}

export interface TutorContext {
  expr?: string;
  mode?: Mode;
  detectedRules?: string[];
}

export const TUTOR_SUGGESTIONS = [
  "What is a derivative?",
  "Explain the power rule",
  "Why do we add + C when integrating?",
  "How does the chain rule work?",
] as const;

export const DIFF_SUGGESTIONS = [
  "What does d/dx mean?",
  "Explain the power rule",
  "Why is the derivative of e^x equal to e^x?",
  "What is the product rule?",
] as const;

export const INT_SUGGESTIONS = [
  "What is an integral?",
  "Explain ∫ x^n dx",
  "Why do we add + C?",
  "What is integration by parts?",
] as const;

export const TUTOR_QUICK_PROMPTS = [
  "Explain this step",
  "Which rule applies here?",
  "Give me an example",
  "Explain in simpler words",
] as const;

type Lesson = TutorReply & { keywords: string[]; priority?: number };

const LESSONS: Lesson[] = [
  {
    keywords: ["what is a derivative", "define derivative", "derivative mean", "what does d/dx"],
    rule: "Core idea",
    priority: 10,
    text: "A derivative tells you how fast a function is changing at each point. Think of speed: if your position is f(x), the derivative is your instantaneous velocity.",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    tips: [
      "Positive derivative → graph rises",
      "Negative derivative → graph falls",
      "Zero derivative → flat tangent (possible max/min)",
    ],
  },
  {
    keywords: ["what is an integral", "define integral", "integral mean", "antiderivative"],
    rule: "Core idea",
    priority: 10,
    text: "An integral reverses differentiation. It finds a function whose rate of change matches what you started with — like finding position from velocity.",
    latex: "\\int f(x)\\,dx = F(x) + C \\quad\\text{where}\\quad F'(x) = f(x)",
    tips: ["Always include + C for indefinite integrals", "The integral gives the area interpretation under a curve"],
  },
  {
    keywords: ["power rule", "x^n", "x^2", "exponent"],
    rule: "Power Rule",
    priority: 8,
    text: "For powers of x, multiply by the exponent, then subtract one from the exponent. This works for differentiation and integration (with one extra step when integrating).",
    latex: "\\frac{d}{dx}[x^n] = n x^{n-1} \\qquad \\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\;(n \\neq -1)",
    tips: ["Example: d/dx[x³] = 3x²", "Example: ∫ x² dx = x³/3 + C"],
  },
  {
    keywords: ["sum rule", "linearity", "term by term", "each term"],
    rule: "Sum Rule",
    priority: 7,
    text: "You can differentiate or integrate one term at a time, then combine. This is why polynomials are friendly: handle each power separately.",
    latex: "\\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)",
    tips: ["Split long expressions into terms first", "Constants disappear when differentiating"],
  },
  {
    keywords: ["constant rule", "constant"],
    rule: "Constant Rule",
    priority: 6,
    text: "The derivative of any constant is zero — constants do not change. When integrating a constant k, you get k·x.",
    latex: "\\frac{d}{dx}[c] = 0 \\qquad \\int k\\,dx = kx + C",
  },
  {
    keywords: ["chain rule", "inside function", "composite", "outer", "inner"],
    rule: "Chain Rule",
    priority: 9,
    text: "When one function is nested inside another, differentiate the outside while keeping the inside the same, then multiply by the derivative of the inside.",
    latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
    tips: [
      "Example: d/dx[(3x+1)²] → 2(3x+1)·3",
      "Identify the outer and inner functions before starting",
    ],
  },
  {
    keywords: ["product rule"],
    rule: "Product Rule",
    priority: 8,
    text: "For a product of two functions, differentiate the first times the second, plus the first times the derivative of the second.",
    latex: "(fg)' = f'g + fg'",
    tips: ["Use when two expressions involving x are multiplied", "Not the same as the chain rule"],
  },
  {
    keywords: ["quotient rule", "divide", "fraction"],
    rule: "Quotient Rule",
    priority: 7,
    text: "For a quotient, a memorizable pattern: low d(high) minus high d(low), all over low squared.",
    latex: "\\frac{d}{dx}\\left[\\frac{f}{g}\\right] = \\frac{f'g - fg'}{g^2}",
  },
  {
    keywords: ["sin", "cos", "tan", "trig", "sine", "cosine"],
    rule: "Trig Rules",
    priority: 7,
    text: "Trig derivatives cycle between sin and cos (with signs). Integrals of sin and cos swap with a sign flip for sin.",
    latex:
      "\\frac{d}{dx}[\\sin x] = \\cos x \\quad \\frac{d}{dx}[\\cos x] = -\\sin x \\quad \\int \\sin x\\,dx = -\\cos x + C",
    tips: ["Draw the unit circle if signs confuse you", "∫ cos x dx = sin x + C"],
  },
  {
    keywords: ["e^x", "eˣ", "exp", "exponential"],
    rule: "Exponential Rule",
    priority: 8,
    text: "eˣ is unique: it is its own derivative. That is why exponential growth models use e.",
    latex: "\\frac{d}{dx}[e^{x}] = e^{x} \\qquad \\int e^{x}\\,dx = e^{x} + C",
  },
  {
    keywords: ["ln", "log", "1/x"],
    rule: "Logarithm Rule",
    priority: 8,
    text: "The derivative of ln(x) is 1/x. That is also why ∫ 1/x dx = ln|x| + C — the power rule fails when the exponent is −1.",
    latex: "\\frac{d}{dx}[\\ln x] = \\frac{1}{x} \\qquad \\int \\frac{1}{x}\\,dx = \\ln|x| + C",
  },
  {
    keywords: ["+ c", "plus c", "constant of integration", "why c"],
    rule: "Constant of Integration",
    priority: 9,
    text: "Every indefinite integral needs + C because many functions differ only by a constant but share the same derivative. Example: x² and x² + 7 both differentiate to 2x.",
    latex: "\\int 2x\\,dx = x^2 + C",
    tips: ["Never forget + C on indefinite integrals", "C is an arbitrary constant"],
  },
  {
    keywords: ["integration by parts", "by parts", "ibu"],
    rule: "Integration by Parts",
    priority: 8,
    text: "Comes from the product rule, reversed. Choose u as the part that simplifies when differentiated; dv is what remains.",
    latex: "\\int u\\,dv = uv - \\int v\\,du",
    tips: ["LIATE hint: Log, Inverse trig, Algebraic, Trig, Exponential for picking u"],
  },
  {
    keywords: ["limit", "secant", "tangent line"],
    rule: "Limits",
    priority: 7,
    text: "A derivative is a limit: the slope of secant lines as the two points get infinitely close. That limiting slope is the tangent slope.",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  },
  {
    keywords: ["u-sub", "substitution", "reverse chain"],
    rule: "u-Substitution",
    priority: 6,
    text: "Spot an inner function and its derivative in the integrand. Let u be the inner part, rewrite in terms of u, integrate, then substitute back.",
    tips: ["Works when you see a function and (roughly) its derivative multiplied together"],
  },
];

function scoreLesson(question: string, lesson: Lesson): number {
  const q = question.toLowerCase();
  let score = 0;
  for (const kw of lesson.keywords) {
    if (q.includes(kw)) score += kw.length + (lesson.priority ?? 0);
  }
  return score;
}

function pickLesson(question: string): Lesson | null {
  let best: Lesson | null = null;
  let bestScore = 0;
  for (const lesson of LESSONS) {
    const s = scoreLesson(question, lesson);
    if (s > bestScore) {
      bestScore = s;
      best = lesson;
    }
  }
  return bestScore > 0 ? best : null;
}

function contextReply(ctx: TutorContext, question: string): TutorReply | null {
  const q = question.toLowerCase();
  const { expr, mode, detectedRules } = ctx;

  if (!expr || !mode) return null;

  const rules = detectedRules?.length ? detectedRules.join(", ") : "standard rules";

  if (
    q.includes("step") ||
    q.includes("this problem") ||
    q.includes("my expression") ||
    q.includes("which rule") ||
    q.includes("why this")
  ) {
    if (mode === "differentiate") {
      return {
        rule: "Your problem",
        text: `For f(x) = ${expr}, differentiate term by term. I detected: ${rules}. Start with the overall structure, then apply the matching rule to each piece.`,
        latex: `\\frac{d}{dx}\\left[${expr.replace(/\^/g, "^")}\\right]`,
        tips: [
          "Differentiate constants to 0",
          "Use the power rule on terms like x^n",
          "Check the step list on the left for each transformation",
        ],
      };
    }
    return {
      rule: "Your problem",
      text: `To integrate ${expr}, find an antiderivative for each term, then add + C at the end. Rules spotted: ${rules}.`,
      latex: `\\int (${expr})\\,dx`,
      tips: [
        "Reverse the power rule: raise the exponent, divide by the new one",
        "Remember + C at the very end",
      ],
    };
  }

  if (q.includes("example") || q.includes("another")) {
    if (mode === "differentiate") {
      return {
        rule: "Practice",
        text: "Try differentiating x⁴ − 2x + 5. The x⁴ term becomes 4x³, −2x becomes −2, and 5 becomes 0.",
        latex: "\\frac{d}{dx}[x^4 - 2x + 5] = 4x^3 - 2",
      };
    }
    return {
      rule: "Practice",
      text: "Try integrating 2x + 3. You get x² + 3x + C.",
      latex: "\\int (2x + 3)\\,dx = x^2 + 3x + C",
    };
  }

  if (q.includes("simpler") || q.includes("easy") || q.includes("beginner")) {
    return {
      rule: "Plain language",
      text:
        mode === "differentiate"
          ? "Differentiating means finding the slope of a curve at every point. For simple polynomials, change each xⁿ to n·xⁿ⁻¹."
          : "Integrating means finding the original function from its slope. For xⁿ, increase the power by 1 and divide by the new power, then add C.",
    };
  }

  return null;
}

export function askTutor(question: string, context: TutorContext = {}): TutorReply {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      text: "Ask me anything about derivatives or integrals — I explain concepts using built-in lessons, no internet required.",
    };
  }

  const contextual = contextReply(context, trimmed);
  if (contextual) return contextual;

  const lesson = pickLesson(trimmed);
  if (lesson) {
    const { keywords: _, priority: __, ...reply } = lesson;
    return reply;
  }

  if (context.mode === "differentiate") {
    return {
      rule: "Hint",
      text: `I can explain rules like the power rule, sum rule, chain rule, or trig derivatives. For your expression "${context.expr ?? "f(x)"}", try asking "which rule applies here?" or "explain step 1".`,
      tips: ["Try: What is the power rule?", "Try: Explain the chain rule"],
    };
  }

  if (context.mode === "integrate") {
    return {
      rule: "Hint",
      text: `Ask about + C, the power rule for integrals, or integration by parts. For "${context.expr ?? "f(x)"}", try "explain this step" to connect to your workspace.`,
      tips: ["Try: Why do we add + C?", "Try: What is integration by parts?"],
    };
  }

  return {
    rule: "Welcome",
    text: "I'm your calculus study tutor. I teach differentiation and integration using clear rules and examples — completely offline. Pick a topic or ask about a specific rule.",
    tips: [
      "What is a derivative?",
      "Explain the power rule",
      "Why do we add + C when integrating?",
    ],
  };
}

export function getWelcomeMessage(mode?: Mode): TutorReply {
  if (mode === "differentiate") {
    return {
      rule: "Differentiation",
      text: "Hi! I'm here to explain derivatives in plain language. Ask about rules, your current expression, or any step in the solution.",
      tips: ["What does d/dx mean?", "Explain the power rule"],
    };
  }
  if (mode === "integrate") {
    return {
      rule: "Integration",
      text: "Hi! I help with integrals and antiderivatives. Ask why we add + C, how the power rule works in reverse, or about your expression.",
      tips: ["What is an integral?", "Why do we add + C?"],
    };
  }
  return {
    rule: "Calculus Tutor",
    text: "Welcome! I teach differentiation and integration with step-by-step explanations — no external API, just clear educational rules.",
    tips: ["What is a derivative?", "Explain the power rule", "Why do we add + C?"],
  };
}

export function getSuggestionsForMode(mode?: Mode): readonly string[] {
  if (mode === "differentiate") return DIFF_SUGGESTIONS;
  if (mode === "integrate") return INT_SUGGESTIONS;
  return TUTOR_SUGGESTIONS;
}

/** @deprecated Use askTutor with context */
export function getTutorReply(question: string): TutorReply {
  return askTutor(question);
}

/** @deprecated Use askTutor */
export function getWorkspaceTutorReply(expr: string, mode: Mode): string {
  return askTutor("explain this step", { expr, mode }).text;
}

export type TutorMessage = {
  role: "user" | "ai";
  text: string;
  latex?: string;
  rule?: string;
  tips?: string[];
};
