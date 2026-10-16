import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AnalysisPeriod {
  start: Date;
  end: Date;
}

interface ExamTrend {
  marker: string;
  values: Array<{ date: Date; value: number }>;
  trend: 'improving' | 'stable' | 'worsening';
  changePercentage: number;
}

interface CorrelationData {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-1
  description: string;
}

export class ClinicalAnalysisService {
  /**
   * Gerar análise clínica completa
   */
  static async generateClinicalAnalysis(userId: string, period: AnalysisPeriod) {
    try {
      // Buscar todos os dados do período
      const [labExams, activities, nutritionPlans, medications, supplements, trainerWorkouts] = await Promise.all([
        prisma.labExam.findMany({
          where: {
            userId,
            examDate: {
              gte: period.start,
              lte: period.end,
            },
          },
          orderBy: { examDate: 'asc' },
        }),
        prisma.garminActivity.findMany({
          where: {
            userId,
            date: {
              gte: period.start,
              lte: period.end,
            },
          },
          orderBy: { date: 'asc' },
        }),
        prisma.nutritionPlan.findMany({
          where: {
            userId,
            startDate: {
              lte: period.end,
            },
            OR: [
              { endDate: null },
              { endDate: { gte: period.start } },
            ],
          },
        }),
        prisma.medication.findMany({
          where: {
            userId,
            startDate: {
              lte: period.end,
            },
            OR: [
              { endDate: null },
              { endDate: { gte: period.start } },
            ],
          },
        }),
        prisma.supplement.findMany({
          where: {
            userId,
            startDate: {
              lte: period.end,
            },
            OR: [
              { endDate: null },
              { endDate: { gte: period.start } },
            ],
          },
        }),
        prisma.trainerWorkout.findMany({
          where: {
            userId,
            startDate: {
              lte: period.end,
            },
            OR: [
              { endDate: null },
              { endDate: { gte: period.start } },
            ],
          },
        }),
      ]);

      // Analisar tendências dos exames
      const examTrends = this.analyzeExamTrends(labExams);

      // Identificar alertas
      const examAlerts = this.identifyExamAlerts(labExams);

      // Analisar impacto da nutrição
      const nutritionImpact = this.analyzeNutritionImpact(labExams, nutritionPlans, activities);

      // Analisar impacto dos treinos
      const trainingImpact = this.analyzeTrainingImpact(labExams, activities, trainerWorkouts);

      // Analisar efeitos dos medicamentos
      const medicationEffects = this.analyzeMedicationEffects(labExams, medications);

      // Analisar efeitos dos suplementos
      const supplementEffects = this.analyzeSupplementEffects(labExams, supplements);

      // Gerar recomendações
      const recommendations = this.generateRecommendations(
        examTrends,
        nutritionImpact,
        trainingImpact,
        medicationEffects,
        supplementEffects
      );

      // Calcular score geral de saúde
      const overallScore = this.calculateOverallScore(examTrends, examAlerts);

      // Salvar análise
      const analysis = await prisma.clinicalAnalysis.create({
        data: {
          userId,
          periodStart: period.start,
          periodEnd: period.end,
          examTrends,
          examAlerts,
          nutritionImpact,
          trainingImpact,
          medicationEffects,
          supplementEffects,
          nutritionRecommendations: recommendations.nutrition,
          trainingRecommendations: recommendations.training,
          medicalRecommendations: recommendations.medical,
          aiInsights: {}, // Será preenchido pela IA
          riskFactors: recommendations.riskFactors,
          positiveFactors: recommendations.positiveFactors,
          overallScore,
        },
      });

      return analysis;
    } catch (error) {
      console.error('Erro ao gerar análise clínica:', error);
      throw error;
    }
  }

  /**
   * Analisar tendências dos exames
   */
  private static analyzeExamTrends(labExams: any[]): ExamTrend[] {
    const markerMap = new Map<string, Array<{ date: Date; value: number }>>();

    // Agrupar valores por marcador
    labExams.forEach(exam => {
      const results = exam.results as Record<string, any>;
      Object.entries(results).forEach(([marker, value]) => {
        if (typeof value === 'number') {
          if (!markerMap.has(marker)) {
            markerMap.set(marker, []);
          }
          markerMap.get(marker)!.push({
            date: exam.examDate,
            value,
          });
        }
      });
    });

    // Analisar tendência de cada marcador
    const trends: ExamTrend[] = [];
    markerMap.forEach((values, marker) => {
      if (values.length < 2) return;

      // Ordenar por data
      values.sort((a, b) => a.date.getTime() - b.date.getTime());

      const firstValue = values[0].value;
      const lastValue = values[values.length - 1].value;
      const changePercentage = ((lastValue - firstValue) / firstValue) * 100;

      let trend: 'improving' | 'stable' | 'worsening' = 'stable';
      
      // Determinar tendência (isso pode ser refinado com base em cada marcador específico)
      if (Math.abs(changePercentage) < 5) {
        trend = 'stable';
      } else if (this.isImprovingMarker(marker, changePercentage)) {
        trend = 'improving';
      } else {
        trend = 'worsening';
      }

      trends.push({
        marker,
        values,
        trend,
        changePercentage,
      });
    });

    return trends;
  }

  /**
   * Determinar se a mudança em um marcador é uma melhora
   */
  private static isImprovingMarker(marker: string, changePercentage: number): boolean {
    // Marcadores que devem diminuir
    const shouldDecrease = [
      'glucose', 'cholesterol', 'ldl', 'triglycerides', 'bodyFat',
      'stress', 'cortisol', 'crp', 'homocysteine'
    ];

    // Marcadores que devem aumentar
    const shouldIncrease = [
      'hdl', 'testosterone', 'vitamin_d', 'hemoglobin', 'iron',
      'vo2max', 'muscleMass', 'bodyBattery'
    ];

    const markerLower = marker.toLowerCase();

    if (shouldDecrease.some(m => markerLower.includes(m))) {
      return changePercentage < 0;
    }

    if (shouldIncrease.some(m => markerLower.includes(m))) {
      return changePercentage > 0;
    }

    return false;
  }

  /**
   * Identificar alertas nos exames
   */
  private static identifyExamAlerts(labExams: any[]): string[] {
    const alerts: string[] = [];

    labExams.forEach(exam => {
      if (exam.alerts && Array.isArray(exam.alerts)) {
        alerts.push(...exam.alerts);
      }
    });

    return [...new Set(alerts)]; // Remover duplicatas
  }

  /**
   * Analisar impacto da nutrição
   */
  private static analyzeNutritionImpact(
    labExams: any[],
    nutritionPlans: any[],
    activities: any[]
  ): CorrelationData[] {
    const correlations: CorrelationData[] = [];

    if (nutritionPlans.length === 0 || labExams.length < 2) {
      return correlations;
    }

    // Analisar correlação entre calorias e performance
    const avgCalories = nutritionPlans.reduce((sum, plan) => sum + plan.dailyCalories, 0) / nutritionPlans.length;
    const avgPerformance = activities.reduce((sum, act) => sum + (act.trainingEffect || 0), 0) / activities.length;

    if (avgPerformance > 3) {
      correlations.push({
        factor: 'Ingestão Calórica',
        impact: 'positive',
        strength: 0.7,
        description: `Ingestão média de ${avgCalories} calorias está adequada para o nível de treino`,
      });
    }

    // Analisar macros
    const avgProtein = nutritionPlans.reduce((sum, plan) => sum + (plan.macros as any).protein, 0) / nutritionPlans.length;
    
    correlations.push({
      factor: 'Proteína',
      impact: avgProtein >= 1.6 ? 'positive' : 'neutral',
      strength: avgProtein >= 1.6 ? 0.8 : 0.5,
      description: `Ingestão média de ${avgProtein.toFixed(1)}g/kg de proteína`,
    });

    return correlations;
  }

  /**
   * Analisar impacto dos treinos
   */
  private static analyzeTrainingImpact(
    labExams: any[],
    activities: any[],
    trainerWorkouts: any[]
  ): CorrelationData[] {
    const correlations: CorrelationData[] = [];

    if (activities.length === 0) {
      return correlations;
    }

    // Analisar volume de treino
    const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
    const avgDuration = totalDuration / activities.length;

    correlations.push({
      factor: 'Volume de Treino',
      impact: avgDuration >= 45 && avgDuration <= 90 ? 'positive' : 'neutral',
      strength: 0.7,
      description: `Duração média de ${avgDuration.toFixed(0)} minutos por treino`,
    });

    // Analisar intensidade
    const avgHeartRate = activities
      .filter(act => act.avgHeartRate)
      .reduce((sum, act) => sum + act.avgHeartRate, 0) / activities.filter(act => act.avgHeartRate).length;

    if (avgHeartRate) {
      correlations.push({
        factor: 'Intensidade de Treino',
        impact: avgHeartRate >= 130 && avgHeartRate <= 160 ? 'positive' : 'neutral',
        strength: 0.6,
        description: `Frequência cardíaca média de ${avgHeartRate.toFixed(0)} bpm`,
      });
    }

    // Analisar consistência
    const daysWithActivity = new Set(activities.map(act => act.date.toISOString().split('T')[0])).size;
    const totalDays = Math.ceil((activities[activities.length - 1].date.getTime() - activities[0].date.getTime()) / (1000 * 60 * 60 * 24));
    const consistency = daysWithActivity / totalDays;

    correlations.push({
      factor: 'Consistência',
      impact: consistency >= 0.6 ? 'positive' : consistency >= 0.4 ? 'neutral' : 'negative',
      strength: consistency,
      description: `${(consistency * 100).toFixed(0)}% de dias com atividade`,
    });

    return correlations;
  }

  /**
   * Analisar efeitos dos medicamentos
   */
  private static analyzeMedicationEffects(labExams: any[], medications: any[]): CorrelationData[] {
    const correlations: CorrelationData[] = [];

    medications.forEach(med => {
      correlations.push({
        factor: med.name,
        impact: 'positive',
        strength: 0.8,
        description: `${med.purpose} - ${med.dosage} ${med.frequency}`,
      });
    });

    return correlations;
  }

  /**
   * Analisar efeitos dos suplementos
   */
  private static analyzeSupplementEffects(labExams: any[], supplements: any[]): CorrelationData[] {
    const correlations: CorrelationData[] = [];

    supplements.forEach(sup => {
      correlations.push({
        factor: sup.name,
        impact: 'positive',
        strength: 0.6,
        description: `${sup.purpose} - ${sup.dosage} ${sup.frequency}`,
      });
    });

    return correlations;
  }

  /**
   * Gerar recomendações personalizadas
   */
  private static generateRecommendations(
    examTrends: ExamTrend[],
    nutritionImpact: CorrelationData[],
    trainingImpact: CorrelationData[],
    medicationEffects: CorrelationData[],
    supplementEffects: CorrelationData[]
  ) {
    const nutrition: string[] = [];
    const training: string[] = [];
    const medical: string[] = [];
    const riskFactors: string[] = [];
    const positiveFactors: string[] = [];

    // Analisar tendências preocupantes
    examTrends.forEach(trend => {
      if (trend.trend === 'worsening') {
        riskFactors.push(`${trend.marker} em tendência de piora (${trend.changePercentage.toFixed(1)}%)`);
        
        // Gerar recomendações específicas
        if (trend.marker.toLowerCase().includes('glucose')) {
          nutrition.push('Reduzir carboidratos simples e aumentar fibras');
          training.push('Incluir treinos aeróbicos de intensidade moderada');
        }
        if (trend.marker.toLowerCase().includes('cholesterol')) {
          nutrition.push('Aumentar ômega-3 e reduzir gorduras saturadas');
          training.push('Aumentar volume de exercícios aeróbicos');
        }
        if (trend.marker.toLowerCase().includes('testosterone')) {
          medical.push('Consultar endocrinologista para avaliação hormonal');
          training.push('Priorizar treinos de força com cargas progressivas');
          nutrition.push('Garantir ingestão adequada de zinco e vitamina D');
        }
      } else if (trend.trend === 'improving') {
        positiveFactors.push(`${trend.marker} em melhora (${trend.changePercentage.toFixed(1)}%)`);
      }
    });

    // Analisar impactos negativos
    [...nutritionImpact, ...trainingImpact].forEach(impact => {
      if (impact.impact === 'negative') {
        riskFactors.push(impact.description);
      } else if (impact.impact === 'positive') {
        positiveFactors.push(impact.description);
      }
    });

    // Recomendações gerais se não houver específicas
    if (nutrition.length === 0) {
      nutrition.push('Manter plano nutricional atual');
    }
    if (training.length === 0) {
      training.push('Manter rotina de treinos atual');
    }
    if (medical.length === 0) {
      medical.push('Continuar acompanhamento médico regular');
    }

    return {
      nutrition,
      training,
      medical,
      riskFactors,
      positiveFactors,
    };
  }

  /**
   * Calcular score geral de saúde
   */
  private static calculateOverallScore(examTrends: ExamTrend[], examAlerts: string[]): number {
    let score = 100;

    // Penalizar por tendências de piora
    const worseningTrends = examTrends.filter(t => t.trend === 'worsening').length;
    score -= worseningTrends * 10;

    // Penalizar por alertas
    score -= examAlerts.length * 5;

    // Bonificar por tendências de melhora
    const improvingTrends = examTrends.filter(t => t.trend === 'improving').length;
    score += improvingTrends * 5;

    // Garantir que o score esteja entre 0 e 100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Obter última análise clínica
   */
  static async getLatestAnalysis(userId: string) {
    return await prisma.clinicalAnalysis.findFirst({
      where: { userId },
      orderBy: { analysisDate: 'desc' },
    });
  }

  /**
   * Obter histórico de análises
   */
  static async getAnalysisHistory(userId: string, limit: number = 10) {
    return await prisma.clinicalAnalysis.findMany({
      where: { userId },
      orderBy: { analysisDate: 'desc' },
      take: limit,
    });
  }
}

// Made with Bob