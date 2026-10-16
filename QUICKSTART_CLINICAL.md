# 🚀 Guia Rápido - Funcionalidades Clínicas

## ⚠️ Problema Comum: Erro de Permissão do Banco de Dados

Se você receber o erro: `User 'garmin' was denied access on the database`

### Solução 1: Conceder Permissões ao Usuário

```bash
# Conectar ao PostgreSQL como superusuário
psql -U postgres

# Dentro do psql, execute:
GRANT ALL PRIVILEGES ON DATABASE garmin_training TO garmin;
GRANT ALL PRIVILEGES ON SCHEMA public TO garmin;
ALTER DATABASE garmin_training OWNER TO garmin;

# Sair do psql
\q
```

### Solução 2: Usar Usuário Postgres Diretamente

Edite o arquivo `.env` em `packages/backend/.env`:

```env
# Trocar de:
DATABASE_URL="postgresql://garmin:garmin@localhost:5432/garmin_training"

# Para:
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/garmin_training"
```

### Solução 3: Recriar Banco e Usuário

```bash
# Conectar como postgres
psql -U postgres

# Recriar usuário e banco
DROP DATABASE IF EXISTS garmin_training;
DROP USER IF EXISTS garmin;
CREATE USER garmin WITH PASSWORD 'garmin';
CREATE DATABASE garmin_training OWNER garmin;
GRANT ALL PRIVILEGES ON DATABASE garmin_training TO garmin;

# Sair
\q
```

## 📋 Passo a Passo Correto

### 1. Verificar PostgreSQL

```bash
# Verificar se está rodando
psql -U postgres -c "SELECT version();"

# Se não estiver, iniciar
brew services start postgresql@15
# ou
sudo systemctl start postgresql
```

### 2. Configurar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco e usuário (se necessário)
CREATE DATABASE garmin_training;
CREATE USER garmin WITH PASSWORD 'garmin';
GRANT ALL PRIVILEGES ON DATABASE garmin_training TO garmin;
ALTER DATABASE garmin_training OWNER TO garmin;

# Sair
\q
```

### 3. Gerar Prisma Client

```bash
# A partir do diretório raiz do projeto (Garmin/)
cd packages/backend
npx prisma generate
```

### 4. Aplicar Schema ao Banco

```bash
# Ainda em packages/backend
npx prisma db push
```

Você deve ver:
```
✔ Your database is now in sync with your Prisma schema.
```

### 5. Verificar Tabelas Criadas

```bash
npx prisma studio
```

Isso abrirá uma interface web onde você pode ver as novas tabelas:
- ✅ medications
- ✅ supplements
- ✅ lab_exams
- ✅ trainer_workouts
- ✅ clinical_analyses

### 6. Instalar Dependências Faltantes

```bash
# Backend
cd packages/backend
npm install zod axios

# Frontend
cd ../web
npm install recharts
```

### 7. Iniciar Ollama (Opcional mas Recomendado)

```bash
# Em um terminal separado
ollama serve

# Em outro terminal, baixar modelo
ollama pull llama3
```

### 8. Iniciar Serviços

**Terminal 1 - Backend:**
```bash
cd packages/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd packages/web
npm run dev
```

### 9. Testar Importação

Acesse: `http://localhost:3000/dados-clinicos`

Use os arquivos de exemplo em `examples/clinical-data-examples.json`

Para testar via API:
```bash
# Extrair apenas medicamentos do arquivo de exemplo
echo '[
  {
    "name": "Levotiroxina Sódica",
    "dosage": "50mcg",
    "frequency": "1x ao dia",
    "prescribedBy": "Dr. João Silva",
    "startDate": "2024-01-15",
    "purpose": "Hipotireoidismo",
    "active": true
  }
]' > test-medications.json

# Importar
curl -X POST http://localhost:3001/api/clinical/import/medications \
  -F "file=@test-medications.json" \
  -F "userId=default-user-id"
```

### 10. Gerar Análise

Acesse: `http://localhost:3000/analise-clinica`

Clique em "Gerar Análise"

## ✅ Verificação Final

Execute estes comandos para confirmar que tudo está funcionando:

```bash
# 1. Backend está rodando?
curl http://localhost:3001/health

# 2. Endpoints clínicos estão disponíveis?
curl http://localhost:3001/

# 3. Frontend está acessível?
curl http://localhost:3000/
```

## 🎯 Endpoints Disponíveis

### Importação
- `POST /api/clinical/import/medications`
- `POST /api/clinical/import/supplements`
- `POST /api/clinical/import/lab-exams`
- `POST /api/clinical/import/trainer-workouts`
- `POST /api/clinical/import/nutrition-plan`

### Consulta
- `GET /api/clinical/medications`
- `GET /api/clinical/supplements`
- `GET /api/clinical/lab-exams`
- `GET /api/clinical/lab-exams/marker/:marker/history`

### Análise
- `POST /api/analysis/generate`
- `GET /api/analysis/latest`
- `GET /api/analysis/history`
- `GET /api/analysis/:id`

## 🆘 Problemas Comuns

### "Cannot find module '@prisma/client'"
```bash
cd packages/backend
npx prisma generate
npm install
```

### "Ollama não está respondendo"
```bash
# Verificar se está rodando
curl http://localhost:11434/api/tags

# Se não, iniciar
ollama serve
```

### "CORS error no frontend"
Verifique o `.env` do backend:
```env
CORS_ORIGIN=http://localhost:3000
```

### "Erro ao importar arquivo"
- Verifique se o formato JSON está correto
- Use os exemplos em `examples/clinical-data-examples.json`
- Verifique os logs do backend no terminal

## 📚 Documentação Completa

- `CLINICAL_FEATURES_GUIDE.md` - Guia detalhado de funcionalidades
- `SETUP_CLINICAL_FEATURES.md` - Setup completo
- `examples/clinical-data-examples.json` - Exemplos de dados

## 🎉 Pronto!

Agora você pode:
1. ✅ Importar dados clínicos
2. ✅ Visualizar histórico de exames
3. ✅ Gerar análises com correlações
4. ✅ Receber recomendações personalizadas
5. ✅ Acompanhar evolução de marcadores

---

**Desenvolvido com Bob** 🤖