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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LoadGraph() {
  const context = useContext(SystemContext);

  const data = loadGraph(context.system);

  return (
    <Line
      data={{
        labels: data.map((row) => Math.round(row.speed)),
        datasets: [
          {
            label: Object.keys(context.model.input)[0],
            data: data.map((row) => row.torque),
          },
        ],
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
