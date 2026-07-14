const FIELD_IDS = [
  'cpf','rg','cnh','email','phone','cel',
  'nome','sobrenome','nascimento','genero','mae',
  'cep','numero','logradouro','complemento','bairro','cidade','estado',
  'pis'
];

// --- Tab logic ---
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// --- Load saved data ---
function loadData() {
  chrome.storage.local.get(['autofill_data'], (res) => {
    const data = res.autofill_data || {};
    FIELD_IDS.forEach(id => {
      const el = document.getElementById('f_' + id);
      if (el && data[id]) el.value = data[id];
    });
    updatePreview(data);
    updateStatus(data);
  });
}

function updatePreview(data) {
  const preview = document.getElementById('profilePreview');
  const lines = [];
  if (data.nome || data.sobrenome) lines.push(`👤 ${data.nome || ''} ${data.sobrenome || ''}`.trim());
  if (data.cpf)   lines.push(`🪪 CPF: ${data.cpf}`);
  if (data.email) lines.push(`📧 ${data.email}`);
  if (data.phone || data.cel) lines.push(`📱 ${data.phone || data.cel}`);
  if (data.cidade || data.estado) lines.push(`📍 ${data.cidade || ''}${data.cidade && data.estado ? ' - ' : ''}${data.estado || ''}`);
  preview.innerHTML = lines.length
    ? lines.map(l => `<div>${l}</div>`).join('')
    : '<div style="color:var(--muted);font-style:italic">Nenhum dado salvo ainda. Vá para "Meus Dados".</div>';
}

function updateStatus(data) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const hasData = FIELD_IDS.some(id => data[id]);
  if (hasData) {
    dot.className = 'status-dot ready';
    text.textContent = 'Pronto para preencher formulários!';
  } else {
    dot.className = 'status-dot waiting';
    text.textContent = 'Configure seus dados primeiro →';
  }
}

// --- Save ---
document.getElementById('saveBtn').addEventListener('click', () => {
  const data = {};
  FIELD_IDS.forEach(id => {
    const el = document.getElementById('f_' + id);
    if (el) data[id] = el.value.trim();
  });
  chrome.storage.local.set({ autofill_data: data }, () => {
    updatePreview(data);
    updateStatus(data);
    showToast('✅ Dados salvos com sucesso!');
  });
});

// --- Fill ---
document.getElementById('fillBtn').addEventListener('click', () => {
  chrome.storage.local.get(['autofill_data'], (res) => {
    const data = res.autofill_data || {};
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill', data }, (response) => {
        const btn = document.getElementById('fillBtn');
        if (response && response.filled > 0) {
          btn.classList.add('success');
          btn.innerHTML = `<span>✅</span> ${response.filled} campo(s) preenchido(s)!`;
          showToast(`✅ ${response.filled} campo(s) preenchido(s)!`);
          setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = '<span>⚡</span> Preencher Formulário Agora';
          }, 3000);
        } else {
          showToast('⚠️ Nenhum campo detectado nesta página.');
        }
      });
    });
  });
});


// -- REMOVER DADOS -- 
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Tem certeza que deseja remover todos os seus dados salvos?')) {
    chrome.storage.local.remove(['autofill_data'], () => {
      FIELD_IDS.forEach(id => {
        const el = document.getElementById('f_' + id);
        if (el) el.value = '';
      });
      updatePreview({});
      updateStatus({});
      showToast('🗑️ Dados removidos com sucesso!');
    });
  }
  
  // -- SE NÃO TIVER DADOS NÃO EXIBA O BOTÃO --
  let btnClear = document.getElementById('clearBtn'); 
  if (!Object.keys(data).length === "") {
    btnClear.style.display = "none";
  } else {
    btnClear.style.display = "block";
  }
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

loadData();

const FIELD_IDS = [
  'cpf', 'rg', 'cnh', 'email', 'phone', 'cel',
  'nome', 'sobrenome', 'nascimento', 'genero', 'mae',
  'cep', 'numero', 'logradouro', 'complemento', 'bairro', 'cidade', 'estado', 'pais',
  'pis', 'cargo', 'empresa', 'obs',
  'linkedin', 'github', 'instagram', 'twitter', 'facebook', 'website', 'youtube', 'tiktok',
  'escolaridade', 'curso', 'instituicao',
  'resumo', 'exp_inicio', 'exp_fim'
];

const STORAGE_KEY = 'autofill_profiles_v1';
const LEGACY_KEY = 'autofill_data';

let appState = null;

// --- Tab logic ---
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

function emptyData() {
  return FIELD_IDS.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {});
}

function hasData(data) {
  return !!data && Object.values(data).some(v => String(v || '').trim() !== '');
}

function buildDefaultState() {
  const id = `profile_${Date.now()}`;
  return {
    activeProfileId: id,
    profiles: [{ id, name: 'Perfil 1', data: emptyData() }]
  };
}

function sanitizeData(data) {
  const result = emptyData();
  if (!data || typeof data !== 'object') return result;
  FIELD_IDS.forEach(key => {
    result[key] = typeof data[key] === 'string' ? data[key] : (data[key] == null ? '' : String(data[key]));
  });
  return result;
}

function normalizeState(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.profiles) || raw.profiles.length === 0) {
    return buildDefaultState();
  }

  const profiles = raw.profiles
    .filter(p => p && typeof p === 'object')
    .map((p, index) => ({
      id: typeof p.id === 'string' && p.id ? p.id : `profile_${Date.now()}_${index}`,
      name: typeof p.name === 'string' && p.name.trim() ? p.name.trim() : `Perfil ${index + 1}`,
      data: sanitizeData(p.data)
    }));

  if (profiles.length === 0) return buildDefaultState();

  const activeProfileId = profiles.some(p => p.id === raw.activeProfileId)
    ? raw.activeProfileId
    : profiles[0].id;

  return { profiles, activeProfileId };
}

function stateFromLegacyData(data) {
  const state = buildDefaultState();
  state.profiles[0].data = sanitizeData(data);
  return state;
}

function saveState(callback) {
  // A partir da v1.1, salvamos apenas no novo formato para evitar conflitos.
  // A migração do formato antigo é feita uma única vez em `loadState`.
  chrome.storage.local.set({ [STORAGE_KEY]: appState }, callback);
}

function loadState(callback) {
  chrome.storage.local.get([STORAGE_KEY, LEGACY_KEY], res => {
    // Prioridade 1: O novo formato de perfis já existe.
    if (res[STORAGE_KEY]) {
      appState = normalizeState(res[STORAGE_KEY]);
      callback(); // Apenas carrega o estado, não precisa salvar de novo.
      return;
    }

    // Prioridade 2: O formato antigo (legacy) existe e contém dados. Hora de migrar.
    if (res[LEGACY_KEY] && typeof res[LEGACY_KEY] === 'object' && hasData(res[LEGACY_KEY])) {
      console.log('MIGRATE: Dados antigos encontrados. Migrando para o novo formato de perfis.');
      appState = stateFromLegacyData(res[LEGACY_KEY]);

      // Salva o novo estado e remove a chave antiga para garantir que a migração só ocorra uma vez.
      chrome.storage.local.set({ [STORAGE_KEY]: appState }, () => {
        chrome.storage.local.remove(LEGACY_KEY, () => {
          console.log('MIGRATE: Migração concluída. Chave antiga removida.');
          showToast('Seus dados foram atualizados para o sistema de perfis!');
          callback();
        });
      });
      return;
    }

    // Prioridade 3: Nenhum dado encontrado. Cria um estado inicial.
    console.log('INIT: Nenhum dado encontrado. Criando perfil inicial.');
    appState = buildDefaultState();
    saveState(() => callback());
  });
}

function getActiveProfile() {
  if (!appState) return null;
  return appState.profiles.find(p => p.id === appState.activeProfileId) || appState.profiles[0] || null;
}

function updateStatus(data) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const btnClear = document.getElementById('clearBtn');
  const hasAnyData = hasData(data);

  if (hasAnyData) {
    dot.className = 'status-dot ready';
    text.textContent = 'Pronto para preencher formularios!';
    btnClear.style.display = 'block';
  } else {
    dot.className = 'status-dot waiting';
    text.textContent = 'Configure seus dados primeiro ->';
    btnClear.style.display = 'none';
  }
}

function updatePreview(data) {
  const preview = document.getElementById('profilePreview');
  const lines = [];

  if (data.nome || data.sobrenome) lines.push(`Nome: ${(data.nome || '').trim()} ${(data.sobrenome || '').trim()}`.trim());

  const docs = [];
  if (data.cpf) docs.push(`CPF: ${data.cpf}`);
  if (data.rg) docs.push(`RG: ${data.rg}`);
  if (docs.length) lines.push(docs.join(' | '));

  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone || data.cel) lines.push(`Telefone: ${data.phone || data.cel}`);

  const local = [data.cidade, data.estado, data.pais].filter(Boolean).join(' - ');
  if (local) lines.push(`Local: ${local}`);

  if (data.cargo || data.empresa) lines.push(`Profissional: ${data.cargo || ''} ${data.empresa ? '@ ' + data.empresa : ''}`.trim());
  if (data.curso || data.instituicao) lines.push(`Educacao: ${data.curso || ''} ${data.instituicao ? '- ' + data.instituicao : ''}`.trim());

  preview.innerHTML = lines.length
    ? lines.map(line => `<div>${line}</div>`).join('')
    : '<div style="color:var(--muted);font-style:italic">Nenhum dado salvo ainda. Va para "Meus Dados".</div>';
}

function renderProfileChips() {
  const chips = document.getElementById('profileChips');
  chips.innerHTML = '';

  appState.profiles.forEach(profile => {
    const btn = document.createElement('button');
    btn.className = 'profile-chip' + (profile.id === appState.activeProfileId ? ' active' : '');
    btn.type = 'button';
    btn.title = profile.name;
    btn.textContent = profile.name;

    btn.addEventListener('click', () => {
      appState.activeProfileId = profile.id;
      saveState(() => renderAll());
    });

    btn.addEventListener('dblclick', () => {
      const newName = prompt('Novo nome do perfil:', profile.name);
      if (newName == null) return;
      const normalized = newName.trim();
      if (!normalized) {
        showToast('Nome invalido.');
        return;
      }
      profile.name = normalized;
      saveState(() => {
        renderProfileChips();
        showToast('Perfil renomeado.');
      });
    });

    chips.appendChild(btn);
  });
}

function fillFormFromActiveProfile() {
  const active = getActiveProfile();
  const data = active ? active.data : emptyData();
  FIELD_IDS.forEach(id => {
    const el = document.getElementById('f_' + id);
    if (el) el.value = data[id] || '';
  });
}

function renderAll() {
  const active = getActiveProfile();
  const data = active ? active.data : emptyData();
  renderProfileChips();
  fillFormFromActiveProfile();
  updatePreview(data);
  updateStatus(data);
}

function nextProfileName() {
  let n = appState.profiles.length + 1;
  let candidate = `Perfil ${n}`;
  const names = new Set(appState.profiles.map(p => p.name.toLowerCase()));
  while (names.has(candidate.toLowerCase())) {
    n += 1;
    candidate = `Perfil ${n}`;
  }
  return candidate;
}

function addProfile() {
  const suggested = nextProfileName();
  const input = prompt('Nome do novo perfil:', suggested);
  if (input == null) return;
  const name = input.trim() || suggested;
  const id = `profile_${Date.now()}`;
  appState.profiles.push({ id, name, data: emptyData() });
  appState.activeProfileId = id;
  saveState(() => {
    renderAll();
    showToast('Perfil criado.');
  });
}

function deleteActiveProfile() {
  if (appState.profiles.length <= 1) {
    showToast('Voce precisa manter ao menos 1 perfil.');
    return;
  }
  const active = getActiveProfile();
  if (!active) return;

  if (!confirm(`Excluir o perfil "${active.name}"?`)) return;

  appState.profiles = appState.profiles.filter(p => p.id !== active.id);
  appState.activeProfileId = appState.profiles[0].id;
  saveState(() => {
    renderAll();
    showToast('Perfil removido.');
  });
}

function searchProfile() {
  const query = prompt('Pesquisar perfil (nome ou parte do nome):');
  if (query == null) return;
  const term = query.trim().toLowerCase();
  if (!term) {
    showToast('Digite um nome para pesquisar.');
    return;
  }

  const matches = appState.profiles.filter(p => p.name.toLowerCase().includes(term));
  if (matches.length === 0) {
    showToast('Nenhum perfil encontrado.');
    return;
  }

  if (matches.length === 1) {
    appState.activeProfileId = matches[0].id;
    saveState(() => {
      renderAll();
      showToast(`Perfil ativo: ${matches[0].name}`);
    });
    return;
  }

  const list = matches.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
  const pick = prompt(`Foram encontrados ${matches.length} perfis:\n${list}\n\nDigite o numero:`, '1');
  if (pick == null) return;
  const idx = Number(pick);
  if (!Number.isInteger(idx) || idx < 1 || idx > matches.length) {
    showToast('Opcao invalida.');
    return;
  }

  appState.activeProfileId = matches[idx - 1].id;
  saveState(() => {
    renderAll();
    showToast(`Perfil ativo: ${matches[idx - 1].name}`);
  });
}

function collectFormData() {
  const data = emptyData();
  FIELD_IDS.forEach(id => {
    const el = document.getElementById('f_' + id);
    if (el) data[id] = el.value.trim();
  });
  return data;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

document.getElementById('addProfileBtn').addEventListener('click', addProfile);
document.getElementById('deleteProfileBtn').addEventListener('click', deleteActiveProfile);
document.getElementById('searchProfileBtn').addEventListener('click', searchProfile);

document.getElementById('saveBtn').addEventListener('click', () => {
  const active = getActiveProfile();
  if (!active) return;
  active.data = collectFormData();
  saveState(() => {
    renderAll();
    showToast('Dados do perfil salvos!');
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  const active = getActiveProfile();
  if (!active) return;
  if (!confirm(`Tem certeza que deseja limpar os dados do perfil "${active.name}"?`)) return;
  active.data = emptyData();
  saveState(() => {
    renderAll();
    showToast('Dados removidos com sucesso!');
  });
});

document.getElementById('fillBtn').addEventListener('click', () => {
  const active = getActiveProfile();
  const data = active ? active.data : {};

  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    if (!tabs || tabs.length === 0) return;
    const tabId = tabs[0].id;
    const btn = document.getElementById('fillBtn');

    try {
      // Injeta o content.js dinamicamente via activeTab (sem necessidade de <all_urls>)
      await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    } catch (e) {
      // Script pode já estar injetado na aba — continua normalmente
    }

    // Aguarda o script registrar o listener antes de enviar a mensagem
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: 'autofill', data }, response => {
        if (chrome.runtime.lastError) {
          showToast('Erro ao acessar a página. Tente recarregar.');
          return;
        }
        if (response && response.filled > 0) {
          btn.classList.add('success');
          btn.innerHTML = `<span>OK</span> ${response.filled} campo(s) preenchido(s)!`;
          showToast(`${response.filled} campo(s) preenchido(s)!`);
          setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = '<span>⚡</span> Preencher Formulário Agora';
          }, 3000);
        } else {
          showToast('Nenhum campo detectado nesta página.');
        }
      });
    }, 150);
  });
});

document.getElementById('exportBtn').addEventListener('click', () => {
  if (!appState || appState.profiles.length === 0) {
    showToast('Nao ha dados para exportar.');
    return;
  }

  const hasAnyProfileData = appState.profiles.some(p => hasData(p.data));
  if (!hasAnyProfileData) {
    showToast('Nao ha dados para exportar.');
    return;
  }

  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    activeProfileId: appState.activeProfileId,
    profiles: appState.profiles
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `autofill-brasil-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup exportado com sucesso!');
});

document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', event => {
  const file = event.target.files[0];
  const input = document.getElementById('importFile');
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported || typeof imported !== 'object') throw new Error('Arquivo JSON invalido.');

      let nextState;

      // Verifica se o formato é o de dicionário (ex: dados_ficticios_autofill.json)
      // onde "profiles" é um objeto { "Nome": { ... } } em vez de array.
      if (imported.profiles && typeof imported.profiles === 'object' && !Array.isArray(imported.profiles)) {
        const profiles = Object.entries(imported.profiles).map(([name, data], idx) => ({
          id: `profile_imp_${Date.now()}_${idx}`,
          name: name,
          data: sanitizeData(data)
        }));

        if (profiles.length === 0) {
          nextState = buildDefaultState();
        } else {
          let activeProfileId = profiles[0].id;
          if (imported.active && typeof imported.active === 'string') {
            const match = profiles.find(p => p.name === imported.active);
            if (match) activeProfileId = match.id;
          }
          nextState = { profiles, activeProfileId };
        }
      } else if (Array.isArray(imported.profiles)) {
        nextState = normalizeState(imported);
      } else {
        nextState = stateFromLegacyData(imported);
      }

      if (!confirm('Isso substituira seus perfis atuais. Deseja continuar?')) return;

      appState = nextState;
      saveState(() => {
        renderAll();
        showToast('Dados importados com sucesso!');
      });
    } catch (error) {
      showToast(`Erro ao importar: ${error.message}`);
    } finally {
      input.value = '';
    }
  };
  reader.readAsText(file);
});

loadState(() => {
  renderAll();
});
