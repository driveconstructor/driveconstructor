import { Gearbox, StageType, StageTypeAlias } from "./gearbox";
import { GearboxComponent, GearboxStageComponent } from "./gearbox-component";

const Torque = [
  5, 10, 20, 30, 40, 60, 80, 100, 140, 180, 220, 270, 320, 370, 440, 500, 600,
  750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 9000, 12000, 15000,
  20000, 30000, 40000, 50000, 70000, 100000, 120000, 150000, 200000, 300000,
  400000, 500000, 700000, 1000000, 1500000, 2000000, 2500000, 3000000,
];
export function findGearbox(
  gearbox: Gearbox,
  mechanismRatedTorque: number,
): GearboxComponent[] {
  let stage1 = findStage(
    gearbox.stage1Type,
    gearbox.stage1Ratio,
    mechanismRatedTorque,
  );

  // const inputTorque = mechanismRatedTorque / 1000;

  /*  if (typeof stage == "undefined") {
    return [];
  }

  if (gearbox.numberOfStages > 1) {
    stage = combine(
      stage,
      findStage(gearbox.stage2Type, gearbox.stage2Ratio, mechanismRatedTorque),
    );
  }

  if (gearbox.numberOfStages > 2) {
    stage = combine(
      stage,
      findStage(gearbox.stage3Type, gearbox.stage3Ratio, mechanismRatedTorque),
    );
  }*/

  const designation = "TODO"; // = getDesignation(type, torque, gearRatio);

  return [
    {
      ...gearbox,
      ...stage1,
      designation,
    },
  ];
}

function combine(
  a: GearboxStageComponent,
  b?: GearboxStageComponent,
): GearboxStageComponent {
  if (typeof b == "undefined") {
    return a;
  }

  return {
    inputTorque: b.inputTorque,
    torque: b.torque,
    gearRatio: a.gearRatio * b.gearRatio,
    efficiency100: a.efficiency100 * b.efficiency100,
    price: a.price + b.price,
    width: a.width + b.width,
    length: a.length + b.length,
    weight: a.weight + b.weight,
    height: Math.max(a.height, b.height),
  };
}

function findStage(
  type: StageTypeAlias,
  gearRatio: number,
  inputTorque: number,
): GearboxStageComponent {
  return Torque.filter((torque) => {
    if (type == "worm") {
      if (torque <= 10000) {
        return true;
      }

      if (gearRatio >= 10 && gearRatio <= 40) {
        return true;
      }
    }

    if (type == "helical" && gearRatio >= 3 && gearRatio <= 8) {
      return true;
    }

    if (type == "planetary" && gearRatio >= 4 && gearRatio <= 8) {
      return true;
    }

    if (type == "bevel") {
      if (torque <= 100000) {
        return true;
      }

      if (gearRatio >= 2 && gearRatio <= 3) {
        return true;
      }
    }

    return false;
  })
    .filter((torque) => inputTorque <= torque)
    .slice(0, 1)
    .map((torque) => {
      const efficiency100 = getEfficiency100(type, gearRatio) * 100;
      const weight = Math.pow(torque, 0.9) / (Math.pow(gearRatio, 0.26) * 10.6);
      const volume = weight / 1000 / 1.45;
      const length = Math.pow(volume, 1 / 3);
      const height = 1.2 * Math.pow(volume, 1 / 3);
      const width = (1 / 1.2) * Math.pow(volume, 1 / 3);
      const price = 37 * Math.pow(weight / 1000, 0.6) * 1000;

      const shaftDiamHS = 0.012 * Math.pow(weight, 1 / 3);
      const inertiaHSshaft =
        0.1 * Math.pow(shaftDiamHS, 4) * length * 1.2 * 8000;
      const inertiaHSdisk =
        0.1 * Math.pow(height / 2 / gearRatio, 4) * shaftDiamHS * 1.2 * 8000;
      const inertiaHSpart = inertiaHSshaft + inertiaHSdisk;

      const shaftDiamLS = shaftDiamHS * Math.pow(gearRatio, 1 / 3);
      const inertiaLSshaft =
        0.1 * Math.pow(shaftDiamLS, 4) * length * 1.2 * 8000;
      const inertiaLSdisk =
        0.1 * Math.pow(height / 2, 4) * shaftDiamLS * 1.2 * 8000;
      const inertiaLSpart = inertiaLSshaft + inertiaLSdisk;
      const designation = getDesignation(type, torque, gearRatio);
      const inputTorque = torque / 1000;

      return {
        designation,
        inputTorque,
        torque: ((inputTorque / gearRatio) * efficiency100) / 100,
        gearRatio,
        efficiency100,
        weight,
        length,
        height,
        width,
        price,
        inertiaHSpart,
        inertiaLSpart,
      };
    })[0];
}

export function getEfficiency100(type: StageTypeAlias, gearRatio: number) {
  switch (type) {
    case "helical":
    case "planetary":
    case "bevel":
      return 0.99;
    case "worm":
      return 0.9 - 0.004 * gearRatio;
  }
}

export function getDesignation(
  type: StageTypeAlias,
  torque: number,
  gearRatio: number,
) {
  const result = [];
  switch (type) {
    case "planetary":
      result.push("P");
      break;
    case "helical":
      result.push("H");
      break;
    case "bevel":
      result.push("B");
      break;
    case "worm":
      result.push("W");
      break;
    default:
      result.push("XXX");
  }

  result.push(torque);
  result.push(gearRatio);

  return result.join("-");
}
