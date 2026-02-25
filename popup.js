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
