import React from "react";
import { useCalculator } from "../CalculatorContext.jsx";
import { money, num } from "../utils/format.js";
const labels = {
  material: "Пластик",
  energy: "Электричество",
  wear: "Износ принтера",
  maintenance: "Обслуживание",
  labor: "Ручная работа",
  consumables: "Расходники",
  extra: "Другие расходы",
};
const colors = {
  material: "#c7f451",
  energy: "#97c1ff",
  wear: "#f3c27c",
  maintenance: "#b4a1e3",
  labor: "#75d5b4",
  consumables: "#d3dace",
  extra: "#f29c9c",
};

export function Result() {
  const { result: r, parsed: v, invalid } = useCalculator();
  const parts = r
    ? Object.entries(r.parts).filter(
        ([key, value]) => value !== 0 || !["labor", "extra"].includes(key),
      )
    : [];
  return (
    <aside className="result-column">
      <section className="result-card">
        <div className="result-top">
          <span className="eyebrow">СЕБЕСТОИМОСТЬ</span>
          <span className="result-marker">BYN</span>
        </div>
        <p className="result-caption" id="total-caption">
          {r
            ? v.quantity === 1
              ? "За 1 успешную деталь"
              : `За ${num(v.quantity, 0)} успешных деталей`
            : "Себестоимость задания"}
        </p>
        <div className="total" id="total" aria-live="polite" aria-atomic="true">
          {r ? (
            <>
              {money.format(r.total)}
              <span className="currency">BYN</span>
            </>
          ) : (
            "—"
          )}
        </div>
        <p className="per-unit" id="per-unit">
          {r
            ? v.quantity === 1
              ? "С учётом ожидаемых повторных попыток"
              : `${money.format(r.perPart)} BYN / деталь · независимые печати`
            : "Исправьте поля для расчёта"}
        </p>
        <div className="cost-bar" id="cost-bar" aria-hidden="true">
          {parts.map(([key, value]) => (
            <span
              key={key}
              style={{
                background: colors[key],
                width: r.perPart > 0 ? `${(value / r.perPart) * 100}%` : "0%",
              }}
            />
          ))}
        </div>
        <div className="breakdown" id="breakdown">
          {parts.map(([key, value]) => (
            <div className="breakdown-row" key={key}>
              <span className="key">
                <i className="swatch" style={{ background: colors[key] }} />
                {labels[key]}
              </span>
              <strong>{money.format(value * v.quantity)} BYN</strong>
            </div>
          ))}
        </div>
        <div className="risk-note">
          <span className="risk-icon" aria-hidden="true">
            ↺
          </span>
          <div>
            <strong id="risk-cost">
              {r
                ? `Брак: +${money.format(r.riskCost * v.quantity)} BYN уже в сумме`
                : "Расчёт приостановлен"}
            </strong>
            <p id="risk-detail">
              {r
                ? `${num(v.failure)}% неудач × ${num(v.loss)}% потерь. Переменные расходы +${num((r.factor - 1) * 100, 2)}%. Не добавляйте резерв повторно.`
                : "Нет достоверного результата при неверных данных."}
            </p>
          </div>
        </div>
        <div className="batch-info">
          <div>
            <span>Пластика с браком</span>
            <strong id="expected-mass">
              {r ? num(r.batchGrams) + " г" : "—"}
            </strong>
          </div>
          <div>
            <span>Времени с браком</span>
            <strong id="expected-time">
              {r ? num(r.batchHours, 2) + " ч" : "—"}
            </strong>
          </div>
          <div>
            <span>Электроэнергии</span>
            <strong id="expected-energy">
              {r ? num(r.kwh * v.quantity, 3) + " кВт·ч" : "—"}
            </strong>
          </div>
        </div>
        <p className="result-footnote">
          Себестоимость, без прибыли и налогов.
          <br />
          Печать нескольких деталей на одном столе рассчитывайте по общим данным
          слайсера как одну печать.
        </p>
        <div
          id="errors"
          className="error"
          role="alert"
          hidden={!invalid.length}
        >
          {invalid.length
            ? "Проверьте выделенные поля: введите число в допустимых пределах. Ресурс должен быть от 1 часа, количество — целым от 1, вероятность брака — от 0 до 95%."
            : ""}
        </div>
      </section>
      <div className="confidence-note">
        <span aria-hidden="true">i</span>
        <p>
          Планируйте по своим настройкам.
          <br />
          Точность зависит от данных слайсера, реальной мощности и вашей
          статистики брака.
        </p>
      </div>
    </aside>
  );
}
