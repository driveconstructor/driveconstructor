import { useContext } from "react";
import { SystemContext } from "./System";

import { emachineGraphData } from "@/model/emachine-graph";
import { GraphPoint, systemGraphData } from "@/model/graph-data";
import {
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Graph() {
  const context = useContext(SystemContext);

  const graphData = systemGraphData(context.system);
  const toPoint = (row: GraphPoint) => {
    return { x: row.speed, y: row.torque };
  };
  const datasets: ChartDataset<"line">[] = [
    {
      label: Object.keys(context.model.input)[0],
      data: graphData.map(toPoint),
    },
  ];

  const colors = ["blue", "green", "brown", "olive", "red", "orange"];

  const emachines = context.system.components.emachine
    ? [context.system.components.emachine]
    : context.system.candidates.emachine;

  if (emachines) {
    const gearRatio = context.system.components.gearbox?.gearRatio || 1;
    emachines
      .filter((em) => typeof em != "undefined")
      .forEach((em, index) => {
        const emGraphData = emachineGraphData(gearRatio, em);
        const color = colors[index % colors.length];
        datasets.push({
          label: `${gearRatio == 1 ? "" : "Gearbox+"}${em.designation}`,
          data: emGraphData.map(toPoint),
          backgroundColor: color,
          borderColor: color,
        });
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
              text: "Torque (Nm)",
              display: true,
            },
          },
        },
      }}
    />
  );
}
