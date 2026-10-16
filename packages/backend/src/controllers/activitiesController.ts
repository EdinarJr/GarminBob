import { Request, Response } from 'express';
import { storageService } from '../services/storageService';

// GET /api/activities - Buscar todas as atividades
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = storageService.getAllActivities();
    
    return res.status(200).json({
      success: true,
      count: activities.length,
      activities: activities,
    });
  } catch (error: any) {
    console.error('Erro ao buscar atividades:', error);
    return res.status(500).json({
      error: 'Erro ao buscar atividades',
      details: error.message,
    });
  }
};

// GET /api/activities/recent?days=30 - Buscar atividades recentes
export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const activities = storageService.getRecentActivities(days);
    
    return res.status(200).json({
      success: true,
      count: activities.length,
      days: days,
      activities: activities,
    });
  } catch (error: any) {
    console.error('Erro ao buscar atividades recentes:', error);
    return res.status(500).json({
      error: 'Erro ao buscar atividades recentes',
      details: error.message,
    });
  }
};

// GET /api/activities/stats - Buscar estatísticas
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = storageService.getStatistics();
    
    return res.status(200).json({
      success: true,
      statistics: stats,
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      details: error.message,
    });
  }
};

// GET /api/activities/type/:type - Buscar por tipo
export const getActivitiesByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const activities = storageService.getActivitiesByType(type);
    
    return res.status(200).json({
      success: true,
      type: type,
      count: activities.length,
      activities: activities,
    });
  } catch (error: any) {
    console.error('Erro ao buscar atividades por tipo:', error);
    return res.status(500).json({
      error: 'Erro ao buscar atividades por tipo',
      details: error.message,
    });
  }
};

// Made with Bob
