import { useContext } from "react";
import { SystemContext } from "./Input";

import { loadGraph } from "@/model/load-graph";
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
import { getEMachineLoadGraphData } from "@/model/emachine-graph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LoadGraph() {
  const context = useContext(SystemContext);

  const loadData = loadGraph(context.system);
  const datasets: ChartDataset<"line">[] = [
    {
      label: Object.keys(context.model.input)[0],
      data: loadData.map((row) => row.torque),
    },
  ];

  const colors = ["blue", "green", "brown", "olive", "red", "orange"];

  const emachines = context.system.components.emachine
    ? [context.system.components.emachine]
    : context.system.candidates.emachine;

  if (emachines) {
    emachines.forEach((em, index) => {
      const emLoadData = getEMachineLoadGraphData(em);
      const color = colors[index % colors.length];
      datasets.push({
        label: em.designation,
        data: emLoadData.map((row) => row.torque),
        backgroundColor: color,
        borderColor: color,
      });
    });
  }

  return (
    <Line
      data={{
        labels: loadData.map((row) => Math.round(row.speed)),
        datasets,
      }}
      options={{
        animation: {
          duration: 0,
        },
        scales: {
          x: {
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
