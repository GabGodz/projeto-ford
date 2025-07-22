import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  scenario: string;
  explanation?: string;
  category?: string;
}

export interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'workplace' | 'family' | 'social' | 'conflict';
  questions: AssessmentQuestion[];
}

export interface PersonalityProfile {
  personalityType: string;
  strengths: string;
  improvements: string;
  dominantTraits: string[];
  communicationStyle: string;
  conflictResolution: string;
  empathyLevel: string;
  stressResponse: string;
  learningPreferences: string[];
  recommendedScenarios: string[];
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private API_KEY = '';
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
  private apiKeyLoaded = false;

  constructor(private firebaseService: FirebaseService) {
    this.loadApiKey();
  }

  private async loadApiKey(): Promise<void> {
    try {
      const configCollection = await this.firebaseService.getCollection('config');
      if (configCollection && configCollection.length > 0) {
        const geminiConfig = configCollection.find((config: any) => config.id === 'gemini');
        if (geminiConfig && geminiConfig.apiKey) {
          this.API_KEY = geminiConfig.apiKey;
          this.apiKeyLoaded = true;
          console.log('Chave de API do Gemini carregada com sucesso');
        } else {
          console.warn('Configuração do Gemini não encontrada na coleção config');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar chave de API do Gemini:', error);
    }
  }

  private async ensureApiKey(): Promise<void> {
    if (!this.apiKeyLoaded) {
      await this.loadApiKey();
    }
    if (!this.API_KEY) {
      throw new Error('Chave de API do Gemini não configurada. Verifique a configuração do sistema.');
    }
  }

  setApiKey(apiKey: string) {
    this.API_KEY = apiKey;
  }

  private async getPrompt(promptId: string): Promise<string> {
    try {
      const prompts = await this.firebaseService.getCollection('prompts');
      const promptDoc = prompts.find(p => (p as any).id === promptId);
      if (promptDoc) {
        // Verificar se o documento tem o campo 'prompt' ou 'content'
        if ((promptDoc as any).prompt) {
          return (promptDoc as any).prompt;
        } else if ((promptDoc as any).content) {
          return (promptDoc as any).content;
        }
      }
      throw new Error(`Prompt '${promptId}' não encontrado no Firebase`);
    } catch (error) {
      console.error('Erro ao carregar prompt do Firebase:', error);
      throw error;
    }
  }



  async generateInitialAssessment(category?: string): Promise<AssessmentQuestion[]> {
    try {
      console.log('Iniciando geração de perguntas com categoria:', category);
      await this.ensureApiKey();
      console.log('API Key verificada com sucesso');
      
      // Mapear categoria para o ID do prompt correspondente
      const promptMap: { [key: string]: string } = {
        'workplace': 'generate_questions_workplace',
        'family': 'generate_questions_family',
        'relationships': 'generate_questions_relationships',
        'self_awareness': 'generate_questions_self_awareness',
        'social': 'generate_questions_social',
        'conflict': 'generate_questions_conflict'
      };
      
      // Se categoria não for especificada ou não existir, usar o prompt geral
      const promptId = category && promptMap[category] ? promptMap[category] : 'generate_questions';
      console.log('Prompt ID selecionado:', promptId);
      
      const prompt = await this.getPrompt(promptId);
      console.log('Prompt carregado com sucesso, tamanho:', prompt.length);
      
      const response = await this.callGeminiAPI(prompt);
      console.log('Resposta da API Gemini recebida, tamanho:', response.length);
      
      const result = this.parseAssessmentResponse(response);
      console.log('Perguntas parseadas com sucesso, quantidade:', result.length);
      
      return result;
    } catch (error) {
      console.error('Erro detalhado na geração de perguntas:', error);
      throw error;
    }
  }

  async generateTrainingScenario(title: string, category: string, description?: string): Promise<any> {
    await this.ensureApiKey();
    const prompt = await this.getPrompt('generate_training');
    
    const fullPrompt = `${prompt}

Título: ${title}
Categoria: ${category}
Descrição: ${description || 'Não fornecida'}

Crie um cenário completo de treinamento em formato JSON com a seguinte estrutura:
{
  "title": "${title}",
  "category": "${category}",
  "description": "Descrição detalhada",
  "content": {
    "introduction": "Introdução ao tema",
    "scenario": "Situação prática detalhada",
    "cnvAnalysis": "Análise usando os 4 componentes da CNV",
    "exercises": ["Exercício 1", "Exercício 2"],
    "reflection": "Perguntas para reflexão"
  },
  "duration": 30,
  "difficulty": "intermediario"
}`;

    try {
       const response = await this.callGeminiAPI(fullPrompt);
       
       console.log('Resposta bruta do Gemini:', response);
       
       const jsonMatch = response.match(/\{[\s\S]*\}/);
       if (jsonMatch) {
         const jsonStr = jsonMatch[0];
         const trainingData = JSON.parse(jsonStr);
         return trainingData;
       } else {
         throw new Error('Resposta não contém JSON válido');
       }
     } catch (error) {
       console.error('Erro ao gerar cenário de treinamento:', error);
       throw error;
     }
  }

  async analyzePersonality(answers: string[] | number[]): Promise<PersonalityProfile> {
    await this.ensureApiKey();
    const basePrompt = await this.getPrompt('analyze_personality');
    
    const prompt = `${basePrompt}

Respostas do usuário: ${JSON.stringify(answers)}

IMPORTANTE: Responda APENAS com um objeto JSON válido, sem texto adicional antes ou depois. Use exatamente este formato:

{
  "communicationStyle": "Descrição do estilo de comunicação",
  "conflictResolution": "Abordagem para resolução de conflitos",
  "empathyLevel": "Nível de empatia demonstrado",
  "stressResponse": "Como responde ao estresse",
  "recommendations": ["Recomendação 1", "Recomendação 2", "Recomendação 3"]
}`;

    console.log('Prompt enviado para análise de personalidade:', prompt);
    const response = await this.callGeminiAPI(prompt);
    return this.parsePersonalityResponse(response);
  }



  private async callGeminiAPI(prompt: string): Promise<any> {
    const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private parseAssessmentResponse(response: string): AssessmentQuestion[] {
    try {
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Resposta da IA não contém array de perguntas válido');
      }
      return parsed.questions;
    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      throw new Error('Falha ao processar resposta da IA para geração de perguntas');
    }
  }

  private parsePersonalityResponse(response: string): PersonalityProfile {
    try {
      console.log('Resposta bruta da API para análise de personalidade:', response);
      
      // Tentar extrair JSON da resposta
      let jsonStr = response;
      
      // Remover markdown code blocks se existirem
      jsonStr = jsonStr.replace(/```json|```/g, '').trim();
      
      // Tentar encontrar JSON válido na resposta
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
        console.log('JSON extraído:', jsonStr);
      } else {
        console.log('Nenhum JSON encontrado na resposta, tentando parse direto');
      }
      
      const parsed = JSON.parse(jsonStr);
      console.log('JSON parseado com sucesso:', parsed);
      
      if (!parsed.communicationStyle || !parsed.conflictResolution) {
        throw new Error('Resposta da IA não contém dados de personalidade válidos');
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      console.error('Resposta que causou o erro:', response.substring(0, 200) + '...');
      throw new Error('Falha ao processar resposta da IA para análise de personalidade');
    }
  }

  private parseTrainingResponse(response: string): TrainingScenario {
    try {
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      if (!parsed.title || !parsed.category) {
        throw new Error('Resposta da IA não contém dados de treinamento válidos');
      }
      return {
        id: Date.now().toString(),
        ...parsed
      };
    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      throw new Error('Falha ao processar resposta da IA para geração de treinamento');
    }
  }

  // Método para gerar avaliação de personalidade
  async generatePersonalityAssessment(): Promise<AssessmentQuestion[]> {
    // Este método chama o generateInitialAssessment com a categoria 'self_awareness'
    return this.generateInitialAssessment('self_awareness');
  }

}