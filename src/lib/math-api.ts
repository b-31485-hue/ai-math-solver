import type { Mode, Step } from "@/lib/solver";
import { toSympyExpr } from "@/lib/expression-utils";

const API_BASE = import.meta.env.VITE_MATH_API_URL ?? "http://127.0.0.1:8000";

export interface MathApiResponse {
  input: string;
  result: string;
  input_latex: string;
  result_latex: string;
  type: "differentiation" | "integration";
  steps: Step[];
  detected_rules: string[];
}

export class MathApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "MathApiError";
  }
}

export async function checkMathApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchMathResult(expression: string, mode: Mode): Promise<MathApiResponse> {
  const sympyExpr = toSympyExpr(expression);
  const path = mode === "differentiate" ? "/differentiate" : "/integrate";
  const url = `${API_BASE}${path}?${new URLSearchParams({ expr: sympyExpr })}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new MathApiError(
      "Cannot reach the math server. Start the backend with: uvicorn main:app --reload",
    );
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new MathApiError(detail, res.status);
  }

  return res.json() as Promise<MathApiResponse>;
}
