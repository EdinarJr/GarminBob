'use client';

import { useState } from 'react';
import Link from 'next/link';

type ImportTab = 'garmin' | 'clinicos';
type ClinicalType = 'medications' | 'supplements' | 'lab-exams' | 'trainer-workouts' | 'nutrition-plan';

export default function ImportarPage() {
  const [activeTab, setActiveTab] = useState<ImportTab>('garmin');
  const [selectedClinicalType, setSelectedClinicalType] = useState<ClinicalType>('medications');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const clinicalTypes = [
    { value: 'medications' as ClinicalType, label: 'Medicamentos', icon: '💊' },
    { value: 'supplements' as ClinicalType, label: 'Suplementos', icon: '🧪' },
    { value: 'lab-exams' as ClinicalType, label: 'Exames Laboratoriais', icon: '🔬' },
    { value: 'trainer-workouts' as ClinicalType, label: 'Treinos do Educador Físico', icon: '🏋️' },
    { value: 'nutrition-plan' as ClinicalType, label: 'Plano Nutricional', icon: '🥗' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Selecione um arquivo' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'default-user-id');

      const endpoint = activeTab === 'garmin' 
        ? 'http://localhost:3001/api/import/garmin'
        : `http://localhost:3001/api/clinical/import/${selectedClinicalType}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Dados importados com sucesso!' });
        setFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao importar dados' });
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📥 Importar Dados
              </h1>
              <p className="text-gray-600">
                Importe dados do Garmin Connect e dados clínicos
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
            <button
              onClick={() => setActiveTab('garmin')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                activeTab === 'garmin'
                  ? 'bg-green-600 text-white border-b-4 border-green-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mr-2">🏃</span>
              Dados do Garmin
            </button>
            <button
              onClick={() => setActiveTab('clinicos')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                activeTab === 'clinicos'
                  ? 'bg-orange-600 text-white border-b-4 border-orange-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mr-2">📋</span>
              Dados Clínicos
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'garmin' ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🏃 Importar Dados do Garmin Connect
                </h2>
                <p className="text-gray-600 mb-6">
                  Faça upload do arquivo CSV ou JSON exportado do Garmin Connect
                </p>

                {/* Instruções */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    📋 Como exportar do Garmin Connect:
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li>1. Acesse <a href="https://connect.garmin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Garmin Connect</a></li>
                    <li>2. Vá em <strong>Atividades</strong> no menu</li>
                    <li>3. Clique em <strong>Exportar para CSV</strong> ou <strong>JSON</strong></li>
                    <li>4. Faça o upload do arquivo aqui</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📋 Importar Dados Clínicos
                </h2>
                <p className="text-gray-600 mb-6">
                  Selecione o tipo de dado e faça upload do arquivo
                </p>

                {/* Seletor de tipo */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de Dados
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {clinicalTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedClinicalType(type.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedClinicalType === type.value
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium text-gray-800">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Upload de arquivo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Arquivo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  id="file-input"
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer"
                >
                  <div className="text-5xl mb-4">📁</div>
                  <div className="text-gray-600 mb-2">
                    {file ? (
                      <span className="font-medium text-blue-600">{file.name}</span>
                    ) : (
                      'Clique para selecionar um arquivo'
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Formatos aceitos: JSON, CSV
                  </div>
                </label>
              </div>
            </div>

            {/* Mensagem de feedback */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Botão de importação */}
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                !file || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : activeTab === 'garmin'
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Importando...
                </span>
              ) : (
                '🚀 Importar Dados'
              )}
            </button>

            {/* Informações sobre formatos */}
            {activeTab === 'clinicos' && (
              <div className="mt-8 p-6 bg-orange-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">
                  📝 Formato dos Arquivos
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Medicamentos/Suplementos:</strong> JSON ou CSV com campos: name, dosage, frequency, prescribedBy, startDate, purpose
                  </p>
                  <p>
                    <strong>Exames Laboratoriais:</strong> JSON com campos: examDate, examType, requestedBy, results, referenceValues
                  </p>
                  <p>
                    <strong>Treinos:</strong> JSON com campos: name, prescribedBy, startDate, weeklySchedule, exercises, goals
                  </p>
                  <p>
                    <strong>Plano Nutricional:</strong> JSON com campos: name, startDate, dailyCalories, macros, meals
                  </p>
                  <p className="mt-3">
                    <strong>📁 Exemplos:</strong> Consulte <code className="bg-white px-2 py-1 rounded">examples/clinical-data-examples.json</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
