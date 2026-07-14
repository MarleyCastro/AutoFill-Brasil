# ⚡ AutoFill Brasil — Extensão Chrome


<div style="background-color: #4C3DCD; display: flex; aligth-itens=center; justify-content=center; flex-direction= column; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);" >
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/86256313-3450-4451-b27d-77abcbbbec87" />
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/fc0687ec-5289-4750-add7-af9b92afd02c" />
    <img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/e1e377e6-dff6-49e5-89c9-06f948888361" />
</div>

<<<<<<< HEAD

=======
>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
<div align="center">

# ⚡ AutoFill Brasil

[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-brightgreen?style=for-the-badge)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)]()

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Status](#-status-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Campos Suportados](#-campos-suportados)
- [Como Instalar](#-como-instalar)
- [Como Usar](#-como-usar)
- [Tecnologias](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Privacidade](#-privacidade)
- [Desenvolvedor](#-desenvolvedor)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **AutoFill Brasil** é uma extensão para Google Chrome desenvolvida para facilitar o preenchimento de formulários online com dados pessoais brasileiros. Com um clique, a extensão detecta automaticamente os campos disponíveis na página e os preenche com as informações previamente salvas pelo usuário — sem precisar digitar nada novamente.

### 🎯 Objetivo

Proporcionar uma ferramenta prática para:

- Preencher formulários automaticamente com CPF, RG, e-mail, endereço e muito mais
- Detectar campos de forma inteligente através de `name`, `id`, `placeholder`, `label` e `aria-label`
- Manter todos os dados armazenados com segurança localmente no navegador

---

## 🚦 Status do Projeto

<div align="center">

🚧 **Em Desenvolvimento** 🚧

</div>

---

## ✨ Funcionalidades

- [x] Detecção automática de campos em formulários web
- [x] Preenchimento com um único clique
- [x] Suporte a campos de documentos brasileiros (CPF, RG, CNH, PIS)
- [x] Suporte a endereço completo (CEP, logradouro, bairro, cidade, estado)
- [x] Compatível com sites em React, Vue e HTML puro
- [x] Armazenamento local e seguro dos dados (`chrome.storage.local`)
- [x] Interface moderna, responsiva e intuitiva
- [ ] Suporte a múltiplos perfis de usuário
- [ ] Exportar/importar dados entre dispositivos
- [ ] Preenchimento de campos `<select>` avançados

---

## 🪪 Campos Suportados

| Categoria | Campos |
|---|---|
| 📄 Documentos | CPF, RG, CNH, PIS/PASEP |
| 📬 Contato | E-mail, Telefone, Celular |
| 👤 Dados Pessoais | Nome, Sobrenome, Data de Nascimento, Gênero, Nome da Mãe |
| 🏠 Endereço | CEP, Logradouro, Número, Complemento, Bairro, Cidade, Estado |

---

## 🔧 Como Instalar

### Pré-requisitos

- Google Chrome versão 88 ou superior
- Modo de desenvolvedor habilitado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/autofill-brasil.git

# 2. Acesse a pasta do projeto
cd autofill-brasil
```

Depois:

1. Abra o Chrome e acesse **`chrome://extensions/`**
2. Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta `autocomplete-extension`
5. O ícone ⚡ aparecerá na barra do Chrome ✅

---

## 🚀 Como Usar

**1.** Clique no ícone ⚡ na barra do Chrome

**2.** Vá para a aba **👤 Meus Dados** e preencha suas informações pessoais

**3.** Clique em **💾 Salvar Dados**

**4.** Acesse qualquer site com formulário

**5.** Clique no ícone ⚡ → **"⚡ Preencher Formulário Agora"**

> A extensão detectará e preencherá automaticamente todos os campos reconhecidos na página.

---

## 🛠 Tecnologias Utilizadas

- **[HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)** — Estrutura do popup
- **[CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)** — Estilização e animações
- **[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)** — Lógica de detecção e preenchimento
- **[Chrome Extensions API (MV3)](https://developer.chrome.com/docs/extensions/mv3/)** — Integração com o navegador
- **[Google Fonts — Sora](https://fonts.google.com/specimen/Sora)** — Tipografia da interface

---

## 📁 Estrutura do Projeto

```
autocomplete-extension/
│
├── 📄 manifest.json          # Configuração e permissões da extensão
├── 🖥️  popup.html             # Interface do usuário (popup)
├── ⚙️  popup.js               # Lógica do popup (salvar, carregar, acionar)
├── 🔍 content.js             # Script de detecção e preenchimento de campos
│
└── 📁 icons/
    ├── icon16.png            # Ícone 16x16
    ├── icon48.png            # Ícone 48x48
    └── icon128.png           # Ícone 128x128
```

---

## 🔒 Privacidade

Todos os dados inseridos na extensão são armazenados **exclusivamente no seu navegador** através da API `chrome.storage.local`.

- ✅ Nenhuma informação é enviada para servidores externos
- ✅ Nenhum dado trafega pela internet
- ✅ Você pode apagar seus dados a qualquer momento desinstalando a extensão

---

## 👨‍💻 Desenvolvedor

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MarleyCastro">
        <img src="https://avatars.githubusercontent.com/u/162909728?s=96&v=4" width="150px;" alt="Foto do Desenvolvedor"/><br>
        <sub>
          <b>Marley Castro</b>
        </sub>
      </a>
      <br/>
      <sub>Desenvolvedor Full Stack</sub>
      <br/>
      <br/>
      <a href="https://github.com/MarleyCastro">
        <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
      </a>
      <a href="https://www.linkedin.com/in/marley-castro/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
      </a>
      <a href="mailto:marleynascimento978@gmail.com">
        <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
      </a>
    </td>
  </tr>
</table>

</div>

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

### ⭐ Se este projeto te ajudou, considere dar uma estrela!
**Desenvolvido com ❤️ por [Marley Castro](https://github.com/MarleyCastro)**

<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 9f821f4 (Adicionei uma novas funcionalidades e correções)
