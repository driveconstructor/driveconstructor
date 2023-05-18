import ChartJS from "chart.js/auto";
import { useContext, useEffect } from "react";
import { SystemContext } from "./Input";

let chart: ChartJS | null = null;

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

  useEffect(() => {
    if (chart != null) {
      chart.destroy();
    }

    chart = new ChartJS(
      document.getElementById("chartjs") as HTMLCanvasElement,
      {
        type: "line",
        data: {
          labels: data.map((row) => row.year),
          datasets: [
            {
              label: "Acquisitions by year",
              data: data.map((row) => row.count),
            },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
        },
      }
    );
  }, [data]);

  return <canvas id="chartjs" />;
}
