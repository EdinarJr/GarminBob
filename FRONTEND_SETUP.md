# 🎨 Setup do Frontend - Garmin Training AI

## ✅ Frontend Criado com Sucesso!

O frontend web foi criado com Next.js 14 e está pronto para uso.

## 🚀 Como Iniciar

### 1. Instalar Dependências (se ainda não instalou)

```bash
cd packages/web
npm install
```

### 2. Iniciar o Frontend

Abra um **novo terminal** e execute:

```bash
cd packages/web
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

### 3. Manter o Backend Rodando

Certifique-se de que o backend ainda está rodando no outro terminal:

```bash
cd packages/backend
npm run dev
```

O backend deve estar em: **http://localhost:3001**

## 📋 Como Usar

### Importar Dados do Garmin

1. Acesse **http://localhost:3000** no seu navegador
2. Você verá a interface de importação
3. Clique no botão para selecionar um arquivo CSV ou JSON
4. Clique em "Importar Dados"
5. Aguarde o processamento

### Formatos Suportados

#### CSV de Atividades
```csv
Activity Type,Date,Time,Distance,Calories,Avg HR,Max HR
Running,2024-01-15,00:45:30,8.5,520,145,165
Cycling,2024-01-16,01:30:00,35.2,680,135,155
```

#### JSON de Atividades
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

## 🎯 Estrutura Criada

```
packages/web/
├── src/
│   └── app/
│       ├── layout.tsx      # Layout principal com navegação
│       ├── page.tsx        # Página inicial com upload
│       └── globals.css     # Estilos globais
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

## 🔧 Funcionalidades Implementadas

- ✅ Interface de upload de arquivos
- ✅ Suporte para CSV e JSON
- ✅ Validação de arquivos
- ✅ Feedback visual (sucesso/erro)
- ✅ Instruções de uso
- ✅ Design responsivo com Tailwind CSS
- ✅ Integração com backend

## 🐛 Troubleshooting

### Porta 3000 já está em uso
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Erro de conexão com backend
- Verifique se o backend está rodando em http://localhost:3001
- Verifique o arquivo `.env.local` em `packages/web/`
- Deve conter: `NEXT_PUBLIC_API_URL=http://localhost:3001`

### Dependências não instaladas
```bash
cd packages/web
rm -rf node_modules package-lock.json
npm install
```

## 📱 Próximos Passos

1. **Dashboard**: Visualizar dados importados
2. **Gráficos**: Análise visual de métricas
3. **IA**: Geração de treinos personalizados
4. **Perfil**: Gerenciar dados pessoais

## 🎨 Personalização

### Cores
Edite `packages/web/tailwind.config.ts` para mudar o tema de cores.

### Layout
Edite `packages/web/src/app/layout.tsx` para modificar a navegação.

### Página Inicial
Edite `packages/web/src/app/page.tsx` para customizar a interface.

---

**Pronto para começar!** 🎉

Execute `npm run dev` em `packages/web` e acesse http://localhost:3000