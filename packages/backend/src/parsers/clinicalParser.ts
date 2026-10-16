import { z } from 'zod';

// Schema de validação para Medicamentos
const MedicationSchema = z.object({
  name: z.string().min(1, 'Nome do medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  prescribedBy: z.string().min(1, 'Prescritor é obrigatório'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  purpose: z.string().min(1, 'Objetivo é obrigatório'),
  sideEffects: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

// Schema de validação para Suplementos
const SupplementSchema = z.object({
  name: z.string().min(1, 'Nome do suplemento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  prescribedBy: z.string().min(1, 'Prescritor é obrigatório'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  purpose: z.string().min(1, 'Objetivo é obrigatório'),
  timing: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

// Schema de validação para Exames Laboratoriais
const LabExamSchema = z.object({
  examDate: z.string().or(z.date()),
  examType: z.string().min(1, 'Tipo de exame é obrigatório'),
  requestedBy: z.string().min(1, 'Solicitante é obrigatório'),
  laboratory: z.string().optional().nullable(),
  results: z.record(z.any()),
  referenceValues: z.record(z.any()),
  interpretation: z.string().optional().nullable(),
  alerts: z.array(z.string()).default([]),
});

// Schema de validação para Treinos do Educador Físico
const TrainerWorkoutSchema = z.object({
  name: z.string().min(1, 'Nome do treino é obrigatório'),
  description: z.string().optional().nullable(),
  prescribedBy: z.string().min(1, 'Educador físico é obrigatório'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  weeklySchedule: z.record(z.any()),
  exercises: z.array(z.any()),
  goals: z.array(z.string()),
  progressMetrics: z.record(z.any()).optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export class ClinicalParser {
  /**
   * Parse medicamentos de JSON
   */
  static parseMedicationsJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);
      const medications = Array.isArray(data) ? data : [data];
      
      return medications.map(med => {
        const parsed = MedicationSchema.parse(med);
        return {
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        };
      });
    } catch (error: any) {
      throw new Error(`Erro ao processar medicamentos: ${error.message}`);
    }
  }

  /**
   * Parse medicamentos de CSV
   */
  static parseMedicationsCSV(csvContent: string): any[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV vazio ou inválido');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const medications = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const medication: any = {};

      headers.forEach((header, index) => {
        medication[header] = values[index] || null;
      });

      try {
        const parsed = MedicationSchema.parse(medication);
        medications.push({
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        });
      } catch (error) {
        console.warn(`Linha ${i + 1} ignorada:`, error);
      }
    }

    return medications;
  }

  /**
   * Parse suplementos de JSON
   */
  static parseSupplementsJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);
      const supplements = Array.isArray(data) ? data : [data];
      
      return supplements.map(sup => {
        const parsed = SupplementSchema.parse(sup);
        return {
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        };
      });
    } catch (error: any) {
      throw new Error(`Erro ao processar suplementos: ${error.message}`);
    }
  }

  /**
   * Parse suplementos de CSV
   */
  static parseSupplementsCSV(csvContent: string): any[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV vazio ou inválido');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const supplements = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const supplement: any = {};

      headers.forEach((header, index) => {
        supplement[header] = values[index] || null;
      });

      try {
        const parsed = SupplementSchema.parse(supplement);
        supplements.push({
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        });
      } catch (error) {
        console.warn(`Linha ${i + 1} ignorada:`, error);
      }
    }

    return supplements;
  }

  /**
   * Parse exames laboratoriais de JSON
   */
  static parseLabExamsJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);
      const exams = Array.isArray(data) ? data : [data];
      
      return exams.map(exam => {
        const parsed = LabExamSchema.parse(exam);
        
        // Identificar alertas automaticamente
        const alerts = this.identifyExamAlerts(parsed.results, parsed.referenceValues);
        
        return {
          ...parsed,
          examDate: new Date(parsed.examDate),
          alerts: [...parsed.alerts, ...alerts],
        };
      });
    } catch (error: any) {
      throw new Error(`Erro ao processar exames: ${error.message}`);
    }
  }

  /**
   * Parse treinos do educador físico de JSON
   */
  static parseTrainerWorkoutsJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);
      const workouts = Array.isArray(data) ? data : [data];
      
      return workouts.map(workout => {
        const parsed = TrainerWorkoutSchema.parse(workout);
        return {
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        };
      });
    } catch (error: any) {
      throw new Error(`Erro ao processar treinos: ${error.message}`);
    }
  }

  /**
   * Parse plano nutricional completo de JSON
   */
  static parseNutritionPlanJSON(jsonContent: string): any {
    try {
      const data = JSON.parse(jsonContent);
      
      return {
        name: data.name || 'Plano Nutricional',
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        dailyCalories: data.dailyCalories,
        macros: data.macros,
        meals: data.meals || [],
        notes: data.notes || null,
      };
    } catch (error: any) {
      throw new Error(`Erro ao processar plano nutricional: ${error.message}`);
    }
  }

  /**
   * Identificar alertas em exames laboratoriais
   */
  private static identifyExamAlerts(results: Record<string, any>, referenceValues: Record<string, any>): string[] {
    const alerts: string[] = [];

    for (const [key, value] of Object.entries(results)) {
      if (typeof value !== 'number') continue;
      
      const reference = referenceValues[key];
      if (!reference) continue;

      if (reference.min !== undefined && value < reference.min) {
        alerts.push(`${key}: ${value} está abaixo do valor de referência (${reference.min})`);
      }
      
      if (reference.max !== undefined && value > reference.max) {
        alerts.push(`${key}: ${value} está acima do valor de referência (${reference.max})`);
      }
    }

    return alerts;
  }

  /**
   * Validar medicamento
   */
  static validateMedication(medication: any): { valid: boolean; errors: string[] } {
    try {
      MedicationSchema.parse(medication);
      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  /**
   * Validar suplemento
   */
  static validateSupplement(supplement: any): { valid: boolean; errors: string[] } {
    try {
      SupplementSchema.parse(supplement);
      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  /**
   * Validar exame laboratorial
   */
  static validateLabExam(exam: any): { valid: boolean; errors: string[] } {
    try {
      LabExamSchema.parse(exam);
      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  /**
   * Validar treino do educador físico
   */
  static validateTrainerWorkout(workout: any): { valid: boolean; errors: string[] } {
    try {
      TrainerWorkoutSchema.parse(workout);
      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }
}

// Made with Bob