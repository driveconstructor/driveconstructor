import { System } from "@/model/system";
import { WindFc } from "./wind-system";
//import System from "@/app/(home)/systems/[kind]/System";
//import csvDownloader from 'react-csv-downloader';

function calcMachineResistance(
  emachine: System["components"]["emachine"],
  system: System,
): string[][] {
  if (emachine == null) {
    throw new Error("EMachine component is required to calculate resistance.");
  }
  const R_s =
    (emachine?.ratedPower * 1000 * 0.01) /
    (3 * Math.pow(emachine?.ratedCurrent, 2));
  const Rs: string[] = ["R_s", String(R_s / 2)];
  const Rr: string[] = ["R_r", String(R_s / 2)];

  const L_s =
    (0.1 * emachine?.ratedVoltageY.value) /
    (Math.sqrt(3) * emachine?.ratedCurrent);
  const Ls: string[] = ["L_s", String(L_s / 2)];
  const Lr: string[] = ["L_r", String(L_s / 2)];

  const L_m =
    (2 * emachine?.ratedVoltageY.value) /
    (Math.sqrt(3) * emachine?.ratedCurrent);
  const Lm: string[] = ["L_m", String(L_m)];

  //Få ut nom. vindhastighet til csv fil
  const input = system.input as WindFc["input"];

  const vw: string[] = ["Rated wind speed", String(input.wind.ratedWindSpeed)];

  //pairs of pole calculation
  const ppString: string[] = [
    "Pairs of poles",
    String(Math.round((60 * 50) / emachine?.ratedSynchSpeed)),
  ];

  //Generator nom. power
  const Pm: string[] = [
    "Machine rated power",
    String(emachine?.ratedPower * 1000),
  ];

  //Generator nom. voltage
  const Vm: string[] = [
    "Machine rated voltage",
    String(emachine?.ratedVoltageY.value),
  ];

  //Rotor nom power
  const Pw: string[] = [
    "Power on shaft",
    String(input.wind.powerOnShaft * 1000),
  ];

  //Grid nom. voltage
  const Vg: string[] = [
    "Grid rated voltage",
    String(system.input.grid.voltage),
  ];

  //system efficiency
  const eff: string[] = [
    "System efficiency",
    String(system.params?.efficiency100),
  ];

  //rotor diameter
  const rotorDiameter: string[] = [
    "Rotor diameter",
    String(input.wind.rotorDiameter),
  ];

  //Generator moment of inertia
  const genMomentOfInertia: string[] = [
    "Generator moment of inertia",
    String(emachine?.momentOfInertia),
  ];

  //gearbox ratio
  const gearboxRatio: string[] = [
    "Gearbox ratio",
    String(system.components.gearbox?.gearRatio ?? 1),
  ];

  const emachineParameters: string[][] = [
    Rs,
    Ls,
    Rr,
    Lr,
    Lm,
    vw,
    ppString,
    Pm,
    Vm,
    Pw,
    Vg,
    eff,
    rotorDiameter,
    genMomentOfInertia,
    gearboxRatio,
  ];

  return emachineParameters;
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const exportDfimParameters = (
  emachine: System["components"]["emachine"],
  system: System,
): void => {
  const data = calcMachineResistance(emachine, system);

  const csvData = data.map((row) => row.join(",")).join("\n");
  downloadBlob(new Blob([csvData], { type: "text/csv" }), "Parameters.csv");
};

export async function downloadDfimModelFile(
  path: string,
  fileName: string,
): Promise<void> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to download ${fileName}: HTTP ${response.status}`);
  }
  downloadBlob(await response.blob(), fileName);
}
