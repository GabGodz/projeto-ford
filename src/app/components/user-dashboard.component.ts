import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../services/auth.service';
import { GeminiService, TrainingScenario } from '../services/gemini.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="container-fluid">
        <!-- Cabeçalho -->
        <div class="dashboard-header">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="dashboard-title">
                <i class="fas fa-tachometer-alt me-3"></i>
                Olá, {{ (currentUser$ | async)?.displayName }}!
              </h1>
              <p class="dashboard-subtitle">Bem-vindo ao seu painel de treinamento CNV</p>
            </div>
            <div class="col-md-4 text-end">
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ completedTrainings }}</span>
                  <span class="stat-label">Treinamentos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userLevel }}</span>
                  <span class="stat-label">Nível</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="quick-actions-card">
              <h3 class="card-title">
                <i class="fas fa-rocket me-2"></i>
                Iniciar Novo Treinamento
              </h3>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Tópico</label>
                  <select class="form-select" [(ngModel)]="selectedTopic">
                    <option value="">Selecione um tópico</option>
                    <option *ngFor="let topic of availableTopics" [value]="topic">{{ topic }}</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Dificuldade</label>
                  <select class="form-select" [(ngModel)]="selectedDifficulty">
                    <option value="">Selecione a dificuldade</option>
                    <option *ngFor="let level of difficultyLevels" [value]="level.value">
                      {{ level.label }} - {{ level.description }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                  <button 
                    class="btn btn-primary w-100" 
                    [disabled]="!selectedTopic || !selectedDifficulty || isGenerating"
                    (click)="generateScenario()">
                    <span *ngIf="isGenerating" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!isGenerating" class="fas fa-play me-2"></i>
                    {{ isGenerating ? 'Gerando...' : 'Começar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cenário -->
        <div class="row" *ngIf="currentScenario">
          <div class="col-12">
            <div class="scenario-card">
              <div class="scenario-header">
                <h3 class="scenario-title">
                  <i class="fas fa-gamepad me-2"></i>
                  {{ currentScenario.title }}
                </h3>
                <span class="difficulty-badge" [class]="'difficulty-' + currentScenario.difficulty">
                  {{ getDifficultyLabel(currentScenario.difficulty) }}
                </span>
              </div>
              
              <div class="scenario-content">
                <div class="scenario-description">
                  <h5>Contexto:</h5>
                  <p>{{ currentScenario.description }}</p>
                </div>
                
                <div class="scenario-situation">
                  <h5>Situação:</h5>
                  <p>{{ currentScenario.scenario }}</p>
                </div>
                
                <div class="scenario-choices" *ngIf="!showResults">
                  <h5>Como você reagiria?</h5>
                  <div class="choices-grid">
                    <div 
                      *ngFor="let choice of currentScenario.choices; let i = index" 
                      class="choice-card"
                      [class.selected]="selectedChoice === choice.id"
                      (click)="selectChoice(choice.id)">
                      <div class="choice-number">{{ i + 1 }}</div>
                      <div class="choice-text">{{ choice.text }}</div>
                    </div>
                  </div>
                  
                  <div class="text-center mt-4">
                    <button 
                      class="btn btn-success btn-lg" 
                      [disabled]="!selectedChoice || isSubmitting"
                      (click)="submitChoice()">
                      <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      <i *ngIf="!isSubmitting" class="fas fa-check me-2"></i>
                      {{ isSubmitting ? 'Processando...' : 'Confirmar Escolha' }}
                    </button>
                  </div>
                </div>
                
                <!-- Resultados -->
                <div class="scenario-results" *ngIf="showResults">
                  <div class="result-header">
                    <h5>
                      <i class="fas fa-trophy me-2"></i>
                      Resultado
                    </h5>
                  </div>
                  
                  <div class="choice-result">
                    <div class="chosen-option">
                      <h6>Sua escolha:</h6>
                      <p>{{ getSelectedChoiceText() }}</p>
                    </div>
                    
                    <div class="consequence" [class.correct-choice]="isSelectedChoiceCorrect()" [class.incorrect-choice]="!isSelectedChoiceCorrect()">
                      <h6>Consequência:</h6>
                      <p>{{ getSelectedChoiceConsequence() }}</p>
                    </div>
                    
                    <div class="explanation">
                      <h6>Explicação:</h6>
                      <p>{{ getSelectedChoiceExplanation() }}</p>
                    </div>
                    
                    <div class="feedback" *ngIf="aiFeedback">
                      <h6>Feedback:</h6>
                      <p>{{ aiFeedback }}</p>
                    </div>
                  </div>
                  
                  <div class="result-actions">
                    <button class="btn btn-primary me-3" (click)="startNewScenario()">
                      <i class="fas fa-redo me-2"></i>
                      Novo Cenário
                    </button>
                    <button class="btn btn-outline-light" (click)="backToDashboard()">
                      <i class="fas fa-arrow-left me-2"></i>
                      Voltar ao Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progresso -->
        <div class="row" *ngIf="!currentScenario">
          <div class="col-md-8">
            <div class="progress-card">
              <h3 class="card-title">
                <i class="fas fa-chart-line me-2"></i>
                Seu Progresso
              </h3>
              <div class="progress-stats">
                <div class="progress-item">
                  <div class="progress-info">
                    <span class="progress-label">Treinamentos Concluídos</span>
                    <span class="progress-value">{{ completedTrainings }}/50</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" [style.width.%]="(completedTrainings / 50) * 100"></div>
                  </div>
                </div>
                
                <div class="progress-item">
                  <div class="progress-info">
                    <span class="progress-label">Nível Atual</span>
                    <span class="progress-value">{{ userLevel }}</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" [style.width.%]="getLevelProgress()"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="achievements-card">
              <h3 class="card-title">
                <i class="fas fa-medal me-2"></i>
                Conquistas
              </h3>
              <div class="achievements-list">
                <div class="achievement-item" [class.unlocked]="achievements.firstCorrect">
                  <i class="fas fa-star"></i>
                  <span>Primeiro Acerto</span>
                </div>
                <div class="achievement-item" [class.unlocked]="achievements.fiveCorrect">
                  <i class="fas fa-fire"></i>
                  <span>5 Acertos</span>
                </div>
                <div class="achievement-item" [class.unlocked]="achievements.tenCorrect">
                  <i class="fas fa-crown"></i>
                  <span>10 Acertos</span>
                </div>
                <div class="achievement-item" [class.unlocked]="achievements.levelTwo">
                  <i class="fas fa-trophy"></i>
                  <span>Nível 2</span>
                </div>
                <div class="achievement-item" [class.unlocked]="achievements.levelThree">
                  <i class="fas fa-gem"></i>
                  <span>Nível 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #111526;
      padding: 100px 0 50px;
      color: #fff;
    }
    
    .dashboard-header {
      margin-bottom: 40px;
    }
    
    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .dashboard-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
    }
    
    .user-stats {
      display: flex;
      gap: 30px;
      justify-content: flex-end;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #00d4ff;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .quick-actions-card, .scenario-card, .progress-card, .achievements-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 25px;
      color: #fff;
    }
    
    .form-label {
      color: #fff;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .form-select, .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: #fff;
      padding: 12px 16px;
    }
    
    .form-select:focus, .form-control:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #00d4ff;
      box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
      color: #fff;
    }
    
    .form-select option {
      background: #111526;
      color: #fff;
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
    
    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }
    
    .scenario-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0;
    }
    
    .difficulty-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .difficulty-beginner {
      background: rgba(40, 167, 69, 0.2);
      color: #51cf66;
      border: 1px solid rgba(40, 167, 69, 0.3);
    }
    
    .difficulty-intermediate {
      background: rgba(255, 193, 7, 0.2);
      color: #ffd43b;
      border: 1px solid rgba(255, 193, 7, 0.3);
    }
    
    .difficulty-advanced {
      background: rgba(220, 53, 69, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(220, 53, 69, 0.3);
    }
    
    .scenario-description, .scenario-situation {
      margin-bottom: 25px;
    }
    
    .scenario-description h5, .scenario-situation h5 {
      color: #00d4ff;
      margin-bottom: 10px;
    }
    
    .choices-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    
    .choice-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .choice-card:hover {
      border-color: rgba(0, 212, 255, 0.5);
      background: rgba(0, 212, 255, 0.1);
    }
    
    .choice-card.selected {
      border-color: #00d4ff;
      background: rgba(0, 212, 255, 0.2);
    }
    
    .choice-number {
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .choice-text {
      flex: 1;
      line-height: 1.4;
    }
    
    .scenario-results {
      margin-top: 30px;
    }
    
    .result-header h5 {
      color: #00d4ff;
      font-size: 1.3rem;
      margin-bottom: 20px;
    }
    
    .choice-result > div {
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    
    .choice-result h6 {
      color: #00d4ff;
      margin-bottom: 8px;
    }
    
    .result-actions {
      margin-top: 30px;
      text-align: center;
    }
    
    .btn-outline-light {
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-outline-light:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #00d4ff;
      color: #00d4ff;
    }
    
    .progress-stats {
      margin-top: 20px;
    }
    
    .progress-item {
      margin-bottom: 25px;
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .progress-label {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .progress-value {
      color: #00d4ff;
      font-weight: 600;
    }
    
    .progress-bar-container {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .achievements-list {
      margin-top: 20px;
    }
    
    .achievement-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      opacity: 0.5;
      transition: all 0.3s ease;
    }
    
    .achievement-item.unlocked {
      opacity: 1;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
    }
    
    .achievement-item i {
      color: #00d4ff;
      font-size: 1.2rem;
    }
    
    .consequence.correct-choice {
      background: rgba(40, 167, 69, 0.1);
      border: 1px solid rgba(40, 167, 69, 0.3);
      border-radius: 10px;
      padding: 15px;
    }
    
    .consequence.incorrect-choice {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
      border-radius: 10px;
      padding: 15px;
    }
    
    .consequence.correct-choice h6 {
      color: #28a745;
    }
    
    .consequence.incorrect-choice h6 {
      color: #dc3545;
    }
    
    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 2rem;
      }
      
      .user-stats {
        justify-content: center;
        margin-top: 20px;
      }
      
      .choices-grid {
        grid-template-columns: 1fr;
      }
      
      .scenario-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  currentUser$: Observable<UserProfile | null>;
  availableTopics: string[] = [];
  difficultyLevels: any[] = [];
  selectedTopic = '';
  selectedDifficulty = '';
  isGenerating = false;
  currentScenario: TrainingScenario | null = null;
  selectedChoice = '';
  showResults = false;
  isSubmitting = false;
  aiFeedback = '';
  completedTrainings = 0;
  userLevel = 1;
  achievements = {
    firstCorrect: false,
    fiveCorrect: false,
    tenCorrect: false,
    levelTwo: false,
    levelThree: false
  };

  constructor(
    private authService: AuthService,
    private geminiService: GeminiService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.availableTopics = this.geminiService.getAvailableTopics();
    this.difficultyLevels = this.geminiService.getDifficultyLevels();
    this.loadUserProgress();
  }

  async generateScenario(): Promise<void> {
    if (!this.selectedTopic || !this.selectedDifficulty) return;
    
    this.isGenerating = true;
    try {
      this.currentScenario = await this.geminiService.generateTrainingScenario(
        this.selectedTopic,
        this.selectedDifficulty
      );
      this.resetScenarioState();
    } catch (error) {
      console.error('Erro ao gerar cenário:', error);
      alert('Erro ao gerar cenário. Verifique sua conexão com a internet e tente novamente.');
    } finally {
      this.isGenerating = false;
    }
  }

  selectChoice(choiceId: string): void {
    this.selectedChoice = choiceId;
  }

  async submitChoice(): Promise<void> {
    if (!this.selectedChoice || !this.currentScenario) return;
    
    this.isSubmitting = true;
    try {
      // Verifica se a escolha ta correta
      const selectedChoiceObj = this.currentScenario.choices.find(c => c.id === this.selectedChoice);
      const isCorrect = selectedChoiceObj ? selectedChoiceObj.isCorrect : false;
      
      // Gera feedback 
      this.aiFeedback = await this.geminiService.generateFeedback(
        [this.selectedChoice],
        this.currentScenario,
        isCorrect
      );
      
      if (selectedChoiceObj && selectedChoiceObj.isCorrect) {
        this.completedTrainings++;
        
        // Atualiza no banco de dados
        await this.updateUserProgress();
        
        // conquistas 
        if (this.completedTrainings === 1) {
          this.achievements.firstCorrect = true;
        }
        if (this.completedTrainings === 5) {
          this.achievements.fiveCorrect = true;
        }
        if (this.completedTrainings === 10) {
          this.achievements.tenCorrect = true;
        }
        
        // Atualiza nível a cada 5 treinamentos corretos
        if (this.completedTrainings % 5 === 0) {
          this.userLevel++;
          
          // Desbloqueia conquistas de nível
          if (this.userLevel === 2) {
            this.achievements.levelTwo = true;
          }
          if (this.userLevel === 3) {
            this.achievements.levelThree = true;
          }
        }
      }
      
      this.showResults = true;
    } catch (error) {
      console.error('Erro ao processar escolha:', error);
      this.aiFeedback = 'Obrigado por completar este cenário! Continue praticando para melhorar suas habilidades de CNV.';
      this.showResults = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  startNewScenario(): void {
    this.currentScenario = null;
    this.resetScenarioState();
  }

  backToDashboard(): void {
    this.currentScenario = null;
    this.resetScenarioState();
  }

  private resetScenarioState(): void {
    this.selectedChoice = '';
    this.showResults = false;
    this.aiFeedback = '';
  }



  getDifficultyLabel(difficulty: string): string {
    const level = this.difficultyLevels.find(l => l.value === difficulty);
    return level ? level.label : difficulty;
  }

  getSelectedChoiceText(): string {
    if (!this.currentScenario || !this.selectedChoice) return '';
    const choice = this.currentScenario.choices.find(c => c.id === this.selectedChoice);
    return choice ? choice.text : '';
  }

  getSelectedChoiceConsequence(): string {
    if (!this.currentScenario || !this.selectedChoice) return '';
    const choice = this.currentScenario.choices.find(c => c.id === this.selectedChoice);
    return choice ? choice.consequence : '';
  }

  getSelectedChoiceExplanation(): string {
    if (!this.currentScenario || !this.selectedChoice) return '';
    const choice = this.currentScenario.choices.find(c => c.id === this.selectedChoice);
    return choice ? choice.explanation : '';
  }

  getLevelProgress(): number {
    return (this.completedTrainings % 10) * 10;
  }

  isSelectedChoiceCorrect(): boolean {
    if (!this.currentScenario || !this.selectedChoice) return false;
    const choice = this.currentScenario.choices.find(c => c.id === this.selectedChoice);
    return choice ? choice.isCorrect : false;
  }

  private async loadUserProgress(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.completedTrainings = currentUser.completedTrainings || 0;
        this.userLevel = Math.floor(this.completedTrainings / 5) + 1;
        
        // Atualiza conquistas no progresso atual
        this.updateAchievements();
      }
    } catch (error) {
      console.error('Erro ao carregar progresso do usuário:', error);
    }
  }

  private async updateUserProgress(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        await this.authService.updateUserProfile(currentUser.uid, {
          completedTrainings: this.completedTrainings,
          lastLogin: new Date()
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso do usuário:', error);
    }
  }

  private updateAchievements(): void {
    this.achievements.firstCorrect = this.completedTrainings >= 1;
    this.achievements.fiveCorrect = this.completedTrainings >= 5;
    this.achievements.tenCorrect = this.completedTrainings >= 10;
    this.achievements.levelTwo = this.userLevel >= 2;
    this.achievements.levelThree = this.userLevel >= 3;
  }
}