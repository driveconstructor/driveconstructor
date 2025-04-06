import { StageType, StageTypeAlias } from "./gearbox";
import { GearboxStageComponent } from "./gearbox-component";

const Torque = [
  5, 10, 20, 30, 40, 60, 80, 100, 140, 180, 220, 270, 320, 370, 440, 500, 600,
  750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 9000, 12000, 15000,
  20000, 30000, 40000, 50000, 70000, 100000, 120000, 150000, 200000, 300000,
  400000, 500000, 700000, 1000000, 1500000, 2000000, 2500000, 3000000,
];
const GearRatio = [...Array(81)].map((_, i) => i * 0.5).filter((v) => v >= 1.5);

export function findGearboxes(): GearboxStageComponent[] {
  return StageType.flatMap((type) =>
    Torque.flatMap((torque) =>
      GearRatio.filter((gearRatio) => {
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
      }).flatMap((gearRatio) => {
        const efficiency100 = getEfficiency100(type, gearRatio) * 100;
        const weight =
          Math.pow(torque, 0.9) / (Math.pow(gearRatio, 0.26) * 10.6);
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

        return {
          designation,
          efficiency100,
          weight,
          length,
          height,
          width,
          price,
          inertiaHSpart,
          inertiaLSpart,
        };
      }),
    ),
  );
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
