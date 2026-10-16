# 🏥 Setup - Funcionalidades Clínicas

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Ollama instalado e rodando
- Dependências do projeto instaladas

## 1. Atualizar o Banco de Dados

### Gerar o Prisma Client com os novos modelos

```bash
cd packages/backend
npx prisma generate
```

### Aplicar as migrações

```bash
npx prisma migrate dev --name add_clinical_features
```

Ou se preferir criar o banco do zero:

```bash
npx prisma db push
```

### Verificar o banco de dados

```bash
npx prisma studio
```

Isso abrirá uma interface web para visualizar as tabelas criadas:
- medications
- supplements
- lab_exams
- trainer_workouts
- clinical_analyses

## 2. Instalar Dependências Adicionais

### Backend

```bash
cd packages/backend
npm install zod axios
```

### Frontend

```bash
cd packages/web
npm install recharts
```

## 3. Configurar Ollama

### Instalar Ollama (se ainda não tiver)

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Baixar modelo de IA

```bash
# Llama 3 (recomendado)
ollama pull llama3

# Ou Mistral (alternativa)
ollama pull mistral
```

### Iniciar Ollama

```bash
ollama serve
```

O Ollama rodará em `http://localhost:11434`

### Testar Ollama

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

## 4. Configurar Variáveis de Ambiente

### Backend (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/garmin_training_ai"

# API
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 5. Iniciar os Serviços

### Terminal 1: PostgreSQL
```bash
# Se instalado via Homebrew (macOS)
brew services start postgresql@15

# Ou via Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

### Terminal 2: Ollama
```bash
ollama serve
```

### Terminal 3: Backend
```bash
cd packages/backend
npm run dev
```

### Terminal 4: Frontend
```bash
cd packages/web
npm run dev
```

## 6. Verificar Instalação

### Testar Backend

```bash
# Health check
curl http://localhost:3001/health

# Listar endpoints
curl http://localhost:3001/
```

### Testar Frontend

Abra o navegador em `http://localhost:3000`

Você deve ver os novos cards:
- 📋 Dados Clínicos
- 🏥 Análise Clínica

## 7. Importar Dados de Teste

### Criar arquivo de teste: medications.json

```json
[
  {
    "name": "Levotiroxina",
    "dosage": "50mcg",
    "frequency": "1x ao dia",
    "prescribedBy": "Dr. João Silva",
    "startDate": "2024-01-15",
    "purpose": "Hipotireoidismo",
    "active": true
  }
]
```

### Importar via API

```bash
curl -X POST http://localhost:3001/api/clinical/import/medications \
  -F "file=@medications.json" \
  -F "userId=default-user-id"
```

### Ou via Interface Web

1. Acesse `http://localhost:3000/dados-clinicos`
2. Selecione "Medicamentos"
3. Faça upload do arquivo
4. Clique em "Importar Dados"

## 8. Gerar Primeira Análise

### Via API

```bash
curl -X POST http://localhost:3001/api/analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "default-user-id",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-06-19"
  }'
```

### Via Interface Web

1. Acesse `http://localhost:3000/analise-clinica`
2. Clique em "Gerar Análise"
3. Aguarde o processamento
4. Visualize os resultados

## 9. Troubleshooting

### Erro: "Prisma Client não encontrado"

```bash
cd packages/backend
npx prisma generate
```

### Erro: "Ollama não está respondendo"

```bash
# Verificar se está rodando
curl http://localhost:11434/api/tags

# Reiniciar
pkill ollama
ollama serve
```

### Erro: "Banco de dados não conecta"

```bash
# Verificar PostgreSQL
psql -U postgres -c "SELECT version();"

# Recriar banco
dropdb garmin_training_ai
createdb garmin_training_ai
cd packages/backend
npx prisma db push
```

### Erro: "Módulo não encontrado"

```bash
# Reinstalar dependências
cd packages/backend
rm -rf node_modules package-lock.json
npm install

cd ../web
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS

Verifique se `CORS_ORIGIN` no backend está configurado corretamente:
```env
CORS_ORIGIN=http://localhost:3000
```

## 10. Estrutura de Arquivos Criados

```
Garmin/
├── packages/
│   ├── backend/
│   │   ├── prisma/
│   │   │   └── schema.prisma (atualizado)
│   │   └── src/
│   │       ├── ai/
│   │       │   └── clinicalAIService.ts (novo)
│   │       ├── controllers/
│   │       │   └── clinicalController.ts (novo)
│   │       ├── parsers/
│   │       │   └── clinicalParser.ts (novo)
│   │       ├── routes/
│   │       │   ├── clinicalRoutes.ts (novo)
│   │       │   └── analysisRoutes.ts (novo)
│   │       ├── services/
│   │       │   └── clinicalAnalysisService.ts (novo)
│   │       └── index.ts (atualizado)
│   └── web/
│       └── src/
│           └── app/
│               ├── dados-clinicos/
│               │   └── page.tsx (novo)
│               ├── analise-clinica/
│               │   └── page.tsx (novo)
│               └── page.tsx (atualizado)
├── CLINICAL_FEATURES_GUIDE.md (novo)
└── SETUP_CLINICAL_FEATURES.md (este arquivo)
```

## 11. Próximos Passos

1. ✅ Importar dados do Garmin Connect
2. ✅ Importar dados clínicos (medicamentos, exames, etc.)
3. ✅ Gerar análise clínica
4. ✅ Visualizar correlações e recomendações
5. 🔄 Atualizar análises periodicamente
6. 📊 Acompanhar evolução dos marcadores

## 12. Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Ollama](https://ollama.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 Pronto!

Seu sistema agora está completo com:
- ✅ Importação de dados do Garmin
- ✅ Importação de dados clínicos
- ✅ Análise com IA local
- ✅ Correlações inteligentes
- ✅ Recomendações personalizadas
- ✅ Gráficos históricos
- ✅ Dashboard completo

---

**Desenvolvido com Bob** 🤖