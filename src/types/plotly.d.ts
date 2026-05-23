declare module "react-plotly.js" {
  import type { Component } from "react";
  import type { PlotParams } from "plotly.js";

  export default class Plot extends Component<PlotParams> {}
}
