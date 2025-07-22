import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  username?: string;
  company?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  active?: boolean;
  isActive?: boolean;
  notes?: string;
  completedTrainings?: number;
  photoURL?: string;
  trainingAccess?: boolean;
  assignedTrainings?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    runInInjectionContext(this.injector, () => {
      authState(this.auth).pipe(
        switchMap(async (user) => {
          if (user) {
            const userProfile = await this.getUserProfile(user.uid);
            return userProfile;
          } else {
            return null;
          }
        })
      ).subscribe(userProfile => {
        this.currentUserSubject.next(userProfile);
      });
    });
  }

  async register(email: string, password: string, displayName: string, company?: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const credential = await createUserWithEmailAndPassword(this.auth, email, password);
        const userProfile: UserProfile = {
          uid: credential.user.uid,
          email: email,
          displayName: displayName,
          fullName: displayName,
          username: displayName.toLowerCase().replace(/\s+/g, ''),
          company: company || '',
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date(),
          active: true,
          trainingAccess: true,
          completedTrainings: 0
        };
        
        await setDoc(doc(this.firestore, 'users', credential.user.uid), userProfile);
        this.currentUserSubject.next(userProfile);
      } catch (error) {
        throw error;
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const credential = await signInWithEmailAndPassword(this.auth, email, password);
        const userProfile = await this.getUserProfile(credential.user.uid);
        
        // Atualizar último login
        const now = new Date();
        await updateDoc(doc(this.firestore, 'users', credential.user.uid), {
          lastLogin: now
        });
        
        // Atualizar o perfil local com o novo lastLogin
        if (userProfile) {
          userProfile.lastLogin = now;
        }
        
        this.currentUserSubject.next(userProfile);
        
        // Redirecionar baseado no role
        if (userProfile?.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      } catch (error) {
        throw error;
      }
    });
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  private async getUserProfile(uid: string): Promise<UserProfile | null> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const userDoc = await getDoc(doc(this.firestore, 'users', uid));
        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        return null;
      }
    });
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Métodos para admin
  async getAllUsers(): Promise<UserProfile[]> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const usersQuery = query(collection(this.firestore, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        return querySnapshot.docs.map(doc => doc.data() as UserProfile);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }
    });
  }

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await updateDoc(doc(this.firestore, 'users', uid), data);
        
        // Atualizar o perfil local se for o usuário atual
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.uid === uid) {
          const updatedUser = { ...currentUser, ...data };
          this.currentUserSubject.next(updatedUser);
        }
      } catch (error) {
        throw error;
      }
    });
  }

  async deleteUser(uid: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await deleteDoc(doc(this.firestore, 'users', uid));
      } catch (error) {
        throw error;
      }
    });
  }
}