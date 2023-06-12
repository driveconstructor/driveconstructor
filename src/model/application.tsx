import { StaticImageData } from "next/image";
import React from "react";
import appPump from "../images/app-pump.svg";
import appWinch from "../images/app-winch.svg";
import { PumpFcModel, PumpGbFcModel } from "./pump-system";
import { SystemModel } from "./system";
import { WinchFcModel } from "./winch-system";

export type ApplicationModel = {
  name: string;
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
    systems: [PumpFcModel, PumpGbFcModel /*, "PumpFcTr", "PumpGbFcTr"*/],
    url: "/docs/TextBook/Applications/Pump_type.html  ",
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
    url: "/docs/tbd",
  },
];

export default applications;
