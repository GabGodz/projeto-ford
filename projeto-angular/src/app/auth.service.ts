import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface User {
  id?: string;
  username: string;
  email?: string;
  fullName?: string;
  company?: string;
  password?: string;
  role: 'admin' | 'user';
  trainingAccess: boolean;
  active?: boolean;
  createdAt?: Date;
  assignedTrainings?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Use Firebase Authentication only
      const result = await this.firebaseService.loginWithEmail(email, password);
      
      if (result.success && result.user) {
        const userData: any = result.userData || {};
        const user: User = {
          id: result.user.uid,
          username: userData.username || result.user.email?.split('@')[0] || 'user',
          email: result.user.email || '',
          fullName: userData.fullName || userData.username || 'Usuário',
          role: userData.role || 'user',
          trainingAccess: userData.trainingAccess || false,
          createdAt: userData.createdAt || new Date()
        };
        this.setCurrentUser(user);
        return { success: true, message: 'Login realizado com sucesso!', user };
      } else {
        return { success: false, message: result.error || 'Email ou senha incorretos!' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro interno do servidor!' };
    }
  }

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
    try {
      if (!userData.email || !userData.password) {
        return { success: false, message: 'Email e senha são obrigatórios!' };
      }

      // Use Firebase Authentication to create user
      const result = await this.firebaseService.registerWithEmail(
        userData.email,
        userData.password,
        {
          username: userData.username,
          fullName: userData.fullName,
          company: userData.company,
          role: userData.role || 'user'
        }
      );

      if (result.success) {
        return { success: true, message: 'Usuário cadastrado com sucesso!' };
      } else {
        return { success: false, message: result.error || 'Erro ao cadastrar usuário!' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Erro ao cadastrar usuário!' };
    }
  }

  private setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  async logout(): Promise<void> {
    try {
      await this.firebaseService.logout();
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase logout fails, clear local state
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }

  hasTrainingAccess(): boolean {
    const user = this.getCurrentUser();
    return user?.trainingAccess === true;
  }

  async refreshUserData(): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser?.id) {
        return;
      }

      // Buscar dados atualizados do usuário no Firebase
      const updatedUserData = await this.firebaseService.getDocument('users', currentUser.id) as any;
      
      if (updatedUserData) {
        const refreshedUser: User = {
          ...currentUser,
          trainingAccess: updatedUserData.trainingAccess || false,
          assignedTrainings: updatedUserData.assignedTrainings || [],
          active: updatedUserData.active || false
        };
        
        this.setCurrentUser(refreshedUser);
        console.log('Dados do usuário atualizados:', refreshedUser);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }
}