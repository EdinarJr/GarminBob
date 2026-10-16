# Guia de Implementação - Garmin Training AI

## Fase 1: Setup Inicial do Projeto

### 1.1 Estrutura do Monorepo

```bash
# Criar estrutura de diretórios
mkdir -p garmin-training-ai/{packages/{backend,web,mobile,shared},docs}
cd garmin-training-ai

# Inicializar monorepo com npm workspaces
npm init -y

# Configurar package.json raiz
```

**package.json (raiz)**
```json
{
  "name": "garmin-training-ai",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:web": "npm run dev --workspace=web",
    "dev:mobile": "npm run dev --workspace=mobile",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0"
  }
}
```

### 1.2 Configuração TypeScript Global

**tsconfig.json (raiz)**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Fase 2: Backend - API REST

### 2.1 Setup do Backend

```bash
cd packages/backend
npm init -y
npm install express cors helmet dotenv bcrypt jsonwebtoken zod
npm install @prisma/client
npm install -D @types/express @types/cors @types/node @types/bcrypt @types/jsonwebtoken prisma tsx nodemon
```

**packages/backend/package.json**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

### 2.2 Schema Prisma

**packages/backend/prisma/schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  activities       GarminActivity[]
  metrics          GarminMetrics[]
  nutritionPlans   NutritionPlan[]
  nutritionLogs    NutritionLog[]
  physicalExams    PhysicalExam[]
  generatedTrainings GeneratedTraining[]

  @@map("users")
}

model GarminActivity {
  id              String   @id @default(uuid())
  userId          String
  activityType    String
  date            DateTime
  duration        Int      // minutos
  distance        Float?   // km
  calories        Int?
  avgHeartRate    Int?
  maxHeartRate    Int?
  avgPace         Float?   // min/km
  elevation       Float?   // metros
  trainingEffect  Float?
  vo2max          Float?
  rawData         Json?
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@map("garmin_activities")
}

model GarminMetrics {
  id               String   @id @default(uuid())
  userId           String
  date             DateTime
  restingHeartRate Int?
  hrv              Int?     // variabilidade
  sleepHours       Float?
  sleepQuality     Int?     // 0-100
  stress           Int?     // 0-100
  bodyBattery      Int?     // 0-100
  steps            Int?
  createdAt        DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
  @@map("garmin_metrics")
}

model NutritionPlan {
  id            String    @id @default(uuid())
  userId        String
  name          String
  startDate     DateTime
  endDate       DateTime?
  dailyCalories Int
  macros        Json      // {protein, carbs, fat}
  meals         Json      // array de refeições
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, startDate])
  @@map("nutrition_plans")
}

model NutritionLog {
  id        String   @id @default(uuid())
  userId    String
  date      DateTime
  meal      String
  calories  Int
  protein   Float
  carbs     Float
  fat       Float
  notes     String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@map("nutrition_logs")
}

model PhysicalExam {
  id           String   @id @default(uuid())
  userId       String
  examDate     DateTime
  examType     String
  results      Json     // dados estruturados do exame
  doctorNotes  String?
  attachments  String[] // URLs dos arquivos
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, examDate])
  @@map("physical_exams")
}

model GeneratedTraining {
  id                   String   @id @default(uuid())
  userId               String
  generatedAt          DateTime @default(now())
  weekStartDate        DateTime
  weekEndDate          DateTime
  goal                 String
  aiAnalysis           Json     // análise da IA
  weeklyPlan           Json     // plano semanal detalhado
  nutritionAdjustments Json?
  status               String   @default("pending") // pending, active, completed
  userFeedback         String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, weekStartDate])
  @@map("generated_trainings")
}
```

### 2.3 Estrutura do Backend

**packages/backend/src/index.ts**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import importRoutes from './routes/import';
import activityRoutes from './routes/activities';
import trainingRoutes from './routes/training';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**packages/backend/src/middleware/auth.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### 2.4 Parser de Dados Garmin

**packages/backend/src/parsers/garminParser.ts**
```typescript
import { parse } from 'csv-parse/sync';

export interface GarminActivityData {
  activityType: string;
  date: Date;
  duration: number;
  distance?: number;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgPace?: number;
  elevation?: number;
  trainingEffect?: number;
  vo2max?: number;
}

export class GarminParser {
  static parseActivitiesCSV(csvContent: string): GarminActivityData[] {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any) => ({
      activityType: record['Activity Type'] || record['Tipo de Atividade'],
      date: new Date(record['Date'] || record['Data']),
      duration: this.parseDuration(record['Time'] || record['Tempo']),
      distance: parseFloat(record['Distance'] || record['Distância']) || undefined,
      calories: parseInt(record['Calories'] || record['Calorias']) || undefined,
      avgHeartRate: parseInt(record['Avg HR'] || record['FC Média']) || undefined,
      maxHeartRate: parseInt(record['Max HR'] || record['FC Máxima']) || undefined,
      avgPace: this.parsePace(record['Avg Pace'] || record['Ritmo Médio']),
      elevation: parseFloat(record['Elev Gain'] || record['Ganho de Elevação']) || undefined,
      trainingEffect: parseFloat(record['Training Effect'] || record['Efeito de Treino']) || undefined,
      vo2max: parseFloat(record['VO2 Max']) || undefined
    }));
  }

  static parseMetricsCSV(csvContent: string) {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any) => ({
      date: new Date(record['Date'] || record['Data']),
      restingHeartRate: parseInt(record['Resting HR'] || record['FC Repouso']) || undefined,
      hrv: parseInt(record['HRV']) || undefined,
      sleepHours: parseFloat(record['Sleep'] || record['Sono']) || undefined,
      sleepQuality: parseInt(record['Sleep Quality'] || record['Qualidade do Sono']) || undefined,
      stress: parseInt(record['Stress'] || record['Estresse']) || undefined,
      bodyBattery: parseInt(record['Body Battery'] || record['Bateria Corporal']) || undefined,
      steps: parseInt(record['Steps'] || record['Passos']) || undefined
    }));
  }

  private static parseDuration(timeStr: string): number {
    // Converte "1:30:45" para minutos
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    }
    return 0;
  }

  private static parsePace(paceStr: string): number | undefined {
    // Converte "5:30" (min/km) para número
    if (!paceStr) return undefined;
    const parts = paceStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] + parts[1] / 60;
    }
    return undefined;
  }
}
```

### 2.5 Serviço de IA (Ollama)

**packages/backend/src/services/aiService.ts**
```typescript
import axios from 'axios';

export interface TrainingAnalysis {
  currentFitness: string;
  recommendations: string[];
  warnings: string[];
  weeklyPlan: any[];
}

export class AIService {
  private ollamaUrl: string;
  private model: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3';
  }

  async analyzeTrainingData(data: {
    activities: any[];
    metrics: any[];
    nutrition?: any;
    exam?: any;
    goal: string;
  }): Promise<TrainingAnalysis> {
    const prompt = this.buildAnalysisPrompt(data);

    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
        format: 'json'
      });

      return JSON.parse(response.data.response);
    } catch (error) {
      console.error('Erro ao chamar Ollama:', error);
      throw new Error('Falha na análise de IA');
    }
  }

  private buildAnalysisPrompt(data: any): string {
    return `
Você é um especialista em treinamento esportivo, fisiologia do exercício e nutrição.

DADOS DO ATLETA:

Atividades Recentes (últimas 4 semanas):
${JSON.stringify(data.activities, null, 2)}

Métricas de Saúde:
${JSON.stringify(data.metrics, null, 2)}

${data.nutrition ? `Plano Nutricional:\n${JSON.stringify(data.nutrition, null, 2)}` : ''}

${data.exam ? `Último Exame Físico:\n${JSON.stringify(data.exam, null, 2)}` : ''}

Objetivo do Atleta: ${data.goal}

TAREFA:
Analise todos os dados fornecidos e crie um plano de treino personalizado para a próxima semana.

Responda APENAS com um JSON válido no seguinte formato:
{
  "currentFitness": "Avaliação detalhada do nível atual de condicionamento",
  "recommendations": [
    "Recomendação 1",
    "Recomendação 2",
    "Recomendação 3"
  ],
  "warnings": [
    "Alerta 1 (se houver)",
    "Alerta 2 (se houver)"
  ],
  "weeklyPlan": [
    {
      "day": 1,
      "dayName": "Segunda-feira",
      "workouts": [
        {
          "type": "Corrida",
          "duration": 45,
          "intensity": "Moderada",
          "description": "Corrida contínua em ritmo confortável",
          "targetHeartRate": {"min": 130, "max": 150},
          "notes": "Foque na técnica e respiração"
        }
      ],
      "nutrition": "Recomendações nutricionais específicas para este dia"
    }
  ]
}

Considere:
1. Progressão gradual de carga
2. Equilíbrio entre treino e recuperação
3. Variação de estímulos
4. Prevenção de lesões
5. Alinhamento com dados nutricionais e de saúde
6. Objetivo específico do atleta
`;
  }

  async generateNutritionAdvice(data: {
    activities: any[];
    currentNutrition: any;
    goal: string;
  }): Promise<any> {
    const prompt = `
Você é um nutricionista esportivo especializado.

Dados de treino: ${JSON.stringify(data.activities)}
Nutrição atual: ${JSON.stringify(data.currentNutrition)}
Objetivo: ${data.goal}

Forneça ajustes nutricionais específicos em formato JSON:
{
  "adjustments": ["ajuste 1", "ajuste 2"],
  "dailyCalories": 2500,
  "macros": {"protein": 150, "carbs": 300, "fat": 70},
  "timing": "Recomendações de timing de nutrientes"
}
`;

    const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
      model: this.model,
      prompt,
      stream: false,
      format: 'json'
    });

    return JSON.parse(response.data.response);
  }
}
```

## Fase 3: Frontend Web (Next.js)

### 3.1 Setup do Frontend

```bash
cd packages/web
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @tanstack/react-query axios zustand recharts
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react date-fns
```

### 3.2 Estrutura de Páginas

**packages/web/app/layout.tsx**
```typescript
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Garmin Training AI',
  description: 'Treinos personalizados com IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**packages/web/app/dashboard/page.tsx**
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ActivityChart } from '@/components/ActivityChart'
import { MetricsOverview } from '@/components/MetricsOverview'
import { TrainingCard } from '@/components/TrainingCard'

export default function DashboardPage() {
  const { data: overview } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/overview').then(res => res.data)
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricsOverview data={overview?.metrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart activities={overview?.activities} />
        <TrainingCard training={overview?.currentTraining} />
      </div>
    </div>
  )
}
```

## Fase 4: Mobile (React Native + Expo)

### 4.1 Setup Mobile

```bash
cd packages/mobile
npx create-expo-app@latest . --template blank-typescript
npm install @react-navigation/native @react-navigation/stack
npm install react-native-paper react-native-safe-area-context
npm install @tanstack/react-query axios zustand
npm install expo-document-picker expo-file-system
```

### 4.2 Estrutura de Navegação

**packages/mobile/src/navigation/AppNavigator.tsx**
```typescript
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen } from '../screens/HomeScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { ImportScreen } from '../screens/ImportScreen'
import { TrainingScreen } from '../screens/TrainingScreen'

const Stack = createStackNavigator()

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Import" component={ImportScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## Fase 5: Docker e Deploy

### 5.1 Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: garmin
      POSTGRES_PASSWORD: garmin123
      POSTGRES_DB: garmin_training
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    command: serve

  backend:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://garmin:garmin123@postgres:5432/garmin_training
      OLLAMA_URL: http://ollama:11434
      JWT_SECRET: your-secret-key-change-in-production
    depends_on:
      - postgres
      - ollama

  web:
    build:
      context: ./packages/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend

volumes:
  postgres_data:
  ollama_data:
```

### 5.2 Dockerfile Backend

**packages/backend/Dockerfile**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

## Próximos Passos de Implementação

1. **Iniciar com Backend**: Implementar API básica e parsers
2. **Configurar Banco de Dados**: Rodar migrations do Prisma
3. **Integrar Ollama**: Testar prompts e respostas
4. **Desenvolver Frontend**: Dashboard e importação
5. **Criar App Mobile**: Versão básica funcional
6. **Testes**: Unitários e integração
7. **Deploy**: Ambiente de produção

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev:backend    # Inicia backend
npm run dev:web        # Inicia web
npm run dev:mobile     # Inicia mobile

# Banco de dados
cd packages/backend
npx prisma migrate dev --name init
npx prisma studio

# Ollama (instalar primeiro)
ollama pull llama3
ollama pull mistral
ollama serve

# Docker
docker-compose up -d
docker-compose logs -f backend