import { EMachineType, ERatedPower } from "./emachine";

const ERatedSynchSpeed = [
  3000, 1500, 1000, 750, 600, 500, 400, 300, 200, 100,
] as const;

type FilteredBySpeed = {
  type: (typeof EMachineType)[number];
  ratedPower: (typeof ERatedPower)[number];
  speed: (typeof ERatedSynchSpeed)[number];
  ratedSpeed: number;
  ratedTorque: number;
};

export function findTypeSpeedAndTorque(
  mechanismSpeed: number,
  mechanismTorque: number
): FilteredBySpeed[] {
  return ERatedSynchSpeed.filter(
    (speed) => speed > mechanismSpeed / 1.2
  ).flatMap((speed) =>
    EMachineType.flatMap((type) =>
      ERatedPower.map((ratedPower) => {
        const slip = 0.053 * Math.pow(ratedPower, -0.38);
        const ratedSpeed = type == "SCIM" ? speed * (1 - slip) : speed;
        const ratedTorque = 1000 * (ratedPower / ratedSpeed) * 9.55;

        const result = { type, ratedPower, speed, ratedSpeed, ratedTorque };
        return { type, ratedPower, speed, ratedSpeed, ratedTorque };
      }).filter(
        (o) =>
          o.ratedSpeed <= mechanismSpeed * 2 &&
          o.ratedTorque >= mechanismTorque &&
          o.ratedTorque < mechanismTorque / 0.6
      )
    )
  );
}

type VoltageY = {
  min: number;
  max: number;
};

const LowVoltage = [400, 660] as const;

const MediumVoltage = [3300, 6600, 10000] as const;

const Voltage = [...LowVoltage, ...MediumVoltage];

export function findVoltageY(altitude: number, voltage: number): VoltageY {
  const derating = altitude > 2000 ? 1 - 0.00015 * (altitude - 2000) : 1;
  const deratedVoltage = voltage / derating;

  const result = [...Voltage].sort(
    (a, b) => Math.abs(a - deratedVoltage) - Math.abs(b - deratedVoltage)
  )[0];

  return { min: result * 0.9, max: result * 1.1 };
}
