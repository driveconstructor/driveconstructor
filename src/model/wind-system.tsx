import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement, TrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Trafo, TrafoElement } from "./trafo";
import { updateTrSystem } from "./trafo-system-utils";
import { Wind, WindElement } from "./wind";

export type WindFc = BaseSystem & {
  kind: "wind-fc";
  input: {
    wind: Wind;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WindFcModel: Model<WindFc> = {
  kind: "wind-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      This simple system topology can be used at low powers when it is possible
      to find a generator matching speed of the turbine blades and when both,
      the generator and the FC, have voltage rating close to that of the grid.
    </div>
  ),
  input: {
    wind: WindElement,
    emachine: {
      ...EMachinePMSMElement,
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};

export type WindFcTr = BaseSystem & {
  kind: "wind-fc-tr";
  input: { wind: Wind; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WindFcTrModel: Model<WindFcTr> = {
  kind: "wind-fc-tr",
  title: "Drive train with FC and transformer",
  description: (
    <div>
      In this solution the transformer is used for matching the voltage in the
      grid and FC&apos;s rated voltage and for galvanic insulation. It is
      possible to find a generator matching speed of the turbine blades without
      any gearbox.
    </div>
  ),
  input: {
    wind: WindElement,
    emachine: { ...WindFcModel.input.emachine },
    cable: CableElement,
    fconverter: TrafoFConverterElement,
    trafo: TrafoElement,
    switch: SwitchElement,
    grid: {
      ...GridElement,
      params: {
        ...GridElement.params,
        voltage: { ...GridElement.params.voltage, value: 6000 },
      },
    },
  },
  update: updateTrSystem,
};

export type WindGbFc = BaseSystem & {
  kind: "wind-gb-fc";
  input: { wind: Wind; gearbox: Gearbox };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WindGbFcModel: Model<WindGbFc> = {
  kind: "wind-gb-fc",
  title: "Drive train with FC and gearbox",
  description: (
    <div>
      This solution can be used when the turbine blades have too low rated speed
      to be matched by an available generator and the transformer is used for
      matching the voltage in the grid and FC&apos;s rated voltage and for
      galvanic insulation.
    </div>
  ),
  input: {
    wind: {
      ...WindElement,
      params: {
        ...WindElement.params,
        ratedSpeedOfBlades: {
          ...WindElement.params.ratedSpeedOfBlades,
          value: 20,
          range: { min: 10, max: 400 },
        },
        ratedTorque: {
          ...WindElement.params.ratedTorque,
          value: 200,
          range: { min: 1, max: 2000 },
        },
      },
    },
    gearbox: GearboxElement,
    emachine: { ...WindFcModel.input.emachine },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};

export type WindGbFcTr = BaseSystem & {
  kind: "wind-gb-fc-tr";
  input: { wind: Wind; gearbox: Gearbox; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WindGbFcTrModel: Model<WindGbFcTr> = {
  kind: "wind-gb-fc-tr",
  title: "Drive train with gearbox, electric machine, FC and transformer",
  description: (
    <div>
      This solution can be used when the turbine blades have too low rated speed
      to be matched by the double-fed machine, and the transformer is used for
      matching the voltage in the grid and FC&apos;s and for galvanic
      insulation.
    </div>
  ),
  input: {
    wind: { ...WindGbFcModel.input.wind },
    gearbox: GearboxElement,
    emachine: { ...WindFcModel.input.emachine },
    cable: CableElement,
    fconverter: TrafoFConverterElement,
    trafo: TrafoElement,
    switch: SwitchElement,
    grid: {
      ...WindFcTrModel.input.grid,
    },
  },
  update: updateTrSystem,
};
