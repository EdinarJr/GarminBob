# 🏥 Guia de Funcionalidades Clínicas - Garmin Training AI

## Visão Geral

O sistema agora inclui funcionalidades completas de análise clínica, permitindo importar e correlacionar dados médicos, nutricionais e de treino para gerar recomendações personalizadas usando IA local.

## 📋 Funcionalidades Implementadas

### 1. Importação de Dados Clínicos

#### Medicamentos 💊
- Importação de medicamentos prescritos pelo endocrinologista
- Campos: nome, dosagem, frequência, prescritor, data de início/fim, objetivo
- Formatos: JSON, CSV

#### Suplementos 🧪
- Importação de suplementos indicados
- Campos: nome, dosagem, frequência, prescritor, timing, objetivo
- Formatos: JSON, CSV

#### Exames Laboratoriais 🔬
- Importação de resultados de exames
- Detecção automática de valores fora da referência
- Alertas sobre marcadores preocupantes
- Formato: JSON

#### Treinos do Educador Físico 🏋️
- Importação de planos de treino prescritos
- Programação semanal detalhada
- Exercícios com séries, repetições e cargas
- Formato: JSON

#### Planos Nutricionais 🥗
- Importação de planos nutricionais completos
- Calorias diárias e macronutrientes
- Refeições detalhadas
- Formato: JSON

### 2. Análise Clínica Completa

#### Tendências de Exames 📈
- Gráficos históricos de cada marcador
- Identificação automática de tendências (melhorando/piorando/estável)
- Cálculo de variação percentual
- Visualização interativa com Recharts

#### Correlações Inteligentes 🔗
- **Nutrição x Exames**: Impacto da alimentação nos marcadores
- **Treinos x Exames**: Efeito dos exercícios na saúde
- **Medicamentos x Exames**: Eficácia dos tratamentos
- **Suplementos x Performance**: Benefícios dos suplementos

#### Score de Saúde 💯
- Pontuação geral de 0-100
- Baseado em tendências e alertas
- Visualização em gráfico circular

#### Recomendações Personalizadas 🎯
- **Nutricionais**: Ajustes na dieta baseados em exames
- **Treinos**: Modificações no plano de exercícios
- **Médicas**: Sugestões para acompanhamento

### 3. Integração com IA (Ollama)

#### Análise Inteligente 🧠
- Processamento de todos os dados com IA local
- Identificação de padrões complexos
- Recomendações baseadas em evidências
- Insights personalizados

#### Modelos Suportados
- Llama 3
- Mistral
- Outros modelos compatíveis com Ollama

## 🚀 Como Usar

### Passo 1: Importar Dados Clínicos

1. Acesse `/dados-clinicos`
2. Selecione o tipo de dado (medicamentos, suplementos, exames, etc.)
3. Faça upload do arquivo JSON ou CSV
4. Aguarde a confirmação de importação

### Passo 2: Gerar Análise Clínica

1. Acesse `/analise-clinica`
2. Clique em "Gerar Análise" ou "Atualizar Análise"
3. O sistema irá:
   - Buscar todos os dados do período
   - Analisar tendências dos exames
   - Calcular correlações
   - Gerar recomendações
   - Processar com IA (se disponível)

### Passo 3: Visualizar Resultados

#### Dashboard Principal
- Score geral de saúde
- Tendências dos exames com gráficos
- Alertas importantes
- Recomendações por categoria

#### Histórico de Marcadores
- Selecione um marcador específico
- Visualize a evolução ao longo do tempo
- Compare com valores de referência

## 📊 Formatos de Arquivo

### Exemplo: Medicamentos (JSON)
```json
[
  {
    "name": "Levotiroxina",
    "dosage": "50mcg",
    "frequency": "1x ao dia",
    "prescribedBy": "Dr. João Silva",
    "startDate": "2024-01-15",
    "purpose": "Hipotireoidismo",
    "notes": "Tomar em jejum"
  }
]
```

### Exemplo: Exames Laboratoriais (JSON)
```json
[
  {
    "examDate": "2024-06-01",
    "examType": "Hormonal",
    "requestedBy": "Dr. João Silva",
    "laboratory": "Lab XYZ",
    "results": {
      "testosterone": 450,
      "tsh": 2.5,
      "t4_livre": 1.2,
      "vitamin_d": 35
    },
    "referenceValues": {
      "testosterone": { "min": 300, "max": 1000 },
      "tsh": { "min": 0.5, "max": 4.5 },
      "t4_livre": { "min": 0.8, "max": 1.8 },
      "vitamin_d": { "min": 30, "max": 100 }
    }
  }
]
```

### Exemplo: Plano Nutricional (JSON)
```json
{
  "name": "Plano de Ganho de Massa",
  "startDate": "2024-06-01",
  "endDate": "2024-09-01",
  "dailyCalories": 2800,
  "macros": {
    "protein": 180,
    "carbs": 350,
    "fat": 80
  },
  "meals": [
    {
      "name": "Café da Manhã",
      "time": "07:00",
      "foods": ["Ovos", "Aveia", "Banana"],
      "calories": 600
    }
  ]
}
```

## 🔧 Endpoints da API

### Importação
```
POST /api/clinical/import/medications
POST /api/clinical/import/supplements
POST /api/clinical/import/lab-exams
POST /api/clinical/import/trainer-workouts
POST /api/clinical/import/nutrition-plan
```

### Consulta
```
GET /api/clinical/medications
GET /api/clinical/supplements
GET /api/clinical/lab-exams
GET /api/clinical/lab-exams/marker/:marker/history
```

### Análise
```
POST /api/analysis/generate
GET /api/analysis/latest
GET /api/analysis/history
GET /api/analysis/:id
```

## 🎯 Casos de Uso

### 1. Monitoramento de Testosterona
- Importe exames hormonais periódicos
- Visualize tendência da testosterona
- Correlacione com treinos de força
- Receba recomendações de ajuste

### 2. Otimização Nutricional
- Importe plano nutricional
- Importe exames de glicose e colesterol
- Analise impacto da dieta nos marcadores
- Ajuste macros conforme recomendações

### 3. Controle de Medicamentos
- Registre medicamentos prescritos
- Monitore efeitos nos exames
- Identifique necessidade de ajustes
- Acompanhe eficácia do tratamento

### 4. Performance Atlética
- Combine dados de treino Garmin
- Adicione treinos do educador físico
- Correlacione com exames de performance
- Otimize periodização

## 🔒 Segurança e Privacidade

- Todos os dados são armazenados localmente
- IA processa dados localmente (Ollama)
- Nenhum dado é enviado para servidores externos
- Backup recomendado do banco de dados PostgreSQL

## 📈 Próximas Melhorias

- [ ] Exportação de relatórios em PDF
- [ ] Integração com wearables adicionais
- [ ] Alertas automáticos por email
- [ ] Compartilhamento com profissionais de saúde
- [ ] Machine Learning para predições
- [ ] App mobile nativo

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend
2. Confirme que o Ollama está rodando
3. Valide o formato dos arquivos JSON/CSV
4. Consulte a documentação da API

## 📝 Notas Importantes

⚠️ **Aviso Médico**: Este sistema é uma ferramenta de apoio e não substitui consultas médicas profissionais. Sempre consulte seu médico antes de fazer mudanças significativas em medicamentos, dieta ou treinos.

✅ **Boas Práticas**:
- Mantenha dados atualizados
- Faça backups regulares
- Revise recomendações com profissionais
- Use dados reais e precisos
- Gere análises periodicamente (mensal/trimestral)

---

**Desenvolvido com Bob** 🤖