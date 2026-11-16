import { getCommunes, getCommunesByDaira, getDairas, getWilayas } from 'algeria-geo';

const dialog = document.querySelector('#order-dialog');
const form = document.querySelector('#order-form');
const wilayaSelect = document.querySelector('#wilaya-select');
const dairaInput = document.querySelector('#daira-input');
const communeInput = document.querySelector('#commune-input');
const dairaOptions = document.querySelector('#daira-options');
const communeOptions = document.querySelector('#commune-options');
const errorBox = document.querySelector('#order-error');
const result = document.querySelector('#order-result');
const summary = document.querySelector('#order-summary');
const copyFeedback = document.querySelector('#copy-feedback');

let wilayas = [];
let selectedDaira = null;
let dairaByLabel = new Map();
let communeByLabel = new Map();

const labelFor = (item) => `${item.name_ar} — ${item.name_fr} (${item.code})`;
const normalizedPhone = (value) => value.replace(/[\s()-]/g, '');

function setError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function resetLocationChildren() {
  selectedDaira = null;
  dairaInput.value = '';
  dairaInput.disabled = true;
  dairaInput.placeholder = 'اختر الولاية أولًا';
  dairaOptions.replaceChildren();
  dairaByLabel = new Map();
  communeInput.value = '';
  communeInput.disabled = true;
  communeInput.placeholder = 'اختر الولاية أولًا';
  communeOptions.replaceChildren();
  communeByLabel = new Map();
}

function fillCommunes() {
  const wilayaCode = wilayaSelect.value;
  if (!wilayaCode) return;
  const communes = selectedDaira
    ? getCommunesByDaira(selectedDaira.code)
    : getCommunes(wilayaCode);
  communeByLabel = new Map(communes.map((commune) => [labelFor(commune), commune]));
  communeOptions.replaceChildren(...[...communeByLabel.keys()].map((label) => {
    const option = document.createElement('option');
    option.value = label;
    return option;
  }));
  communeInput.value = '';
  communeInput.disabled = false;
  communeInput.placeholder = selectedDaira ? 'ابحث ضمن الدائرة المختارة' : 'اكتب اسم البلدية بالعربية أو الفرنسية';
}

function fillDairas(wilayaCode) {
  const dairas = getDairas(wilayaCode);
  dairaByLabel = new Map(dairas.map((daira) => [labelFor(daira), daira]));
  dairaOptions.replaceChildren(...[...dairaByLabel.keys()].map((label) => {
    const option = document.createElement('option');
    option.value = label;
    return option;
  }));
  dairaInput.disabled = false;
  dairaInput.placeholder = dairas.length ? 'ابحث عن الدائرة (اختياري)' : 'لا توجد دوائر مسجلة لهذه الولاية';
  fillCommunes();
}

try {
  wilayas = getWilayas();
  const options = [new Option('اختر ولايتك', '')];
  for (const wilaya of wilayas) {
    options.push(new Option(`${wilaya.name_ar} — ${wilaya.name_fr}`, wilaya.code));
  }
  wilayaSelect.replaceChildren(...options);
} catch (error) {
  wilayaSelect.replaceChildren(new Option('تعذر تحميل الولايات', ''));
  wilayaSelect.disabled = true;
  setError('تعذر تحميل بيانات الولايات. حدّث الصفحة أو حاول لاحقًا.');
  console.error('Unable to load Algeria administrative data:', error);
}

wilayaSelect.addEventListener('change', () => {
  resetLocationChildren();
  setError('');
  if (wilayaSelect.value) fillDairas(wilayaSelect.value);
});

dairaInput.addEventListener('input', () => {
  selectedDaira = dairaByLabel.get(dairaInput.value) ?? null;
  fillCommunes();
  setError('');
});

communeInput.addEventListener('input', () => setError(''));
form.addEventListener('input', () => setError(''));

function openOrder(product = '') {
  form.reset();
  result.hidden = true;
  form.hidden = false;
  setError('');
  resetLocationChildren();
  if (product) form.elements.product.value = product;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  dialog.querySelector('input[name="customerName"]').focus();
}

document.querySelectorAll('[data-order-open]').forEach((button) => {
  button.addEventListener('click', () => openOrder(button.dataset.product ?? ''));
});

document.querySelectorAll('[data-order-close]').forEach((button) => {
  button.addEventListener('click', () => dialog.close());
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => {
  result.hidden = true;
  form.hidden = false;
  copyFeedback.textContent = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  setError('');
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const phone = normalizedPhone(String(data.get('phone') ?? ''));
  if (!/^(?:0[567]\d{8}|\+213[567]\d{8})$/.test(phone)) {
    setError('يرجى إدخال رقم هاتف محمول جزائري صحيح، مثل 0551234567 أو +213551234567.');
    form.elements.phone.focus();
    return;
  }
  const wilaya = wilayas.find((item) => item.code === data.get('wilaya'));
  const commune = communeByLabel.get(communeInput.value);
  if (!wilaya) {
    setError('اختر الولاية من القائمة.');
    wilayaSelect.focus();
    return;
  }
  if (!commune) {
    setError('اختر البلدية من الاقتراحات التابعة للولاية.');
    communeInput.focus();
    return;
  }
  if (commune.wilaya_code !== wilaya.code) {
    setError('البلدية المختارة لا تتبع الولاية المحددة. أعد اختيار البلدية.');
    communeInput.focus();
    return;
  }

  const daira = dairaByLabel.get(dairaInput.value);
  const lines = [
    `الاسم: ${String(data.get('customerName')).trim()}`,
    `الهاتف: ${phone}`,
    `المنتج: ${data.get('product')}`,
    `الولاية: ${wilaya.name_ar} (${wilaya.name_fr})`,
    ...(daira ? [`الدائرة: ${daira.name_ar} (${daira.name_fr})`] : []),
    `البلدية: ${commune.name_ar} (${commune.name_fr})`,
    `العنوان: ${String(data.get('address')).trim()}`,
  ];
  summary.textContent = lines.join('\n');
  form.hidden = true;
  result.hidden = false;
  result.querySelector('h3').focus?.();
});

document.querySelector('#copy-order').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(summary.textContent);
    copyFeedback.textContent = 'نُسخت تفاصيل الطلب.';
  } catch {
    copyFeedback.textContent = 'تعذر النسخ تلقائيًا. حدّد التفاصيل وانسخها يدويًا.';
  }
});
