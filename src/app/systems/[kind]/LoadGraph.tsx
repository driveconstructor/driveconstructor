import { useContext } from "react";
import { SystemContext } from "./Input";

import { loadGraph, GraphPoint } from "@/model/load-graph";
import {
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  Point,
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
  const toPoint = (row: GraphPoint) => {
    return { x: Math.round(row.speed), y: Math.round(row.torque) };
  };
  const datasets: ChartDataset<"line">[] = [
    {
      label: Object.keys(context.model.input)[0],
      data: loadData.map(toPoint),
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
        data: emLoadData.map(toPoint),
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

function getSpeedPoints(maximumSpeed: number, ratedSpeed?: number) {
  const numberOfPoints = 15;
  const result = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed = (maximumSpeed * i) / numberOfPoints;
    result.push(speed);
  }

  if (ratedSpeed) {
    result.push(ratedSpeed, ratedSpeed / 2);
  }

  return result
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b)
    .map((s) => Math.round(s));
}
