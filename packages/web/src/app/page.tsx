import React from 'react'
import { Upload } from 'lucide-react'

export default function Home() {

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏃‍♂️ Garmin Training AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema inteligente de análise e geração de treinos personalizados baseado em dados do Garmin Connect
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Importar Dados */}
        <a
          href="/importar"
          className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Upload className="w-12 h-12 text-orange-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Importar Dados</h3>
          <p className="text-sm text-gray-600">
            Garmin Connect e dados clínicos em um só lugar
          </p>
          <div className="mt-4 text-orange-600 text-sm font-medium">
            Importar →
          </div>
        </a>

        {/* Central de Análises */}
        <a
          href="/analise"
          className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-xl p-6 text-center hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer col-span-full"
        >
          <div className="text-5xl mb-3">📈</div>
          <h3 className="text-xl font-bold text-white mb-2">Central de Análises</h3>
          <p className="text-sm text-blue-100 mb-3">
            Atividades, IA, Análise Clínica e Treinos Personalizados em um só lugar
          </p>
          <div className="flex justify-center gap-2">
            <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">📊 Atividades</span>
            <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">🤖 IA</span>
            <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">🏥 Clínica</span>
            <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">🎯 Treinos</span>
          </div>
        </a>
      </div>
    </div>
  )
}

// Made with Bob
