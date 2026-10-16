'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importar Recharts dinamicamente para evitar problemas de hidratação
const Chart = dynamic(() => import('../components/Chart'), { ssr: false });

interface ExamTrend {
  marker: string;
  values: Array<{ date: string; value: number }>;
  trend: 'improving' | 'stable' | 'worsening';
  changePercentage: number;
}

interface ClinicalAnalysis {
  id: string;
  analysisDate: string;
  periodStart: string;
  periodEnd: string;
  examTrends: ExamTrend[];
  examAlerts: string[];
  nutritionRecommendations: string[];
  trainingRecommendations: string[];
  medicalRecommendations: string[];
  riskFactors: string[];
  positiveFactors: string[];
  overallScore: number;
}

export default function AnaliseClinicalPage() {
  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<string>('');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);

  useEffect(() => {
    loadLatestAnalysis();
  }, []);

  const loadLatestAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analysis/latest?userId=default-user-id');
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
        if (data.analysis?.examTrends?.length > 0) {
          setSelectedMarker(data.analysis.examTrends[0].marker);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    setGeneratingAnalysis(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Últimos 3 meses

      const response = await fetch('http://localhost:3001/api/analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'default-user-id',
          periodStart: startDate.toISOString(),
          periodEnd: endDate.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
        if (data.analysis?.examTrends?.length > 0) {
          setSelectedMarker(data.analysis.examTrends[0].marker);
        }
      }
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'worsening':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'worsening':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise clínica...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🔬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhuma Análise Disponível
            </h2>
            <p className="text-gray-600 mb-6">
              Gere sua primeira análise clínica para visualizar correlações e recomendações personalizadas
            </p>
            <button
              onClick={generateNewAnalysis}
              disabled={generatingAnalysis}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {generatingAnalysis ? 'Gerando...' : '🚀 Gerar Análise'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTrend = analysis.examTrends.find(t => t.marker === selectedMarker);
  const chartData = selectedTrend?.values.map(v => ({
    date: new Date(v.date).toLocaleDateString('pt-BR'),
    value: v.value,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🏥 Análise Clínica Completa
              </h1>
              <p className="text-gray-600">
                Período: {new Date(analysis.periodStart).toLocaleDateString('pt-BR')} - {new Date(analysis.periodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <button
              onClick={generateNewAnalysis}
              disabled={generatingAnalysis}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {generatingAnalysis ? '⏳ Gerando...' : '🔄 Atualizar Análise'}
            </button>
          </div>
        </div>

        {/* Score Geral */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Score Geral de Saúde</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={analysis.overallScore >= 80 ? '#10b981' : analysis.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(analysis.overallScore / 100) * 502.4} 502.4`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tendências dos Exames */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Tendências dos Exames</h2>
          
          {/* Seletor de marcador */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o Marcador
            </label>
            <select
              value={selectedMarker}
              onChange={(e) => setSelectedMarker(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {analysis.examTrends.map((trend) => (
                <option key={trend.marker} value={trend.marker}>
                  {getTrendIcon(trend.trend)} {trend.marker} ({trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage.toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>

          {/* Gráfico */}
          {chartData.length > 0 && (
            <Chart
              data={chartData}
              dataKey="value"
              name={selectedMarker}
            />
          )}

          {/* Lista de tendências */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.examTrends.map((trend) => (
              <div
                key={trend.marker}
                className={`p-4 rounded-lg border-2 ${
                  trend.marker === selectedMarker ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{trend.marker}</span>
                  <span className="text-2xl">{getTrendIcon(trend.trend)}</span>
                </div>
                <div className={`text-sm font-medium ${getTrendColor(trend.trend)}`}>
                  {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        {analysis.examAlerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4">⚠️ Alertas</h2>
            <ul className="space-y-2">
              {analysis.examAlerts.map((alert, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-red-800">{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Nutrição */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🥗 Nutrição</h3>
            <ul className="space-y-2">
              {analysis.nutritionRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treinos */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏋️ Treinos</h3>
            <ul className="space-y-2">
              {analysis.trainingRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Médicas */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚕️ Médicas</h3>
            <ul className="space-y-2">
              {analysis.medicalRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fatores de Risco e Positivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fatores de Risco */}
          {analysis.riskFactors.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Fatores de Risco</h3>
              <ul className="space-y-2">
                {analysis.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fatores Positivos */}
          {analysis.positiveFactors.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-green-600 mb-4">✨ Fatores Positivos</h3>
              <ul className="space-y-2">
                {analysis.positiveFactors.map((factor, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
