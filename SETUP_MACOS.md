# 🍎 Guia de Setup para macOS

Este guia vai te ajudar a configurar e rodar o Garmin Training AI no seu Mac.

## 📋 Pré-requisitos

### 1. Instalar Homebrew (se ainda não tiver)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar Node.js (versão 20+)

```bash
# Instalar Node.js via Homebrew
brew install node@20

# Verificar instalação
node --version  # Deve mostrar v20.x.x
npm --version   # Deve mostrar 10.x.x
```

### 3. Instalar PostgreSQL

```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar serviço do PostgreSQL
brew services start postgresql@15

# Verificar se está rodando
brew services list | grep postgresql
```

### 4. Instalar Ollama (IA Local)

```bash
# Baixar e instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Ou baixar manualmente de: https://ollama.com/download

# Verificar instalação
ollama --version
```

## 🚀 Setup do Projeto

### Passo 1: Instalar Dependências

```bash
# Na raiz do projeto
cd /Users/edinardeaquinojunior/Bob/Garmin

# Instalar dependências do monorepo
npm install

# Instalar dependências do backend
cd packages/backend
npm install
```

### Passo 2: Configurar Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb garmin_training

# Ou usando psql:
psql postgres
CREATE DATABASE garmin_training;
\q
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cd packages/backend
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

Edite o arquivo `.env` com estas configurações:

```env
# Database
DATABASE_URL="postgresql://seu_usuario@localhost:5432/garmin_training?schema=public"

# JWT (gere uma chave segura)
JWT_SECRET="sua-chave-super-secreta-mude-isso-em-producao-123456789"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server
PORT=3001
NODE_ENV=development

# Ollama AI
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3"

# CORS
CORS_ORIGIN="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Nota**: Substitua `seu_usuario` pelo seu usuário do Mac. Para descobrir:
```bash
whoami
```

### Passo 4: Configurar Prisma e Banco de Dados

```bash
# Ainda em packages/backend

# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco de dados
npx prisma migrate dev --name init

# (Opcional) Abrir interface visual do banco
npx prisma studio
```

### Passo 5: Baixar Modelo de IA

```bash
# Iniciar Ollama (em um terminal separado)
ollama serve

# Em outro terminal, baixar o modelo
ollama pull llama3

# Ou se preferir o Mistral:
ollama pull mistral

# Verificar modelos instalados
ollama list
```

## ▶️ Rodando a Aplicação

### Opção 1: Rodar Apenas o Backend (para testar)

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
cd /Users/edinardeaquinojunior/Bob/Garmin/packages/backend
npm run dev
```

O backend estará rodando em: `http://localhost:3001`

### Opção 2: Rodar com Docker (Recomendado)

Primeiro, instale o Docker Desktop para Mac:
```bash
brew install --cask docker
```

Depois, na raiz do projeto:
```bash
docker-compose up -d
```

## 🧪 Testando a Instalação

### 1. Testar Backend

```bash
# Health check
curl http://localhost:3001/health

# Deve retornar: {"status":"ok","timestamp":"..."}
```

### 2. Testar Ollama

```bash
# Verificar se Ollama está respondendo
curl http://localhost:11434/api/tags

# Testar geração de texto
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Olá, como você está?",
  "stream": false
}'
```

### 3. Testar Banco de Dados

```bash
# Conectar ao banco
psql garmin_training

# Listar tabelas
\dt

# Deve mostrar: users, garmin_activities, garmin_metrics, etc.

# Sair
\q
```

## 🐛 Resolução de Problemas

### Erro: "Cannot find module '@prisma/client'"

```bash
cd packages/backend
npx prisma generate
npm install
```

### Erro: "Port 3001 already in use"

```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar processo
kill -9 <PID>

# Ou mudar a porta no .env
PORT=3002
```

### Erro: "Cannot connect to PostgreSQL"

```bash
# Verificar se PostgreSQL está rodando
brew services list

# Reiniciar PostgreSQL
brew services restart postgresql@15

# Verificar logs
tail -f /opt/homebrew/var/log/postgresql@15.log
```

### Erro: "Ollama not found"

```bash
# Verificar instalação
which ollama

# Se não encontrado, reinstalar
curl -fsSL https://ollama.com/install.sh | sh

# Adicionar ao PATH (se necessário)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Erro: "Database does not exist"

```bash
# Criar banco manualmente
createdb garmin_training

# Ou via psql
psql postgres -c "CREATE DATABASE garmin_training;"
```

## 📝 Comandos Úteis

```bash
# Ver logs do backend
cd packages/backend
npm run dev

# Parar todos os serviços
# Ctrl+C em cada terminal

# Limpar node_modules e reinstalar
npm run clean
npm install

# Ver status dos serviços Homebrew
brew services list

# Reiniciar PostgreSQL
brew services restart postgresql@15

# Ver modelos Ollama instalados
ollama list

# Remover modelo Ollama
ollama rm llama3

# Backup do banco de dados
pg_dump garmin_training > backup.sql

# Restaurar banco de dados
psql garmin_training < backup.sql
```

## 🎯 Próximos Passos

Depois que tudo estiver funcionando:

1. **Testar importação de dados**
   - Prepare um arquivo CSV com dados do Garmin
   - Use a API para importar

2. **Gerar primeiro treino**
   - Importe algumas atividades
   - Chame a API de geração de treinos

3. **Desenvolver Frontend**
   - Configurar Next.js
   - Criar interface de usuário

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs de cada serviço
2. Confirme que todas as portas estão livres (3001, 5432, 11434)
3. Verifique as variáveis de ambiente no `.env`
4. Teste cada componente individualmente

## 🔗 Links Úteis

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Ollama](https://ollama.com/)
- [Prisma](https://www.prisma.io/)
- [Homebrew](https://brew.sh/)