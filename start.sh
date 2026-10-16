#!/bin/bash

# Script para iniciar toda a aplicação Garmin Training AI
# Autor: Bob
# Data: 2026-06-30

set -e  # Sai se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║        🏃 GARMIN TRAINING AI - STARTUP SCRIPT        ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detecta o diretório do script e navega até ele
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Verifica se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Erro: package.json não encontrado no diretório do script!"
    exit 1
fi

print_info "Iniciando verificações..."

# Verifica Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    print_info "Instale o Node.js 18+ em: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) detectado"

# Verifica npm
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado!"
    exit 1
fi
print_success "npm $(npm -v) detectado"

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    print_warning "Dependências não instaladas. Instalando..."
    npm install
    print_success "Dependências raiz instaladas"
fi

# Verifica dependências do backend
if [ ! -d "packages/backend/node_modules" ]; then
    print_warning "Instalando dependências do backend..."
    cd packages/backend
    npm install
    cd ../..
    print_success "Dependências do backend instaladas"
fi

# Verifica dependências do frontend
if [ ! -d "packages/web/node_modules" ]; then
    print_warning "Instalando dependências do frontend..."
    cd packages/web
    npm install
    cd ../..
    print_success "Dependências do frontend instaladas"
fi

# Verifica arquivo .env do backend
if [ ! -f "packages/backend/.env" ]; then
    print_warning "Arquivo .env não encontrado no backend"
    if [ -f "packages/backend/.env.example" ]; then
        print_info "Copiando .env.example para .env..."
        cp packages/backend/.env.example packages/backend/.env
        print_warning "Configure o arquivo packages/backend/.env antes de continuar!"
        print_info "Pressione ENTER para continuar após configurar o .env..."
        read
    else
        print_error "Arquivo .env.example não encontrado!"
        exit 1
    fi
fi

# Verifica arquivo .env.local do frontend
if [ ! -f "packages/web/.env.local" ]; then
    print_warning "Arquivo .env.local não encontrado no frontend"
    print_info "Criando .env.local com configurações padrão..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > packages/web/.env.local
    print_success "Arquivo .env.local criado"
fi

# Gera Prisma Client
print_info "Gerando Prisma Client..."
cd packages/backend
npx prisma generate > /dev/null 2>&1
print_success "Prisma Client gerado"

# Sincroniza o schema do banco de dados
print_info "Sincronizando schema do banco de dados..."
npx prisma db push --accept-data-loss > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Schema do banco de dados sincronizado"
else
    print_warning "Banco de dados já está sincronizado ou houve um aviso"
fi
cd ../..

# Função para limpar processos ao sair
cleanup() {
    print_info "Encerrando aplicação..."
    kill $(jobs -p) 2>/dev/null
    print_success "Aplicação encerrada"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Inicia o backend
print_info "Iniciando backend na porta 3001..."
cd packages/backend
npm run dev > ../../backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Aguarda o backend iniciar
print_info "Aguardando backend inicializar..."
sleep 5

# Verifica se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Falha ao iniciar o backend!"
    print_info "Verifique o arquivo backend.log para mais detalhes"
    cat backend.log
    exit 1
fi
print_success "Backend iniciado (PID: $BACKEND_PID)"

# Inicia o frontend
print_info "Iniciando frontend na porta 3000..."
cd packages/web
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Aguarda o frontend iniciar
print_info "Aguardando frontend inicializar..."
sleep 5

# Verifica se o frontend está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Falha ao iniciar o frontend!"
    print_info "Verifique o arquivo frontend.log para mais detalhes"
    cat frontend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
print_success "Frontend iniciado (PID: $FRONTEND_PID)"

# Mensagem de sucesso
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║           🎉 APLICAÇÃO INICIADA COM SUCESSO!         ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
print_info "Serviços disponíveis:"
echo -e "  ${BLUE}🌐 Frontend:${NC}  http://localhost:3000"
echo -e "  ${BLUE}🔧 Backend:${NC}   http://localhost:3001"
echo -e "  ${BLUE}📊 API Docs:${NC}  http://localhost:3001/api"
echo ""
print_info "Logs:"
echo -e "  ${BLUE}Backend:${NC}  tail -f backend.log"
echo -e "  ${BLUE}Frontend:${NC} tail -f frontend.log"
echo ""
print_warning "Pressione Ctrl+C para encerrar todos os serviços"
echo ""

# Mantém o script rodando
wait

# Made with Bob
