import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { GeminiService } from './gemini.service';
import { User } from './auth.service';
import { InteractiveQuizComponent } from './interactive-quiz.component';
@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveQuizComponent],
  templateUrl: './dashboard-admin/dashboard-admin-main.template.html'
})
export class DashboardAdminComponent implements OnInit {
  currentUser: User | null = null;
  activeTab = 'users';
  users: User[] = [];
  assessmentReports: any[] = [];
  trainings: any[] = [];
  personalityReports: any[] = [];
  showCategoryDropdown = false;
  tabs = [
    { id: 'users', label: 'Usuários', icon: 'users' },
    { id: 'reports', label: 'Relatórios', icon: 'chart-bar' },
    { id: 'trainings', label: 'Treinamentos', icon: 'academic-cap' }
  ];
  
  newTraining = {
    title: '',
    description: '',
    category: 'comunicacao-nao-violenta'
  };
  
  isGenerating = false;
  generatedQuestions: any[] = [];
  showQuizPreview = false;
  editingTrainingId: string | null = null;
  showGeneratedQuestions = false;
  editingQuestionId: number | null = null;
  selectedQuestionCategory: string = '';
  showQuestionCategoryDropdown = false;
  newManualQuestion = {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  };
  
  categories = [
    { value: 'comunicacao-nao-violenta', icon: 'chat-bubble-left-right', name: 'Comunicação Não Violenta (CNV)' },
    { value: 'escuta-ativa', icon: 'ear', name: 'Escuta Ativa e Empática' },
    { value: 'resolucao-conflitos', icon: 'scale', name: 'Resolução de Conflitos' },
    { value: 'expressao-sentimentos', icon: 'chat-bubble-oval-left', name: 'Expressão de Sentimentos' },
    { value: 'necessidades-humanas', icon: 'heart', name: 'Necessidades Humanas Universais' },
    { value: 'pedidos-eficazes', icon: 'target', name: 'Formulação de Pedidos Eficazes' },
    { value: 'autocompaixao', icon: 'sparkles', name: 'Autocompaixão e Autocuidado' },
    { value: 'relacionamentos', icon: 'users', name: 'Relacionamentos Saudáveis' }
  ];
  
  // Expose global objects to template
  String = String;

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private geminiService: GeminiService
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    
    try {
      await this.loadUsers();
    } catch (error) {
      alert(`Erro ao carregar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
    
    await this.loadAssessmentReports();
    
    try {
      await this.loadTrainings();
    } catch (error) {
      alert(`Erro ao carregar treinamentos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async loadUsers() {
    try {
      console.log('Carregando usuários do Firebase...');
      this.users = await this.firebaseService.getUsers();
      
      // Converter Timestamps para objetos Date
      this.users = this.users.map(user => ({
        ...user,
        createdAt: this.convertTimestampToDate(user.createdAt),
        lastLogin: this.convertTimestampToDate(user.lastLogin)
      }));
      
      console.log('Usuários carregados:', this.users.length);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      throw new Error(`Erro ao carregar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async loadAssessmentReports() {
    try {
      console.log('Carregando relatórios de avaliação...');
      // Carregar todas as avaliações do Firebase
      this.assessmentReports = await this.firebaseService.getAllAssessments();
      
      // Converter Timestamps para objetos Date
      this.assessmentReports = this.assessmentReports.map(report => ({
        ...report,
        completedAt: this.convertTimestampToDate(report.completedAt)
      }));
      
      // Filtrar apenas relatórios de personalidade (avaliações iniciais)
      this.personalityReports = this.assessmentReports.filter(report => 
        report.type === 'personality' || report.personalityProfile
      );
      
      console.log(`Carregados ${this.assessmentReports.length} relatórios de avaliação`);
      console.log(`Carregados ${this.personalityReports.length} relatórios de personalidade`);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      this.assessmentReports = [];
      this.personalityReports = [];
    }
  }

  async toggleTrainingAccess(user: User) {
    try {
      const newTrainingAccess = !user.trainingAccess;
      // Garantir que active sempre tenha um valor válido (não undefined)
      const currentActive = user.active ?? false;
      const updatedUser = { 
        ...user, 
        trainingAccess: newTrainingAccess,
        // Quando o acesso ao treinamento for ativado, também ativar o usuário
        active: newTrainingAccess ? true : currentActive
      };
      
      // Atualizar no Firebase primeiro
      await this.firebaseService.updateUser(user.id!, updatedUser);
      
      // Atualizar localmente após sucesso no Firebase
      user.trainingAccess = newTrainingAccess;
      if (newTrainingAccess) {
        user.active = true;
      }
      
      const statusMessage = newTrainingAccess ? 'ativado e usuário ativado' : 'desativado';
      console.log(`Acesso ao treinamento ${statusMessage} para ${user.username}`);
    } catch (error) {
      console.error('Erro ao atualizar acesso ao treinamento:', error);
      alert(`Erro ao atualizar acesso ao treinamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async assignTrainingToUser(user: User, trainingId: string) {
    try {
      const userTrainings = user.assignedTrainings || [];
      
      if (userTrainings.includes(trainingId)) {
        // Remover treinamento
        const updatedTrainings = userTrainings.filter(id => id !== trainingId);
        await this.firebaseService.updateUser(user.id!, { assignedTrainings: updatedTrainings });
        user.assignedTrainings = updatedTrainings;
        console.log(`Treinamento removido do usuário ${user.username}`);
      } else {
        // Adicionar treinamento
        const updatedTrainings = [...userTrainings, trainingId];
        await this.firebaseService.updateUser(user.id!, { assignedTrainings: updatedTrainings });
        user.assignedTrainings = updatedTrainings;
        console.log(`Treinamento atribuído ao usuário ${user.username}`);
      }
    } catch (error) {
      console.error('Erro ao atribuir treinamento:', error);
      alert(`Erro ao atribuir treinamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  isTrainingAssigned(user: User, trainingId: string): boolean {
    return user.assignedTrainings?.includes(trainingId) || false;
  }

  async promoteToAdmin(user: User) {
    if (confirm(`Promover ${user.username} a administrador?`)) {
      try {
        const updatedUser = { ...user, role: 'admin' as const };
        await this.firebaseService.updateUser(user.id!, updatedUser);
        await this.loadUsers();
      } catch (error) {
        console.error('Erro ao promover usuário:', error);
        alert(`Erro ao promover usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  }

  async deleteUser(user: User) {
    if (confirm(`Excluir usuário ${user.username}? Esta ação não pode ser desfeita.`)) {
      try {
        await this.firebaseService.deleteUser(user.id!);
        await this.loadUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert(`Erro ao excluir usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  }

  async loadTrainings() {
    try {
      this.trainings = await this.firebaseService.getAllTrainings();
      
      // Converter Timestamps para objetos Date
      this.trainings = this.trainings.map(training => ({
        ...training,
        createdAt: this.convertTimestampToDate(training.createdAt)
      }));
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      throw new Error(`Erro ao carregar treinamentos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Função para converter Timestamp do Firestore para Date
  convertTimestampToDate(timestamp: any): Date {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000);
    }
    return timestamp;
  }

  async generateInitialQuestions() {
    this.isGenerating = true;
    
    try {
      const category = this.selectedQuestionCategory || undefined;
      this.generatedQuestions = await this.geminiService.generateInitialAssessment(category);
      this.showGeneratedQuestions = true;
      const categoryText = category ? ` para a categoria ${this.getCategoryDisplayName(category)}` : '';
      alert(`${this.generatedQuestions.length} perguntas geradas com sucesso${categoryText}!`);
    } catch (error) {
      console.error('Erro ao gerar perguntas com IA:', error);
      this.generatedQuestions = [];
      alert(`Erro ao gerar perguntas com IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.isGenerating = false;
    }
  }

  async generateTrainingWithAI() {
    if (!this.newTraining.title) {
      alert('Por favor, insira um título para o treinamento.');
      return;
    }

    this.isGenerating = true;
    try {
      const scenario = await this.geminiService.generateTrainingScenario(
        this.newTraining.title,
        this.newTraining.category,
        this.newTraining.description
      );
      
      this.newTraining.description = scenario.description;
      
      // Se há perguntas geradas, adiciona ao cenário
      if (this.generatedQuestions.length > 0) {
        this.newTraining.description += `\n\nEste treinamento inclui ${this.generatedQuestions.length} perguntas interativas para avaliação.`;
      }
      
      alert('Cenário gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar treinamento com IA:', error);
      alert(`Erro ao gerar cenário com IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.isGenerating = false;
    }
  }

  async createTraining() {
    if (!this.newTraining.title || !this.newTraining.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const training = {
        id: Date.now().toString(),
        ...this.newTraining,
        questions: this.generatedQuestions,
        createdAt: new Date(),
        createdBy: this.currentUser?.id || 'admin'
      };

      // Salvar no Firebase
      await this.firebaseService.addTraining(training);
      
      // Adicionar localmente após sucesso no Firebase
      this.trainings.push(training);
      
      // Reset form
      this.newTraining = {
        title: '',
        description: '',
        category: 'comunicacao-nao-violenta'
      };
      this.generatedQuestions = [];
      
      alert('Treinamento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar treinamento:', error);
      alert(`Erro ao criar treinamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  editTraining(training: any) {
    this.newTraining = {
      title: training.title,
      description: training.description,
      category: training.category
    };
    this.generatedQuestions = training.questions || [];
    this.editingTrainingId = training.id;
  }

  async deleteTraining(trainingId: string) {
    if (confirm('Excluir este treinamento? Esta ação não pode ser desfeita.')) {
      try {
        // Remover do Firebase primeiro
        await this.firebaseService.deleteTraining(trainingId);
        
        // Remover do array local após sucesso no Firebase
        this.trainings = this.trainings.filter(t => t.id !== trainingId);
        
        alert('Treinamento excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir treinamento:', error);
        alert(`Erro ao excluir treinamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(categoryValue: string) {
    this.newTraining.category = categoryValue;
    this.showCategoryDropdown = false;
  }

  getCategoryIcon(categoryValue: string): string {
    const category = this.categories.find(c => c.value === categoryValue);
    return category ? category.icon : 'folder';
  }

  getCategoryName(categoryValue: string): string {
    const category = this.categories.find(c => c.value === categoryValue);
    return category ? category.name : 'Categoria não encontrada';
  }

  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'workplace': 'Ambiente de Trabalho',
      'family': 'Relações Interpessoais',
      'relationships': 'Relacionamentos Profissionais',
      'self_awareness': 'Autoconhecimento',
      'social': 'Habilidades Sociais',
      'conflict': 'Resolução de Conflitos'
    };
    return categoryNames[category] || category;
  }

  getQuestionCategoryDisplayName(category: string): string {
    if (!category) return 'Geral (Todas as categorias)';
    return this.getCategoryDisplayName(category);
  }

  selectQuestionCategory(category: string) {
    this.selectedQuestionCategory = category;
    this.showQuestionCategoryDropdown = false;
  }

  getCategoryIconPath(categoryValue: string): string {
    const iconPaths: { [key: string]: string } = {
      'chat-bubble-left-right': 'M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h4l4 4 4-4h4a2 2 0 002-2V4a2 2 0 00-2-2z',
      'ear': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      'scale': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'chat-bubble-oval-left': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      'heart': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      'target': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'sparkles': 'M5 3l1.5 1.5L8 3l-1.5 1.5L5 3zm7 7l1.5 1.5L15 10l-1.5 1.5L12 10zm-7 7l1.5 1.5L8 20l-1.5 1.5L5 20z',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z',
      'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
    };
    return iconPaths[categoryValue] || iconPaths['folder'];
  }

  getTabIconPath(iconName: string): string {
    const iconPaths: { [key: string]: string } = {
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z',
      'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z',
      'academic-cap': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
    };
    return iconPaths[iconName] || iconPaths['users'];
  }

  // Métodos para gerenciar perguntas
  editQuestion(questionId: number) {
    this.editingQuestionId = questionId;
  }

  saveQuestion(question: any) {
    this.editingQuestionId = null;
    // A pergunta já está sendo editada diretamente no array
  }

  cancelEditQuestion() {
    this.editingQuestionId = null;
  }

  deleteQuestion(questionId: number) {
    if (confirm('Deseja excluir esta pergunta?')) {
      this.generatedQuestions = this.generatedQuestions.filter(q => q.id !== questionId);
    }
  }

  addManualQuestion() {
    if (!this.newManualQuestion.question.trim()) {
      alert('Por favor, insira uma pergunta.');
      return;
    }

    if (this.newManualQuestion.options.some(option => !option.trim())) {
      alert('Por favor, preencha todas as opções.');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: this.newManualQuestion.question,
      options: [...this.newManualQuestion.options],
      correctAnswer: this.newManualQuestion.correctAnswer
    };

    this.generatedQuestions.push(newQuestion);
    
    // Reset form
    this.newManualQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };

    alert('Pergunta adicionada com sucesso!');
  }

  async generateMoreQuestions() {
    await this.generateInitialQuestions();
  }

  hideGeneratedQuestions() {
    this.showGeneratedQuestions = false;
  }

  previewQuiz() {
    this.showQuizPreview = true;
  }

  closeQuizPreview() {
    this.showQuizPreview = false;
  }

  onQuizFinished(result: any) {
    console.log('Quiz finalizado:', result);
    this.closeQuizPreview();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}