# 🚀 Como Iniciar o Garmin Training AI

## ⚠️ IMPORTANTE: Ordem de Inicialização

Você precisa iniciar **3 serviços** em **3 terminais diferentes**:

1. **Ollama** (IA)
2. **Backend** (API)
3. **Frontend** (Interface Web)

---

## 📋 Passo a Passo Completo

### Terminal 1: Iniciar Ollama (IA)

```bash
# Abra o primeiro terminal e execute:
ollama serve
```

**Deixe este terminal aberto!** Você verá algo como:
```
Ollama is running on http://localhost:11434
```

---

### Terminal 2: Iniciar Backend (API)

```bash
# Abra um SEGUNDO terminal e execute:
cd /Users/edinardeaquinojunior/Bob/Garmin
cd packages/backend
npm run dev
```

**Deixe este terminal aberto!** Você verá:
```
🏃‍♂️ Garmin Training AI - Backend
================================
🚀 Servidor rodando na porta 3001
🌍 Ambiente: development
📍 URL: http://localhost:3001
🤖 Ollama: http://localhost:11434
================================

Endpoints disponíveis:
  GET  /health              - Health check
  GET  /                    - Informações da API
  POST /api/import/garmin   - Importar dados do Garmin
```

---

### Terminal 3: Iniciar Frontend (Interface Web)

```bash
# Abra um TERCEIRO terminal e execute:
cd /Users/edinardeaquinojunior/Bob/Garmin
cd packages/web
npm run dev
```

**Deixe este terminal aberto!** Você verá:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## ✅ Verificar se Está Funcionando

### 1. Testar Backend
Abra um navegador e acesse:
```
http://localhost:3001/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. Testar Frontend
Abra um navegador e acesse:
```
http://localhost:3000
```

Você deve ver a interface de importação do Garmin Training AI.

---

## 🎯 Usar a Aplicação

1. **Acesse**: http://localhost:3000
2. **Clique** no botão para selecionar arquivo
3. **Escolha** um arquivo CSV ou JSON do Garmin
4. **Clique** em "Importar Dados"
5. **Aguarde** o processamento

---

## 🐛 Problemas Comuns

### "Backend não está rodando"
**Solução**: Verifique se o Terminal 2 está rodando e mostrando a mensagem do backend.

```bash
# Teste manualmente:
curl http://localhost:3001/health
```

### "Porta 3001 já está em uso"
**Solução**: Mate o processo que está usando a porta:

```bash
# Encontrar processo
lsof -i :3001

# Matar processo (substitua <PID> pelo número que apareceu)
kill -9 <PID>
```

### "Porta 3000 já está em uso"
**Solução**: Mate o processo que está usando a porta:

```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### "Ollama não está respondendo"
**Solução**: Reinicie o Ollama:

```bash
# Parar Ollama
pkill ollama

# Iniciar novamente
ollama serve
```

### "npm: command not found"
**Solução**: Instale o Node.js:

```bash
brew install node@20
```

---

## 📊 Formato dos Arquivos

### CSV de Atividades
```csv
Activity Type,Date,Time,Distance,Calories,Avg HR,Max HR
Running,2024-01-15,00:45:30,8.5,520,145,165
Cycling,2024-01-16,01:30:00,35.2,680,135,155
```

### JSON de Atividades
```json
[
  {
    "activityType": "Running",
    "date": "2024-01-15",
    "duration": 45.5,
    "distance": 8.5,
    "calories": 520,
    "avgHeartRate": 145,
    "maxHeartRate": 165
  }
]
```

---

## 🔄 Parar os Serviços

Para parar cada serviço, vá ao terminal correspondente e pressione:
```
Ctrl + C
```

---

## 📝 Resumo Rápido

```bash
# Terminal 1
ollama serve

# Terminal 2
cd /Users/edinardeaquinojunior/Bob/Garmin/packages/backend
npm run dev

# Terminal 3
cd /Users/edinardeaquinojunior/Bob/Garmin/packages/web
npm run dev

# Navegador
http://localhost:3000
```

---

**Pronto! Agora você pode importar seus dados do Garmin!** 🎉