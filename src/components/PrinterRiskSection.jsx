import React from "react";
import { Field } from "./Field.jsx";
import { RiskButton } from "./SliderHelpers.jsx";

export function PrinterRiskSection() {
  return (
    <section className="card">
      <div className="section-heading">
        <span className="step">03</span>
        <h2>Принтер и брак</h2>
        <span className="chip">A1</span>
      </div>
      <p className="section-note">
        Bambu Lab A1 · акционная цена 1 130 BYN <s>1 689 BYN</s> ·{" "}
        <a
          href="https://mwi.by/shop/3d-printeri/a-series/bambu-lab-a1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          MWI.BY ↗
        </a>
      </p>
      <div className="two-col">
        <div className="field">
          <label htmlFor="printerPrice">
            Стоимость принтера <span className="unit">BYN</span>
          </label>
          <Field
            id="printerPrice"
            name="printerPrice"
            type="number"
            min="0"
            max="1000000"
            value="1130"
          />
        </div>
        <div className="field">
          <label htmlFor="life">
            Ресурс до замены <span className="unit">ч</span>
          </label>
          <Field
            id="life"
            name="life"
            type="number"
            min="1"
            max="1000000"
            step="1"
            value="5000"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="maintenance">
          Резерв на обслуживание <span className="unit">BYN / ч</span>
        </label>
        <Field
          id="maintenance"
          name="maintenance"
          type="number"
          min="0"
          max="10000"
          step="0.01"
          value="0.05"
        />
        <small>
          Ресурс 5 000 ч и резерв 0,05 BYN/ч — изменяемые допущения.
        </small>
      </div>
      <div className="slider-field risk-field">
        <div className="field-top">
          <label htmlFor="failure">Вероятность брака</label>
          <div className="numeric">
            <Field
              id="failure"
              name="failure"
              type="number"
              min="0"
              max="95"
              step="1"
              value="10"
            />
            <span>%</span>
          </div>
        </div>
        <Field
          aria-label="Вероятность брака, ползунок"
          data-slider="failure"
          type="range"
          min="0"
          max="50"
          step="1"
          value="10"
        />
        <div className="risk-presets" role="group" aria-label="Сценарии брака">
          <RiskButton value={5}>5% · налажено</RiskButton>
          <RiskButton value={10}>10% · базовый</RiskButton>
          <RiskButton value={20}>20% · эксперимент</RiskButton>
        </div>
      </div>
      <p className="section-note">
        Это сценарии, а не универсальная норма. Замените своей статистикой
        неудачных попыток.
      </p>
      <div className="slider-field">
        <div className="field-top">
          <label htmlFor="loss">Расход до сбоя</label>
          <div className="numeric">
            <Field
              id="loss"
              name="loss"
              type="number"
              min="0"
              max="100"
              step="1"
              value="50"
            />
            <span>%</span>
          </div>
        </div>
        <Field
          aria-label="Расход до сбоя, ползунок"
          data-slider="loss"
          type="range"
          min="0"
          max="100"
          step="1"
          value="50"
        />
        <small>
          Доля материала и времени, потерянная в среднем при неудачной попытке.
          50% — допущение.
        </small>
      </div>
    </section>
  );
}
