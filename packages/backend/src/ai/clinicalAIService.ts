import axios from 'axios';
import { env } from '../config/env';

interface AIAnalysisInput {
  examTrends: any[];
  nutritionData: any[];
  trainingData: any[];
  medications: any[];
  supplements: any[];
  userProfile: {
    age?: number;
    gender?: string;
    goals?: string[];
  };
}

interface AIRecommendations {
  nutritionRecommendations: string[];
  trainingRecommendations: string[];
  medicalRecommendations: string[];
  insights: string[];
  riskFactors: string[];
  positiveFactors: string[];
}

export class ClinicalAIService {
  private static ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434';
  private static model = 'llama3'; // ou 'mistral'

  /**
   * Gerar análise e recomendações usando IA
   */
  static async generateAIRecommendations(input: AIAnalysisInput): Promise<AIRecommendations> {
    try {
      const prompt = this.buildAnalysisPrompt(input);
      
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      });

      const aiResponse = response.data.response;
      return this.parseAIResponse(aiResponse);
    } catch (error: any) {
      console.error('Erro ao gerar recomendações com IA:', error.message);
      
      // Fallback para recomendações básicas se a IA falhar
      return this.generateFallbackRecommendations(input);
    }
  }

  /**
   * Construir prompt para análise clínica
   */
  private static buildAnalysisPrompt(input: AIAnalysisInput): string {
    const { examTrends, nutritionData, trainingData, medications, supplements, userProfile } = input;

    return `Você é um especialista em medicina esportiva, nutrição e treinamento físico. Analise os dados abaixo e forneça recomendações personalizadas.

PERFIL DO USUÁRIO:
${userProfile.age ? `- Idade: ${userProfile.age} anos` : ''}
${userProfile.gender ? `- Gênero: ${userProfile.gender}` : ''}
${userProfile.goals ? `- Objetivos: ${userProfile.goals.join(', ')}` : ''}

TENDÊNCIAS DOS EXAMES LABORATORIAIS:
${this.formatExamTrends(examTrends)}

DADOS NUTRICIONAIS:
${this.formatNutritionData(nutritionData)}

DADOS DE TREINO:
${this.formatTrainingData(trainingData)}

MEDICAMENTOS EM USO:
${this.formatMedications(medications)}

SUPLEMENTOS EM USO:
${this.formatSupplements(supplements)}

Com base nestes dados, forneça uma análise completa no seguinte formato JSON:

{
  "nutritionRecommendations": [
    "Recomendação nutricional 1",
    "Recomendação nutricional 2"
  ],
  "trainingRecommendations": [
    "Recomendação de treino 1",
    "Recomendação de treino 2"
  ],
  "medicalRecommendations": [
    "Recomendação médica 1",
    "Recomendação médica 2"
  ],
  "insights": [
    "Insight importante 1",
    "Insight importante 2"
  ],
  "riskFactors": [
    "Fator de risco identificado 1",
    "Fator de risco identificado 2"
  ],
  "positiveFactors": [
    "Fator positivo identificado 1",
    "Fator positivo identificado 2"
  ]
}

IMPORTANTE: 
- Seja específico e prático nas recomendações
- Considere as interações entre treino, nutrição e medicamentos
- Identifique correlações importantes entre os dados
- Priorize a segurança e saúde do usuário
- Forneça recomendações baseadas em evidências científicas`;
  }

  /**
   * Formatar tendências dos exames
   */
  private static formatExamTrends(trends: any[]): string {
    if (!trends || trends.length === 0) {
      return 'Nenhum dado de exame disponível';
    }

    return trends.map(trend => {
      const direction = trend.trend === 'improving' ? '↑ Melhorando' : 
                       trend.trend === 'worsening' ? '↓ Piorando' : 
                       '→ Estável';
      return `- ${trend.marker}: ${direction} (${trend.changePercentage.toFixed(1)}%)`;
    }).join('\n');
  }

  /**
   * Formatar dados nutricionais
   */
  private static formatNutritionData(nutrition: any[]): string {
    if (!nutrition || nutrition.length === 0) {
      return 'Nenhum dado nutricional disponível';
    }

    const latest = nutrition[nutrition.length - 1];
    return `- Calorias diárias: ${latest.dailyCalories} kcal
- Proteína: ${latest.macros?.protein || 'N/A'}g
- Carboidratos: ${latest.macros?.carbs || 'N/A'}g
- Gorduras: ${latest.macros?.fat || 'N/A'}g`;
  }

  /**
   * Formatar dados de treino
   */
  private static formatTrainingData(training: any[]): string {
    if (!training || training.length === 0) {
      return 'Nenhum dado de treino disponível';
    }

    const totalDuration = training.reduce((sum, t) => sum + (t.duration || 0), 0);
    const avgDuration = totalDuration / training.length;
    const avgHeartRate = training
      .filter(t => t.avgHeartRate)
      .reduce((sum, t) => sum + t.avgHeartRate, 0) / training.filter(t => t.avgHeartRate).length;

    return `- Total de treinos: ${training.length}
- Duração média: ${avgDuration.toFixed(0)} minutos
- Frequência cardíaca média: ${avgHeartRate ? avgHeartRate.toFixed(0) : 'N/A'} bpm
- Tipos de atividade: ${[...new Set(training.map(t => t.activityType))].join(', ')}`;
  }

  /**
   * Formatar medicamentos
   */
  private static formatMedications(medications: any[]): string {
    if (!medications || medications.length === 0) {
      return 'Nenhum medicamento em uso';
    }

    return medications.map(med => 
      `- ${med.name} (${med.dosage}) - ${med.purpose}`
    ).join('\n');
  }

  /**
   * Formatar suplementos
   */
  private static formatSupplements(supplements: any[]): string {
    if (!supplements || supplements.length === 0) {
      return 'Nenhum suplemento em uso';
    }

    return supplements.map(sup => 
      `- ${sup.name} (${sup.dosage}) - ${sup.purpose}`
    ).join('\n');
  }

  /**
   * Parse da resposta da IA
   */
  private static parseAIResponse(response: string): AIRecommendations {
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          nutritionRecommendations: parsed.nutritionRecommendations || [],
          trainingRecommendations: parsed.trainingRecommendations || [],
          medicalRecommendations: parsed.medicalRecommendations || [],
          insights: parsed.insights || [],
          riskFactors: parsed.riskFactors || [],
          positiveFactors: parsed.positiveFactors || [],
        };
      }

      // Se não encontrar JSON, tentar extrair informações do texto
      return this.extractRecommendationsFromText(response);
    } catch (error) {
      console.error('Erro ao fazer parse da resposta da IA:', error);
      return {
        nutritionRecommendations: [],
        trainingRecommendations: [],
        medicalRecommendations: [],
        insights: [response.substring(0, 500)], // Primeiros 500 caracteres como insight
        riskFactors: [],
        positiveFactors: [],
      };
    }
  }

  /**
   * Extrair recomendações do texto quando JSON não está disponível
   */
  private static extractRecommendationsFromText(text: string): AIRecommendations {
    const recommendations: AIRecommendations = {
      nutritionRecommendations: [],
      trainingRecommendations: [],
      medicalRecommendations: [],
      insights: [],
      riskFactors: [],
      positiveFactors: [],
    };

    // Dividir texto em linhas
    const lines = text.split('\n').filter(line => line.trim());

    let currentSection = '';
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('nutrição') || lowerLine.includes('nutrition')) {
        currentSection = 'nutrition';
      } else if (lowerLine.includes('treino') || lowerLine.includes('training')) {
        currentSection = 'training';
      } else if (lowerLine.includes('médic') || lowerLine.includes('medical')) {
        currentSection = 'medical';
      } else if (lowerLine.includes('risco') || lowerLine.includes('risk')) {
        currentSection = 'risk';
      } else if (lowerLine.includes('positiv') || lowerLine.includes('benefit')) {
        currentSection = 'positive';
      } else if (line.trim().startsWith('-') || line.trim().match(/^\d+\./)) {
        const recommendation = line.trim().replace(/^[-\d.]\s*/, '');
        
        switch (currentSection) {
          case 'nutrition':
            recommendations.nutritionRecommendations.push(recommendation);
            break;
          case 'training':
            recommendations.trainingRecommendations.push(recommendation);
            break;
          case 'medical':
            recommendations.medicalRecommendations.push(recommendation);
            break;
          case 'risk':
            recommendations.riskFactors.push(recommendation);
            break;
          case 'positive':
            recommendations.positiveFactors.push(recommendation);
            break;
          default:
            recommendations.insights.push(recommendation);
        }
      }
    });

    return recommendations;
  }

  /**
   * Gerar recomendações básicas como fallback
   */
  private static generateFallbackRecommendations(input: AIAnalysisInput): AIRecommendations {
    const recommendations: AIRecommendations = {
      nutritionRecommendations: [
        'Manter uma dieta balanceada com macronutrientes adequados',
        'Garantir hidratação adequada (2-3L de água por dia)',
        'Consumir proteínas de qualidade após os treinos',
      ],
      trainingRecommendations: [
        'Manter consistência nos treinos',
        'Respeitar períodos de recuperação',
        'Variar intensidade e volume de treino',
      ],
      medicalRecommendations: [
        'Realizar exames de controle periodicamente',
        'Consultar médico em caso de sintomas incomuns',
        'Manter acompanhamento com profissionais de saúde',
      ],
      insights: [
        'Análise gerada com dados limitados',
        'Recomenda-se consulta com profissionais especializados',
      ],
      riskFactors: [],
      positiveFactors: [],
    };

    // Adicionar recomendações baseadas em tendências
    if (input.examTrends) {
      input.examTrends.forEach(trend => {
        if (trend.trend === 'worsening') {
          recommendations.riskFactors.push(
            `${trend.marker} em tendência de piora - requer atenção`
          );
        } else if (trend.trend === 'improving') {
          recommendations.positiveFactors.push(
            `${trend.marker} em melhora - continue o bom trabalho`
          );
        }
      });
    }

    return recommendations;
  }

  /**
   * Gerar insights sobre correlações
   */
  static async generateCorrelationInsights(
    examData: any[],
    nutritionData: any[],
    trainingData: any[]
  ): Promise<string[]> {
    try {
      const prompt = `Analise as correlações entre os seguintes dados e forneça insights importantes:

EXAMES: ${JSON.stringify(examData, null, 2)}
NUTRIÇÃO: ${JSON.stringify(nutritionData, null, 2)}
TREINOS: ${JSON.stringify(trainingData, null, 2)}

Forneça 3-5 insights sobre correlações importantes entre estes dados.
Formato: lista de insights, um por linha, começando com "-"`;

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
      });

      const insights = response.data.response
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-'))
        .map((line: string) => line.trim().replace(/^-\s*/, ''));

      return insights.length > 0 ? insights : ['Análise de correlações em andamento'];
    } catch (error) {
      console.error('Erro ao gerar insights de correlação:', error);
      return ['Não foi possível gerar insights de correlação no momento'];
    }
  }
}

// Made with Bob