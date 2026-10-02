import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { materials } from "../materials.mjs";
export function MaterialSelect() {
  const { materialId, chooseMaterial } = useCalculator();
  return (
    <select
      id="materialPreset"
      aria-describedby="material-note"
      value={materialId}
      onChange={(e) => chooseMaterial(e.target.value)}
    >
      {["PLA", "PETG", "Свой материал"].map((group) => (
        <optgroup key={group} label={group}>
          {materials
            .filter((m) => m.group === group)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
                {m.price === null ? "" : ` · ${m.price} BYN/кг`}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}
export function MaterialNote() {
  const { material, values } = useCalculator();
  return (
    <small id="material-note">
      {material.note}
      {material.price !== null &&
      Number(values.filamentPrice) !== material.price
        ? " Используется ваша цена за кг."
        : ""}
    </small>
  );
}
export function MaterialLink() {
  const { material } = useCalculator();
  return material.url ? (
    <a
      id="material-source"
      className="material-source"
      href={material.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Источник цены ↗
    </a>
  ) : null;
}
