"use client";

import { System } from "@/model/system";
import {
  downloadDfimModelFile,
  exportDfimParameters,
} from "@/model/system-export";

export default function DfimExportActions({
  system,
  onError,
}: {
  system: System;
  onError: (message: string) => void;
}) {
  if (system.params == null || system.components.emachine?.type != "DFIM") {
    return null;
  }

  const downloadModelFile = (
    path: string,
    fileName: string,
    fallbackMessage: string,
  ) => {
    void downloadDfimModelFile(path, fileName).catch((error: unknown) =>
      onError(error instanceof Error ? error.message : fallbackMessage),
    );
  };

  return (
    <section
      className="m-2 rounded border p-2"
      data-testid="dfim-export-actions"
      aria-labelledby="dfim-export-heading"
    >
      <div
        id="dfim-export-heading"
        className="mb-2 text-sm font-medium text-gray-600"
      >
        DFIM model export
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          className="btn w-full whitespace-normal"
          onClick={() =>
            exportDfimParameters(system.components.emachine, system)
          }
        >
          Parameters CSV
        </button>
        <button
          className="btn w-full whitespace-normal"
          onClick={() =>
            downloadModelFile(
              "/matlabFiles/dfim_vindturbin_script.m",
              "dfim_vindturbin_script.m",
              "MATLAB script download failed",
            )
          }
        >
          MATLAB script
        </button>
        <button
          className="btn w-full whitespace-normal"
          onClick={() =>
            downloadModelFile(
              "/matlabFiles/DFIM_vindturbin_model.slx",
              "DFIM_vindturbin_model.slx",
              "Simulink model download failed",
            )
          }
        >
          Simulink model
        </button>
      </div>
    </section>
  );
}
