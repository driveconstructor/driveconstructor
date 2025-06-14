import { useContext } from "react";
import { SystemContext } from "./System";

import { emachineGraphData } from "@/model/emachine-graph";
import { findColorEntry } from "@/model/emachine-utils";
import { GraphPoint, systemGraphData } from "@/model/graph-data";
import { round } from "@/model/utils";
import {
  CategoryScale,
  Chart,
  ChartDataset,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const borderDash = [8, 10];

export default function Graph() {
  const context = useContext(SystemContext);

  const graphData = systemGraphData(context.system);
  const kN = Math.max(...graphData.points.map((p) => p.torque)) >= 10000;
  const toPoint = (row: GraphPoint) => {
    return {
      x: round(row.speed, 1),
      y: round(row.torque / (kN ? 1000 : 1), kN ? 1 : 0),
    };
  };
  const toPointOverload = (row: GraphPoint) => {
    if (typeof row.torqueOverload == "undefined") {
      throw new Error();
    }

    return {
      x: round(row.speed, 1),
      y: round(row.torqueOverload / (kN ? 1000 : 1), kN ? 1 : 0),
    };
  };

  const datasets: ChartDataset<"line">[] = [];

  datasets.push({
    label: graphData.label,
    data: graphData.points.map(toPoint),
  });
  if (graphData.overload) {
    datasets.push({
      label: graphData.label + "-overload",
      borderDash,
      data: graphData.points.map(toPointOverload),
    });
  }

  const emachines = context.system.components.emachine
    ? [context.system.components.emachine]
    : context.system.candidates.emachine;

  if (emachines) {
    const gearRatio = context.system.components.gearbox?.gearRatio || 1;
    emachines.forEach((em) => {
      const emGraphData = emachineGraphData(gearRatio, em);
      const label = `${gearRatio == 1 ? "" : "Gearbox+"}${em.designation}`;
      const color = context.system.candidates.emachine
        ? findColorEntry(context.system.candidates.emachine, em)[1]
        : undefined;
      datasets.push({
        label,
        data: emGraphData.map(toPoint),
        backgroundColor: color,
        borderColor: color,
      });
      if (graphData.overload) {
        datasets.push({
          label: label + "-overload",
          data: emGraphData.map(toPointOverload),
          borderDash,
          backgroundColor: color,
          borderColor: color,
        });
      }
    });
  }

  return (
    <Line
      data={{
        datasets,
      }}
      options={{
        animation: {
          duration: 0,
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
        },
        scales: {
          x: {
            type: "linear",
            title: {
              text: "Speed (rpm)",
              display: true,
            },
          },
          y: {
            title: {
              text: "Torque " + (kN ? "(kNm)" : "(Nm)"),
              display: true,
            },
          },
        },
      }}
    />
  );
}
