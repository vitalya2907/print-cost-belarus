import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { PartSection } from "./PartSection.jsx";
import { MaterialEnergySection } from "./MaterialEnergySection.jsx";
import { PrinterRiskSection } from "./PrinterRiskSection.jsx";
import { ExtrasSection } from "./ExtrasSection.jsx";
export function CalculatorForm() {
  const { reset } = useCalculator();
  return (
    <form
      id="calculator"
      noValidate
      className="controls"
      onSubmit={(e) => e.preventDefault()}
    >
      <PartSection />
      <MaterialEnergySection />
      <PrinterRiskSection />
      <ExtrasSection />
      <button type="button" id="reset" className="reset" onClick={reset}>
        Сбросить к исходному примеру
      </button>
    </form>
  );
}
