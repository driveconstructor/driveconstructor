import { System } from "@/model/system";
import { SystemParamsModelType } from "@/model/system-params";
import { Chart, ChartOptions, RadialLinearScale } from "chart.js";
import { Radar } from "react-chartjs-2";

Chart.register(RadialLinearScale);

export const backgroundColors = [
  "rgba(183, 217, 247, 0.1)",
  "rgba(174, 223, 242, 0.1)",
  "rgba(156, 187, 244, 0.1)",
  "rgba(153, 183, 255, 0.1)",
  "rgba(134, 201, 232, 0.1)",
  "rgba(153, 129, 249, 0.1)",
  "rgba(138, 207, 242, 0.1)",
  "rgba(184, 214, 252, 0.1)",
  "rgba(133, 211, 242, 0.1)",
  "rgba(109, 120, 242, 0.1)",
];

export const borderColors = [
  "rgba(117, 219, 244, 1)",
  "rgba(147, 147, 242, 1)",
  "rgba(174, 163, 247, 1)",
  "rgba(107, 170, 219, 1)",
  "rgba(189, 209, 252, 1)",
  "rgba(204, 238, 255, 1)",
  "rgba(183, 223, 247, 1)",
  "rgba(122, 211, 226, 1)",
  "rgba(190, 187, 247, 1)",
  "rgba(138, 110, 229, 1)",
];

function normalizeParamValues(
  model: Partial<SystemParamsModelType>,
  systems: System[],
  params: Record<string, number>,
) {
  return Object.entries(model).map(([k, m]) => {
    const values: number[] = systems.map((s) => (s.params as any)[k]);
    const max = m.max ? m.max : Math.max(...values);
    const min = m.min ? m.min : 0;

    return (params[k] - min) / (max - min);
  });
}

export default function ComparisonGraph({
  systems,
  model,
}: {
  systems: System[];
  model: Partial<SystemParamsModelType>;
}) {
  const datasets = systems.map((s, index) => ({
    label: s.name,
    data: normalizeParamValues(
      model,
      systems,
      s.params as Record<string, number>,
    ),
    backgroundColor: backgroundColors[index],
    borderColor: borderColors[index],
  }));
  const data = {
    labels: Object.keys(model),
    datasets,
  };

  const options: ChartOptions<"radar"> = {
    animation: false,
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };
  return (
    <div>
      <Radar data={data} options={options}></Radar>
    </div>
  );
}
