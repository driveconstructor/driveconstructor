import { StaticImageData } from "next/image";
import React from "react";
import appConveyor from "../images/app-conveyor.svg";
import appPump from "../images/app-pump.svg";
import appWinch from "../images/app-winch.svg";
import appWind from "../images/app-wind.svg";

import { ConveyorFcModel } from "./conveyor-system";
import {
  PumpFcModel,
  PumpFcTrModel,
  PumpGbFcModel,
  PumpGbFcTrModel,
} from "./pump-system";
import { SystemKind, SystemModel } from "./system";
import { WinchFcModel } from "./winch-system";
import {
  WindFcModel,
  WindFcTrModel,
  WindGbFcModel,
  WindGbFcTrModel,
} from "./wind-system";
export type ApplicationType = "pump" | "wind" | "winch" | "conveyor";
export type ApplicationModel = {
  name: ApplicationType;
  icon: StaticImageData;
  title: React.ReactNode;
  description: React.ReactNode;
  systemHeader?: React.ReactNode;
  systems: SystemModel[];
  url: string;
};

const applications: ApplicationModel[] = [
  {
    name: "pump",
    icon: appPump,
    title: "Pumps",
    description: (
      <div>
        Design systems for either low cost or for low energy consumption for
        various pump type.
      </div>
    ),
    systemHeader: (
      <div>
        All the topologies include frequency converters (FC) to ensure variable
        speed operation. The FC provides full motor and pump controllability and
        protection. The switch is usually an automatic circuit breaker, though
        in certain cases it can be just a manual connector with fuses.
      </div>
    ),
    systems: [PumpFcModel, PumpGbFcModel, PumpFcTrModel, PumpGbFcTrModel],
    url: "TBD",
  },
  {
    name: "wind",
    icon: appWind,
    title: "Wind/tidal mill",
    description: (
      <div>
        Experiment with different drive train topologies, design systems for
        lowest cost of energy.
      </div>
    ),
    systems: [WindFcModel, WindGbFcModel, WindFcTrModel, WindGbFcTrModel],
    url: "/docs/tbd",
  },
  {
    name: "winch",
    icon: appWinch,
    title: "Winch",
    description: (
      <div>
        Design optimal systems for winches with both motoring and generating
        operation modes
      </div>
    ),
    systems: [WinchFcModel /*, "WinchGbFc", "WinchFcTr", "WinchGbFcTr"*/],
    url: "TBD",
  },
  {
    name: "conveyor",
    icon: appConveyor,
    title: "Conveyor",
    description: (
      <div>
        Try different gear solutions and motor speeds to design for lowest cost
        and compactness.
      </div>
    ),
    systems: [ConveyorFcModel /*, "WinchGbFc", "WinchFcTr", "WinchGbFcTr"*/],
    url: "TBD",
  },
];

export default applications;

export function getApplicationType(kind: SystemKind): ApplicationType {
  return applications.filter((a) =>
    a.systems.map((s) => s.kind).includes(kind),
  )[0].name;
}
