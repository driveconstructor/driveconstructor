import { BaseCandidates } from "./component";
import { System } from "./system";

export function findCandidates(system: System): BaseCandidates {
  return {
    emachine: [
      {
        type: "SCIM",
        price: 25093,
        ratedPower: 132,
        ratedSpeed: 1488,
        ratedSynchSpeed: 1500,
        maximumSpeed: 1800,
        ratedVoltageY: { min: 360, max: 440, value: 400 },
        efficiencyClass: "IE4",
        efficiency100: 96.7,
        efficiency75: 96.67,
        efficiency50: 95.01,
        efficiency25: 90.03,
        ratedCurrent: 257.89,
        ratedTorque: 236.62,
        workingCurrent: 847.42,
        torqueOverload: 2.5,
        cosFi100: 0.764,
        cosFi75: 0.7258,
        cosFi50: 0.6876,
        cooling: "IC411",
        mounting: "B3",
        protection: "IP21/23",
        frameMaterial: "cast iron",
        shaftHeight: 280,
        outerDiameter: 0.56,
        length: 1.12,
        volume: 0.2759,
        momentOfInertia: 5.01,
        footPrint: 0.6272,
        weight: 961.34,
        designation: "IM-132-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
      },
      {
        type: "SyRM",
        price: 25093,
        ratedPower: 132,
        ratedSpeed: 1488,
        ratedSynchSpeed: 1500,
        maximumSpeed: 1800,
        ratedVoltageY: { min: 360, max: 440, value: 400 },
        efficiencyClass: "IE4",
        efficiency100: 96.7,
        efficiency75: 96.67,
        efficiency50: 95.01,
        efficiency25: 90.03,
        ratedCurrent: 257.89,
        ratedTorque: 236.62,
        workingCurrent: 847.42,
        torqueOverload: 2.5,
        cosFi100: 0.764,
        cosFi75: 0.7258,
        cosFi50: 0.6876,
        cooling: "IC411",
        mounting: "B3",
        protection: "IP21/23",
        frameMaterial: "cast iron",
        shaftHeight: 280,
        outerDiameter: 0.56,
        length: 1.12,
        volume: 0.2759,
        momentOfInertia: 5.01,
        footPrint: 0.6272,
        weight: 961.34,
        designation: "YM-132-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
      },
    ],
    cable: [
      {
        // 30	1021	copper	150	1	1	0.65	99.51	34.03	1.83	0.004477	0.000129	CU-3x150-01kV
        length: 30,
        price: 1021,
        material: "copper",
        crossSection: 150,
        voltage: 1,
        numberOfRuns: 1,
        designation: "CU-3x150-01kV",
        efficiency100: 111,
        pricePerMeter: 22,
        losses: 33,
        reactancePerHz: 1,
        resistancePerMeter: 3,
        voltageDrop: 3,
      },
    ],
    fconvertor: [
      {
        cooling: "air",
        cosFi100: 1,
        currentHO: 22,
        currentLO: 33,
        depth: 1,
        designation: "XXXX",
        efficiency100: 1,
        efficiency25: 0.5,
        efficiency50: 0.25,
        efficiency75: 0.1,
        footprint: 11,
        gridSideFilterDesignation: "AAA",
        machineSideFilterDesignation: "BBB",
        height: 12,
        mounting: "floor",
        price: 444,
        protection: "IP21/31",
        ratedPower: 22,
        type: "2Q-3L-NPC-VSC",
        voltage: { min: 1, max: 2, value: 400 },
        volume: 1,
        weight: 2,
        width: 11,
        workingVoltage: 1,
      },
    ],
  };
}
