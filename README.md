# 🏃‍♂️ Garmin Training AI

Sistema inteligente de análise e geração de treinos personalizados baseado em dados do Garmin Connect, plano nutricional e exames físicos, utilizando IA local (Llama/Mistral).

## 📋 Visão Geral

O Garmin Training AI é uma plataforma completa que:

- 📊 **Importa e analisa** dados de atividades do Garmin Connect
- 🥗 **Integra** informações nutricionais e exames físicos
- 🤖 **Utiliza IA local** (Ollama) para análise inteligente de dados
- 🎯 **Gera treinos personalizados** baseados em múltiplas fontes de dados
- 📱 **Multiplataforma**: Web (Next.js) + Mobile (React Native)
- 🔒 **Privacidade**: Dados processados localmente, sem envio para nuvem

## 🎯 Funcionalidades Principais

### MVP (Versão 1.0)

- ✅ Importação de dados do Garmin (CSV/JSON)
- ✅ Dashboard de visualização com gráficos interativos
- ✅ Análise de métricas de saúde e performance
- ✅ Geração de treinos semanais personalizados com IA
- ✅ Correlação entre treino, nutrição e saúde
- ✅ Interface web responsiva
- ✅ Aplicativo mobile nativo

### Futuras Versões

- 🔄 Integração direta com API do Garmin Connect
- 📈 Análise preditiva de performance
- 🏆 Sistema de metas e conquistas
- 👥 Compartilhamento com treinadores
- 📊 Relatórios avançados em PDF
- 🔔 Notificações e lembretes
- 🌐 Sincronização multi-dispositivo

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Clientes                              │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │   Web (Next.js)  │      │  Mobile (Expo)   │        │
│  └──────────────────┘      └──────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Express + TypeScript)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Import  │  │ Analysis │  │ Training │             │
│  │ Service  │  │ Service  │  │Generator │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│   PostgreSQL     │        │  Ollama (IA)     │
│   (Prisma ORM)   │        │  Llama3/Mistral  │
└──────────────────┘        └──────────────────┘
```

## 🚀 Quick Start

> **⚡ Início Rápido**: Use os scripts `start.sh` (macOS/Linux) ou `start.bat` (Windows) para iniciar toda a aplicação com um clique! Veja [COMO_INICIAR_RAPIDO.md](./COMO_INICIAR_RAPIDO.md) para detalhes.

### Pré-requisitos

- Node.js 18+
- npm (vem com Node.js)
- Ollama instalado localmente (opcional, para análises com IA)

### Início Rápido com Scripts (Recomendado) ⚡

**macOS/Linux:**
```bash
cd Garmin
./start.sh
```

**Windows:**
```cmd
cd Garmin
start.bat
```

O script automaticamente:
- ✅ Verifica dependências
- ✅ Instala pacotes necessários
- ✅ Configura o banco de dados
- ✅ Inicia backend (porta 3001) e frontend (porta 3000)

Acesse: http://localhost:3000

### Instalação com Docker (Alternativa)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/garmin-training-ai.git
cd garmin-training-ai

# Inicie todos os serviços
docker-compose up -d

# Instale o modelo de IA
ollama pull llama3
# ou
ollama pull mistral

# Acesse a aplicação
# Web: http://localhost:3000
# API: http://localhost:3001
```

### Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/garmin-training-ai.git
cd garmin-training-ai

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Configure o banco de dados
cd packages/backend
npx prisma migrate dev
npx prisma generate

# Inicie os serviços
npm run dev:backend   # Terminal 1
npm run dev:web       # Terminal 2
npm run dev:mobile    # Terminal 3 (opcional)
```

### Configuração do Ollama

```bash
# Instale o Ollama
# macOS/Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Windows: baixe de https://ollama.com/download

# Inicie o serviço
ollama serve

# Baixe o modelo (escolha um)
ollama pull llama3      # Recomendado - mais rápido
ollama pull mistral     # Alternativa
ollama pull llama3:70b  # Mais preciso, requer mais recursos
```

## 📱 Uso

### 1. Criar Conta

Acesse `http://localhost:3000` e crie sua conta.

### 2. Importar Dados do Garmin

1. Exporte seus dados do Garmin Connect:
   - Acesse [Garmin Connect](https://connect.garmin.com)
   - Vá em Atividades > Exportar para CSV
   
2. Na aplicação:
   - Clique em "Importar Dados"
   - Selecione o arquivo CSV/JSON
   - Aguarde o processamento

### 3. Adicionar Plano Nutricional (Opcional)

- Vá em "Nutrição"
- Clique em "Novo Plano"
- Preencha os dados ou importe JSON

### 4. Adicionar Exames Físicos (Opcional)

- Vá em "Exames"
- Clique em "Novo Exame"
- Preencha os resultados

### 5. Gerar Treino Personalizado

1. Clique em "Gerar Treino"
2. Defina seu objetivo (ex: "Melhorar resistência aeróbica")
3. Aguarde a análise da IA (pode levar 30-60 segundos)
4. Visualize seu plano semanal personalizado

## 📊 Formatos de Dados Suportados

### Atividades Garmin (CSV)
```csv
Activity Type,Date,Time,Distance,Calories,Avg HR,Max HR
Running,2024-01-15,00:45:30,8.5,520,145,165
```

### Métricas Diárias (CSV)
```csv
Date,Resting HR,HRV,Sleep,Body Battery,Steps
2024-01-15,58,45,7.5,75,12500
```

### Plano Nutricional (JSON)
```json
{
  "dailyCalories": 2500,
  "macros": {"protein": 150, "carbs": 300, "fat": 70},
  "meals": [...]
}
```

Veja [DATA_FORMATS.md](./DATA_FORMATS.md) para exemplos completos.

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Banco de Dados**: PostgreSQL 15 + Prisma ORM
- **IA**: Ollama (Llama 3 / Mistral)
- **Autenticação**: JWT + bcrypt

### Frontend Web
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **Estado**: Zustand + React Query

### Mobile
- **Framework**: React Native + Expo
- **UI**: React Native Paper
- **Navegação**: React Navigation

### DevOps
- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Testes**: Jest + React Testing Library

## 📁 Estrutura do Projeto

```
garmin-training-ai/
├── packages/
│   ├── backend/          # API REST
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── parsers/
│   │   │   ├── ai/
│   │   │   └── index.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   ├── web/              # Frontend Web
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── mobile/           # App Mobile
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   └── navigation/
│   │   └── app.json
│   │
│   └── shared/           # Código compartilhado
│       ├── types/
│       └── utils/
│
├── docs/                 # Documentação
├── docker-compose.yml
├── ARCHITECTURE.md       # Arquitetura detalhada
├── IMPLEMENTATION_GUIDE.md  # Guia de implementação
├── DATA_FORMATS.md       # Formatos de dados
└── README.md
```

## 🔧 Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev:backend    # Inicia backend
npm run dev:web        # Inicia web
npm run dev:mobile     # Inicia mobile

# Build
npm run build          # Build de todos os pacotes

# Testes
npm run test           # Executa todos os testes
npm run test:watch     # Modo watch

# Banco de dados
cd packages/backend
npx prisma studio      # Interface visual do banco
npx prisma migrate dev # Criar nova migration
npx prisma generate    # Gerar cliente Prisma

# Linting
npm run lint           # Verifica código
npm run lint:fix       # Corrige automaticamente
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz de cada pacote:

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/garmin_training
JWT_SECRET=your-secret-key-change-in-production
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
PORT=3001
NODE_ENV=development
```

**Web (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm run test -- --testPathPattern=parser
```

## 📖 Documentação

- [Arquitetura do Sistema](./ARCHITECTURE.md)
- [Guia de Implementação](./IMPLEMENTATION_GUIDE.md)
- [Formatos de Dados](./DATA_FORMATS.md)
- [API Documentation](./docs/API.md) (em breve)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

### Fase 1 - MVP (Atual)
- [x] Arquitetura e planejamento
- [ ] Backend API básico
- [ ] Importação de dados
- [ ] Integração com Ollama
- [ ] Frontend web
- [ ] App mobile
- [ ] Geração de treinos

### Fase 2 - Melhorias
- [ ] Integração direta com API Garmin
- [ ] Análise preditiva
- [ ] Relatórios avançados
- [ ] Sistema de notificações

### Fase 3 - Recursos Avançados
- [ ] Compartilhamento com treinadores
- [ ] Planos de treino de longo prazo
- [ ] Integração com outras plataformas (Strava, etc)
- [ ] Machine Learning para otimização

## 🐛 Problemas Conhecidos

- Ollama pode ser lento em máquinas com pouco RAM (<8GB)
- Importação de arquivos muito grandes (>10MB) pode demorar
- App mobile ainda não suporta todas as funcionalidades do web

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Trabalho Inicial* - [seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Garmin Connect pela plataforma de dados
- Ollama pela IA local
- Comunidade open-source

## 📞 Suporte

- 📧 Email: suporte@garmintrainingai.com
- 💬 Discord: [Link do servidor]
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/garmin-training-ai/issues)

---

**Nota**: Este projeto não é afiliado, associado, autorizado, endossado por, ou de qualquer forma oficialmente conectado com a Garmin Ltd. ou qualquer uma de suas subsidiárias ou afiliadas.