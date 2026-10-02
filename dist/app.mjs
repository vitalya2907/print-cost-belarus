import {calculate, defaults, bounds} from './calculator.mjs';
const form=document.querySelector('#calculator');
const money=new Intl.NumberFormat('ru-BY',{minimumFractionDigits:2,maximumFractionDigits:2});
const num=(v,d=1)=>new Intl.NumberFormat('ru-BY',{maximumFractionDigits:d}).format(v);
const labels={material:'Пластик',energy:'Электричество',wear:'Износ принтера',maintenance:'Обслуживание',labor:'Ручная работа',consumables:'Расходники',extra:'Другие расходы'};
const colors={material:'#c7f451',energy:'#97c1ff',wear:'#f3c27c',maintenance:'#b4a1e3',labor:'#75d5b4',consumables:'#d3dace',extra:'#f29c9c'};
let timer;
function paintSlider(slider){const low=Number(slider.min),high=Number(slider.max),value=Number(slider.value);slider.style.setProperty('--fill',`${Math.max(0,Math.min(100,(value-low)/(high-low)*100))}%`);}
function syncSliders(){document.querySelectorAll('[data-slider]').forEach(s=>{const value=form.elements[s.dataset.slider].valueAsNumber;const base=Number(s.dataset.baseMax || s.max);s.dataset.baseMax=String(base);if(Number.isFinite(value)){s.max=String(Math.max(base,value));s.step='any';s.value=String(value);const labels=s.parentElement.querySelector('.range-label');if(labels)labels.lastElementChild.textContent=num(Number(s.max))+(s.dataset.slider==='mass'?' г':' ч');}paintSlider(s);});}
function showInvalid(invalid){for(const key of Object.keys(bounds))form.elements[key].setAttribute('aria-invalid',String(invalid.includes(key)));const el=document.querySelector('#errors');el.hidden=!invalid.length;el.textContent=invalid.length?'Проверьте выделенные поля: введите число в допустимых пределах. Ресурс должен быть от 1 часа, количество — целым от 1, вероятность брака — от 0 до 95%.':'';}
function render(){
 const values={},invalid=[];
 for(const [key,[min,max]]of Object.entries(bounds)){const v=form.elements[key].valueAsNumber;values[key]=v;if(!Number.isFinite(v)||v<min||v>max||(key==='quantity'&&!Number.isInteger(v)))invalid.push(key);}
 showInvalid(invalid);syncSliders();
 const fit=document.querySelector('#fit-note');
 const invalidDimensions=['x','y','z'].some(k=>invalid.includes(k));
 const fits=['x','y','z'].every(k=>values[k]<=180);
 fit.classList.toggle('warning',invalidDimensions||!fits);
 fit.textContent=invalidDimensions?'Исправьте габариты для проверки размера.':fits?'Габариты в пределах 180 × 180 × 180 мм. Проверьте размещение и место для каймы в слайсере.':'Размер превышает поле A1 mini (180 × 180 × 180 мм). Проверьте ориентацию, разделение модели или другой принтер.';
 document.querySelectorAll('[data-risk]').forEach(b=>{const active=Number(b.dataset.risk)===values.failure;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 if(invalid.length){document.querySelector('#total').textContent='—';document.querySelector('#per-unit').textContent='Исправьте поля для расчёта';document.querySelector('#breakdown').replaceChildren();document.querySelector('#cost-bar').replaceChildren();document.querySelector('#risk-cost').textContent='Расчёт приостановлен';document.querySelector('#risk-detail').textContent='Нет достоверного результата при неверных данных.';for(const id of ['expected-mass','expected-time','expected-energy'])document.getElementById(id).textContent='—';return;}
 const r=calculate(values);
 document.querySelector('#total-caption').textContent=values.quantity===1?'За 1 успешную деталь':`За ${num(values.quantity,0)} успешных деталей`;
 document.querySelector('#total').innerHTML=`${money.format(r.total)}<span class="currency">BYN</span>`;
 document.querySelector('#per-unit').textContent=values.quantity===1?'С учётом ожидаемых повторных попыток':`${money.format(r.perPart)} BYN / деталь · независимые печати`;
 const breakdown=document.querySelector('#breakdown');breakdown.replaceChildren();const bar=document.querySelector('#cost-bar');bar.replaceChildren();
 for(const [key,value]of Object.entries(r.parts)){if(value===0&&['labor','extra'].includes(key))continue;const row=document.createElement('div');row.className='breakdown-row';const label=document.createElement('span');label.className='key';const dot=document.createElement('i');dot.className='swatch';dot.style.background=colors[key];label.append(dot,document.createTextNode(labels[key]));const price=document.createElement('strong');price.textContent=money.format(value*values.quantity)+' BYN';row.append(label,price);breakdown.append(row);const segment=document.createElement('span');segment.style.background=colors[key];segment.style.width=r.perPart>0?`${value/r.perPart*100}%`:'0%';bar.append(segment);}
 document.querySelector('#risk-cost').textContent=`Брак: +${money.format(r.riskCost*values.quantity)} BYN уже в сумме`;
 document.querySelector('#risk-detail').textContent=`${num(values.failure)}% неудач × ${num(values.loss)}% потерь. Переменные расходы +${num((r.factor-1)*100,2)}%. Не добавляйте резерв повторно.`;
 document.querySelector('#expected-mass').textContent=num(r.batchGrams)+' г';document.querySelector('#expected-time').textContent=num(r.batchHours,2)+' ч';document.querySelector('#expected-energy').textContent=num(r.kwh*values.quantity,3)+' кВт·ч';

}
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{const slider=e.target.closest('[data-slider]');if(slider)form.elements[slider.dataset.slider].value=slider.value;
 if(e.target.name==='filamentPrice')document.querySelectorAll('[data-material]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
 if(e.target.name==='tariff')document.querySelector('#tariffPreset').value='custom';
 // Immediate visual feedback; brief debounce keeps screen reader announcements manageable.
 clearTimeout(timer);timer=setTimeout(render,80);
});
document.querySelector('#tariffPreset').addEventListener('change',e=>{if(e.target.value!=='custom'){form.elements.tariff.value=e.target.value;render();}});
document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{form.elements.filamentPrice.value=button.dataset.material==='PLA'?44:46;document.querySelectorAll('[data-material]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();}));
document.querySelectorAll('[data-risk]').forEach(b=>b.addEventListener('click',()=>{form.elements.failure.value=b.dataset.risk;render();}));
document.querySelector('#reset').addEventListener('click',()=>{for(const [key,v]of Object.entries(defaults))form.elements[key].value=String(v);document.querySelector('#tariffPreset').value=String(defaults.tariff);document.querySelectorAll('[data-material]').forEach(b=>{const active=b.dataset.material==='PLA';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();});
render();
