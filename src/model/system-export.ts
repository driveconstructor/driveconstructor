import { System } from "@/model/system";
import { WindFc } from "./wind-system";
//import System from "@/app/(home)/systems/[kind]/System";
//import csvDownloader from 'react-csv-downloader';

function calcMachineResistance(
  emachine: System["components"]["emachine"],
  system: System,
  fileName: string,
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
    String(system.components.gearbox?.gearRatio),
  ];

  const systemName: string[] = ["System name", String(fileName)];

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
    //systemName,
  ];

  return emachineParameters;
}

export const exportToCsv = (
  emachine: System["components"]["emachine"],
  fileName: string,
  system: System,
): void => {
  const data = calcMachineResistance(emachine, system, fileName);

  const csvData = data.map((row) => row.join(",")).join("\n");
  //const filePath = "output.csv";

  // Create a Blob from the CSV string
  const blob = new Blob([csvData], { type: "text/csv" });
  // Generate a download link and initiate the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Parameters.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  //Download matlab and simulink files
  fetch("/matlabFiles/DFIM_vindturbin_model.slx")
    .then((response) => response.blob())
    .then((blob) => {
      const simulinkUrl = URL.createObjectURL(blob);
      const simulinkLink = document.createElement("a");
      simulinkLink.href = simulinkUrl;
      simulinkLink.download = "DFIM_vindturbin_model.slx";
      document.body.appendChild(simulinkLink);
      simulinkLink.click(); //Comment this line to block download
      document.body.removeChild(simulinkLink);
      URL.revokeObjectURL(simulinkUrl);
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });

  fetch("/matlabFiles/dfim_vindturbin_script.m")
    .then((response) => response.blob())
    .then((blob) => {
      const matlabUrl = URL.createObjectURL(blob);
      const matlabLink = document.createElement("a");
      matlabLink.href = matlabUrl;
      matlabLink.download = "dfim_vindturbin_script.m";
      document.body.appendChild(matlabLink);
      matlabLink.click(); //Comment this line to block download
      document.body.removeChild(matlabLink);
      URL.revokeObjectURL(matlabUrl);
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
};
