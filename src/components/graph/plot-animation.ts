import type { Data, Frame } from "plotly.js";

const DRAW_STEPS = 28;

/** Progressive line-draw frames for Plotly intro animation. */
export function buildDrawFrames(traces: Partial<Data>[], steps = DRAW_STEPS) {
  const frames: Frame[] = [];

  for (let s = 1; s <= steps; s++) {
    const ratio = s / steps;
    frames.push({
      name: `frame-${s}`,
      data: traces.map((trace) => {
        const t = trace as { x?: number[]; y?: number[] };
        if (!t.x?.length || !t.y?.length) return { ...trace, x: [], y: [] };
        const end = Math.max(2, Math.floor(t.x.length * ratio));
        return { ...trace, x: t.x.slice(0, end), y: t.y.slice(0, end) };
      }),
    });
  }

  return { data: traces, frames };
}
