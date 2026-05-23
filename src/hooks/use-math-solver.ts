import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMathResult, MathApiError } from "@/lib/math-api";
import { mapApiToDisplay, mapLocalToDisplay, type SolverDisplayResult } from "@/lib/solver-display";
import { solve, type Mode } from "@/lib/solver";

interface UseMathSolverOptions {
  initialExpr?: string;
  initialMode?: Mode;
  debounceMs?: number;
}

export function useMathSolver({
  initialExpr = "3x^3 + 2x^2 - 5x + 7",
  initialMode = "differentiate",
  debounceMs = 550,
}: UseMathSolverOptions = {}) {
  const [expr, setExpr] = useState(initialExpr);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SolverDisplayResult | null>(null);
  const requestId = useRef(0);

  const runSolve = useCallback(async (expression: string, m: Mode) => {
    const trimmed = expression.trim();
    if (!trimmed) {
      setError("Enter an expression to solve.");
      setResult(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const api = await fetchMathResult(trimmed, m);
      if (id !== requestId.current) return;
      setResult(mapApiToDisplay(api, m, trimmed));
    } catch (err) {
      if (id !== requestId.current) return;

      const message =
        err instanceof MathApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong while solving.";

      try {
        const local = solve(trimmed, m);
        setResult(mapLocalToDisplay(local));
        setError(`${message} Showing offline fallback.`);
      } catch {
        setResult(null);
        setError(message);
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => runSolve(expr, mode), debounceMs);
    return () => window.clearTimeout(timer);
  }, [expr, mode, debounceMs, runSolve]);

  const solveNow = useCallback(() => {
    void runSolve(expr, mode);
  }, [expr, mode, runSolve]);

  return {
    expr,
    setExpr,
    mode,
    setMode,
    loading,
    error,
    result,
    solveNow,
    clearError: () => setError(null),
  };
}
