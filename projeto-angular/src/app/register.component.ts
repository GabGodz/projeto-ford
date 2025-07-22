import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white/10 rounded-2xl p-8 border border-white/20">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Cadastro</h2>
          <p class="text-gray-300">Crie sua conta CNV</p>
        </div>
        
        <form (ngSubmit)="onRegister()" class="space-y-6">
          <div>
            <label for="fullName" class="block text-sm font-medium text-white mb-2">Nome Completo</label>
            <input
              type="text"
              id="fullName"
              [(ngModel)]="fullName"
              name="fullName"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu email"
            />
          </div>
          
          <div>
            <label for="username" class="block text-sm font-medium text-white mb-2">Usuário</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              name="username"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Escolha um nome de usuário"
            />
          </div>
          
          <div>
            <label for="company" class="block text-sm font-medium text-white mb-2">Empresa</label>
            <input
              type="text"
              id="company"
              [(ngModel)]="company"
              name="company"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da sua empresa"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-white mb-2">Senha</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirme sua senha"
            />
          </div>
          
          @if (errorMessage()) {
            <div class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p class="text-red-300 text-sm">{{ errorMessage() }}</p>
            </div>
          }
          
          @if (successMessage()) {
            <div class="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <p class="text-green-300 text-sm">{{ successMessage() }}</p>
            </div>
          }
          
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Cadastrar
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-300">
            Já tem uma conta?
            <button (click)="goToLogin()" class="text-blue-400 hover:text-blue-300 font-medium ml-1">
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fullName = '';
  email = '';
  username = '';
  company = '';
  password = '';
  confirmPassword = '';
  errorMessage = signal('');
  successMessage = signal('');
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  async onRegister() {
    this.errorMessage.set('');
    this.successMessage.set('');
    
    // Validações básicas
    if (!this.fullName || !this.email || !this.username || !this.company || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Todos os campos são obrigatórios');
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('As senhas não coincidem');
      return;
    }
    
    if (this.password.length < 4) {
      this.errorMessage.set('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    
    try {
      const result = await this.authService.register({
        fullName: this.fullName,
        username: this.username,
        email: this.email,
        company: this.company,
        password: this.password,
        role: 'user',
        trainingAccess: false
      });

      if (result.success) {
        this.successMessage.set('Cadastro realizado com sucesso! Redirecionando...');
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage.set(result.message);
      }
    } catch (error) {
      this.errorMessage.set('Erro interno do servidor!');
    }
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}