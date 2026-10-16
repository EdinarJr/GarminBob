import { Request, Response } from 'express';
import { GarminParser } from '../parsers/garminParser';
import { storageService } from '../services/storageService';

export const importGarminData = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileType = req.file.mimetype;

    let activities;

    // Parse baseado no tipo de arquivo
    if (fileType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      activities = GarminParser.parseActivitiesCSV(fileContent);
    } else if (fileType === 'application/json' || req.file.originalname.endsWith('.json')) {
      activities = GarminParser.parseActivitiesJSON(fileContent);
    } else {
      return res.status(400).json({
        error: 'Formato de arquivo não suportado. Use CSV ou JSON.',
      });
    }

    // Validar atividades
    const validationResults = activities.map(activity => GarminParser.validateActivity(activity));
    const invalidActivities = validationResults.filter(result => !result.valid);

    if (invalidActivities.length > 0) {
      console.warn(`${invalidActivities.length} atividades com problemas de validação`);
    }

    // Salvar atividades no armazenamento
    storageService.saveActivities(activities);

    return res.status(200).json({
      message: 'Dados importados com sucesso',
      activitiesCount: activities.length,
      validActivities: activities.length - invalidActivities.length,
      invalidActivities: invalidActivities.length,
      totalStored: storageService.count(),
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (error: any) {
    console.error('Erro ao importar dados:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

// Made with Bob
