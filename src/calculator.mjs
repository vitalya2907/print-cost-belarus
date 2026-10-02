export const defaults = Object.freeze({ mass: 50, waste: 8, hours: 3, quantity: 1, filamentPrice: 44, power: 100, tariff: 0.2581, printerPrice: 1130, life: 5000, maintenance: 0.05, failure: 10, loss: 50, laborMinutes: 10, laborRate: 0, consumables: 0.1, extra: 0, x: null, y: null, z: null });
export const bounds = Object.freeze({ mass: [0,100000], waste: [0,100000], hours: [0,10000], quantity: [1,10000], filamentPrice: [0,100000], power: [0,100000], tariff: [0,100], printerPrice: [0,1000000], life: [1,1000000], maintenance: [0,10000], failure: [0,95], loss: [0,100], laborMinutes: [0,100000], laborRate: [0,100000], consumables: [0,100000], extra: [0,100000], x: [0,10000], y: [0,10000], z: [0,10000] });
export function calculate(input) {
 const v = {...defaults, ...input};
 for (const [key,[min,max]] of Object.entries(bounds)) {
  if (['x','y','z'].includes(key)) continue;
  if(typeof v[key] !== 'number' || !Number.isFinite(v[key]) || v[key] < min || v[key] > max) throw new RangeError(`Недопустимое значение: ${key}`);
 }
 if(!Number.isInteger(v.quantity)) throw new RangeError('Количество должно быть целым');
 const q=v.failure/100, losses=q/(1-q), factor=1+losses*v.loss/100;
 const grams=(v.mass+v.waste)*factor, time=v.hours*factor, kwh=v.power/1000*time;
 const baseline={material:(v.mass+v.waste)/1000*v.filamentPrice,energy:v.power/1000*v.hours*v.tariff,wear:v.printerPrice/v.life*v.hours,maintenance:v.maintenance*v.hours};
 const parts={material:baseline.material*factor,energy:baseline.energy*factor,wear:baseline.wear*factor,maintenance:baseline.maintenance*factor,labor:v.laborMinutes/60*v.laborRate,consumables:v.consumables,extra:v.extra};
 const perPart=Object.values(parts).reduce((a,b)=>a+b,0);
 const baseVariable=Object.values(baseline).reduce((a,b)=>a+b,0);
 return {perPart,total:perPart*v.quantity,parts,grams,time,kwh,factor,failures:losses,riskCost:baseVariable*(factor-1),baseVariable,batchGrams:grams*v.quantity,batchHours:time*v.quantity,fits:[v.x,v.y,v.z].every(n=>typeof n==='number' && Number.isFinite(n) && n>=0 && n<=10000)?[v.x,v.y,v.z].every(n=>n<=256):null};
}
