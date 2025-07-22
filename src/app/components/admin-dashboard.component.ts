import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard-container">
      <div class="container-fluid">
        <!-- Cabeçalho -->
        <div class="dashboard-header">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="dashboard-title">
                <i class="fas fa-shield-alt me-3"></i>
                Painel Administrativo
              </h1>
              <p class="dashboard-subtitle">Gerencie usuários e monitore o sistema</p>
            </div>
            <div class="col-md-4 text-end">
              <div class="admin-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ totalUsers }}</span>
                  <span class="stat-label">Usuários</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ activeUsers }}</span>
                  <span class="stat-label">Ativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="row mb-4">
          <div class="col-12">
            <div class="quick-actions-card">
              <h3 class="card-title">
                <i class="fas fa-tools me-2"></i>
                Ações Rápidas
              </h3>
              <div class="row g-3">
                <div class="col-md-3">
                  <button class="btn btn-primary w-100" (click)="refreshUsers()">
                    <i class="fas fa-sync-alt me-2"></i>
                    Atualizar Lista
                  </button>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-success w-100" (click)="exportUsers()">
                    <i class="fas fa-download me-2"></i>
                    Exportar Dados
                  </button>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-info w-100" (click)="viewAnalytics()">
                    <i class="fas fa-chart-bar me-2"></i>
                    Relatórios
                  </button>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-warning w-100" (click)="systemSettings()">
                    <i class="fas fa-cog me-2"></i>
                    Configurações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gerenciamento de Usuários -->
        <div class="row">
          <div class="col-12">
            <div class="users-management-card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fas fa-users me-2"></i>
                  Gerenciamento de Usuários
                </h3>
                <div class="search-container">
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Buscar usuários..."
                      [(ngModel)]="searchTerm"
                      (input)="filterUsers()">
                    <button class="btn btn-outline-light" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="users-table-container">
                <div class="table-responsive">
                  <table class="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Função</th>
                        <th>Último Acesso</th>
                        <th>Treinamentos</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of filteredUsers; trackBy: trackByUserId">
                        <td>
                          <div class="user-avatar">
                            <img *ngIf="user.photoURL" [src]="user.photoURL" [alt]="user.displayName">
                            <div *ngIf="!user.photoURL" class="avatar-placeholder">
                              {{ getInitials(user.displayName || user.email) }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="user-name">
                            <strong>{{ user.displayName || 'Sem nome' }}</strong>
                            <small *ngIf="user.uid === currentUserId" class="badge bg-info ms-2">Você</small>
                          </div>
                        </td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span class="role-badge" [class]="'role-' + user.role">
                            {{ getRoleLabel(user.role) }}
                          </span>
                        </td>
                        <td>
                          <small>{{ formatLastLogin(user.lastLogin) }}</small>
                        </td>
                        <td>
                          <span class="training-count">{{ user.completedTrainings || 0 }}</span>
                        </td>
                        <td>
                          <div class="action-buttons">
                            <button 
                              class="btn btn-sm btn-outline-primary me-1" 
                              (click)="editUser(user)"
                              [disabled]="user.uid === currentUserId">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button 
                              class="btn btn-sm btn-outline-danger" 
                              (click)="confirmDeleteUser(user)"
                              [disabled]="user.uid === currentUserId || user.role === 'admin'">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div *ngIf="filteredUsers.length === 0" class="no-users">
                  <i class="fas fa-users-slash"></i>
                  <p>Nenhum usuário encontrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de Edição de Usuário -->
        <div class="modal-overlay" *ngIf="showEditModal" (click)="closeEditModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h4 class="modal-title">
                <i class="fas fa-user-edit me-2"></i>
                Editar Usuário
              </h4>
              <button class="btn-close" (click)="closeEditModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="modal-body" *ngIf="selectedUser">
              <form (ngSubmit)="saveUserChanges()" #editForm="ngForm">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Nome Completo</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="selectedUser.displayName"
                        name="displayName"
                        required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        [(ngModel)]="selectedUser.email"
                        name="email"
                        required
                        readonly>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Função</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="selectedUser.role"
                    name="role"
                    required>
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Observações</label>
                  <textarea 
                    class="form-control" 
                    rows="3" 
                    [(ngModel)]="selectedUser.notes"
                    name="notes"
                    placeholder="Adicione observações sobre este usuário..."></textarea>
                </div>
                
                <div class="modal-actions">
                  <button type="button" class="btn btn-secondary me-2" (click)="closeEditModal()">
                    Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="!editForm.form.valid || isSaving">
                    <span *ngIf="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal de Confirmação de Exclusão -->
        <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
          <div class="modal-content delete-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h4 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Confirmar Exclusão
              </h4>
              <button class="btn-close" (click)="closeDeleteModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="modal-body" *ngIf="userToDelete">
              <p class="warning-text">
                Tem certeza que deseja excluir o usuário <strong>{{ userToDelete.displayName || userToDelete.email }}</strong>?
              </p>
              <p class="warning-subtext">
                Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos.
              </p>
              
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary me-2" (click)="closeDeleteModal()">
                  Cancelar
                </button>
                <button type="button" class="btn btn-danger" (click)="deleteUser()" [disabled]="isDeleting">
                  <span *ngIf="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isDeleting ? 'Excluindo...' : 'Excluir Usuário' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
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
      background: linear-gradient(45deg, #ff6b6b, #ee5a52);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .dashboard-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
    }
    
    .admin-stats {
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
      color: #ff6b6b;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .quick-actions-card, .users-management-card {
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
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }
    
    .search-container {
      width: 300px;
    }
    
    .input-group .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px 0 0 12px;
      color: #fff;
    }
    
    .input-group .btn {
      border-radius: 0 12px 12px 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-left: none;
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #ff6b6b, #ee5a52);
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-success {
      background: linear-gradient(45deg, #51cf66, #40c057);
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
    }
    
    .btn-info {
      background: linear-gradient(45deg, #339af0, #228be6);
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
    }
    
    .btn-warning {
      background: linear-gradient(45deg, #ffd43b, #fab005);
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      color: #000;
    }
    
    .users-table-container {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      overflow: hidden;
    }
    
    .table {
      margin: 0;
      color: #fff;
    }
    
    .table th {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding: 15px;
      font-weight: 600;
      color: #fff;
    }
    
    .table td {
      border: none;
      padding: 15px;
      vertical-align: middle;
    }
    
    .table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #ff6b6b, #ee5a52);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .role-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .role-admin {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }
    
    .role-user {
      background: rgba(81, 207, 102, 0.2);
      color: #51cf66;
      border: 1px solid rgba(81, 207, 102, 0.3);
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .status-active {
      background: rgba(81, 207, 102, 0.2);
      color: #51cf66;
      border: 1px solid rgba(81, 207, 102, 0.3);
    }
    
    .status-inactive {
      background: rgba(134, 142, 150, 0.2);
      color: #868e96;
      border: 1px solid rgba(134, 142, 150, 0.3);
    }
    
    .training-count {
      font-weight: 600;
      color: #339af0;
    }
    
    .action-buttons {
      display: flex;
      gap: 5px;
    }
    
    .btn-sm {
      padding: 6px 12px;
      border-radius: 8px;
    }
    
    .no-users {
      text-align: center;
      padding: 50px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .no-users i {
      font-size: 3rem;
      margin-bottom: 15px;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: #1a1f3a;
      border-radius: 20px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
    }
    
    .btn-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    
    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .modal-body {
      padding: 30px;
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
    
    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: #fff;
      padding: 12px 16px;
    }
    
    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #ff6b6b;
      box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
      color: #fff;
    }
    
    .form-select option {
      background: #1a1f3a;
      color: #fff;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 12px;
      padding: 10px 20px;
    }
    
    .delete-modal .modal-content {
      max-width: 500px;
    }
    
    .warning-text {
      font-size: 1.1rem;
      margin-bottom: 15px;
    }
    
    .warning-subtext {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin-bottom: 25px;
    }
    
    .btn-danger {
      background: linear-gradient(45deg, #ff6b6b, #ee5a52);
      border: none;
      border-radius: 12px;
      padding: 10px 20px;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 2rem;
      }
      
      .admin-stats {
        justify-content: center;
        margin-top: 20px;
      }
      
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .search-container {
        width: 100%;
      }
      
      .modal-content {
        width: 95%;
        margin: 20px;
      }
      
      .table-responsive {
        font-size: 0.9rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  users: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  searchTerm = '';
  totalUsers = 0;
  activeUsers = 0;
  currentUserId = '';
  
  // Estados dos modais
  showEditModal = false;
  showDeleteModal = false;
  selectedUser: UserProfile | null = null;
  userToDelete: UserProfile | null = null;
  isSaving = false;
  isDeleting = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getCurrentUserId();
  }

  async loadUsers(): Promise<void> {
    try {
      this.users = await this.authService.getAllUsers();
      this.filteredUsers = [...this.users];
      this.updateStats();
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.users = [];
      this.filteredUsers = [];
      this.updateStats();
    }
  }

  private async getCurrentUserId(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser();
      this.currentUserId = user?.uid || '';
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
    }
  }

  private updateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.isActive).length;
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.displayName?.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  trackByUserId(index: number, user: UserProfile): string {
    return user.uid;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleLabel(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Usuário';
  }

  formatDate(date: Date | undefined | any): string {
    if (!date) return 'Nunca';
    
    let formattedDate: Date;
    
    // Tratar Timestamp do Firestore
    if (date && typeof date === 'object' && date.toDate) {
      formattedDate = date.toDate();
    } else if (date && typeof date === 'object' && date.seconds) {
      formattedDate = new Date(date.seconds * 1000);
    } else {
      formattedDate = new Date(date);
    }
    
    // Verificar se a data é válida
    if (isNaN(formattedDate.getTime())) {
      return 'Data inválida';
    }
    
    return formattedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatLastLogin(date: Date | undefined | any): string {
    if (!date) return 'Nunca';
    
    let loginDate: Date;
    
    if (date && typeof date === 'object' && date.toDate) {
      loginDate = date.toDate();
    } else if (date && typeof date === 'object' && date.seconds) {
      loginDate = new Date(date.seconds * 1000);
    } else {
      loginDate = new Date(date);
    }
    
    // Verifica se a data é válida
    if (isNaN(loginDate.getTime())) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - loginDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return loginDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  exportUsers(): void {
    const data = this.users.map(user => ({
      nome: user.displayName,
      email: user.email,
      funcao: this.getRoleLabel(user.role),
      status: (user.active || user.isActive) ? 'Ativo' : 'Inativo',
      treinamentos: user.completedTrainings || 0,
      ultimoAcesso: this.formatDate(user.lastLogin)
    }));
    
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'usuarios-cnv-training.csv');
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }

  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  viewAnalytics(): void {
    alert('Funcionalidade de relatórios será implementada em breve!');
  }

  systemSettings(): void {
    this.router.navigate(['/config-admin']);
  }

  // Gerenciamento de Usuários
  editUser(user: UserProfile): void {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.isSaving = false;
  }

  async saveUserChanges(): Promise<void> {
    if (!this.selectedUser) return;
    
    this.isSaving = true;
    try {
      await this.authService.updateUserProfile(this.selectedUser.uid, {
        displayName: this.selectedUser.displayName,
        role: this.selectedUser.role,
        notes: this.selectedUser.notes
      });
      
      // Atualiza dados locais
      const index = this.users.findIndex(u => u.uid === this.selectedUser!.uid);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
        this.filterUsers();
      }
      
      this.closeEditModal();
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Tente novamente.');
    } finally {
      this.isSaving = false;
    }
  }

  confirmDeleteUser(user: UserProfile): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.isDeleting = false;
  }

  async deleteUser(): Promise<void> {
    if (!this.userToDelete) return;
    
    this.isDeleting = true;
    try {
      await this.authService.deleteUser(this.userToDelete.uid);
      
      // Remove dos dados locais
      this.users = this.users.filter(u => u.uid !== this.userToDelete!.uid);
      this.filterUsers();
      this.updateStats();
      
      this.closeDeleteModal();
      alert('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário. Tente novamente.');
    } finally {
      this.isDeleting = false;
    }
  }
}