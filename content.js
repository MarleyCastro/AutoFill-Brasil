<<<<<<< HEAD
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
=======
// AutoFill Brasil - Content Script v1.2
// Compatível com: HTML puro, React, Vue, Angular, Google Forms, Typeform, etc.

// ─────────────────────────────────────────────────────────────────────────────
// PADRÕES DE DETECÇÃO DE CAMPOS
// ─────────────────────────────────────────────────────────────────────────────
const FIELD_PATTERNS = {
  cpf:          [/cpf/i, /cadastro[\s_-]?pessoa[\s_-]?f/i, /c\.p\.f/i],
  rg:           [/\brg\b/i, /registro[\s_-]?geral/i, /identidade/i, /r\.g\./i],
  cnh:          [/\bcnh\b/i, /habilitacao/i, /carteira[\s_-]?(nacional|motorista)/i],
  email:        [/e[\s_-]?mail/i, /email/i, /correio[\s_-]?eletronico/i],
  phone:        [/telefone/i, /fone/i, /phone/i, /tel\b/i, /ddd/i],
  cel:          [/celular/i, /cel\b/i, /mobile/i, /whatsapp/i],
  nome:         [/\bnome\b/i, /first[\s_-]?name/i, /nome[\s_-]?proprio/i, /given[\s_-]?name/i, /^nome$/i],
  sobrenome:    [/sobrenome/i, /last[\s_-]?name/i, /familia/i, /surname/i, /apelido/i],
  nascimento:   [/nascimento/i, /nasc\b/i, /data[\s_-]?nasc/i, /birthday/i, /birth[\s_-]?date/i],
  genero:       [/g[eê]nero/i, /sexo/i, /gender/i, /sex\b/i],
  mae:          [/m[aã]e/i, /nome[\s_-]?m[aã]e/i, /mother/i, /filiacao/i],
  cep:          [/\bcep\b/i, /codigo[\s_-]?postal/i, /zip[\s_-]?code/i, /postal[\s_-]?code/i, /\bzip\b/i],
  numero:       [/\bnumero\b/i, /\bnúmero\b/i, /\bnum\b/i, /house[\s_-]?number/i],
  logradouro:   [/logradouro/i, /endere[cç]o/i, /address/i, /rua\b/i, /avenida/i, /street/i],
  complemento:  [/complemento/i, /complement/i, /apto/i, /apartamento/i, /bloco/i],
  bairro:       [/bairro/i, /district/i, /neighborhood/i],
  cidade:       [/cidade/i, /city/i, /municipio/i, /munic[íi]pio/i],
  estado:       [/\bestado\b/i, /\bstate\b/i, /\buf\b/i, /unidade[\s_-]?federativa/i],
  pais:         [/pa[ií]s/i, /country/i, /nation/i],
  pis:          [/\bpis\b/i, /\bpasep\b/i, /pis[\s_-]?pasep/i],
  cargo:        [/cargo/i, /role/i, /\bjob\b/i, /occupation/i, /fun[cç][aã]o/i, /posi[cç][aã]o/i],
  empresa:      [/empresa/i, /company/i, /organization/i, /firma/i, /empregador/i],
  obs:          [/obs\b/i, /observa/i, /adicional/i, /coment/i, /message/i, /mensagem/i],
  linkedin:     [/linkedin/i],
  github:       [/github/i],
  instagram:    [/instagram/i, /insta\b/i],
  twitter:      [/twitter/i, /\bx\.com/i],
  facebook:     [/facebook/i, /\bfb\b/i],
  website:      [/website/i, /portfolio/i, /portf[oó]lio/i, /homepage/i, /meu[\s_-]?site/i],
  youtube:      [/youtube/i],
  tiktok:       [/tiktok/i],
  escolaridade: [/escolaridade/i, /education/i, /grau/i, /degree/i, /n[ií]vel[\s_-]?edu/i],
  curso:        [/\bcurso\b/i, /\bcourse\b/i, /\bmajor\b/i, /gradua/i],
  instituicao:  [/institui[cç][aã]o/i, /faculdade/i, /universidade/i, /university/i, /college/i, /\bschool\b/i],
  resumo:       [/resumo/i, /summary/i, /\bbio\b/i, /sobre[\s_-]?mim/i, /about[\s_-]?me/i],
  exp_inicio:   [/in[íi]cio/i, /\bstart\b/i, /admiss[aã]o/i],
  exp_fim:      [/\bfim\b/i, /\bend\b/i, /sa[íi]da/i, /conclus[aã]o/i, /t[eé]rmino/i]
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITÁRIOS DE DETECÇÃO DE TEXTO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Coleta todos os atributos textuais de um elemento input
 */
function getElementText(el) {
  return [
    el.name        || '',
    el.id          || '',
    el.placeholder || '',
    el.getAttribute('aria-label')       || '',
    el.getAttribute('aria-labelledby')  || '',
    el.getAttribute('data-label')       || '',
    el.getAttribute('data-field')       || '',
    el.getAttribute('data-placeholder') || '',
    el.getAttribute('autocomplete')     || '',
    el.className   || '',
    el.title       || '',
  ].join(' ');
}

/**
 * Busca o texto do label associado ao input por múltiplas estratégias.
 * Cobre: label[for], label pai, irmão anterior, avô, aria-labelledby,
 * e o padrão do Google Forms (div de título acima da caixa de input).
 */
function getLabelText(input) {
  const texts = [];

  // 1. aria-labelledby → busca o elemento referenciado pelo ID
  const labelledBy = input.getAttribute('aria-labelledby');
  if (labelledBy) {
    labelledBy.split(' ').forEach(id => {
      const ref = document.getElementById(id);
      if (ref) texts.push(ref.textContent);
    });
  }

  // 2. label[for=id]
  if (input.id) {
    const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
    if (label) texts.push(label.textContent);
  }

  // 3. label ancestral mais próximo
  const closestLabel = input.closest('label');
  if (closestLabel) texts.push(closestLabel.textContent);

  // 4. Irmão anterior do tipo LABEL
  const prevSibling = input.previousElementSibling;
  if (prevSibling?.tagName === 'LABEL') texts.push(prevSibling.textContent);

  // 5. Irmão anterior do pai (padrão comum em Bootstrap/Material)
  const parentPrevSibling = input.parentElement?.previousElementSibling;
  if (parentPrevSibling) texts.push(parentPrevSibling.textContent);

  // 6. Estratégia para Google Forms:
  //    O título da pergunta fica em um div separado, bem acima do input.
  //    Sobe até 6 níveis na árvore procurando um contêiner que contenha
  //    um elemento com role="heading" ou classe de título do Google Forms.
  let node = input.parentElement;
  for (let i = 0; i < 6; i++) {
    if (!node) break;
    // Google Forms usa [role="heading"] ou a classe "freebirdFormviewerComponentsQuestionBaseTitle"
    const heading = node.querySelector(
      '[role="heading"], .freebirdFormviewerComponentsQuestionBaseTitle, .exportLabel, .ss-q-title'
    );
    if (heading) {
      texts.push(heading.textContent);
      break;
    }
    node = node.parentElement;
  }

  // 7. Qualquer elemento com role="group" ou fieldset > legend acima
  const fieldset = input.closest('fieldset');
  if (fieldset) {
    const legend = fieldset.querySelector('legend');
    if (legend) texts.push(legend.textContent);
  }

  return texts.join(' ');
}

/**
 * Detecta qual campo de dados o input representa.
 */
function detectFieldKey(input) {
  const combined = getElementText(input) + ' ' + getLabelText(input);
>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
  for (const [key, patterns] of Object.entries(FIELD_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) return key;
    }
  }
  return null;
}

<<<<<<< HEAD
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
=======
// ─────────────────────────────────────────────────────────────────────────────
// DISPARO DE EVENTOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dispara todos os eventos necessários para que frameworks reativos
 * (React, Vue, Angular) reconheçam a mudança de valor.
 */
function triggerAllEvents(el) {
  // Setter nativo do React / Vue (contorna o Virtual DOM)
  const proto = el.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;

  const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(el, el.value);
  }

  const events = ['input', 'change', 'keydown', 'keypress', 'keyup', 'blur', 'focus'];
  events.forEach(name => {
    el.dispatchEvent(new Event(name, { bubbles: true, cancelable: true }));
  });

  // Angular ngModel / ngChange
  el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, data: el.value }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PREENCHIMENTO
// ─────────────────────────────────────────────────────────────────────────────

function fillInput(input, value) {
  if (!value) return false;
  try {
    input.focus();
    input.value = value;
    triggerAllEvents(input);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Preenche um <textarea> — suporte para Google Forms e similares.
 */
function fillTextarea(textarea, value) {
  if (!value) return false;
  try {
    textarea.focus();
    textarea.value = value;
    triggerAllEvents(textarea);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Preenche um <select> com correspondência inteligente (exata → parcial).
 */
function fillSelect(select, value) {
  if (!value) return false;
  const norm = value.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const opt of select.options) {
    const v = opt.value.toLowerCase();
    const t = opt.text.toLowerCase();
    if (v === norm || t === norm)             { bestMatch = opt; bestScore = 3; break; }
    if ((v.includes(norm) || t.includes(norm)) && bestScore < 2) { bestMatch = opt; bestScore = 2; }
    if ((norm.includes(v) || norm.includes(t)) && v && bestScore < 1) { bestMatch = opt; bestScore = 1; }
  }

  if (bestMatch) {
    select.value = bestMatch.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

/**
 * Google Forms usa inputs de texto simples para respostas curtas e
 * textareas para respostas longas. Ambos são cobertos pelas funções acima.
 *
 * Para perguntas de MÚLTIPLA ESCOLHA e CAIXAS DE SELEÇÃO do Google Forms,
 * o campo é renderizado como um div clicável, não como input/select.
 * Esta função tenta clicar na opção correta.
 */
function fillGoogleFormsChoice(container, value) {
  if (!value) return false;
  const norm = value.toLowerCase().trim();

  // Opções de múltipla escolha e checkbox no Google Forms
  const options = container.querySelectorAll(
    '[role="radio"], [role="checkbox"], [role="option"], .docssharedWizToggleLabeledLabelText, .exportLabel'
  );

  for (const opt of options) {
    const text = opt.textContent.toLowerCase().trim();
    if (text === norm || text.includes(norm) || norm.includes(text)) {
      // Verifica se ainda não está selecionado
      const isSelected = opt.getAttribute('aria-checked') === 'true'
        || opt.classList.contains('isChecked');
      if (!isSelected) {
        opt.click();
        return true;
      }
      return true; // já estava selecionado
>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
    }
  }
  return false;
}

<<<<<<< HEAD
=======
// ─────────────────────────────────────────────────────────────────────────────
// SELETOR ABRANGENTE DE CAMPOS
// ─────────────────────────────────────────────────────────────────────────────

const INPUT_SELECTOR = [
  'input:not([type=hidden])',
  'input:not([type=submit])',
  'input:not([type=button])',
  'input:not([type=checkbox])',
  'input:not([type=radio])',
  'input:not([type=file])',
  'input:not([disabled])',
  'input:not([readonly])',
].join('');

// Seletor final combinado
const FIELD_SELECTOR =
  'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]):not([disabled]):not([readonly]), ' +
  'select:not([disabled]), ' +
  'textarea:not([disabled]):not([readonly])';

// ─────────────────────────────────────────────────────────────────────────────
// LISTENER PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== 'autofill') return;

  const data = msg.data || {};
  let filled = 0;
<<<<<<< HEAD
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
=======

  // ── 1. Preenche inputs, selects e textareas normais ──────────────────────
  const fields = document.querySelectorAll(FIELD_SELECTOR);

  fields.forEach(field => {
    const key = detectFieldKey(field);
    if (!key || !data[key]) return;

    let success = false;
    const tag = field.tagName;

    if (tag === 'SELECT') {
      success = fillSelect(field, data[key]);
    } else if (tag === 'TEXTAREA') {
      success = fillTextarea(field, data[key]);
    } else {
      success = fillInput(field, data[key]);
    }

    if (success) filled++;
  });

  // ── 2. Tenta preencher campos de múltipla escolha do Google Forms ─────────
  // Cada pergunta fica em um contêiner com [role="listitem"] ou .freebirdFormviewerComponentsQuestionBaseRoot
  const questionContainers = document.querySelectorAll(
    '[role="listitem"], .freebirdFormviewerComponentsQuestionBaseRoot, .freebirdFormviewerViewItemsItemItem'
  );

  questionContainers.forEach(container => {
    // Descobre o texto da pergunta
    const titleEl = container.querySelector(
      '[role="heading"], .freebirdFormviewerComponentsQuestionBaseTitle, .exportLabel'
    );
    if (!titleEl) return;

    const titleText = titleEl.textContent;

    // Descobre qual campo bate com o título da pergunta
    for (const [key, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (!data[key]) continue;
      const matches = patterns.some(p => p.test(titleText));
      if (matches) {
        const success = fillGoogleFormsChoice(container, data[key]);
        if (success) filled++;
        break;
      }
    }
>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
  });

  sendResponse({ filled });
  return true;
});
