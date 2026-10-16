import { parse } from 'csv-parse/sync';

export interface GarminActivityData {
  activityType: string;
  date: Date;
  duration: number;
  distance?: number;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgPace?: number;
  elevation?: number;
  trainingEffect?: number;
  vo2max?: number;
}

export interface GarminMetricsData {
  date: Date;
  restingHeartRate?: number;
  hrv?: number;
  sleepHours?: number;
  sleepQuality?: number;
  stress?: number;
  bodyBattery?: number;
  steps?: number;
}

export class GarminParser {
  /**
   * Parse CSV de atividades do Garmin Connect
   */
  static parseActivitiesCSV(csvContent: string): GarminActivityData[] {
    try {
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });

      return records.map((record: any) => {
        const activity: GarminActivityData = {
          activityType: this.getField(record, ['Activity Type', 'Tipo de Atividade', 'Type']),
          date: this.parseDate(this.getField(record, ['Date', 'Data'])),
          duration: this.parseDuration(this.getField(record, ['Time', 'Tempo', 'Duration'])),
        };

        // Campos opcionais
        const distance = this.getField(record, ['Distance', 'Distância']);
        if (distance) activity.distance = parseFloat(distance);

        const calories = this.getField(record, ['Calories', 'Calorias']);
        if (calories) activity.calories = parseInt(calories);

        const avgHR = this.getField(record, ['Avg HR', 'FC Média', 'Average Heart Rate']);
        if (avgHR) activity.avgHeartRate = parseInt(avgHR);

        const maxHR = this.getField(record, ['Max HR', 'FC Máxima', 'Maximum Heart Rate']);
        if (maxHR) activity.maxHeartRate = parseInt(maxHR);

        const avgPace = this.getField(record, ['Avg Pace', 'Ritmo Médio', 'Average Pace']);
        if (avgPace) activity.avgPace = this.parsePace(avgPace);

        const elevation = this.getField(record, ['Elev Gain', 'Ganho de Elevação', 'Elevation Gain']);
        if (elevation) activity.elevation = parseFloat(elevation);

        const trainingEffect = this.getField(record, ['Training Effect', 'Efeito de Treino']);
        if (trainingEffect) activity.trainingEffect = parseFloat(trainingEffect);

        const vo2max = this.getField(record, ['VO2 Max', 'VO2Max']);
        if (vo2max) activity.vo2max = parseFloat(vo2max);

        return activity;
      });
    } catch (error) {
      throw new Error(`Erro ao processar CSV de atividades: ${error}`);
    }
  }

  /**
   * Parse CSV de métricas diárias do Garmin
   */
  static parseMetricsCSV(csvContent: string): GarminMetricsData[] {
    try {
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });

      return records.map((record: any) => {
        const metrics: GarminMetricsData = {
          date: this.parseDate(this.getField(record, ['Date', 'Data'])),
        };

        const restingHR = this.getField(record, ['Resting HR', 'FC Repouso', 'Resting Heart Rate']);
        if (restingHR) metrics.restingHeartRate = parseInt(restingHR);

        const hrv = this.getField(record, ['HRV', 'Variabilidade']);
        if (hrv) metrics.hrv = parseInt(hrv);

        const sleep = this.getField(record, ['Sleep', 'Sono', 'Sleep Hours']);
        if (sleep) metrics.sleepHours = parseFloat(sleep);

        const sleepQuality = this.getField(record, ['Sleep Quality', 'Qualidade do Sono']);
        if (sleepQuality) metrics.sleepQuality = parseInt(sleepQuality);

        const stress = this.getField(record, ['Stress', 'Estresse']);
        if (stress) metrics.stress = parseInt(stress);

        const bodyBattery = this.getField(record, ['Body Battery', 'Bateria Corporal']);
        if (bodyBattery) metrics.bodyBattery = parseInt(bodyBattery);

        const steps = this.getField(record, ['Steps', 'Passos']);
        if (steps) metrics.steps = parseInt(steps);

        return metrics;
      });
    } catch (error) {
      throw new Error(`Erro ao processar CSV de métricas: ${error}`);
    }
  }

  /**
   * Parse JSON de atividades
   */
  static parseActivitiesJSON(jsonContent: string): GarminActivityData[] {
    try {
      const data = JSON.parse(jsonContent);
      const activities = Array.isArray(data) ? data : data.activities || [];

      return activities.map((activity: any) => ({
        activityType: activity.activityType || activity.type,
        date: new Date(activity.date),
        duration: activity.duration,
        distance: activity.distance,
        calories: activity.calories,
        avgHeartRate: activity.avgHeartRate || activity.averageHeartRate,
        maxHeartRate: activity.maxHeartRate || activity.maximumHeartRate,
        avgPace: activity.avgPace || activity.averagePace,
        elevation: activity.elevation || activity.elevationGain,
        trainingEffect: activity.trainingEffect,
        vo2max: activity.vo2max || activity.vo2Max,
      }));
    } catch (error) {
      throw new Error(`Erro ao processar JSON de atividades: ${error}`);
    }
  }

  /**
   * Busca campo em múltiplos nomes possíveis
   */
  private static getField(record: any, fieldNames: string[]): string {
    for (const name of fieldNames) {
      if (record[name] !== undefined && record[name] !== null && record[name] !== '') {
        return record[name];
      }
    }
    return '';
  }

  /**
   * Converte string de data para Date
   */
  private static parseDate(dateStr: string): Date {
    if (!dateStr) throw new Error('Data não fornecida');
    
    // Tenta vários formatos
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Tenta formato DD/MM/YYYY
      const parts = dateStr.split(/[/-]/);
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      throw new Error(`Formato de data inválido: ${dateStr}`);
    }
    return date;
  }

  /**
   * Converte duração "HH:MM:SS" para minutos
   */
  private static parseDuration(timeStr: string): number {
    if (!timeStr) return 0;

    const parts = timeStr.split(':').map(Number);
    
    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] + parts[1] / 60;
    } else if (parts.length === 1) {
      // Apenas minutos
      return parts[0];
    }
    
    return 0;
  }

  /**
   * Converte ritmo "MM:SS" (min/km) para número decimal
   */
  private static parsePace(paceStr: string): number | undefined {
    if (!paceStr || paceStr === 'N/A') return undefined;

    const parts = paceStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] + parts[1] / 60;
    }
    
    return parseFloat(paceStr);
  }

  /**
   * Valida dados de atividade
   */
  static validateActivity(activity: GarminActivityData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!activity.activityType) {
      errors.push('Tipo de atividade é obrigatório');
    }

    if (!activity.date || isNaN(activity.date.getTime())) {
      errors.push('Data inválida');
    }

    if (activity.duration <= 0) {
      errors.push('Duração deve ser maior que zero');
    }

    if (activity.distance !== undefined && activity.distance < 0) {
      errors.push('Distância não pode ser negativa');
    }

    if (activity.avgHeartRate !== undefined && activity.maxHeartRate !== undefined) {
      if (activity.avgHeartRate > activity.maxHeartRate) {
        errors.push('FC média não pode ser maior que FC máxima');
      }
    }

    if (activity.maxHeartRate !== undefined && activity.maxHeartRate > 220) {
      errors.push('FC máxima parece inválida (>220 bpm)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida dados de métricas
   */
  static validateMetrics(metrics: GarminMetricsData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metrics.date || isNaN(metrics.date.getTime())) {
      errors.push('Data inválida');
    }

    if (metrics.restingHeartRate !== undefined) {
      if (metrics.restingHeartRate < 30 || metrics.restingHeartRate > 120) {
        errors.push('FC de repouso fora do intervalo esperado (30-120 bpm)');
      }
    }

    if (metrics.sleepHours !== undefined) {
      if (metrics.sleepHours < 0 || metrics.sleepHours > 24) {
        errors.push('Horas de sono inválidas (0-24h)');
      }
    }

    if (metrics.sleepQuality !== undefined) {
      if (metrics.sleepQuality < 0 || metrics.sleepQuality > 100) {
        errors.push('Qualidade do sono deve estar entre 0-100');
      }
    }

    if (metrics.stress !== undefined) {
      if (metrics.stress < 0 || metrics.stress > 100) {
        errors.push('Nível de estresse deve estar entre 0-100');
      }
    }

    if (metrics.bodyBattery !== undefined) {
      if (metrics.bodyBattery < 0 || metrics.bodyBattery > 100) {
        errors.push('Body Battery deve estar entre 0-100');
      }
    }

    if (metrics.steps !== undefined && metrics.steps < 0) {
      errors.push('Número de passos não pode ser negativo');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Made with Bob
