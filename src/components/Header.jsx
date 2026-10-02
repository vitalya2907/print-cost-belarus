import React from "react";
export function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="Слой — начало">
        <span className="brand-symbol" aria-hidden="true">
          ≋
        </span>
        слой<span className="brand-dot">.</span>
      </a>
      <span className="topnote">ДОМАШНЯЯ 3D-ПЕЧАТЬ</span>
      <a className="country" href="#sources">
        <span aria-hidden="true">BY</span> Беларусь · BYN
      </a>
    </header>
  );
}
