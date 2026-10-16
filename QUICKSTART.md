# 🚀 Quick Start - Garmin Training AI

Guia rápido para rodar a aplicação no seu Mac em 5 minutos!

## ⚡ Setup Automático (Recomendado)

```bash
# 1. Execute o script de setup
./setup.sh

# 2. Siga as instruções na tela
```

O script irá:
- ✅ Verificar e instalar dependências necessárias
- ✅ Configurar banco de dados PostgreSQL
- ✅ Instalar Ollama (IA local)
- ✅ Criar arquivo .env com configurações
- ✅ Rodar migrations do banco
- ✅ Baixar modelo de IA (opcional)

## 🎯 Rodando a Aplicação

### Opção 1: Modo Desenvolvimento (3 terminais)

**Terminal 1 - Ollama (IA):**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
cd packages/backend
npm run dev
```

**Terminal 3 - Frontend (quando implementado):**
```bash
cd packages/web
npm run dev
```

### Opção 2: Docker (Mais Simples)

```bash
# Instalar Docker Desktop
brew install --cask docker

# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## ✅ Verificar se Está Funcionando

### 1. Testar Backend
```bash
curl http://localhost:3001/health
```

**Resposta esperada:**
```json
{"status":"ok","timestamp":"2024-01-15T10:00:00.000Z"}
```

### 2. Testar Ollama
```bash
curl http://localhost:11434/api/tags
```

### 3. Testar Banco de Dados
```bash
psql garmin_training -c "SELECT COUNT(*) FROM users;"
```

## 📊 Próximos Passos

1. **Importar Dados do Garmin**
   - Exporte seus dados do Garmin Connect
   - Use a API para importar

2. **Gerar Primeiro Treino**
   - Após importar atividades
   - Chame endpoint de geração

3. **Explorar Dashboard**
   - Visualize suas métricas
   - Analise tendências

## 🐛 Problemas Comuns

### "Command not found: node"
```bash
brew install node@20
```

### "Cannot connect to database"
```bash
brew services restart postgresql@15
createdb garmin_training
```

### "Ollama not responding"
```bash
# Reiniciar Ollama
pkill ollama
ollama serve
```

### "Port already in use"
```bash
# Encontrar e matar processo
lsof -i :3001
kill -9 <PID>
```

## 📚 Documentação Completa

- [Setup Detalhado para macOS](SETUP_MACOS.md)
- [Arquitetura do Sistema](ARCHITECTURE.md)
- [Guia de Implementação](IMPLEMENTATION_GUIDE.md)
- [Formatos de Dados](DATA_FORMATS.md)

## 💡 Dicas

- Use `npm run dev` para desenvolvimento com hot reload
- Use `npx prisma studio` para visualizar banco de dados
- Logs do backend aparecem no terminal
- Ollama precisa estar rodando para gerar treinos

## 🆘 Precisa de Ajuda?

1. Verifique os logs de cada serviço
2. Consulte [SETUP_MACOS.md](SETUP_MACOS.md) para troubleshooting
3. Confirme que todas as portas estão livres (3001, 5432, 11434)

---

**Pronto para começar? Execute `./setup.sh` agora!** 🎉