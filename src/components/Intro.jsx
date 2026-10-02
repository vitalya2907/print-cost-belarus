import React from "react";
export function Intro() {
  return (
    <div className="intro">
      <div>
        <div className="eyebrow">ОДИН ПРИНТЕР. ВСЕ РАСХОДЫ.</div>
        <h1>
          Сколько стоит <br />
          напечатать <span>деталь?</span>
        </h1>
        <p>От грамма пластика до последней минуты печати.</p>
      </div>
      <div className="intro-note">
        <span className="small-label">РАСЧЁТ ДЛЯ</span>
        <strong>FDM / FFF</strong>
        <span>пластик · домашняя мастерская</span>
      </div>
    </div>
  );
}
