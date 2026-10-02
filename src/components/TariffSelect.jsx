import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";

export function TariffSelect() {
  const { tariffPreset, setTariff } = useCalculator();
  return (
    <select
      id="tariffPreset"
      value={tariffPreset}
      onChange={(e) => setTariff(e.target.value)}
    >
      <option value="0.2581">Электроплита без газа · 0,2581 BYN/кВт·ч</option>
      <option value="0.3037">Прочие бытовые · 0,3037 BYN/кВт·ч</option>
      <option value="0.3265">Полное возмещение · 0,3265 BYN/кВт·ч</option>
      <option value="custom">Свой тариф</option>
    </select>
  );
}
