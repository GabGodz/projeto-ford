import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSetupService {

  constructor(private firebaseService: FirebaseService) {}

  // Configurar todas as coleções necessárias no Firebase
  async setupFirebaseCollections() {
    console.log('Iniciando configuração das coleções do Firebase...');
    
    try {
      await this.createUsersCollection();
      await this.createTrainingCollection();
      await this.createAssessmentsCollection();
      await this.createSystemConfigCollection();
      await this.createUserProgressCollection();
      await this.createPromptsCollection();
      
      console.log('✅ Todas as coleções foram configuradas com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao configurar coleções:', error);
      return false;
    }
  }

  // Coleção de Usuários
  private async createUsersCollection() {
    console.log('Configurando coleção: users');
    
    const sampleUsers = [
      {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@cnv.com',
        fullName: 'Administrador do Sistema',
        role: 'admin',
        trainingAccess: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        permissions: ['read', 'write', 'delete', 'admin']
      },
      {
        id: 'user-001',
        username: 'user',
        email: 'user@cnv.com',
        fullName: 'Usuário de Teste',
        role: 'user',
        trainingAccess: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        permissions: ['read']
      }
    ];

    for (const user of sampleUsers) {
      await this.firebaseService.addUser(user);
    }
  }

  // Coleção de Treinamentos
  private async createTrainingCollection() {
    console.log('Configurando coleção: trainings');
    
    const sampleTrainings = [
      {
        id: 'training-001',
        title: 'Introdução à Segurança Cibernética',
        description: 'Treinamento básico sobre conceitos fundamentais de segurança digital.',
        category: 'Segurança',
        difficulty: 'Iniciante',
        duration: 60, // minutos
        content: {
          modules: [
            {
              title: 'Conceitos Básicos',
              description: 'Introdução aos conceitos de segurança',
              duration: 20
            },
            {
              title: 'Ameaças Comuns',
              description: 'Tipos de ameaças digitais',
              duration: 20
            },
            {
              title: 'Boas Práticas',
              description: 'Como se proteger online',
              duration: 20
            }
          ]
        },
        createdAt: new Date(),
        createdBy: 'admin',
        isActive: true,
        tags: ['segurança', 'básico', 'introdução']
      },
      {
        id: 'training-002',
        title: 'Gestão de Senhas',
        description: 'Como criar e gerenciar senhas seguras.',
        category: 'Segurança',
        difficulty: 'Iniciante',
        duration: 30,
        content: {
          modules: [
            {
              title: 'Senhas Fortes',
              description: 'Características de uma senha segura',
              duration: 15
            },
            {
              title: 'Gerenciadores de Senha',
              description: 'Ferramentas para gerenciar senhas',
              duration: 15
            }
          ]
        },
        createdAt: new Date(),
        createdBy: 'admin',
        isActive: true,
        tags: ['senhas', 'segurança', 'ferramentas']
      }
    ];

    for (const training of sampleTrainings) {
      await this.firebaseService.addTraining(training);
    }
  }

  // Coleção de Avaliações
  private async createAssessmentsCollection() {
    console.log('Configurando coleção: assessments');
    
    const sampleAssessments = [
      {
        id: 'assessment-001',
        title: 'Teste de Personalidade - Liderança',
        description: 'Avaliação das características de liderança do usuário.',
        type: 'personality',
        category: 'Liderança',
        questions: [
          {
            id: 'q1',
            text: 'Você se considera uma pessoa que toma iniciativa?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'] }
          },
          {
            id: 'q2',
            text: 'Como você lida com conflitos em equipe?',
            type: 'multiple_choice',
            options: [
              'Evito conflitos',
              'Busco mediação',
              'Enfrento diretamente',
              'Delego para outros'
            ]
          },
          {
            id: 'q3',
            text: 'Descreva uma situação onde você demonstrou liderança.',
            type: 'text',
            maxLength: 500
          }
        ],
        scoring: {
          dimensions: ['Iniciativa', 'Comunicação', 'Resolução de Conflitos'],
          weights: { q1: 0.4, q2: 0.4, q3: 0.2 }
        },
        createdAt: new Date(),
        createdBy: 'admin',
        isActive: true
      },
      {
        id: 'assessment-002',
        title: 'Avaliação de Conhecimento - Segurança',
        description: 'Teste de conhecimentos básicos em segurança digital.',
        type: 'knowledge',
        category: 'Segurança',
        questions: [
          {
            id: 'q1',
            text: 'O que é phishing?',
            type: 'multiple_choice',
            options: [
              'Um tipo de vírus',
              'Técnica de engenharia social',
              'Software antivírus',
              'Protocolo de segurança'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'Qual é a principal característica de uma senha forte?',
            type: 'multiple_choice',
            options: [
              'Ser fácil de lembrar',
              'Conter apenas números',
              'Ter pelo menos 8 caracteres com letras, números e símbolos',
              'Ser baseada em informações pessoais'
            ],
            correctAnswer: 2
          }
        ],
        scoring: {
          passingScore: 70,
          totalPoints: 100
        },
        createdAt: new Date(),
        createdBy: 'admin',
        isActive: true
      }
    ];

    for (const assessment of sampleAssessments) {
      await this.firebaseService.addAssessment(assessment);
    }
  }

  // Coleção de Configurações do Sistema
  private async createSystemConfigCollection() {
    console.log('Configurando coleção: system_config');
    
    const systemConfig = {
      id: 'main-config',
      appName: 'Sistema de Treinamento CNV',
      version: '1.0.0',
      features: {
        userRegistration: true,
        trainingModules: true,
        assessments: true,
        geminiIntegration: true,
        adminDashboard: true
      },
      limits: {
        maxUsersPerAdmin: 100,
        maxTrainingsPerUser: 50,
        maxAssessmentsPerUser: 20,
        sessionTimeout: 3600 // segundos
      },
      geminiConfig: {
        model: 'gemini-2.0-flash-exp',
        maxTokens: 1000,
        temperature: 0.7,
        apiKey: 'AIzaSyBkQJZ8X9X9X9X9X9X9X9X9X9X9X9X9X9X' // Substitua pela sua chave real
      },
      emailConfig: {
        enabled: false,
        smtpServer: '',
        port: 587,
        username: '',
        password: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.firebaseService.addDocument('system_config', systemConfig.id, systemConfig);
  }

  // Coleção de Progresso do Usuário
  private async createUserProgressCollection() {
    console.log('Configurando coleção: user_progress');
    
    const sampleProgress = [
      {
        id: 'progress-user-001',
        userId: 'user-001',
        trainings: {
          'training-001': {
            status: 'in_progress',
            progress: 60,
            startedAt: new Date(),
            lastAccessedAt: new Date(),
            completedModules: ['module-1'],
            timeSpent: 1200 // segundos
          }
        },
        assessments: {
          'assessment-002': {
            status: 'completed',
            score: 85,
            completedAt: new Date(),
            attempts: 1,
            timeSpent: 600
          }
        },
        achievements: [
          {
            id: 'first-training',
            name: 'Primeiro Treinamento',
            description: 'Completou o primeiro treinamento',
            earnedAt: new Date()
          }
        ],
        statistics: {
          totalTrainings: 1,
          completedTrainings: 0,
          totalAssessments: 1,
          completedAssessments: 1,
          averageScore: 85,
          totalTimeSpent: 1800
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const progress of sampleProgress) {
      await this.firebaseService.addDocument('user_progress', progress.id, progress);
    }
  }

  // Coleção de Prompts para IA
  private async createPromptsCollection() {
    console.log('Configurando coleção: prompts');
    
    const prompts = [
      {
        id: 'generate_questions',
        name: 'Geração de Perguntas',
        prompt: `Você é um especialista em Comunicação Não Violenta (CNV) e criação de conteúdo educacional. Crie 10 perguntas de múltipla escolha sobre CNV que testem o conhecimento e aplicação prática dos conceitos.

Cada pergunta deve:
1. Ter um cenário realista
2. 4 opções de resposta
3. Uma resposta correta clara
4. Focar em situações práticas de comunicação

Retorne no formato JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Pergunta aqui",
      "scenario": "Cenário da situação",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": 0,
      "explanation": "Explicação da resposta correta",
      "category": "Categoria da pergunta"
    }
  ]
}`,
        category: 'assessment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'generate_training',
        name: 'Geração de Treinamento',
        prompt: `Você é um especialista em Comunicação Não Violenta (CNV) e design instrucional. Crie um cenário de treinamento completo e envolvente.

O treinamento deve incluir:
1. Descrição detalhada do cenário
2. Análise usando os 4 componentes da CNV (Observação, Sentimentos, Necessidades, Pedidos)
3. Exercícios práticos
4. Perguntas para reflexão

Foque em situações realistas do dia a dia onde a CNV pode ser aplicada.`,
        category: 'training',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'analyze_personality',
        name: 'Análise de Personalidade',
        prompt: `Você é um psicólogo especializado em análise de personalidade e comunicação. Com base nas respostas fornecidas, faça uma análise detalhada do perfil de comunicação da pessoa.

Analise:
1. Estilo de comunicação predominante
2. Abordagem para resolução de conflitos
3. Nível de empatia demonstrado
4. Como a pessoa responde ao estresse
5. Recomendações específicas para desenvolvimento

Seja construtivo e ofereça insights práticos para melhoria.`,
        category: 'analysis',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const prompt of prompts) {
      await this.firebaseService.addDocument('prompts', prompt.id, prompt);
    }
  }

  // Método para verificar se as coleções existem
  async checkCollectionsExist(): Promise<boolean> {
    try {
      const collections = ['users', 'trainings', 'assessments', 'system_config', 'user_progress', 'prompts'];
      
      for (const collection of collections) {
        const docs = await this.firebaseService.getCollection(collection);
        console.log(`Coleção ${collection}: ${docs.length} documentos`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar coleções:', error);
      return false;
    }
  }

  // Método para limpar todas as coleções (usar com cuidado!)
  async clearAllCollections(): Promise<boolean> {
    const confirmation = confirm('⚠️ ATENÇÃO: Isso irá deletar TODOS os dados do Firebase. Tem certeza?');
    
    if (!confirmation) {
      return false;
    }

    try {
      const collections = ['users', 'trainings', 'assessments', 'system_config', 'user_progress', 'prompts'];
      
      for (const collection of collections) {
        await this.firebaseService.clearCollection(collection);
        console.log(`Coleção ${collection} limpa`);
      }
      
      console.log('✅ Todas as coleções foram limpas');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar coleções:', error);
      return false;
    }
  }
}