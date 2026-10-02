import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { dimensions } from "../utils/dimensions.js";
export function FitNote() {
  const { invalidDimensions, parsed } = useCalculator();
  const complete =
    dimensions.every((k) => parsed[k] !== null) && !invalidDimensions.length;
  const fits = complete ? dimensions.every((k) => parsed[k] <= 256) : null;
  return (
    <p
      id="fit-note"
      className={`section-note ${invalidDimensions.length || fits === false ? "warning" : ""}`}
    >
      {invalidDimensions.length
        ? "Исправьте заданные габариты для проверки размера. Стоимость продолжает рассчитываться."
        : fits === null
          ? "Габариты необязательны. Заполните X, Y и Z для проверки поля A1: 256 × 256 × 256 мм. На стоимость они не влияют."
          : fits
            ? "Габариты в пределах 256 × 256 × 256 мм. Проверьте размещение и место для каймы в слайсере."
            : "Размер превышает поле A1 (256 × 256 × 256 мм). Проверьте ориентацию, разделение модели или другой принтер."}
    </p>
  );
}
