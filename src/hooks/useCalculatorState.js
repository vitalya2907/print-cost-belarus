import { useState } from "react";
import { calculate, defaults, bounds } from "../calculator.mjs";
import { materials, defaultMaterial } from "../materials.mjs";
import { dimensions } from "../utils/dimensions.js";
const initialValues = () =>
  Object.fromEntries(
    Object.entries(defaults).map(([k, v]) => [k, v === null ? "" : String(v)]),
  );

export function useCalculatorState() {
  const [values, setValues] = useState(initialValues);
  const [badInputs, setBadInputs] = useState({});
  const [materialId, setMaterialId] = useState(defaultMaterial);
  const [tariffPreset, setTariffPreset] = useState(String(defaults.tariff));
  const setValue = (key, value, bad = false) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setBadInputs((prev) => ({ ...prev, [key]: bad }));
    if (key === "tariff") setTariffPreset("custom");
  };
  const chooseMaterial = (id) => {
    setMaterialId(id);
    setValue(
      "filamentPrice",
      materials.find((m) => m.id === id).price?.toString() ?? "",
    );
  };
  const setTariff = (preset) => {
    setTariffPreset(preset);
    if (preset !== "custom") {
      setValues((prev) => ({ ...prev, tariff: preset }));
      setBadInputs((prev) => ({ ...prev, tariff: false }));
    }
  };
  const reset = () => {
    setValues(initialValues());
    setBadInputs({});
    setMaterialId(defaultMaterial);
    setTariffPreset(String(defaults.tariff));
  };
  const parsed = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [
      k,
      badInputs[k]
        ? NaN
        : v === ""
          ? dimensions.includes(k)
            ? null
            : NaN
          : Number(v),
    ]),
  );
  const invalid = Object.entries(bounds)
    .filter(
      ([k, [min, max]]) =>
        !dimensions.includes(k) &&
        (!Number.isFinite(parsed[k]) ||
          parsed[k] < min ||
          parsed[k] > max ||
          (k === "quantity" && !Number.isInteger(parsed[k]))),
    )
    .map(([k]) => k);
  const invalidDimensions = dimensions.filter(
    (k) =>
      parsed[k] !== null &&
      (!Number.isFinite(parsed[k]) ||
        parsed[k] < bounds[k][0] ||
        parsed[k] > bounds[k][1]),
  );
  const result = invalid.length ? null : calculate(parsed);
  const material = materials.find((m) => m.id === materialId);

  return {
    values,
    setValue,
    parsed,
    invalid,
    invalidDimensions,
    result,
    materialId,
    material,
    chooseMaterial,
    tariffPreset,
    setTariff,
    reset,
  };
}
