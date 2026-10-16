# Formatos de Dados - Garmin Training AI

## 1. Dados do Garmin Connect

### 1.1 Formato CSV de Atividades

**Exemplo: activities.csv**
```csv
Activity Type,Date,Time,Distance,Calories,Avg HR,Max HR,Avg Pace,Elev Gain,Training Effect,VO2 Max
Running,2024-01-15,00:45:30,8.5,520,145,165,5:21,120,3.2,52
Cycling,2024-01-16,01:30:00,35.2,680,138,158,N/A,450,2.8,N/A
Swimming,2024-01-17,00:40:00,2.0,380,N/A,N/A,N/A,N/A,2.5,N/A
Running,2024-01-18,00:50:15,10.2,615,148,170,4:55,85,3.5,53
```

**Campos Obrigatórios:**
- `Activity Type`: Tipo de atividade (Running, Cycling, Swimming, etc.)
- `Date`: Data no formato YYYY-MM-DD
- `Time`: Duração no formato HH:MM:SS

**Campos Opcionais:**
- `Distance`: Distância em km
- `Calories`: Calorias queimadas
- `Avg HR`: Frequência cardíaca média
- `Max HR`: Frequência cardíaca máxima
- `Avg Pace`: Ritmo médio (min/km)
- `Elev Gain`: Ganho de elevação (metros)
- `Training Effect`: Efeito de treino (0-5)
- `VO2 Max`: VO2 máximo estimado

### 1.2 Formato CSV de Métricas Diárias

**Exemplo: daily_metrics.csv**
```csv
Date,Resting HR,HRV,Sleep,Sleep Quality,Stress,Body Battery,Steps
2024-01-15,58,45,7.5,85,35,75,12500
2024-01-16,60,42,6.8,72,48,65,8900
2024-01-17,57,48,8.2,90,25,85,10200
2024-01-18,59,44,7.0,78,40,70,11800
```

**Campos:**
- `Date`: Data no formato YYYY-MM-DD
- `Resting HR`: FC de repouso (bpm)
- `HRV`: Variabilidade da FC (ms)
- `Sleep`: Horas de sono
- `Sleep Quality`: Qualidade do sono (0-100)
- `Stress`: Nível de estresse (0-100)
- `Body Battery`: Bateria corporal (0-100)
- `Steps`: Número de passos

### 1.3 Formato JSON de Atividades

**Exemplo: activities.json**
```json
{
  "activities": [
    {
      "activityType": "Running",
      "date": "2024-01-15T06:30:00Z",
      "duration": 45.5,
      "distance": 8.5,
      "calories": 520,
      "avgHeartRate": 145,
      "maxHeartRate": 165,
      "avgPace": 5.35,
      "elevation": 120,
      "trainingEffect": 3.2,
      "vo2max": 52,
      "splits": [
        {"km": 1, "time": "5:20", "hr": 142},
        {"km": 2, "time": "5:18", "hr": 145},
        {"km": 3, "time": "5:25", "hr": 147}
      ],
      "zones": {
        "zone1": 5,
        "zone2": 15,
        "zone3": 20,
        "zone4": 5,
        "zone5": 0
      }
    }
  ]
}
```

## 2. Plano Nutricional

### 2.1 Formato JSON

**Exemplo: nutrition_plan.json**
```json
{
  "name": "Plano de Treino - Janeiro 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dailyCalories": 2500,
  "macros": {
    "protein": 150,
    "carbs": 300,
    "fat": 70
  },
  "meals": [
    {
      "name": "Café da Manhã",
      "time": "07:00",
      "calories": 600,
      "foods": [
        {
          "item": "Aveia",
          "quantity": "80g",
          "calories": 300,
          "protein": 10,
          "carbs": 54,
          "fat": 6
        },
        {
          "item": "Banana",
          "quantity": "1 unidade",
          "calories": 105,
          "protein": 1,
          "carbs": 27,
          "fat": 0
        },
        {
          "item": "Whey Protein",
          "quantity": "30g",
          "calories": 120,
          "protein": 24,
          "carbs": 3,
          "fat": 1
        }
      ]
    },
    {
      "name": "Almoço",
      "time": "12:30",
      "calories": 800,
      "foods": [
        {
          "item": "Arroz integral",
          "quantity": "150g",
          "calories": 180,
          "protein": 4,
          "carbs": 38,
          "fat": 1
        },
        {
          "item": "Frango grelhado",
          "quantity": "200g",
          "calories": 330,
          "protein": 62,
          "carbs": 0,
          "fat": 7
        },
        {
          "item": "Brócolis",
          "quantity": "100g",
          "calories": 35,
          "protein": 3,
          "carbs": 7,
          "fat": 0
        }
      ]
    }
  ],
  "supplements": [
    {
      "name": "Vitamina D",
      "dosage": "2000 UI",
      "timing": "Café da manhã"
    },
    {
      "name": "Ômega 3",
      "dosage": "1000mg",
      "timing": "Almoço"
    }
  ],
  "hydration": {
    "dailyWater": 3.5,
    "unit": "liters"
  },
  "notes": "Aumentar carboidratos em dias de treino intenso"
}
```

### 2.2 Formato CSV Simplificado

**Exemplo: nutrition_log.csv**
```csv
Date,Meal,Calories,Protein,Carbs,Fat,Notes
2024-01-15,Breakfast,600,35,80,15,Pre-workout meal
2024-01-15,Lunch,800,65,85,20,Post-workout
2024-01-15,Snack,250,10,35,8,Mid-afternoon
2024-01-15,Dinner,650,50,60,22,Light dinner
```

## 3. Exames Físicos

### 3.1 Formato JSON Completo

**Exemplo: physical_exam.json**
```json
{
  "examDate": "2024-01-10",
  "examType": "Avaliação Física Completa",
  "anthropometry": {
    "weight": 75.5,
    "height": 178,
    "bmi": 23.8,
    "bodyFat": 12.5,
    "muscleMass": 62.3,
    "boneMass": 3.2,
    "visceralFat": 6,
    "bodyWater": 58.5,
    "metabolicAge": 28
  },
  "circumferences": {
    "chest": 98,
    "waist": 82,
    "hip": 95,
    "thigh": 56,
    "calf": 38,
    "arm": 34,
    "forearm": 28
  },
  "skinfolds": {
    "triceps": 8,
    "subscapular": 10,
    "suprailiac": 12,
    "abdominal": 14,
    "thigh": 11,
    "calf": 9
  },
  "cardiovascular": {
    "restingHeartRate": 58,
    "bloodPressure": {
      "systolic": 118,
      "diastolic": 75
    },
    "vo2max": 52,
    "recoveryHeartRate": 25
  },
  "bloodTests": {
    "testDate": "2024-01-08",
    "hemoglobin": 15.2,
    "hematocrit": 45.5,
    "glucose": 88,
    "cholesterol": {
      "total": 180,
      "hdl": 55,
      "ldl": 110,
      "vldl": 15
    },
    "triglycerides": 75,
    "creatinine": 1.0,
    "urea": 35,
    "alt": 25,
    "ast": 22,
    "vitaminD": 35,
    "iron": 95,
    "ferritin": 120,
    "testosterone": 650,
    "cortisol": 12.5,
    "tsh": 2.1
  },
  "performance": {
    "flexibilityTest": "Excelente",
    "sitAndReach": 35,
    "pushups": 45,
    "situps": 50,
    "plankTime": 180,
    "verticalJump": 55
  },
  "doctorNotes": "Atleta em excelente condição física. Manter rotina de treinos. Atenção à hidratação.",
  "recommendations": [
    "Manter treinos de força 3x/semana",
    "Incluir mais alongamentos",
    "Monitorar níveis de vitamina D",
    "Aumentar ingestão de ferro"
  ]
}
```

### 3.2 Formato CSV Simplificado

**Exemplo: exam_summary.csv**
```csv
Date,Weight,Body Fat,Muscle Mass,Resting HR,Blood Pressure,VO2 Max,Glucose,Cholesterol,Notes
2024-01-10,75.5,12.5,62.3,58,118/75,52,88,180,Excellent condition
2023-10-15,76.2,13.2,61.8,60,120/78,50,92,185,Good progress
2023-07-20,77.0,14.0,61.0,62,122/80,48,95,190,Start training plan
```

## 4. Treino Gerado pela IA

### 4.1 Formato de Resposta

**Exemplo: generated_training.json**
```json
{
  "generatedAt": "2024-01-15T10:00:00Z",
  "weekStartDate": "2024-01-22",
  "weekEndDate": "2024-01-28",
  "goal": "Melhorar resistência aeróbica e manter força",
  "aiAnalysis": {
    "currentFitness": "Atleta em bom nível de condicionamento. VO2max de 52 ml/kg/min indica capacidade aeróbica acima da média. Frequência cardíaca de repouso baixa (58 bpm) sugere boa adaptação cardiovascular. Composição corporal adequada (12.5% gordura). Últimas atividades mostram consistência no treino.",
    "recommendations": [
      "Manter volume de treino atual (4-5 sessões/semana)",
      "Incluir 1-2 sessões de treino intervalado para melhorar VO2max",
      "Adicionar trabalho de força 2x/semana para prevenir lesões",
      "Priorizar recuperação adequada entre treinos intensos",
      "Manter hidratação e nutrição alinhadas com volume de treino"
    ],
    "warnings": [
      "Body Battery tem estado abaixo de 70 nos últimos dias - atenção à recuperação",
      "Qualidade do sono variável - buscar consistência nas horas de sono"
    ],
    "trends": {
      "fitness": "Estável com leve tendência de melhora",
      "fatigue": "Moderado - gerenciável",
      "form": "Boa - manter consistência"
    }
  },
  "weeklyPlan": [
    {
      "day": 1,
      "dayName": "Segunda-feira",
      "focus": "Recuperação ativa",
      "workouts": [
        {
          "type": "Corrida leve",
          "duration": 40,
          "intensity": "Baixa (Zona 2)",
          "description": "Corrida contínua em ritmo confortável para recuperação ativa. Foque em manter FC na zona 2 (130-145 bpm).",
          "targetHeartRate": {
            "min": 130,
            "max": 145
          },
          "distance": "6-7 km",
          "pace": "6:00-6:30 min/km",
          "warmup": "5 min caminhada + 5 min trote leve",
          "cooldown": "5 min caminhada",
          "notes": "Se sentir fadiga, reduzir para 30 minutos ou substituir por caminhada"
        }
      ],
      "nutrition": {
        "preWorkout": "Banana + café 30min antes",
        "postWorkout": "Shake de proteína + carboidrato simples",
        "focus": "Hidratação adequada ao longo do dia"
      },
      "recovery": {
        "sleep": "7-8 horas",
        "stretching": "15 min após treino",
        "foam_rolling": "Opcional - foco em panturrilhas e quadríceps"
      }
    },
    {
      "day": 2,
      "dayName": "Terça-feira",
      "focus": "Força e condicionamento",
      "workouts": [
        {
          "type": "Treino de força",
          "duration": 60,
          "intensity": "Moderada-Alta",
          "description": "Treino funcional focado em membros inferiores e core",
          "exercises": [
            {
              "name": "Agachamento",
              "sets": 4,
              "reps": "8-10",
              "rest": "90s",
              "notes": "Peso moderado, foco na técnica"
            },
            {
              "name": "Levantamento terra",
              "sets": 3,
              "reps": "8-10",
              "rest": "90s"
            },
            {
              "name": "Afundo",
              "sets": 3,
              "reps": "10 cada perna",
              "rest": "60s"
            },
            {
              "name": "Prancha",
              "sets": 3,
              "duration": "60s",
              "rest": "45s"
            },
            {
              "name": "Russian twist",
              "sets": 3,
              "reps": "20 total",
              "rest": "45s"
            }
          ],
          "notes": "Priorizar forma sobre carga. Respiração controlada."
        }
      ],
      "nutrition": {
        "preWorkout": "Refeição completa 2h antes (carboidrato + proteína)",
        "postWorkout": "Refeição rica em proteína dentro de 1h",
        "focus": "Proteína adequada para recuperação muscular (30-40g)"
      }
    },
    {
      "day": 3,
      "dayName": "Quarta-feira",
      "focus": "Treino intervalado",
      "workouts": [
        {
          "type": "Corrida intervalada",
          "duration": 50,
          "intensity": "Alta (Zonas 3-4)",
          "description": "Treino de intervalos para melhorar VO2max e limiar anaeróbico",
          "structure": {
            "warmup": "15 min progressivo (zona 1-2)",
            "intervals": [
              {
                "work": "4 min em ritmo forte (zona 4)",
                "rest": "2 min trote leve (zona 1)",
                "repeats": 5
              }
            ],
            "cooldown": "10 min trote leve"
          },
          "targetHeartRate": {
            "intervals": {"min": 160, "max": 175},
            "recovery": {"min": 120, "max": 135}
          },
          "totalDistance": "8-9 km",
          "notes": "Intervalos devem ser desconfortáveis mas sustentáveis. Não começar muito rápido."
        }
      ],
      "nutrition": {
        "preWorkout": "Carboidrato de fácil digestão 45min antes",
        "duringWorkout": "Água + eletrólitos se >45min",
        "postWorkout": "Carboidrato + proteína (proporção 3:1)",
        "focus": "Reposição de glicogênio é crucial"
      }
    },
    {
      "day": 4,
      "dayName": "Quinta-feira",
      "focus": "Recuperação",
      "workouts": [
        {
          "type": "Descanso ativo ou yoga",
          "duration": 30,
          "intensity": "Muito baixa",
          "description": "Dia de recuperação. Opções: yoga, alongamento, caminhada leve ou descanso completo",
          "options": [
            "Yoga flow 30 min",
            "Caminhada 30-40 min",
            "Alongamento completo 20 min",
            "Descanso total"
          ],
          "notes": "Escute seu corpo. Se fadiga alta, opte por descanso completo."
        }
      ],
      "recovery": {
        "priority": "Máxima",
        "sleep": "8-9 horas",
        "massage": "Recomendado se disponível",
        "nutrition": "Foco em anti-inflamatórios naturais (ômega-3, frutas vermelhas)"
      }
    },
    {
      "day": 5,
      "dayName": "Sexta-feira",
      "focus": "Resistência aeróbica",
      "workouts": [
        {
          "type": "Corrida longa moderada",
          "duration": 70,
          "intensity": "Moderada (Zona 2-3)",
          "description": "Corrida contínua em ritmo confortável-moderado para desenvolver base aeróbica",
          "targetHeartRate": {
            "min": 140,
            "max": 155
          },
          "distance": "12-14 km",
          "pace": "5:30-6:00 min/km",
          "structure": {
            "warmup": "10 min progressivo",
            "main": "50 min ritmo constante",
            "cooldown": "10 min desaceleração"
          },
          "notes": "Ritmo conversacional. Deve conseguir manter conversa durante o treino."
        }
      ],
      "nutrition": {
        "preWorkout": "Refeição 2-3h antes + gel/banana 15min antes",
        "duringWorkout": "Água a cada 15-20min, gel se >60min",
        "postWorkout": "Refeição completa dentro de 30-45min",
        "focus": "Hidratação é crítica em treinos longos"
      }
    },
    {
      "day": 6,
      "dayName": "Sábado",
      "focus": "Força e mobilidade",
      "workouts": [
        {
          "type": "Treino de força upper body",
          "duration": 50,
          "intensity": "Moderada",
          "description": "Treino focado em membros superiores e core",
          "exercises": [
            {
              "name": "Flexão",
              "sets": 4,
              "reps": "12-15",
              "variations": "Normal, diamante, declinada"
            },
            {
              "name": "Pull-up ou remada",
              "sets": 4,
              "reps": "8-10"
            },
            {
              "name": "Shoulder press",
              "sets": 3,
              "reps": "10-12"
            },
            {
              "name": "Prancha lateral",
              "sets": 3,
              "duration": "45s cada lado"
            }
          ]
        }
      ]
    },
    {
      "day": 7,
      "dayName": "Domingo",
      "focus": "Recuperação e preparação",
      "workouts": [
        {
          "type": "Atividade livre ou descanso",
          "duration": 30,
          "intensity": "Baixa",
          "description": "Atividade leve opcional: caminhada, ciclismo leve, natação recreativa",
          "notes": "Foco em relaxamento e preparação mental para próxima semana"
        }
      ],
      "recovery": {
        "priority": "Alta",
        "activities": [
          "Planejamento da semana seguinte",
          "Preparação de refeições",
          "Revisão de equipamentos",
          "Sono adequado"
        ]
      }
    }
  ],
  "nutritionAdjustments": {
    "weeklyCalories": 2600,
    "trainingDays": {
      "calories": 2800,
      "carbs": 350,
      "protein": 160,
      "fat": 70
    },
    "restDays": {
      "calories": 2300,
      "carbs": 250,
      "protein": 150,
      "fat": 75
    },
    "timing": {
      "preWorkout": "Carboidrato 30-60min antes de treinos intensos",
      "postWorkout": "Proteína + carboidrato dentro de 30min",
      "beforeBed": "Caseína ou iogurte grego para recuperação noturna"
    },
    "hydration": {
      "daily": "3-4 litros",
      "duringWorkout": "500-750ml por hora",
      "electrolytes": "Adicionar em treinos >60min"
    }
  },
  "progressTracking": {
    "metrics": [
      "Frequência cardíaca de repouso",
      "Body Battery matinal",
      "Qualidade do sono",
      "Percepção de esforço (RPE)",
      "Peso corporal",
      "Níveis de energia"
    ],
    "goals": {
      "shortTerm": "Completar todos os treinos planejados",
      "mediumTerm": "Melhorar VO2max em 2-3 pontos",
      "longTerm": "Preparação para competição/evento"
    }
  }
}
```

## 5. Como Exportar Dados do Garmin Connect

### 5.1 Exportar Atividades

1. Acesse [Garmin Connect](https://connect.garmin.com)
2. Vá em "Atividades" > "Todas as atividades"
3. Clique no ícone de engrenagem (⚙️) > "Exportar para CSV"
4. Ou use a API: `https://connect.garmin.com/modern/proxy/download-service/export/csv/activity/{activityId}`

### 5.2 Exportar Métricas de Saúde

1. Acesse "Relatórios" no menu
2. Selecione o período desejado
3. Clique em "Exportar dados"
4. Escolha formato CSV

### 5.3 Formato Alternativo - Garmin Connect API

Se tiver acesso à API oficial:

```bash
# Exemplo de requisição
curl -X GET "https://apis.garmin.com/wellness-api/rest/activities" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 6. Validação de Dados

### 6.1 Regras de Validação

**Atividades:**
- Data não pode ser futura
- Duração > 0 minutos
- Distância >= 0 (se fornecida)
- FC média < FC máxima
- FC máxima <= 220 - idade (aproximado)

**Métricas:**
- FC repouso: 40-100 bpm (típico para atletas)
- HRV: 20-100 ms
- Sono: 0-12 horas
- Qualidade do sono: 0-100
- Estresse: 0-100
- Body Battery: 0-100
- Passos: 0-50000

**Nutrição:**
- Calorias > 0
- Macros somam aproximadamente as calorias
- Proteína: 0.8-3g/kg peso corporal
- Carboidratos: 2-10g/kg peso corporal
- Gordura: 0.5-2g/kg peso corporal

## 7. Exemplos de Uso da API

### 7.1 Importar Atividades

```bash
curl -X POST http://localhost:3001/api/import/garmin/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@activities.csv"
```

### 7.2 Gerar Treino

```bash
curl -X POST http://localhost:3001/api/training/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Melhorar resistência aeróbica",
    "weekStartDate": "2024-01-22"
  }'
```

### 7.3 Obter Dashboard

```bash
curl -X GET http://localhost:3001/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"