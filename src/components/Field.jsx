import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { dimensions } from "../utils/dimensions.js";
export function Field(props) {
  const { values, setValue, invalid, invalidDimensions } = useCalculator();
  const slider = props["data-slider"];
  const key = slider || props.name;
  const value = values[key];
  const numeric = Number(value);
  const rangeMax = slider
    ? Math.max(Number(props.max), Number.isFinite(numeric) ? numeric : 0)
    : props.max;
  const fieldInvalid = dimensions.includes(key)
    ? invalidDimensions.includes(key)
    : invalid.includes(key);
  return (
    <input
      {...props}
      value={value}
      max={rangeMax}
      step={slider ? "any" : props.step}
      aria-invalid={slider ? undefined : fieldInvalid}
      onChange={(e) =>
        setValue(key, e.target.value, e.target.validity.badInput)
      }
      style={
        slider
          ? {
              "--fill": `${Math.max(0, Math.min(100, ((numeric - Number(props.min)) / (rangeMax - Number(props.min))) * 100))}%`,
            }
          : undefined
      }
    />
  );
}
