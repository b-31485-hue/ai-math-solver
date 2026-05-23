"""Generate beginner-friendly step-by-step calculus explanations with SymPy."""

from __future__ import annotations

from typing import Any

from sympy import Add, Mul, Pow, Symbol, cos, diff, exp, integrate, latex, log, sin, sympify, tan
from sympy.core.function import AppliedUndef

x = Symbol("x")


def tex(expr: Any) -> str:
    return latex(sympify(expr), mul_symbol="\\cdot ")


def parse_expression(expr: str):
    return sympify(expr)


def _diff_rule_name(term) -> str:
    term = term.expand()
    if not term.has(x):
        return "Constant Rule"
    if isinstance(term, AppliedUndef):
        return "General Rule"
    if term.func in (sin, cos, tan):
        return "Trig Rule"
    if term.func == exp or term == exp(x):
        return "Exponential Rule"
    if term.func == log:
        return "Logarithm Rule"
    if isinstance(term, Pow) and term.base == x:
        return "Power Rule"
    if isinstance(term, Mul):
        xs = [f for f in term.args if f.has(x)]
        if len(xs) >= 2:
            return "Product Rule"
        return _diff_rule_name(term.args[0] if xs else term)
    if isinstance(term, Pow) and term.exp.has(x):
        return "Chain Rule"
    return "Chain Rule" if term.has(x) else "Constant Rule"


def _int_rule_name(term) -> str:
    term = term.expand()
    if not term.has(x):
        return "Constant Rule"
    if term.func in (sin, cos, tan):
        return "Trig Rule"
    if term.func == exp or term == exp(x):
        return "Exponential Rule"
    if term.func == log:
        return "Logarithm Rule"
    if isinstance(term, Pow) and term.base == x and term.exp == -1:
        return "Logarithm Rule"
    if isinstance(term, Pow) and term.base == x:
        return "Power Rule"
    if isinstance(term, Mul):
        return "Substitution (advanced)"
    return "Power Rule"


def _diff_explain(term, rule: str) -> str:
    if rule == "Constant Rule":
        return "A number without x is constant, so its derivative is zero."
    if rule == "Power Rule":
        return (
            "Use the power rule: bring the exponent down as a multiplier, "
            "then reduce the exponent by 1."
        )
    if rule == "Sum Rule":
        return (
            "Differentiate each term separately, then add the results. "
            "This is the sum rule."
        )
    if rule == "Trig Rule":
        if term.func == sin:
            return "The derivative of sin(x) is cos(x)."
        if term.func == cos:
            return "The derivative of cos(x) is −sin(x)."
        return "Apply the standard derivative rule for this trig function."
    if rule == "Exponential Rule":
        return "The function e^x is its own derivative: d/dx[e^x] = e^x."
    if rule == "Logarithm Rule":
        return "The derivative of ln(x) is 1/x (for x > 0)."
    if rule == "Product Rule":
        return (
            "This term is a product of expressions involving x. "
            "Use the product rule: (fg)' = f'g + fg'."
        )
    if rule == "Chain Rule":
        return "An outer function wraps an inner function — apply the chain rule."
    return "Differentiate this term using standard calculus rules."


def _int_explain(term, rule: str) -> str:
    if rule == "Constant Rule":
        return "The integral of a constant k is k·x (plus the constant of integration C later)."
    if rule == "Power Rule":
        return (
            "Use the power rule for integrals: increase the exponent by 1, "
            "then divide by the new exponent."
        )
    if rule == "Sum Rule":
        return "Integrate each term one at a time, then combine. This is linearity of integration."
    if rule == "Trig Rule":
        if term.func == sin:
            return "∫ sin(x) dx = −cos(x)."
        if term.func == cos:
            return "∫ cos(x) dx = sin(x)."
        return "Apply the standard antiderivative for this trig function."
    if rule == "Exponential Rule":
        return "∫ e^x dx = e^x."
    if rule == "Logarithm Rule":
        if isinstance(term, Pow) and term.exp == -1:
            return "When the exponent is −1, we get ∫ 1/x dx = ln|x|."
        return "Use the logarithmic antiderivative where applicable."
    return "Find an antiderivative for this term."


def _step(rule: str, detail: str, latex_str: str) -> dict[str, str]:
    return {"rule": rule, "detail": detail, "latex": latex_str}


def differentiate_steps(expr_str: str) -> tuple[list[dict], list[str], Any]:
    expr = parse_expression(expr_str)
    expr = expr.expand()
    steps: list[dict] = []
    rules: set[str] = set()

    steps.append(
        _step(
            "Problem Setup",
            "We need the derivative f′(x): how fast the output changes when x changes.",
            rf"\frac{{d}}{{dx}}\left({tex(expr)}\right)",
        )
    )

    terms = list(expr.args) if isinstance(expr, Add) else [expr]

    if isinstance(expr, Add) and len(terms) > 1:
        rules.add("Sum Rule")
        pieces = " + ".join(rf"\frac{{d}}{{dx}}\left({tex(t)}\right)" for t in terms)
        steps.append(
            _step(
                "Sum Rule",
                _diff_explain(expr, "Sum Rule"),
                rf"\frac{{d}}{{dx}}\left({tex(expr)}\right) = {pieces}",
            )
        )

        part_derivs = []
        for term in terms:
            rule = _diff_rule_name(term)
            rules.add(rule)
            dterm = diff(term, x).simplify()
            part_derivs.append(dterm)
            steps.append(
                _step(
                    rule,
                    f"Term {tex(term)}: {_diff_explain(term, rule)}",
                    rf"\frac{{d}}{{dx}}\left({tex(term)}\right) = {tex(dterm)}",
                )
            )

        combined = Add(*part_derivs).simplify()
        steps.append(
            _step(
                "Combine Terms",
                "Add the derivatives of each term together.",
                rf"f'(x) = {tex(combined)}",
            )
        )
        final = diff(expr, x).simplify()
    else:
        term = terms[0]
        rule = _diff_rule_name(term)
        rules.add(rule)
        dterm = diff(term, x).simplify()
        steps.append(
            _step(
                rule,
                _diff_explain(term, rule),
                rf"\frac{{d}}{{dx}}\left({tex(term)}\right) = {tex(dterm)}",
            )
        )
        final = dterm

    steps.append(
        _step(
            "Final Answer",
            "This is the simplified derivative.",
            rf"f'(x) = {tex(final)}",
        )
    )

    return steps, sorted(rules), final


def integrate_steps(expr_str: str) -> tuple[list[dict], list[str], Any]:
    expr = parse_expression(expr_str)
    expr = expr.expand()
    steps: list[dict] = []
    rules: set[str] = set()

    steps.append(
        _step(
            "Problem Setup",
            "We need the indefinite integral: the family of functions whose derivative is f(x).",
            rf"\int {tex(expr)} \, dx",
        )
    )

    terms = list(expr.args) if isinstance(expr, Add) else [expr]

    if isinstance(expr, Add) and len(terms) > 1:
        rules.add("Linearity of Integration")
        pieces = " + ".join(rf"\int {tex(t)} \, dx" for t in terms)
        steps.append(
            _step(
                "Sum Rule",
                _int_explain(expr, "Sum Rule"),
                rf"\int {tex(expr)} \, dx = {pieces}",
            )
        )

        part_ints = []
        for term in terms:
            rule = _int_rule_name(term)
            rules.add(rule)
            iterm = integrate(term, x)
            part_ints.append(iterm)
            steps.append(
                _step(
                    rule,
                    f"Term {tex(term)}: {_int_explain(term, rule)}",
                    rf"\int {tex(term)} \, dx = {tex(iterm)}",
                )
            )

        combined = Add(*part_ints).simplify()
        steps.append(
            _step(
                "Combine Terms",
                "Add the antiderivatives of each term.",
                rf"\int f(x)\, dx = {tex(combined)}",
            )
        )
        final = integrate(expr, x).simplify()
    else:
        term = terms[0]
        rule = _int_rule_name(term)
        rules.add(rule)
        iterm = integrate(term, x).simplify()
        steps.append(
            _step(
                rule,
                _int_explain(term, rule),
                rf"\int {tex(term)} \, dx = {tex(iterm)}",
            )
        )
        final = iterm

    steps.append(
        _step(
            "Constant of Integration",
            "Every indefinite integral includes + C because derivatives of constants are zero.",
            rf"\int f(x)\, dx = {tex(final)} + C",
        )
    )

    rules.add("Constant of Integration")
    return steps, sorted(rules), final


def solve_with_steps(expr_str: str, mode: str) -> dict:
    if mode == "differentiate":
        steps, rules, final = differentiate_steps(expr_str)
        op_type = "differentiation"
        result_str = str(final)
    else:
        steps, rules, final = integrate_steps(expr_str)
        op_type = "integration"
        result_str = str(final)

    expr = parse_expression(expr_str).expand()
    return {
        "input": str(expr),
        "result": result_str,
        "input_latex": tex(expr),
        "result_latex": tex(final) + (" + C" if mode == "integrate" else ""),
        "type": op_type,
        "steps": steps,
        "detected_rules": rules,
    }
