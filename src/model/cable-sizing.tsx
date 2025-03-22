import { CableComponent } from "./cable-component";
import { EMachineComponent } from "./emachine-component";

export function findCableComponent(em: EMachineComponent): CableComponent[] {
  return [
    {
      length: 0,
      material: "aluminum",
      crossSection: 2.5,
      numberOfRuns: 1,
      voltage: 0,
      reactancePerHz: 0,
      resistancePerMeter: 0,
      pricePerMeter: 0,
      price: 0,
      designation: "xxx",
      voltageDrop: 0,
      losses: 0,
      efficiency100: 0,
    },
  ];
}
