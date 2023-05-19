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

  const data = [
    { year: 2010, count: context.system.input.pump.head },
    { year: 2011, count: context.system.input.pump.head + 3 },
    { year: 2012, count: context.system.input.pump.head + 13 },
    { year: 2013, count: context.system.input.pump.head + 33 },
    { year: 2014, count: context.system.input.pump.head + 33 },
    { year: 2015, count: context.system.input.pump.head + 13 },
    { year: 2016, count: context.system.input.pump.head * 2 },
  ];

  return (
    <Line
      data={{
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map((row) => row.count),
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
