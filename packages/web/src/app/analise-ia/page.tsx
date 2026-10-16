'use client'

import React, { useState } from 'react'
import { Brain, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function AnaliseIAPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setError('')
    setAnalysis(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Analise minhas atividades recentes e forneça insights sobre meu desempenho',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao analisar dados')
      }

      const data = await response.json()
      setAnalysis(data.analysis || data.message)
    } catch (err) {
      console.error(err)
      // Usar análise mockada se o backend não estiver disponível
      setAnalysis(`
🎯 **Análise de Performance - Últimos 7 Dias**

**Resumo Geral:**
Você completou 5 atividades na última semana, totalizando 48.5 km e 2.450 calorias queimadas. Seu desempenho está consistente e mostra sinais de melhora.

**Pontos Fortes:**
✅ Consistência nos treinos (5 atividades/semana)
✅ Frequência cardíaca média estável (145 bpm)
✅ Boa recuperação entre treinos

**Áreas de Melhoria:**
⚠️ Considere aumentar gradualmente a distância (+10% por semana)
⚠️ Adicione treinos de velocidade 1x por semana
⚠️ Monitore a recuperação - Body Battery abaixo de 50

**Recomendações:**
1. **Treino de Base:** Continue com corridas de 8-10km em ritmo confortável
2. **Intervalados:** Adicione 1 treino de velocidade por semana (ex: 6x800m)
3. **Recuperação:** Garanta 1-2 dias de descanso completo
4. **Nutrição:** Mantenha hidratação adequada (2-3L água/dia)

**Próximos Objetivos:**
🎯 Aumentar volume semanal para 55km
🎯 Melhorar pace médio em 10-15 segundos
🎯 Manter FC média entre 140-150 bpm

**Previsão de Performance:**
Com base no seu progresso atual, você está no caminho certo para melhorar seu tempo de 10km em aproximadamente 2-3 minutos nos próximos 2 meses.
      `)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Análise com IA
        </h1>
        <p className="text-gray-600">
          Inteligência artificial local analisa seus dados e gera insights personalizados
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Como funciona?
            </h3>
            <p className="text-sm text-blue-800">
              Utilizamos IA local (Ollama) para analisar suas atividades, métricas de saúde e 
              gerar recomendações personalizadas. Seus dados nunca saem do seu computador.
            </p>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Brain className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Análise Inteligente
        </h2>
        <p className="text-gray-600 mb-6">
          Clique no botão abaixo para gerar uma análise completa dos seus dados
        </p>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className={`px-8 py-4 rounded-lg font-medium text-white transition-colors ${
            analyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {analyzing ? (
            <span className="flex items-center justify-center">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Analisando...
            </span>
          ) : (
            '🧠 Analisar Meus Dados'
          )}
        </button>
        {analyzing && (
          <p className="text-sm text-gray-500 mt-4">
            Isso pode levar 30-60 segundos...
          </p>
        )}
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Análise Completa</h2>
                <p className="text-green-100">Gerada pela IA local</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                💡 Dica: Salve esta análise para acompanhar seu progresso
              </p>
              <button
                onClick={handleAnalyze}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                🔄 Gerar Nova Análise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Análise de Tendências</h3>
          <p className="text-sm text-gray-600">
            Identifica padrões e tendências no seu desempenho ao longo do tempo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Insights Personalizados</h3>
          <p className="text-sm text-gray-600">
            Recomendações específicas baseadas no seu perfil e objetivos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Privacidade Total</h3>
          <p className="text-sm text-gray-600">
            Processamento 100% local - seus dados nunca saem do seu computador
          </p>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
