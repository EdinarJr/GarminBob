#!/bin/bash

# Script de setup automático para macOS
# Garmin Training AI

set -e

echo "🏃‍♂️ Garmin Training AI - Setup para macOS"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para imprimir sucesso
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Função para imprimir erro
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Função para imprimir aviso
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar Node.js
echo "Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js não encontrado!"
    echo "Instalando Node.js via Homebrew..."
    if command_exists brew; then
        brew install node@20
        print_success "Node.js instalado com sucesso!"
    else
        print_error "Homebrew não encontrado. Instale primeiro: https://brew.sh"
        exit 1
    fi
fi

# Verificar PostgreSQL
echo ""
echo "Verificando PostgreSQL..."
if command_exists psql; then
    PSQL_VERSION=$(psql --version)
    print_success "PostgreSQL instalado: $PSQL_VERSION"
else
    print_error "PostgreSQL não encontrado!"
    echo "Instalando PostgreSQL via Homebrew..."
    brew install postgresql@15
    brew services start postgresql@15
    print_success "PostgreSQL instalado e iniciado!"
fi

# Verificar Ollama
echo ""
echo "Verificando Ollama..."
if command_exists ollama; then
    OLLAMA_VERSION=$(ollama --version)
    print_success "Ollama instalado: $OLLAMA_VERSION"
else
    print_warning "Ollama não encontrado!"
    echo "Deseja instalar Ollama agora? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        curl -fsSL https://ollama.com/install.sh | sh
        print_success "Ollama instalado!"
    else
        print_warning "Ollama não instalado. Você precisará instalá-lo manualmente."
    fi
fi

# Instalar dependências do projeto
echo ""
echo "Instalando dependências do projeto..."
npm install
print_success "Dependências raiz instaladas!"

echo ""
echo "Instalando dependências do backend..."
cd packages/backend
npm install
print_success "Dependências do backend instaladas!"

# Configurar .env
echo ""
echo "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    
    # Obter usuário do sistema
    USER=$(whoami)
    
    # Gerar JWT secret aleatório
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Atualizar .env com valores corretos
    sed -i '' "s|postgresql://garmin:garmin123@localhost:5432/garmin_training|postgresql://$USER@localhost:5432/garmin_training|g" .env
    sed -i '' "s|your-super-secret-jwt-key-change-in-production|$JWT_SECRET|g" .env
    
    print_success "Arquivo .env criado e configurado!"
else
    print_warning "Arquivo .env já existe. Pulando..."
fi

# Criar banco de dados
echo ""
echo "Configurando banco de dados..."
if psql postgres -lqt | cut -d \| -f 1 | grep -qw garmin_training; then
    print_warning "Banco de dados 'garmin_training' já existe."
else
    createdb garmin_training
    print_success "Banco de dados 'garmin_training' criado!"
fi

# Gerar cliente Prisma
echo ""
echo "Gerando cliente Prisma..."
npx prisma generate
print_success "Cliente Prisma gerado!"

# Rodar migrations
echo ""
echo "Criando tabelas no banco de dados..."
npx prisma migrate dev --name init
print_success "Migrations executadas!"

# Baixar modelo Ollama
echo ""
if command_exists ollama; then
    echo "Deseja baixar o modelo Llama3 agora? (Requer ~4GB) (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        echo "Iniciando Ollama em background..."
        ollama serve > /dev/null 2>&1 &
        OLLAMA_PID=$!
        sleep 3
        
        echo "Baixando modelo Llama3..."
        ollama pull llama3
        print_success "Modelo Llama3 baixado!"
        
        # Matar processo do Ollama
        kill $OLLAMA_PID 2>/dev/null || true
    fi
fi

# Criar diretório de uploads
echo ""
echo "Criando diretório de uploads..."
mkdir -p uploads
print_success "Diretório de uploads criado!"

# Voltar para raiz
cd ../..

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Setup concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo "Para iniciar a aplicação:"
echo ""
echo "1. Terminal 1 - Ollama:"
echo "   ollama serve"
echo ""
echo "2. Terminal 2 - Backend:"
echo "   cd packages/backend"
echo "   npm run dev"
echo ""
echo "3. Acesse: http://localhost:3001/health"
echo ""
echo "Documentação completa: SETUP_MACOS.md"
echo ""

# Made with Bob
