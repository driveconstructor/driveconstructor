import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
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
      <p>
        This simple system topology can be used at low powers when it is
        possible to find a generator matching speed of the turbine blades and
        when both, the generator and the FC, have voltage rating close to that
        of the grid.
      </p>
    </div>
  ),
  input: {
    wind: WindElement,
    emachine: {
      ...EMachineElement,
      params: {
        ...EMachineElement.params,
        type: {
          ...EMachineElement.params.type,
          value: "PMSM",
        },
      },
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
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
