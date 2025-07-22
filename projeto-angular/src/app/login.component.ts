import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-xl">CNV</span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">Login</h2>
          <p class="text-gray-300">Acesse sua conta CNV Training</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu email"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
            >
          </div>

          <div *ngIf="errorMessage" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p class="text-red-300 text-sm">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            [disabled]="isLoading"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-300">
            Não tem uma conta?
            <button (click)="goToRegister()" class="text-blue-400 hover:text-blue-300 font-semibold ml-1">
              Cadastre-se
            </button>
          </p>
          <button (click)="goToHome()" class="text-gray-400 hover:text-gray-300 text-sm mt-2">
            ← Voltar ao início
          </button>
        </div>


      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.login(this.email, this.password);
      
      if (result.success && result.user) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/dashboard-user']);
        }
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Erro interno do servidor!';
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}