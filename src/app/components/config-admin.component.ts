import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService, AppConfig } from '../services/config.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-config-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-admin-container">
      <div class="container mt-4">
        <h2>Configuração do Sistema</h2>
        <p class="text-muted">Configure as chaves de API do sistema</p>
        
        <div class="card">
          <div class="card-body">
            <form (ngSubmit)="saveConfig()" #configForm="ngForm">
              <div class="mb-3">
                <label for="geminiApiKey" class="form-label">Chave da API Gemini</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="geminiApiKey" 
                  [(ngModel)]="config.geminiApiKey" 
                  name="geminiApiKey"
                  placeholder="AIzaSy..."
                  required>
              </div>
              
              <h5>Configuração Firebase</h5>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="projectId" class="form-label">Project ID</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="projectId" 
                    [(ngModel)]="config.firebaseConfig.projectId" 
                    name="projectId"
                    required>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="appId" class="form-label">App ID</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="appId" 
                    [(ngModel)]="config.firebaseConfig.appId" 
                    name="appId"
                    required>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="apiKey" class="form-label">API Key</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="apiKey" 
                    [(ngModel)]="config.firebaseConfig.apiKey" 
                    name="apiKey"
                    required>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="authDomain" class="form-label">Auth Domain</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="authDomain" 
                    [(ngModel)]="config.firebaseConfig.authDomain" 
                    name="authDomain"
                    required>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="storageBucket" class="form-label">Storage Bucket</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="storageBucket" 
                    [(ngModel)]="config.firebaseConfig.storageBucket" 
                    name="storageBucket"
                    required>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="messagingSenderId" class="form-label">Messaging Sender ID</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="messagingSenderId" 
                    [(ngModel)]="config.firebaseConfig.messagingSenderId" 
                    name="messagingSenderId"
                    required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="measurementId" class="form-label">Measurement ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="measurementId" 
                  [(ngModel)]="config.firebaseConfig.measurementId" 
                  name="measurementId">
              </div>
              
              <div class="d-flex gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="!configForm.form.valid || saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ saving ? 'Salvando...' : 'Salvar Configuração' }}
                </button>
                
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  (click)="loadConfig()">
                  Recarregar
                </button>
              </div>
            </form>
            
            <div *ngIf="message" class="alert mt-3" [class.alert-success]="!error" [class.alert-danger]="error">
              {{ message }}
            </div>
          </div>
        </div>
        
        <div class="card mt-4">
          <div class="card-body">
            <h5>Instruções</h5>
            <ol>
              <li>Configure</li>
              <li>As configurações são salvas no Firestore em <code>config</code></li>
              <li>Após salvar, reinicie a aplicação para aplicar as mudanças</li>
              <li>Mantenha as chaves seguras</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .config-admin-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 20px 0;
    }
    
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .form-label {
      font-weight: 500;
    }
    
    code {
      background-color: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 0.875em;
    }
  `]
})
export class ConfigAdminComponent implements OnInit {
  config: AppConfig = {
    geminiApiKey: '',
    firebaseConfig: {
      projectId: '',
      appId: '',
      storageBucket: '',
      apiKey: '',
      authDomain: '',
      messagingSenderId: '',
      measurementId: ''
    }
  };
  
  saving = false;
  message = '';
  error = false;

  constructor(
    private configService: ConfigService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadConfig();
  }

  async loadConfig() {
    try {
      this.config = await this.configService.getConfig();
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      this.showMessage('Erro ao carregar configuração atual', true);
    }
  }

  async saveConfig() {
    this.saving = true;
    this.message = '';
    
    try {
      const configDoc = doc(this.firestore, 'config', 'app-settings');
      await setDoc(configDoc, this.config);
      
      this.showMessage('Configuração salva com sucesso! Reinicie a aplicação para aplicar as mudanças.', false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      this.showMessage('Erro ao salvar configuração. Verifique suas permissões.', true);
    } finally {
      this.saving = false;
    }
  }
  
  private showMessage(message: string, isError: boolean) {
    this.message = message;
    this.error = isError;
    
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}