# 🔧 Corrigir Versão do Node.js

Você está com uma versão antiga do Node.js. Vamos atualizar!

## 🔍 Verificar Versão Atual

```bash
node --version
```

Se mostrar algo menor que v16.13, precisa atualizar.

## ✅ Solução: Atualizar Node.js

### Opção 1: Usando Homebrew (Recomendado)

```bash
# Desinstalar versão antiga (se instalada via Homebrew)
brew uninstall node

# Instalar Node.js 20 (versão LTS mais recente)
brew install node@20

# Adicionar ao PATH
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verificar instalação
node --version  # Deve mostrar v20.x.x
npm --version   # Deve mostrar 10.x.x
```

### Opção 2: Usando NVM (Node Version Manager)

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar terminal
source ~/.zshrc

# Instalar Node.js 20
nvm install 20

# Usar Node.js 20
nvm use 20

# Definir como padrão
nvm alias default 20

# Verificar
node --version
```

### Opção 3: Download Direto

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (20.x)
3. Instale o pacote .pkg
4. Reinicie o terminal

## 🔄 Depois de Atualizar

```bash
# Voltar para o projeto
cd /Users/edinardeaquinojunior/Bob/Garmin

# Limpar instalações antigas
rm -rf node_modules
rm -rf packages/*/node_modules
rm package-lock.json
rm packages/*/package-lock.json

# Reinstalar dependências
npm install
cd packages/backend
npm install

# Agora o Prisma deve funcionar
npx prisma generate
```

## ✅ Verificar se Funcionou

```bash
# Verificar Node.js
node --version
# Deve mostrar: v20.x.x ou superior

# Verificar npm
npm --version
# Deve mostrar: 10.x.x ou superior

# Testar Prisma
cd packages/backend
npx prisma --version
# Deve funcionar sem erros
```

## 🐛 Problemas Comuns

### "command not found: node" após instalação

```bash
# Adicionar ao PATH manualmente
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Múltiplas versões do Node instaladas

```bash
# Ver onde está instalado
which node
which -a node

# Remover versões antigas
brew uninstall node
brew cleanup

# Reinstalar versão correta
brew install node@20
```

### Permissões negadas

```bash
# Corrigir permissões do npm
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /opt/homebrew
```

## 🚀 Continuar Setup

Depois de atualizar o Node.js:

```bash
# Execute o script de setup novamente
./setup.sh
```

Ou continue manualmente:

```bash
cd packages/backend

# Configurar .env
cp .env.example .env

# Gerar Prisma
npx prisma generate

# Criar banco
createdb garmin_training

# Rodar migrations
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

---

**Dica**: Use sempre a versão LTS (Long Term Support) do Node.js para projetos em produção!