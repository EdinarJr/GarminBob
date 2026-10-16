import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import importRoutes from './routes/importRoutes';
import activitiesRoutes from './routes/activitiesRoutes';
import clinicalRoutes from './routes/clinicalRoutes';
import analysisRoutes from './routes/analysisRoutes';

const app = express();

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/api/import', importRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏃‍♂️ Garmin Training AI - Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs (em breve)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Iniciar servidor
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log('');
  console.log('🏃‍♂️ Garmin Training AI - Backend');
  console.log('================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🤖 Ollama: ${env.OLLAMA_URL}`);
  console.log('================================');
  console.log('');
  console.log('Endpoints disponíveis:');
  console.log('');
  console.log('  Geral:');
  console.log(`    GET  /health                                    - Health check`);
  console.log(`    GET  /                                          - Informações da API`);
  console.log('');
  console.log('  Garmin:');
  console.log(`    POST /api/import/garmin                         - Importar dados do Garmin`);
  console.log(`    GET  /api/activities                            - Buscar todas as atividades`);
  console.log(`    GET  /api/activities/recent                     - Buscar atividades recentes`);
  console.log(`    GET  /api/activities/stats                      - Buscar estatísticas`);
  console.log('');
  console.log('  Dados Clínicos:');
  console.log(`    POST /api/clinical/import/medications           - Importar medicamentos`);
  console.log(`    POST /api/clinical/import/supplements           - Importar suplementos`);
  console.log(`    POST /api/clinical/import/lab-exams             - Importar exames laboratoriais`);
  console.log(`    POST /api/clinical/import/trainer-workouts      - Importar treinos do educador físico`);
  console.log(`    POST /api/clinical/import/nutrition-plan        - Importar plano nutricional`);
  console.log(`    GET  /api/clinical/medications                  - Listar medicamentos ativos`);
  console.log(`    GET  /api/clinical/supplements                  - Listar suplementos ativos`);
  console.log(`    GET  /api/clinical/lab-exams                    - Listar exames laboratoriais`);
  console.log(`    GET  /api/clinical/lab-exams/marker/:marker/history - Histórico de marcador`);
  console.log('');
  console.log('  Análise Clínica:');
  console.log(`    POST /api/analysis/generate                     - Gerar análise clínica`);
  console.log(`    GET  /api/analysis/latest                       - Obter última análise`);
  console.log(`    GET  /api/analysis/history                      - Histórico de análises`);
  console.log(`    GET  /api/analysis/:id                          - Obter análise específica`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

export default app;

// Made with Bob
