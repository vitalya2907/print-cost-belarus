import React, { createContext, useContext } from "react";
import { useCalculatorState } from "./hooks/useCalculatorState.js";
export const CalculatorContext = createContext(null);
export const useCalculator = () => useContext(CalculatorContext);
export function CalculatorProvider({ children }) {
  const calculator = useCalculatorState();
  return (
    <CalculatorContext.Provider value={calculator}>
      {children}
    </CalculatorContext.Provider>
  );
}
