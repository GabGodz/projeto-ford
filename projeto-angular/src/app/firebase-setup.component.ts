import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseSetupService } from './firebase-setup.service';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firebase-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Configuração do Firebase</h1>
              <p class="text-gray-600 mt-2">Configure as coleções necessárias para o sistema</p>
            </div>
            <button 
              (click)="goBack()"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Voltar
            </button>
          </div>
        </div>

        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Usuários</h3>
                <p class="text-sm text-gray-600">{{collectionsStatus.users}} documentos</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Treinamentos</h3>
                <p class="text-sm text-gray-600">{{collectionsStatus.trainings}} documentos</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Avaliações</h3>
                <p class="text-sm text-gray-600">{{collectionsStatus.assessments}} documentos</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Ações Disponíveis</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              (click)="setupCollections()"
              [disabled]="isLoading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <div *ngIf="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {{isLoading ? 'Configurando...' : 'Configurar Coleções'}}
            </button>

            <button 
              (click)="checkCollections()"
              [disabled]="isLoading"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div *ngIf="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {{isLoading ? 'Verificando...' : 'Verificar Coleções'}}
            </button>

            <button 
              (click)="clearCollections()"
              [disabled]="isLoading"
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <div *ngIf="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {{isLoading ? 'Limpando...' : 'Limpar Todas as Coleções'}}
            </button>

            <button 
              (click)="exportData()"
              [disabled]="isLoading"
              class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div *ngIf="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {{isLoading ? 'Exportando...' : 'Exportar Dados'}}
            </button>
          </div>
        </div>

        <!-- Logs -->
        <div class="bg-white rounded-lg shadow-md p-6" *ngIf="logs.length > 0">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Logs de Operação</h2>
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            <div *ngFor="let log of logs" class="mb-1">
              <span class="text-gray-500">[{{log.timestamp}}]</span> 
              <span [ngClass]="{
                'text-green-400': log.type === 'success',
                'text-red-400': log.type === 'error',
                'text-yellow-400': log.type === 'warning',
                'text-blue-400': log.type === 'info'
              }">{{log.message}}</span>
            </div>
          </div>
          <button 
            (click)="clearLogs()"
            class="mt-2 text-sm text-gray-500 hover:text-gray-700">
            Limpar Logs
          </button>
        </div>

        <!-- Collection Details -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-6" *ngIf="showDetails">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Detalhes das Coleções</h2>
          
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📁 users</h3>
              <p class="text-sm text-gray-600 mb-2">Armazena informações dos usuários do sistema</p>
              <div class="text-xs text-gray-500">
                <strong>Campos:</strong> username, email, fullName, role, trainingAccess, createdAt, permissions
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📚 trainings</h3>
              <p class="text-sm text-gray-600 mb-2">Contém os módulos de treinamento disponíveis</p>
              <div class="text-xs text-gray-500">
                <strong>Campos:</strong> title, description, category, difficulty, duration, content, createdBy
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📝 assessments</h3>
              <p class="text-sm text-gray-600 mb-2">Testes de personalidade e conhecimento</p>
              <div class="text-xs text-gray-500">
                <strong>Campos:</strong> title, description, type, category, questions, scoring, createdBy
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">⚙️ system_config</h3>
              <p class="text-sm text-gray-600 mb-2">Configurações gerais do sistema</p>
              <div class="text-xs text-gray-500">
                <strong>Campos:</strong> appName, version, features, limits, geminiConfig, emailConfig
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">📊 user_progress</h3>
              <p class="text-sm text-gray-600 mb-2">Progresso dos usuários nos treinamentos</p>
              <div class="text-xs text-gray-500">
                <strong>Campos:</strong> userId, trainings, assessments, achievements, statistics
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FirebaseSetupComponent {
  isLoading = false;
  logs: Array<{timestamp: string, message: string, type: string}> = [];
  showDetails = false;
  collectionsStatus = {
    users: 0,
    trainings: 0,
    assessments: 0,
    system_config: 0,
    user_progress: 0,
    prompts: 0
  };

  constructor(
    private firebaseSetupService: FirebaseSetupService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkCollections();
  }

  async setupCollections() {
    this.isLoading = true;
    this.addLog('Iniciando configuração das coleções...', 'info');
    
    try {
      const success = await this.firebaseSetupService.setupFirebaseCollections();
      if (success) {
        this.addLog('✅ Coleções configuradas com sucesso!', 'success');
        await this.checkCollections();
      } else {
        this.addLog('❌ Erro ao configurar coleções', 'error');
      }
    } catch (error) {
      this.addLog(`❌ Erro: ${error}`, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async checkCollections() {
    this.isLoading = true;
    this.addLog('Verificando coleções existentes...', 'info');
    
    try {
      const collections = ['users', 'trainings', 'assessments', 'system_config', 'user_progress', 'prompts'];
      
      for (const collection of collections) {
        try {
          const docs = await this.firebaseService.getCollection(collection);
          this.collectionsStatus[collection as keyof typeof this.collectionsStatus] = docs.length;
          this.addLog(`📁 ${collection}: ${docs.length} documentos`, 'info');
        } catch (error) {
          this.collectionsStatus[collection as keyof typeof this.collectionsStatus] = 0;
          this.addLog(`📁 ${collection}: 0 documentos (coleção não existe)`, 'warning');
        }
      }
      
      this.showDetails = true;
      this.addLog('✅ Verificação concluída', 'success');
    } catch (error) {
      this.addLog(`❌ Erro ao verificar coleções: ${error}`, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async clearCollections() {
    this.isLoading = true;
    
    try {
      const success = await this.firebaseSetupService.clearAllCollections();
      if (success) {
        this.addLog('✅ Todas as coleções foram limpas', 'success');
        await this.checkCollections();
      } else {
        this.addLog('ℹ️ Operação cancelada pelo usuário', 'info');
      }
    } catch (error) {
      this.addLog(`❌ Erro ao limpar coleções: ${error}`, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async exportData() {
    this.isLoading = true;
    this.addLog('Exportando dados...', 'info');
    
    try {
      const collections = ['users', 'trainings', 'assessments', 'system_config', 'user_progress'];
      const exportData: any = {};
      
      for (const collection of collections) {
        try {
          exportData[collection] = await this.firebaseService.getCollection(collection);
        } catch (error) {
          exportData[collection] = [];
        }
      }
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `firebase-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      this.addLog('✅ Dados exportados com sucesso', 'success');
    } catch (error) {
      this.addLog(`❌ Erro ao exportar dados: ${error}`, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard-admin']);
  }

  addLog(message: string, type: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift({ timestamp, message, type });
    
    // Manter apenas os últimos 50 logs
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(0, 50);
    }
  }

  clearLogs() {
    this.logs = [];
  }
}