import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  scenario: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: number[];
  timeSpent: number;
  duration: number; // Duração em minutos ou segundos
}

@Component({
  selector: 'app-interactive-quiz',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('pulse', [
      state('correct', style({ transform: 'scale(1.05)', backgroundColor: '#10b981' })),
      state('incorrect', style({ transform: 'scale(0.95)', backgroundColor: '#ef4444' })),
      state('normal', style({ transform: 'scale(1)', backgroundColor: 'rgba(255,255,255,0.1)' })),
      transition('* => *', animate('0.3s ease-in-out'))
    ]),
    trigger('progressBar', [
      transition('* => *', [
        animate('0.5s ease-in-out')
      ])
    ])
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8" @fadeIn>
          <h1 class="text-4xl font-bold text-white mb-2">🧠 Quiz Interativo CNV</h1>
          <p class="text-gray-300">Teste seus conhecimentos em Comunicação Não Violenta</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8" @fadeIn>
          <div class="flex justify-between items-center mb-2">
            <span class="text-white font-medium">Progresso</span>
            <span class="text-gray-300">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              [style.width.%]="progressPercentage"
              @progressBar
            ></div>
          </div>
        </div>

        <!-- Timer -->
        <div class="text-center mb-6" @fadeIn>
          <div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="text-2xl">⏱️</span>
            <span class="text-white font-mono text-lg">{{ formatTime(timeElapsed) }}</span>
          </div>
        </div>

        <!-- Quiz Content -->
        <div *ngIf="!quizCompleted" class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" @slideIn>
          <!-- Scenario -->
          <div class="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <h3 class="text-blue-300 font-semibold mb-2 flex items-center">
              <span class="mr-2">📋</span> Cenário
            </h3>
            <p class="text-gray-300 text-sm">{{ currentQuestion.scenario }}</p>
          </div>

          <!-- Question -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-6 leading-relaxed">
              {{ currentQuestion.question }}
            </h2>

            <!-- Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                *ngFor="let option of currentQuestion.options; let i = index"
                (click)="selectAnswer(i)"
                [disabled]="answerSelected"
                [@pulse]="getOptionState(i)"
                class="p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
                [class]="getOptionClasses(i)"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                    {{ String.fromCharCode(65 + i) }}
                  </div>
                  <span class="flex-1">{{ option }}</span>
                  <div *ngIf="answerSelected && i === selectedAnswer" class="text-2xl">
                    {{ i === currentQuestion.correctAnswer ? '✅' : '❌' }}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Next Button -->
          <div class="text-center" *ngIf="answerSelected">
            <button
              (click)="nextQuestion()"
              class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              @fadeIn
            >
              {{ isLastQuestion ? 'Finalizar Quiz 🎉' : 'Próxima Pergunta →' }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div *ngIf="quizCompleted" class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl text-center" @fadeIn>
          <div class="mb-6">
            <div class="text-6xl mb-4">{{ getScoreEmoji() }}</div>
            <h2 class="text-3xl font-bold text-white mb-2">Quiz Concluído!</h2>
            <p class="text-gray-300">Parabéns por completar o desafio!</p>
          </div>

          <!-- Score Card -->
          <div class="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-3xl font-bold text-green-400">{{ score }}</div>
                <div class="text-gray-300 text-sm">Pontuação</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-blue-400">{{ Math.round(scorePercentage) }}%</div>
                <div class="text-gray-300 text-sm">Aproveitamento</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-purple-400">{{ formatTime(totalTime) }}</div>
                <div class="text-gray-300 text-sm">Tempo Total</div>
              </div>
            </div>
          </div>

          <!-- Performance Message -->
          <div class="mb-6 p-4 rounded-lg" [class]="getPerformanceClass()">
            <p class="text-white font-medium">{{ getPerformanceMessage() }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center gap-4">
            <button
              (click)="restartQuiz()"
              class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              🔄 Tentar Novamente
            </button>
            <button
              (click)="finishQuiz()"
              class="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              ✅ Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InteractiveQuizComponent implements OnInit {
  @Input() questions: QuizQuestion[] = [];
  @Output() quizFinished = new EventEmitter<QuizResult>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  answerSelected = false;
  userAnswers: number[] = [];
  score = 0;
  quizCompleted = false;
  startTime = 0;
  timeElapsed = 0;
  totalTime = 0;
  timer: any;

  // Expose global objects to template
  String = String;
  Math = Math;

  ngOnInit() {
    this.startQuiz();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startQuiz() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get scorePercentage(): number {
    return (this.score / this.questions.length) * 100;
  }

  selectAnswer(answerIndex: number) {
    if (this.answerSelected) return;

    this.selectedAnswer = answerIndex;
    this.answerSelected = true;
    this.userAnswers[this.currentQuestionIndex] = answerIndex;

    if (answerIndex === this.currentQuestion.correctAnswer) {
      this.score++;
    }
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      this.completeQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.answerSelected = false;
    }
  }

  completeQuiz() {
    this.quizCompleted = true;
    this.totalTime = this.timeElapsed;
    if (this.timer) {
      clearInterval(this.timer);
    }

    const result: QuizResult = {
      score: this.score,
      totalQuestions: this.questions.length,
      answers: this.userAnswers,
      timeSpent: this.totalTime,
      duration: Math.floor(this.totalTime / 60) // Duração em minutos
    };

    this.quizFinished.emit(result);
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.answerSelected = false;
    this.userAnswers = [];
    this.score = 0;
    this.quizCompleted = false;
    this.timeElapsed = 0;
    this.startQuiz();
  }

  finishQuiz() {
    // Emit final result and close quiz
    const result: QuizResult = {
      score: this.score,
      totalQuestions: this.questions.length,
      answers: this.userAnswers,
      timeSpent: this.totalTime,
      duration: Math.floor(this.totalTime / 60) // Duração em minutos
    };
    this.quizFinished.emit(result);
  }

  getOptionState(index: number): string {
    if (!this.answerSelected) return 'normal';
    if (index === this.selectedAnswer) {
      return index === this.currentQuestion.correctAnswer ? 'correct' : 'incorrect';
    }
    if (index === this.currentQuestion.correctAnswer) {
      return 'correct';
    }
    return 'normal';
  }

  getOptionClasses(index: number): string {
    const baseClasses = 'border-white/30 text-white hover:border-white/50 hover:bg-white/10';
    
    if (!this.answerSelected) {
      return baseClasses;
    }

    if (index === this.currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-500/20 text-green-100';
    }

    if (index === this.selectedAnswer && index !== this.currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-500/20 text-red-100';
    }

    return 'border-gray-500 bg-gray-500/10 text-gray-300';
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getScoreEmoji(): string {
    const percentage = this.scorePercentage;
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🥇';
    if (percentage >= 70) return '🥈';
    if (percentage >= 60) return '🥉';
    return '📚';
  }

  getPerformanceMessage(): string {
    const percentage = this.scorePercentage;
    if (percentage >= 90) return 'Excelente! Você domina os conceitos de CNV!';
    if (percentage >= 80) return 'Muito bom! Você tem um bom entendimento de CNV.';
    if (percentage >= 70) return 'Bom trabalho! Continue praticando para melhorar.';
    if (percentage >= 60) return 'Você está no caminho certo! Estude mais sobre CNV.';
    return 'Continue estudando! A prática leva à perfeição.';
  }

  getPerformanceClass(): string {
    const percentage = this.scorePercentage;
    if (percentage >= 80) return 'bg-green-500/20 border border-green-500/40';
    if (percentage >= 60) return 'bg-yellow-500/20 border border-yellow-500/40';
    return 'bg-red-500/20 border border-red-500/40';
  }
}