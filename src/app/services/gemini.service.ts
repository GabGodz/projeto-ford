import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  scenario: string;
  choices: Choice[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  createdAt: Date;
}

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TrainingProgress {
  userId: string;
  scenarioId: string;
  completed: boolean;
  score: number;
  choicesMade: string[];
  completedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  constructor(private http: HttpClient) {}

  async generateTrainingScenario(topic: string, difficulty: string): Promise<TrainingScenario> {
    const prompt = `
      Crie um cenário de treinamento em RPG para ensinar Comunicação Não Violenta (CNV) sobre o tópico: ${topic}.
      Dificuldade: ${difficulty}
      
      O cenário deve incluir:
      1. Um título atrativo
      2. Uma descrição breve do contexto
      3. Uma situação detalhada onde o jogador precisa aplicar CNV
      4. 4 opções de resposta/ação
      5. Para cada opção, inclua:
         - O texto da escolha
         - A consequência dessa escolha
         - Se é a resposta mais alinhada com CNV (isCorrect)
         - Uma explicação educativa
      
      Responda APENAS em formato JSON válido seguindo esta estrutura:
      {
        "title": "Título do cenário",
        "description": "Descrição breve",
        "scenario": "Situação detalhada",
        "choices": [
          {
            "id": "1",
            "text": "Opção 1",
            "consequence": "Consequência da opção 1",
            "isCorrect": true/false,
            "explanation": "Explicação educativa"
          }
        ],
        "topic": "${topic}"
      }
    `;

    try {
      const response = await this.callGeminiAPI(prompt);
      const scenarioData = JSON.parse(response);
      
      return {
        id: this.generateId(),
        ...scenarioData,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Erro ao gerar cenário:', error);
      throw new Error('Falha ao gerar cenário de treinamento');
    }
  }

  async generateFeedback(userChoices: string[], scenario: TrainingScenario, isCorrect: boolean): Promise<string> {
    const correctnessText = isCorrect ? 'CORRETA' : 'INCORRETA';
    const prompt = `
      Baseado no cenário de CNV: "${scenario.title}"
      E nas escolhas do usuário: ${userChoices.join(', ')}
      
      A escolha do usuário foi: ${correctnessText}
      
      Forneça um feedback humanizado e crítico construtivo. Seja direto e honesto sobre o desempenho do usuário.
      
      IMPORTANTE: 
      - NÃO use formatação como negrito, itálico, traços ou símbolos especiais
      - Use apenas texto simples
      - Seja crítico mas construtivo
      - Fale como um mentor experiente em CNV
      - Se a escolha foi CORRETA, parabenize e explique por que foi uma boa escolha, mas também sugira refinamentos
      - Se a escolha foi INCORRETA, explique claramente por que não foi ideal e como melhorar
      - Adapte o tom baseado na correção da escolha
      
      Responda em português brasileiro com tom humano e direto.
    `;

    try {
      return await this.callGeminiAPI(prompt);
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      return 'Obrigado por completar o treinamento! Continue praticando os princípios da CNV.';
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    const url = `${this.apiUrl}?key=${environment.geminiApiKey}`;

    try {
      const response = await this.http.post<any>(url, body, { headers }).toPromise();
      let responseText = response.candidates[0].content.parts[0].text;
      
      // Limpar formatação de markdown se presente
      responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      return responseText;
    } catch (error) {
      console.error('Erro na chamada da API Gemini:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getAvailableTopics(): string[] {
    return [
      'Resolução de Conflitos',
      'Comunicação em Equipe',
      'Feedback Construtivo',
      'Gestão de Emoções',
      'Escuta Ativa',
      'Expressão de Necessidades',
      'Empatia no Trabalho',
      'Negociação Colaborativa',
      'Liderança Compassiva',
      'Comunicação com Clientes'
    ];
  }

  getDifficultyLevels(): { value: string, label: string, description: string }[] {
    return [
      {
        value: 'beginner',
        label: 'Iniciante',
        description: 'Conceitos básicos de CNV'
      },
      {
        value: 'intermediate',
        label: 'Intermediário',
        description: 'Aplicação prática em situações comuns'
      },
      {
        value: 'advanced',
        label: 'Avançado',
        description: 'Cenários complexos e desafiadores'
      }
    ];
  }
}