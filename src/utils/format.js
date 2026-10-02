export const money = new Intl.NumberFormat("ru-BY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const num = (v, d = 1) =>
  new Intl.NumberFormat("ru-BY", { maximumFractionDigits: d }).format(v);
