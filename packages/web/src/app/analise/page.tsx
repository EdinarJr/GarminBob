'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tab = 'atividades' | 'ia' | 'clinica' | 'treinos';

export default function AnalisePage() {
  const [activeTab, setActiveTab] = useState<Tab>('atividades');

  const tabs = [
    { id: 'atividades' as Tab, label: '📊 Atividades', icon: '📊' },
    { id: 'ia' as Tab, label: '🤖 Análise IA', icon: '🤖' },
    { id: 'clinica' as Tab, label: '🏥 Análise Clínica', icon: '🏥' },
    { id: 'treinos' as Tab, label: '🎯 Treinos', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📈 Central de Análises
              </h1>
              <p className="text-gray-600">
                Análise completa de atividades, IA e dados clínicos em um só lugar
              </p>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'atividades' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📊 Análise de Atividades
                </h2>
                <iframe
                  src="/atividades"
                  className="w-full h-[800px] border-0 rounded-lg"
                  title="Atividades"
                />
              </div>
            )}

            {activeTab === 'ia' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🤖 Análise com IA
                </h2>
                <iframe
                  src="/analise-ia"
                  className="w-full h-[800px] border-0 rounded-lg"
                  title="Análise IA"
                />
              </div>
            )}

            {activeTab === 'clinica' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🏥 Análise Clínica
                </h2>
                <iframe
                  src="/analise-clinica"
                  className="w-full h-[800px] border-0 rounded-lg"
                  title="Análise Clínica"
                />
              </div>
            )}

            {activeTab === 'treinos' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🎯 Treinos Personalizados
                </h2>
                <iframe
                  src="/treinos"
                  className="w-full h-[800px] border-0 rounded-lg"
                  title="Treinos Personalizados"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
