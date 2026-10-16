'use client'

import React, { useState, useEffect } from 'react'
import { Activity, Calendar, Heart, TrendingUp, Clock, Zap } from 'lucide-react'

interface ActivityData {
  activityType: string
  date: string
  duration: number
  distance?: number
  calories?: number
  avgHeartRate?: number
  maxHeartRate?: number
}

export default function AtividadesPage() {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/activities`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar atividades')
        }

        const data = await response.json()
        
        // Converter datas de string para formato adequado
        const formattedActivities = data.activities.map((activity: any) => ({
          ...activity,
          date: activity.date,
        }))
        
        setActivities(formattedActivities)
      } catch (err) {
        console.error('Erro ao buscar atividades:', err)
        setError('Erro ao carregar atividades. Verifique se você já importou dados.')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return '🏃‍♂️'
      case 'cycling':
        return '🚴‍♂️'
      case 'swimming':
        return '🏊‍♂️'
      default:
        return '💪'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'cycling':
        return 'bg-green-100 text-green-800'
      case 'swimming':
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Calcular estatísticas
  const totalActivities = activities.length
  const totalDistance = activities.reduce((sum, a) => sum + (a.distance || 0), 0)
  const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0)
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Análise de Atividades
        </h1>
        <p className="text-gray-600">
          Visualize suas métricas de treino e performance
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Atividades</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Distância Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calorias Queimadas</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalories}</p>
            </div>
            <Zap className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
            </div>
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
        </div>
        <div className="divide-y">
          {activities.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getActivityIcon(activity.activityType)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActivityColor(activity.activityType)}`}>
                        {activity.activityType}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(activity.date)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      {activity.distance && (
                        <div>
                          <p className="text-xs text-gray-500">Distância</p>
                          <p className="text-sm font-semibold text-gray-900">{activity.distance} km</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Duração</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDuration(activity.duration)}</p>
                      </div>
                      {activity.calories && (
                        <div>
                          <p className="text-xs text-gray-500">Calorias</p>
                          <p className="text-sm font-semibold text-gray-900">{activity.calories} kcal</p>
                        </div>
                      )}
                      {activity.avgHeartRate && (
                        <div>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            FC Média
                          </p>
                          <p className="text-sm font-semibold text-gray-900">{activity.avgHeartRate} bpm</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem se não houver atividades */}
      {activities.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma atividade encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            Importe seus dados do Garmin para visualizar suas atividades
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Importar Dados
          </a>
        </div>
      )}
    </div>
  )
}

// Made with Bob
