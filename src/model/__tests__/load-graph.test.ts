import { describe, expect, test } from "@jest/globals";
import { loadGraph } from "../load-graph";
import { Pump } from "../pump";
import { PumpFc, PumpFcModel } from "../pump-system";
import { initOrUpdateSystemInput } from "../store";

const input = initOrUpdateSystemInput(PumpFcModel);

describe("graph", () => {
  test("pump-fc load graph", () => {
    expect(loadGraph({ kind: "pump-fc", input } as PumpFc)).toHaveLength(16);
  });
});
