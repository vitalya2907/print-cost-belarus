import React from "react";
import { Field } from "./Field.jsx";
import {
  MaterialSelect,
  MaterialNote,
  MaterialLink,
} from "./MaterialControls.jsx";
import { TariffSelect } from "./TariffSelect.jsx";

export function MaterialEnergySection() {
  return (
    <section className="card">
      <div className="section-heading">
        <span className="step">02</span>
        <h2>Материал и энергия</h2>
      </div>
      <div className="field">
        <label htmlFor="materialPreset">Материал · бренд и катушка</label>
        <MaterialSelect />
        <MaterialNote />
        <MaterialLink />
      </div>
      <div className="two-col">
        <div className="field">
          <label htmlFor="filamentPrice">
            Цена пластика <span className="unit">BYN / кг</span>
          </label>
          <Field
            id="filamentPrice"
            name="filamentPrice"
            type="number"
            min="0"
            max="100000"
            step="0.1"
            value="44"
          />
        </div>
        <div className="field">
          <label htmlFor="power">
            Средняя мощность <span className="unit">Вт</span>
          </label>
          <Field
            id="power"
            name="power"
            type="number"
            min="0"
            max="100000"
            value="100"
          />
        </div>
      </div>
      <p className="section-note">
        100 Вт — сценарное допущение для A1, а не спецификация или измерение.
        Измерьте среднюю мощность своей печати ваттметром.
      </p>
      <div className="field">
        <label htmlFor="tariffPreset">Домашний тариф</label>
        <TariffSelect />
      </div>
      <div className="field tariff-field">
        <label htmlFor="tariff">
          Цена электричества <span className="unit">BYN / кВт·ч</span>
        </label>
        <Field
          id="tariff"
          name="tariff"
          type="number"
          min="0"
          max="100"
          step="0.0001"
          value="0.2581"
        />
      </div>
      <small>
        Категорию проверьте по своей квитанции. Льготный тариф на отопление не
        применяется автоматически к принтеру.
      </small>
    </section>
  );
}
