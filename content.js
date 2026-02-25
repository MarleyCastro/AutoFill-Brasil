// AutoFill Brasil - Content Script
// Maps field keys to arrays of patterns (name, id, placeholder, label, aria-label)

const FIELD_PATTERNS = {
  cpf: [
    /cpf/i, /cadastro[\s_-]?pessoa[\s_-]?f/i, /c\.p\.f/i
  ],
  rg: [
    /\brg\b/i, /registro[\s_-]?geral/i, /identidade/i, /r\.g\./i
  ],
  cnh: [
    /\bcnh\b/i, /habilitacao/i, /carteira[\s_-]?(nacional|motorista)/i
  ],
  email: [
    /e[\s_-]?mail/i, /email/i, /correio[\s_-]?eletronico/i
  ],
  phone: [
    /telefone/i, /fone/i, /phone/i, /tel\b/i, /ddd/i
  ],
  cel: [
    /celular/i, /cel\b/i, /mobile/i, /whatsapp/i
  ],
  nome: [
    /\bnome\b/i, /first[\s_-]?name/i, /nome[\s_-]?proprio/i, /^nome$/i, /given[\s_-]?name/i
  ],
  sobrenome: [
    /sobrenome/i, /last[\s_-]?name/i, /familia/i, /surname/i, /apelido/i
  ],
  nascimento: [
    /nascimento/i, /nasc\b/i, /data[\s_-]?nasc/i, /birthday/i, /birth[\s_-]?date/i, /data[\s_-]?de[\s_-]?nasc/i
  ],
  genero: [
    /g[eê]nero/i, /sexo/i, /gender/i, /sex\b/i
  ],
  mae: [
    /m[aã]e/i, /nome[\s_-]?m[aã]e/i, /mother/i, /filiacao/i
  ],
  cep: [
    /\bcep\b/i, /codigo[\s_-]?postal/i, /zip[\s_-]?code/i, /postal[\s_-]?code/i, /\bzip\b/i
  ],
  numero: [
    /\bnumero\b/i, /\bnúmero\b/i, /\bnum\b/i, /number/i, /house[\s_-]?number/i
  ],
  logradouro: [
    /logradouro/i, /endere[cç]o/i, /address/i, /rua\b/i, /avenida/i, /street/i
  ],
  complemento: [
    /complemento/i, /complement/i, /apto/i, /apartamento/i, /bloco/i
  ],
  bairro: [
    /bairro/i, /district/i, /neighborhood/i
  ],
  cidade: [
    /cidade/i, /city/i, /municipio/i, /munic[íi]pio/i
  ],
  estado: [
    /\bestado\b/i, /\bstate\b/i, /\buf\b/i, /unidade[\s_-]?federativa/i
  ],
  pis: [
    /\bpis\b/i, /\bpasep\b/i, /pis[\s_-]?pasep/i
  ]
};

function getTextContent(el) {
  return [
    el.name || '',
    el.id || '',
    el.placeholder || '',
    el.getAttribute('aria-label') || '',
    el.getAttribute('data-label') || '',
    el.className || '',
    el.getAttribute('autocomplete') || ''
  ].join(' ');
}

function getLabelText(input) {
  // Try label[for=id]
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent;
  }
  // Try wrapping label
  const parent = input.closest('label');
  if (parent) return parent.textContent;
  // Try previous sibling label
  const prev = input.previousElementSibling;
  if (prev && prev.tagName === 'LABEL') return prev.textContent;
  // Try parent's previous sibling
  const parentPrev = input.parentElement?.previousElementSibling;
  if (parentPrev) return parentPrev.textContent;
  return '';
}

function detectFieldKey(input) {
  const combined = getTextContent(input) + ' ' + getLabelText(input);
  for (const [key, patterns] of Object.entries(FIELD_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) return key;
    }
  }
  return null;
}

function triggerEvents(el) {
  ['input', 'change', 'keyup', 'blur'].forEach(evtName => {
    el.dispatchEvent(new Event(evtName, { bubbles: true }));
  });
  // React
  const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (nativeInputSetter) {
    nativeInputSetter.call(el, el.value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function fillInput(input, value) {
  if (!value) return false;
  input.focus();
  input.value = value;
  triggerEvents(input);
  return true;
}

function fillSelect(select, value) {
  if (!value) return false;
  const norm = value.toLowerCase().trim();
  for (const opt of select.options) {
    if (opt.value.toLowerCase().includes(norm) || opt.text.toLowerCase().includes(norm)) {
      select.value = opt.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== 'autofill') return;

  const data = msg.data || {};
  let filled = 0;
  const usedKeys = {};

  // Process all inputs
  const inputs = document.querySelectorAll(
    'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled])'
  );

  inputs.forEach(input => {
    const key = detectFieldKey(input);
    if (!key || !data[key]) return;
    // Allow filling same key in multiple fields only if not already filled for this specific element
    let success = false;
    if (input.tagName === 'SELECT') {
      success = fillSelect(input, data[key]);
    } else {
      success = fillInput(input, data[key]);
    }
    if (success) filled++;
  });

  sendResponse({ filled });
  return true;
});
