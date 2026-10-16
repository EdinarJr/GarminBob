import { Router } from 'express';
import {
  getAllActivities,
  getRecentActivities,
  getStatistics,
  getActivitiesByType,
} from '../controllers/activitiesController';

const router = Router();

// GET /api/activities - Buscar todas as atividades
router.get('/', getAllActivities);

// GET /api/activities/recent - Buscar atividades recentes
router.get('/recent', getRecentActivities);

// GET /api/activities/stats - Buscar estatísticas
router.get('/stats', getStatistics);

// GET /api/activities/type/:type - Buscar por tipo
router.get('/type/:type', getActivitiesByType);

export default router;

// Made with Bob
