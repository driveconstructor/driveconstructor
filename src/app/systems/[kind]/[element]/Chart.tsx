import { useContext } from "react";
import { SystemContext } from "./Input";

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

export default function Chart() {
  const context = useContext(SystemContext);

  const data = context.model.loadGraph(context.system);

  return (
    <Line
      data={{
        labels: data.map((row) => Math.round(row.speed)),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map((row) => row.torque),
          },
        ],
      }}
      options={{
        animation: {
          duration: 0,
        },
      }}
    />
  );
}
