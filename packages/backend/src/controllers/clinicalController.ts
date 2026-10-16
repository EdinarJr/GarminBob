import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ClinicalParser } from '../parsers/clinicalParser';

const prisma = new PrismaClient();

/**
 * Importar medicamentos
 */
export const importMedications = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT

    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileType = req.file.mimetype;

    let medications;

    if (fileType === 'application/json' || req.file.originalname.endsWith('.json')) {
      medications = ClinicalParser.parseMedicationsJSON(fileContent);
    } else if (fileType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      medications = ClinicalParser.parseMedicationsCSV(fileContent);
    } else {
      return res.status(400).json({
        error: 'Formato de arquivo não suportado. Use CSV ou JSON.',
      });
    }

    // Salvar no banco de dados
    const created = await prisma.medication.createMany({
      data: medications.map(med => ({
        ...med,
        userId,
      })),
    });

    return res.status(200).json({
      message: 'Medicamentos importados com sucesso',
      count: created.count,
      medications: medications.length,
    });
  } catch (error: any) {
    console.error('Erro ao importar medicamentos:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

/**
 * Importar suplementos
 */
export const importSupplements = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT

    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileType = req.file.mimetype;

    let supplements;

    if (fileType === 'application/json' || req.file.originalname.endsWith('.json')) {
      supplements = ClinicalParser.parseSupplementsJSON(fileContent);
    } else if (fileType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      supplements = ClinicalParser.parseSupplementsCSV(fileContent);
    } else {
      return res.status(400).json({
        error: 'Formato de arquivo não suportado. Use CSV ou JSON.',
      });
    }

    // Salvar no banco de dados
    const created = await prisma.supplement.createMany({
      data: supplements.map(sup => ({
        ...sup,
        userId,
      })),
    });

    return res.status(200).json({
      message: 'Suplementos importados com sucesso',
      count: created.count,
      supplements: supplements.length,
    });
  } catch (error: any) {
    console.error('Erro ao importar suplementos:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

/**
 * Importar exames laboratoriais
 */
export const importLabExams = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT

    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileType = req.file.mimetype;

    let exams;

    if (fileType === 'application/json' || req.file.originalname.endsWith('.json')) {
      exams = ClinicalParser.parseLabExamsJSON(fileContent);
    } else {
      return res.status(400).json({
        error: 'Formato de arquivo não suportado. Use JSON.',
      });
    }

    // Salvar no banco de dados
    const created = await prisma.labExam.createMany({
      data: exams.map(exam => ({
        ...exam,
        userId,
        attachments: exam.attachments || [],
      })),
    });

    return res.status(200).json({
      message: 'Exames laboratoriais importados com sucesso',
      count: created.count,
      exams: exams.length,
      alerts: exams.flatMap(e => e.alerts),
    });
  } catch (error: any) {
    console.error('Erro ao importar exames:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

/**
 * Importar treinos do educador físico
 */
export const importTrainerWorkouts = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT

    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileType = req.file.mimetype;

    let workouts;

    if (fileType === 'application/json' || req.file.originalname.endsWith('.json')) {
      workouts = ClinicalParser.parseTrainerWorkoutsJSON(fileContent);
    } else {
      return res.status(400).json({
        error: 'Formato de arquivo não suportado. Use JSON.',
      });
    }

    // Salvar no banco de dados
    const created = await prisma.trainerWorkout.createMany({
      data: workouts.map(workout => ({
        ...workout,
        userId,
      })),
    });

    return res.status(200).json({
      message: 'Treinos importados com sucesso',
      count: created.count,
      workouts: workouts.length,
    });
  } catch (error: any) {
    console.error('Erro ao importar treinos:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

/**
 * Importar plano nutricional completo
 */
export const importNutritionPlan = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT

    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const plan = ClinicalParser.parseNutritionPlanJSON(fileContent);

    // Salvar no banco de dados
    const created = await prisma.nutritionPlan.create({
      data: {
        ...plan,
        userId,
      },
    });

    return res.status(200).json({
      message: 'Plano nutricional importado com sucesso',
      plan: created,
    });
  } catch (error: any) {
    console.error('Erro ao importar plano nutricional:', error);
    return res.status(500).json({
      error: 'Erro ao processar arquivo',
      details: error.message,
    });
  }
};

/**
 * Listar medicamentos ativos
 */
export const getActiveMedications = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT

    const medications = await prisma.medication.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return res.status(200).json({
      medications,
      count: medications.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar medicamentos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar medicamentos',
      details: error.message,
    });
  }
};

/**
 * Listar suplementos ativos
 */
export const getActiveSupplements = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT

    const supplements = await prisma.supplement.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return res.status(200).json({
      supplements,
      count: supplements.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar suplementos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar suplementos',
      details: error.message,
    });
  }
};

/**
 * Listar exames laboratoriais
 */
export const getLabExams = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT
    const examType = req.query.examType as string | undefined;

    const exams = await prisma.labExam.findMany({
      where: {
        userId,
        ...(examType && { examType }),
      },
      orderBy: {
        examDate: 'desc',
      },
    });

    return res.status(200).json({
      exams,
      count: exams.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar exames:', error);
    return res.status(500).json({
      error: 'Erro ao buscar exames',
      details: error.message,
    });
  }
};

/**
 * Obter histórico de um marcador específico
 */
export const getMarkerHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT
    const marker = req.params.marker;

    const exams = await prisma.labExam.findMany({
      where: {
        userId,
      },
      orderBy: {
        examDate: 'asc',
      },
    });

    // Extrair histórico do marcador específico
    const history = exams
      .map(exam => {
        const value = (exam.results as any)[marker];
        if (value !== undefined) {
          return {
            date: exam.examDate,
            value,
            examType: exam.examType,
            reference: (exam.referenceValues as any)[marker],
          };
        }
        return null;
      })
      .filter(item => item !== null);

    return res.status(200).json({
      marker,
      history,
      count: history.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar histórico do marcador:', error);
    return res.status(500).json({
      error: 'Erro ao buscar histórico',
      details: error.message,
    });
  }
};

// Made with Bob