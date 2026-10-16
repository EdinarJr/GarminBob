import { Router } from 'express';
import multer from 'multer';
import {
  importMedications,
  importSupplements,
  importLabExams,
  importTrainerWorkouts,
  importNutritionPlan,
  getActiveMedications,
  getActiveSupplements,
  getLabExams,
  getMarkerHistory,
} from '../controllers/clinicalController';

const router = Router();

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Rotas de importação
router.post('/import/medications', upload.single('file'), importMedications);
router.post('/import/supplements', upload.single('file'), importSupplements);
router.post('/import/lab-exams', upload.single('file'), importLabExams);
router.post('/import/trainer-workouts', upload.single('file'), importTrainerWorkouts);
router.post('/import/nutrition-plan', upload.single('file'), importNutritionPlan);

// Rotas de consulta
router.get('/medications', getActiveMedications);
router.get('/supplements', getActiveSupplements);
router.get('/lab-exams', getLabExams);
router.get('/lab-exams/marker/:marker/history', getMarkerHistory);

export default router;

// Made with Bob