import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">
            <i class="fas fa-sign-in-alt me-2"></i>
            Entrar na Plataforma
          </h2>
          <p class="login-subtitle">Acesse sua conta para continuar o treinamento</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">
              <i class="fas fa-envelope me-2"></i>Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="form-control" 
              [(ngModel)]="email" 
              required 
              email
              placeholder="seu@email.com"
              [class.is-invalid]="emailInput.invalid && emailInput.touched"
              #emailInput="ngModel">
            <div class="invalid-feedback" *ngIf="emailInput.invalid && emailInput.touched">
              <span *ngIf="emailInput.errors?.['required']">Email é obrigatório</span>
              <span *ngIf="emailInput.errors?.['email']">Email inválido</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">
              <i class="fas fa-lock me-2"></i>Senha
            </label>
            <div class="password-input-group">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                class="form-control" 
                [(ngModel)]="password" 
                required 
                minlength="6"
                placeholder="Sua senha"
                [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
                #passwordInput="ngModel">
              <button 
                type="button" 
                class="password-toggle" 
                (click)="togglePassword()">
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="passwordInput.invalid && passwordInput.touched">
              <span *ngIf="passwordInput.errors?.['required']">Senha é obrigatória</span>
              <span *ngIf="passwordInput.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</span>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe" [(ngModel)]="rememberMe" name="rememberMe">
              <label class="form-check-label" for="rememberMe">
                Lembrar de mim
              </label>
            </div>
          </div>
          
          <div class="alert alert-danger" *ngIf="errorMessage">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-login" 
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!isLoading" class="fas fa-sign-in-alt me-2"></i>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p class="text-center">
            Não tem uma conta? 
            <a routerLink="/register" class="register-link">Registre-se aqui</a>
          </p>
          <p class="text-center">
            <a href="#" class="forgot-password-link">Esqueceu sua senha?</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: transparent;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.6s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-title {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 10px;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .login-subtitle {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 0;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      color: #fff;
      font-weight: 500;
      margin-bottom: 8px;
      display: block;
    }
    
    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: #fff;
      padding: 12px 16px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .form-control:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #00d4ff;
      box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
      color: #fff;
    }
    
    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .password-input-group {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 4px;
      transition: color 0.3s ease;
    }
    
    .password-toggle:hover {
      color: #00d4ff;
    }
    
    .form-check {
      display: flex;
      align-items: center;
    }
    
    .form-check-input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-right: 8px;
    }
    
    .form-check-input:checked {
      background-color: #00d4ff;
      border-color: #00d4ff;
    }
    
    .form-check-label {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0;
    }
    
    .btn-login {
      width: 100%;
      padding: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 12px;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      border: none;
      color: white;
      transition: all 0.3s ease;
      margin-top: 10px;
    }
    
    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
    
    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .login-footer {
      margin-top: 30px;
    }
    
    .register-link, .forgot-password-link {
      color: #00d4ff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .register-link:hover, .forgot-password-link:hover {
      color: #0099cc;
      text-decoration: underline;
    }
    
    .login-footer p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
    }
    
    .alert {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
      color: #ff6b6b;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
    }
    
    .invalid-feedback {
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 5px;
    }
    
    .is-invalid {
      border-color: #ff6b6b !important;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique seu email.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      default:
        return 'Erro ao fazer login. Tente novamente.';
    }
  }
}