// Node DOM harness: exercises actual app handlers; not a real browser rendering test.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {calculate,defaults,bounds} from '../dist/calculator.mjs';
import {materials,defaultMaterial} from '../dist/materials.mjs';
class Element {
 constructor(){this.value='';this.textContent='';this.hidden=false;this.attrs={};this.dataset={};this.listeners={};this.children=[];this.style={setProperty(){}};this.classList={toggle(){}};this.validity={badInput:false};}
 get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
 setAttribute(k,v){this.attrs[k]=v;}
 append(...v){this.children.push(...v);}
 replaceChildren(...v){this.children=v;}
 addEventListener(k,v){this.listeners[k]=v;}
 closest(){return null;}
}
const nodes=new Map();const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
const form=get('calculator');form.elements={};for(const [k,v]of Object.entries(defaults)){const e=new Element();e.name=k;e.value=v===null?'':String(v);form.elements[k]=e;}
const sliders=['mass','hours','failure','loss'].map((key,i)=>{const s=new Element();s.dataset.slider=key;s.min=0;s.max=[2000,48,50,100][i];s.value=String(defaults[key]);s.parentElement={querySelector:()=>null};return s;});
const document={querySelector:s=>get(s.slice(1)),querySelectorAll:s=>s==='[data-slider]'?sliders:[],createElement:()=>new Element(),createTextNode:v=>v,getElementById:get};
let code=await readFile(new URL('../dist/app.mjs',import.meta.url),'utf8');code=code.replace(/^import .*;\n/gm,'');
const context=vm.createContext({document,calculate,defaults,bounds,materials,defaultMaterial,Intl,Number,String,Math,setTimeout:fn=>{fn();return 0;},clearTimeout(){}});vm.runInContext(code,context);
let count=0;function test(name,fn){fn();count++;console.log(`PASS ${name}`);}
const input=(key,value)=>{form.elements[key].value=String(value);form.listeners.input({target:form.elements[key]});};
const select=id=>{get('materialPreset').value=id;get('materialPreset').listeners.change();};
test('initial A1 and optional blank dimensions calculate',()=>{assert.equal(form.elements.printerPrice.value,'1130');assert.notEqual(get('total').textContent,'—');assert.match(get('fit-note').textContent,/необязательны/);});
for(const mass of [501,2000.5,100000])test(`actual handler large mass ${mass}`,()=>{input('mass',mass);assert.equal(sliders[0].value,String(mass));assert.ok(Number(sliders[0].max)>=mass);assert.equal(sliders[0].step,'any');assert.equal(get('errors').hidden,true);});
for(const value of ['',-1,10001,'bad'])test(`invalid or partial dimension ${value} does not block cost`,()=>{input('x',value);assert.equal(get('errors').hidden,true);assert.notEqual(get('total').textContent,'—');});
test('full dimensions 256 fit then 257 warning',()=>{for(const k of ['x','y','z'])input(k,256);assert.match(get('fit-note').textContent,/в пределах/);input('x',257);assert.match(get('fit-note').textContent,/превышает/);});
for(const [id,price]of [['anycubic-pla',44],['esun-pla',70],['bambu-pla',90],['creality-petg',46]])test(`preset ${id}`,()=>{select(id);assert.equal(form.elements.filamentPrice.value,String(price));assert.equal(get('errors').hidden,true);});
for(const id of ['bambu-petg','elegoo-petg','custom'])test(`manual price ${id}`,()=>{select(id);assert.equal(form.elements.filamentPrice.value,'');assert.equal(get('errors').hidden,false);input('filamentPrice',65);assert.equal(get('errors').hidden,true);});
test('fixed preset manual override remains explicit',()=>{select('esun-pla');input('filamentPrice',72);assert.match(get('material-note').textContent,/ваша цена/);assert.equal(get('errors').hidden,true);});
test('reset restores defaults material and clears dimensions',()=>{get('reset').listeners.click();for(const[k,v]of Object.entries(defaults))assert.equal(form.elements[k].value,v===null?'':String(v));assert.equal(get('materialPreset').value,'anycubic-pla');assert.equal(get('errors').hidden,true);assert.match(get('fit-note').textContent,/необязательны/);});
console.log(`${count} handler tests passed`);
