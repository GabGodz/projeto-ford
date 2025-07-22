import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="fas fa-robot me-2"></i>
          CNV.ia
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" *ngIf="!(currentUser$ | async)">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home me-1"></i>Início
              </a>
            </li>
            
            <li class="nav-item" *ngIf="!(currentUser$ | async)">
              <a class="nav-link" routerLink="/login" routerLinkActive="active">
                <i class="fas fa-sign-in-alt me-1"></i>Login
              </a>
            </li>
            
            <li class="nav-item" *ngIf="!(currentUser$ | async)">
              <a class="nav-link" routerLink="/register" routerLinkActive="active">
                <i class="fas fa-user-plus me-1"></i>Registro
              </a>
            </li>
            
            <!-- Menu para usuários logados -->
            <ng-container *ngIf="currentUser$ | async as user">
              <li class="nav-item">
                <a class="nav-link" 
                   [routerLink]="user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'" 
                   routerLinkActive="active">
                  <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                </a>
              </li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user me-1"></i>{{ user.displayName }}
                  <span class="badge bg-primary ms-1" *ngIf="user.role === 'admin'">Admin</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#"><i class="fas fa-user-cog me-2"></i>Perfil</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout()"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      backdrop-filter: blur(10px);
      background: rgba(17, 21, 38, 0.95) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav-link {
      transition: all 0.3s ease;
      border-radius: 8px;
      margin: 0 5px;
    }
    
    .nav-link:hover {
      background: rgba(0, 212, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .nav-link.active {
      background: linear-gradient(45deg, #00d4ff, #0099cc);
      color: white !important;
    }
    
    .dropdown-menu {
      background: rgba(17, 21, 38, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .dropdown-item {
      color: #fff;
      transition: all 0.3s ease;
    }
    
    .dropdown-item:hover {
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
    }
    
    .badge {
      font-size: 0.7rem;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<UserProfile | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}