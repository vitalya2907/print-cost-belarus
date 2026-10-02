import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { num } from "../utils/format.js";
export function RangeMaximum({ name, base, unit }) {
  const { values } = useCalculator();
  return (
    <span>
      {num(Math.max(base, Number(values[name]) || 0))} {unit}
    </span>
  );
}
export function RiskButton({ value, children }) {
  const { values, setValue } = useCalculator();
  const active = Number(values.failure) === value;
  return (
    <button
      type="button"
      data-risk={value}
      className={active ? "active" : ""}
      aria-pressed={active}
      onClick={() => setValue("failure", String(value))}
    >
      {children}
    </button>
  );
}
