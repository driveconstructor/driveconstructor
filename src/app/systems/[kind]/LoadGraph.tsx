import { useContext } from "react";
import { SystemContext } from "./Input";

import { loadGraph } from "@/model/load-graph";
import {
  CategoryScale,
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
  const datasets = [
    {
      label: Object.keys(context.model.input)[0],
      data: loadData.map((row) => row.torque),
    },
  ];

  if (context.system.candidates.emachine) {
    context.system.candidates.emachine.forEach((em) => {
      const emLoadData = getEMachineLoadGraphData(em);
      datasets.push({
        label: em.designation,
        data: emLoadData.map((row) => row.torque),
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
