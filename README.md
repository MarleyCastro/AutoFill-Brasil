# ⚡ AutoFill Brasil — Extensão Chrome

<div style="background-color: #4C3DCD">
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/86256313-3450-4451-b27d-77abcbbbec87" />
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/fc0687ec-5289-4750-add7-af9b92afd02c" />
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/e1e377e6-dff6-49e5-89c9-06f948888361" />
</div>




Extensão Google Chrome para preenchimento automático de formulários com seus dados pessoais brasileiros (CPF, RG, e-mail, endereço e muito mais).

---

## 🚀 Como instalar

1. Baixe e descompacte a pasta `autocomplete-extension`
2. Abra o Google Chrome e acesse: **chrome://extensions/**
3. Ative o **Modo do desenvolvedor** (canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta `autocomplete-extension`
6. A extensão aparecerá na barra do Chrome! ✅

---

## 📋 Como usar

1. Clique no ícone da extensão na barra do Chrome
2. Vá na aba **"👤 Meus Dados"** e preencha suas informações
3. Clique em **"💾 Salvar Dados"**
4. Acesse qualquer site com formulário
5. Clique no ícone da extensão → **"⚡ Preencher Formulário Agora"**

---

## 🪪 Campos suportados

| Categoria     | Campos                                      |
|---------------|---------------------------------------------|
| Documentos    | CPF, RG, CNH, PIS/PASEP                    |
| Contato       | E-mail, Telefone, Celular                   |
| Pessoal       | Nome, Sobrenome, Data de Nascimento, Gênero, Nome da Mãe |
| Endereço      | CEP, Logradouro, Número, Complemento, Bairro, Cidade, Estado |

---

## 🔒 Privacidade

Todos os dados ficam armazenados **localmente no seu navegador** via `chrome.storage.local`. Nenhuma informação é enviada para servidores externos.

---

## 🛠 Estrutura de arquivos

```
autocomplete-extension/
├── manifest.json     # Configuração da extensão
├── popup.html        # Interface do usuário
├── popup.js          # Lógica do popup
├── content.js        # Script de detecção e preenchimento
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
