import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2 class="register-title">
            <i class="fas fa-user-plus me-2"></i>
            Criar Conta
          </h2>
          <p class="register-subtitle">Junte-se à nossa plataforma de treinamento CNV</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="register-form">
          <div class="form-group">
            <label for="displayName" class="form-label">
              <i class="fas fa-user me-2"></i>Nome Completo
            </label>
            <input 
              type="text" 
              id="displayName" 
              name="displayName" 
              class="form-control" 
              [(ngModel)]="displayName" 
              required 
              minlength="2"
              placeholder="Seu nome completo"
              [class.is-invalid]="nameInput.invalid && nameInput.touched"
              #nameInput="ngModel">
            <div class="invalid-feedback" *ngIf="nameInput.invalid && nameInput.touched">
              <span *ngIf="nameInput.errors?.['required']">Nome é obrigatório</span>
              <span *ngIf="nameInput.errors?.['minlength']">Nome deve ter pelo menos 2 caracteres</span>
            </div>
          </div>
          
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
            <label for="company" class="form-label">
              <i class="fas fa-building me-2"></i>Empresa (Opcional)
            </label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              class="form-control" 
              [(ngModel)]="company" 
              placeholder="Nome da sua empresa">
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
                placeholder="Mínimo 6 caracteres"
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
            <label for="confirmPassword" class="form-label">
              <i class="fas fa-lock me-2"></i>Confirmar Senha
            </label>
            <div class="password-input-group">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                name="confirmPassword" 
                class="form-control" 
                [(ngModel)]="confirmPassword" 
                required
                placeholder="Confirme sua senha"
                [class.is-invalid]="(confirmPasswordInput.invalid && confirmPasswordInput.touched) || (password !== confirmPassword && confirmPassword.length > 0)"
                #confirmPasswordInput="ngModel">
              <button 
                type="button" 
                class="password-toggle" 
                (click)="toggleConfirmPassword()">
                <i [class]="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="(confirmPasswordInput.invalid && confirmPasswordInput.touched) || (password !== confirmPassword && confirmPassword.length > 0)">
              <span *ngIf="confirmPasswordInput.errors?.['required']">Confirmação de senha é obrigatória</span>
              <span *ngIf="password !== confirmPassword && confirmPassword.length > 0">Senhas não coincidem</span>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="acceptTerms" 
                [(ngModel)]="acceptTerms" 
                name="acceptTerms"
                required
                #termsInput="ngModel">
              <label class="form-check-label" for="acceptTerms">
                Aceito os <a href="#" class="terms-link">termos de uso</a> e 
                <a href="#" class="terms-link">política de privacidade</a>
              </label>
            </div>
            <div class="invalid-feedback" *ngIf="termsInput.invalid && termsInput.touched">
              Você deve aceitar os termos para continuar
            </div>
          </div>
          
          <div class="alert alert-danger" *ngIf="errorMessage">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ errorMessage }}
          </div>
          
          <div class="alert alert-success" *ngIf="successMessage">
            <i class="fas fa-check-circle me-2"></i>
            {{ successMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-register" 
            [disabled]="registerForm.invalid || password !== confirmPassword || isLoading">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!isLoading" class="fas fa-user-plus me-2"></i>
            {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
          </button>
        </form>
        
        <div class="register-footer">
          <p class="text-center">
            Já tem uma conta? 
            <a routerLink="/login" class="login-link">Faça login aqui</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: transparent;
    }
    
    .register-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 500px;
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
    
    .register-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .register-title {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 10px;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .register-subtitle {
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
      align-items: flex-start;
    }
    
    .form-check-input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-right: 8px;
      margin-top: 4px;
      flex-shrink: 0;
    }
    
    .form-check-input:checked {
      background-color: #00d4ff;
      border-color: #00d4ff;
    }
    
    .form-check-label {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0;
      line-height: 1.4;
    }
    
    .terms-link {
      color: #00d4ff;
      text-decoration: none;
    }
    
    .terms-link:hover {
      color: #0099cc;
      text-decoration: underline;
    }
    
    .btn-register {
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
    
    .btn-register:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
    
    .btn-register:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .register-footer {
      margin-top: 30px;
    }
    
    .login-link {
      color: #00d4ff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .login-link:hover {
      color: #0099cc;
      text-decoration: underline;
    }
    
    .register-footer p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
    }
    
    .alert {
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
    }
    
    .alert-danger {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
      color: #ff6b6b;
    }
    
    .alert-success {
      background: rgba(40, 167, 69, 0.1);
      border: 1px solid rgba(40, 167, 69, 0.3);
      color: #51cf66;
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
export class RegisterComponent {
  displayName = '';
  email = '';
  company = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading || this.password !== this.confirmPassword) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      await this.authService.register(this.email, this.password, this.displayName, this.company);
      this.successMessage = 'Conta criada com sucesso! Redirecionando...';
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este email já está em uso. Tente fazer login.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'Registro não permitido. Contate o administrador.';
      default:
        return 'Erro ao criar conta. Tente novamente.';
    }
  }
}