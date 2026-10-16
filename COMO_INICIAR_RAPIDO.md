# 🚀 Como Iniciar a Aplicação Rapidamente

Este guia mostra como iniciar toda a aplicação Garmin Training AI com um único clique.

## 📋 Pré-requisitos

Antes de executar os scripts de inicialização, certifique-se de ter:

- ✅ **Node.js 18+** instalado ([Download](https://nodejs.org/))
- ✅ **npm** instalado (vem com Node.js)
- ✅ **Git** instalado (opcional, mas recomendado)

## 🖥️ Para macOS/Linux

### Opção 1: Duplo Clique (Recomendado)

1. Navegue até a pasta `Garmin` no Finder/Explorador de Arquivos
2. Dê um duplo clique no arquivo `start.sh`
3. Se solicitado, permita a execução do script

### Opção 2: Terminal

```bash
cd Garmin
./start.sh
```

## 🪟 Para Windows

### Opção 1: Duplo Clique (Recomendado)

1. Navegue até a pasta `Garmin` no Explorador de Arquivos
2. Dê um duplo clique no arquivo `start.bat`
3. Aguarde a inicialização dos serviços

### Opção 2: Prompt de Comando

```cmd
cd Garmin
start.bat
```

## 🎯 O que o Script Faz

O script de inicialização automaticamente:

1. ✅ Verifica se Node.js e npm estão instalados
2. ✅ Instala todas as dependências necessárias (se ainda não instaladas)
3. ✅ Configura os arquivos de ambiente (.env)
4. ✅ Gera o Prisma Client
5. ✅ Executa migrações do banco de dados
6. ✅ Inicia o backend na porta 3001
7. ✅ Inicia o frontend na porta 3000

## 🌐 Acessando a Aplicação

Após a inicialização bem-sucedida, você pode acessar:

- **Frontend (Interface Web)**: http://localhost:3000
- **Backend (API)**: http://localhost:3001
- **Documentação da API**: http://localhost:3001/api

## 🛑 Como Parar a Aplicação

### macOS/Linux
Pressione `Ctrl + C` no terminal onde o script está rodando.

### Windows
Feche as janelas do Backend e Frontend que foram abertas.

## 📝 Logs

Os logs da aplicação são salvos em:

- `backend.log` - Logs do servidor backend
- `frontend.log` - Logs do servidor frontend

Para visualizar os logs em tempo real (macOS/Linux):

```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log
```

## ⚙️ Configuração Inicial

### Primeira Execução

Na primeira execução, o script irá:

1. Copiar `.env.example` para `.env` no backend
2. Criar `.env.local` no frontend com configurações padrão

### Configurar Variáveis de Ambiente

Edite o arquivo `packages/backend/.env` para configurar:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# OpenAI (para análises com IA)
OPENAI_API_KEY="sua-chave-aqui"

# Servidor
PORT=3001
NODE_ENV=development

# JWT (para autenticação futura)
JWT_SECRET="seu-secret-aqui"
```

## 🔧 Solução de Problemas

### Erro: "Node.js não está instalado"
- Instale o Node.js 18+ em https://nodejs.org/

### Erro: "Porta já em uso"
- Verifique se já existe outra aplicação rodando nas portas 3000 ou 3001
- Encerre os processos ou altere as portas nos arquivos de configuração

### Erro: "Falha ao iniciar o backend"
- Verifique o arquivo `backend.log` para mais detalhes
- Certifique-se de que o arquivo `.env` está configurado corretamente
- Verifique se todas as dependências foram instaladas

### Erro: "Falha ao iniciar o frontend"
- Verifique o arquivo `frontend.log` para mais detalhes
- Certifique-se de que o backend está rodando
- Verifique se o arquivo `.env.local` existe

### Erro de Permissão (macOS/Linux)
Se o script não executar, torne-o executável:

```bash
chmod +x start.sh
```

## 🔄 Reiniciar a Aplicação

Para reiniciar a aplicação:

1. Pare a aplicação (Ctrl+C ou feche as janelas)
2. Execute o script novamente

## 📚 Comandos Manuais Alternativos

Se preferir iniciar os serviços manualmente:

### Backend
```bash
cd packages/backend
npm run dev
```

### Frontend
```bash
cd packages/web
npm run dev
```

### Ambos (em terminais separados)
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:web
```

## 🎓 Próximos Passos

Após iniciar a aplicação:

1. 📖 Leia o [QUICKSTART.md](./QUICKSTART.md) para um guia completo
2. 🏥 Veja [QUICKSTART_CLINICAL.md](./QUICKSTART_CLINICAL.md) para recursos clínicos
3. 📊 Importe seus dados do Garmin em http://localhost:3000/importar
4. 📈 Visualize suas análises em http://localhost:3000/analise

## 💡 Dicas

- **Desenvolvimento**: Os servidores reiniciam automaticamente ao salvar arquivos
- **Performance**: Feche outras aplicações pesadas para melhor desempenho
- **Banco de Dados**: Use `npx prisma studio` para visualizar os dados
- **Logs**: Mantenha os logs abertos para debug em tempo real

## 🆘 Precisa de Ajuda?

- 📖 Consulte a [documentação completa](./README.md)
- 🐛 Reporte problemas no repositório do projeto
- 💬 Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para atletas e profissionais de saúde**