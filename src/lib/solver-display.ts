import type { Mode, SolveResult } from "@/lib/solver";
import { inferDetectedRules, sympyToParserInput } from "@/lib/expression-utils";
import type { MathApiResponse } from "@/lib/math-api";

export interface SolverDisplayResult {
  inputLatex: string;
  resultLatex: string;
  steps: MathApiResponse["steps"];
  detectedRules: string[];
  resultParserInput: string;
  source: "api" | "local";
}

export function mapApiToDisplay(api: MathApiResponse, mode: Mode, rawExpr: string): SolverDisplayResult {
  return {
    inputLatex: api.input_latex,
    resultLatex: api.result_latex,
    steps: api.steps,
    detectedRules: api.detected_rules.length ? api.detected_rules : inferDetectedRules(rawExpr, mode),
    resultParserInput: sympyToParserInput(api.result),
    source: "api",
  };
}

export function mapLocalToDisplay(local: SolveResult): SolverDisplayResult {
  return {
    inputLatex: local.inputLatex,
    resultLatex: local.resultLatex,
    steps: local.steps,
    detectedRules: local.detectedRules,
    resultParserInput: local.resultLatex.replace(/\\.*?\{|\}|\+\s*C/g, ""),
    source: "local",
  };
}
