@echo off
REM Script para iniciar toda a aplicação Garmin Training AI no Windows
REM Autor: Bob
REM Data: 2026-06-30

setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║        🏃 GARMIN TRAINING AI - STARTUP SCRIPT        ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Verifica se está no diretório correto
if not exist "package.json" (
    echo ❌ Execute este script a partir do diretório raiz do projeto Garmin!
    pause
    exit /b 1
)

echo ℹ️  Iniciando verificações...

REM Verifica Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado!
    echo ℹ️  Instale o Node.js 18+ em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node -v

REM Verifica npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm não está instalado!
    pause
    exit /b 1
)

echo ✅ npm detectado
npm -v

REM Verifica dependências raiz
if not exist "node_modules" (
    echo ⚠️  Dependências não instaladas. Instalando...
    call npm install
    echo ✅ Dependências raiz instaladas
)

REM Verifica dependências do backend
if not exist "packages\backend\node_modules" (
    echo ⚠️  Instalando dependências do backend...
    cd packages\backend
    call npm install
    cd ..\..
    echo ✅ Dependências do backend instaladas
)

REM Verifica dependências do frontend
if not exist "packages\web\node_modules" (
    echo ⚠️  Instalando dependências do frontend...
    cd packages\web
    call npm install
    cd ..\..
    echo ✅ Dependências do frontend instaladas
)

REM Verifica arquivo .env do backend
if not exist "packages\backend\.env" (
    echo ⚠️  Arquivo .env não encontrado no backend
    if exist "packages\backend\.env.example" (
        echo ℹ️  Copiando .env.example para .env...
        copy "packages\backend\.env.example" "packages\backend\.env"
        echo ⚠️  Configure o arquivo packages\backend\.env antes de continuar!
        echo ℹ️  Pressione qualquer tecla para continuar após configurar o .env...
        pause
    ) else (
        echo ❌ Arquivo .env.example não encontrado!
        pause
        exit /b 1
    )
)

REM Verifica arquivo .env.local do frontend
if not exist "packages\web\.env.local" (
    echo ⚠️  Arquivo .env.local não encontrado no frontend
    echo ℹ️  Criando .env.local com configurações padrão...
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > packages\web\.env.local
    echo ✅ Arquivo .env.local criado
)

REM Gera Prisma Client
echo ℹ️  Gerando Prisma Client...
cd packages\backend
call npx prisma generate >nul 2>&1
echo ✅ Prisma Client gerado

REM Verifica banco de dados
echo ℹ️  Verificando banco de dados...
call npx prisma migrate status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Banco de dados precisa de migração
    echo ℹ️  Executando migrações...
    call npx prisma migrate deploy
    echo ✅ Migrações aplicadas
)
cd ..\..

REM Inicia o backend
echo ℹ️  Iniciando backend na porta 3001...
start "Backend - Garmin Training AI" cmd /k "cd packages\backend && npm run dev"

REM Aguarda o backend iniciar
echo ℹ️  Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

REM Inicia o frontend
echo ℹ️  Iniciando frontend na porta 3000...
start "Frontend - Garmin Training AI" cmd /k "cd packages\web && npm run dev"

REM Aguarda o frontend iniciar
echo ℹ️  Aguardando frontend inicializar...
timeout /t 5 /nobreak >nul

REM Mensagem de sucesso
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║           🎉 APLICAÇÃO INICIADA COM SUCESSO!         ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo ℹ️  Serviços disponíveis:
echo   🌐 Frontend:  http://localhost:3000
echo   🔧 Backend:   http://localhost:3001
echo   📊 API Docs:  http://localhost:3001/api
echo.
echo ⚠️  Feche as janelas do Backend e Frontend para encerrar os serviços
echo.
echo ℹ️  Pressione qualquer tecla para fechar esta janela...
pause >nul

@REM Made with Bob
