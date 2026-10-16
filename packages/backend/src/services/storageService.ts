import { GarminActivityData } from '../parsers/garminParser';
import * as fs from 'fs';
import * as path from 'path';

// Armazenamento persistente em arquivo JSON local
class StorageService {
  private activities: GarminActivityData[] = [];
  private dataFile: string;

  constructor() {
    // Caminho para o arquivo de dados
    this.dataFile = path.join(process.cwd(), 'data', 'activities.json');
    
    // Criar diretório data se não existir
    const dataDir = path.dirname(this.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Diretório de dados criado:', dataDir);
    }

    // Carregar dados existentes
    this.loadFromFile();
  }

  // Carregar dados do arquivo
  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(data);
        
        // Converter strings de data de volta para objetos Date
        this.activities = parsed.map((activity: any) => ({
          ...activity,
          date: new Date(activity.date),
        }));
        
        console.log(`📂 ${this.activities.length} atividades carregadas do arquivo`);
      } else {
        console.log('📝 Nenhum arquivo de dados encontrado. Iniciando vazio.');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      this.activities = [];
    }
  }

  // Salvar dados no arquivo
  private saveToFile(): void {
    try {
      const data = JSON.stringify(this.activities, null, 2);
      fs.writeFileSync(this.dataFile, data, 'utf-8');
      console.log(`💾 Dados salvos em: ${this.dataFile}`);
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
    }
  }

  // Salvar atividades
  saveActivities(activities: GarminActivityData[]): void {
    // Adicionar novas atividades
    this.activities.push(...activities);
    
    // Remover duplicatas baseado em data e tipo
    this.activities = this.activities.filter((activity, index, self) =>
      index === self.findIndex((a) => (
        a.date.getTime() === activity.date.getTime() &&
        a.activityType === activity.activityType
      ))
    );

    // Ordenar por data (mais recente primeiro)
    this.activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Salvar no arquivo
    this.saveToFile();

    console.log(`✅ ${activities.length} atividades salvas. Total: ${this.activities.length}`);
  }

  // Buscar todas as atividades
  getAllActivities(): GarminActivityData[] {
    return this.activities;
  }

  // Buscar atividades por período
  getActivitiesByDateRange(startDate: Date, endDate: Date): GarminActivityData[] {
    return this.activities.filter(
      activity => activity.date >= startDate && activity.date <= endDate
    );
  }

  // Buscar atividades recentes (últimos N dias)
  getRecentActivities(days: number = 30): GarminActivityData[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.activities.filter(activity => activity.date >= cutoffDate);
  }

  // Buscar por tipo de atividade
  getActivitiesByType(type: string): GarminActivityData[] {
    return this.activities.filter(
      activity => activity.activityType.toLowerCase() === type.toLowerCase()
    );
  }

  // Estatísticas gerais
  getStatistics() {
    const totalActivities = this.activities.length;
    const totalDistance = this.activities.reduce((sum, a) => sum + (a.distance || 0), 0);
    const totalCalories = this.activities.reduce((sum, a) => sum + (a.calories || 0), 0);
    const totalDuration = this.activities.reduce((sum, a) => sum + a.duration, 0);

    // Agrupar por tipo
    const byType: { [key: string]: number } = {};
    this.activities.forEach(activity => {
      byType[activity.activityType] = (byType[activity.activityType] || 0) + 1;
    });

    return {
      totalActivities,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalCalories,
      totalDuration: Math.round(totalDuration),
      byType,
      lastActivity: this.activities[0]?.date || null,
    };
  }

  // Limpar todas as atividades
  clearAll(): void {
    this.activities = [];
    this.saveToFile();
    console.log('🗑️  Todas as atividades foram removidas');
  }

  // Contar atividades
  count(): number {
    return this.activities.length;
  }
}

// Singleton
export const storageService = new StorageService();

// Made with Bob
