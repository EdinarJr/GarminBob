import { Router } from 'express';
import { ClinicalAnalysisService } from '../services/clinicalAnalysisService';

const router = Router();

/**
 * Gerar nova análise clínica
 */
router.post('/generate', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user-id'; // TODO: Pegar do JWT
    const { periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        error: 'Período de análise é obrigatório',
      });
    }

    const analysis = await ClinicalAnalysisService.generateClinicalAnalysis(userId, {
      start: new Date(periodStart),
      end: new Date(periodEnd),
    });

    return res.status(200).json({
      message: 'Análise clínica gerada com sucesso',
      analysis,
    });
  } catch (error: any) {
    console.error('Erro ao gerar análise:', error);
    return res.status(500).json({
      error: 'Erro ao gerar análise clínica',
      details: error.message,
    });
  }
});

/**
 * Obter última análise
 */
router.get('/latest', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT

    const analysis = await ClinicalAnalysisService.getLatestAnalysis(userId);

    if (!analysis) {
      return res.status(404).json({
        error: 'Nenhuma análise encontrada',
      });
    }

    return res.status(200).json({
      analysis,
    });
  } catch (error: any) {
    console.error('Erro ao buscar análise:', error);
    return res.status(500).json({
      error: 'Erro ao buscar análise',
      details: error.message,
    });
  }
});

/**
 * Obter histórico de análises
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT
    const limit = parseInt(req.query.limit as string) || 10;

    const analyses = await ClinicalAnalysisService.getAnalysisHistory(userId, limit);

    return res.status(200).json({
      analyses,
      count: analyses.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({
      error: 'Erro ao buscar histórico de análises',
      details: error.message,
    });
  }
});

/**
 * Obter análise específica
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string || 'default-user-id'; // TODO: Pegar do JWT

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const analysis = await prisma.clinicalAnalysis.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Análise não encontrada',
      });
    }

    return res.status(200).json({
      analysis,
    });
  } catch (error: any) {
    console.error('Erro ao buscar análise:', error);
    return res.status(500).json({
      error: 'Erro ao buscar análise',
      details: error.message,
    });
  }
});

export default router;

// Made with Bob