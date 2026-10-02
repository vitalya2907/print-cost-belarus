// Real React SSR with a state harness, not a browser test.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {transformSync} from 'esbuild';
import * as calculator from '../src/calculator.mjs';
import * as materials from '../src/materials.mjs';
let states=[],cursor=0;
const useState=initial=>{const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];};
const {code}=transformSync(await readFile(new URL('../src/App.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs'});
const module={exports:{}};
const require=id=>id==='react'?{...React,useState}:id==='./calculator.mjs'?calculator:id==='./materials.mjs'?materials:(()=>{throw Error(id);})();
vm.runInNewContext(code,{module,exports:module.exports,require,Intl,Number,String,Math,Object});
const App=module.exports.default;
function render(){cursor=0;const tree=App();return {tree,context:tree.props.value,html:renderToStaticMarkup(tree)};}
function find(e,p){if(!e||typeof e!=='object')return null;if(p(e))return e;for(const c of React.Children.toArray(e.props?.children)){const f=find(c,p);if(f)return f;}return null;}
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
test('reset clears invalid inputs and restores defaults',()=>{set('x','',true);set('quantity',1.5);const button=find(render().tree,e=>e.props?.id==='reset');assert.ok(button);button.props.onClick();const {context,html}=render();for(const[k,v]of Object.entries(calculator.defaults))assert.equal(context.values[k],v===null?'':String(v));assert.equal(context.materialId,'anycubic-pla');assert.equal(context.invalid.length,0);assert.equal(context.invalidDimensions.length,0);assert.match(html,/id="total"[^>]*>3,75/);});
console.log(`${count} React SSR/state tests passed`);
