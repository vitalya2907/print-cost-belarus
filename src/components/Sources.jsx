import React from "react";
import { materials } from "../materials.mjs";
function MaterialSources() {
  return (
    <div id="material-sources">
      {materials
        .filter((m) => m.url)
        .map((m) => (
          <p key={m.id}>
            <a href={m.url} target="_blank" rel="noopener noreferrer">
              {m.name} ↗
            </a>
            {m.note}
          </p>
        ))}
    </div>
  );
}
export function Sources() {
  return (
    <section id="sources" className="sources">
      <div className="sources-heading">
        <div className="eyebrow">ОТКУДА ЦИФРЫ</div>
        <h2>Источники и допущения</h2>
      </div>
      <div className="source-date">Проверка: 2 октября 2026</div>
      <div className="source-grid">
        <article>
          <span className="source-category">ЭЛЕКТРИЧЕСТВО</span>
          <h3>Бытовые тарифы 2026</h3>
          <p>
            0,2581 / 0,3037 / 0,3265 BYN за кВт·ч. Постановление №93 от
            25.02.2026; ставки опубликованы с 1 марта.
          </p>
          <a
            href="https://www.gs.by/2026/03/10/novye-tarify-na-elektroenergiyu-s-1-marta-2026-goda/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Таблица GS.BY · 10.03.2026 ↗
          </a>
          <a
            href="https://virtualbrest.ru/pda.php?pdaid=185837&amp;pdaurl=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Публикация Бреста · 29.06.2026 ↗
          </a>
          <small>
            Официальную страницу подтвердить не удалось. Сверьте актуальный
            тариф с квитанцией; данные не обновляются автоматически.
          </small>
        </article>
        <article>
          <span className="source-category">ПЛАСТИК</span>
          <h3>Материалы PLA и PETG</h3>
          <MaterialSources />
          <small>
            Проверено 02.10.2026. Цена зависит от бренда, цвета, даты покупки и
            комплектации: катушка или refill. Доставка отдельно. Цены не
            загружаются автоматически.
          </small>
        </article>
        <article>
          <span className="source-category">ПРИНТЕР</span>
          <h3>
            Bambu Lab A1 · 1 130 BYN <s>1 689 BYN</s>
          </h3>
          <p>
            Акционная цена MWI.BY на 02.10.2026. Поле печати 256 × 256 × 256 мм.
          </p>
          <a
            href="https://mwi.by/shop/3d-printeri/a-series/bambu-lab-a1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Цена в MWI.BY ↗
          </a>
          <small>
            100 Вт — сценарное допущение для A1; измерьте ваттметром. Ресурс,
            обслуживание и брак — допущения, а не характеристики производителя.
          </small>
        </article>
      </div>
    </section>
  );
}
