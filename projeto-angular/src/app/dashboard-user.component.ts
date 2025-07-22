import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from './auth.service';
import { GeminiService, AssessmentQuestion } from './gemini.service';
import { FirebaseService } from './firebase.service';
import { InteractiveQuizComponent, QuizQuestion, QuizResult } from './interactive-quiz.component';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveQuizComponent],
  templateUrl: './dashboard-user.component.html'
})
export class DashboardUserComponent implements OnInit {
  currentUser: User | null = null;
  hasTrainingAccess = false;
  hasCompletedAssessment = false;
  isLoadingAssessment = false;
  assessmentQuestions: AssessmentQuestion[] = [];
  currentQuestionIndex = 0;
  answers: string[] = [];
  currentAnswer: string | null = null;
  assessmentCompleted = false;
  userFeedback: any = null;
  availableTrainings: any[] = [];
  pendingTrainings: any[] = [];
  completedTrainings: any[] = [];
  trainingFeedbacks: any[] = [];
  currentTraining: any = null;
  quizQuestions: QuizQuestion[] = [];
  quizCompleted = false;
  quizResult: QuizResult | null = null;
  
  // Atividades recentes (simuladas)
  recentActivities = [
    { type: 'assessment', title: 'Avaliação de Personalidade', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { type: 'training', title: 'Introdução à CNV', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'certificate', title: 'Certificado: Fundamentos de CNV', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
  ];
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private geminiService: GeminiService,
    private firebaseService: FirebaseService
  ) {}
  
  async ngOnInit() {
    try {
      // Obter usuário atual
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        console.error('Nenhum usuário logado');
        this.router.navigate(['/login']);
        return;
      }
      
      console.log('Usuário logado:', this.currentUser);
      
      // Verificar acesso a treinamentos
      this.hasTrainingAccess = this.currentUser.trainingAccess ?? false;
      
      if (this.hasTrainingAccess) {
        // Carregar treinamentos disponíveis
        await this.loadTrainings();
      }
      
      // Verificar se o usuário já completou a avaliação inicial
      await this.checkAssessmentStatus();
      
    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      alert(`Erro ao carregar dashboard: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  async checkAssessmentStatus() {
    try {
      // Verificar se o usuário já completou a avaliação inicial
      // Por enquanto, vamos apenas verificar se há alguma avaliação no Firebase
      const assessments = await this.firebaseService.getAssessmentsByUser(this.currentUser!.id!);
      this.hasCompletedAssessment = assessments.length > 0;
      
      console.log('Status da avaliação:', this.hasCompletedAssessment ? 'Completada' : 'Pendente');
      
      // Se não completou, carregar perguntas da avaliação
      if (!this.hasCompletedAssessment) {
        await this.loadAssessmentQuestions();
      }
    } catch (error) {
      console.error('Erro ao verificar status da avaliação:', error);
      // Se houver erro, assumimos que não completou
      this.hasCompletedAssessment = false;
    }
  }
  
  async loadAssessmentQuestions() {
    try {
      this.isLoadingAssessment = true;
      
      // Carregar perguntas da avaliação usando o serviço Gemini
      this.assessmentQuestions = await this.geminiService.generatePersonalityAssessment();
      
      // Inicializar array de respostas com o mesmo tamanho das perguntas
      this.answers = new Array(this.assessmentQuestions.length).fill('');
      
      console.log('Perguntas de avaliação carregadas:', this.assessmentQuestions.length);
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
      this.assessmentQuestions = [];
      alert(`Erro ao carregar avaliação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.isLoadingAssessment = false;
    }
  }
  
  startAssessment() {
    // Resetar estado da avaliação
    this.currentQuestionIndex = 0;
    this.answers = new Array(this.assessmentQuestions.length).fill('');
    this.currentAnswer = null;
    this.assessmentCompleted = false;
    this.userFeedback = null;
  }
  
  answerQuestion(answer: string) {
    // Salvar resposta atual
    this.answers[this.currentQuestionIndex] = answer;
    this.currentAnswer = answer;
    
    // Avançar para próxima pergunta ou finalizar
    if (this.currentQuestionIndex < this.assessmentQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.currentAnswer = this.answers[this.currentQuestionIndex] ?? null;
    } else {
      // Todas as perguntas respondidas
      this.completeAssessment();
    }
  }
  
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentAnswer = this.answers[this.currentQuestionIndex] ?? null;
    }
  }
  
  async completeAssessment() {
    try {
      console.log('Iniciando análise de personalidade com respostas:', this.answers);
      
      // Analisar respostas com IA
      const analysis = await this.geminiService.analyzePersonality(this.answers);
      
      console.log('Análise de personalidade concluída:', analysis);
      
      this.userFeedback = {
        personalityType: analysis.communicationStyle,
        strengths: Array.isArray(analysis.recommendations) ? analysis.recommendations.join(', ') : analysis.recommendations,
        improvements: analysis.conflictResolution
      };
      
      // Salvar no Firebase
      const assessmentData = {
        userId: this.currentUser!.id!,
        username: this.currentUser!.username,
        answers: this.answers,
        analysis: analysis,
        completedAt: new Date()
      };
      
      await this.firebaseService.addAssessment(assessmentData);
      
      console.log('Avaliação salva no Firebase com sucesso');
      
      this.assessmentCompleted = true;
      this.hasCompletedAssessment = true;
      
      // Carregar treinamentos após completar avaliação
      await this.loadTrainings();
    } catch (error) {
      console.error('Erro ao completar avaliação:', error);
      alert(`Erro ao processar avaliação: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique a configuração da IA.`);
    }
  }
  
  async loadTrainings() {
    try {
      // Carregar todos os treinamentos disponíveis
      const allTrainings = await this.firebaseService.getAllTrainings();
      
      // Converter Timestamps para objetos Date
      const convertedTrainings = allTrainings.map(training => ({
        ...training,
        createdAt: this.convertTimestampToDate(training.createdAt)
      }));
      
      console.log('Usuário atual:', this.currentUser);
      console.log('Treinamentos atribuídos:', this.currentUser?.assignedTrainings);
      console.log('Todos os treinamentos:', convertedTrainings);
      
      // Filtrar apenas os treinamentos atribuídos ao usuário
      if (this.currentUser?.assignedTrainings && this.currentUser.assignedTrainings.length > 0) {
        this.availableTrainings = convertedTrainings.filter(training => 
          this.currentUser!.assignedTrainings!.includes(training.id)
        );
        
        // Separar treinamentos pendentes (não concluídos) dos concluídos
        this.pendingTrainings = this.availableTrainings.filter(training => !training.completed);
      } else {
        this.availableTrainings = [];
        this.pendingTrainings = [];
      }
      
      // Carregar feedbacks de treinamentos
      await this.loadTrainingFeedbacks();
      
      console.log('Treinamentos carregados:', this.availableTrainings);
      console.log('Treinamentos pendentes:', this.pendingTrainings);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      throw new Error(`Erro ao carregar treinamentos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  async loadTrainingFeedbacks() {
    try {
      // Carregar feedbacks reais do Firebase (apenas se existirem)
      // Por enquanto, não há feedbacks reais, então deixamos vazio
      this.trainingFeedbacks = [];
      
      // TODO: Implementar busca real de feedbacks quando o sistema de feedback estiver pronto
      // const feedbacks = await this.firebaseService.getTrainingFeedbacksByUser(this.currentUser!.id!);
      // this.trainingFeedbacks = feedbacks;
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
      this.trainingFeedbacks = [];
    }
  }
  
  startTraining(training: any) {
    this.currentTraining = training;
    this.quizQuestions = training.questions;
    this.quizCompleted = false;
    this.quizResult = null;
  }
  
  cancelTraining() {
    this.currentTraining = null;
    this.quizQuestions = [];
    this.quizCompleted = false;
    this.quizResult = null;
  }
  
  async onQuizComplete(result: QuizResult) {
    this.quizCompleted = true;
    this.quizResult = result;
    
    if (this.currentTraining && this.currentUser) {
      // Marcar treinamento como concluído
      const trainingResult = {
        userId: this.currentUser.id!,
        trainingId: this.currentTraining.id,
        score: result.score,
        passed: result.score >= 70, // Consideramos aprovado com 70% ou mais
        answers: result.answers,
        completedAt: new Date(),
        duration: result.duration
      };
      
      // Salvar resultado no Firebase
      await this.firebaseService.addTrainingResult(trainingResult);
      
      // Show completion message
      alert(`Parabéns! Você completou o treinamento "${this.currentTraining.title}" com ${result.score}% de aproveitamento.`);
    }
    
    this.currentTraining = null;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // Função para converter Timestamp do Firestore para Date
  convertTimestampToDate(timestamp: any): Date {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000);
    }
    return timestamp;
  }
}