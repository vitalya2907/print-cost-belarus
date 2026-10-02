// Real React SSR with a state harness, not a browser test.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {buildSync} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import * as calculator from '../src/calculator.mjs';
import * as materials from '../src/materials.mjs';
let states=[],cursor=0;
const useState=initial=>{const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];};
const {outputFiles}=buildSync({stdin:{contents:"export {default as App} from './App.jsx'; export {useCalculatorState} from './hooks/useCalculatorState.js';",resolveDir:fileURLToPath(new URL('../src/',import.meta.url)),loader:'jsx'},bundle:true,platform:'node',format:'cjs',external:['react','react-dom'],write:false});
const module={exports:{}};
const require=id=>id==='react'?{...React,useState}:(()=>{throw Error(id);})();
vm.runInNewContext(outputFiles[0].text,{module,exports:module.exports,require,Intl,Number,String,Math,Object});
const {App,useCalculatorState}=module.exports;
function render(){cursor=0;const context=useCalculatorState();cursor=0;const tree=React.createElement(App);return {tree,context,html:renderToStaticMarkup(tree)};}
let count=0;function test(name,fn){fn();count++;console.log(`PASS ${name}`);}
function set(key,value,bad=false){render().context.setValue(key,String(value),bad);return render();}
test('SSR default A1 cost, material and blank dimensions',()=>{const {html,context}=render();assert.equal(context.values.printerPrice,'1130');assert.match(html,/id="total"[^>]*>3,75/);assert.match(html,/Габариты необязательны/);assert.equal(context.invalid.length,0);assert.equal(materials.materials.length,7);});
for(const mass of [501,2000.5,100000])test(`large mass SSR ${mass}`,()=>{const {html,context}=set('mass',mass);assert.equal(context.invalid.length,0);const range=html.match(/<input[^>]*data-slider="mass"[^>]*>/)[0];assert.match(range,new RegExp(`max="${Math.max(2000,mass)}"`));assert.match(range,new RegExp(`value="${mass}"`));assert.match(range,/step="any"/);});
for(const [value,bad] of [['',false],['-1',false],['10001',false],['',true]])test(`optional dimension ${value}/${bad}`,()=>{const {context,html}=set('x',value,bad);assert.equal(context.invalid.length,0);assert.ok(context.result);assert.match(html,bad||value==='-1'||value==='10001'?/Стоимость продолжает рассчитываться/:/Габариты необязательны/);});
test('256 fits, 257 warns, incomplete null',()=>{for(const key of ['x','y','z'])set(key,256);assert.equal(render().context.result.fits,true);assert.match(render().html,/Габариты в пределах/);assert.equal(set('x',257).context.result.fits,false);assert.match(render().html,/Размер превышает/);assert.equal(set('z','').context.result.fits,null);});
for(const [id,price] of [['anycubic-pla',44],['esun-pla',70],['bambu-pla',90],['creality-petg',46]])test(`fixed material ${id}`,()=>{render().context.chooseMaterial(id);const {context}=render();assert.equal(context.values.filamentPrice,String(price));assert.ok(context.result);});
for(const id of ['bambu-petg','elegoo-petg','custom'])test(`manual material ${id}`,()=>{render().context.chooseMaterial(id);let r=render();assert.equal(r.context.values.filamentPrice,'');assert.equal(r.context.result,null);assert.match(r.html,/id="filamentPrice"[^>]*aria-invalid="true"/);assert.ok(set('filamentPrice',64).context.result);});
test('override explicit',()=>{render().context.chooseMaterial('esun-pla');assert.match(set('filamentPrice',72).html,/Используется ваша цена за кг/);});
test('tariff preset and custom state',()=>{render().context.setTariff('0.3037');assert.equal(render().context.values.tariff,'0.3037');set('tariff',.5);assert.equal(render().context.tariffPreset,'custom');});
test('reset clears invalid inputs and restores defaults',()=>{set('x','',true);set('quantity',1.5);render().context.reset();const {context,html}=render();for(const[k,v]of Object.entries(calculator.defaults))assert.equal(context.values[k],v===null?'':String(v));assert.equal(context.materialId,'anycubic-pla');assert.equal(context.invalid.length,0);assert.equal(context.invalidDimensions.length,0);assert.match(html,/id="total"[^>]*>3,75/);});
// Frozen hashes from the pre-extraction App.jsx, produced by real React SSR.
const baseline=JSON.parse(await readFile(new URL('./baseline-markup.json',import.meta.url),'utf8'));
for(const s of baseline)test(`pre-extraction markup equivalence: ${s.name}`,()=>{states=[{...Object.fromEntries(Object.entries(calculator.defaults).map(([k,v])=>[k,v===null?'':String(v)])),...s.changes},{},s.material||'anycubic-pla','0.2581'];assert.equal(createHash('sha256').update(render().html).digest('hex'),s.sha256);});
console.log(`${count} React SSR/state tests passed`);
