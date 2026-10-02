import React from "react";
import { CalculatorProvider } from "./CalculatorContext.jsx";
import { Header } from "./components/Header.jsx";
import { Intro } from "./components/Intro.jsx";
import { CalculatorForm } from "./components/CalculatorForm.jsx";
import { Result } from "./components/Result.jsx";
import { Method } from "./components/Method.jsx";
import { Sources } from "./components/Sources.jsx";
import { Footer } from "./components/Footer.jsx";
export default function App() {
  return (
    <CalculatorProvider>
      <Header />
      <main>
        <Intro />
        <div className="workspace">
          <CalculatorForm />
          <Result />
        </div>
        <Method />
        <Sources />
        <Footer />
      </main>
    </CalculatorProvider>
  );
}
