import React from "react";
import { Field } from "./Field.jsx";
import { RangeMaximum } from "./SliderHelpers.jsx";
import { FitNote } from "./FitNote.jsx";

export function PartSection() {
  return (
    <section className="card primary">
      <div className="section-heading">
        <span className="step">01</span>
        <h2>Ваша деталь</h2>
        <span className="chip">ИЗ СЛАЙСЕРА</span>
      </div>
      <p className="section-note">
        Масса модели без поддержек. Время — для одной детали. Если слайсер
        считает несколько деталей на одном столе, введите общий расход и
        количество 1.
      </p>
      <div className="slider-field">
        <div className="field-top">
          <label htmlFor="mass">Масса модели</label>
          <div className="numeric">
            <Field
              id="mass"
              name="mass"
              type="number"
              min="0"
              max="100000"
              step="0.1"
              value="50"
            />
            <span>г</span>
          </div>
        </div>
        <Field
          aria-label="Масса модели, ползунок"
          data-slider="mass"
          type="range"
          min="0"
          max="2000"
          step="1"
          value="50"
        />
        <div className="range-label">
          <span>0 г</span>
          <RangeMaximum name="mass" base={2000} unit="г" />
        </div>
      </div>
      <div className="slider-field">
        <div className="field-top">
          <label htmlFor="hours">Время печати</label>
          <div className="numeric">
            <Field
              id="hours"
              name="hours"
              type="number"
              min="0"
              max="10000"
              step="0.1"
              value="3"
            />
            <span>ч</span>
          </div>
        </div>
        <Field
          aria-label="Время печати, ползунок"
          data-slider="hours"
          type="range"
          min="0"
          max="48"
          step="0.1"
          value="3"
        />
        <div className="range-label">
          <span>0 ч</span>
          <RangeMaximum name="hours" base={48} unit="ч" />
        </div>
      </div>
      <div className="two-col">
        <div className="field">
          <label htmlFor="waste">
            Поддержки и отходы <span className="unit">г</span>
          </label>
          <Field
            id="waste"
            name="waste"
            type="number"
            min="0"
            max="100000"
            step="0.1"
            value="8"
          />
          <small>Поддержки, кайма и продувка. Брак отдельно.</small>
        </div>
        <div className="field">
          <label htmlFor="quantity">
            Количество <span className="unit">шт.</span>
          </label>
          <Field
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="10000"
            step="1"
            value="1"
          />
          <small>Одинаковые детали, отдельные печати.</small>
        </div>
      </div>
      <details className="dimensions">
        <summary>
          Габариты детали <span>проверить размер</span>
        </summary>
        <div className="three-col">
          <div className="field">
            <label htmlFor="x">X · мм</label>
            <Field
              id="x"
              name="x"
              type="number"
              min="0"
              max="10000"
              placeholder="Необязательно"
            />
          </div>
          <div className="field">
            <label htmlFor="y">Y · мм</label>
            <Field
              id="y"
              name="y"
              type="number"
              min="0"
              max="10000"
              placeholder="Необязательно"
            />
          </div>
          <div className="field">
            <label htmlFor="z">Z · мм</label>
            <Field
              id="z"
              name="z"
              type="number"
              min="0"
              max="10000"
              placeholder="Необязательно"
            />
          </div>
        </div>
        <FitNote />
        <small>
          Габариты не меняют стоимость. Масса и время зависят от геометрии,
          заполнения и настроек слайсера.
        </small>
      </details>
    </section>
  );
}
