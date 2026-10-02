import React from "react";
import { Field } from "./Field.jsx";

export function ExtrasSection() {
  return (
    <section className="card">
      <div className="section-heading">
        <span className="step">04</span>
        <h2>Сопутствующие расходы</h2>
      </div>
      <div className="two-col">
        <div className="field">
          <label htmlFor="laborMinutes">
            Ручная работа <span className="unit">мин / деталь</span>
          </label>
          <Field
            id="laborMinutes"
            name="laborMinutes"
            type="number"
            min="0"
            max="100000"
            value="10"
          />
        </div>
        <div className="field">
          <label htmlFor="laborRate">
            Стоимость вашего часа <span className="unit">BYN / ч</span>
          </label>
          <Field
            id="laborRate"
            name="laborRate"
            type="number"
            min="0"
            max="100000"
            step="0.1"
            value="0"
          />
        </div>
        <div className="field">
          <label htmlFor="consumables">
            Расходники <span className="unit">BYN / деталь</span>
          </label>
          <Field
            id="consumables"
            name="consumables"
            type="number"
            min="0"
            max="100000"
            step="0.01"
            value="0.1"
          />
        </div>
        <div className="field">
          <label htmlFor="extra">
            Другие расходы <span className="unit">BYN / деталь</span>
          </label>
          <Field
            id="extra"
            name="extra"
            type="number"
            min="0"
            max="100000"
            step="0.01"
            value="0"
          />
        </div>
      </div>
      <small>
        Ручная работа включает подготовку, снятие поддержек и ожидаемую работу с
        повторными попытками. Расходники: клей, очистка, крепёж. Сушка пластика
        — в других расходах.
      </small>
    </section>
  );
}
