import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const modulePath = process.argv[2] || new URL('../dist/calculator.mjs', import.meta.url).pathname;
const {calculate,defaults} = await import(pathToFileURL(modulePath));
let count = 0;
function test(name, fn) { fn(); count++; console.log(`PASS ${name}`); }
function near(actual, expected) { assert.ok(Math.abs(actual-expected) <= 1e-9*Math.max(1,Math.abs(expected)), `${actual} != ${expected}`); }
const input={mass:100,waste:20,hours:2,quantity:1,filamentPrice:50,power:100,tariff:0.3,printerPrice:1000,life:2000,maintenance:0.2,failure:0,loss:0,laborMinutes:30,laborRate:10,consumables:0.5,extra:1,x:256,y:256,z:256};
// Independently calculated: 6 plastic + .06 energy + 1 wear + .4 service + 5 labor + .5 consumables + 1 extra.
test('baseline components and total',()=>{const r=calculate(input);near(r.perPart,13.96);near(r.total,13.96);near(r.parts.material,6);near(r.parts.energy,.06);near(r.parts.wear,1);near(r.parts.maintenance,.4);near(r.grams,120);near(r.time,2);near(r.kwh,.2);near(r.riskCost,0);});
// Expected multipliers tabulated independently for retry-until-success.
for(const [failure, factors] of [[0,[1,1,1]],[10,[1,19/18,10/9]],[95,[1,10.5,20]]])for(const [i,loss]of [0,50,100].entries())test(`failure ${failure}% loss ${loss}%`,()=>{const r=calculate({...input,failure,loss}),f=factors[i];near(r.factor,f);near(r.perPart,7.46*f+6.5);near(r.grams,120*f);near(r.time,2*f);near(r.riskCost,7.46*(f-1));near(r.parts.labor,5);near(r.parts.consumables,.5);});
test('quantity scales batch but not per-unit cost',()=>{const r=calculate({...input,quantity:7,failure:10,loss:100});near(r.perPart,7.46*10/9+6.5);near(r.total,(7.46*10/9+6.5)*7);near(r.batchGrams,120*10/9*7);near(r.batchHours,2*10/9*7);});
for(const tariff of [0,.2581,.3037,.3265,1])test(`tariff ${tariff}`,()=>{const r=calculate({...input,tariff});near(r.parts.energy,.2*tariff);near(r.total,13.9+.2*tariff);});
test('all expenses zero',()=>{const r=calculate({...input,filamentPrice:0,tariff:0,printerPrice:0,maintenance:0,laborRate:0,consumables:0,extra:0,failure:95,loss:100});near(r.total,0);assert.ok(Number.isFinite(r.factor));});
for(const [key,value]of [['mass',NaN],['hours',Infinity],['tariff',-Infinity],['filamentPrice','50'],['mass',null],['life',0],['quantity',0],['quantity',1.5],['failure',100],['loss',101],['waste',-1],['hours',-1]])test(`reject ${key}=${String(value)}`,()=>assert.throws(()=>calculate({...input,[key]:value}),RangeError));
test('risk reserve not counted twice',()=>{const r=calculate({...input,failure:10,loss:100});near(Object.values(r.parts).reduce((a,b)=>a+b,0),r.total);near(r.total,13.96+7.46/9);near(r.total-r.riskCost,13.96);});
test('dimensions only affect fit warning',()=>{const r=calculate(input),large=calculate({...input,x:257,y:999,z:200});assert.equal(r.fits,true);assert.equal(large.fits,false);near(r.total,large.total);near(r.grams,large.grams);near(r.time,large.time);});
test('A1 defaults and independent default cost',()=>{assert.equal(defaults.printerPrice,1130);assert.equal(defaults.power,100);assert.equal(calculate({}).fits,null);near(calculate({}).total,(2.552+.07743+.678+.15)*19/18+.1);});
for(const mass of [501,2000,2000.5,100000])test(`large mass ${mass}`,()=>{const r=calculate({...input,mass});near(r.parts.material,(mass+20)*.05);near(r.total,(mass+20)*.05+7.96);});
for(const dims of [{x:null,y:null,z:null},{x:100,y:null,z:null},{x:NaN},{x:Infinity},{x:-1},{x:10001},{x:'10'}])test(`optional dimensions ${JSON.stringify(dims)}`,()=>{const r=calculate({...input,...dims});assert.equal(r.fits,null);near(r.total,13.96);});
console.log(`${count} tests passed`);
