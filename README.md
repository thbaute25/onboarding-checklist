# 📋 Sistema de Onboarding - Checklist e Chat de Dúvidas

Sistema completo de onboarding para SharePoint/Teams com checklist de tarefas, chat de dúvidas com respostas automáticas, dashboard de estatísticas e integração com Power Automate para notificações no Teams.

![SPFx Version](https://img.shields.io/badge/SPFx-1.21.1-green.svg)
![Node Version](https://img.shields.io/badge/Node-%3E%3D22.14.0-brightgreen.svg)

## 🎯 Funcionalidades

- ✅ **Checklist de Tarefas**: Tarefas organizadas por Primeiro Dia, Primeira Semana e Primeiro Mês
- 💬 **Chat de Dúvidas**: Sistema de chat com respostas automáticas baseadas em palavras-chave
- 📊 **Dashboard de Estatísticas**: Visualização de dúvidas por categoria, tempo médio de resposta e mais
- 📈 **Barra de Progresso**: Acompanhamento visual do progresso do onboarding
- 🔔 **Notificações Teams**: Integração com Power Automate para notificações no Teams
- 💾 **Persistência de Dados**: Suporte a LocalStorage e SharePoint Lists
- 🎨 **Design Moderno**: Interface com glassmorphism e animações suaves

## ⚠️ IMPORTANTE: Este é um Projeto Local

**Este projeto requer configuração completa do ambiente de desenvolvimento SharePoint Framework (SPFx) no seu computador local.** Não é possível executá-lo diretamente após fazer o download - é necessário instalar e configurar todas as ferramentas necessárias.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js** (versão 22.14.0 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **npm** (vem com Node.js)
   - Verificar instalação: `npm --version`

3. **Git** (para clonar o repositório)
   - Download: https://git-scm.com/downloads

4. **PowerShell** (Windows) ou Terminal (Mac/Linux)
   - Windows: Já vem instalado
   - Mac/Linux: Terminal nativo

5. **Conta Microsoft 365** com acesso ao SharePoint
   - Pode ser uma conta de desenvolvedor gratuita: https://developer.microsoft.com/en-us/microsoft-365/dev-program

## 🚀 Configuração do Ambiente SPFx

### Passo 1: Configurar PowerShell (Windows)

**⚠️ CRÍTICO:** O PowerShell precisa estar configurado para executar scripts. Execute os seguintes comandos no PowerShell **como Administrador**:

```powershell
# 1. Verificar política de execução atual
Get-ExecutionPolicy

# 2. Se retornar "Restricted", execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Verificar se foi aplicado
Get-ExecutionPolicy
```

**Nota:** Se você receber um erro de permissão, abra o PowerShell como Administrador (botão direito → "Executar como administrador").

### Passo 2: Instalar Ferramentas Globais do SPFx

Abra o PowerShell (ou Terminal) e execute:

```powershell
# Instalar Yeoman (gerador de projetos)
npm install -g yo

# Instalar o gerador do SharePoint Framework
npm install -g @microsoft/generator-sharepoint@1.21.1

# Instalar Gulp CLI (ferramenta de build)
npm install -g gulp-cli
```

**Tempo estimado:** 5-10 minutos (dependendo da velocidade da internet)

### Passo 3: Verificar Instalações

Verifique se tudo foi instalado corretamente:

```powershell
# Verificar Node.js
node --version
# Deve mostrar: v22.14.0 ou superior

# Verificar npm
npm --version

# Verificar Yeoman
yo --version

# Verificar Gulp
gulp --version
```

## 📥 Instalação do Projeto

### Passo 1: Clonar o Repositório

```powershell
# Clonar o repositório
git clone https://github.com/thbaute25/onboarding-checklist.git

# Entrar na pasta do projeto
cd onboarding-checklist
```

### Passo 2: Instalar Dependências

```powershell
# Instalar todas as dependências do projeto
npm install
```

**Tempo estimado:** 5-15 minutos (dependendo da velocidade da internet)

**⚠️ Importante:** Este passo pode demorar bastante. Não interrompa o processo!

### Passo 3: Verificar Instalação

Após a instalação, verifique se tudo está correto:

```powershell
# Verificar se node_modules foi criado
Test-Path node_modules

# Deve retornar: True
```

## 🏃 Executando o Projeto

### Modo Desenvolvimento (Workbench Local)

Para testar localmente sem precisar fazer deploy:

```powershell
# Executar em modo desenvolvimento
gulp serve
```

O projeto será aberto automaticamente no navegador em:
- **Workbench Local:** `https://localhost:4321/temp/workbench.html`

**⚠️ Nota:** O navegador pode mostrar um aviso de certificado SSL. Isso é normal em desenvolvimento. Clique em "Avançado" e "Continuar para localhost".

#### 📌 Adicionar WebParts no Workbench

Após abrir o Workbench, você precisa adicionar os WebParts manualmente:

1. **Clique no botão "+" (mais)** no canto superior esquerdo da página
2. **Selecione "Home Onboarding"** na lista de WebParts disponíveis
   - Este é o WebPart inicial com os botões "Tarefas do Mês" e "Enviar Dúvidas"
3. **Clique novamente no "+"** e adicione **"Checklist Onboarding"**
   - Este é o WebPart principal com as tarefas de onboarding
4. Agora você pode interagir com a aplicação completa!

**💡 Dica:** Você pode adicionar os dois WebParts na mesma página para ter a experiência completa, ou testá-los separadamente.

### Modo Desenvolvimento (Workbench SharePoint)

Para testar no SharePoint real:

1. Execute:
```powershell
gulp serve --nobrowser
```

2. Acesse seu site SharePoint
3. Adicione `?loadSPFX=true&debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js` à URL

Exemplo:
```
https://seu-tenant.sharepoint.com/sites/seu-site/SitePages/Home.aspx?loadSPFX=true&debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js
```

4. **Adicionar WebParts na página:**
   - Clique em **"Editar"** na página do SharePoint
   - Clique no **"+"** para adicionar um WebPart
   - Selecione **"Home Onboarding"** ou **"Checklist Onboarding"**
   - Publique a página para ver os WebParts funcionando

## 🏗️ Build para Produção

Para criar o pacote de produção:

```powershell
# Build do projeto
gulp build

# Criar pacote .sppkg
gulp bundle --ship
gulp package-solution --ship
```

O arquivo `.sppkg` será gerado em: `sharepoint/solution/onboarding-checklist.sppkg`

## 📦 Deploy no SharePoint

1. Acesse o **App Catalog** do seu tenant SharePoint
2. Faça upload do arquivo `onboarding-checklist.sppkg`
3. Marque a opção "Tornar esta solução disponível para todos os sites"
4. Aguarde a aprovação
5. Adicione o WebPart em qualquer página do SharePoint

## 🔧 Configuração Adicional

### Configurar Webhook do Power Automate

Para habilitar notificações no Teams:

1. Abra o WebPart no SharePoint
2. Clique no ícone de engrenagem (⚙️) para abrir as propriedades
3. Na seção "Power Automate - Notificações Teams", cole a URL do webhook
4. Salve

**📖 Documentação completa:** Veja `src/webparts/checklistOnboarding/TEAMS_NOTIFICATIONS_SETUP.md`

### Usar SharePoint Lists (Opcional)

Por padrão, o projeto usa LocalStorage. Para usar SharePoint Lists:

1. Veja instruções em: `src/webparts/checklistOnboarding/services/README.md`

## 📁 Estrutura do Projeto

```
onboarding-checklist/
├── src/
│   └── webparts/
│       ├── checklistOnboarding/     # WebPart principal (Tarefas)
│       │   ├── components/          # Componentes React
│       │   │   ├── Tarefas.tsx      # Tela principal de tarefas
│       │   │   ├── ChatDuvidas.tsx  # Chat de dúvidas
│       │   │   ├── Dashboard.tsx    # Dashboard de estatísticas
│       │   │   └── ...
│       │   └── services/            # Serviços e lógica de negócio
│       └── homeOnboarding/          # WebPart inicial (Home)
├── config/                          # Configurações do SPFx
├── lib/                             # Arquivos compilados (gerado)
├── dist/                            # Build de produção (gerado)
└── package.json                     # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **SharePoint Framework (SPFx)** 1.21.1
- **React** 17.0.1
- **TypeScript** 5.3.3
- **SCSS** (CSS Modules)
- **Power Automate** (integração opcional)

## 📚 Documentação Adicional

- [Configuração do Checklist](src/webparts/checklistOnboarding/CHECKLIST_CONFIGURACAO.md)
- [Configuração do Power Automate](src/webparts/checklistOnboarding/POWER_AUTOMATE_SETUP.md)
- [Notificações Teams](src/webparts/checklistOnboarding/TEAMS_NOTIFICATIONS_SETUP.md)
- [Serviços de Persistência](src/webparts/checklistOnboarding/services/README.md)

## ❓ Solução de Problemas

### Erro: "Execution Policy"

**Problema:** PowerShell não executa scripts

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "gulp não é reconhecido"

**Problema:** Gulp não está instalado globalmente

**Solução:**
```powershell
npm install -g gulp-cli
```

### Erro: "yo não é reconhecido"

**Problema:** Yeoman não está instalado

**Solução:**
```powershell
npm install -g yo @microsoft/generator-sharepoint@1.21.1
```

### Erro: Certificado SSL no navegador

**Problema:** Aviso de certificado inválido

**Solução:** Isso é normal em desenvolvimento. Clique em "Avançado" → "Continuar para localhost"

### Erro: Porta 4321 já em uso

**Problema:** Outro processo está usando a porta

**Solução:**
```powershell
# Windows: Encontrar processo usando a porta
netstat -ano | findstr :4321

# Matar o processo (substitua PID pelo número do processo)
taskkill /PID <PID> /F
```

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Thomas Henrique Baute**
- GitHub: [@thbaute25](https://github.com/thbaute25)



## 📞 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. Verifique a seção [Solução de Problemas](#-solução-de-problemas)
2. Consulte a documentação adicional nos arquivos `.md` do projeto
3. Abra uma [Issue](https://github.com/thbaute25/onboarding-checklist/issues) no GitHub

---

**⚠️ Lembrete:** Este é um projeto de desenvolvimento local. Certifique-se de ter configurado todo o ambiente SPFx antes de tentar executar o projeto.

**usando SharePoint Framework**
