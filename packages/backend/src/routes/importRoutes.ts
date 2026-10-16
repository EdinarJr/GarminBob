import { Router } from 'express';
import multer from 'multer';
import { importGarminData } from '../controllers/importController';

const router = Router();

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    const allowedExtensions = ['.csv', '.json'];
    
    const hasValidType = allowedTypes.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidType || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Use CSV ou JSON.'));
    }
  },
});

// POST /api/import/garmin - Upload de arquivo Garmin
router.post('/garmin', upload.single('file'), importGarminData as any);

export default router;

// Made with Bob
